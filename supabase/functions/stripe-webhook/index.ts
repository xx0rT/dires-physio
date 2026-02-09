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
    const signature = req.headers.get("stripe-signature");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing signature or webhook secret");
    }

    const body = await req.text();
    const event = JSON.parse(body);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.metadata?.type === "course_purchase") {
          const { userId: cpUserId, courseId } = session.metadata;
          if (cpUserId && courseId) {
            const amountPaid = (session.amount_total || 0) / 100;
            const { error: purchaseError } = await supabase
              .from("course_purchases")
              .insert({
                user_id: cpUserId,
                course_id: courseId,
                stripe_payment_intent_id: session.payment_intent,
                amount_paid: amountPaid,
              });

            if (purchaseError) {
              console.error("Error recording course purchase:", purchaseError);
            }

            const { error: enrollError } = await supabase
              .from("course_enrollments")
              .upsert({
                user_id: cpUserId,
                course_id: courseId,
              }, { onConflict: "user_id,course_id", ignoreDuplicates: true });

            if (enrollError) {
              console.error("Error creating enrollment:", enrollError);
            }

            const { data: userData } = await supabase.auth.admin.getUserById(cpUserId);
            const { data: courseData } = await supabase
              .from("courses")
              .select("title")
              .eq("id", courseId)
              .maybeSingle();

            if (userData && courseData) {
              const userEmail = userData.user?.email || session.customer_details?.email || "customer@example.com";
              const userName = userData.user?.user_metadata?.name || session.customer_details?.name || "Customer";
              const courseTitle = courseData.title;

              console.log("📧 Attempting to send course purchase invoice to:", userEmail);
              try {
                const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-invoice-email`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    customerEmail: userEmail,
                    customerName: userName,
                    planType: "course",
                    planName: courseTitle,
                    amount: amountPaid,
                    currency: session.currency || "czk",
                    orderNumber: `ORD-${Date.now()}`,
                    orderDate: new Date().toLocaleDateString('cs-CZ'),
                  }),
                });

                if (!emailResponse.ok) {
                  const errorText = await emailResponse.text();
                  console.error("❌ Course purchase invoice email API returned error:", errorText);
                } else {
                  console.log("✅ Course purchase invoice email sent successfully");
                }
              } catch (emailError) {
                console.error("❌ Error sending course purchase invoice email (non-fatal):", emailError);
              }
            }
          }
          break;
        }

        const { planType, promoCode, userEmail, userName } = session.metadata;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        let userId = session.client_reference_id;

        console.log("🔔 Checkout completed - Full session data:", {
          userId,
          planType,
          customerId,
          subscriptionId,
          userEmail,
          userName,
          metadata: session.metadata
        });

        if (!userId && userEmail) {
          console.log("⚠️ No client_reference_id, attempting to find user by email:", userEmail);
          try {
            const { data: { user } } = await supabase.auth.admin.getUserByEmail(userEmail);
            if (user) {
              userId = user.id;
              console.log("✅ Found user ID from email:", userId);
            }
          } catch (lookupError) {
            console.error("❌ Error looking up user by email:", lookupError);
          }
        }

        if (!userId) {
          console.error("❌ No user ID found - cannot create subscription", {
            client_reference_id: session.client_reference_id,
            userEmail,
            session_id: session.id
          });
          break;
        }

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

        const { data: existingSub } = await supabase
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

        let subscription;
        if (existingSub) {
          console.log("🔄 Updating existing subscription for user:", userId);
          const { data, error } = await supabase
            .from("subscriptions")
            .update(subscriptionData)
            .eq("user_id", userId)
            .select()
            .maybeSingle();

          if (error) {
            console.error("❌ Error updating subscription:", error, {
              userId,
              subscriptionData
            });
            throw error;
          }
          subscription = data;
          console.log("✅ Subscription updated successfully:", subscription);
        } else {
          console.log("➕ Creating new subscription for user:", userId);
          const { data, error } = await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              ...subscriptionData,
            })
            .select()
            .maybeSingle();

          if (error) {
            console.error("❌ Error creating subscription:", error, {
              userId,
              subscriptionData
            });
            throw error;
          }
          subscription = data;
          console.log("✅ Subscription created successfully:", subscription);
        }

        const planNames = {
          free_trial: "Zkušební verze zdarma",
          monthly: "Měsíční plán",
          lifetime: "Doživotní přístup"
        };

        const amount = session.amount_total / 100;

        console.log("📧 Attempting to send invoice email to:", userEmail);
        try {
          const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-invoice-email`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerEmail: userEmail || "customer@example.com",
              customerName: userName || "Customer",
              planType: planType,
              planName: planNames[planType as keyof typeof planNames] || planType,
              amount: amount,
              currency: session.currency || "usd",
              orderNumber: `ORD-${Date.now()}`,
              orderDate: new Date().toLocaleDateString('cs-CZ'),
            }),
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error("❌ Invoice email API returned error:", errorText);
          } else {
            console.log("✅ Invoice email sent successfully");
          }
        } catch (emailError) {
          console.error("❌ Error sending invoice email (non-fatal):", emailError);
        }

        if (promoCode && subscription) {
          const { data: promoData } = await supabase
            .from("promo_codes")
            .select("id, current_uses")
            .eq("code", promoCode)
            .single();

          if (promoData) {
            await supabase.from("promo_codes").update({
              current_uses: (promoData.current_uses || 0) + 1,
            }).eq("id", promoData.id);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
