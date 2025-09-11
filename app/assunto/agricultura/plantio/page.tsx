import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { SubSubjectHome } from "@/components/sub-subject-home"

export default function PlantioPage() {
  const plantioData = {
    title: "Plantio",
    description: "Domine as técnicas modernas de plantio para maximizar a produtividade de suas culturas. Aprenda sobre preparação do solo, seleção de sementes, espaçamento ideal e cronograma de plantio.",
    parentSubject: "Agricultura",
    totalDuration: "8h 30min",
    difficulty: "Intermediário" as const,
    prerequisites: [
      "Conhecimentos básicos de agricultura",
      "Noções de tipos de solo",
      "Compreensão de ciclos das plantas"
    ],
    learningObjectives: [
      "Identificar o momento ideal para plantio de diferentes culturas",
      "Preparar adequadamente o solo para maximizar a germinação",
      "Selecionar sementes de qualidade e variedades apropriadas",
      "Implementar técnicas de espaçamento para otimizar produtividade",
      "Desenvolver cronogramas de plantio eficientes",
      "Aplicar práticas sustentáveis de plantio direto"
    ],
    featuredVideo: {
      title: "Revolução do Plantio Direto: Técnicas Avançadas",
      description: "Aprenda as técnicas mais modernas de plantio direto que estão revolucionando a agricultura brasileira. Este vídeo aborda desde a preparação até a execução perfeita do plantio.",
      thumbnail: "/agricultural-field-planting.png",
      duration: "28:45",
      instructor: "Dr. Carlos Mendes"
    },
    modules: [
      {
        name: "Preparação do Solo",
        description: "Fundamentos para preparar o solo antes do plantio, incluindo análise, correção e preparo adequado.",
        duration: "2h 15min",
        difficulty: "Básico" as const,
        progress: 85,
        completed: true,
        contentCount: 8
      },
      {
        name: "Seleção de Sementes",
        description: "Como escolher as melhores sementes para sua região, incluindo critérios de qualidade e certificação.",
        duration: "1h 45min",
        difficulty: "Básico" as const,
        progress: 60,
        completed: false,
        contentCount: 6
      },
      {
        name: "Técnicas de Plantio",
        description: "Métodos práticos de plantio, espaçamento ideal e técnicas para diferentes tipos de culturas.",
        duration: "3h 20min",
        difficulty: "Intermediário" as const,
        progress: 25,
        completed: false,
        contentCount: 12
      },
      {
        name: "Cronograma e Planejamento",
        description: "Desenvolvimento de cronogramas eficientes e planejamento estratégico de plantio.",
        duration: "1h 10min",
        difficulty: "Avançado" as const,
        progress: 0,
        completed: false,
        contentCount: 5
      }
    ],
    stats: {
      totalModules: 4,
      completedModules: 1,
      totalProgress: 42,
      estimatedTime: "4h 50min"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SubSubjectHome data={plantioData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
