import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export interface UserCourse {
  id: string
  title: string
  description: string
  thumbnail_url: string
  lessons_count: number
  duration: number
  level: string
  instructor: string
  category: string
  order_index: number
}

interface SelectedCourseContextValue {
  courses: UserCourse[]
  selectedCourseId: string | null
  setSelectedCourseId: (id: string | null) => void
  selectedCourse: UserCourse | null
  loading: boolean
}

const SelectedCourseContext = createContext<SelectedCourseContextValue | null>(null)

export function SelectedCourseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [courses, setCourses] = useState<UserCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserCourses()
    } else {
      setCourses([])
      setSelectedCourseId(null)
      setLoading(false)
    }
  }, [user])

  const fetchUserCourses = async () => {
    if (!user) return

    try {
      const [{ data: purchasesData }, { data: enrollmentsData }] = await Promise.all([
        supabase.from('course_purchases').select('course_id').eq('user_id', user.id),
        supabase.from('course_enrollments').select('course_id').eq('user_id', user.id),
      ])

      const ownedIds = new Set([
        ...(purchasesData || []).map((p) => p.course_id),
        ...(enrollmentsData || []).map((e) => e.course_id),
      ])

      if (ownedIds.size === 0) {
        setCourses([])
        setLoading(false)
        return
      }

      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title, description, thumbnail_url, lessons_count, duration, level, instructor, category, order_index')
        .in('id', Array.from(ownedIds))
        .eq('published', true)
        .order('order_index')

      setCourses(coursesData || [])
    } catch (error) {
      console.error('Error fetching user courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null

  return (
    <SelectedCourseContext.Provider
      value={{ courses, selectedCourseId, setSelectedCourseId, selectedCourse, loading }}
    >
      {children}
    </SelectedCourseContext.Provider>
  )
}

export function useSelectedCourse() {
  const context = useContext(SelectedCourseContext)
  if (!context) {
    throw new Error('useSelectedCourse must be used within a SelectedCourseProvider')
  }
  return context
}
