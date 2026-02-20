import { useState, useEffect, useCallback } from 'react'
import {
  Film,
  HardDrive,
  Link2,
  Loader2,
  MonitorPlay,
  Plus,
  Trash2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export interface CourseVideo {
  id: string
  lesson_id: string
  title: string
  description: string
  video_provider: string
  video_external_id: string
  video_url: string
  thumbnail_url: string
  duration_seconds: number
  file_size_bytes: number
  resolution: string
  order_index: number
  is_preview: boolean
}

interface CourseVideoManagerProps {
  lessonId: string
  lessonTitle: string
}

const PROVIDERS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'custom', label: 'Vlastni URL' },
]

const RESOLUTIONS = ['2160p', '1440p', '1080p', '720p', '480p', '360p']

function extractVideoId(url: string, provider: string): string {
  if (provider === 'youtube') {
    const match = url.match(/(?:embed\/|watch\?v=|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})/)
    return match?.[1] ?? ''
  }
  if (provider === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match?.[1] ?? ''
  }
  return ''
}

function buildEmbedUrl(externalId: string, provider: string): string {
  if (provider === 'youtube' && externalId) {
    return `https://www.youtube.com/embed/${externalId}`
  }
  if (provider === 'vimeo' && externalId) {
    return `https://player.vimeo.com/video/${externalId}`
  }
  return ''
}

