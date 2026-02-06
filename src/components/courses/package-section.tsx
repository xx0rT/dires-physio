import { motion } from 'framer-motion'
import { GraduationCap, Trophy, ChevronRight } from 'lucide-react'
import { CourseCard } from './course-card'
import type { CourseStatus } from './course-card'
import { Progress } from '@/components/ui/progress'

const iconMap: Record<string, typeof GraduationCap> = {
  'graduation-cap': GraduationCap,
  trophy: Trophy,
}

export interface PackageCourse {
  id: string
  title: string
  description: string
  lessons_count: number
  duration: number
  price: number
  order_index: number
  status: CourseStatus
}

interface PackageSectionProps {
  id: string
  title: string
  description: string
  icon: string
  courses: PackageCourse[]
  index: number
  isAuthenticated: boolean
  buyingCourseId: string | null
  onBuy: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function PackageSection({
  title,
  description,
  icon,
  courses,
  index,
  isAuthenticated,
  buyingCourseId,
  onBuy,
  onPreview,
}: PackageSectionProps) {
  const IconComponent = iconMap[icon] || GraduationCap
  const completedCount = courses.filter(c => c.status === 'completed').length
  const progressPercent = courses.length > 0 ? Math.round((completedCount / courses.length) * 100) : 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{title}</h2>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              {completedCount}/{courses.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
          {completedCount > 0 && (
            <Progress value={progressPercent} className="mt-2 h-1.5" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {courses
          .sort((a, b) => a.order_index - b.order_index)
          .map((course, courseIndex) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              lessonsCount={course.lessons_count}
              duration={course.duration}
              price={course.price}
              status={course.status}
              index={courseIndex}
              isAuthenticated={isAuthenticated}
              buying={buyingCourseId === course.id}
              onBuy={onBuy}
              onPreview={onPreview}
            />
          ))}
      </div>
    </motion.section>
  )
}
