import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { AnimatedTooltip } from "@/components/magicui/animated-tooltip"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar_url: string
}

const ease = [0.25, 0.4, 0.25, 1] as const

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const HeroSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id, name, role, avatar_url")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data }) => setMembers(data ?? []))
  }, [])

  const tooltipItems = members.map((m, i) => ({
    id: i + 1,
    name: m.name,
    designation: m.role,
    image: m.avatar_url,
  }))

  return (
    <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full select-none object-cover opacity-[0.07] mix-blend-multiply dark:opacity-[0.04]"
        />
      </div>

      <motion.div
        className="container relative z-10"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div className="relative mb-8 pt-10" variants={fadeUp}>
            {tooltipItems.length > 0 && (
              <span className="relative z-50 flex items-center justify-center [&>div:nth-child(1)]:-rotate-3 [&>div:nth-child(2)]:rotate-2 [&>div:nth-child(3)]:-rotate-1 [&>div]:transition-transform [&>div]:duration-300 [&>div:hover]:rotate-0">
                <AnimatedTooltip items={tooltipItems} />
              </span>
            )}
          </motion.div>

          <motion.h1
            className="text-4xl leading-[1.15] font-semibold tracking-tight md:text-5xl lg:text-[3.5rem]"
            variants={fadeUp}
          >
            Náš tým vytváří profesionální vzdělávání v oblasti fyzioterapie.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            variants={fadeUp}
          >
            Od myšlenky k realizaci — připravujeme ucelené kurzy,
            certifikace a nástroje pro fyzioterapeuty všech úrovní.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap justify-center gap-3" variants={fadeUp}>
            <Button size="lg" asChild>
              <Link to="/registrace">
                Začít zdarma
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/kurzy">Prozkoumat kurzy</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
