import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { PlayCircle, VideoIcon, Calendar, HardDrive } from "lucide-react"

// Interface para os dados reais do módulo
interface VideoMetadata {
  fileName: string
  originalName: string
  size: number
  uploadDate: string
  type: string
}

interface RealModuleData {
  subject: {
    title: string
    slug: string
  }
  subSubject: {
    name: string
    slug: string
  }
  module: {
    name: string
    slug: string
  }
  videos: VideoMetadata[]
  videoCount: number
  totalSize: number
  lastUpdated: string | null
  exists: boolean
}

interface ModuleContentProps {
  moduleData: RealModuleData
}

export function ModuleContent({ moduleData }: ModuleContentProps) {
  // Converter vídeos reais para formato do player
  const realVideos = moduleData.videos.map((video, index) => ({
    id: video.fileName,
    title: video.originalName.replace(/\.(mp4|avi|mov|wmv)$/i, ''),
    duration: "Duração não disponível",
    thumbnail: "/placeholder.jpg",
    videoUrl: `/videos/${moduleData.subject.slug}/${moduleData.subSubject.slug}/${moduleData.module.slug}/${video.fileName}`,
    description: `Vídeo ${index + 1} do módulo ${moduleData.module.name}`,
  }))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Module Info Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-space-grotesk font-bold text-2xl text-foreground">
              {moduleData.module.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {moduleData.subject.title} → {moduleData.subSubject.name}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <VideoIcon className="h-4 w-4" />
              <span>{moduleData.videoCount} vídeo(s)</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              <span>{formatFileSize(moduleData.totalSize)}</span>
            </div>
            {moduleData.lastUpdated && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Atualizado em {formatDate(moduleData.lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      {moduleData.exists && realVideos.length > 0 ? (
        <div>
          <h2 className="font-space-grotesk font-bold text-xl mb-4">Conteúdo em Vídeo</h2>
          <div className="grid gap-6 xl:grid-cols-4">
            {/* Video Player */}
            <div className="xl:col-span-3">
              <VideoPlayer videos={realVideos} />
            </div>
          
            {/* Sidebar for XL screens - Module Info */}
            <div className="hidden xl:block space-y-4">
              {/* Videos List */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="font-space-grotesk text-lg">Vídeos do Módulo</CardTitle>
                  <CardDescription>
                    {moduleData.videoCount} vídeo(s) disponível(is)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {realVideos.map((video, index) => (
                    <div key={video.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0">
                        <PlayCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">{video.title}</h5>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(moduleData.videos[index].size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* No Videos Available */
        <div className="text-center py-12">
          <VideoIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-space-grotesk font-semibold text-lg text-muted-foreground mb-2">
            Nenhum vídeo disponível
          </h3>
          <p className="text-muted-foreground mb-4">
            Este módulo ainda não possui conteúdo em vídeo.
          </p>
          <Button variant="outline" asChild>
            <a href="/admin/upload">Fazer Upload de Conteúdo</a>
          </Button>
        </div>
      )}
    </div>
  )
}
