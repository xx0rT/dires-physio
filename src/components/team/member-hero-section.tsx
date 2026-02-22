import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Award,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Star,
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { TeamMember } from '@/pages/team-member-page'

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

export function MemberHeroSection({ member }: { member: TeamMember }) {
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div ref={heroRef} className="relative h-[520px] overflow-hidden sm:h-[600px] lg:h-[680px]">
      <motion.div
        className="absolute inset-0"
        style={{ y: heroImageY, scale: heroScale }}
      >
        <img
          src={member.avatar_url}
          alt={member.name}
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      <div className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Breadcrumb>
              <BreadcrumbList className="text-xs sm:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-1.5 text-white/50 transition-colors hover:text-white/90"
                    >
                      <Home className="size-3.5" />
                      <span className="hidden sm:inline">Domov</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5 text-white/30" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/tym"
                      className="text-white/50 transition-colors hover:text-white/90"
                    >
                      Tym
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5 text-white/30" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-white/90">
                    {member.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-white/50"
            >
              {member.role}
            </motion.p>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {member.name}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
            >
              {member.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/45"
            >
              <span className="flex items-center gap-1.5">
                <Award className="size-3.5 text-white/35" />
                {member.experience_years} let zkusenosti
              </span>
              <span className="hidden text-white/20 sm:inline">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-white/35" />
                {member.location}
              </span>
              <span className="hidden text-white/20 sm:inline">|</span>
              <span className="flex items-center gap-1.5">
                <Star className="size-3.5 text-amber-400/70" />
                4.9 hodnoceni
              </span>
              <span className="hidden text-white/20 sm:inline">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-white/35" />
                {formatCZK(member.hourly_rate)} / hod
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
