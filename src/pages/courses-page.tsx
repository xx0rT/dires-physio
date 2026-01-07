import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiTimeLine, RiVideoLine } from '@remixicon/react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  price: number
  order_index: number
}

interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string
  order_index: number
  duration_minutes: number
}

interface Enrollment {
  id: string
  course_id: string
  progress_percentage: number
  completed_at: string | null
}

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [previewModules, setPreviewModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoursesData()
  }, [user])

  const loadCoursesData = async () => {
    try {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      if (coursesData) {
        setCourses(coursesData)

        for (const course of coursesData) {
          const { data: modules } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index', { ascending: true })

          if (modules) {
            setCourseModules(prev => ({ ...prev, [course.id]: modules }))
          }
        }
      }

      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('user_course_enrollments')
          .select('*')
          .eq('user_id', user.id)

        if (enrollmentsData) {
          setEnrollments(enrollmentsData as Enrollment[])
        }
      }
    } catch (error) {
      console.error('Error loading courses data:', error)
    } finally {
      setLoading(false)
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

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('/auth/sign-up')
      return
    }

    try {
      const { error } = await supabase
        .from('user_course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0
        })

      if (!error) {
        loadCoursesData()
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  const handlePreview = async (course: Course) => {
    const modules = courseModules[course.id] || []
    setPreviewModules(modules)
    setSelectedCourse(course)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold md:text-5xl">
          Roadmapa <span className="bg-gradient-to-r from-[#7033ff] to-primary bg-clip-text text-transparent">Kurzů</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Absolvujte kurzy v pořadí a odemkněte pokročilé techniky. Každý kurz musí být dokončen před přechodem k dalšímu.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary opacity-30 hidden md:block" />

        <div className="space-y-12">
          {courses.map((course, index) => {
            const isUnlocked = isCourseUnlocked(index)
            const isEnrolled = isCourseEnrolled(course.id)
            const progress = getCourseProgress(course.id)
            const modules = courseModules[course.id] || []
            const totalDuration = modules.reduce((sum, m) => sum + m.duration_minutes, 0)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute left-0 top-8 w-16 h-16 rounded-full bg-background border-4 border-primary/50 flex items-center justify-center z-10 hidden md:flex">
                  {!isUnlocked ? (
                    <RiLockLine className="h-6 w-6 text-muted-foreground" />
                  ) : progress === 100 ? (
                    <RiCheckLine className="h-6 w-6 text-green-600" />
                  ) : (
                    <RiBookOpenLine className="h-6 w-6 text-primary" />
                  )}
                </div>

                <Card className={`md:ml-24 ${!isUnlocked ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-2xl">{course.title}</CardTitle>
                          {!isUnlocked && (
                            <Badge variant="secondary">
                              <RiLockLine className="h-3 w-3 mr-1" />
                              Zamčeno
                            </Badge>
                          )}
                          {isEnrolled && progress === 100 && (
                            <Badge variant="default" className="bg-green-600">
                              <RiCheckLine className="h-3 w-3 mr-1" />
                              Dokončeno
                            </Badge>
                          )}
                          {isEnrolled && progress > 0 && progress < 100 && (
                            <Badge variant="default">
                              V průběhu
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {course.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">€{course.price}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <RiVideoLine className="h-4 w-4" />
                        <span>{modules.length} videí</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        <span>{totalDuration} minut</span>
                      </div>
                    </div>

                    {isEnrolled && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Váš pokrok</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" onClick={() => handlePreview(course)}>
                                <RiPlayCircleLine className="mr-2 h-4 w-4" />
                                Náhled Obsahu
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{selectedCourse?.title}</DialogTitle>
                                <DialogDescription>
                                  Prozkoumejte obsah kurzu před zápisem
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Co se naučíte:</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedCourse?.description}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Obsah kurzu ({previewModules.length} videí):</h4>
                                  <div className="space-y-2">
                                    {previewModules.map((module, idx) => (
                                      <div
                                        key={module.id}
                                        className="flex items-start gap-3 p-3 rounded-lg border"
                                      >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          <span className="text-sm font-semibold">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{module.title}</p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {module.description}
                                          </p>
                                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <RiTimeLine className="h-3 w-3" />
                                            <span>{module.duration_minutes} minut</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {user ? (
                            isEnrolled ? (
                              <Button asChild>
                                <Link to={`/course/${course.id}`}>
                                  {progress === 100 ? 'Prohlédnout' : 'Pokračovat'}
                                </Link>
                              </Button>
                            ) : (
                              <Button onClick={() => handleEnroll(course.id)}>
                                Zapsat se
                              </Button>
                            )
                          ) : (
                            <Button asChild>
                              <Link to="/auth/sign-up">
                                Přihlásit se k zápisu
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button disabled>
                          <RiLockLine className="mr-2 h-4 w-4" />
                          Dokončete předchozí kurz
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-12 px-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="text-2xl font-bold mb-4">Připraveni začít?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Vytvořte si účet a získejte přístup ke všem kurzům s postupným odemykáním
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth/sign-up">
                Začít nyní
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/sign-in">
                Již mám účet
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
