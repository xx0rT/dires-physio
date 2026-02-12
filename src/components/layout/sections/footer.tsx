import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Car,
  Clock,
  Footprints,
  Mail,
  MapPin,
  Phone,
  Train,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Obchod", href: "/obchod" },
  { label: "Blog", href: "/blog" },
  { label: "Cenik", href: "/#pricing" },
  { label: "Tym", href: "/tym" },
];

const SOCIAL_LINKS = [
  { label: "Linkedin", href: site.links.linkedin },
  { label: "Twitter", href: site.links.twitter },
];

const LEGAL_LINKS = [
  { label: "Ochrana soukromi", href: "#privacy" },
  { label: "Obchodni podminky", href: "#terms" },
];

const DEFAULT_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.394269715919!2d14.403041690252623!3d50.079700516325545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1770755195968!5m2!1sen!2scz";

const TRAVEL_MODES = [
  {
    id: "default",
    label: "Mapa",
    icon: MapPin,
    src: DEFAULT_MAP_SRC,
  },
  {
    id: "car",
    label: "Autem",
    icon: Car,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=d&output=embed",
  },
  {
    id: "transit",
    label: "MHD",
    icon: Train,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=r&output=embed",
  },
  {
    id: "walking",
    label: "Pesky",
    icon: Footprints,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=w&output=embed",
  },
] as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [activeMode, setActiveMode] = useState("default");

  const currentSrc =
    TRAVEL_MODES.find((m) => m.id === activeMode)?.src ?? DEFAULT_MAP_SRC;

  return (
    <footer className="mx-3 mt-16 mb-4 overflow-hidden rounded-2xl bg-neutral-900 text-neutral-300 sm:mx-5 lg:mx-6">
      <motion.div
        className="mx-auto max-w-7xl px-5 pt-10 pb-6 sm:px-8 lg:px-12"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* ── Newsletter CTA bar ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-start gap-4 rounded-xl bg-neutral-800/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-white">
              Odeberte novinky z fyzioterapie
            </h3>
            <p className="mt-0.5 text-sm text-neutral-400">
              Tipy, kurzy a akce primo do vasi schranky.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <Input
              type="email"
              placeholder="vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full min-w-[200px] rounded-lg border-neutral-700 bg-neutral-900/80 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600 sm:w-56"
            />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                type="submit"
                size="sm"
                className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
              >
                Odebírat
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* ── Main grid: brand + nav columns + map/contact ── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left column: brand + nav links */}
          <motion.div variants={fadeUp} className="space-y-6">
            <div>
              <Link to="/" className="inline-block">
                <img
                  src="/logo.svg"
                  alt={site.name}
                  className="h-7 invert"
                />
              </Link>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-400">
                {site.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 text-[13px]">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                  Navigace
                </p>
                <ul className="space-y-1.5">
                  {NAVIGATION.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-neutral-400 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                  Socialni site
                </p>
                <ul className="space-y-1.5">
                  {SOCIAL_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-neutral-400 transition-colors hover:text-white"
                      >
                        {item.label}
                        <ArrowUpRight className="size-3 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                  Kontakt
                </p>
                <ul className="space-y-1.5 text-neutral-400">
                  <li className="flex items-center gap-2">
                    <Mail className="size-3.5 text-neutral-500" />
                    <a
                      href={`mailto:${site.mailSupport}`}
                      className="hover:text-white transition-colors"
                    >
                      {site.mailSupport}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="size-3.5 text-neutral-500" />
                    <span>+420 123 456 789</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="size-3.5 text-neutral-500" />
                    <span>Po-Pa 8:00 - 18:00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-neutral-500" />
                    <span>Praha, Ceska republika</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right column: map */}
          <motion.div variants={fadeUp}>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                <MapPin className="size-3.5" />
                Kde nas najdete
              </h4>
              <div className="flex gap-1">
                {TRAVEL_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = activeMode === mode.id;
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                        isActive
                          ? "text-white"
                          : "text-neutral-500 hover:text-neutral-300"
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="travel-pill"
                          className="absolute inset-0 rounded-md bg-neutral-800"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        <Icon className="size-3" />
                        {mode.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-neutral-800">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={activeMode}
                  src={currentSrc}
                  className="aspect-[4/3] w-full lg:aspect-[16/10]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dires fyzio location"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-5 text-[11px] text-neutral-500 sm:flex-row"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>&copy; {new Date().getFullYear()} {site.name}</span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-neutral-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <span className="inline-flex items-center gap-1">
            Vytvoreno
            <Link
              target="_blank"
              to="https://xx0rt.github.io/Tr0xx/"
              className="inline-flex items-center gap-0.5 font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <img
                src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                alt="Troxx"
                width={13}
                height={13}
                className="invert"
              />
              Troxx
            </Link>
          </span>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export { FooterSection };
