import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/config/site";

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

const FOOTER_LINKS = [
  { label: "Ochrana soukromi", href: "#privacy" },
  { label: "Obchodni podminky", href: "#terms" },
];

const MapSection = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Navstivte nas</h3>
        </div>
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.394269715919!2d14.403041690252623!3d50.079700516325545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1770755195968!5m2!1sen!2scz"
            className="aspect-[21/9] w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dires fyzio location"
          />
        </div>
      </div>
    </section>
  );
};

interface Footer31Props {
  className?: string;
}

const Footer31 = ({ className }: Footer31Props) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", name);
    setName("");
  };

  return (
    <section
      className={cn("dark bg-background py-32 text-foreground", className)}
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-15 lg:flex-row">
          <div className="flex flex-col gap-10">
            <p className="relative text-4xl font-medium tracking-tight lg:text-5xl">
              Odemknete 50+ kurzu nyni
            </p>
            <div className="space-y-1 text-sm font-light tracking-tight lg:text-base">
              <p>Podpora : </p>
              <a href={`mailto:${site.mailSupport}`}>{site.mailSupport}</a>
            </div>
          </div>
          <div className="grid w-full max-w-xs grid-cols-2 gap-10 text-sm font-light lg:text-base">
            <ul className="space-y-1">
              {NAVIGATION.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="tracking-tight text-foreground hover:text-foreground/30"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 tracking-tight text-foreground hover:text-foreground/30"
                  >
                    {item.label}{" "}
                    <ArrowUpRight className="size-3.5 text-foreground group-hover:text-muted-foreground/50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-15 lg:flex-row">
          <div className="flex w-full max-w-md flex-col gap-10">
            <div className="space-y-1 text-sm font-light tracking-tight lg:text-base">
              <p>Prihlaste se k odberu : </p>
              <form
                onSubmit={handleSubmit}
                className="flex w-full items-end border-b border-b-foreground/10"
              >
                <Input
                  type="text"
                  placeholder="Jmeno*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-10 rounded-none border-0 !bg-transparent p-0 uppercase shadow-none placeholder:text-foreground/20 focus-visible:ring-0 lg:text-base"
                />
                <Button type="submit" variant="ghost">
                  <ArrowRight />
                </Button>
              </form>
            </div>
          </div>
          <div className="grid w-full max-w-xs grid-cols-2 gap-10 text-sm font-light lg:text-base">
            <div className="w-32">Praha, Ceska republika</div>
            <ul className="space-y-1">
              {FOOTER_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="group flex items-center gap-1 tracking-tight text-foreground hover:text-foreground/30"
                  >
                    {item.label}{" "}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 w-full lg:mt-32">
          <LogoSvg />
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 sm:flex-row">
          <p className="text-sm font-light text-foreground/50">
            &copy; {new Date().getFullYear()} {site.name}. Vsechna prava
            vyhrazena.
          </p>
          <div className="flex items-center gap-2 text-sm font-light text-foreground/50">
            <span>Vytvoreno s laskou od</span>
            <Link
              target="_blank"
              to="https://xx0rt.github.io/Tr0xx/"
              className="inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              <img
                src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                alt="Troxx"
                width={16}
                height={16}
                className="inline-block invert"
              />
              Troxx
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const LogoSvg = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const pathVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <motion.svg
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewBox="0 0 900 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <motion.text
        variants={pathVariants}
        x="50%"
        y="75%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        className="text-[180px] font-bold tracking-tighter"
        style={{ fontFamily: "inherit" }}
      >
        DIRES
      </motion.text>
    </motion.svg>
  );
};

const FooterSection = () => {
  return (
    <>
      <MapSection />
      <Footer31 />
    </>
  );
};

export { FooterSection, Footer31 };
