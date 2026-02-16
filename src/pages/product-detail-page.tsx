import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Infinity,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductBySlug, PRODUCTS } from "@/lib/products-data";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = useMemo(
    () => (productId ? getProductBySlug(productId) : undefined),
    [productId],
  );

  if (!product) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-32">
        <h1 className="text-2xl font-bold">Produkt nenalezen</h1>
        <p className="mt-2 text-muted-foreground">
          Tento produkt nebyl nalezen v nasem obchode.
        </p>
        <Button asChild className="mt-6">
          <Link to="/obchod">Zpet do obchodu</Link>
        </Button>
      </section>
    );
  }

  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <section className="px-4 py-16 md:py-24 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/obchod")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zpet do obchodu
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {product.subtitle}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              {product.badge && (
                <Badge className="mt-3 bg-red-600 text-white hover:bg-red-700">
                  {product.badge}
                </Badge>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                {product.pricePrefix && (
                  <span className="text-base text-muted-foreground">
                    {product.pricePrefix}
                  </span>
                )}
                <span className="text-3xl font-bold tracking-tight">
                  {product.price.toLocaleString("cs-CZ")} Kc
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString("cs-CZ")} Kc
                  </span>
                )}
              </div>
              {product.note && (
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <NoteIcon note={product.note} />
                  {product.note}
                </p>
              )}
            </div>

            <Separator />

            <p className="leading-relaxed text-muted-foreground">
              {product.longDescription}
            </p>

            {product.features && (
              <div className="flex flex-wrap gap-3">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                  >
                    <Clock className="size-4 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <QuantityInput />
              <Button size="lg" className="flex-1">
                <ShoppingCart className="mr-2 size-4" />
                Pridat do kosiku
              </Button>
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-5">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="size-4 shrink-0 text-muted-foreground" />
                Doprava zdarma pri objednavce nad 1 500 Kc
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="size-4 shrink-0 text-muted-foreground" />
                Vraceni do 30 dnu zdarma
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Store className="size-4 shrink-0 text-muted-foreground" />
                Moznost vyzvednuti v nasem showroomu
              </div>
            </div>

            <Accordion type="multiple" className="w-full">
              {product.details.map((section, index) => (
                <AccordionItem
                  value={`detail-${index}`}
                  key={`detail-${index}`}
                >
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    {Array.isArray(section.content) ? (
                      <ul className="list-inside list-disc space-y-1 pl-2 text-muted-foreground">
                        {section.content.map((item, i) => (
                          <li key={`content-${i}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">{section.content}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <Separator className="my-16" />

        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Dalsi produkty
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProducts.map((p) => (
              <Link
                key={p.slug}
                to={`/produkt/${p.slug}`}
                className="group flex gap-4 rounded-xl border border-border/50 p-4 transition-all duration-300 hover:border-border hover:shadow-md"
              >
                <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {p.subtitle}
                  </p>
                  <h3 className="mt-0.5 font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm font-medium">
                    {p.pricePrefix && `${p.pricePrefix} `}
                    {p.price.toLocaleString("cs-CZ")} Kc
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <div className="sticky top-24">
      <div className="overflow-hidden rounded-2xl">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={`gallery-${index}`}>
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={img}
                    alt={`${name} - ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex gap-2">
          {images.map((img, index) => (
            <button
              type="button"
              key={`thumb-${index}`}
              onClick={() => api?.scrollTo(index)}
              className={`size-16 overflow-hidden rounded-lg border-2 transition-all ${
                current === index
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function QuantityInput() {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex h-11 w-32 items-center overflow-hidden rounded-lg border">
      <button
        type="button"
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="flex size-11 items-center justify-center transition-colors hover:bg-muted"
      >
        <Minus className="size-4" />
      </button>
      <span className="flex-1 text-center text-sm font-medium">{qty}</span>
      <button
        type="button"
        onClick={() => setQty(Math.min(99, qty + 1))}
        className="flex size-11 items-center justify-center transition-colors hover:bg-muted"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function NoteIcon({ note }: { note: string }) {
  const lower = note.toLowerCase();
  if (lower.includes("doprav")) return <Truck className="size-4" />;
  if (lower.includes("dozivot")) return <Infinity className="size-4" />;
  if (lower.includes("kniz")) return <BookOpen className="size-4" />;
  return <ShoppingCart className="size-4" />;
}
