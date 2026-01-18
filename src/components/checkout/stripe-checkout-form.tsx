import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface StripeCheckoutFormProps {
  clientSecret: string;
  planType: string;
}

export function StripeCheckoutForm({ planType }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;
  }, [stripe, planType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred");
        toast.error(error.message || "Payment failed");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
        }}
      />

      {errorMessage && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full bg-blue-600 text-base text-white hover:bg-blue-700"
        disabled={!stripe || isProcessing}
      >
        <Lock className="mr-2 h-4 w-4" />
        {isProcessing ? "Processing..." : "Complete payment"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By completing this purchase you agree to our terms of service. Your
        payment information is encrypted and secure.
      </p>
    </form>
  );
}
