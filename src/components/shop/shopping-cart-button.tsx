import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCartSheet } from "@/components/shop/shopping-cart-sheet";

interface ShoppingCartButtonProps {
  className?: string;
}

const ShoppingCartButton = ({ className }: ShoppingCartButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("inline-flex", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative gap-2"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="size-4" />
        <span className="hidden sm:inline">Kosik</span>
      </Button>
      <ShoppingCartSheet open={open} onOpenChange={setOpen} />
    </div>
  );
};

export { ShoppingCartButton };
