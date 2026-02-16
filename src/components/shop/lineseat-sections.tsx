import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Armchair,
  Car,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";

const BENEFITS = [
  {
    icon: HeartPulse,
    title: "Kombinace pruznych a pevnych materialu",
    description: "Napomaha k aktivnimu sedu a spravnemu drzeni tela.",
  },
  {
    icon: Wind,
    title: "Aktivni sed umoznuje lepe dychat",
    description:
      "Spravna pozice panve a patere otevira prostor pro volne dychani.",
  },
  {
    icon: ShieldCheck,
    title: "Opora pro panev",
    description:
      "Tvar lineseat poskytuje oporu pro panev, to navadi ke snadnejsimu projeni s hrudnikem.",
  },
  {
    icon: Sparkles,
    title: "Aktivace brisnich svalu",
    description:
      "Behem sedu dochazi k aktivaci brisnich svalu a lepsi stabilite.",
  },
];

const USE_CASES = [
  {
    title: "V aute i v kancelari",
    description:
      "Lineseat bere s sebou vsude, at sidite v aute, v kancelari, u stolu nebo na cestach. Jediny sedak, ktery opravdu funguje.",
    icon: Car,
    image:
      "https://images.pexels.com/photos/7710086/pexels-photo-7710086.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Vyzkousejte lineseat",
    description:
      "Prijdte si osobne vyzkouset lineseat do Dires Fyzio v Praze. Nasi fyzioterapeuti vam poradi s nastavenim.",
    icon: Armchair,
    image:
      "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const INSTRUCTIONS = [
  {
    step: "1",
    title: "Umistete na sedadlo",
    description: "Polozte lineseat na sedadlo v aute nebo na kancelarskou zidli.",
  },
  {
    step: "2",
    title: "Sednte si",
    description:
      "Sednte si prirozene. Sedak sam navede vasi panev do spravne pozice.",
  },
  {
    step: "3",
    title: "Uzivejte si",
    description:
      "Uzivejte si pohodlny a zdravy sed. Vase telo si rychle zvykne.",
  },
];

export function LineseatBenefits() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Ctyri duvody
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          proc sedet na lineseat
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="group rounded-2xl border bg-card p-8 transition-shadow hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 transition-colors group-hover:bg-foreground/10">
              <b.icon className="h-6 w-6 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold">{b.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LineseatUseCases() {
  return (
    <section className="py-16 md:py-24">
      <div className="flex flex-col gap-10">
        {USE_CASES.map((uc, index) => (
          <div
            key={uc.title}
            className="group overflow-hidden rounded-3xl border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className={`flex flex-col justify-center gap-5 p-8 md:p-12 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/5">
                  <uc.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {uc.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {uc.description}
                </p>
                <Button className="w-fit" size="sm">
                  Zjistit vice
                </Button>
              </div>
              <div
                className={`aspect-[4/3] overflow-hidden md:aspect-auto ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <img
                  src={uc.image}
                  alt={uc.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LineseatInstructions() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Navod k pouziti
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          S lineseat neni potreba nic nastavovat. Staci polozit a sednout si.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {INSTRUCTIONS.map((inst, index) => (
          <div key={inst.step}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-2xl font-bold text-background">
                {inst.step}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{inst.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {inst.description}
              </p>
            </div>
            {index < INSTRUCTIONS.length - 1 && (
              <Separator className="mt-6 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
