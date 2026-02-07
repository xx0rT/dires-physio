import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Clen tymu nenalezen</h2>
        <Button asChild className="mt-4">
          <Link to="/team">Zpet na tym</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/team"
            className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="size-4" />
            Zpet na tym
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="relative h-64 overflow-hidden sm:h-80">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">
                    {member.role}
                  </Badge>
                  <h1 className="text-3xl font-bold text-white sm:text-4xl">{member.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Award className="size-4" />
                      {member.experience_years} let praxe
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {member.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="prose prose-neutral max-w-none dark:prose-invert">
                  <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {member.bio}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    <ShieldCheck className="size-4 text-primary" />
                    Specializace
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec) => (
                      <Badge
                        key={spec}
                        variant="outline"
                        className="border-primary/20 bg-primary/5 text-sm"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {member.certifications.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        <Award className="size-4 text-primary" />
                        Certifikace
                      </h3>
                      <ul className="space-y-2">
                        {member.certifications.map((cert) => (
                          <li key={cert} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {member.education.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        <GraduationCap className="size-4 text-primary" />
                        Vzdelani
                      </h3>
                      <ul className="space-y-2">
                        {member.education.map((edu) => (
                          <li key={edu} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <BookOpen className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className="bg-primary/5 px-6 py-5">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Cena konzultace
                  </h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCZK(member.hourly_rate)}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">za 1 hodinu</p>
                </div>

                <Separator className="my-4" />

                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-green-600" />
                    Individualni pristup
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-green-600" />
                    Diagnostika zahrnuta
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-green-600" />
                    Cvicebni plan na miru
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  <Mail className="size-4 text-primary" />
                  Kontaktni udaje
                </h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 dark:border-neutral-800"
                  >
                    <Mail className="size-4 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{member.email}</span>
                  </a>
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 dark:border-neutral-800"
                  >
                    <Phone className="size-4 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{member.phone}</span>
                  </a>
                  <div className="flex items-center gap-3 rounded-lg border p-3 text-sm dark:border-neutral-800">
                    <MapPin className="size-4 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{member.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  <Send className="size-4 text-primary" />
                  Napiste mi zpravu
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Vase jmeno</Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jan Novak"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Vas email</Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jan@email.cz"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Zprava</Label>
                    <Textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Rad bych se objednal na konzultaci..."
                      rows={4}
                      className="mt-1 resize-none"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSendMessage}
                    disabled={sending || !contactName || !contactEmail || !contactMessage}
                  >
                    <Send className="mr-2 size-4" />
                    {sending ? 'Oteviram...' : 'Odeslat zpravu'}
                  </Button>
                  <p className="text-center text-xs text-neutral-400">
                    Zprava bude odeslana na email {member.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
