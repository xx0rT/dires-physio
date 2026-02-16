import { ArrowRight, BookOpen, Clock, Infinity, ShoppingCart, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  pricePrefix?: string;
  features?: string[];
  note?: string;
  badge?: string;
  ctaPrimary: { label: string; url: string };
  ctaSecondary?: { label: string; url: string };
}

const PRODUCTS: Product[] = [
  {
    name: "Lineseat",
    subtitle: "Ergonomicky sedak",
    description:
      "Nase pomucka pro stabilni a funkcni sed v aute nebo v kancelari.",
    image:
      "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: 2900,
    originalPrice: 3900,
    badge: "Akce",
    note: "Akce je platna do vyprodani zasob!",
    ctaPrimary: { label: "Koupit", url: "/obchod" },
    ctaSecondary: { label: "O produktu", url: "/obchod" },
  },
  {
    name: "Correctfoot",
    subtitle: "Balancni desticka",
    description: "Balancni desticka pro trenink koncetin.",
    image:
      "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: 2900,
    pricePrefix: "od",
    note: "Vyber ze dvou variant.",
    ctaPrimary: { label: "Koupit", url: "/obchod" },
    ctaSecondary: { label: "O produktu", url: "/obchod" },
  },
  {
    name: "4CORE",
    subtitle: "Treninkovy program",
    description: "Online treninkovy program pro zlepseni kondice a zdravi.",
    image:
      "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: 4900,
    features: ["70 dni treninku", "15 minut denne"],
    note: "Dozivotni pristup!",
    ctaPrimary: { label: "Koupit", url: "/obchod" },
    ctaSecondary: { label: "Vyzkouset", url: "/obchod" },
  },
  {
    name: "Fyziotrenink",
    subtitle: "Kniha",
    description:
      "Aktualizovane vydani knihy Fyziotrenink - Pohyb jako lek.",
    image:
      "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: 450,
    note: "Cena je vcetne dopravy!",
    ctaPrimary: { label: "Koupit", url: "/obchod" },
    ctaSecondary: { label: "O knize", url: "/obchod" },
  },
];

interface ProductShowcaseProps {
  className?: string;
}

const ProductShowcase = ({ className }: ProductShowcaseProps) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4">
          <ShoppingCart className="mr-1.5 size-3" />
          Obchod
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Nase produkty
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Profesionalni pomucky a programy pro vasi fyzioterapii a zdravi
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <Badge className="absolute left-3 top-3 bg-red-600 text-white hover:bg-red-700">
            {product.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.subtitle}
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-tight">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {product.features && (
          <ul className="mt-3 space-y-1.5">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <Clock className="size-3.5 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            {product.pricePrefix && (
              <span className="text-sm text-muted-foreground">
                {product.pricePrefix}
              </span>
            )}
            <span className="text-2xl font-bold tracking-tight">
              {product.price.toLocaleString("cs-CZ")}
            </span>
            <span className="text-sm text-muted-foreground">Kc</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString("cs-CZ")} Kc
              </span>
            )}
          </div>

          {product.note && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {product.note.toLowerCase().includes("doprav") ? (
                <Truck className="size-3" />
              ) : product.note.toLowerCase().includes("dozivot") ? (
                <Infinity className="size-3" />
              ) : product.note.toLowerCase().includes("kniz") ? (
                <BookOpen className="size-3" />
              ) : (
                <ShoppingCart className="size-3" />
              )}
              {product.note}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button asChild className="flex-1">
            <Link to={product.ctaPrimary.url}>
              {product.ctaPrimary.label}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          {product.ctaSecondary && (
            <Button variant="outline" asChild className="flex-1">
              <Link to={product.ctaSecondary.url}>
                {product.ctaSecondary.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProductShowcase };
