"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";

import UserProfile6, { type User } from "@/components/team/user-profile-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TeamMember {
  image: string;
  name: string;
  role: string;
  description: string;
  company?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  about?: string;
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
}

interface TeamMemberCardProps {
  member: TeamMember;
  highlighted?: boolean;
  onClick?: () => void;
}

const TeamMemberCard = memo(
  ({ member, highlighted = false, onClick }: TeamMemberCardProps) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex flex-col gap-4 px-2 md:px-5 md:pt-8",
          highlighted && "md:py-0 md:pb-4",
          onClick && "cursor-pointer",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2 pt-4 md:flex-row md:items-center",
            !highlighted && "border-b pb-4 md:border-b-2",
          )}
        >
          <img
            src={member.image}
            alt={`${member.name} Profile Picture`}
            className="size-full rounded border object-cover md:size-12"
          />

          <div className="flex flex-col gap-1 tracking-tight">
            <p className="line-clamp-1">{member.name}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {member.role}
            </p>
          </div>
        </div>
        {highlighted && (
          <>
            <span className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500" />
            <p className="line-clamp-2 text-xs">{member.description}</p>
          </>
        )}
      </div>
    );
  },
);
TeamMemberCard.displayName = "TeamMemberCard";

interface Team11Props {
  heading?: string;
  description?: string;
  members?: TeamMember[];
  className?: string;
}

