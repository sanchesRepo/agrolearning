"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight, Wheat, Sprout, TreePine, Apple, ImageIcon, Home, BarChart3, Settings, Cog, Wrench, Car } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CircularProgress, ProgressBadge } from "@/components/ui/progress-indicator"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { uploadSubjects } from "@/lib/upload-data"

// Mapear ícones para cada assunto
const subjectIcons = {
  "goa": Settings,
  "automotiva-mecanica": Car,
  "tecnologia-agricola": Cog,
  "producao-agricola": Wheat,
}

// Converter dados reais para formato da sidebar
const subjects = uploadSubjects.map(subject => ({
  title: subject.title,
  slug: subject.slug,
  icon: subjectIcons[subject.slug as keyof typeof subjectIcons] || Wheat,
  progress: 0, // Por enquanto sem progresso
  subSubjects: subject.subSubjects.map(subSubject => ({
    name: subSubject.name,
    slug: subSubject.slug,
    progress: 0, // Por enquanto sem progresso
    modules: subSubject.modules.map(module => ({
      name: module.name,
      slug: module.slug,
      progress: 0, // Por enquanto sem progresso
      contents: [], // Será preenchido dinamicamente
    }))
  }))
}))

// Manter dados antigos para referência (remover depois)
const oldSubjects = [
  {
    title: "Agricultura",
    icon: Wheat,
    progress: 68, // Progresso geral do assunto
    subSubjects: [
      {
        name: "Plantio",
        progress: 85, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 100, // Módulo completado
            contents: ["Técnicas de Plantio", "Preparação do Solo", "Seleção de Sementes", "Cronograma de Plantio"],
          },
          {
            name: "Módulo 2", 
            progress: 70, // Módulo em progresso
            contents: ["Irrigação Eficiente", "Sistemas de Gotejamento", "Monitoramento Hídrico", "Automação"],
          },
        ],
      },
      {
        name: "Colheita",
        progress: 45, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 60, // Módulo em progresso
            contents: ["Ponto de Colheita", "Técnicas de Colheita", "Armazenamento", "Conservação"],
          },
          {
            name: "Módulo 2",
            progress: 30, // Módulo iniciado
            contents: ["Pós-colheita", "Beneficiamento", "Qualidade", "Logística"],
          },
        ],
      },
      {
        name: "Tratos",
        progress: 75, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 100, // Módulo completado
            contents: ["Fertilização Orgânica", "Nutrição das Plantas", "Compostagem", "Adubação Verde"],
          },
          {
            name: "Módulo 2",
            progress: 50, // Módulo em progresso
            contents: ["Controle de Pragas", "Manejo Integrado", "Produtos Biológicos", "Prevenção"],
          },
        ],
      },
    ],
  },
  {
    title: "Pecuária",
    icon: Sprout,
    progress: 42, // Progresso geral do assunto
    subSubjects: [
      {
        name: "Reprodução",
        progress: 65, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 90, // Módulo quase completo
            contents: ["Manejo Reprodutivo", "Inseminação Artificial", "Gestação", "Parto"],
          },
          {
            name: "Módulo 2",
            progress: 40, // Módulo iniciado
            contents: ["Melhoramento Genético", "Seleção", "Cruzamentos", "Registros"],
          },
        ],
      },
      {
        name: "Nutrição",
        progress: 30, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 45, // Módulo em progresso
            contents: ["Nutrição Animal", "Pastagens", "Suplementação", "Dietas Balanceadas"],
          },
          {
            name: "Módulo 2",
            progress: 15, // Módulo iniciado
            contents: ["Forragens", "Silagem", "Feno", "Concentrados"],
          },
        ],
      },
      {
        name: "Sanidade",
        progress: 20, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 25, // Módulo iniciado
            contents: ["Sanidade Animal", "Vacinação", "Doenças Comuns", "Prevenção"],
          },
          {
            name: "Módulo 2",
            progress: 15, // Módulo iniciado
            contents: ["Bem-estar Animal", "Instalações", "Manejo Ético", "Produtividade"],
          },
        ],
      },
    ],
  },
  {
    title: "Silvicultura",
    icon: TreePine,
    progress: 15, // Progresso geral do assunto
    subSubjects: [
      {
        name: "Implantação",
        progress: 25, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 35, // Módulo iniciado
            contents: ["Plantio Florestal", "Espécies Nativas", "Espaçamento", "Mudas de Qualidade"],
          },
          {
            name: "Módulo 2",
            progress: 15, // Módulo iniciado
            contents: ["Preparo da Área", "Correção do Solo", "Adubação", "Proteção"],
          },
        ],
      },
      {
        name: "Manejo",
        progress: 10, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 15, // Módulo iniciado
            contents: ["Manejo Florestal", "Desbaste", "Poda", "Controle de Crescimento"],
          },
          {
            name: "Módulo 2",
            progress: 5, // Módulo iniciado
            contents: ["Monitoramento", "Inventário", "Crescimento", "Produtividade"],
          },
        ],
      },
      {
        name: "Exploração",
        progress: 0, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 0, // Módulo não iniciado
            contents: ["Colheita Sustentável", "Técnicas de Corte", "Transporte", "Beneficiamento"],
          },
          {
            name: "Módulo 2",
            progress: 0, // Módulo não iniciado
            contents: ["Conservação", "Biodiversidade", "Certificação", "Sustentabilidade"],
          },
        ],
      },
    ],
  },
  {
    title: "Fruticultura",
    icon: Apple,
    progress: 55, // Progresso geral do assunto
    subSubjects: [
      {
        name: "Implantação",
        progress: 80, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 100, // Módulo completado
            contents: ["Planejamento do Pomar", "Escolha de Variedades", "Implantação", "Espaçamento"],
          },
          {
            name: "Módulo 2",
            progress: 60, // Módulo em progresso
            contents: ["Preparo do Solo", "Mudas", "Plantio", "Irrigação"],
          },
        ],
      },
      {
        name: "Produção",
        progress: 45, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 65, // Módulo em progresso
            contents: ["Manejo da Floração", "Polinização", "Formação de Frutos", "Raleio"],
          },
          {
            name: "Módulo 2",
            progress: 25, // Módulo iniciado
            contents: ["Poda e Condução", "Sistemas de Condução", "Poda de Formação", "Poda de Produção"],
          },
        ],
      },
      {
        name: "Colheita",
        progress: 40, // Progresso do sub-assunto
        modules: [
          {
            name: "Módulo 1",
            progress: 55, // Módulo em progresso
            contents: ["Colheita e Pós-colheita", "Ponto de Colheita", "Armazenamento", "Conservação"],
          },
          {
            name: "Módulo 2",
            progress: 25, // Módulo iniciado
            contents: ["Beneficiamento", "Embalagem", "Comercialização", "Qualidade"],
          },
        ],
      },
    ],
  },
] // Fim dos dados antigos - pode ser removido depois

