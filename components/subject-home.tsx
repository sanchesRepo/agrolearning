import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, ArrowRight, BookOpen, Clock, Users, TrendingUp } from "lucide-react"

interface SubjectData {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  stats: {
    totalModules: number
    completedModules: number
    totalHours: string
    participants: number
  }
  featuredContent: {
    title: string
    description: string
    thumbnail: string
    duration: string
    type: "video" | "article"
  }[]
  subSubjects: {
    name: string
    description: string
    progress: number
    moduleCount: number
  }[]
}

interface SubjectHomeProps {
  data: SubjectData
}

export function SubjectHome({ data }: SubjectHomeProps) {
  const progressPercentage = (data.stats.completedModules / data.stats.totalModules) * 100

  return (
    <div className="space-y-8">
      {/* Header do Assunto */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <data.icon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-space-grotesk font-bold text-3xl">{data.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {data.description}
            </p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Módulos Totais</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.completedModules} concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duração Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">
                Tempo estimado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.participants.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Pessoas estudando
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conteúdo em Destaque */}
      <div className="space-y-6">
        <h2 className="font-space-grotesk font-bold text-xl">Conteúdo em Destaque</h2>
        
        {data.featuredContent.map((content, index) => (
          <div key={index} className={`grid gap-6 lg:grid-cols-2 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            {/* Vídeo/Imagem */}
            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-lg overflow-hidden group">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <Button
                        size="lg"
                        className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary"
                      >
                        <PlayCircle className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="bg-primary px-2 py-1 rounded text-sm font-medium">
                        {content.duration}
                      </div>
                    </div>
                    {content.type === "article" && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">Artigo</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Texto */}
            <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <h3 className="font-space-grotesk font-bold text-2xl">
                {content.title}
              </h3>
              <p className="text-muted-foreground">
                {content.description}
              </p>
              <Button className="group">
                {content.type === "video" ? "Assistir Vídeo" : "Ler Artigo"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Assuntos */}
      <div className="space-y-6">
        <h2 className="font-space-grotesk font-bold text-xl">Explore por Área</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.subSubjects.map((subSubject, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-space-grotesk text-lg">{subSubject.name}</CardTitle>
                  <Badge variant="outline">
                    {subSubject.moduleCount} módulos
                  </Badge>
                </div>
                <CardDescription>{subSubject.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progresso</span>
                    <span>{subSubject.progress}%</span>
                  </div>
                  <Progress value={subSubject.progress} className="h-2" />
                </div>
                <Button variant="outline" className="w-full group">
                  Explorar {subSubject.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-8 bg-muted/30 rounded-xl">
        <h3 className="font-space-grotesk font-bold text-xl">
          Pronto para Continuar Aprendendo?
        </h3>
        <p className="text-muted-foreground">
          Explore todos os módulos de {data.title} e desenvolva suas habilidades.
        </p>
        <Button size="lg" className="group">
          Continuar Estudos
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
