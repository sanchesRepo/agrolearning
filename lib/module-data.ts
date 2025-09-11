export interface ContentItem {
  type: "video" | "text" | "image"
  title: string
  duration: string
}

export interface ModuleSection {
  title: string
  description: string
  completed: boolean
  content: ContentItem[]
}

export interface ModuleData {
  title: string
  description: string
  level: string
  duration: string
  participants: number
  progress: number
  objectives: string[]
  resources: string[]
  sections: ModuleSection[]
  relatedModules: {
    title: string
    duration: string
  }[]
}

const moduleDatabase: Record<string, ModuleData> = {
  "agricultura-primavera-plantio": {
    title: "Técnicas de Plantio na Primavera",
    description:
      "Aprenda as melhores práticas para o plantio durante a estação primaveril, incluindo preparação do solo, seleção de sementes e cronograma de plantio.",
    level: "Intermediário",
    duration: "2h 30min",
    participants: 1247,
    progress: 65,
    objectives: [
      "Identificar o momento ideal para plantio",
      "Preparar adequadamente o solo",
      "Selecionar sementes de qualidade",
      "Implementar técnicas de espaçamento",
    ],
    resources: ["Sementes", "Ferramentas de plantio", "Análise de solo", "Calendário agrícola"],
    sections: [
      {
        title: "Preparação do Solo",
        description: "Fundamentos para preparar o solo antes do plantio",
        completed: true,
        content: [
          { type: "video", title: "Análise de Solo", duration: "15min" },
          { type: "text", title: "Guia de pH do Solo", duration: "5min" },
          { type: "image", title: "Tipos de Solo", duration: "2min" },
        ],
      },
      {
        title: "Seleção de Sementes",
        description: "Como escolher as melhores sementes para sua região",
        completed: true,
        content: [
          { type: "video", title: "Variedades Regionais", duration: "20min" },
          { type: "text", title: "Certificação de Sementes", duration: "8min" },
        ],
      },
      {
        title: "Técnicas de Plantio",
        description: "Métodos práticos de plantio e espaçamento",
        completed: false,
        content: [
          { type: "video", title: "Plantio Direto", duration: "25min" },
          { type: "video", title: "Espaçamento Ideal", duration: "18min" },
          { type: "text", title: "Cronograma de Plantio", duration: "10min" },
        ],
      },
    ],
    relatedModules: [
      { title: "Irrigação Eficiente", duration: "1h 45min" },
      { title: "Fertilização Orgânica", duration: "2h 15min" },
      { title: "Controle de Pragas", duration: "1h 30min" },
    ],
  },
  "agricultura-primavera-irrigacao": {
    title: "Sistemas de Irrigação Inteligente",
    description:
      "Domine as técnicas modernas de irrigação para maximizar a eficiência hídrica e o desenvolvimento das culturas.",
    level: "Avançado",
    duration: "3h 15min",
    participants: 892,
    progress: 30,
    objectives: [
      "Calcular necessidades hídricas das culturas",
      "Implementar sistemas de irrigação por gotejamento",
      "Utilizar sensores de umidade do solo",
      "Otimizar cronogramas de irrigação",
    ],
    resources: ["Sensores de umidade", "Sistema de gotejamento", "Controladores automáticos", "Medidores de vazão"],
    sections: [
      {
        title: "Fundamentos da Irrigação",
        description: "Conceitos básicos sobre necessidades hídricas",
        completed: true,
        content: [
          { type: "video", title: "Ciclo da Água nas Plantas", duration: "22min" },
          { type: "text", title: "Cálculo de Evapotranspiração", duration: "12min" },
        ],
      },
      {
        title: "Sistemas de Irrigação",
        description: "Diferentes métodos e suas aplicações",
        completed: false,
        content: [
          { type: "video", title: "Irrigação por Gotejamento", duration: "30min" },
          { type: "video", title: "Aspersão vs Microaspersão", duration: "25min" },
          { type: "image", title: "Esquemas de Instalação", duration: "5min" },
        ],
      },
    ],
    relatedModules: [
      { title: "Técnicas de Plantio", duration: "2h 30min" },
      { title: "Monitoramento de Culturas", duration: "1h 50min" },
    ],
  },
}

export function getModuleData(setor: string, estacao: string, modulo: string): ModuleData | null {
  const key = `${setor}-${estacao}-${modulo}`
  return moduleDatabase[key] || null
}

export function getAllModuleKeys(): string[] {
  return Object.keys(moduleDatabase)
}
