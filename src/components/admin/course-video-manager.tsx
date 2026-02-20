import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Film,
  HardDrive,
  Link2,
  Loader2,
  MonitorPlay,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
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
import { Progress } from '@/components/ui/progress'
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
  storage_path: string
  upload_status: string
}

interface CourseVideoManagerProps {
  lessonId: string
  courseId: string
}

const PROVIDERS = [
  { value: 'storage', label: 'Nahrat soubor' },
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
  if (provider === 'youtube' && externalId) return `https://www.youtube.com/embed/${externalId}`
  if (provider === 'vimeo' && externalId) return `https://player.vimeo.com/video/${externalId}`
  return ''
}

function buildThumbnail(externalId: string, provider: string): string {
  if (provider === 'youtube' && externalId) return `https://img.youtube.com/vi/${externalId}/hqdefault.jpg`
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

interface VideoForm {
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
  storage_path: string
}

const defaultForm: VideoForm = {
  title: '',
  description: '',
  video_provider: 'storage',
  video_external_id: '',
  video_url: '',
  thumbnail_url: '',
  duration_seconds: 0,
  file_size_bytes: 0,
  resolution: '1080p',
  order_index: 0,
  is_preview: false,
  storage_path: '',
}

export default function CourseVideoManager({ lessonId, courseId }: CourseVideoManagerProps) {
  const [videos, setVideos] = useState<CourseVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VideoForm>(defaultForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setForm({ ...defaultForm, order_index: videos.length })
    setSelectedFile(null)
    setUploadProgress(0)
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
      storage_path: video.storage_path || '',
    })
    setSelectedFile(null)
    setUploadProgress(0)
    setDialogOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setForm(prev => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      file_size_bytes: file.size,
    }))

    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      setForm(prev => ({
        ...prev,
        duration_seconds: Math.round(video.duration),
      }))
    }
    video.src = URL.createObjectURL(file)
  }

  const uploadFile = async (file: File): Promise<{ path: string; url: string } | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const timestamp = Date.now()
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 50)
    const storagePath = `${courseId}/${lessonId}/${timestamp}-${safeName}.${ext}`

    setUploading(true)
    setUploadProgress(0)

    const chunkSize = 5 * 1024 * 1024
    const totalChunks = Math.ceil(file.size / chunkSize)

    if (file.size <= chunkSize) {
      const { error } = await supabase.storage
        .from('course-videos')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Upload error:', error)
        toast.error(`Chyba nahravani: ${error.message}`)
        setUploading(false)
        return null
      }
      setUploadProgress(100)
    } else {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        if (i === 0) {
          const { error } = await supabase.storage
            .from('course-videos')
            .upload(storagePath, chunk, {
              cacheControl: '3600',
              upsert: false,
            })
          if (error) {
            console.error('Upload error:', error)
            toast.error(`Chyba nahravani: ${error.message}`)
            setUploading(false)
            return null
          }
        } else {
          const { error } = await supabase.storage
            .from('course-videos')
            .update(storagePath, file.slice(0, end), {
              cacheControl: '3600',
              upsert: true,
            })
          if (error) {
            console.error('Chunk upload error:', error)
            toast.error(`Chyba nahravani casti ${i + 1}: ${error.message}`)
            setUploading(false)
            return null
          }
        }
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))
      }
    }

    const { data: signedData } = await supabase.storage
      .from('course-videos')
      .createSignedUrl(storagePath, 365 * 24 * 60 * 60)

    setUploading(false)

    return {
      path: storagePath,
      url: signedData?.signedUrl || '',
    }
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
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Zadejte nazev videa')
      return
    }

    setSaving(true)
    let finalUrl = form.video_url
    let finalPath = form.storage_path
    let uploadStatus = 'completed'

    if (form.video_provider === 'storage' && selectedFile) {
      const result = await uploadFile(selectedFile)
      if (!result) {
        setSaving(false)
        return
      }
      finalUrl = result.url
      finalPath = result.path
      uploadStatus = 'completed'
    } else if (form.video_provider === 'storage' && !selectedFile && !form.storage_path) {
      toast.error('Vyberte soubor k nahrani')
      setSaving(false)
      return
    }

    const payload = {
      lesson_id: lessonId,
      title: form.title,
      description: form.description,
      video_provider: form.video_provider,
      video_external_id: form.video_external_id,
      video_url: finalUrl,
      thumbnail_url: form.thumbnail_url,
      duration_seconds: form.duration_seconds,
      file_size_bytes: form.file_size_bytes,
      resolution: form.resolution,
      order_index: form.order_index,
      is_preview: form.is_preview,
      storage_path: finalPath,
      upload_status: uploadStatus,
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
      toast.success('Video nahrano a ulozeno')
    }

    setSaving(false)
    setDialogOpen(false)
    setSelectedFile(null)
    setUploadProgress(0)
    fetchVideos()
  }

  const handleDelete = async (video: CourseVideo) => {
    if (!confirm('Opravdu smazat toto video?')) return

    if (video.storage_path) {
      await supabase.storage.from('course-videos').remove([video.storage_path])
    }

    const { error } = await supabase.from('course_videos').delete().eq('id', video.id)
    if (error) {
      toast.error('Chyba pri mazani videa')
      return
    }
    toast.success('Video smazano')
    setVideos(prev => prev.filter(v => v.id !== video.id))
  }

  const isExternal = form.video_provider !== 'storage'
  const embedUrl = isExternal && form.video_external_id
    ? buildEmbedUrl(form.video_external_id, form.video_provider)
    : ''

  if (lessonId.startsWith('temp-')) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Ulozte lekci pro spravu videi
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
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {video.video_provider === 'storage' ? 'Nahrano' : video.video_provider}
                    </Badge>
                    {video.duration_seconds > 0 && (
                      <span>{formatDuration(video.duration_seconds)}</span>
                    )}
                    <span>{video.resolution}</span>
                    {video.file_size_bytes > 0 && (
                      <span className="flex items-center gap-0.5">
                        <HardDrive className="size-2.5" />
                        {formatBytes(video.file_size_bytes)}
                      </span>
                    )}
                    {video.upload_status === 'completed' && video.video_provider === 'storage' && (
                      <CheckCircle2 className="size-3 text-green-500" />
                    )}
                    {video.upload_status === 'failed' && (
                      <AlertCircle className="size-3 text-red-500" />
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
                    handleDelete(video)
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!uploading) setDialogOpen(open)
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Upravit video' : 'Pridat video'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zdroj videa</Label>
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

            {form.video_provider === 'storage' ? (
              <div className="space-y-3">
                <div
                  className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-8 text-muted-foreground" />
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                    </div>
                  ) : form.storage_path ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">Video nahrano</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {form.storage_path.split('/').pop()}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium">Klikněte pro vyber souboru</p>
                      <p className="text-xs text-muted-foreground">MP4, WebM, MOV, AVI (max 5 GB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Nahravani...</span>
                      <span className="tabular-nums">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Link2 className="size-3.5" />
                  URL videa
                </Label>
                <Input
                  value={form.video_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={
                    form.video_provider === 'youtube'
                      ? 'https://youtube.com/watch?v=...'
                      : form.video_provider === 'vimeo'
                        ? 'https://vimeo.com/...'
                        : 'https://...'
                  }
                />
                {form.video_external_id && (
                  <p className="text-xs text-muted-foreground">ID: {form.video_external_id}</p>
                )}
              </div>
            )}

            {embedUrl && (
              <div className="aspect-video overflow-hidden rounded-lg border">
                <iframe src={embedUrl} title={form.title} className="h-full w-full" allowFullScreen />
              </div>
            )}

            <div className="space-y-2">
              <Label>Nazev videa</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nazev videa"
              />
            </div>

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

            {form.file_size_bytes > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <HardDrive className="size-3" />
                Velikost: {formatBytes(form.file_size_bytes)}
              </p>
            )}

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
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={uploading}>
                Zrusit
              </Button>
              <Button onClick={handleSave} disabled={saving || uploading}>
                {(saving || uploading) && <Loader2 className="mr-2 size-4 animate-spin" />}
                {uploading ? 'Nahravani...' : editingId ? 'Ulozit' : 'Nahrat a ulozit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
