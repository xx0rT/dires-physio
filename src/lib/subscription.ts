import { supabase } from "./supabase";

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: "free_trial" | "monthly" | "lifetime";
  status: "active" | "cancelled" | "expired" | "trialing";
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  created_at: string;
  updated_at: string;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data;
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;

  if (!subscription.current_period_end) {
    return subscription.status === "active" || subscription.status === "trialing";
  }

  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);

  return (
    (subscription.status === "active" || subscription.status === "trialing") &&
    periodEnd > now
  );
}

export function getSubscriptionLabel(subscription: Subscription | null): string {
  if (!subscription) return "No Subscription";

  switch (subscription.plan_type) {
    case "free_trial":
      return "Free Trial";
    case "monthly":
      return "Monthly Plan";
    case "lifetime":
      return "Lifetime Access";
    default:
      return "Unknown Plan";
  }
}

export function getRemainingTrialDays(subscription: Subscription | null): number {
  if (!subscription || subscription.plan_type !== "free_trial") return 0;

  if (!subscription.current_period_end) return 0;

  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);
  const diffTime = periodEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

export function getRemainingSubscriptionTime(subscription: Subscription | null): {
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
} {
  if (!subscription || !subscription.current_period_end) {
    return { days: 0, hours: 0, minutes: 0, totalDays: 0 };
  }

  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);
  const diffTime = Math.max(0, periodEnd.getTime() - now.getTime());

  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, totalDays };
}

export function formatSubscriptionRemainingTime(subscription: Subscription | null): string {
  if (!subscription || !subscription.current_period_end) return "";

  const time = getRemainingSubscriptionTime(subscription);

  if (time.totalDays > 1) {
    return `${time.totalDays} ${time.totalDays === 1 ? 'den' : time.totalDays < 5 ? 'dny' : 'dní'}`;
  } else if (time.days === 1) {
    return `1 den ${time.hours} hodin`;
  } else if (time.hours > 0) {
    return `${time.hours} ${time.hours === 1 ? 'hodina' : time.hours < 5 ? 'hodiny' : 'hodin'}`;
  } else {
    return `${time.minutes} ${time.minutes === 1 ? 'minuta' : time.minutes < 5 ? 'minuty' : 'minut'}`;
  }
}
