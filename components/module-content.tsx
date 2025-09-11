import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { VideoPlayer } from "@/components/video-player"
import { PlayCircle, FileText, ImageIcon, CheckCircle2 } from "lucide-react"
import type { ModuleData } from "@/lib/module-data"

interface ModuleContentProps {
  moduleData: ModuleData
}

export function ModuleContent({ moduleData }: ModuleContentProps) {
  const sampleVideos = [
    {
      id: "1",
      title: "Introdução ao Plantio",
      duration: "15:30",
      thumbnail: "/agricultural-field-planting.png",
      videoUrl: "/placeholder.mp4",
      description: "Conceitos fundamentais sobre técnicas de plantio modernas",
    },
    {
      id: "2",
      title: "Preparação do Solo",
      duration: "22:15",
      thumbnail: "/soil-preparation-farming.png",
      videoUrl: "/placeholder.mp4",
      description: "Como preparar adequadamente o solo para diferentes culturas",
    },
    {
      id: "3",
      title: "Seleção de Sementes",
      duration: "18:45",
      thumbnail: "/placeholder-3gk5n.png",
      videoUrl: "/placeholder.mp4",
      description: "Critérios para escolha das melhores sementes",
    },
    {
      id: "4",
      title: "Técnicas de Espaçamento",
      duration: "25:20",
      thumbnail: "/placeholder-qyuct.png",
      videoUrl: "/placeholder.mp4",
      description: "Otimização do espaçamento entre plantas e fileiras",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Video Player Section with Module Info */}
      <div>
        <h2 className="font-space-grotesk font-bold text-xl mb-4">Conteúdo em Vídeo</h2>
        <div className="grid gap-6 xl:grid-cols-4">
          {/* Video Player */}
          <div className="xl:col-span-3">
            <VideoPlayer videos={sampleVideos} />
          </div>
          
          {/* Sidebar for XL screens - Module Info + Progress */}
          <div className="hidden xl:block space-y-4">
            {/* Module Info */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="font-space-grotesk text-lg">Informações do Módulo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Objetivos de Aprendizado</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {moduleData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-xs leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Recursos Necessários</h4>
                  <div className="flex flex-wrap gap-1">
                    {moduleData.resources.map((resource, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Card - Compact Vertical Layout */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="font-space-grotesk text-base">Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{moduleData.progress}%</div>
                  <p className="text-xs text-muted-foreground">Concluído</p>
                </div>
                <Progress value={moduleData.progress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  {Math.round((moduleData.progress / 100) * moduleData.sections.length)} de {moduleData.sections.length} seções
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card - Only visible on smaller screens */}
          <Card className="xl:hidden">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Progresso do Módulo</CardTitle>
              <CardDescription>Acompanhe seu avanço neste módulo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Concluído</span>
                  <span>{moduleData.progress}%</span>
                </div>
                <Progress value={moduleData.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <div className="space-y-4">
            {moduleData.sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-space-grotesk text-lg">{section.title}</CardTitle>
                    <Badge variant={section.completed ? "default" : "secondary"}>
                      {section.completed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : null}
                      {section.completed ? "Concluído" : "Pendente"}
                    </Badge>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.content.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={`/conteudo/agricultura/primavera/plantio/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        {item.type === "video" && <PlayCircle className="h-5 w-5 text-primary" />}
                        {item.type === "text" && <FileText className="h-5 w-5 text-muted-foreground" />}
                        {item.type === "image" && <ImageIcon className="h-5 w-5 text-secondary" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.duration}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Info - Hidden on XL screens (shown next to video) */}
          <Card className="xl:hidden">
            <CardHeader>
              <CardTitle className="font-space-grotesk">Informações do Módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Objetivos de Aprendizado</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {moduleData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Recursos Necessários</h4>
                <div className="flex flex-wrap gap-1">
                  {moduleData.resources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <PlayCircle className="h-4 w-4 mr-2" />
                Continuar Módulo
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Baixar Material
              </Button>
            </CardContent>
          </Card>

          {/* Related Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="font-space-grotesk">Módulos Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moduleData.relatedModules.map((related, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <PlayCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{related.title}</p>
                    <p className="text-xs text-muted-foreground">{related.duration}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
