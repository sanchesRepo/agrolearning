import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const subject = formData.get('subject') as string
    const subSubject = formData.get('subSubject') as string
    const module = formData.get('module') as string
    const videos = formData.getAll('videos') as File[]

    // Validações básicas
    if (!subject || !subSubject || !module) {
      return NextResponse.json(
        { error: 'Classificação incompleta' },
        { status: 400 }
      )
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum vídeo selecionado' },
        { status: 400 }
      )
    }

    if (videos.length > 6) {
      return NextResponse.json(
        { error: 'Máximo de 6 vídeos por upload' },
        { status: 400 }
      )
    }

    // Validar cada arquivo
    for (const video of videos) {
      if (video.type !== 'video/mp4') {
        return NextResponse.json(
          { error: `Arquivo ${video.name} não é MP4` },
          { status: 400 }
        )
      }

      if (video.size > 500 * 1024 * 1024) { // 500MB
        return NextResponse.json(
          { error: `Arquivo ${video.name} é muito grande (máx. 500MB)` },
          { status: 400 }
        )
      }
    }

    // Criar estrutura de diretórios
    const videosBasePath = path.join(process.cwd(), 'public', 'videos')
    const targetPath = path.join(videosBasePath, subject, subSubject, module)

    try {
      await fs.mkdir(targetPath, { recursive: true })
    } catch (error) {
      console.error('Erro ao criar diretórios:', error)
      return NextResponse.json(
        { error: 'Erro ao criar estrutura de pastas' },
        { status: 500 }
      )
    }

    // Salvar arquivos
    const savedFiles: string[] = []

    for (const video of videos) {
      try {
        const bytes = await video.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Gerar nome único para evitar conflitos
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substr(2, 9)
        const fileExtension = path.extname(video.name)
        const fileName = `${timestamp}-${randomId}${fileExtension}`
        
        const filePath = path.join(targetPath, fileName)
        await fs.writeFile(filePath, buffer)

        savedFiles.push(fileName)
      } catch (error) {
        console.error(`Erro ao salvar ${video.name}:`, error)
        return NextResponse.json(
          { error: `Erro ao salvar ${video.name}` },
          { status: 500 }
        )
      }
    }

    // Salvar/atualizar metadados
    const metadataPath = path.join(targetPath, 'metadata.json')
    let existingMetadata: any = { videos: [] }

    try {
      const existingData = await fs.readFile(metadataPath, 'utf8')
      existingMetadata = JSON.parse(existingData)
    } catch (error) {
      // Arquivo não existe ainda, usar estrutura inicial
    }

    // Adicionar novos vídeos aos metadados
    const newVideos = savedFiles.map((fileName, index) => ({
      fileName,
      originalName: videos[index].name,
      size: videos[index].size,
      uploadDate: new Date().toISOString(),
      type: videos[index].type
    }))

    existingMetadata.videos.push(...newVideos)
    existingMetadata.lastUpdated = new Date().toISOString()
    existingMetadata.subject = subject
    existingMetadata.subSubject = subSubject
    existingMetadata.module = module

    try {
      await fs.writeFile(metadataPath, JSON.stringify(existingMetadata, null, 2))
    } catch (error) {
      console.error('Erro ao salvar metadados:', error)
      // Não retornamos erro aqui pois os vídeos já foram salvos
    }

    return NextResponse.json({
      success: true,
      message: `${savedFiles.length} vídeos enviados com sucesso`,
      files: savedFiles,
      path: `/videos/${subject}/${subSubject}/${module}/`
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}

