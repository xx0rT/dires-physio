import { motion } from 'framer-motion'
import { Clock, Lock, Play, Check, Eye, ShoppingCart, Package, Film } from 'lucide-react'
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
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
          isLocked
            ? 'opacity-55'
            : isCompleted
              ? 'border-emerald-200 dark:border-emerald-800/60'
              : isPurchased
                ? 'border-primary/30'
                : 'hover:shadow-lg hover:border-primary/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          <div
            className={`relative flex w-full sm:w-44 shrink-0 items-center justify-center p-6 sm:p-0 ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/30'
                : isLocked
                  ? 'bg-muted/60'
                  : isPurchased
                    ? 'bg-primary/5'
                    : 'bg-gradient-to-br from-primary/5 to-primary/10'
            }`}
          >
            <div className="flex flex-col items-center gap-2 py-4">
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
                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isLocked
                      ? 'bg-gray-400 dark:bg-gray-600'
                      : 'bg-primary'
                }`}
              >
                {isLocked ? (
                  <Lock className="h-6 w-6 text-white" />
                ) : isCompleted ? (
                  <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
                ) : (
                  <Package className="h-6 w-6 text-white" />
                )}
              </motion.div>
              <div className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Film className="h-3 w-3" />
                {lessonsCount} videi
              </div>
            </div>
          </div>

          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold leading-tight">{title}</h3>
                {isLocked && (
                  <Badge variant="secondary" className="gap-1 text-[11px] font-normal">
                    <Lock className="h-2.5 w-2.5" />
                    Zamceno
                  </Badge>
                )}
                {isCompleted && (
                  <Badge className="gap-1 bg-emerald-500 text-[11px] font-normal hover:bg-emerald-600">
                    <Check className="h-2.5 w-2.5" />
                    Dokonceno
                  </Badge>
                )}
                {isPurchased && (
                  <Badge className="gap-1 bg-primary text-[11px] font-normal">
                    <Check className="h-2.5 w-2.5" />
                    Zakoupeno
                  </Badge>
                )}
              </div>
              {!isPurchased && !isCompleted && !isLocked && (
                <span className="text-xl font-bold text-primary shrink-0">{formattedPrice}</span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>

            <div className="flex items-center gap-4 text-[13px] text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" fill="currentColor" />
                {lessonsCount} videi v balicku
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {duration} min celkem
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {status === 'available' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(id)}
                    className="rounded-full px-4 gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Co je uvnitr
                  </Button>
                  {isAuthenticated ? (
                    <Button
                      size="sm"
                      onClick={() => onBuy(id)}
                      disabled={buying}
                      className="rounded-full px-5 gap-1.5"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {buying ? 'Zpracovani...' : `Koupit balicek ${formattedPrice}`}
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
                    className="rounded-full px-4 gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Obsah balicku
                  </Button>
                  <Button size="sm" className="rounded-full px-5 gap-1.5" asChild>
                    <Link to={`/course/${id}`}>
                      <Play className="h-3.5 w-3.5" fill="currentColor" />
                      Spustit videa
                    </Link>
                  </Button>
                </>
              )}

              {isCompleted && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(id)}
                    className="rounded-full px-4 gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Obsah balicku
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-5 gap-1.5" asChild>
                    <Link to={`/course/${id}`}>
                      <Play className="h-3.5 w-3.5" fill="currentColor" />
                      Prehrat znovu
                    </Link>
                  </Button>
                </>
              )}

              {status === 'locked' && (
                <Button disabled size="sm" className="rounded-full px-5 gap-1.5 opacity-80">
                  <Lock className="h-3 w-3" />
                  Dokoncete predchozi balicek
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
        </div>
      </div>
    </motion.div>
  )
}
