import { Armchair, Car, HeartPulse, Wind } from "lucide-react";

import type { BentoItem } from "@/components/ui/bento-features";
import { BentoFeatures } from "@/components/ui/bento-features";
import type { ScrollFeature, ScrollTestimonial } from "@/components/ui/scroll-features";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import type { TabbedFeature } from "@/components/ui/tabbed-features";
import { TabbedFeatures } from "@/components/ui/tabbed-features";

const SCROLL_FEATURES: ScrollFeature[] = [
  {
    title: "Kombinace pruznych a pevnych materialu",
    subtitle: "Napomaha k aktivnimu sedu a spravnemu drzeni tela.",
    statistics: { value: "2x", label: "Lepsi drzeni tela oproti bezne zidli" },
    visual: "/CCC1D0D9-63F3-44A1-96BD-F5EA2903CBAD_1_201_a-e1719591631832.jpeg.webp",
  },
  {
    title: "Aktivni sed umoznuje lepe dychat",
    subtitle: "Spravna pozice panve a patere otevira prostor pro volne dychani.",
    statistics: { value: "40%", label: "Zlepseni kapacity plic pri spravnem sedu" },
    visual: "/lefttop1.png",
  },
  {
    title: "Opora pro panev",
    subtitle:
      "Tvar lineseat poskytuje oporu pro panev, to navadi ke snadnejsimu propojeni s hrudnikem.",
    statistics: { value: "85%", label: "Uzivatelu hlasi zlepseni do 14 dnu" },
    visual: "/IMG_9113_lineseat.png.webp",
  },
  {
    title: "Aktivace brisnich svalu",
    subtitle: "Behem sedu dochazi k aktivaci brisnich svalu a lepsi stabilite.",
    statistics: { value: "3x", label: "Vetsi aktivace core svalu nez na bezne zidli" },
    visual: "/MG_0170-1024x683-1.jpg.webp",
  },
];

const SCROLL_TESTIMONIAL: ScrollTestimonial = {
  quote:
    "Po dvou tydnech pouzivani lineseat jsem prestala mit bolesti zad pri dlouhem sezeni v kancelari.",
  author: "Jana K.",
  designation: "kancelarska pracovnice",
};

const BENTO_ITEMS: BentoItem[] = [
  {
    title: (
      <>
        V aute i v
        <br />
        kancelari
      </>
    ),
    description: [
      "Lineseat bere s sebou vsude. At sidite v aute, v kancelari, u stolu nebo na cestach.",
      "Jediny sedak, ktery opravdu funguje - navrzeny fyzioterapeuty s 20letou zkusenosti.",
    ],
    image: {
      src: "/MG_0170-1024x683-1.jpg.webp",
      alt: "Lineseat v aute",
    },
    imagePosition: "content",
    className:
      "flex flex-col pl-6 py-6 overflow-hidden md:col-span-3 md:flex-row gap-6 md:gap-12",
    headerClassName: "flex-2 p-0 md:flex-1",
    contentClassName:
      "relative w-full self-start p-0 overflow-hidden rounded-l-xl border md:flex-1",
  },
  {
    title: "Vyzkousejte lineseat",
    description: [
      "Prijdte si osobne vyzkouset do Dires Fyzio v Praze.",
      "Nasi fyzioterapeuti vam poradi s nastavenim a vyberem.",
    ],
    image: {
      src: "/lefttop1.png",
      alt: "Lineseat produkt",
      className: "aspect-[2/1.1] rounded-xl",
    },
    className: "md:col-span-2 flex flex-col justify-center",
    contentClassName: "flex items-center justify-center",
    imagePosition: "content",
  },
  {
    title: "Vyvoj s fyzioterapeuty",
    description: [
      "Lineseat vznikl ve spolupraci s prednimi ceskymi fyzioterapeuty a ortopedy.",
    ],
    image: {
      src: "/IMG_9113_lineseat.png.webp",
      alt: "Vyvoj lineseat",
      className: "aspect-2/1 rounded-xl flex-1 self-center mb-6",
    },
    className: "md:col-span-2",
    headerClassName: "h-full",
    imagePosition: "header",
  },
  {
    title: "Materialy a kvalita",
    description: [
      "Vysokokvalitni pena s tvarovou pameti, protiskluzova spodni strana a pratelny potah na zip.",
    ],
    image: {
      src: "/CCC1D0D9-63F3-44A1-96BD-F5EA2903CBAD_1_201_a-e1719591631832.jpeg.webp",
      alt: "Lineseat detail materialu",
    },
    imagePosition: "content",
    className: "overflow-hidden md:col-span-3",
    headerClassName: "",
    contentClassName:
      "relative aspect-[2/1.25] mt-4 p-0 ml-8 w-full md:max-w-[400px] lg:max-w-[500px] overflow-hidden md:mx-auto rounded-t-xl",
  },
];

