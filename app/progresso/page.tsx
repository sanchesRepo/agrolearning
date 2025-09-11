import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

export default function ProgressPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-2">
            <h1 className="font-space-grotesk font-bold text-2xl">Seu Progresso</h1>
            <p className="text-muted-foreground">Acompanhe seu desenvolvimento nos diferentes módulos e assuntos</p>
          </div>
          <DashboardContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

