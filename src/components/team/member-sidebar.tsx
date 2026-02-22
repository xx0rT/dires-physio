import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { TeamMember } from '@/pages/team-member-page'

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

export function MemberSidebar({ member }: { member: TeamMember }) {
  const [sending, setSending] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  const handleSendMessage = async () => {
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error('Vyplnte prosim vsechna pole')
      return
    }
    setSending(true)
    const mailtoLink = `mailto:${member.email}?subject=Dotaz od ${encodeURIComponent(contactName)}&body=${encodeURIComponent(contactMessage)}%0A%0AOdpovedet na: ${encodeURIComponent(contactEmail)}`
    window.location.href = mailtoLink
    setTimeout(() => {
      toast.success('Email klient byl otevren')
      setSending(false)
    }, 500)
  }

  return (
    <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Cena konzultace
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {formatCZK(member.hourly_rate)}
          </span>
          <span className="text-sm text-neutral-400">/ hodina</span>
        </div>
        <div className="mt-4 space-y-2">
          {['Individualni pristup', 'Diagnostika zahrnuta', 'Cvicebni plan na miru'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"
            >
              <CheckCircle2 className="size-3.5 text-emerald-500 dark:text-emerald-400" />
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Kontakt
        </h3>
        <div className="space-y-2.5">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <Mail className="size-3.5 text-neutral-400" />
            {member.email}
          </a>
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <Phone className="size-3.5 text-neutral-400" />
            {member.phone}
          </a>
          <div className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="size-3.5 text-neutral-400" />
            {member.location}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Napiste mi
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-neutral-500">Vase jmeno</Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Jan Novak"
              className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-500">Vas email</Label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="jan@email.cz"
              className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-neutral-500">Zprava</Label>
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
          <p className="text-center text-[11px] text-neutral-400">
            Zprava bude odeslana na {member.email}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
