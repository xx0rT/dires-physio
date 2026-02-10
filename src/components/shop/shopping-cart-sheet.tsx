import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Fragment, memo, useCallback, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import z from "zod";

import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

type CartItemData = {
  product_id: string;
  link: string;
  name: string;
  image: string;
  price: ProductPrice;
  details: { label: string; value: string }[];
};

const cartFormSchema = z.object({
  products: z
    .object({
      product_id: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
    .array(),
  promoCode: z.string().optional(),
});

type CartFormType = z.infer<typeof cartFormSchema>;

const CART_ITEMS: CartItemData[] = [
  {
    product_id: "product-1",
    link: "#",
    name: "Stylish Maroon Sneaker",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/stylish-maroon-sneaker.png",
    price: { regular: 354.0, currency: "USD" },
    details: [
      { label: "Color", value: "Red" },
      { label: "Size", value: "36" },
    ],
  },
  {
    product_id: "product-2",
    link: "#",
    name: "Bicolor Sweatshirt with Embroidered Logo",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/bicolor-crewneck-sweatshirt-with-embroidered-logo.png",
    price: { regular: 499.0, currency: "USD" },
    details: [
      { label: "Color", value: "Blue & White" },
      { label: "Size", value: "L" },
    ],
  },
  {
    product_id: "product-3",
    link: "#",
    name: "Black Hoodie",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/black-hoodie-against-light-background.png",
    price: { regular: 84.0, currency: "USD" },
    details: [
      { label: "Color", value: "Black" },
      { label: "Size", value: "XL" },
    ],
  },
  {
    product_id: "product-4",
    link: "#",
    name: "Maroon Leather Handbag",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/maroon-leather-handbag.png",
    price: { regular: 245.0, currency: "USD" },
    details: [{ label: "Color", value: "Maroon" }],
  },
  {
    product_id: "product-5",
    link: "#",
    name: "Classic Fedora Hat",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-1.png",
    price: { regular: 499.0, currency: "USD" },
    details: [{ label: "Color", value: "Beige" }],
  },
];

interface ShoppingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems?: CartItemData[];
}

const ShoppingCartSheet = ({
  open,
  onOpenChange,
  cartItems = CART_ITEMS,
}: ShoppingCartSheetProps) => {
  const defaultProducts = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: 1,
    price: item.price.sale ?? item.price.regular,
  }));

  const form = useForm<CartFormType>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: { products: defaultProducts, promoCode: "" },
  });

  const { fields, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const formItems = form.watch("products");
  const subtotal = formItems?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  const itemsCount = formItems?.length ?? 0;

  const [promoApplied, setPromoApplied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const discount = promoApplied ? 20 : 0;
  const total = (subtotal ?? 0) - discount;

  const onSubmit = (data: CartFormType) => {
    console.log(data);
  };

  const handleRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove],
  );

  const handleQuantityChange = useCallback(
    (index: number, delta: number) => {
      const current = fields[index];
      const newQty = Math.max(1, (formItems?.[index]?.quantity ?? 1) + delta);
      update(index, { ...current, quantity: newQty });
    },
    [update, fields, formItems],
  );

  const handleApplyPromo = () => {
    const code = form.getValues("promoCode");
    if (code && code.trim().length > 0) {
      setPromoApplied(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        className="flex w-[92dvw] flex-col gap-0 p-0 sm:max-w-[28rem] lg:max-w-[32rem] [&>button]:hidden"
      >
        <SheetHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
          <SheetTitle className="text-lg font-semibold">
            Shopping Cart
            {itemsCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({itemsCount} {itemsCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="size-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {itemsCount === 0 ? (
          <EmptyCartState onClose={() => onOpenChange(false)} />
        ) : (
          <Fragment>
            <form
              className="flex flex-1 flex-col overflow-hidden"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex-1 overflow-auto px-5 py-4">
                <ul className="space-y-4">
                  {fields.map((field, index) => {
                    const cartItem = cartItems.find(
                      (p) => p.product_id === field.product_id,
                    );
                    if (!cartItem) return null;
                    return (
                      <li key={field.id}>
                        <CartItemRow
                          item={cartItem}
                          quantity={formItems?.[index]?.quantity ?? 1}
                          onRemove={() => handleRemove(index)()}
                          onIncrement={() => handleQuantityChange(index, 1)}
                          onDecrement={() => handleQuantityChange(index, -1)}
                        />
                        {index < fields.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <SheetFooter className="mt-0 block border-t px-5 py-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Controller
                        control={form.control}
                        name="promoCode"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Promo code"
                            className="pl-9"
                            disabled={promoApplied}
                          />
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>

                  {promoApplied && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Promo discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal?.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-muted-foreground">
                        Calculated at checkout
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-1">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-base font-semibold">
                        ${total.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                      }
                    />
                    <Label
                      htmlFor="terms"
                      className="text-xs leading-normal text-muted-foreground"
                    >
                      I agree to the terms and conditions and the return policy
                    </Label>
                  </div>

                  <Button
                    size="lg"
                    className="w-full gap-2"
                    type="submit"
                    disabled={!agreedToTerms}
                  >
                    Checkout
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Fragment>
        )}
      </SheetContent>
    </Sheet>
  );
};

const EmptyCartState = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="size-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground">
          Looks like you haven't added any items yet. Browse our store and find
          something you love.
        </p>
      </div>
      <Button onClick={onClose} className="gap-2">
        Continue Shopping
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};

const CartItemRow = memo(
  ({
    item,
    quantity,
    onRemove,
    onIncrement,
    onDecrement,
  }: {
    item: CartItemData;
    quantity: number;
    onRemove: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
  }) => {
    const { regular, sale, currency } = item.price;

    return (
      <div className="flex gap-4">
        <div className="w-20 shrink-0">
          <a href={item.link}>
            <AspectRatio
              ratio={3 / 4}
              className="overflow-hidden rounded-lg bg-muted"
            >
              <img
                src={item.image}
                alt={item.name}
                className="block size-full object-cover object-center"
              />
            </AspectRatio>
          </a>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-1">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-tight">
              <a
                href={item.link}
                className="transition-colors hover:text-foreground/80"
              >
                {item.name}
              </a>
            </h4>
            <ul className="flex flex-wrap gap-x-3 gap-y-0.5">
              {item.details.map((detail, i) => (
                <li key={`detail-${i}`} className="text-xs text-muted-foreground">
                  {detail.label}: {detail.value}
                </li>
              ))}
            </ul>
            <Price
              onSale={sale != null}
              className="gap-x-1.5 text-sm font-medium"
            >
              <PriceValue price={sale} currency={currency} variant="sale" />
              <PriceValue
                price={regular}
                currency={currency}
                variant="regular"
              />
            </Price>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-lg border">
              <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 1}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="flex w-8 items-center justify-center text-sm font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

export { ShoppingCartSheet };
