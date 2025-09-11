import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, ArrowRight } from "lucide-react"

export function HomeContent() {
  return (
    <div className="space-y-8">
      {/* Header da Home */}
      <div className="text-center space-y-4 py-8">
        <h1 className="font-space-grotesk font-bold text-4xl text-foreground">
          Bem-vindo ao AgroLearn
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sua plataforma de aprendizado especializada em agronegócio. 
          Aprenda com especialistas e desenvolva suas habilidades no setor agrícola.
        </p>
      </div>

      {/* Primeira Linha - Vídeo Principal */}
      <div className="grid gap-6 lg:grid-cols-2 items-center">
        {/* Vídeo */}
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden group">
                <img
                  src="/agricultural-field-planting.png"
                  alt="Técnicas de Plantio"
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
                    15:30
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Texto */}
        <div className="space-y-4">
          <h2 className="font-space-grotesk font-bold text-2xl">
            Domine as Técnicas Modernas de Plantio
          </h2>
          <p className="text-muted-foreground">
            Aprenda com especialistas as melhores práticas para o plantio durante a estação primaveril. 
            Este curso abrange desde a preparação do solo até as técnicas mais avançadas de semeadura, 
            garantindo máxima produtividade e sustentabilidade.
          </p>
          <Button className="group">
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Segunda Linha - Vídeo Secundário */}
      <div className="grid gap-6 lg:grid-cols-2 items-center">
        {/* Texto */}
        <div className="space-y-4 lg:order-1">
          <h2 className="font-space-grotesk font-bold text-2xl">
            Sistemas de Irrigação Inteligente
          </h2>
          <p className="text-muted-foreground">
            Descubra como otimizar o uso da água em suas culturas com tecnologias modernas. 
            Aprenda sobre sistemas de gotejamento, sensores de umidade e automação que podem 
            revolucionar sua produção agrícola.
          </p>
          <Button variant="outline" className="group">
            Explorar Curso
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Vídeo */}
        <div className="lg:order-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden group">
                <img
                  src="/soil-preparation-farming.png"
                  alt="Irrigação Inteligente"
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
                    22:15
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-8 bg-muted/30 rounded-xl">
        <h3 className="font-space-grotesk font-bold text-xl">
          Pronto para Transformar sua Prática Agrícola?
        </h3>
        <p className="text-muted-foreground">
          Explore nossa biblioteca completa de cursos e comece sua jornada de aprendizado hoje mesmo.
        </p>
        <Button size="lg" className="group">
          Ver Todos os Cursos
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

