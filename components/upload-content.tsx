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
import { ExistingContent } from "@/components/existing-content"

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
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

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

  // Upload files with progress tracking
  const handleUpload = async () => {
    if (!canUpload) return

    setIsUploading(true)
    const startTime = Date.now()

    const formData = new FormData()
    formData.append('subject', selectedSubject)
    formData.append('subSubject', selectedSubSubject)
    formData.append('module', selectedModule)

    // Update files to uploading status
    setSelectedFiles(prev => prev.map(f => 
      f.status === 'ready' ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ))

    try {
      const validFiles = selectedFiles.filter(f => f.status === 'ready' || f.status === 'uploading')
      
      // Add files to form data
      validFiles.forEach((fileObj, index) => {
        formData.append('videos', fileObj.file)
      })

      // Simulate progress for better UX (since we can't track real progress with FormData)
      const progressInterval = setInterval(() => {
        setSelectedFiles(prev => prev.map(f => {
          if (f.status === 'uploading' && f.progress < 95) {
            // Simulate realistic upload progress
            const increment = Math.random() * 15 + 5 // 5-20% increments
            return { ...f, progress: Math.min(95, f.progress + increment) }
          }
          return f
        }))
      }, 1000)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(errorData.error || 'Erro no upload')
      }

      const result = await response.json()

      // Update files to success status
      setSelectedFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success' as const, progress: 100 } : f
      ))

      // Show success message
      setUploadSuccess(result.message || `${validFiles.length} arquivos enviados com sucesso!`)

      // Clear success message and files after delay
      setTimeout(() => {
        setUploadSuccess(null)
        setSelectedFiles([])
      }, 8000)

    } catch (error) {
      // Update files to error status
      setSelectedFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { 
          ...f, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Erro no upload' 
        } : f
      ))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            {uploadSuccess}
          </AlertDescription>
        </Alert>
      )}

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
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg transition-all",
                      fileObj.status === 'success' && "bg-green-50 border-green-200",
                      fileObj.status === 'error' && "bg-red-50 border-red-200",
                      fileObj.status === 'uploading' && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <FileVideo className={cn(
                      "h-5 w-5",
                      fileObj.status === 'success' && "text-green-600",
                      fileObj.status === 'error' && "text-red-600",
                      fileObj.status === 'uploading' && "text-blue-600",
                      fileObj.status === 'ready' && "text-muted-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {/* Progress bar for uploading files */}
                      {fileObj.status === 'uploading' && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-blue-600">Enviando...</span>
                            <span className="text-blue-600">{Math.round(fileObj.progress)}%</span>
                          </div>
                          <Progress value={fileObj.progress} className="h-2" />
                        </div>
                      )}
                      
                      {/* Success message */}
                      {fileObj.status === 'success' && (
                        <p className="text-xs text-green-600 mt-1 font-medium">✓ Upload concluído</p>
                      )}
                      
                      {/* Error message */}
                      {fileObj.error && (
                        <p className="text-xs text-destructive mt-1 font-medium">
                          ✗ {fileObj.error}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileObj.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {fileObj.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      {fileObj.status === 'uploading' && (
                        <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      {!isUploading && fileObj.status !== 'success' && (
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

          {/* Overall Progress */}
          {isUploading && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Progresso Geral</span>
                <span className="text-sm text-blue-700">
                  {selectedFiles.filter(f => f.status === 'success').length} de {selectedFiles.filter(f => f.status !== 'error').length} arquivos
                </span>
              </div>
              <Progress 
                value={
                  selectedFiles.length > 0 
                    ? (selectedFiles.reduce((acc, f) => acc + f.progress, 0) / selectedFiles.length)
                    : 0
                } 
                className="h-2"
              />
              <p className="text-xs text-blue-600">
                {selectedFiles.some(f => f.status === 'uploading') 
                  ? "Upload em andamento... Por favor, não feche esta página."
                  : "Processando arquivos..."
                }
              </p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!canUpload}
              size="lg"
              className={cn(
                isUploading && "cursor-not-allowed opacity-75"
              )}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Fazer Upload
                </div>
              )}
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

      {/* Existing Content */}
      <ExistingContent />
    </div>
  )
}

