import { motion } from 'framer-motion'
import { Package, Clock, Play, Film, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

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
  coursePrice?: number
  isPurchased?: boolean
  lessons: Lesson[]
  loading?: boolean
  onBuy?: () => void
}

export function CoursePreviewDialog({
  open,
  onOpenChange,
  courseTitle,
  courseDescription,
  coursePrice,
  isPurchased,
  lessons,
  loading,
  onBuy,
}: CoursePreviewDialogProps) {
  const totalDuration = lessons.reduce((sum, l) => sum + l.duration, 0)

  const formattedPrice = coursePrice
    ? new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
      }).format(coursePrice)
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{courseTitle}</DialogTitle>
              <DialogDescription className="mt-1">{courseDescription}</DialogDescription>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                {!loading && (
                  <>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Film className="h-3 w-3" />
                      {lessons.length} videi v balicku
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {totalDuration} min celkem
                    </Badge>
                  </>
                )}
                {formattedPrice && !isPurchased && (
                  <Badge className="gap-1 text-xs bg-primary">
                    {formattedPrice}
                  </Badge>
                )}
                {isPurchased && (
                  <Badge className="gap-1 text-xs bg-emerald-500">
                    Zakoupeno
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 mb-1">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Videa obsazena v balicku
          </h4>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-240px)] pr-1 space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border p-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))
          ) : (
            lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson, idx) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Play className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{lesson.title}</p>
                    {lesson.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px] gap-1 px-2 py-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {lesson.duration} min
                  </Badge>
                </motion.div>
              ))
          )}
        </div>

        {onBuy && !isPurchased && (
          <div className="border-t pt-4 mt-2">
            <Button onClick={onBuy} className="w-full gap-2" size="lg">
              <ShoppingCart className="h-4 w-4" />
              Koupit balicek {formattedPrice && `za ${formattedPrice}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
