import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { uploadSubjects } from '@/lib/upload-data'

interface SubjectStats {
  title: string
  slug: string
  totalModules: number
  modulesWithContent: number
  totalVideos: number
  totalSize: number
  lastUpdated: string | null
  subSubjects: {
    name: string
    slug: string
    totalModules: number
    modulesWithContent: number
    totalVideos: number
    modules: {
      name: string
      slug: string
      hasContent: boolean
      videoCount: number
      lastUpdated: string | null
    }[]
  }[]
}

export async function GET(request: NextRequest) {
  try {
    const videosBasePath = path.join(process.cwd(), 'public', 'videos')
    const subjectsStats: SubjectStats[] = []

    for (const subject of uploadSubjects) {
      let subjectTotalVideos = 0
      let subjectTotalSize = 0
      let subjectLastUpdated: string | null = null
      let subjectModulesWithContent = 0

      const subSubjectsStats = []

      for (const subSubject of subject.subSubjects) {
        let subSubjectTotalVideos = 0
        let subSubjectModulesWithContent = 0
        const modulesStats = []

        for (const module of subSubject.modules) {
          const modulePath = path.join(videosBasePath, subject.slug, subSubject.slug, module.slug)
          const metadataPath = path.join(modulePath, 'metadata.json')

          let hasContent = false
          let videoCount = 0
          let lastUpdated: string | null = null

          try {
            await fs.access(modulePath)
            const metadataContent = await fs.readFile(metadataPath, 'utf8')
            const metadata = JSON.parse(metadataContent)

            if (metadata.videos && metadata.videos.length > 0) {
              hasContent = true
              videoCount = metadata.videos.length
              lastUpdated = metadata.lastUpdated

              // Somar estatísticas
              subjectTotalVideos += videoCount
              subSubjectTotalVideos += videoCount
              subjectModulesWithContent++
              subSubjectModulesWithContent++

              const moduleSize = metadata.videos.reduce((acc: number, video: any) => acc + video.size, 0)
              subjectTotalSize += moduleSize

              // Atualizar data mais recente
              if (!subjectLastUpdated || (lastUpdated && new Date(lastUpdated) > new Date(subjectLastUpdated))) {
                subjectLastUpdated = lastUpdated
              }
            }
          } catch (error) {
            // Módulo não tem conteúdo ainda
          }

          modulesStats.push({
            name: module.name,
            slug: module.slug,
            hasContent,
            videoCount,
            lastUpdated
          })
        }

        subSubjectsStats.push({
          name: subSubject.name,
          slug: subSubject.slug,
          totalModules: subSubject.modules.length,
          modulesWithContent: subSubjectModulesWithContent,
          totalVideos: subSubjectTotalVideos,
          modules: modulesStats
        })
      }

      subjectsStats.push({
        title: subject.title,
        slug: subject.slug,
        totalModules: subject.subSubjects.reduce((acc, ss) => acc + ss.modules.length, 0),
        modulesWithContent: subjectModulesWithContent,
        totalVideos: subjectTotalVideos,
        totalSize: subjectTotalSize,
        lastUpdated: subjectLastUpdated,
        subSubjects: subSubjectsStats
      })
    }

    return NextResponse.json({
      subjects: subjectsStats,
      summary: {
        totalSubjects: subjectsStats.length,
        totalModules: subjectsStats.reduce((acc, s) => acc + s.totalModules, 0),
        totalModulesWithContent: subjectsStats.reduce((acc, s) => acc + s.modulesWithContent, 0),
        totalVideos: subjectsStats.reduce((acc, s) => acc + s.totalVideos, 0),
        totalSize: subjectsStats.reduce((acc, s) => acc + s.totalSize, 0)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos assuntos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
