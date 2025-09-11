import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, ArrowRight, BookOpen, Clock, CheckCircle2, Star } from "lucide-react"

interface ModuleData {
  name: string
  description: string
  duration: string
  difficulty: "Básico" | "Intermediário" | "Avançado"
  progress: number
  completed: boolean
  contentCount: number
}

interface SubSubjectData {
  title: string
  description: string
  parentSubject: string
  totalDuration: string
  difficulty: "Básico" | "Intermediário" | "Avançado"
  prerequisites: string[]
  learningObjectives: string[]
  featuredVideo: {
    title: string
    description: string
    thumbnail: string
    duration: string
    instructor: string
  }
  modules: ModuleData[]
  stats: {
    totalModules: number
    completedModules: number
    totalProgress: number
    estimatedTime: string
  }
}

interface SubSubjectHomeProps {
  data: SubSubjectData
}

export function SubSubjectHome({ data }: SubSubjectHomeProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico": return "bg-green-100 text-green-800"
      case "Intermediário": return "bg-yellow-100 text-yellow-800"
      case "Avançado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header do Sub-Assunto */}
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground">
            <span>{data.parentSubject}</span>
            <span className="mx-2">→</span>
            <span className="text-foreground font-medium">{data.title}</span>
          </nav>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="font-space-grotesk font-bold text-3xl">{data.title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {data.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{data.totalDuration}</span>
                </div>
                <Badge className={getDifficultyColor(data.difficulty)}>
                  {data.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Progresso */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="text-xs font-bold text-primary">{Math.round(data.stats.totalProgress)}%</div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={data.stats.totalProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {data.stats.completedModules} de {data.stats.totalModules} módulos concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Restante</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.estimatedTime}</div>
              <p className="text-xs text-muted-foreground">
                Para conclusão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Módulos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para estudo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vídeo em Destaque */}
      <div className="grid gap-6 lg:grid-cols-2 items-center">
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden group">
                <img
                  src={data.featuredVideo.thumbnail}
                  alt={data.featuredVideo.title}
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
                    {data.featuredVideo.duration}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Destaque
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-space-grotesk font-bold text-2xl">
            {data.featuredVideo.title}
          </h2>
          <p className="text-muted-foreground">
            {data.featuredVideo.description}
          </p>
          <div className="text-sm text-muted-foreground">
            Instrutor: <span className="font-medium text-foreground">{data.featuredVideo.instructor}</span>
          </div>
          <Button className="group">
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Informações do Curso */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Objetivos de Aprendizado */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Objetivos de Aprendizado</CardTitle>
            <CardDescription>O que você vai aprender neste módulo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pré-requisitos */}
        <Card>
          <CardHeader>
            <CardTitle className="font-space-grotesk">Pré-requisitos</CardTitle>
            <CardDescription>Conhecimentos recomendados antes de iniciar</CardDescription>
          </CardHeader>
          <CardContent>
            {data.prerequisites.length > 0 ? (
              <ul className="space-y-2">
                {data.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum pré-requisito específico. Este módulo é adequado para iniciantes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Módulos */}
      <div className="space-y-6">
        <h2 className="font-space-grotesk font-bold text-xl">Módulos do Curso</h2>
        
        <div className="space-y-4">
          {data.modules.map((module, index) => (
            <Card key={index} className={`transition-all hover:shadow-md ${module.completed ? 'bg-muted/30' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-space-grotesk text-lg">
                        {index + 1}. {module.name}
                      </CardTitle>
                      {module.completed && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{module.duration}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{module.contentCount} conteúdos</span>
                      <span>{module.progress}% concluído</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                  <div className="ml-4">
                    <Button 
                      variant={module.completed ? "outline" : "default"}
                      size="sm"
                    >
                      {module.completed ? "Revisar" : module.progress > 0 ? "Continuar" : "Iniciar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
