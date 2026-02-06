import { motion } from 'framer-motion'
import { GraduationCap, Trophy } from 'lucide-react'
import { CourseCard, type CourseStatus } from './course-card'

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
  order_index: number
  status: CourseStatus
  progress: number
}

interface PackageSectionProps {
  id: string
  title: string
  description: string
  icon: string
  courses: PackageCourse[]
  index: number
  isAuthenticated: boolean
  onEnroll: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function PackageSection({
  title,
  description,
  icon,
  courses,
  index,
  isAuthenticated,
  onEnroll,
  onPreview,
}: PackageSectionProps) {
  const IconComponent = iconMap[icon] || GraduationCap
  const completedCount = courses.filter(c => c.status === 'completed').length

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{title}</h2>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{courses.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="ml-2 space-y-5 border-l-2 border-muted pl-5">
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
              status={course.status}
              progress={course.progress}
              index={courseIndex}
              isAuthenticated={isAuthenticated}
              onEnroll={onEnroll}
              onPreview={onPreview}
            />
          ))}
      </div>
    </motion.section>
  )
}
