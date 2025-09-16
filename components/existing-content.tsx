"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { 
  FileVideo, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Play, 
  Calendar,
  HardDrive,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadSubjects, getSubSubjectsBySubject, getModulesBySubjectAndSubSubject } from "@/lib/upload-data"

interface VideoMetadata {
  fileName: string
  originalName: string
  size: number
  uploadDate: string
  type: string
}

interface ModuleContent {
  subject: string
  subSubject: string
  module: string
  videos: VideoMetadata[]
  lastUpdated: string
  videoCount: number
  totalSize: number
}

export function ExistingContent() {
  const [content, setContent] = useState<ModuleContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/content')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar conteúdo')
      }
      
      const data = await response.json()
      setContent(data.content || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const toggleModule = (moduleKey: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleKey)) {
      newExpanded.delete(moduleKey)
    } else {
      newExpanded.add(moduleKey)
    }
    setExpandedModules(newExpanded)
  }

  const deleteVideo = async (moduleContent: ModuleContent, fileName: string) => {
    const deleteKey = `${moduleContent.subject}-${moduleContent.subSubject}-${moduleContent.module}-${fileName}`
    
    if (deletingItems.has(deleteKey)) return
    
    if (!confirm(`Tem certeza que deseja deletar o vídeo "${fileName}"?`)) return

    try {
      setDeletingItems(prev => new Set(prev).add(deleteKey))
      
      const response = await fetch(`/api/content?subject=${moduleContent.subject}&subSubject=${moduleContent.subSubject}&module=${moduleContent.module}&fileName=${fileName}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar vídeo')
      }

      // Atualizar lista
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar vídeo')
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(deleteKey)
        return newSet
      })
    }
  }

  const deleteModule = async (moduleContent: ModuleContent) => {
    const deleteKey = `${moduleContent.subject}-${moduleContent.subSubject}-${moduleContent.module}`
    
    if (deletingItems.has(deleteKey)) return
    
    if (!confirm(`Tem certeza que deseja deletar TODO o módulo "${moduleContent.module}" com ${moduleContent.videoCount} vídeo(s)?`)) return

    try {
      setDeletingItems(prev => new Set(prev).add(deleteKey))
      
      const response = await fetch(`/api/content?subject=${moduleContent.subject}&subSubject=${moduleContent.subSubject}&module=${moduleContent.module}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar módulo')
      }

      // Atualizar lista
      await fetchContent()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar módulo')
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(deleteKey)
        return newSet
      })
    }
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDisplayNames = (moduleContent: ModuleContent) => {
    const subject = uploadSubjects.find(s => s.slug === moduleContent.subject)
    const subSubjects = subject ? getSubSubjectsBySubject(subject.slug) : []
    const subSubject = subSubjects.find(s => s.slug === moduleContent.subSubject)
    const modules = subject && subSubject ? getModulesBySubjectAndSubSubject(subject.slug, subSubject.slug) : []
    const module = modules.find(m => m.slug === moduleContent.module)

    return {
      subjectName: subject?.title || moduleContent.subject,
      subSubjectName: subSubject?.name || moduleContent.subSubject,
      moduleName: module?.name || moduleContent.module
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Conteúdos Existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando conteúdos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Conteúdos Existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={fetchContent} 
            className="mt-4"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5" />
              Conteúdos Existentes
            </CardTitle>
            <CardDescription>
              {content.length === 0 
                ? "Nenhum conteúdo encontrado" 
                : `${content.length} módulo(s) com conteúdo`
              }
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchContent}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      
      {content.length > 0 && (
        <CardContent className="space-y-3">
          {content.map((moduleContent) => {
            const moduleKey = `${moduleContent.subject}-${moduleContent.subSubject}-${moduleContent.module}`
            const isExpanded = expandedModules.has(moduleKey)
            const isDeleting = deletingItems.has(moduleKey)
            const { subjectName, subSubjectName, moduleName } = getDisplayNames(moduleContent)

            return (
              <Collapsible key={moduleKey} open={isExpanded} onOpenChange={() => toggleModule(moduleKey)}>
                <div className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {subjectName}
                            </Badge>
                            <span className="text-muted-foreground text-xs">→</span>
                            <Badge variant="secondary" className="text-xs">
                              {subSubjectName}
                            </Badge>
                            <span className="text-muted-foreground text-xs">→</span>
                            <Badge variant="secondary" className="text-xs">
                              {moduleName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileVideo className="h-3 w-3" />
                              {moduleContent.videoCount} vídeo(s)
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {formatFileSize(moduleContent.totalSize)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(moduleContent.lastUpdated)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteModule(moduleContent)
                        }}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive"
                      >
                        {isDeleting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="border-t bg-muted/20 p-3 space-y-2">
                      {moduleContent.videos.map((video) => {
                        const videoDeleteKey = `${moduleKey}-${video.fileName}`
                        const isVideoDeleting = deletingItems.has(videoDeleteKey)
                        
                        return (
                          <div key={video.fileName} className="flex items-center justify-between p-2 bg-background rounded border">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Play className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {video.originalName}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{formatFileSize(video.size)}</span>
                                  <span>{formatDate(video.uploadDate)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const videoUrl = `/videos/${moduleContent.subject}/${moduleContent.subSubject}/${moduleContent.module}/${video.fileName}`
                                  window.open(videoUrl, '_blank')
                                }}
                                className="text-primary hover:text-primary"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteVideo(moduleContent, video.fileName)}
                                disabled={isVideoDeleting}
                                className="text-destructive hover:text-destructive"
                              >
                                {isVideoDeleting ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
}
