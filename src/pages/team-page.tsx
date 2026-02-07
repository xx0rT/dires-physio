import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

interface TeamMember {
  id: string
  name: string
  role: string
  slug: string
  description: string
  specializations: string[]
  experience_years: number
  avatar_url: string
  hourly_rate: number
  location: string
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('id, name, role, slug, description, specializations, experience_years, avatar_url, hourly_rate, location')
        .eq('is_active', true)
        .order('order_index')
      setMembers(data ?? [])
      setLoading(false)
    }
    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-muted/40 px-6 py-16 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-[80px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center"
          >
            <Badge variant="outline" className="mb-4">Nas tym</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl lg:text-5xl">
              Nasi odbornici
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
              Tym certifikovanych fyzioterapeutu s letitymi zkusenostmi.
              Vyberte si sveho specialistu a objednejte se na konzultaci.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                to={`/team/${member.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-white/80">{member.role}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {member.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {member.specializations.slice(0, 3).map((spec) => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {spec}
                      </Badge>
                    ))}
                    {member.specializations.length > 3 && (
                      <Badge variant="outline" className="text-[10px] font-normal">
                        +{member.specializations.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Award className="size-3.5" />
                        {member.experience_years} let praxe
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {member.location}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {formatCZK(member.hourly_rate)}
                        </span>
                        <span className="ml-1 text-xs text-neutral-500">/ hod</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        Detail
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="py-20 text-center text-neutral-500">
            Zatim nejsou zadni clenove tymu.
          </div>
        )}
      </div>
    </div>
  )
}
