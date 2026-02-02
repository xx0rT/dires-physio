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
  heading = "Poznejte Náš Technický Tým",
  description = "Inovativní myšlenky budující budoucnost technologií",
  members = [
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.jpg",
      name: "Sarah Chen",
      role: "Technická Ředitelka",
      description:
        "Bývalá inženýrka Google s 12 lety zkušeností v cloudové architektuře.",
      company: "TechCorp",
      location: "San Francisco, CA",
      bio: "Vášnivá cloudová architektura a distribuované systémy.",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      about:
        "S více než 12 lety zkušeností v cloudové architektuře jsem vedla týmy v Google a nyní sloužím jako CTO. Zaměřuji se na budování škálovatelných, odolných systémů, které pohánějí moderní aplikace.",
      experience: [
        {
          title: "Technická Ředitelka",
          company: "TechCorp",
          period: "2021 - Současnost",
          description:
            "Vedení technické strategie a inženýrských týmů.",
        },
        {
          title: "Senior Inženýrka",
          company: "Google",
          period: "2015 - 2021",
          description: "Cloudová infrastruktura a architektura.",
        },
      ],
      projects: [
        {
          name: "Cloudová Platforma",
          description: "Škálovatelná infrastruktura pro podnikové klienty.",
          tech: ["Kubernetes", "AWS", "Terraform"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.jpg",
      name: "Marcus Rodriguez",
      role: "Vedoucí Softwarový Inženýr",
      description: "Full-stack vývojář specializující se na React a Node.js.",
      company: "TechCorp",
      location: "Austin, TX",
      bio: "Vytváření elegantních řešení s moderními webovými technologiemi.",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      about:
        "Full-stack inženýr s vášní pro vytváření bezproblémových uživatelských zkušeností. Specializuji se na React, Node.js a moderní postupy vývoje webu.",
      experience: [
        {
          title: "Vedoucí Softwarový Inženýr",
          company: "TechCorp",
          period: "2020 - Současnost",
          description: "Vedení frontendových vývojových iniciativ.",
        },
      ],
      projects: [
        {
          name: "Webová Aplikace",
          description: "Moderní SaaS platforma obsluhující 100k+ uživatelů.",
          tech: ["React", "Node.js", "PostgreSQL"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.jpg",
      name: "Emily Watson",
      role: "Produktová Manažerka",
      description: "Datově řízená produktová stratégka se zkušenostmi v UX designu.",
      company: "TechCorp",
      location: "New York, NY",
      bio: "Propojování potřeb uživatelů a technických řešení.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Produktová manažerka zaměřená na vytváření datově řízených produktových strategií. Se zkušenostmi v UX designu přináším uživatelsky orientovaný přístup k vývoji produktů.",
      experience: [
        {
          title: "Produktová Manažerka",
          company: "TechCorp",
          period: "2019 - Současnost",
          description: "Vedení produktové strategie a plánu.",
        },
      ],
      projects: [
        {
          name: "Produktová Analytika",
          description: "Dashboard pro sledování metrik zapojení uživatelů.",
          tech: ["Analytika", "Vizualizace Dat"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.jpg",
      name: "David Kim",
      role: "DevOps Inženýr",
      description:
        "Expert na automatizaci infrastruktury, který zjednodušuje nasazování.",
      company: "TechCorp",
      location: "Seattle, WA",
      bio: "Automatizace všeho pro usnadnění života vývojářů.",
      socialLinks: {
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
      about:
        "DevOps inženýr specializující se na CI/CD pipelines a automatizaci infrastruktury. Jsem vášnivý, aby bylo nasazování rychlé, spolehlivé a bezstresové.",
      experience: [
        {
          title: "DevOps Inženýr",
          company: "TechCorp",
          period: "2018 - Současnost",
          description: "Budování a údržba infrastruktury nasazování.",
        },
      ],
      projects: [
        {
          name: "CI/CD Pipeline",
          description: "Automatizovaný systém nasazování snižující čas vydání o 80%.",
          tech: ["Jenkins", "Docker", "Kubernetes"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Lisa Thompson",
      role: "UX/UI Designérka",
      description: "Kreativní designérka vášnivá pro uživatelsky orientovaný design.",
      company: "TechCorp",
      location: "Portland, OR",
      bio: "Vytváření krásných a intuitivních uživatelských zkušeností.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "UX/UI designérka s vášní pro vytváření intuitivních, krásných rozhraní. Věřím, že skvělý design je neviditelný a dělá složité úkoly jednoduchými.",
      experience: [
        {
          title: "UX/UI Designérka",
          company: "TechCorp",
          period: "2017 - Současnost",
          description: "Navrhování uživatelských rozhraní a zkušeností.",
        },
      ],
      projects: [
        {
          name: "Design Systém",
          description: "Komplexní design systém pro konzistentní UX.",
          tech: ["Figma", "React", "Storybook"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Lisa Thompson",
      role: "UX/UI Designérka",
      description: "Kreativní designérka vášnivá pro uživatelsky orientovaný design.",
      company: "TechCorp",
      location: "Portland, OR",
      bio: "Vytváření krásných a intuitivních uživatelských zkušeností.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "UX/UI designérka s vášní pro vytváření intuitivních, krásných rozhraní. Věřím, že skvělý design je neviditelný a dělá složité úkoly jednoduchými.",
      experience: [
        {
          title: "UX/UI Designérka",
          company: "TechCorp",
          period: "2017 - Současnost",
          description: "Navrhování uživatelských rozhraní a zkušeností.",
        },
      ],
      projects: [
        {
          name: "Design Systém",
          description: "Komplexní design systém pro konzistentní UX.",
          tech: ["Figma", "React", "Storybook"],
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

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 overflow-hidden"
              asChild
            >
              <motion.div
                initial={clickedCardRect ? {
                  width: clickedCardRect.width,
                  height: clickedCardRect.height,
                  x: clickedCardRect.left - window.innerWidth / 2 + clickedCardRect.width / 2,
                  y: clickedCardRect.top - window.innerHeight / 2 + clickedCardRect.height / 2,
                  opacity: 0.8,
                  scale: 0.9,
                } : {
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  width: "auto",
                  height: "auto",
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  scale: 0.95,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                  mass: 0.8,
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
