import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Film,
  Grid2x2,
  Grid3x3,
  LayoutList,
  Play,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ShowcaseCourse {
  badge?: string
  title: string
  description: string
  author: {
    name: string
    title: string
    avatar: string
  }
  image: string
  lessons: number
  videos: number
  duration: string
  audience: string[]
  gradient: string
  price: number
  originalPrice?: number
  coursesInPackage: { id: string; title: string; duration: number }[]
  cta: {
    text: string
    url: string
  }
  isPurchased?: boolean
  onPreview?: () => void
  onBuy?: () => void
}

interface CourseShowcaseProps {
  courses: ShowcaseCourse[]
  className?: string
}

type GridSize = 2 | 3 | 4

function formatPrice(price: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(price)
}

function CourseShowcaseCard({ course }: { course: ShowcaseCourse }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          {course.badge && (
            <Badge className="border-0 bg-white/15 text-white backdrop-blur-md">
              {course.badge}
            </Badge>
          )}
          {course.isPurchased && (
            <Badge className="border-0 bg-emerald-500/90 text-white">
              Zakoupeno
            </Badge>
          )}
        </div>

        <AnimatePresence>
          {hovered && !course.isPurchased && course.onPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 rounded-full bg-white/95 text-black shadow-xl hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    course.onPreview?.()
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Nahled obsahu
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <Film className="h-3 w-3" />
                {course.videos}
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <Clock className="h-3 w-3" />
                {course.duration}
              </div>
            </div>
            {!course.isPurchased && course.price > 0 && (
              <span className="text-lg font-bold text-white">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-3 w-3 fill-amber-400 text-amber-400"
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">5.0</span>
        </div>

        <h3 className="mb-1 text-lg font-bold leading-tight">{course.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
          {course.onPreview && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-3 text-xs"
              onClick={(e) => {
                e.preventDefault()
                course.onPreview?.()
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              Nahled
            </Button>
          )}
          <div className="flex-1" />
          {course.isPurchased ? (
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-4 text-xs"
              asChild
            >
              <Link to={course.cta.url}>
                <Play className="h-3.5 w-3.5" fill="currentColor" />
                Pokracovat
              </Link>
            </Button>
          ) : course.onBuy ? (
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-4 text-xs"
              onClick={(e) => {
                e.preventDefault()
                course.onBuy?.()
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Koupit
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-4 text-xs"
              asChild
            >
              <Link to={course.cta.url}>
                {course.cta.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const GRID_OPTIONS: { value: GridSize; icon: typeof Grid2x2; label: string }[] = [
  { value: 2, icon: Grid2x2, label: '2 sloupce' },
  { value: 3, icon: Grid3x3, label: '3 sloupce' },
  { value: 4, icon: LayoutList, label: '4 sloupce' },
]

const INITIAL_VISIBLE = 3

const CourseShowcase = ({ className, courses }: CourseShowcaseProps) => {
  const [expanded, setExpanded] = useState(false)
  const [gridSize, setGridSize] = useState<GridSize>(3)
  const hasMore = courses.length > INITIAL_VISIBLE
  const visibleCourses = expanded ? courses : courses.slice(0, INITIAL_VISIBLE)

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[gridSize]

  return (
    <section className={cn('py-4', className)}>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 gap-1.5 text-xs uppercase">
            <BookOpen className="h-3 w-3" />
            Katalog balicku
          </Badge>
          <h2 className="text-3xl font-bold">
            Vyberte si balicek
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Kazdy balicek obsahuje sadu videi. Zakupte jednorazove a ziskejte pristup ke vsem videim.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            <Film className="h-4 w-4 text-primary" />
            {courses.reduce((sum, c) => sum + c.videos, 0)} videi
          </span>
          <div className="flex items-center rounded-lg border border-border p-0.5">
            {GRID_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setGridSize(option.value)}
                  className={cn(
                    'rounded-md p-1.5 transition-colors',
                    gridSize === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={option.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={cn('grid gap-6', gridClass)}>
        <AnimatePresence mode="popLayout">
          {visibleCourses.map((course, idx) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: idx >= INITIAL_VISIBLE ? (idx - INITIAL_VISIBLE) * 0.08 : 0 }}
              className="h-full"
            >
              <CourseShowcaseCard course={course} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? (
              <>
                Zobrazit mene
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Zobrazit vse ({courses.length - INITIAL_VISIBLE} dalsich)
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}

export { CourseShowcase }
