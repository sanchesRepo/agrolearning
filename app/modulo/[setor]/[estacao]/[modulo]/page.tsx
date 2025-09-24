import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ModuleHeader } from "@/components/module-header"
import { ModuleContent } from "@/components/module-content"
import { notFound } from "next/navigation"

interface ModulePageProps {
  params: {
    setor: string
    estacao: string
    modulo: string
  }
}

// Buscar dados reais do módulo
async function getModuleData(setor: string, estacao: string, modulo: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/module/${setor}/${estacao}/${modulo}`, {
      cache: 'no-store' // Sempre buscar dados atualizados
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar dados do módulo:', error)
    return null
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const moduleData = await getModuleData(params.setor, params.estacao, params.modulo)

  if (!moduleData) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ModuleHeader 
          setor={params.setor} 
          estacao={params.estacao} 
          modulo={params.modulo} 
          moduleData={moduleData} 
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ModuleContent moduleData={moduleData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
