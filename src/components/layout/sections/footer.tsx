import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/config/site";
import XIcon from "@/components/icons/x-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navigationLinks: FooterLink[] = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Obchod", href: "/obchod" },
  { label: "Blog", href: "/blog" },
  { label: "O nas", href: "/#benefits" },
  { label: "Tym", href: "/tym" },
  { label: "Cenik", href: "/#pricing" },
];

const legalLinks: FooterLink[] = [
  { label: "Ochrana soukromi", href: "#privacy" },
  { label: "Obchodni podminky", href: "#terms" },
  { label: "Soubory cookie", href: "#cookies" },
];

const socialLinks: SocialLink[] = [
  {
    label: "Twitter / X",
    href: site.links.twitter,
    icon: <XIcon className="size-4 fill-current" />,
  },
  {
    label: "LinkedIn",
    href: site.links.linkedin,
    icon: <LinkedInIcon className="size-4 fill-current" />,
  },
];

const MapSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Navstivte nas</h3>
        </div>
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.394269715919!2d14.403041690252623!3d50.079700516325545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1770755195968!5m2!1sen!2scz"
            className="h-[350px] w-full sm:h-[400px] lg:h-[450px]"
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

const FooterSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <>
      <MapSection />
      <footer ref={ref} id="footer" className="border-t bg-card/50">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="mb-6 inline-flex items-center gap-2.5">
                <motion.img
                  src={site.logo}
                  alt={site.name}
                  width={36}
                  height={36}
                  animate={isInView ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <span className="text-2xl font-bold tracking-tight">
                  {site.name}
                </span>
              </Link>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Profesionalni fyzioterapeuticke kurzy od certifikovanych ceskych
                odborniku. Komplexni vzdelavani kombinujici teorii, praxi a
                prakticke zkusenosti.
              </p>

              <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <a
                  href={`mailto:${site.mailSupport}`}
                  className="transition-colors hover:text-foreground"
                >
                  {site.mailSupport}
                </a>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Praha, Ceska republika
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-8 lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                  Navigace
                </h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                  Socialni site
                </h4>
                <ul className="space-y-3">
                  {socialLinks.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {social.icon}
                        <span>{social.label}</span>
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>

                <h4 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wider">
                  Pravni
                </h4>
                <ul className="space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider">
                Newsletter
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Prihlaste se k odberu novinek a ziskejte informace o novych
                kurzech a akcich.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="vas@email.cz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="icon" variant="outline">
                  <Send className="size-4" />
                </Button>
              </form>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {site.name}. Vsechna prava
              vyhrazena.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Vytvoreno s laskou od</span>
              <Link
                target="_blank"
                to="https://xx0rt.github.io/Tr0xx/"
                className="inline-flex items-center gap-1 font-semibold transition-colors hover:text-foreground"
              >
                <img
                  src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                  alt="Troxx"
                  width={16}
                  height={16}
                  className="inline-block"
                />
                Troxx
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export { FooterSection };
