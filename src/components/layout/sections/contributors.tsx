"use client";

import { motion } from "framer-motion";
import { Forward } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Feature283Props {
  className?: string;
}

interface ImageData {
  src: string;
  className: string;
  name: string;
  story: string;
}

const Feature283 = ({ className }: Feature283Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images: ImageData[] = [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
      className:
        "w-40 absolute -left-10 top-1/2 h-52 -translate-x-full -translate-y-1/2 overflow-hidden rounded-2xl",
      name: "Sarah Mitchell",
      story: "Z nuly ke spuštění vlastního startupu za 6 měsíců. Tento kurz jí dal základy pro vytvoření jejího vysněného produktu a získání počátečního financování.",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
      className:
        "size-28 absolute -top-3 left-10 -translate-x-full -translate-y-full overflow-hidden rounded-2xl",
      name: "James Chen",
      story: "Přešel z marketingu do programování. Nyní pracuje v prestižní technologické společnosti a vyvíjí produkty používané miliony lidí po celém světě.",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
      className:
        "size-32 absolute -bottom-3 left-10 -translate-x-full translate-y-full overflow-hidden rounded-2xl",
      name: "Maria Rodriguez",
      story: "Vytvořila tři úspěšné SaaS produkty po dokončení kurzu. Nyní učí ostatní a zároveň řídí vlastní agenturu.",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img12.jpeg",
      className:
        "w-45 absolute -right-10 top-1/2 h-52 -translate-y-1/2 translate-x-full overflow-hidden rounded-2xl",
      name: "David Park",
      story: "Opustil korporátní práci a stal se freelance vývojářem. Nyní vydělává 3x více než dříve a pracuje na projektech, které miluje.",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img13.jpeg",
      className:
        "size-28 absolute -top-3 right-10 -translate-y-full translate-x-full overflow-hidden rounded-2xl",
      name: "Emma Thompson",
      story: "Začala jako úplný začátečník a nyní vede tým vývojářů v rychle rostoucím startupu. Tento kurz byl její odrazový můstek.",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img3.jpeg",
      className:
        "size-32 absolute -bottom-3 right-10 translate-x-full translate-y-full overflow-hidden rounded-2xl",
      name: "Alex Kumar",
      story: "Vydal svou první aplikaci za 4 týdny a dostala se na titulní stránku Product Hunt. Nyní spravuje portfolio ziskových indie projektů.",
    },
  ];

  const defaultTitle = "Známé tváře, které jste možná viděli";
  const defaultDescription =
    "Najeďte myší na jakoukoli fotku a objevte jejich neuvěřitelnou cestu a jak tento kurz změnil jejich kariéru";

  const displayTitle = hoveredIndex !== null ? images[hoveredIndex].name : defaultTitle;
  const displayDescription =
    hoveredIndex !== null ? images[hoveredIndex].story : defaultDescription;

  return (
    <section className={cn("h-full h-screen overflow-hidden py-32", className)}>
      <div className="container mx-auto flex h-full w-full flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center justify-center">
          <motion.h2
            key={displayTitle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative py-2 text-center font-sans text-4xl font-semibold tracking-tighter md:text-5xl"
          >
            {displayTitle}
          </motion.h2>
          <motion.p
            key={displayDescription}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="mx-auto mt-2 max-w-xl px-5 text-center text-sm text-muted-foreground/50 md:text-base min-h-[60px] flex items-center justify-center"
          >
            {displayDescription}
          </motion.p>
          <Button className="mt-10 h-10 rounded-xl">
            Staňte se přispěvatelem <Forward />
          </Button>
          <div>
            {images.map((image, index) => (
              <motion.div
                drag
                key={index}
                initial={{ y: "50%", opacity: 0, scale: 0.8 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  delay: index * 0.1 + 0.5,
                }}
                animate={{
                  filter:
                    hoveredIndex !== null && hoveredIndex !== index
                      ? "blur(10px)"
                      : "blur(0px)",
                  scale: hoveredIndex === index ? 1.05 : 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 0,
                  },
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={image.className}
              >
                <img
                  src={image.src}
                  alt={image.name}
                  className="pointer-events-none size-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature283 };
