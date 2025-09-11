import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { ModuleData } from "@/lib/module-data"

interface ModuleHeaderProps {
  setor: string
  estacao: string
  modulo: string
  moduleData: ModuleData
}

export function ModuleHeader({ setor, estacao, modulo, moduleData }: ModuleHeaderProps) {
  const formatTitle = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ")

  return (
    <header className="flex flex-col gap-4 border-b bg-background p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{formatTitle(setor)}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{formatTitle(estacao)}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-space-grotesk font-semibold">{formatTitle(modulo)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-space-grotesk font-bold text-2xl">{moduleData.title}</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {moduleData.level}
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">{moduleData.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{moduleData.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{moduleData.participants} participantes</span>
          </div>
        </div>
      </div>
    </header>
  )
}
