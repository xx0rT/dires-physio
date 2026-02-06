import { motion } from 'framer-motion'
import { BookOpen, Clock, Lock, Play, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type CourseStatus = 'available' | 'enrolled' | 'completed' | 'locked' | 'locked_daily'

interface CourseCardProps {
  id: string
  title: string
  description: string
  lessonsCount: number
  duration: number
  status: CourseStatus
  index: number
  isAuthenticated: boolean
  onEnroll: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function CourseCard({
  id,
  title,
  description,
  lessonsCount,
  duration,
  status,
  index,
  isAuthenticated,
  onEnroll,
  onPreview,
}: CourseCardProps) {
  const isLocked = status === 'locked' || status === 'locked_daily'
  const isCompleted = status === 'completed'

  const iconBg = isCompleted
    ? 'bg-emerald-500'
    : isLocked
      ? 'bg-gray-400 dark:bg-gray-600'
      : 'bg-primary'

  const Icon = isLocked ? Lock : isCompleted ? Check : BookOpen

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
        <div className="flex items-start gap-2 mb-2">
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
          {(status === 'available' || status === 'enrolled') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(id)}
                className="rounded-full px-5"
              >
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Nahled Obsahu
              </Button>
              {status === 'available' && (
                isAuthenticated ? (
                  <Button
                    size="sm"
                    onClick={() => onEnroll(id)}
                    className="rounded-full px-5"
                  >
                    Prihlasit se k zapisu
                  </Button>
                ) : (
                  <Button size="sm" className="rounded-full px-5" asChild>
                    <Link to="/auth/sign-up">Prihlasit se k zapisu</Link>
                  </Button>
                )
              )}
              {status === 'enrolled' && (
                <Button size="sm" className="rounded-full px-5" asChild>
                  <Link to={`/course/${id}`}>Pokracovat v kurzu</Link>
                </Button>
              )}
            </>
          )}

          {isCompleted && (
            <Button variant="outline" size="sm" className="rounded-full px-5" asChild>
              <Link to={`/course/${id}`}>Prohlednout znovu</Link>
            </Button>
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
