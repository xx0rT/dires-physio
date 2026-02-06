import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageSection, type PackageCourse } from '@/components/courses/package-section'
import { CoursePreviewDialog } from '@/components/courses/course-preview-dialog'
import type { CourseStatus } from '@/components/courses/course-card'

interface DBPackage {
  id: string
  title: string
  description: string
  icon: string
  order_index: number
}

interface DBCourse {
  id: string
  title: string
  description: string
  duration: number
  lessons_count: number
  package_id: string
  order_index: number
}

interface DBEnrollment {
  course_id: string
  completed: boolean
  completion_date: string | null
}

interface DBLesson {
  id: string
  course_id: string
  title: string
  description: string
  duration: number
  order_index: number
}

interface DBProgress {
  course_id: string
  lesson_id: string
  completed: boolean
}

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { subscription, loading: subscriptionLoading, hasActiveSubscription } = useSubscription()
  const [packages, setPackages] = useState<DBPackage[]>([])
  const [courses, setCourses] = useState<DBCourse[]>([])
  const [enrollments, setEnrollments] = useState<DBEnrollment[]>([])
  const [progressData, setProgressData] = useState<DBProgress[]>([])
  const [loading, setLoading] = useState(true)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCourse, setPreviewCourse] = useState<DBCourse | null>(null)
  const [previewLessons, setPreviewLessons] = useState<DBLesson[]>([])

  const loadData = useCallback(async () => {
    try {
      const { data: pkgs } = await supabase
        .from('course_packages')
        .select('*')
        .order('order_index')

      const { data: crs } = await supabase
        .from('courses')
        .select('id, title, description, duration, lessons_count, package_id, order_index')
        .eq('published', true)
        .not('package_id', 'is', null)
        .order('order_index')

      if (pkgs) setPackages(pkgs)
      if (crs) setCourses(crs)

      if (user) {
        const { data: enr } = await supabase
          .from('course_enrollments')
          .select('course_id, completed, completion_date')
          .eq('user_id', user.id)

        const { data: prog } = await supabase
          .from('user_course_progress')
          .select('course_id, lesson_id, completed')
          .eq('user_id', user.id)

        if (enr) setEnrollments(enr)
        if (prog) setProgressData(prog)
      }
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getCourseStatus = (course: DBCourse, packageCourses: DBCourse[]): CourseStatus => {
    const enrollment = enrollments.find(e => e.course_id === course.id)

    if (enrollment?.completed) return 'completed'

    if (enrollment) return 'enrolled'

    const sortedInPackage = packageCourses.sort((a, b) => a.order_index - b.order_index)
    const courseIdx = sortedInPackage.findIndex(c => c.id === course.id)

    if (courseIdx === 0) return 'available'

    const prevCourse = sortedInPackage[courseIdx - 1]
    const prevEnrollment = enrollments.find(e => e.course_id === prevCourse.id)

    if (!prevEnrollment?.completed) return 'locked'

    if (prevEnrollment.completion_date) {
      const completionDay = new Date(prevEnrollment.completion_date).toDateString()
      const today = new Date().toDateString()
      if (completionDay === today) return 'locked_daily'
    }

    return 'available'
  }

  const getCourseProgress = (courseId: string, lessonsCount: number): number => {
    if (lessonsCount === 0) return 0
    const completed = progressData.filter(
      p => p.course_id === courseId && p.completed
    ).length
    return Math.round((completed / lessonsCount) * 100)
  }

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('/auth/sign-up')
      return
    }

    const { error } = await supabase.from('course_enrollments').insert({
      user_id: user.id,
      course_id: courseId,
    })

    if (!error) loadData()
  }

  const handlePreview = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (!course) return

    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('id, course_id, title, description, duration, order_index')
      .eq('course_id', courseId)
      .order('order_index')

    setPreviewCourse(course)
    setPreviewLessons(lessons || [])
    setPreviewOpen(true)
  }

  const getPackageCourses = (packageId: string): PackageCourse[] => {
    const packageCourses = courses.filter(c => c.package_id === packageId)
    return packageCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      lessons_count: course.lessons_count,
      duration: course.duration,
      order_index: course.order_index,
      status: getCourseStatus(course, packageCourses),
      progress: getCourseProgress(course.id, course.lessons_count),
    }))
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user && !hasActiveSubscription) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="space-y-4 pb-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="mb-3 text-3xl">Premium pristup vyzadovan</CardTitle>
                <CardDescription className="text-base">
                  Pro pristup ke kurzum potrebujete aktivni predplatne
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                  <Check className="h-5 w-5 text-primary" />
                  Co ziskate s premium pristupem:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    'Neomezeny pristup ke vsem kurzum',
                    'AI asistent pro dotazy k obsahu kurzu',
                    'Certifikaty po dokonceni jednotlivych kurzu',
                    'Doplnkove studijni materialy ke stazeni',
                    'Aktualizace obsahu zdarma',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {subscription && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Aktualni stav:</strong>{' '}
                    {subscription.status === 'cancelled' && 'Vase predplatne bylo zruseno'}
                    {subscription.status === 'expired' && 'Vase predplatne vyprselo'}
                    {subscription.status === 'trialing' && 'Zkusebni obdobi'}
                    {subscription.status === 'active' && 'Aktivni'}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={() => navigate('/#pricing')} className="flex-1" size="lg">
                  Zobrazit cenove plany
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Zpet na dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold md:text-5xl">
          Roadmapa{' '}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Kurzu
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Absolvujte kurzy v poradi a odemknete pokrocile techniky. Po dokonceni kurzu musíte pockat do dalsiho dne.
        </p>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-16">
        {packages.map((pkg, index) => (
          <PackageSection
            key={pkg.id}
            id={pkg.id}
            title={pkg.title}
            description={pkg.description}
            icon={pkg.icon}
            courses={getPackageCourses(pkg.id)}
            index={index}
            isAuthenticated={!!user}
            onEnroll={handleEnroll}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Zadne kurzy nejsou k dispozici.</p>
        </div>
      )}

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 px-6 py-12 text-center"
        >
          <h3 className="mb-4 text-2xl font-bold">Pripraveni zacit?</h3>
          <p className="mx-auto mb-6 max-w-md text-muted-foreground">
            Vytvorte si ucet a ziskejte pristup ke vsem kurzum s postupnym odemykanim
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth/sign-up">Zacit nyni</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/sign-in">Jiz mam ucet</Link>
            </Button>
          </div>
        </motion.div>
      )}

      <CoursePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        courseTitle={previewCourse?.title || ''}
        courseDescription={previewCourse?.description || ''}
        lessons={previewLessons}
      />
    </div>
  )
}
