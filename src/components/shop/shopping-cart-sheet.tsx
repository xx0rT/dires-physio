import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { ChevronUp, ShoppingBag, TicketPercent, X } from "lucide-react";
import { Fragment, memo, useCallback, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import z from "zod";

import { Price, PriceValue } from "@/components/shadcnblocks/price";
import QuantityInput from "@/components/shadcnblocks/quantity-input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
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
  details: {
    label: string;
    value: string;
  }[];
};

type SuggestedProduct = {
  name: string;
  image: string;
  price: ProductPrice;
  link: string;
};

const cartFormSchema = z.object({
  products: z
    .object({
      product_id: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
    .array(),
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

const SUGGESTED_PRODUCTS: SuggestedProduct[] = [
  {
    name: "White T-shirt",
    link: "#",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Tattooed-Streetwear-Look-2.png",
    price: { regular: 88.0, currency: "USD" },
  },
  {
    name: "Urban Classic Hoodie",
    link: "#",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Man-in-White-Hoodie-2.png",
    price: { regular: 499.0, currency: "USD" },
  },
  {
    name: "Streetline Hoodie",
    link: "#",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Young-Man-in-Blue-Hoodie-2.png",
    price: { regular: 499.0, currency: "USD" },
  },
  {
    name: "Heritage Street Hoodie",
    link: "#",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Young-Man-in-Maroon-Hoodie-2.png",
    price: { regular: 499.0, currency: "USD" },
  },
];

interface ShoppingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems?: CartItemData[];
  suggestedProducts?: SuggestedProduct[];
}

interface CartItemRowProps extends CartItemData {
  index: number;
  form: ReturnType<typeof useForm<CartFormType>>;
  onRemoveClick: () => void;
  onQuantityChange: (newQty: number) => void;
}

interface CartItemActionsProps {
  index: number;
  form: ReturnType<typeof useForm<CartFormType>>;
  onRemoveClick: () => void;
  onQuantityChange: (newQty: number) => void;
}

const ShoppingCartSheet = ({
  open,
  onOpenChange,
  cartItems = CART_ITEMS,
  suggestedProducts = SUGGESTED_PRODUCTS,
}: ShoppingCartSheetProps) => {
  const defaultProducts = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: 1,
    price: item.price.sale ?? item.price.regular,
  }));

  const form = useForm<CartFormType>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: { products: defaultProducts },
  });

  const { fields, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const formItems = form.watch("products");
  const totalPrice = formItems?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  const itemsCount = formItems?.length ?? 0;

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
    (index: number) => (newQty: number) =>
      update(index, { ...fields[index], quantity: newQty }),
    [update, fields],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        className="w-[90dvw] gap-0 p-0 sm:max-w-[30rem] lg:max-w-[37.5rem] [&>button]:hidden"
      >
        {itemsCount === 0 && (
          <div className="absolute end-5 top-5">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="size-6" />
              </Button>
            </SheetClose>
          </div>
        )}
        {itemsCount > 0 && (
          <Fragment>
            <SheetHeader className="flex flex-row items-center justify-between gap-4 bg-black px-3 py-3 md:px-5 lg:px-7">
              <SheetTitle className="text-lg font-medium text-white">
                Cart ({itemsCount})
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="h-full overflow-auto px-3 py-4 md:px-5 lg:px-7">
                <ul className="space-y-5">
                  {fields.map((field, index) => {
                    const cartItem = cartItems.find(
                      (p) => p.product_id === field.product_id,
                    );
                    if (!cartItem) return null;
                    return (
                      <li key={field.id}>
                        <CartItemRow
                          {...cartItem}
                          form={form}
                          onRemoveClick={() => handleRemove(index)()}
                          onQuantityChange={(newQty: number) =>
                            handleQuantityChange(index)(newQty)
                          }
                          index={index}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <SuggestedProducts products={suggestedProducts} />
              <SheetFooter className="mt-0 block border-t px-3 py-2.5 md:px-5 lg:px-7">
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <TicketPercent className="size-4" />
                      <p className="text-xs leading-normal font-medium">
                        FIRST10 (-$20.00)
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <div className="text-sm font-medium">Shipping</div>
                      <div className="text-sm font-medium">
                        Spent more <b>$150.00 USD</b>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="text-base leading-none font-medium">
                      Total
                    </h3>
                    <div className="text-lg leading-none font-medium">
                      ${totalPrice} USD
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 rounded-full"
                      type="submit"
                    >
                      Checkout
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 rounded-full"
                      type="button"
                    >
                      View Cart
                    </Button>
                  </div>
                  <small className="leading-normal font-medium text-muted-foreground">
                    Taxes, discounts and shipping calculated at checkout
                  </small>
                </div>
              </SheetFooter>
            </form>
          </Fragment>
        )}
      </SheetContent>
    </Sheet>
  );
};

const CartItemRow = ({
  image,
  name,
  link,
  details,
  price,
  index,
  form,
  onRemoveClick,
  onQuantityChange,
}: CartItemRowProps) => {
  const { regular, sale, currency } = price;

  return (
    <div className="flex gap-4">
      <div className="w-20 shrink-0 lg:w-28">
        <a href={link}>
          <AspectRatio
            ratio={0.833353128}
            className="overflow-hidden rounded-md"
          >
            <img
              src={image}
              alt={name}
              className="block size-full object-cover object-center"
            />
          </AspectRatio>
        </a>
      </div>
      <div className="max-sm:space-y-2.5 sm:contents">
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium transition-colors hover:text-foreground/80 lg:text-base">
            <a href={link}>{name}</a>
          </h4>
          <ul className="flex flex-wrap gap-3">
            {details.map((item, i) => (
              <li key={`product-details-${i}`}>
                <dl className="text-sm font-medium">
                  <dt className="inline">{item.label}: </dt>
                  <dd className="inline text-muted-foreground">{item.value}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <div className="pt-1.5">
            <Price
              onSale={sale != null}
              className="gap-x-1 text-base font-medium"
            >
              <PriceValue price={sale} currency={currency} variant="sale" />
              <PriceValue
                price={regular}
                currency={currency}
                variant="regular"
              />
            </Price>
          </div>
        </div>
        <CartItemActions
          form={form}
          onRemoveClick={onRemoveClick}
          index={index}
          onQuantityChange={onQuantityChange}
        />
      </div>
    </div>
  );
};

const CartItemActions = memo(
  ({ onRemoveClick, index, form, onQuantityChange }: CartItemActionsProps) => {
    return (
      <div className="flex flex-col justify-between gap-4 sm:items-end">
        <Button
          variant="link"
          type="button"
          className="h-fit w-fit px-0 py-0 text-muted-foreground hover:underline"
          onClick={onRemoveClick}
        >
          Remove
        </Button>
        <div>
          <QuantityField
            form={form}
            index={index}
            onQuantityChange={onQuantityChange}
          />
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.onRemoveClick !== next.onRemoveClick &&
    prev.onQuantityChange !== next.onQuantityChange,
);

const QuantityField = memo(
  ({
    form,
    index,
    onQuantityChange,
  }: {
    form: ReturnType<typeof useForm<CartFormType>>;
    index: number;
    onQuantityChange: (n: number) => void;
  }) => {
    return (
      <Controller
        control={form.control}
        name={`products.${index}.quantity`}
        render={({ field }) => (
          <Field className="gap-3">
            <div className="w-full max-w-28">
              <QuantityInput
                inputProps={field}
                onValueChange={(newQty) => {
                  field.onChange(newQty);
                  onQuantityChange(newQty);
                }}
              />
            </div>
          </Field>
        )}
      />
    );
  },
);

const ProductCard = ({ image, name, price, link }: SuggestedProduct) => {
  const { regular, sale, currency } = price;

  return (
    <Card className="h-full p-0">
      <CardContent className="flex gap-2.5 p-2.5">
        <div className="w-20 shrink-0">
          <a href={link}>
            <AspectRatio ratio={0.8} className="overflow-hidden rounded-xl">
              <img
                src={image}
                alt={name}
                className="block size-full object-cover object-center"
              />
            </AspectRatio>
          </a>
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            <a
              href={link}
              className="inline-block text-sm leading-snug font-medium transition-colors duration-300 hover:text-rose-600 md:text-base"
            >
              {name}
            </a>
            <div className="space-y-2">
              <Price
                onSale={sale != null}
                className="gap-x-1 text-sm font-medium sm:text-base"
              >
                <PriceValue price={sale} currency={currency} variant="sale" />
                <PriceValue
                  price={regular}
                  currency={currency}
                  variant="regular"
                />
              </Price>
              <Button size="icon" className="rounded-full">
                <ShoppingBag className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SuggestedProducts = ({
  products,
}: {
  products: SuggestedProduct[];
}) => {
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  if (!products) return null;

  return (
    <Collapsible
      open={suggestionsOpen}
      onOpenChange={setSuggestionsOpen}
      className="border-t"
    >
      <CollapsibleTrigger className="flex w-full justify-between px-3 pt-4 pb-3 md:px-5 lg:px-7">
        <h3 className="text-sm leading-relaxed font-medium uppercase">
          Suggested for you
        </h3>
        <ChevronUp
          className={clsx(
            "size-4 stroke-muted-foreground transition-transform duration-300",
            suggestionsOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-4 md:px-5 lg:px-7">
        <div className="-mx-3 md:-mx-5 lg:-mx-7">
          <div className="overflow-hidden px-7">
            <Carousel
              opts={{ align: "start" }}
              className="[&>div]:overflow-visible"
            >
              <CarouselContent>
                {products.map((product, index) => (
                  <CarouselItem
                    className="basis-[75dvw] sm:basis-[24rem]"
                    key={`product-img-${index}`}
                  >
                    <ProductCard {...product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { ShoppingCartSheet };