const Team11 = ({
  className,
  heading = "Poznejte Náš Odborný Tým",
  description = "Zkušení fyzioterapeuti a specialisté věnující se vašemu zdraví",
  members = [
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.jpg",
      name: "MUDr. Jana Nováková",
      role: "Vedoucí Fyzioterapeutka",
      description:
        "Specialistka na sportovní medicínu s 15 lety praxe v rehabilitaci.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Věnuji se komplexní rehabilitaci a sportovní fyzioterapii.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "S více než 15 lety zkušeností v oblasti fyzioterapie se specializuji na sportovní medicínu a rehabilitaci pohybového aparátu. Pomohla jsem stovkám pacientů vrátit se k aktivnímu životnímu stylu.",
      experience: [
        {
          title: "Vedoucí Fyzioterapeutka",
          company: "FyzioKlinika Praha",
          period: "2015 - Současnost",
          description:
            "Vedení rehabilitačního týmu a péče o pacienty se sportovními úrazy.",
        },
        {
          title: "Fyzioterapeutka",
          company: "Nemocnice Na Homolce",
          period: "2009 - 2015",
          description: "Pooperační rehabilitace a péče o pacienty s chronickými potížemi.",
        },
      ],
      projects: [
        {
          name: "Sportovní Rehabilitace",
          description: "Program pro návrat sportovců po zranění kolene.",
          tech: ["McKenzie metoda", "Kinesiotaping", "PNF"],
        },
        {
          name: "Preventivní Program",
          description: "Cvičební program pro prevenci bolestí zad.",
          tech: ["Pilates", "Core stabilizace", "Funkční trénink"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.jpg",
      name: "Mgr. Petr Svoboda",
      role: "Fyzioterapeut",
      description: "Specialista na manuální terapii a léčbu bolestí páteře.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Zaměřuji se na diagnostiku a léčbu vertebrogenních potíží.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Fyzioterapeut specializující se na manuální terapii a léčbu bolestí páteře. Používám moderní terapeutické přístupy pro efektivní zmírnění bolesti a obnovu pohyblivosti.",
      experience: [
        {
          title: "Fyzioterapeut",
          company: "FyzioKlinika Praha",
          period: "2012 - Současnost",
          description: "Diagnostika a léčba vertebrogenních potíží.",
        },
        {
          title: "Fyzioterapeut",
          company: "Rehabilitační centrum Ládví",
          period: "2008 - 2012",
          description: "Komplexní péče o pacienty s neurologickými onemocněními.",
        },
      ],
      projects: [
        {
          name: "Terapie Bolesti Zad",
          description: "Individuální terapeutický program pro chronické bolesti.",
          tech: ["Manuální terapie", "Mobilizace", "Myofasciální release"],
        },
        {
          name: "Léčba Migrén",
          description: "Terapie cervikogenních bolestí hlavy.",
          tech: ["Kraniosacrální terapie", "Trigger point", "Relaxační techniky"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.jpg",
      name: "Bc. Markéta Dvořáková",
      role: "Fyzioterapeutka",
      description: "Specialistka na dětskou fyzioterapii a vývojové poruchy.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Pomáhám dětem s jejich pohybovým vývojem a odstraňuji dysbalance.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Fyzioterapeutka se zaměřením na dětskou rehabilitaci a léčbu vývojových poruch. S láskou a trpělivostí pomáhám dětem dosáhnout jejich plného pohybového potenciálu.",
      experience: [
        {
          title: "Dětská Fyzioterapeutka",
          company: "FyzioKlinika Praha",
          period: "2016 - Současnost",
          description: "Péče o děti s vývojovými poruchami a pohybovými obtížemi.",
        },
        {
          title: "Fyzioterapeutka",
          company: "Dětská nemocnice FN Motol",
          period: "2013 - 2016",
          description: "Rehabilitace dětských pacientů po úrazech a operacích.",
        },
      ],
      projects: [
        {
          name: "Raná Péče",
          description: "Program pro děti s opožděným motorickým vývojem.",
          tech: ["Vojtova metoda", "Bobath koncept", "Senzomotorická stimulace"],
        },
        {
          name: "Dětská Skolióza",
          description: "Terapie a prevence skoliotického držení těla.",
          tech: ["Schrothova metoda", "Posturální cvičení", "Dýchací gymnastika"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.jpg",
      name: "Mgr. Tomáš Procházka",
      role: "Fyzioterapeut a Masér",
      description:
        "Expert na sportovní masáže a regeneraci po výkonu.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Specializuji se na sportovní masáže a uvolnění svalového napětí.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Fyzioterapeut a masér se zaměřením na sportovní masáže a regeneraci. Pracuji s profesionálními sportovci i rekreačními cvičenci na optimalizaci jejich výkonu a prevenci zranění.",
      experience: [
        {
          title: "Fyzioterapeut a Masér",
          company: "FyzioKlinika Praha",
          period: "2014 - Současnost",
          description: "Sportovní masáže a regenerace po výkonu.",
        },
        {
          title: "Sportovní Masér",
          company: "SK Slavia Praha",
          period: "2010 - 2014",
          description: "Péče o profesionální fotbalisty a jejich regeneraci.",
        },
      ],
      projects: [
        {
          name: "Sportovní Regenerace",
          description: "Komplexní regenerační program pro sportovce.",
          tech: ["Hluboká masáž", "Lymfodrenáž", "Suchá jehla"],
        },
        {
          name: "Prevence Zranění",
          description: "Program pro prevenci svalových zranění u běžců.",
          tech: ["Fasciální techniky", "Stretching", "Foam rolling"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Bc. Lucie Černá",
      role: "Fyzioterapeutka",
      description: "Specialistka na ženské zdraví a poporodní rehabilitaci.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Věnuji se péči o ženy v těhotenství a po porodu.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Fyzioterapeutka specializující se na ženské zdraví, těhotenskou a poporodní rehabilitaci. Pomáhám ženám vrátit se k plné funkčnosti pánevního dna a odstraňuji poporodní dysbalance.",
      experience: [
        {
          title: "Fyzioterapeutka - Ženské Zdraví",
          company: "FyzioKlinika Praha",
          period: "2015 - Současnost",
          description: "Těhotenská příprava a poporodní rehabilitace.",
        },
        {
          title: "Fyzioterapeutka",
          company: "Porodnice U Apolináře",
          period: "2011 - 2015",
          description: "Péče o těhotné a šestinedělky.",
        },
      ],
      projects: [
        {
          name: "Poporodní Regenerace",
          description: "Komplexní program pro návrat ke kondici po porodu.",
          tech: ["Cvičení pánevního dna", "Diastáza", "Core aktivace"],
        },
        {
          name: "Těhotenská Příprava",
          description: "Cvičení pro těhotné ženy a příprava na porod.",
          tech: ["Dýchací techniky", "Relaxace", "Porodní pozice"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar6.jpg",
      name: "Mgr. Martin Kučera",
      role: "Fyzioterapeut",
      description: "Specialista na neurologickou rehabilitaci a léčbu po CMP.",
      company: "FyzioKlinika Praha",
      location: "Praha, Česká republika",
      bio: "Pomáhám pacientům s neurologickými onemocněními zlepšit kvalitu života.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Fyzioterapeut se zaměřením na neurologickou rehabilitaci. Specializuji se na práci s pacienty po cévní mozkové příhodě, s Parkinsonovou chorobou a jinými neurologickými onemocněními.",
      experience: [
        {
          title: "Neurorehabilitační Fyzioterapeut",
          company: "FyzioKlinika Praha",
          period: "2013 - Současnost",
          description: "Rehabilitace pacientů s neurologickými onemocněními.",
        },
        {
          title: "Fyzioterapeut",
          company: "Neurologická klinika VFN",
          period: "2008 - 2013",
          description: "Péče o hospitalizované pacienty po CMP.",
        },
      ],
      projects: [
        {
          name: "Rehabilitace po CMP",
          description: "Intenzivní program pro návrat mobility po mrtvici.",
          tech: ["Bobath koncept", "PNF", "Constraint-induced movement therapy"],
        },
        {
          name: "Parkinsonova Choroba",
          description: "Terapeutický program pro zpomalení progrese onemocnění.",
          tech: ["LSVT BIG", "Funkční trénink", "Rovnováhové cvičení"],
        },
      ],
    },
  ],
}: Team11Props) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedCardRect, setClickedCardRect] = useState<DOMRect | null>(null);

  const handleMemberClick = (member: TeamMember, event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    setClickedCardRect(rect);
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const memberToUser = (member: TeamMember): User => ({
    name: member.name,
    avatar: member.image,
    role: member.role,
    company: member.company,
    location: member.location,
    bio: member.bio,
    socialLinks: member.socialLinks,
    about: member.about || member.description,
    experience: member.experience,
    projects: member.projects,
  });

  return (
    <>
      <section id="team" className={cn("py-32", className)}>
        <div className="container mx-auto">
          <div className="flex flex-col gap-14 items-center justify-center">
            <div className="flex flex-col gap-4 border-b-2 pb-6 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-light tracking-tight lg:text-6xl">
                {heading}
              </h3>
              <p className="text-sm tracking-tight text-muted-foreground lg:text-lg">
                {description}
              </p>
            </div>
            <ul
              onMouseLeave={() => setHoveredMember(null)}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto max-w-6xl w-full"
            >
              {members.map((member, index) => {
                return (
                  <li
                    key={`team-11-member-${index}`}
                    onMouseEnter={() => setHoveredMember(index)}
                    className="relative"
                  >
                    <div onClick={(e) => handleMemberClick(member, e)}>
                      <TeamMemberCard
                        member={member}
                        onClick={() => {}}
                      />
                    </div>

                    {hoveredMember === index && (
                      <motion.div
                        layoutId="team-11-member-card"
                        transition={{
                          layout: {
                            duration: 0.2,
                            type: "spring",
                            bounce: 0.1,
                          },
                        }}
                        className="pointer-events-none absolute inset-0 z-10 hidden h-max rounded-2xl bg-background shadow-lg md:block dark:border"
                      >
                        <TeamMemberCard member={member} highlighted />
                      </motion.div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
              <motion.div
                initial={clickedCardRect ? {
                  opacity: 0,
                  scale: 0.8,
                  y: 20,
                } : {
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.95,
                  opacity: 0,
                  y: 10,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  mass: 0.5,
                }}
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedMember?.name}</DialogTitle>
                </DialogHeader>
                {selectedMember && <UserProfile6 user={memberToUser(selectedMember)} />}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export { Team11 };
export const TeamSection = Team11;
