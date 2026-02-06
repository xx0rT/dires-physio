import { motion } from 'framer-motion'
import { BookOpen, Clock, Lock, Play, Check, Eye, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type CourseStatus = 'available' | 'purchased' | 'completed' | 'locked' | 'locked_daily'

interface CourseCardProps {
  id: string
  title: string
  description: string
  lessonsCount: number
  duration: number
  price: number
  status: CourseStatus
  index: number
  isAuthenticated: boolean
  buying?: boolean
  onBuy: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function CourseCard({
  id,
  title,
  description,
  lessonsCount,
  duration,
  price,
  status,
  index,
  isAuthenticated,
  buying,
  onBuy,
  onPreview,
}: CourseCardProps) {
  const isLocked = status === 'locked' || status === 'locked_daily'
  const isCompleted = status === 'completed'
  const isPurchased = status === 'purchased'

  const iconBg = isCompleted
    ? 'bg-emerald-500'
    : isLocked
      ? 'bg-gray-400 dark:bg-gray-600'
      : 'bg-primary'

  const Icon = isLocked ? Lock : isCompleted ? Check : BookOpen

  const formattedPrice = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-start"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.35,
          delay: index * 0.08 + 0.15,
          type: 'spring',
          stiffness: 280,
          damping: 22,
        }}
        className={`relative z-10 -mr-5 mt-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg ${iconBg}`}
      >
        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
      </motion.div>

      <div
        className={`flex-1 rounded-2xl border bg-card px-6 py-5 pl-9 transition-all duration-200 ${
          isLocked
            ? 'opacity-60'
            : isCompleted
              ? 'border-emerald-200 dark:border-emerald-900/50'
              : 'hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <h3 className="text-lg font-bold">{title}</h3>
            {isLocked && (
              <Badge variant="secondary" className="shrink-0 gap-1 text-[11px] font-normal">
                <Lock className="h-2.5 w-2.5" />
                Zamceno
              </Badge>
            )}
            {isCompleted && (
              <Badge className="shrink-0 gap-1 bg-emerald-500 text-[11px] font-normal hover:bg-emerald-600">
                <Check className="h-2.5 w-2.5" />
                Dokonceno
              </Badge>
            )}
            {isPurchased && (
              <Badge className="shrink-0 gap-1 bg-primary text-[11px] font-normal">
                <Check className="h-2.5 w-2.5" />
                Zakoupeno
              </Badge>
            )}
          </div>
          {!isPurchased && !isCompleted && (
            <span className="text-lg font-bold text-primary shrink-0">{formattedPrice}</span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground mb-4">{description}</p>

        <div className="flex items-center gap-4 text-[13px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Play className="h-3.5 w-3.5" fill="currentColor" />
            {lessonsCount} videi
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {duration} minut
          </span>
        </div>

        <div className="flex items-center gap-3">
          {status === 'available' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(id)}
                className="rounded-full px-5 gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                Nahlednout
              </Button>
              {isAuthenticated ? (
                <Button
                  size="sm"
                  onClick={() => onBuy(id)}
                  disabled={buying}
                  className="rounded-full px-5 gap-1.5"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {buying ? 'Zpracovani...' : 'Koupit kurz'}
                </Button>
              ) : (
                <Button size="sm" className="rounded-full px-5 gap-1.5" asChild>
                  <Link to="/auth/sign-up">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Prihlasit se k nakupu
                  </Link>
                </Button>
              )}
            </>
          )}

          {isPurchased && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(id)}
                className="rounded-full px-5 gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                Nahlednout
              </Button>
              <Button size="sm" className="rounded-full px-5" asChild>
                <Link to={`/course/${id}`}>Zacit kurz</Link>
              </Button>
            </>
          )}

          {isCompleted && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(id)}
                className="rounded-full px-5 gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                Nahlednout
              </Button>
              <Button variant="outline" size="sm" className="rounded-full px-5" asChild>
                <Link to={`/course/${id}`}>Prohlednout znovu</Link>
              </Button>
            </>
          )}

          {status === 'locked' && (
            <Button disabled size="sm" className="rounded-full px-5 gap-1.5 opacity-80">
              <Lock className="h-3 w-3" />
              Dokoncete predchozi kurz
            </Button>
          )}

          {status === 'locked_daily' && (
            <Button disabled size="sm" className="rounded-full px-5 gap-1.5 opacity-80">
              <Clock className="h-3 w-3" />
              Dostupne zitra
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
