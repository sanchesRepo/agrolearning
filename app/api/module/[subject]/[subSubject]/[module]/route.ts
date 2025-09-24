import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { uploadSubjects, getSubSubjectsBySubject, getModulesBySubjectAndSubSubject } from '@/lib/upload-data'

interface VideoMetadata {
  fileName: string
  originalName: string
  size: number
  uploadDate: string
  type: string
}

interface ModuleMetadata {
  subject: string
  subSubject: string
  module: string
  videos: VideoMetadata[]
  lastUpdated: string
}

interface ModuleResponse {
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

export async function GET(
  request: NextRequest,
  { params }: { params: { subject: string; subSubject: string; module: string } }
) {
  try {
    const { subject, subSubject, module } = params

    // Validar se a estrutura existe em upload-data.ts
    const subjectData = uploadSubjects.find(s => s.slug === subject)
    if (!subjectData) {
      return NextResponse.json(
        { error: 'Assunto não encontrado' },
        { status: 404 }
      )
    }

    const subSubjectData = subjectData.subSubjects.find(ss => ss.slug === subSubject)
    if (!subSubjectData) {
      return NextResponse.json(
        { error: 'Sub-assunto não encontrado' },
        { status: 404 }
      )
    }

    const moduleData = subSubjectData.modules.find(m => m.slug === module)
    if (!moduleData) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar vídeos reais do módulo
    const videosBasePath = path.join(process.cwd(), 'public', 'videos')
    const modulePath = path.join(videosBasePath, subject, subSubject, module)
    const metadataPath = path.join(modulePath, 'metadata.json')

    let moduleResponse: ModuleResponse = {
      subject: {
        title: subjectData.title,
        slug: subjectData.slug
      },
      subSubject: {
        name: subSubjectData.name,
        slug: subSubjectData.slug
      },
      module: {
        name: moduleData.name,
        slug: moduleData.slug
      },
      videos: [],
      videoCount: 0,
      totalSize: 0,
      lastUpdated: null,
      exists: false
    }

    try {
      // Verificar se o diretório e metadata existem
      await fs.access(modulePath)
      const metadataContent = await fs.readFile(metadataPath, 'utf8')
      const metadata: ModuleMetadata = JSON.parse(metadataContent)

      if (metadata.videos && metadata.videos.length > 0) {
        const totalSize = metadata.videos.reduce((acc, video) => acc + video.size, 0)

        moduleResponse = {
          ...moduleResponse,
          videos: metadata.videos,
          videoCount: metadata.videos.length,
          totalSize,
          lastUpdated: metadata.lastUpdated,
          exists: true
        }
      }
    } catch (error) {
      // Módulo existe na estrutura mas não tem vídeos ainda
      // Retornar estrutura vazia mas válida
    }

    return NextResponse.json(moduleResponse)
  } catch (error) {
    console.error('Erro ao buscar dados do módulo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// API para marcar vídeo como assistido (para futuro sistema de progresso)
export async function POST(
  request: NextRequest,
  { params }: { params: { subject: string; subSubject: string; module: string } }
) {
  try {
    const { subject, subSubject, module } = params
    const body = await request.json()
    const { videoFileName, watched = true } = body

    // Por enquanto, apenas retornar sucesso
    // Futuramente pode ser implementado sistema de tracking
    
    return NextResponse.json({
      success: true,
      message: `Vídeo ${watched ? 'marcado como assistido' : 'desmarcado'}`
    })
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
