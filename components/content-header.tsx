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
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft, ArrowRight } from "lucide-react"
import type { ContentData } from "@/lib/content-data"

interface ContentHeaderProps {
  setor: string
  estacao: string
  modulo: string
  conteudo: string
  contentData: ContentData
}

export function ContentHeader({ setor, estacao, modulo, conteudo, contentData }: ContentHeaderProps) {
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
              <BreadcrumbLink href={`/modulo/${setor}/${estacao}/${modulo}`}>{formatTitle(modulo)}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-space-grotesk font-semibold">{formatTitle(conteudo)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="font-space-grotesk font-bold text-2xl">{contentData.title}</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {contentData.type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{contentData.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button size="sm">
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </header>
  )
}
