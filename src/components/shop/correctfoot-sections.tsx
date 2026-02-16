import { Separator } from "@/components/ui/separator";

const EXERCISE_STEPS = [
  {
    title: "Zaujeti cvicebnich poloh",
    description:
      "Cvicime v asymetrickem sedu z uziho a z sirsiho. Snadnejsi je zacit s uzim sedem, kde se lepe aktivuji svaly nohy a chodidla.",
    image: "/postup-prvni.jpg",
  },
  {
    title: "Cviceni",
    description:
      "V asymetrickem sedu postupne nacitame stabilitu, tlacime nohy vazi podel a promenujeme svaly. Potern sledujeme citlivost a reakce tela.",
    image: "/postup-druhy.jpg",
  },
  {
    title: "Pocity",
    description:
      "Pri postupnem zatezovani vnimame, jak se noha a chodidlo prizpusobuji. V idealnich stavu citi vahu, a pritom sledujeme odchylky spoliu.",
    image: "/postup-treti.jpg",
  },
  {
    title: "Rezim cviceni",
    description:
      "Postupujte az od sedu pres stoj. V obou dalsinch stavu cvicte dle svych moznosti - sledujte vlastni pokroky.",
    image: "/postup-ctvrty.jpg",
  },
];

const VARIANTS = [
  {
    name: "CARBON",
    description:
      "Aerodynamicky design doplni sportovni vizual a zaaroveni nabidne maximalni odolnost diky karbonove povrchove uprave.",
    price: "3 100 Kc",
    image: "/correctfoot-carbon-2048x1245.jpg",
  },
  {
    name: "WOOD",
    description:
      "Elegantni provedeni, ktere skvele zapadne a prinosem kvalitniho ceskoveho dreva a podtrouvani osvezenich efektu.",
    price: "2 900 Kc",
    image: "/correctfoot-wood-2048x1545.jpg",
  },
];

export function CorrectfootProductDescription() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Popis correctfoot
        </h2>
        <p className="mt-4 text-muted-foreground">
          S correctfoot trenujete chodidlo, celou nohu, zakladu a drzeni na sve deti.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/popis-correctfoot.jpg"
            alt="Correctfoot - libela a platforma"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/popis-correctfoot2.jpg"
            alt="Correctfoot - base control a balance zone"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function CorrectfootExerciseGuide() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Jak cvicit s <span className="font-bold">correctfoot</span>?
        </h2>
      </div>

      <div className="mt-12 flex flex-col">
        {EXERCISE_STEPS.map((step, index) => (
          <div key={step.title}>
            {index > 0 && <Separator />}
            <div className="grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-2">
              <div
                className={`flex flex-col gap-3 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div
                className={`overflow-hidden rounded-2xl bg-muted ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="mx-auto h-auto max-h-[28rem] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CorrectfootVariants() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Vyberte si ze dvou variant
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-12">
        {VARIANTS.map((variant, index) => (
          <div
            key={variant.name}
            className="overflow-hidden rounded-3xl border bg-card"
          >
            <div className="grid grid-cols-1 items-center md:grid-cols-2">
              <div
                className={`flex flex-col gap-4 p-8 md:p-12 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    correctfoot
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {variant.name}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {variant.description}
                </p>
                <p className="text-lg font-semibold">
                  Cena: {variant.price}
                </p>
              </div>
              <div
                className={`bg-muted ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <img
                  src={variant.image}
                  alt={`Correctfoot ${variant.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
