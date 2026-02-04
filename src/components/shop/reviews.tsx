import { BadgeCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Rating } from "@/components/shadcnblocks/rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  verified?: boolean;
  helpful?: number;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 5,
    title: "Výborná pomůcka na rehabilitaci",
    content:
      "Po operaci kolene jsem potřeboval kvalitní pomůcky na cvičení doma. Posilovací gumy jsou skvělé, různé úrovně odporu a návod s cviky. Už po měsíci vidím velký pokrok.",
    author: { name: "Jana Nováková", avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp" },
    date: "10. prosince 2024",
    verified: true,
    helpful: 42,
  },
  {
    id: "2",
    rating: 5,
    title: "Perfektní pro domácí cvičení",
    content:
      "Jsem fyzioterapeutka a tyto pomůcky doporučuji i svým klientům. Kvalita je opravdu vysoká a cena je férová. Rychlé dodání a skvělá komunikace.",
    author: { name: "Mgr. Petra Dvořáková", avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp" },
    date: "8. prosince 2024",
    verified: true,
    helpful: 38,
  },
  {
    id: "3",
    rating: 4,
    title: "Skvělý poměr cena/výkon",
    content:
      "Masážní míčky mi pomohly s bolestmi zad. Používám je každý den po práci a cítím se mnohem lépe. Kvalita je dobrá, jen trochu tužší než jsem čekal.",
    author: { name: "Tomáš Svoboda", avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp" },
    date: "5. prosince 2024",
    verified: true,
    helpful: 24,
  },
  {
    id: "4",
    rating: 5,
    title: "Pomohlo mi od bolesti",
    content:
      "Měl jsem dlouhodobé bolesti ramen a akupresurní podložka mi opravdu pomohla. Už po týdnu jsem cítil zlepšení. Určitě doporučuji všem s podobnými problémy.",
    author: { name: "Martin Procházka" },
    date: "2. prosince 2024",
    verified: false,
    helpful: 19,
  },
  {
    id: "5",
    rating: 4,
    title: "Kvalitní pomůcka",
    content:
      "Balanční podložka je skvělá na posílení hlubokého stabilizačního systému. Používám ji při všech cvicích. Trochu pevnější než jsem očekávala, ale celkově jsem spokojená.",
    author: { name: "Lucie Marková", avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp" },
    date: "28. listopadu 2024",
    verified: true,
    helpful: 12,
  },
  {
    id: "6",
    rating: 3,
    title: "Slušné za tu cenu",
    content:
      "Rehabilitační míč dělá co má. Není to top kvalita, ale pro domácí cvičení to stačí. Rychlé dodání a dobrá cena.",
    author: { name: "Pavel Černý" },
    date: "25. listopadu 2024",
    verified: true,
    helpful: 8,
  },
];

type SortOption = "helpful" | "newest" | "highest" | "lowest";

interface Reviews5Props {
  reviews?: Review[];
  className?: string;
}

const Reviews5 = ({ reviews = DEFAULT_REVIEWS, className }: Reviews5Props) => {
  const [sortBy, setSortBy] = useState<SortOption>("helpful");

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      (reviews.filter((r) => r.rating === star).length / totalReviews) * 100,
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return (b.helpful || 0) - (a.helpful || 0);
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const sortLabels: Record<SortOption, string> = {
    helpful: "Nejužitečnější",
    newest: "Nejnovější",
    highest: "Nejvyšší hodnocení",
    lowest: "Nejnižší hodnocení",
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Hodnocení zákazníků
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 5</span>
              </div>
              <Rating rate={averageRating} className="[&_svg]:size-4" />
              <span className="text-sm text-muted-foreground">
                ({totalReviews})
              </span>
            </div>
          </div>

          <div className="flex gap-2 sm:w-48">
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              {[5, 4, 3, 2, 1].map((n) => (
                <span key={n} className="h-2 leading-none">
                  {n}
                </span>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {ratingCounts.map(({ star, percentage }) => (
                <Progress key={star} value={percentage} className="h-2" />
              ))}
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {totalReviews} hodnocení
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Seřadit: {sortLabels[sortBy]}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={cn(sortBy === option && "font-medium")}
                >
                  {sortLabels[option]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-0">
          {sortedReviews.map((review, index) => (
            <div key={review.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage
                        src={review.author.avatar}
                        alt={review.author.name}
                      />
                      <AvatarFallback className="text-xs">
                        {review.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {review.author.name}
                    </span>
                    {review.verified && (
                      <BadgeCheck className="size-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Rating
                    rate={review.rating}
                    className="[&>div]:size-3.5 [&_svg]:size-3.5"
                  />
                  <span className="font-medium">{review.title}</span>
                </div>

                <p className="text-sm text-muted-foreground">{review.content}</p>

                {review.helpful !== undefined && review.helpful > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {review.helpful} lidí považuje toto za užitečné
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Načíst další hodnocení</Button>
        </div>
      </div>
    </section>
  );
};

export { Reviews5 };
