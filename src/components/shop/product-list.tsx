import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { ProductQuickView5 } from "@/components/shop/product-detail-modal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

type StockStatusCode = keyof typeof STOCK_STATUS;

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

interface Product {
  name: string;
  image: {
    src: string;
    srcset?: string;
    sizes?: string;
    alt: string;
  };
  link: string;
  price: ProductPrice;
  stockStatusCode: StockStatusCode;
  badges?: Array<{
    text: string;
    color?: string;
  }>;
}

type ProductCardProps = Product & {
  onQuickView?: () => void;
};

interface FeaturedPromotion {
  kicker: string;
  title: string;
  cta: {
    link: string;
    label: string;
  };
  link: string;
  image: string;
}

type FeaturedPromotionCardProps = FeaturedPromotion;

type ProductList = Array<{
  featuredPromotion: FeaturedPromotion;
  products: Array<Product>;
}>;

const PRODUCTS_LIST: ProductList = [
  {
    featuredPromotion: {
      image: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Profesionální pomůcky pro efektivní rehabilitaci",
      kicker: "Vylepšete svou fyzioterapii",
      cta: {
        label: "Prohlédnout vybavení",
        link: "#",
      },
      link: "#",
    },
    products: [
      {
        name: "Posilovací guma - set 3 ks",
        price: {
          regular: 890,
          sale: 749,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Posilovací gumy",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Masážní míček",
        price: {
          regular: 450,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Masážní míček",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Balanční podložka",
        price: {
          regular: 1250,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Balanční podložka",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Terapeutický válec",
        price: {
          regular: 680,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Terapeutický válec",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Cvičební podložka Premium",
        price: {
          regular: 950,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Cvičební podložka",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Rehabilitační míč 65cm",
        price: {
          regular: 1480,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Rehabilitační míč",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Akupresurní podložka",
        price: {
          regular: 1890,
          sale: 1490,
          currency: "CZK",
        },
        link: "#",
        badges: [
          {
            text: "Nejprodávanější!",
            color: "oklch(54.6% 0.245 262.881)",
          },
          {
            text: "Sleva",
            color: "oklch(57.7% 0.245 27.325)",
          },
        ],
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Akupresurní podložka",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Masážní tyč na trigger pointy",
        price: {
          regular: 780,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Masážní tyč",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
    ],
  },
  {
    featuredPromotion: {
      image:
        "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "Kvalitní pomůcky pro domácí i profesionální cvičení",
      kicker: "Vaše cesta k lepšímu zdraví",
      cta: {
        label: "Zobrazit produkty",
        link: "#",
      },
      link: "#",
    },
    products: [
      {
        name: "Kinesio tape 5m",
        price: {
          regular: 320,
          sale: 249,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Kinesio tape",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Posilovač předloktí",
        price: {
          regular: 580,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Posilovač předloktí",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Masážní pistole",
        price: {
          regular: 4200,
          sale: 3690,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        badges: [
          {
            text: "Sleva",
            color: "oklch(57.7% 0.245 27.325)",
          },
        ],
        image: {
          src: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Masážní pistole",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Gymnastický míč 75cm",
        price: {
          regular: 1650,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Gymnastický míč",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Balanční polštář",
        price: {
          regular: 890,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Balanční polštář",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Posilovací tyč 120cm",
        price: {
          regular: 1250,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Posilovací tyč",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Akupresurní míčky set",
        price: {
          regular: 520,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Akupresurní míčky",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Protahovací pás",
        price: {
          regular: 390,
          currency: "CZK",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280",
          srcset: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1920 1920w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280 1280w, https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=640 640w",
          alt: "Protahovací pás",
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
    ],
  },
];

interface ProductList10Props {
  className?: string;
}

const ProductList10 = ({ className }: ProductList10Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className={cn("py-32", className)}>
        <div className="flex flex-col gap-5">
          {PRODUCTS_LIST.map((item, index) => (
            <div
              className="flex flex-col gap-5 lg:flex-row lg:even:flex-row-reverse"
              key={`product-list-10-featured-promo-${index}`}
            >
              <div className="flex-1/3">
                <FeaturedPromotionCard {...item.featuredPromotion} />
              </div>
              <div className="flex-2/3">
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  {item.products.map((product, index) => (
                    <ProductCard
                      {...product}
                      key={`product-10-list-card-${index}`}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ProductQuickView5
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

const ProductCard = ({
  image,
  name,
  price,
  stockStatusCode,
  onQuickView,
}: ProductCardProps) => {
  const { regular, sale, currency } = price;

  return (
    <Card className="group relative block rounded-none border-none bg-background p-0 shadow-none">
      <Link to="/product/1" className="absolute inset-0 z-10 size-full"></Link>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <AspectRatio
            ratio={0.749767365}
            className="overflow-hidden rounded-xl"
          >
            <img
              srcSet={image.srcset}
              alt={image.alt}
              sizes={image.sizes}
              className="block size-full origin-center object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
          </AspectRatio>
          {stockStatusCode === STOCK_STATUS.OUT_OF_STOCK && (
            <div className="absolute start-2.5 top-2.5 z-60">
              <Badge>Vyprodáno</Badge>
            </div>
          )}
          {stockStatusCode === STOCK_STATUS.IN_STOCK && price.sale && (
            <div className="absolute start-2.5 top-2.5 z-60">
              <Badge variant="destructive">Sleva</Badge>
            </div>
          )}
          <div className="absolute inset-x-5 top-1/2 z-60 hidden -translate-y-1/2 md:block">
            <div className="flex flex-col gap-2 opacity-0 duration-700 lg:translate-y-4 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              <Button
                disabled={stockStatusCode === STOCK_STATUS.OUT_OF_STOCK}
                className="w-full"
              >
                <ShoppingCart />
                Přidat do košíku
              </Button>
              <Button
                variant="secondary"
                className="w-full relative z-70"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView?.();
                }}
              >
                <Eye />
                Rychlý náhled
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-3">
          <CardTitle className="leading-normal font-normal underline-offset-3 group-hover:underline">
            {name}
          </CardTitle>
          <Price
            onSale={sale != null}
            className="text-sm leading-normal font-bold"
          >
            <PriceValue
              price={sale}
              currency={currency}
              variant="sale"
              className="text-red-700"
            />
            <PriceValue price={regular} currency={currency} variant="regular" />
          </Price>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedPromotionCard = ({
  kicker,
  title,
  cta,
  link,
  image,
}: FeaturedPromotionCardProps) => {
  return (
    <Card
      style={{
        backgroundImage: `url(${image})`,
      }}
      className="relative h-full min-h-160 border-none bg-cover bg-center bg-no-repeat p-10 shadow-none md:min-h-100"
    >
      <a href={link} className="absolute inset-0 z-10 size-full"></a>
      <CardHeader className="gap-2.5 p-0">
        <p>{kicker}</p>
        <CardTitle className="text-2xl font-medium">{title}</CardTitle>
        <div className="relative z-20 mt-5">
          <Button size="lg" asChild>
            <a href={cta.link}>{cta.label}</a>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export { ProductList10 };
