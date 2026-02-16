import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, ShoppingCart, Trash } from "lucide-react";
import { useCallback } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useCart } from "@/lib/cart-context";

import QuantityInput from "@/components/shadcnblocks/quantity-input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PAYMENT_METHODS = {
  creditCard: "creditCard",
  paypal: "paypal",
  onlineBankTransfer: "onlineBankTransfer",
} as const;

type PaymentMethod = keyof typeof PAYMENT_METHODS;

const CreditCardPayment = z.object({
  method: z.literal(PAYMENT_METHODS.creditCard),
  cardholderName: z.string(),
  cardNumber: z.string(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Neplatny format (MM/RR)")
    .refine((value) => {
      const [mm, yy] = value.split("/").map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;
      if (yy < currentYear) return false;
      if (yy === currentYear && mm < currentMonth) return false;
      return true;
    }, "Platnost karty vyprsela"),
  cvc: z.string(),
});

const PayPalPayment = z.object({
  method: z.literal(PAYMENT_METHODS.paypal),
  payPalEmail: z.string(),
});

const BankTransferPayment = z.object({
  method: z.literal(PAYMENT_METHODS.onlineBankTransfer),
  bankName: z.string(),
  accountNumber: z.string(),
});

const PaymentSchema = z.discriminatedUnion("method", [
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
]);

const checkoutFormSchema = z.object({
  contactInfo: z.object({
    email: z.string(),
    subscribe: z.boolean().optional(),
  }),
  address: z.object({
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    phone: z.string(),
  }),
  shippingMethod: z.string(),
  payment: PaymentSchema,
  products: z
    .object({
      slug: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
    .array(),
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

function formatCZK(price: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  const defaultProducts = items.map((item) => ({
    slug: item.slug,
    quantity: item.quantity,
    price: item.price,
  }));

  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      payment: {
        method: PAYMENT_METHODS.creditCard,
      },
      products: defaultProducts,
    },
  });

  const onSubmit = (_data: CheckoutFormType) => {
    navigate("/potvrzeni-objednavky");
  };

  if (items.length === 0) {
    return (
      <section className="py-32">
        <div className="container mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-8 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-2xl font-semibold">Vas kosik je prazdny</h1>
          <p className="mb-8 text-muted-foreground">
            Vypada to, ze jste jeste nic nepridali.
          </p>
          <Button asChild>
            <Link to="/obchod">Pokracovat v nakupu</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-10">
          <Link to="/">
            <img src="/logo.svg" alt="Logo" className="h-8" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Pokladna
          </h1>
          <p className="mt-2 text-muted-foreground">
            Dokoncete svuj nakup bezpecne
          </p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-3">
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Kontaktni udaje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContactFields />
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Dodaci adresa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressFields />
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Zpusob dopravy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ShippingMethodFields />
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Platba</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentFields />
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full">
                  Dokoncit objednavku
                </Button>
              </div>

              <div className="lg:col-span-2">
                <div className="sticky top-8">
                  <OrderSummary
                    form={form}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                    subtotal={subtotal}
                    itemCount={itemCount}
                  />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}

function ContactFields() {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-4">
      <Controller
        name="contactInfo.email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-normal" htmlFor="checkout-email">
              Email
            </FieldLabel>
            <Input
              {...field}
              id="checkout-email"
              type="email"
              placeholder="vas@email.cz"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="contactInfo.subscribe"
        control={form.control}
        render={({ field }) => (
          <Field className="flex items-center gap-2">
            <Checkbox
              id="checkout-subscribe"
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="checkout-subscribe" className="font-normal">
              Posilejte mi novinky a nabidky
            </FieldLabel>
          </Field>
        )}
      />
    </FieldGroup>
  );
}

function AddressFields() {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-4">
      <Controller
        name="address.country"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-normal" htmlFor="checkout-country">
              Zeme
            </FieldLabel>
            <Input {...field} id="checkout-country" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="address.firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-normal" htmlFor="checkout-firstName">
                Jmeno
              </FieldLabel>
              <Input {...field} id="checkout-firstName" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-normal" htmlFor="checkout-lastName">
                Prijmeni
              </FieldLabel>
              <Input {...field} id="checkout-lastName" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-normal" htmlFor="checkout-address">
              Adresa
            </FieldLabel>
            <Input {...field} id="checkout-address" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="address.postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-normal" htmlFor="checkout-postalCode">
                PSC
              </FieldLabel>
              <Input {...field} id="checkout-postalCode" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-normal" htmlFor="checkout-city">
                Mesto
              </FieldLabel>
              <Input {...field} id="checkout-city" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-sm font-normal" htmlFor="checkout-phone">
              Telefon
            </FieldLabel>
            <Input {...field} id="checkout-phone" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

function ShippingMethodFields() {
  const form = useFormContext();

  return (
    <Controller
      name="shippingMethod"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            className="gap-3"
          >
            <FieldLabel htmlFor="checkout-shippingMethod-1">
              <Field
                data-invalid={fieldState.invalid}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <RadioGroupItem value="zasilkovna" id="checkout-shippingMethod-1" />
                <FieldContent className="flex-1">
                  <FieldTitle>Zasilkovna</FieldTitle>
                  <FieldDescription>Doruceni: 2-3 pracovni dny</FieldDescription>
                </FieldContent>
                <p className="text-sm font-medium">89 Kc</p>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="checkout-shippingMethod-2">
              <Field
                data-invalid={fieldState.invalid}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <RadioGroupItem value="ppl" id="checkout-shippingMethod-2" />
                <FieldContent className="flex-1">
                  <FieldTitle>PPL</FieldTitle>
                  <FieldDescription>Doruceni: 1-2 pracovni dny</FieldDescription>
                </FieldContent>
                <p className="text-sm font-medium">149 Kc</p>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="checkout-shippingMethod-3">
              <Field
                data-invalid={fieldState.invalid}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <RadioGroupItem value="ceska-posta" id="checkout-shippingMethod-3" />
                <FieldContent className="flex-1">
                  <FieldTitle>Ceska posta</FieldTitle>
                  <FieldDescription>Doruceni: 3-5 pracovnich dnu</FieldDescription>
                </FieldContent>
                <p className="text-sm font-medium">69 Kc</p>
              </Field>
            </FieldLabel>
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function PaymentFields() {
  const form = useFormContext();
  const paymentMethod = form.watch("payment.method") as PaymentMethod;

  return (
    <div className="space-y-6">
      <Controller
        name="payment.method"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              className="gap-3"
            >
              <FieldLabel htmlFor="checkout-payment-method-1">
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <RadioGroupItem value="creditCard" id="checkout-payment-method-1" />
                  <FieldContent className="flex-1">
                    <FieldTitle>Platebni karta</FieldTitle>
                  </FieldContent>
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                    alt="Visa"
                    className="size-5"
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-2">
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <RadioGroupItem value="paypal" id="checkout-payment-method-2" />
                  <FieldContent className="flex-1">
                    <FieldTitle>PayPal</FieldTitle>
                  </FieldContent>
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                    alt="PayPal"
                    className="size-5"
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-3">
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <RadioGroupItem value="onlineBankTransfer" id="checkout-payment-method-3" />
                  <FieldContent className="flex-1">
                    <FieldTitle>Bankovni prevod</FieldTitle>
                  </FieldContent>
                  <Building2 className="size-5 text-muted-foreground" />
                </Field>
              </FieldLabel>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <PaymentFieldsByMethod method={paymentMethod} />
    </div>
  );
}

function PaymentFieldsByMethod({ method }: { method: PaymentMethod }) {
  const form = useFormContext();

  if (!method) return null;

  switch (method) {
    case PAYMENT_METHODS.creditCard:
      return (
        <div className="space-y-4">
          <Controller
            name="payment.cardholderName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-cardholderName">
                  Jmeno na karte
                </FieldLabel>
                <Input {...field} id="checkout-payment-cardholderName" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="payment.cardNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-cardNumber">
                  Cislo karty
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-cardNumber"
                  placeholder="1234 5678 9012 3456"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DateInput />
            <Controller
              name="payment.cvc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-cvc">
                    CVC
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-payment-cvc"
                    placeholder="123"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>
      );
    case PAYMENT_METHODS.paypal:
      return (
        <Controller
          name="payment.payPalEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-payPalEmail">
                PayPal email
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="vas-paypal@email.cz"
                id="checkout-payment-payPalEmail"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      );
    case PAYMENT_METHODS.onlineBankTransfer:
      return (
        <div className="space-y-4">
          <Controller
            name="payment.bankName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-bankName">
                  Nazev banky
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Nazev banky"
                  id="checkout-payment-bankName"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="payment.accountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-accountNumber">
                  Cislo uctu
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-accountNumber"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      );
    default:
      return null;
  }
}

function DateInput() {
  const form = useFormContext();

  return (
    <Controller
      name="payment.expiryDate"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-sm font-normal" htmlFor="checkout-payment-expiryDate">
            Platnost do
          </FieldLabel>
          <Input
            {...field}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[^0-9/]/g, "");
              const prev = field.value ?? "";
              const isDeleting = val.length < prev.length;
              if (!isDeleting) {
                if (val.length === 2 && !val.includes("/")) {
                  val = `${val}/`;
                }
              }
              if (val.length > 5) {
                val = val.slice(0, 5);
              }
              field.onChange(val);
            }}
            pattern="^(0[1-9]|1[0-2])/[0-9]{2}$"
            placeholder="MM/RR"
            id="checkout-payment-expiryDate"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

interface OrderSummaryProps {
  form: UseFormReturn<CheckoutFormType>;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  subtotal: number;
  itemCount: number;
}

function OrderSummary({ form, removeItem, updateQuantity, subtotal, itemCount }: OrderSummaryProps) {
  const { items } = useCart();
  const { fields, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const shipping = subtotal >= 3600 ? 0 : 149;
  const total = subtotal + shipping;

  const handleRemove = useCallback(
    (index: number, slug: string) => {
      remove(index);
      removeItem(slug);
    },
    [remove, removeItem],
  );

  const handleQuantityChange = useCallback(
    (index: number, slug: string, newQty: number) => {
      update(index, { ...fields[index], quantity: newQty });
      updateQuantity(slug, newQty);
    },
    [update, fields, updateQuantity],
  );

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          Souhrn objednavky ({itemCount}{" "}
          {itemCount === 1 ? "polozka" : itemCount < 5 ? "polozky" : "polozek"})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-4">
          {fields.map((field, index) => {
            const cartItem = items.find((p) => p.slug === field.slug);
            if (!cartItem) return null;
            return (
              <li key={field.id}>
                <CartItemRow
                  item={cartItem}
                  index={index}
                  onRemove={() => handleRemove(index, cartItem.slug)}
                  onQuantityChange={(newQty) =>
                    handleQuantityChange(index, cartItem.slug, newQty)
                  }
                />
              </li>
            );
          })}
        </ul>

        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mezisoucet</span>
            <span>{formatCZK(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Doprava</span>
            <span>
              {shipping === 0 ? (
                <span className="text-emerald-600">Zdarma</span>
              ) : (
                formatCZK(shipping)
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          <span className="text-lg font-semibold">Celkem</span>
          <span className="text-lg font-semibold">{formatCZK(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface CartItemRowProps {
  item: { slug: string; name: string; subtitle: string; image: string; price: number; originalPrice?: number; currency: string; quantity: number };
  index: number;
  onRemove: () => void;
  onQuantityChange: (newQty: number) => void;
}

function CartItemRow({ item, index, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <div className="flex gap-4">
      <div className="w-16 shrink-0">
        <AspectRatio ratio={1} className="overflow-hidden rounded-md bg-muted">
          <img src={item.image} alt={item.name} className="size-full object-contain p-1" />
        </AspectRatio>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <div>
            <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-medium">{formatCZK(item.price * item.quantity)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">{formatCZK(item.price)} / ks</p>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityField index={index} onQuantityChange={onQuantityChange} />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={onRemove}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuantityField({
  index,
  onQuantityChange,
}: {
  index: number;
  onQuantityChange: (n: number) => void;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={`products.${index}.quantity`}
      control={control}
      render={({ field }) => (
        <Field className="w-auto">
          <QuantityInput
            inputProps={field}
            onValueChange={(newQty) => {
              field.onChange(newQty);
              onQuantityChange(newQty);
            }}
            className="h-8 rounded-none"
          />
        </Field>
      )}
    />
  );
}
