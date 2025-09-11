import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ContentHeader } from "@/components/content-header"
import { ContentViewer } from "@/components/content-viewer"
import { getContentData } from "@/lib/content-data"
import { notFound } from "next/navigation"

interface ContentPageProps {
  params: {
    setor: string
    estacao: string
    modulo: string
    conteudo: string
  }
}

export default function ContentPage({ params }: ContentPageProps) {
  const contentData = getContentData(params.setor, params.estacao, params.modulo, params.conteudo)

  if (!contentData) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ContentHeader
          setor={params.setor}
          estacao={params.estacao}
          modulo={params.modulo}
          conteudo={params.conteudo}
          contentData={contentData}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ContentViewer contentData={contentData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
