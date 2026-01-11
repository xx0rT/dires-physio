import AutoScroll from "embla-carousel-auto-scroll";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials1 = [
  {
    name: "Marie Kolářová",
    role: "Fyzioterapeutka",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "Kurz mi otevřel zcela nové možnosti v kariéře. Po absolvování jsem získala pozici vedoucí fyzioterapeutky v prestižní klinice.",
    journey: "Z asistentky na vedoucí fyzioterapeutku za 2 roky"
  },
  {
    name: "Tomáš Novotný",
    role: "Sportovní rehabilitátor",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "Díky vzdělání z tohoto kurzu pracuji s olympijskými sportovci. Každá technika, kterou jsem se naučil, je prakticky využitelná.",
    journey: "Ze začátečníka na rehabilitátora olympioniků"
  },
  {
    name: "Jana Dvořáková",
    role: "Dětská fyzioterapeutka",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content:
      "Program mi dal sebedůvěru a dovednosti, abych mohla otevřít vlastní ordinaci specializující se na dětskou fyzioterapii.",
    journey: "Od zaměstnankyně k majitelce vlastní ordinace"
  },
  {
    name: "Petr Svoboda",
    role: "Neurorehabilitační specialista",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Kurz mi poskytl znalosti, které jsem okamžitě aplikoval v praxi. Moje výsledky u pacientů se dramaticky zlepšily.",
    journey: "Od všeobecné praxe k neurorehabilitačnímu specialistovi"
  },
  {
    name: "Lucie Procházková",
    role: "Manuální terapeutka",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "Po absolutoriu jsem zdvojnásobila svůj příjem a pracuji s klienty, o kterých jsem dříve jen snila. Nejlepší investice do kariéry.",
    journey: "Zdvojnásobení příjmu a práce s VIP klienty"
  },
  {
    name: "Martin Černý",
    role: "Lektor fyzioterapie",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "Kurz mě inspiroval natolik, že jsem se sám stal lektorem. Nyní předávám své znalosti dalším generacím fyzioterapeutů.",
    journey: "Od studenta k uznávanému lektorovi za 3 roky"
  },
];
const testimonials2 = [
  {
    name: "Eva Málková",
    role: "Ortopedická specialistka",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "Vzdělání mi umožnilo specializovat se na ortopedii a pracovat v nejvyhlášenějších klinikách v Praze.",
    journey: "K práci v top pražských klinikách"
  },
  {
    name: "David Horák",
    role: "Mezinárodní konzultant",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "Kurz byl odrazovým můstkem k mezinárodní kariéře. Nyní cestuji po světě a školím fyzioterapeuty v různých zemích.",
    journey: "K mezinárodní kariéře a konzultacím po celém světě"
  },
  {
    name: "Kateřina Nováková",
    role: "Zakladatelka kliniky",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content:
      "Po absolutoriu jsem založila síť rehabilitačních center, která dnes zaměstnává přes 50 fyzioterapeutů.",
    journey: "K vlastní síti rehabilitačních center"
  },
  {
    name: "Jakub Veselý",
    role: "Výzkumník v rehabilitaci",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Kurz mě inspiroval k výzkumu v oboru. Publikoval jsem několik odborných článků a pracuji na univerzitě.",
    journey: "Od praktika k výzkumníkovi a vysokoškolskému pedagogovi"
  },
  {
    name: "Barbora Králová",
    role: "Online vzdělávatelka",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "Znalosti z kurzu jsem transformovala do online platformy, která pomáhá tisícům fyzioterapeutů po celém světě.",
    journey: "K online platformě s tisíci studenty globálně"
  },
  {
    name: "Michal Dvořák",
    role: "Celebrity fyzioterapeut",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "Dnes pracuji s celebritami a špičkovými sportovci. Kurz mi dal dovednosti a důvěru, abych se dostal tam, kde jsem teď.",
    journey: "K práci s celebritami a profesionálními sportovci"
  },
];

interface CommunityProps {
  className?: string;
}

export const CommunitySection = ({ className }: CommunityProps) => {
  const plugin1 = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    }),
  );

  const plugin2 = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
      direction: "backward",
    }),
  );
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto max-w-6xl flex flex-col items-center gap-6 px-4">
        <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
          Naše další reference!
        </h2>
      </div>
      <div className="w-full overflow-hidden">
        <div className="mt-16 space-y-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin1.current]}
            onMouseLeave={() => plugin1.current.play()}
          >
            <CarouselContent>
              {testimonials1.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="max-w-96 p-6 select-none">
                    <div className="mb-4 flex gap-4">
                      <Avatar className="size-12 rounded-full">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm flex-1">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <q className="text-sm">{testimonial.content}</q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin2.current]}
            onMouseLeave={() => plugin2.current.play()}
          >
            <CarouselContent>
              {testimonials2.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="max-w-96 p-6 select-none">
                    <div className="mb-4 flex gap-4">
                      <Avatar className="size-12 rounded-full">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="text-sm flex-1">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <q className="text-sm">{testimonial.content}</q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
