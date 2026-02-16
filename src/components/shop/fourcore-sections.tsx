import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  Dumbbell,
  Flame,
  Infinity,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";

const HIGHLIGHTS = [
  { icon: CalendarDays, label: "70 dni", description: "Strukturovany plan" },
  { icon: Clock, label: "15 min", description: "Denne staci" },
  { icon: Infinity, label: "Dozivotni", description: "Pristup k materialu" },
  { icon: Play, label: "Video", description: "Navod ke kazdemu cviku" },
];

const PROGRAM_PHASES = [
  {
    title: "Faze 1 - Zaklady",
    description:
      "Naucite se spravnou techniku zakladnich cviku. Zamerime se na mobilitu, stabilitu a spravne dychani.",
    icon: Target,
    days: "Den 1-20",
  },
  {
    title: "Faze 2 - Rozvoj",
    description:
      "Postupne zvysujeme intenzitu a pridavame slozitejsi cviky. Budujete silu a vydrz.",
    icon: TrendingUp,
    days: "Den 21-45",
  },
  {
    title: "Faze 3 - Vykonnost",
    description:
      "Pokrocile cviky a kombinace pro maximalni efekt. Telo je pripravene na vyssi zatez.",
    icon: Flame,
    days: "Den 46-60",
  },
  {
    title: "Faze 4 - Udrzba",
    description:
      "Upevnete ziskane navyky. Naucite se, jak pokracovat i po skonceni programu.",
    icon: Dumbbell,
    days: "Den 61-70",
  },
];

const WHO_IS_IT_FOR = [
  {
    title: "Zacatecnici",
    description:
      "Nikdy jste pravidelne necvicili? 4CORE vas provede od uplnych zakladu.",
  },
  {
    title: "Rehabilitanti",
    description:
      "Po zraneni nebo operaci potrebujete setrny navrat k pohybu.",
  },
  {
    title: "Sportovci",
    description:
      "Chcete zlepsit zakladni stabilitu a predejit zranenim.",
  },
];

export function FourcoreHighlights() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Co vas ceka
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          70 dni strukturovaneho treninku, ktery zvladnete kazdy den za 15 minut.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div
            key={h.label}
            className="group flex flex-col items-center rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 transition-colors group-hover:bg-foreground/10">
              <h.icon className="h-6 w-6 text-foreground/70" />
            </div>
            <p className="text-2xl font-bold">{h.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FourcoreProgramPhases() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Struktura programu
        </h2>
      </div>

      <div className="mt-14 flex flex-col">
        {PROGRAM_PHASES.map((phase, index) => (
          <div key={phase.title}>
            {index > 0 && <Separator />}
            <div className="flex items-start gap-6 py-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/5">
                <phase.icon className="h-6 w-6 text-foreground/70" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {phase.days}
                </p>
                <h3 className="text-lg font-semibold">{phase.title}</h3>
                <p className="max-w-lg leading-relaxed text-muted-foreground">
                  {phase.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FourcoreAudience() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Pro koho je 4CORE
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {WHO_IS_IT_FOR.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border bg-card p-8 transition-shadow hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
