import { cn } from "@/lib/utils";

interface PriceProps {
  onSale?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Price = ({ className, children }: PriceProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
};

interface PriceValueProps {
  price?: number;
  currency: string;
  variant: "regular" | "sale";
  className?: string;
}

const PriceValue = ({ price, currency, variant, className }: PriceValueProps) => {
  if (price === undefined) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);

  return (
    <span
      className={cn(
        variant === "regular" && "text-muted-foreground line-through",
        variant === "sale" && "font-bold",
        className
      )}
    >
      {formattedPrice}
    </span>
  );
};

export { Price, PriceValue };
