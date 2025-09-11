"use client"

import { useState, useCallback } from "react"
import { uploadSubjects, getSubSubjectsBySubject, getModulesBySubjectAndSubSubject } from "@/lib/upload-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileVideo, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectedFile {
  file: File
  id: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export function UploadContent() {
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>("")
  const [selectedModule, setSelectedModule] = useState<string>("")
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const subSubjects = selectedSubject ? getSubSubjectsBySubject(selectedSubject) : []
  const modules = selectedSubject && selectedSubSubject 
    ? getModulesBySubjectAndSubSubject(selectedSubject, selectedSubSubject) 
    : []

  const canUpload = selectedSubject && selectedSubSubject && selectedModule && selectedFiles.length > 0 && !isUploading

  // Reset dependent selectors when parent changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    setSelectedSubSubject("")
    setSelectedModule("")
  }

  const handleSubSubjectChange = (value: string) => {
    setSelectedSubSubject(value)
    setSelectedModule("")
  }

  // File validation
  const validateFile = (file: File): string | null => {
    if (file.type !== "video/mp4") {
      return "Apenas arquivos MP4 são aceitos"
    }
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      return "Arquivo muito grande (máximo 500MB)"
    }
    return null
  }

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: SelectedFile[] = []
    const currentFileCount = selectedFiles.length

    for (let i = 0; i < Math.min(files.length, 6 - currentFileCount); i++) {
      const file = files[i]
      const error = validateFile(file)
      
      newFiles.push({
        file,
        id: `${Date.now()}-${i}`,
        status: error ? 'error' : 'ready',
        progress: 0,
        error
      })
    }

    setSelectedFiles(prev => [...prev, ...newFiles])
  }, [selectedFiles.length])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  // Remove file
  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id))
  }

  // Upload files
  const handleUpload = async () => {
    if (!canUpload) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('subject', selectedSubject)
    formData.append('subSubject', selectedSubSubject)
    formData.append('module', selectedModule)

    // Update files to uploading status
    setSelectedFiles(prev => prev.map(f => 
      f.status === 'ready' ? { ...f, status: 'uploading' as const } : f
    ))

    try {
      const validFiles = selectedFiles.filter(f => f.status === 'ready' || f.status === 'uploading')
      
      // Add files to form data
      validFiles.forEach((fileObj, index) => {
        formData.append('videos', fileObj.file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const result = await response.json()

      // Update files to success status
      setSelectedFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success' as const, progress: 100 } : f
      ))

      // Optional: Clear files after success
      setTimeout(() => {
        setSelectedFiles([])
      }, 3000)

    } catch (error) {
      // Update files to error status
      setSelectedFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { 
          ...f, 
          status: 'error' as const, 
          error: 'Erro no upload' 
        } : f
      ))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Classification Selectors */}
      <Card>
        <CardHeader>
          <CardTitle>Classificação do Conteúdo</CardTitle>
          <CardDescription>
            Selecione a categoria, subcategoria e módulo para organizar seus vídeos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assunto</label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o assunto" />
                </SelectTrigger>
                <SelectContent>
                  {uploadSubjects.map((subject) => (
                    <SelectItem key={subject.slug} value={subject.slug}>
                      {subject.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SubSubject Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub-assunto</label>
              <Select 
                value={selectedSubSubject} 
                onValueChange={handleSubSubjectChange}
                disabled={!selectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sub-assunto" />
                </SelectTrigger>
                <SelectContent>
                  {subSubjects.map((subSubject) => (
                    <SelectItem key={subSubject.slug} value={subSubject.slug}>
                      {subSubject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Module Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Módulo</label>
              <Select 
                value={selectedModule} 
                onValueChange={setSelectedModule}
                disabled={!selectedSubSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.slug} value={module.slug}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Path Display */}
          {selectedSubject && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">
                {uploadSubjects.find(s => s.slug === selectedSubject)?.title}
              </Badge>
              {selectedSubSubject && (
                <>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="secondary">
                    {subSubjects.find(s => s.slug === selectedSubSubject)?.name}
                  </Badge>
                </>
              )}
              {selectedModule && (
                <>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="secondary">
                    {modules.find(m => m.slug === selectedModule)?.name}
                  </Badge>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Vídeos</CardTitle>
          <CardDescription>
            Máximo de 6 vídeos por sessão. Apenas arquivos MP4 (máx. 500MB cada)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              selectedFiles.length >= 6 && "opacity-50 pointer-events-none"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {selectedFiles.length >= 6 
                  ? "Limite de 6 vídeos atingido" 
                  : "Arraste seus vídeos aqui"
                }
              </p>
              <p className="text-sm text-muted-foreground">
                ou{" "}
                <label className="text-primary hover:underline cursor-pointer">
                  clique para selecionar
                  <input
                    type="file"
                    multiple
                    accept="video/mp4"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={selectedFiles.length >= 6}
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                {6 - selectedFiles.length} vídeos restantes
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos selecionados ({selectedFiles.length}/6)</h4>
              <div className="space-y-2">
                {selectedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <FileVideo className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {fileObj.status === 'uploading' && (
                        <Progress value={fileObj.progress} className="mt-1" />
                      )}
                      {fileObj.error && (
                        <p className="text-xs text-destructive mt-1">{fileObj.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileObj.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {fileObj.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {!isUploading && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileObj.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!canUpload}
              size="lg"
            >
              {isUploading ? "Enviando..." : "Fazer Upload"}
            </Button>
          </div>

          {/* Validation Messages */}
          {selectedFiles.length === 0 && selectedModule && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecione ao menos um vídeo para fazer upload
              </AlertDescription>
            </Alert>
          )}

          {!selectedModule && selectedFiles.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete a classificação do conteúdo antes de fazer upload
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

