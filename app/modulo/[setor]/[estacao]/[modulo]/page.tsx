import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ModuleHeader } from "@/components/module-header"
import { ModuleContent } from "@/components/module-content"
import { getModuleData } from "@/lib/module-data"
import { notFound } from "next/navigation"

interface ModulePageProps {
  params: {
    setor: string
    estacao: string
    modulo: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const moduleData = getModuleData(params.setor, params.estacao, params.modulo)

  if (!moduleData) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ModuleHeader setor={params.setor} estacao={params.estacao} modulo={params.modulo} moduleData={moduleData} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ModuleContent moduleData={moduleData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
