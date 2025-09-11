import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MediaCarousel } from "@/components/media-carousel"
import { MediaGallery } from "@/components/media-gallery"
import { CheckCircle2, Download, PlayCircle } from "lucide-react"
import type { ContentData } from "@/lib/content-data"

interface ContentViewerProps {
  contentData: ContentData
}

export function ContentViewer({ contentData }: ContentViewerProps) {
  const sampleMediaItems = [
    {
      id: "1",
      type: "image" as const,
      title: "Técnicas de Plantio Direto",
      description: "Demonstração visual das técnicas modernas de plantio",
      url: "/agricultural-field-planting.png",
      thumbnail: "/agricultural-field-planting.png",
      category: "plantio",
    },
    {
      id: "2",
      type: "image" as const,
      title: "Preparação do Solo",
      description: "Processo completo de preparação do solo para cultivo",
      url: "/soil-preparation-farming.png",
      thumbnail: "/soil-preparation-farming.png",
      category: "solo",
    },
    {
      id: "3",
      type: "video" as const,
      title: "Vídeo Demonstrativo",
      description: "Tutorial completo sobre as técnicas apresentadas",
      url: "/placeholder.mp4",
      thumbnail: "/placeholder-3gk5n.png",
      duration: "15:30",
      category: "tutorial",
    },
    {
      id: "4",
      type: "document" as const,
      title: "Manual Técnico",
      description: "Guia completo em PDF com todas as informações",
      url: "/manual.pdf",
      thumbnail: "/placeholder-qyuct.png",
      category: "documentos",
    },
  ]

  const renderContent = () => {
    switch (contentData.type) {
      case "Artigo":
        return <ArticleContent content={contentData} mediaItems={sampleMediaItems} />
      case "Vídeo":
        return <VideoContent content={contentData} mediaItems={sampleMediaItems} />
      case "Infográfico":
        return <InfographicContent content={contentData} mediaItems={sampleMediaItems} />
      case "Quiz":
        return <QuizContent content={contentData} />
      default:
        return <ArticleContent content={contentData} mediaItems={sampleMediaItems} />
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Main Content */}
      <div className="lg:col-span-3">{renderContent()}</div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk text-lg">Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Concluído</span>
                <span>{contentData.progress}%</span>
              </div>
              <Progress value={contentData.progress} className="h-2" />
            </div>
            <Button className="w-full mt-4" size="sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar como Concluído
            </Button>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk text-lg">Recursos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentData.resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded bg-secondary/10 flex items-center justify-center">
                  <Download className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Points */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk text-lg">Pontos Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {contentData.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ArticleContent({ content, mediaItems }: { content: ContentData; mediaItems: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-gray max-w-none">
            <div className="mb-6">
              <img
                src={content.featuredImage || "/placeholder.svg?height=400&width=800"}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="font-space-grotesk font-bold text-xl mb-3">{section.title}</h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.image && (
                    <div className="my-6">
                      <img
                        src={section.image || "/placeholder.svg"}
                        alt={section.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <MediaCarousel items={mediaItems} />
    </div>
  )
}

function VideoContent({ content, mediaItems }: { content: ContentData; mediaItems: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
            <div className="text-center text-white">
              <PlayCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Player de Vídeo</p>
              <p className="text-sm text-white/70">Clique para reproduzir</p>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-space-grotesk font-semibold text-lg mb-2">{content.title}</h3>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Transcrição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{section.title}</h4>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-sm text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MediaGallery items={mediaItems} title="Mídia Relacionada" />
    </div>
  )
}

function InfographicContent({ content, mediaItems }: { content: ContentData; mediaItems: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <img
              src={content.featuredImage || "/placeholder.svg?height=600&width=800"}
              alt={content.title}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {content.sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="font-space-grotesk text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-sm text-muted-foreground mb-2">
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <MediaCarousel items={mediaItems} />
    </div>
  )
}

function QuizContent({ content }: { content: ContentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-space-grotesk">Quiz: {content.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">{section.title}</h4>
              <div className="space-y-2">
                {section.content.map((option, oIndex) => (
                  <label key={oIndex} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`question-${index}`} className="text-primary" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <Button className="w-full">Enviar Respostas</Button>
        </div>
      </CardContent>
    </Card>
  )
}
