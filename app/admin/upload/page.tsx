import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { UploadContent } from "@/components/upload-content"

export default function UploadPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 p-4">
            <h1 className="text-2xl font-bold mb-2">Upload de Conteúdo</h1>
            <p className="text-muted-foreground">
              Faça upload de vídeos para os módulos do sistema de aprendizado.
            </p>
          </div>
          <UploadContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

