import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { MemberHeroSection } from '@/components/team/member-hero-section'
import { MemberContentSections } from '@/components/team/member-content-sections'
import { MemberSidebar } from '@/components/team/member-sidebar'

export interface TeamMember {
  id: string
  name: string
  role: string
  slug: string
  description: string
  bio: string
  specializations: string[]
  experience_years: number
  avatar_url: string
  hourly_rate: number
  email: string
  phone: string
  location: string
  certifications: string[]
  education: string[]
  gallery_images: string[]
}

export default function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMember = async () => {
      if (!slug) return
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle()
      setMember(data)
      setLoading(false)
    }
    fetchMember()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100"
        />
      </div>
    )
  }

  if (!member) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[500px] flex-col items-center justify-center gap-4"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <Users className="size-7 text-neutral-400" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Clen tymu nenalezen
        </h2>
        <p className="text-sm text-neutral-500">
          Tento profil neexistuje nebo byl odstranen.
        </p>
        <Button asChild variant="outline" className="mt-2 rounded-xl">
          <Link to="/tym">
            <ArrowLeft className="mr-2 size-4" />
            Zpet na tym
          </Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="pb-24">
      <MemberHeroSection member={member} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <MemberContentSections member={member} />
          <MemberSidebar member={member} />
        </div>
      </div>
    </div>
  )
}