export function AppSidebar() {
  const pathname = usePathname()

  // Função para verificar se uma rota está ativa
  const isActiveRoute = (href: string): boolean => {
    // Para a rota home, verificar correspondência exata
    if (href === "/") {
      return pathname === "/"
    }
    
    // Para outras rotas, verificar se o pathname atual começa com o href
    // mas também garantir que não seja uma correspondência parcial incorreta
    if (pathname.startsWith(href)) {
      // Se a rota for exata ou se o próximo caractere for uma barra
      return pathname === href || pathname.charAt(href.length) === "/"
    }
    
    return false
  }

  // Função para verificar se um assunto tem alguma rota ativa
  const hasActiveRoute = (subject: typeof subjects[0]): boolean => {
    // Verificar se algum módulo/conteúdo está ativo usando a nova estrutura
    return subject.subSubjects.some(subSubject => {
      return subSubject.modules.some(module => {
        const moduleHref = `/modulo/${subject.slug}/${subSubject.slug}/${module.slug}`;
        const contentHref = `/conteudo/${subject.slug}/${subSubject.slug}/${module.slug}`;
        
        return isActiveRoute(moduleHref) || pathname.startsWith(contentHref);
      });
    });
  }

  // Função para verificar se um sub-assunto tem alguma rota ativa
  const hasActiveSubRoute = (subject: typeof subjects[0], subSubject: typeof subjects[0]['subSubjects'][0]): boolean => {
    return subSubject.modules.some(module => {
      const moduleHref = `/modulo/${subject.slug}/${subSubject.slug}/${module.slug}`;
      const contentHref = `/conteudo/${subject.slug}/${subSubject.slug}/${module.slug}`;
      
      return isActiveRoute(moduleHref) || pathname.startsWith(contentHref);
    });
  }

  // Função para verificar se um módulo tem alguma rota ativa
  const hasActiveModuleRoute = (subject: typeof subjects[0], subSubject: typeof subjects[0]['subSubjects'][0], module: typeof subjects[0]['subSubjects'][0]['modules'][0]): boolean => {
    const moduleHref = `/modulo/${subject.slug}/${subSubject.slug}/${module.slug}`;
    const contentHref = `/conteudo/${subject.slug}/${subSubject.slug}/${module.slug}`;
    
    return isActiveRoute(moduleHref) || pathname.startsWith(contentHref);
  }

  return (
    <Sidebar variant="inset" className="sidebar-enhanced">
      <SidebarHeader>
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="flex items-center justify-center min-w-[4rem] max-w-[5rem]">
            <Image
              src="/logo.png"
              alt="Logo da Empresa"
              width={120}
              height={120}
              className="object-contain w-auto h-auto max-w-full max-h-16"
              priority
            />
          </div>
          <div className="grid flex-1 text-center text-sm leading-tight justify-center">
            <div className="flex items-center justify-start mb-1">
              <Image
                src="/texto-logo.svg"
                alt="AgroLearn"
                width={120}
                height={32}
                className="object-contain w-auto h-auto max-h-8"
                priority
              />
            </div>
            <span className="truncate text-xs text-muted-foreground">Plataforma de Ensino</span>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-space-grotesk font-semibold">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveRoute("/")}>
                  <a href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveRoute("/progresso")}>
                  <a href="/progresso" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Progresso</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conteúdo Educacional */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-space-grotesk font-semibold">Assuntos e Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {subjects.map((subject, index) => (
                <Collapsible key={subject.title} asChild defaultOpen={hasActiveRoute(subject)}>
                  <SidebarMenuItem className={index > 0 ? "mt-4 pt-4 border-t border-sidebar-border/50" : ""}>
                    {/* Link Principal do Assunto */}
                    <SidebarMenuButton asChild tooltip={subject.title} isActive={isActiveRoute(`/assunto/${subject.title.toLowerCase()}`)}>
                      <a href={`/assunto/${subject.title.toLowerCase()}`} className="flex w-full items-center bg-sidebar-primary/50 hover:bg-sidebar-primary font-medium rounded-md mb-1">
                        <subject.icon className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground flex-1">{subject.title}</span>
                        <CircularProgress 
                          value={subject.progress} 
                          size="sm" 
                          variant="subject"
                          className="ml-auto"
                        />
                      </a>
                    </SidebarMenuButton>
                    
                    {/* Trigger para Explorar */}
                    <SidebarMenuButton asChild>
                      <CollapsibleTrigger className="flex w-full items-center pl-6 py-1 text-muted-foreground hover:text-foreground">
                        <ChevronRight className="h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        <span className="ml-2 text-xs font-medium">Explorar Conteúdo</span>
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subject.subSubjects.map((subSubject) => (
                          <Collapsible key={subSubject.name} asChild defaultOpen={hasActiveSubRoute(subject, subSubject)}>
                            <SidebarMenuSubItem className="ml-2 my-1">
                              {/* Link Principal do Sub-Assunto */}
                              <SidebarMenuSubButton asChild isActive={isActiveRoute(`/assunto/${subject.title.toLowerCase()}/${subSubject.name.toLowerCase()}`)}>
                                <a href={`/assunto/${subject.title.toLowerCase()}/${subSubject.name.toLowerCase()}`} className="flex w-full items-center bg-sidebar-accent/10 hover:bg-sidebar-accent/20 rounded-md px-3 py-2 border-l-2 border-secondary/50">
                                  <div className="h-2 w-2 rounded-full bg-secondary mr-2" />
                                  <span className="text-sm font-semibold text-foreground flex-1">{subSubject.name}</span>
                                  <CircularProgress 
                                    value={subSubject.progress} 
                                    size="sm" 
                                    variant="subject"
                                    className="ml-auto"
                                  />
                                </a>
                              </SidebarMenuSubButton>
                              
                              {/* Trigger para Módulos */}
                              <SidebarMenuSubButton asChild>
                                <CollapsibleTrigger className="flex w-full items-center pl-6 py-1 text-muted-foreground hover:text-foreground">
                                  <ChevronRight className="h-2 w-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                  <span className="ml-2 text-xs font-medium">Ver Módulos</span>
                                </CollapsibleTrigger>
                              </SidebarMenuSubButton>
                              <CollapsibleContent>
                                <SidebarMenuSub className="ml-2">
                                  {subSubject.modules.map((module) => (
                                    <Collapsible key={module.name} asChild defaultOpen={hasActiveModuleRoute(subject, subSubject, module)}>
                                      <SidebarMenuSubItem className="ml-1 my-0.5">
                                        <SidebarMenuSubButton asChild>
                                          <CollapsibleTrigger className="flex w-full items-center bg-muted/30 hover:bg-muted/60 rounded px-2 py-1.5 border-l border-muted-foreground/20 min-h-[32px]">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60 mr-2 flex-shrink-0" />
                                            <span className="text-xs font-medium text-foreground/90 flex-1 text-left">{module.name}</span>
                                            <ProgressBadge 
                                              value={module.progress} 
                                              size="sm"
                                              className="mr-1 flex-shrink-0"
                                            />
                                            <ChevronRight className="h-2 w-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 flex-shrink-0" />
                                          </CollapsibleTrigger>
                                        </SidebarMenuSubButton>
                                        <CollapsibleContent>
                                          <SidebarMenuSub className="ml-2">
                                            {/* Link para o módulo principal */}
                                            <SidebarMenuSubItem className="my-0.5">
                                              <SidebarMenuSubButton asChild isActive={isActiveRoute(`/modulo/${subject.slug}/${subSubject.slug}/${module.slug}`)}>
                                                <a href={`/modulo/${subject.slug}/${subSubject.slug}/${module.slug}`} className="flex items-start pl-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors min-h-[24px]">
                                                  <ImageIcon className="h-2 w-2 mr-2 mt-0.5 text-muted-foreground/60 flex-shrink-0" />
                                                  <span className="text-xs leading-relaxed break-words">Visão Geral do Módulo</span>
                                                </a>
                                              </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                          </SidebarMenuSub>
                                        </CollapsibleContent>
                                      </SidebarMenuSubItem>
                                    </Collapsible>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuSubItem>
                          </Collapsible>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">© 2024 AgroLearn</div>
      </SidebarFooter>
    </Sidebar>
  )
}