const TABBED_FEATURES: TabbedFeature[] = [
  {
    title: "Sezeni v aute",
    description: "Ergonomicka podpora pri dlouhe jizde.",
    icon: Car,
    content: {
      title: "Pohodlna jizda bez bolesti zad.",
      description:
        "Lineseat se dokonale prisedi na sedadlo v aute. Podporuje spravne drzeni panve a snizuje unavu pri dlouhych cestach. Snadne nasazeni i sundani.",
      image: "/MG_0170-1024x683-1.jpg.webp",
    },
  },
  {
    title: "Kancelarska prace",
    description: "Cely den u stolu bez nasledku.",
    icon: Armchair,
    content: {
      title: "Aktivni sed po celou pracovni dobu.",
      description:
        "Premiste lineseat na kancelarskou zidli a okamzite pocitite rozdil. Vase panev se nakloni do spravne pozice a pater se narovna prirozene.",
      image: "/lefttop1.png",
    },
  },
  {
    title: "Rehabilitace",
    description: "Podpora lecby a prevence.",
    icon: HeartPulse,
    content: {
      title: "Doporuceno fyzioterapeuty pro rehabilitaci.",
      description:
        "Lineseat je casto doporucovan pri bolestech zad, po operacich patere nebo pri prevenci problemu s drzenim tela. Jemne aktivuje spravne svalove skupiny.",
      image: "/IMG_9113_lineseat.png.webp",
    },
  },
  {
    title: "Cestovani",
    description: "Kompaktni a lehky, vzdy po ruce.",
    icon: Wind,
    content: {
      title: "Vezmete si ho kamkoli s sebou.",
      description:
        "Lineseat je lehky a snadno prenosny. Pouzijte ho ve vlaku, v letadle nebo v hotelu. Nikdy nemusite sedet spatne.",
      image: "/CCC1D0D9-63F3-44A1-96BD-F5EA2903CBAD_1_201_a-e1719591631832.jpeg.webp",
    },
  },
];

const INSTRUCTIONS = [
  {
    step: "1",
    title: "Umistete na sedadlo",
    description:
      "Polozte lineseat na sedadlo v aute nebo na kancelarskou zidli. Protiskluzova spodni strana zajisti, ze sedak zustane na miste.",
    image: "/MG_0170-1024x683-1.jpg.webp",
  },
  {
    step: "2",
    title: "Sednte si prirozene",
    description:
      "Sedak sam navede vasi panev do spravne pozice. Kombinace pruznych a pevnych materialu podpori aktivni sed bez namah.",
    image: "/IMG_9113_lineseat.png.webp",
  },
  {
    step: "3",
    title: "Uzivejte si zdravy sed",
    description:
      "Vase telo si rychle zvykne na spravne drzeni. Pocitite uvolneni v zadech a zlepseni dychani jiz po prvnich minutach.",
    image: "/lefttop1.png",
  },
];

export function LineseatScrollShowcase() {
  return (
    <ScrollFeatures
      features={SCROLL_FEATURES}
      testimonial={SCROLL_TESTIMONIAL}
    />
  );
}

export function LineseatBentoGrid() {
  return <BentoFeatures label="PROC LINESEAT?" items={BENTO_ITEMS} />;
}

export function LineseatTabs() {
  return (
    <TabbedFeatures
      heading="Kde vsude lineseat pouzijete"
      subheading="Lineseat je postaven na navycich, ktere delaji z dobreho sezeni kazdodenni rutinu - bez namah, bez bolesti."
      features={TABBED_FEATURES}
    />
  );
}

export function LineseatInstructions() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Jednoduche pouziti
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Navod k pouziti
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          S lineseat neni potreba nic nastavovat. Staci polozit a sednout si.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-12 md:gap-0">
        {INSTRUCTIONS.map((inst, index) => (
          <div
            key={inst.step}
            className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div
              className={`overflow-hidden rounded-2xl border bg-muted/30 ${index % 2 === 1 ? "md:order-2" : ""}`}
            >
              <img
                src={inst.image}
                alt={inst.title}
                className="aspect-[4/3] w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div
              className={`flex flex-col gap-4 ${index % 2 === 1 ? "md:order-1 md:text-right md:items-end" : ""}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
                {inst.step}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {inst.title}
              </h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                {inst.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
