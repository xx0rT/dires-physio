import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body.sessionId;

    if (!sessionId || sessionId === 'undefined') {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No session ID or authorization provided");
      }

      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const userResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
        headers: {
          Authorization: authHeader,
          apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user");
      }

      const user = await userResponse.json();

      const { data: subscription } = await supabaseClient
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          success: true,
          subscription: subscription,
          hasActivePremium:
            subscription &&
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            subscription.plan_type !== 'free_trial' &&
            subscription.stripe_subscription_id != null
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("🔍 Verifying Stripe session:", sessionId);

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!stripeResponse.ok) {
      throw new Error("Failed to retrieve Stripe session");
    }

    const session = await stripeResponse.json();
    console.log("✅ Retrieved Stripe session:", {
      id: session.id,
      payment_status: session.payment_status,
      customer: session.customer,
      subscription: session.subscription,
      metadata: session.metadata,
      client_reference_id: session.client_reference_id
    });

    let userId = session.client_reference_id;
    const { userEmail } = session.metadata;

    if (!userId && userEmail) {
      console.log("⚠️ No client_reference_id, attempting to find user by email:", userEmail);
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      try {
        const { data: { user } } = await supabaseClient.auth.admin.getUserByEmail(userEmail);
        if (user) {
          userId = user.id;
          console.log("✅ Found user ID from email:", userId);
        }
      } catch (lookupError) {
        console.error("❌ Error looking up user by email:", lookupError);
      }
    }

    if (!userId) {
      throw new Error("Could not determine user ID from Stripe session");
    }

    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const { planType } = session.metadata;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      const periodStart = new Date();
      const periodEnd = new Date();
      if (planType === "free_trial") {
        periodEnd.setDate(periodEnd.getDate() + 3);
      } else if (planType === "monthly") {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else if (planType === "lifetime") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 100);
      }

      const subscriptionStatus = planType === "free_trial" ? "trialing" : "active";

      const { data: existingSub } = await supabaseClient
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const subscriptionData = {
        plan_type: planType,
        status: subscriptionStatus,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId || `one_time_${Date.now()}`,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingSub) {
        console.log("🔄 Updating existing subscription for user:", userId);
        const { error } = await supabaseClient
          .from("subscriptions")
          .update(subscriptionData)
          .eq("user_id", userId);

        if (error) {
          console.error("❌ Error updating subscription:", error);
          throw error;
        }
        console.log("✅ Subscription updated successfully");
      } else {
        console.log("➕ Creating new subscription for user:", userId);
        const { error } = await supabaseClient
          .from("subscriptions")
          .insert({
            user_id: userId,
            ...subscriptionData,
          });

        if (error) {
          console.error("❌ Error creating subscription:", error);
          throw error;
        }
        console.log("✅ Subscription created successfully");
      }

      const { data: subscription } = await supabaseClient
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const planNames: Record<string, string> = {
        "free_trial": "Zkušební verze zdarma",
        "monthly": "Měsíční plán",
        "lifetime": "Doživotní přístup"
      };

      const planPrices: Record<string, number> = {
        "free_trial": 0,
        "monthly": 299,
        "lifetime": 2999
      };

      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-invoice-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            customerEmail: userEmail || "customer@example.com",
            customerName: userEmail?.split("@")[0] || "Zákazník",
            planType: planType,
            planName: planNames[planType] || planType,
            amount: planPrices[planType] || 0,
            currency: "CZK",
            orderNumber: `ORD-${Date.now()}`,
            orderDate: new Date().toLocaleDateString('cs-CZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
          }),
        });
        console.log("✅ Invoice email sent successfully");
      } catch (emailError) {
        console.error("⚠️ Failed to send invoice email:", emailError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          subscription: subscription,
          hasActivePremium:
            subscription &&
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            subscription.plan_type !== 'free_trial' &&
            subscription.stripe_subscription_id != null
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
