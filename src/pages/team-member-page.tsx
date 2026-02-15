import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from 'sonner'

interface TeamMember {
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
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

export default function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')

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

  const handleSendMessage = async () => {
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error('Vyplnte prosim vsechna pole')
      return
    }

    setSending(true)
    const mailtoLink = `mailto:${member?.email}?subject=Dotaz od ${encodeURIComponent(contactName)}&body=${encodeURIComponent(contactMessage)}%0A%0AOdpovedet na: ${encodeURIComponent(contactEmail)}`
    window.location.href = mailtoLink

    setTimeout(() => {
      toast.success('Email klient byl otevren')
      setSending(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
        <Users className="size-12 text-neutral-300 dark:text-neutral-700" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Clen tymu nenalezen
        </h2>
        <p className="text-sm text-neutral-500">
          Tento profil neexistuje nebo byl odstranen.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/tym">
            <Users className="mr-2 size-4" />
            Zpet na tym
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
                  >
                    <Home className="size-3.5" />
                    <span className="hidden sm:inline">Domov</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5 text-neutral-300 dark:text-neutral-600" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/tym"
                    className="text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
                  >
                    Tym
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5 text-neutral-300 dark:text-neutral-600" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-neutral-900 dark:text-neutral-100">
                  {member.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white dark:border-neutral-800/80 dark:bg-neutral-900/80"
            >
              <div className="relative h-72 overflow-hidden sm:h-96">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="border-0 bg-white/15 text-white backdrop-blur-md text-xs font-medium">
                      {member.role}
                    </Badge>
                    <Badge className="border-0 bg-emerald-500/20 text-emerald-200 backdrop-blur-md text-xs font-medium">
                      <CheckCircle2 className="mr-1 size-3" />
                      Overeny odbornik
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {member.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Award className="size-4" />
                      {member.experience_years} let praxe
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {member.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      4.9 hodnoceni
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-base leading-[1.75] text-neutral-600 dark:text-neutral-400">
                  {member.bio}
                </p>

                <Separator className="my-6 bg-neutral-100 dark:bg-neutral-800" />

                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    <ShieldCheck className="size-4 text-blue-500" />
                    Specializace
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {member.certifications.length > 0 && (
                  <>
                    <Separator className="my-6 bg-neutral-100 dark:bg-neutral-800" />
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <Award className="size-4 text-amber-500" />
                        Certifikace
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {member.certifications.map((cert) => (
                          <div
                            key={cert}
                            className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                          >
                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {cert}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {member.education.length > 0 && (
                  <>
                    <Separator className="my-6 bg-neutral-100 dark:bg-neutral-800" />
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        <GraduationCap className="size-4 text-blue-500" />
                        Vzdelani
                      </h3>
                      <div className="space-y-2">
                        {member.education.map((edu) => (
                          <div
                            key={edu}
                            className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                          >
                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                              <BookOpen className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {edu}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-5">
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="overflow-hidden border-neutral-200/60 shadow-sm dark:border-neutral-800">
                <div className="border-b border-neutral-100 bg-gradient-to-br from-blue-50 to-cyan-50/50 px-6 py-5 dark:border-neutral-800 dark:from-blue-950/30 dark:to-cyan-950/20">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Cena konzultace
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {formatCZK(member.hourly_rate)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">za 1 hodinu</p>
                  </div>

                  <Separator className="my-5 bg-neutral-100 dark:bg-neutral-800" />

                  <ul className="space-y-3">
                    {['Individualni pristup', 'Diagnostika zahrnuta', 'Cvicebni plan na miru'].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="border-neutral-200/60 shadow-sm dark:border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2.5 font-semibold text-neutral-900 dark:text-neutral-100">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <Mail className="size-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    Kontaktni udaje
                  </h3>
                  <div className="space-y-2.5">
                    <a
                      href={`mailto:${member.email}`}
                      className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 dark:border-neutral-800 dark:bg-neutral-800/30 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
                    >
                      <Mail className="size-4 text-neutral-400 transition-colors group-hover:text-blue-500" />
                      <span className="text-neutral-700 dark:text-neutral-300">{member.email}</span>
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-800/30 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30"
                    >
                      <Phone className="size-4 text-neutral-400 transition-colors group-hover:text-emerald-500" />
                      <span className="text-neutral-700 dark:text-neutral-300">{member.phone}</span>
                    </a>
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm dark:border-neutral-800 dark:bg-neutral-800/30">
                      <MapPin className="size-4 text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">{member.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="border-neutral-200/60 shadow-sm dark:border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2.5 font-semibold text-neutral-900 dark:text-neutral-100">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <Send className="size-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    Napiste mi zpravu
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Vase jmeno
                      </Label>
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Jan Novak"
                        className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Vas email
                      </Label>
                      <Input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="jan@email.cz"
                        className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Zprava
                      </Label>
                      <Textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Rad bych se objednal na konzultaci..."
                        rows={4}
                        className="mt-1.5 resize-none rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                      />
                    </div>
                    <Button
                      className="mt-1 w-full rounded-xl"
                      onClick={handleSendMessage}
                      disabled={sending || !contactName || !contactEmail || !contactMessage}
                    >
                      <Send className="mr-2 size-4" />
                      {sending ? 'Oteviram...' : 'Odeslat zpravu'}
                    </Button>
                    <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500">
                      Zprava bude odeslana na email {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
