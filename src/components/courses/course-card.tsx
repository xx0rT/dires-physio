import { motion } from 'framer-motion'
import { BookOpen, Clock, Eye, Lock, Play, Check } from 'lucide-react'
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
  progress: number
  index: number
  isAuthenticated: boolean
  onEnroll: (courseId: string) => void
  onPreview: (courseId: string) => void
}

const statusIconMap: Record<CourseStatus, typeof BookOpen> = {
  available: BookOpen,
  enrolled: Play,
  completed: Check,
  locked: Lock,
  locked_daily: Lock,
}

export function CourseCard({
  id,
  title,
  description,
  lessonsCount,
  duration,
  status,
  progress,
  index,
  isAuthenticated,
  onEnroll,
  onPreview,
}: CourseCardProps) {
  const isLocked = status === 'locked' || status === 'locked_daily'
  const isCompleted = status === 'completed'
  const isEnrolled = status === 'enrolled'
  const IconComponent = statusIconMap[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex items-start gap-0"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className={`
          relative z-10 -mr-4 mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg
          ${isCompleted
            ? 'bg-emerald-500'
            : isLocked
              ? 'bg-gray-400 dark:bg-gray-600'
              : 'bg-primary'
          }
        `}
      >
        <IconComponent className="h-6 w-6 text-white" strokeWidth={2.5} />
      </motion.div>

      <div
        className={`
          flex-1 rounded-2xl border bg-card p-5 pl-8 transition-all duration-300
          ${isLocked
            ? 'border-muted opacity-70'
            : isCompleted
              ? 'border-emerald-200 dark:border-emerald-800'
              : 'border-border hover:border-primary/30 hover:shadow-md'
          }
        `}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <h3 className="text-lg font-bold leading-tight">{title}</h3>
            {isLocked && (
              <Badge variant="secondary" className="shrink-0 gap-1 text-[11px]">
                <Lock className="h-3 w-3" />
                Zamceno
              </Badge>
            )}
            {isCompleted && (
              <Badge className="shrink-0 gap-1 bg-emerald-500 text-[11px] hover:bg-emerald-600">
                <Check className="h-3 w-3" />
                Dokonceno
              </Badge>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Play className="h-3.5 w-3.5" />
              {lessonsCount} videi
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {duration} minut
            </span>
          </div>

          {isEnrolled && progress > 0 && progress < 100 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Vas pokrok</span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            {status === 'available' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(id)}
                  className="gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  Nahled Obsahu
                </Button>
                {isAuthenticated ? (
                  <Button size="sm" onClick={() => onEnroll(id)}>
                    Prihlasit se k zapisu
                  </Button>
                ) : (
                  <Button size="sm" asChild>
                    <Link to="/auth/sign-up">Prihlasit se k zapisu</Link>
                  </Button>
                )}
              </>
            )}

            {isEnrolled && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(id)}
                  className="gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  Nahled Obsahu
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/course/${id}`}>
                    {progress > 0 ? 'Pokracovat' : 'Zacit kurz'}
                  </Link>
                </Button>
              </>
            )}

            {isCompleted && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/course/${id}`}>Prohlednout</Link>
              </Button>
            )}

            {status === 'locked' && (
              <Button disabled size="sm" variant="secondary" className="gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Dokoncete predchozi kurz
              </Button>
            )}

            {status === 'locked_daily' && (
              <Button disabled size="sm" variant="secondary" className="gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Dostupne zitra
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
