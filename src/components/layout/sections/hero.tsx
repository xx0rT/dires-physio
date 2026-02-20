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
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <img
        src="/pattern_(kopie).png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.06] mix-blend-multiply dark:opacity-[0.04]"
      />

      <motion.div
        className="container relative"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <motion.h1
              className="text-4xl leading-[1.15] font-semibold tracking-tight md:text-5xl lg:text-[3.5rem]"
              variants={fadeUp}
            >
              Náš tým{" "}
              {tooltipItems.length > 0 && (
                <span className="inline-flex items-center gap-4 align-middle">
                  <span className="relative flex items-center">
                    <span className="flex [&>div:nth-child(1)]:-rotate-3 [&>div:nth-child(2)]:rotate-2 [&>div:nth-child(3)]:-rotate-1 [&>div]:transition-transform [&>div]:duration-300 [&>div:hover]:rotate-0">
                      <AnimatedTooltip items={tooltipItems} />
                    </span>
                  </span>
                </span>
              )}{" "}
              vytváří profesionální vzdělávání v oblasti fyzioterapie.
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl"
              variants={fadeUp}
            >
              Od myšlenky k realizaci — připravujeme ucelené kurzy,
              certifikace a nástroje pro fyzioterapeuty všech úrovní.
            </motion.p>

            <motion.div className="flex flex-wrap gap-3" variants={fadeUp}>
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

          <motion.div
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl lg:pt-4"
            variants={fadeUp}
          >
            <img
              src="/MG_0170-1024x683-1.jpg.webp"
              alt="Dires tým při práci"
              className="h-full w-full rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