function buildThumbnail(externalId: string, provider: string): string {
  if (provider === 'youtube' && externalId) {
    return `https://img.youtube.com/vi/${externalId}/hqdefault.jpg`
  }
  return ''
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s}s`
}

const defaultVideo: Omit<CourseVideo, 'id' | 'lesson_id'> = {
  title: '',
  description: '',
  video_provider: 'youtube',
  video_external_id: '',
  video_url: '',
  thumbnail_url: '',
  duration_seconds: 0,
  file_size_bytes: 0,
  resolution: '1080p',
  order_index: 0,
  is_preview: false,
}

export default function CourseVideoManager({ lessonId }: CourseVideoManagerProps) {
  const [videos, setVideos] = useState<CourseVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultVideo)

  const fetchVideos = useCallback(async () => {
    if (lessonId.startsWith('temp-')) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('course_videos')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')
    setVideos((data as CourseVideo[]) ?? [])
    setLoading(false)
  }, [lessonId])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...defaultVideo, order_index: videos.length })
    setDialogOpen(true)
  }

  const openEdit = (video: CourseVideo) => {
    setEditingId(video.id)
    setForm({
      title: video.title,
      description: video.description,
      video_provider: video.video_provider,
      video_external_id: video.video_external_id,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      duration_seconds: video.duration_seconds,
      file_size_bytes: video.file_size_bytes,
      resolution: video.resolution,
      order_index: video.order_index,
      is_preview: video.is_preview,
    })
    setDialogOpen(true)
  }

  const handleUrlChange = (url: string) => {
    const externalId = extractVideoId(url, form.video_provider)
    const thumbnail = buildThumbnail(externalId, form.video_provider)
    setForm({
      ...form,
      video_url: url,
      video_external_id: externalId,
      thumbnail_url: thumbnail || form.thumbnail_url,
    })
  }

  const handleProviderChange = (provider: string) => {
    const externalId = extractVideoId(form.video_url, provider)
    const thumbnail = buildThumbnail(externalId, provider)
    setForm({
      ...form,
      video_provider: provider,
      video_external_id: externalId,
      thumbnail_url: thumbnail || form.thumbnail_url,
    })
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Zadejte nazev videa')
      return
    }

    setSaving(true)
    const payload = {
      lesson_id: lessonId,
      title: form.title,
      description: form.description,
      video_provider: form.video_provider,
      video_external_id: form.video_external_id,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url,
      duration_seconds: form.duration_seconds,
      file_size_bytes: form.file_size_bytes,
      resolution: form.resolution,
      order_index: form.order_index,
      is_preview: form.is_preview,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      const { error } = await supabase.from('course_videos').update(payload).eq('id', editingId)
      if (error) {
        toast.error('Chyba pri aktualizaci videa')
        setSaving(false)
        return
      }
      toast.success('Video aktualizovano')
    } else {
      const { error } = await supabase.from('course_videos').insert(payload)
      if (error) {
        toast.error('Chyba pri pridani videa')
        setSaving(false)
        return
      }
      toast.success('Video pridano')
    }

    setSaving(false)
    setDialogOpen(false)
    fetchVideos()
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Opravdu smazat toto video?')) return
    const { error } = await supabase.from('course_videos').delete().eq('id', videoId)
    if (error) {
      toast.error('Chyba pri mazani videa')
      return
    }
    toast.success('Video smazano')
    setVideos(prev => prev.filter(v => v.id !== videoId))
  }

  const embedUrl = form.video_external_id ? buildEmbedUrl(form.video_external_id, form.video_provider) : ''

  if (lessonId.startsWith('temp-')) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Ulozte lekci pro spravu videí
      </div>
    )
  }

  const totalSize = videos.reduce((s, v) => s + v.file_size_bytes, 0)
  const totalDuration = videos.reduce((s, v) => s + v.duration_seconds, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Videa ({videos.length})</h4>
          {videos.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(totalDuration)} | ~{formatBytes(totalSize)}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={openAdd}>
          <Plus className="mr-1 size-3.5" />
          Pridat video
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Zatim zadna videa. Pridejte prvni video pro tuto lekci.
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="cursor-pointer transition-colors hover:bg-muted/30"
              onClick={() => openEdit(video)}
            >
              <CardContent className="flex items-center gap-3 p-3">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="size-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded bg-muted">
                    <MonitorPlay className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {video.video_provider}
                    </Badge>
                    <span>{formatDuration(video.duration_seconds)}</span>
                    <span>{video.resolution}</span>
                    {video.file_size_bytes > 0 && (
                      <span className="flex items-center gap-0.5">
                        <HardDrive className="size-2.5" />
                        ~{formatBytes(video.file_size_bytes)}
                      </span>
                    )}
                    {video.is_preview && (
                      <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0 dark:bg-green-900/40 dark:text-green-400">
                        Nahled
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(video.id)
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Upravit video' : 'Pridat video'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nazev videa</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nazev videa"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={form.video_provider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rozliseni</Label>
                <Select value={form.resolution} onValueChange={(v) => setForm({ ...form, resolution: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Link2 className="size-3.5" />
                URL videa
              </Label>
              <Input
                value={form.video_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
              {form.video_external_id && (
                <p className="text-xs text-muted-foreground">
                  ID: {form.video_external_id}
                </p>
              )}
            </div>

            {embedUrl && (
              <div className="aspect-video overflow-hidden rounded-lg border">
                <iframe
                  src={embedUrl}
                  title={form.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Delka (sekundy)</Label>
                <Input
                  type="number"
                  value={form.duration_seconds}
                  onChange={(e) => setForm({ ...form, duration_seconds: Number(e.target.value) || 0 })}
                  min={0}
                />
                {form.duration_seconds > 0 && (
                  <p className="text-xs text-muted-foreground">{formatDuration(form.duration_seconds)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Velikost (byty)</Label>
                <Input
                  type="number"
                  value={form.file_size_bytes}
                  onChange={(e) => setForm({ ...form, file_size_bytes: Number(e.target.value) || 0 })}
                  min={0}
                />
                {form.file_size_bytes > 0 && (
                  <p className="text-xs text-muted-foreground">~{formatBytes(form.file_size_bytes)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Poradi</Label>
                <Input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nahledovy obrazek</Label>
              <Input
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                placeholder="https://..."
              />
              {form.thumbnail_url && (
                <img
                  src={form.thumbnail_url}
                  alt="Nahled"
                  className="h-20 rounded border object-cover"
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_preview}
                onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
                className="rounded"
              />
              Dostupne jako nahled zdarma
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrusit</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                {editingId ? 'Ulozit' : 'Pridat'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
