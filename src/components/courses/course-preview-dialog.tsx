import { motion } from 'framer-motion'
import { BookOpen, Clock, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  order_index: number
}

interface CoursePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseTitle: string
  courseDescription: string
  lessons: Lesson[]
}

export function CoursePreviewDialog({
  open,
  onOpenChange,
  courseTitle,
  courseDescription,
  lessons,
}: CoursePreviewDialogProps) {
  const totalDuration = lessons.reduce((sum, l) => sum + l.duration, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{courseTitle}</DialogTitle>
              <DialogDescription className="mt-1">{courseDescription}</DialogDescription>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {lessons.length} videi
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {totalDuration} minut
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-160px)] pr-1 space-y-3 mt-2">
          {lessons
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{lesson.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0">
                      <Clock className="h-2.5 w-2.5" />
                      {lesson.duration} min
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
