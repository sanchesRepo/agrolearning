import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

export async function GET(request: NextRequest) {
  try {
    const videosBasePath = path.join(process.cwd(), 'public', 'videos')
    
    // Verificar se o diretório existe
    try {
      await fs.access(videosBasePath)
    } catch {
      return NextResponse.json({ content: [] })
    }

    const content: ModuleContent[] = []

    // Percorrer estrutura de diretórios
    const subjects = await fs.readdir(videosBasePath, { withFileTypes: true })
    
    for (const subjectDir of subjects) {
      if (!subjectDir.isDirectory()) continue
      
      const subjectPath = path.join(videosBasePath, subjectDir.name)
      const subSubjects = await fs.readdir(subjectPath, { withFileTypes: true })
      
      for (const subSubjectDir of subSubjects) {
        if (!subSubjectDir.isDirectory()) continue
        
        const subSubjectPath = path.join(subjectPath, subSubjectDir.name)
        const modules = await fs.readdir(subSubjectPath, { withFileTypes: true })
        
        for (const moduleDir of modules) {
          if (!moduleDir.isDirectory()) continue
          
          const modulePath = path.join(subSubjectPath, moduleDir.name)
          const metadataPath = path.join(modulePath, 'metadata.json')
          
          try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8')
            const metadata = JSON.parse(metadataContent)
            
            if (metadata.videos && metadata.videos.length > 0) {
              const totalSize = metadata.videos.reduce((acc: number, video: VideoMetadata) => acc + video.size, 0)
              
              content.push({
                subject: subjectDir.name,
                subSubject: subSubjectDir.name,
                module: moduleDir.name,
                videos: metadata.videos,
                lastUpdated: metadata.lastUpdated,
                videoCount: metadata.videos.length,
                totalSize
              })
            }
          } catch (error) {
            // Ignorar diretórios sem metadata.json ou com erro
            continue
          }
        }
      }
    }

    // Ordenar por data de atualização (mais recente primeiro)
    content.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Erro ao listar conteúdo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const subSubject = searchParams.get('subSubject')
    const module = searchParams.get('module')
    const fileName = searchParams.get('fileName')

    if (!subject || !subSubject || !module) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: subject, subSubject, module' },
        { status: 400 }
      )
    }

    const videosBasePath = path.join(process.cwd(), 'public', 'videos')
    const modulePath = path.join(videosBasePath, subject, subSubject, module)
    const metadataPath = path.join(modulePath, 'metadata.json')

    if (fileName) {
      // Deletar arquivo específico
      const filePath = path.join(modulePath, fileName)
      
      try {
        await fs.unlink(filePath)
        
        // Atualizar metadata.json
        const metadataContent = await fs.readFile(metadataPath, 'utf8')
        const metadata = JSON.parse(metadataContent)
        
        metadata.videos = metadata.videos.filter((video: VideoMetadata) => video.fileName !== fileName)
        metadata.lastUpdated = new Date().toISOString()
        
        if (metadata.videos.length === 0) {
          // Se não há mais vídeos, deletar diretório inteiro
          await fs.rmdir(modulePath, { recursive: true })
        } else {
          await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
        }
        
        return NextResponse.json({ success: true, message: 'Arquivo deletado com sucesso' })
      } catch (error) {
        console.error('Erro ao deletar arquivo:', error)
        return NextResponse.json(
          { error: 'Erro ao deletar arquivo' },
          { status: 500 }
        )
      }
    } else {
      // Deletar módulo inteiro
      try {
        await fs.rmdir(modulePath, { recursive: true })
        return NextResponse.json({ success: true, message: 'Módulo deletado com sucesso' })
      } catch (error) {
        console.error('Erro ao deletar módulo:', error)
        return NextResponse.json(
          { error: 'Erro ao deletar módulo' },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error('Erro na operação de delete:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
