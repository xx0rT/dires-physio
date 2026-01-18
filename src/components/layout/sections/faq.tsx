import { MessageCircleQuestion } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PatternPlaceholder } from "@/components/shadcnblocks/pattern-placeholder";

const DATA = [
  {
    question: "Existuje bezplatná verze?",
    answer:
      "Ano! Nabízíme bezplatný plán se základními funkcemi. Kdykoli můžete upgradovat na pokročilé nástroje a integrace.",
  },
  {
    question: "Jaké aplikace mohu integrovat?",
    answer:
      "Naše platforma podporuje integraci s různými populárními aplikacemi a službami. Konkrétní dostupné integrace závisí na úrovni vašeho plánu.",
  },
  {
    question: "Jak funguje AI?",
    answer:
      "Naše AI technologie využívá pokročilé algoritmy strojového učení k analýze a zpracování vašich dat, poskytující inteligentní poznatky a automatizační schopnosti.",
  },
  {
    question: "Mohu to používat s týmem?",
    answer:
      "Rozhodně! Naše platforma je navržena jak pro individuální, tak pro týmové použití. Můžete snadno spolupracovat a sdílet zdroje s členy týmu.",
  },
  {
    question: "Jsou moje data v bezpečí?",
    answer:
      "Bereme bezpečnost dat vážně. Všechna data jsou šifrována a bezpečně uložena podle osvědčených postupů a standardů dodržování předpisů v oboru.",
  },
  {
    question: "Jak spravuji své předplatné?",
    answer:
      "Své předplatné můžete snadno spravovat prostřednictvím dashboardu svého účtu, kde můžete upgradovat, downgradovat nebo upravit nastavení plánu.",
  },
];

interface Faq10Props {
  className?: string;
}

export const FAQSection = ({ className }: Faq10Props) => {
  return (
    <section className={cn("relative py-32", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(from var(--primary) calc(l - 0.1) c h / 0.20), transparent 70%)",
        }}
      />
      <PatternPlaceholder />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center gap-6 py-4 lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <MessageCircleQuestion className="size-4" />
            <span>FAQ</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl text-center">
            Vše, co potřebujete vědět
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground text-center">
            Hledáte rychlé odpovědi? Podívejte se na naši{" "}
            <span className="underline">sekci FAQ</span>.
          </p>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="mx-auto max-w-3xl pt-8 pb-4 md:pb-8 lg:pt-[3.75rem] lg:pb-[50px]">
          <Accordion type="single" collapsible className="space-y-4">
            {DATA.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-[7px] border px-6 text-primary data-[state=open]:pb-2"
              >
                <AccordionTrigger className="py-5 text-start text-base tracking-[-0.32px]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base tracking-[-0.32px] text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
