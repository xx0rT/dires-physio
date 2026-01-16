import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiTimeLine, RiVideoLine } from '@remixicon/react'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getMockCourses, getMockModulesByCourseId, type Course, type CourseModule } from '@/data/mock-data'

interface Enrollment {
  id: string
  course_id: string
  progress_percentage: number
  completed_at: string | null
}

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses] = useState<Course[]>(getMockCourses())
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [previewModules, setPreviewModules] = useState<CourseModule[]>([])
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  useEffect(() => {
    loadCoursesData()
  }, [user])

  useEffect(() => {
    const checkNewlyUnlocked = () => {
      const unlockedCourses = courses
        .filter((_, index) => isCourseUnlocked(index))
        .map(c => c.id)

      const previouslyLocked = courses.filter(c => !newlyUnlocked.includes(c.id)).map(c => c.id)
      const justUnlocked = unlockedCourses.filter(id => previouslyLocked.includes(id) && !newlyUnlocked.includes(id))

      if (justUnlocked.length > 0) {
        setNewlyUnlocked(prev => [...prev, ...justUnlocked])
        justUnlocked.forEach(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6']
          })
        })
      }
    }

    if (courses.length > 0 && enrollments.length > 0) {
      checkNewlyUnlocked()
    }
  }, [enrollments, courses])

  const loadCoursesData = () => {
    const modules: Record<string, CourseModule[]> = {}
    for (const course of courses) {
      modules[course.id] = getMockModulesByCourseId(course.id)
    }
    setCourseModules(modules)

    if (user) {
      const storedEnrollments = localStorage.getItem(`enrollments_${user.id}`)
      if (storedEnrollments) {
        setEnrollments(JSON.parse(storedEnrollments))
      }
    }
  }

  const isCourseUnlocked = (courseIndex: number) => {
    if (courseIndex === 0) return true
    if (!user) return false

    const previousCourse = courses[courseIndex - 1]
    if (!previousCourse) return false

    const enrollment = enrollments.find(e => e.course_id === previousCourse.id)
    return enrollment?.completed_at != null
  }

  const isCourseEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId)
  }

  const getCourseProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment?.progress_percentage || 0
  }

  const handleEnroll = (courseId: string) => {
    if (!user) {
      navigate('/auth/sign-up')
      return
    }

    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      course_id: courseId,
      progress_percentage: 0,
      completed_at: null
    }

    const updatedEnrollments = [...enrollments, newEnrollment]
    setEnrollments(updatedEnrollments)
    localStorage.setItem(`enrollments_${user.id}`, JSON.stringify(updatedEnrollments))
  }

  const handlePreview = (course: Course) => {
    setSelectedCourse(course)
    setPreviewModules(courseModules[course.id] || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Naše Kurzy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Objevte naši sbírku odborných kurzů zaměřených na manuální terapii a rehabilitaci
          </p>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const isUnlocked = isCourseUnlocked(index)
            const isEnrolled = isCourseEnrolled(course.id)
            const progress = getCourseProgress(course.id)
            const modules = courseModules[course.id] || []
            const totalDuration = modules.reduce((acc, m) => acc + m.duration_minutes, 0)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow ${!isUnlocked ? 'opacity-60' : ''}`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <RiLockLine className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {isEnrolled ? 'Zapsáno' : `${course.price.toLocaleString('cs-CZ')} Kč`}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiVideoLine className="h-4 w-4" />
                        <span>{modules.length} videí</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiTimeLine className="h-4 w-4" />
                        <span>{Math.ceil(totalDuration / 60)} hodin obsahu</span>
                      </div>

                      {isEnrolled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Váš pokrok</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          {progress === 100 && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                              <RiCheckLine className="h-4 w-4" />
                              <span>Dokončeno!</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {isUnlocked ? (
                        <>
                          {isEnrolled ? (
                            <Link to={`/course/${course.id}`}>
                              <Button className="w-full">
                                <RiPlayCircleLine className="h-4 w-4 mr-2" />
                                {progress > 0 ? 'Pokračovat' : 'Začít kurz'}
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() => handleEnroll(course.id)}
                            >
                              Zapsat se
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handlePreview(course)}
                          >
                            <RiBookOpenLine className="h-4 w-4 mr-2" />
                            Náhled obsahu
                          </Button>
                        </>
                      ) : (
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <RiLockLine className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Dokončete předchozí kurz
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedCourse && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCourse.title}</DialogTitle>
                  <DialogDescription>{selectedCourse.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-semibold">Obsah kurzu</h3>
                  {previewModules.map((module, index) => (
                    <div key={module.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.duration_minutes} minut
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)} className="flex-1">
                    Zavřít
                  </Button>
                  {isCourseEnrolled(selectedCourse.id) ? (
                    <Link to={`/course/${selectedCourse.id}`} className="flex-1">
                      <Button className="w-full" onClick={() => setSelectedCourse(null)}>
                        <RiPlayCircleLine className="h-4 w-4 mr-2" />
                        Začít kurz
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleEnroll(selectedCourse.id)
                        setSelectedCourse(null)
                      }}
                    >
                      Zapsat se
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
