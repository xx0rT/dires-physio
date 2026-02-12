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
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [activeMode, setActiveMode] = useState("default");

  const currentSrc =
    TRAVEL_MODES.find((m) => m.id === activeMode)?.src ?? DEFAULT_MAP_SRC;

  return (
    <footer className="mx-4 mt-20 mb-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden sm:mx-6 lg:mx-8">
      <motion.div
        className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-14"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* ── Top: brand + nav + social ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <motion.div variants={fadeUp} className="space-y-2 lg:max-w-sm">
            <Link to="/" className="inline-block">
              <img
                src="/logo.svg"
                alt={site.name}
                className="h-7 dark:invert"
              />
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {site.description}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-x-10 gap-y-6 text-[13px]"
          >
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                Navigace
              </p>
              <ul className="space-y-1.5">
                {NAVIGATION.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                Socialni site
              </p>
              <ul className="space-y-1.5">
                {SOCIAL_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      {item.label}
                      <ArrowUpRight className="size-3 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                Kontakt
              </p>
              <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 text-neutral-400" />
                  <a
                    href={`mailto:${site.mailSupport}`}
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {site.mailSupport}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 text-neutral-400" />
                  <span>+420 123 456 789</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="size-3.5 text-neutral-400" />
                  <span>Po-Pa 8:00 - 18:00</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          variants={fadeUp}
          className="my-10 h-px bg-neutral-200 dark:bg-neutral-800"
        />

        {/* ── Map section ── */}
        <motion.div variants={fadeUp}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              <MapPin className="size-3.5" />
              Kde nas najdete
            </h4>

            <div className="flex gap-1.5">
              {TRAVEL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="travel-pill"
                        className="absolute inset-0 rounded-lg bg-white dark:bg-neutral-800 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="size-3.5" />
                      {mode.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={activeMode}
                src={currentSrc}
                className="aspect-[21/7] w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dires fyzio location"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          variants={fadeUp}
          className="my-10 h-px bg-neutral-200 dark:bg-neutral-800"
        />

        {/* ── Bottom: newsletter + legal + credit ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.form
            variants={fadeUp}
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex w-full max-w-sm items-end border-b border-neutral-300 dark:border-neutral-700"
          >
            <Input
              type="email"
              placeholder="Newsletter - vas email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-0 !bg-transparent px-0 text-sm shadow-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:ring-0"
            />
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Button type="submit" variant="ghost" size="sm" className="px-2">
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400"
          >
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <span className="hidden sm:inline">|</span>
            <span>
              &copy; {new Date().getFullYear()} {site.name}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1">
              Vytvoreno
              <Link
                target="_blank"
                to="https://xx0rt.github.io/Tr0xx/"
                className="inline-flex items-center gap-0.5 font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                <img
                  src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                  alt="Troxx"
                  width={14}
                  height={14}
                  className="dark:invert"
                />
                Troxx
              </Link>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export { FooterSection };
