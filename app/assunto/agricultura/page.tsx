import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { SubjectHome } from "@/components/subject-home"
import { Wheat } from "lucide-react"

export default function AgriculturaPage() {
  const agriculturaData = {
    title: "Agricultura",
    description: "Domine as técnicas modernas de agricultura sustentável. Aprenda desde o plantio até a colheita, com foco em produtividade, qualidade e responsabilidade ambiental.",
    icon: Wheat,
    stats: {
      totalModules: 12,
      completedModules: 4,
      totalHours: "24h",
      participants: 3247
    },
    featuredContent: [
      {
        title: "Revolução do Plantio Direto",
        description: "Descubra como o plantio direto pode aumentar sua produtividade em até 30% enquanto preserva o solo. Técnicas modernas que estão transformando a agricultura brasileira.",
        thumbnail: "/agricultural-field-planting.png",
        duration: "18:45",
        type: "video" as const
      },
      {
        title: "Agricultura de Precisão com Drones",
        description: "Aprenda a usar tecnologia de ponta para monitorar suas culturas. Sensores, drones e análise de dados para uma agricultura mais eficiente e sustentável.",
        thumbnail: "/soil-preparation-farming.png",
        duration: "25:30",
        type: "video" as const
      }
    ],
    subSubjects: [
      {
        name: "Plantio",
        description: "Técnicas avançadas de plantio, preparação de solo e seleção de sementes para máxima produtividade.",
        progress: 65,
        moduleCount: 4
      },
      {
        name: "Colheita",
        description: "Métodos eficientes de colheita, pós-colheita e armazenamento para preservar a qualidade dos produtos.",
        progress: 30,
        moduleCount: 4
      },
      {
        name: "Tratos",
        description: "Manejo integrado de pragas, fertilização inteligente e cuidados durante o desenvolvimento das culturas.",
        progress: 15,
        moduleCount: 4
      }
    ]
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SubjectHome data={agriculturaData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
