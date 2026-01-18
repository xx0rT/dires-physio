import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StripeCheckoutForm } from "@/components/checkout/stripe-checkout-form";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

interface OrderSummary {
  companyName: string;
  planType?: "free_trial" | "monthly" | "lifetime";
  items: OrderItem[];
  currency: string;
}

interface CheckoutPageProps {
  className?: string;
}

const DEFAULT_ORDER: OrderSummary = {
  companyName: "Fyzioterapie Kurzy",
  planType: "monthly",
  items: [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: 30.0,
    },
  ],
  currency: "USD",
};

const CheckoutPage = ({ className }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();
  const orderData = (location.state as { order?: OrderSummary })?.order || DEFAULT_ORDER;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [validatedPromo, setValidatedPromo] = useState<{code: string; type: string; value: number} | null>(null);

  const subtotal = orderData.items.reduce((sum, item) => sum + item.price, 0);
  const total = Math.max(0, subtotal - promoDiscount);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  };

  const validatePromoCode = async (code: string) => {
    if (!code || !orderData.planType || !session) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-promo-code`;
      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: code.toUpperCase(),
          planType: orderData.planType,
        }),
      });

      const data = await response.json();

      if (data.valid && data.promo) {
        const discount = data.promo.discountType === 'percentage'
          ? Math.floor((subtotal * data.promo.discountValue) / 100)
          : data.promo.discountValue;

        setPromoDiscount(discount);
        setValidatedPromo({
          code: data.promo.code,
          type: data.promo.discountType,
          value: data.promo.discountValue,
        });
        toast.success(`Promo code applied! $${discount} discount`);
      } else {
        setPromoDiscount(0);
        setValidatedPromo(null);
        toast.error(data.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      toast.error('Failed to validate promo code');
    }
  };

  const createPaymentIntent = async () => {
    if (!user || !session) {
      toast.error("Please sign in to continue");
      navigate("/sign-in");
      return;
    }

    if (orderData.planType === "free_trial") {
      setIsLoading(true);
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`;
        const headers = {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            planType: "free_trial",
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to start trial');
        }

        toast.success("Free trial activated!");
        navigate("/order-confirmation");
      } catch (error) {
        console.error('Trial activation error:', error);
        toast.error('Failed to activate trial');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`;
      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planType: orderData.planType,
          promoCode: validatedPromo?.code || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment intent error:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderData.planType !== "free_trial") {
      createPaymentIntent();
    }
  }, []);

  return (
    <section className={cn("min-h-screen bg-background", className)}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="border-r border-border bg-muted/20 p-8 pt-32 lg:p-12 lg:pt-40 xl:p-16 xl:pt-48">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Checkout
                </h1>
                <p className="text-sm text-muted-foreground">
                  Complete your purchase
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">{orderData.companyName}</p>
                <p className="text-4xl font-semibold tracking-tight">
                  {formatPrice(total, orderData.currency)}
                </p>
              </div>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-foreground">
                      {formatPrice(item.price, orderData.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Subtotal</span>
                <span className="text-sm text-foreground">
                  {formatPrice(subtotal, orderData.currency)}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="h-9 flex-1 text-sm uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => validatePromoCode(promoCode)}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-sm">Discount ({validatedPromo?.code})</span>
                  <span className="text-sm">
                    -{formatPrice(promoDiscount, orderData.currency)}
                  </span>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(total, orderData.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-32 lg:p-12 lg:pt-40 xl:p-16 xl:pt-48">
          <div className="mx-auto w-full max-w-md">
            {orderData.planType === "free_trial" ? (
              <div className="space-y-6">
                <div className="rounded-lg bg-blue-500/10 p-6 text-center">
                  <h3 className="text-lg font-semibold">Start Your Free Trial</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get 3 days of full access - no payment required
                  </p>
                </div>
                <Button
                  size="lg"
                  className="h-12 w-full bg-blue-600 text-base text-white hover:bg-blue-700"
                  onClick={createPaymentIntent}
                  disabled={isLoading}
                >
                  {isLoading ? "Activating..." : "Start Free Trial"}
                </Button>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-pulse text-center">
                      <p className="text-sm text-muted-foreground">
                        Loading payment form...
                      </p>
                    </div>
                  </div>
                )}

                {!isLoading && clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#2563eb",
                        },
                      },
                    }}
                  >
                    <StripeCheckoutForm
                      clientSecret={clientSecret}
                      planType={orderData.planType || "monthly"}
                    />
                  </Elements>
                )}
              </>
            )}

            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground hover:underline">
                Terms
              </a>
              <span>·</span>
              <a href="#" className="hover:text-foreground hover:underline">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
