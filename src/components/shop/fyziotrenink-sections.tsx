import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  GraduationCap,
  HeartPulse,
  Layers,
  Users,
} from "lucide-react";

const BOOK_CHAPTERS = [
  {
    title: "Zaklady funkcniho treninku",
    description: "Pochopte principy pohybu a naucte se, proc je funkcni trenink zaklad zdravi.",
  },
  {
    title: "Cviky pro spravne drzeni tela",
    description: "Desitky cviku s detailnimi popisy a ilustracemi pro kazdodenni praxi.",
  },
  {
    title: "Rehabilitacni programy",
    description: "Komplexni programy pro navrat k pohybu po zraneni ci operaci.",
  },
  {
    title: "Prevence zraneni",
    description: "Jak predchazet beznym zranenim a udrzet telo odolne.",
  },
  {
    title: "Treninkove plany",
    description: "Hotove plany pro ruzne urovne zdatnosti - od zacatecniku po pokrocile.",
  },
];

const BOOK_FEATURES = [
  {
    icon: BookOpen,
    title: "Prakticky pruvodce",
    description: "Zadna teorie navic. Kazda stranka vas privede bliz ke zdravemu pohybu.",
  },
  {
    icon: GraduationCap,
    title: "20 let zkusenosti",
    description: "Autori s dlouholetou praxi ve fyzioterapii a sportovnim treninku.",
  },
  {
    icon: Users,
    title: "Pro vsechny urovne",
    description: "At uz zacinate nebo jste pokrocily, kniha se prizpusobi vasim potrebam.",
  },
  {
    icon: HeartPulse,
    title: "Pohyb jako lek",
    description: "Naucte se, jak vyuzit pohyb jako nastroj pro zlepseni celkoveho zdravi.",
  },
];

export function FyziotreninkAbout() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          O knize Fyziotrenink
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Pohyb jako lek - prakticky pruvodce funkcnim treninkem a rehabilitaci.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {BOOK_FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border bg-card p-8 transition-shadow hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 transition-colors group-hover:bg-foreground/10">
              <f.icon className="h-6 w-6 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FyziotreninkChapters() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5">
          <Layers className="h-6 w-6 text-foreground/70" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Co v knize najdete
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-2xl flex flex-col">
        {BOOK_CHAPTERS.map((ch, index) => (
          <div key={ch.title}>
            {index > 0 && <Separator />}
            <div className="flex items-start gap-5 py-7">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold">{ch.title}</h3>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {ch.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
