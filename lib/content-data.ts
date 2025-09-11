export interface ContentResource {
  name: string
  type: string
  url?: string
}

export interface ContentSection {
  title: string
  content: string[]
  image?: string
}

export interface ContentData {
  id: string
  title: string
  description: string
  type: "Artigo" | "Vídeo" | "Infográfico" | "Quiz"
  duration: string
  progress: number
  featuredImage?: string
  sections: ContentSection[]
  keyPoints: string[]
  resources: ContentResource[]
}

const contentDatabase: Record<string, ContentData> = {
  "agricultura-primavera-plantio-introducao": {
    id: "agricultura-primavera-plantio-introducao",
    title: "Introdução às Técnicas de Plantio",
    description: "Fundamentos essenciais para um plantio bem-sucedido na primavera",
    type: "Artigo",
    duration: "15 min",
    progress: 0,
    featuredImage: "/agricultural-field-planting.png",
    sections: [
      {
        title: "O que é o Plantio Direto?",
        content: [
          "O plantio direto é uma técnica agrícola que consiste em semear diretamente sobre os restos vegetais da cultura anterior, sem revolver o solo. Esta prática revolucionou a agricultura moderna por seus benefícios ambientais e econômicos.",
          "Esta técnica mantém a estrutura do solo intacta, preservando a matéria orgânica e a atividade biológica. O resultado é um sistema mais sustentável e produtivo a longo prazo.",
        ],
        image: "/soil-preparation-farming.png",
      },
      {
        title: "Benefícios do Sistema",
        content: [
          "A adoção do plantio direto traz diversos benefícios: redução da erosão do solo, economia de combustível e tempo, melhoria da infiltração de água e aumento da matéria orgânica.",
          "Estudos mostram que propriedades que adotam o plantio direto podem ter uma redução de até 90% na perda de solo por erosão, comparado ao sistema convencional.",
        ],
      },
      {
        title: "Preparação e Planejamento",
        content: [
          "O sucesso do plantio direto depende de um planejamento cuidadoso. É essencial fazer a análise do solo, escolher as culturas adequadas e planejar a rotação de culturas.",
          "A dessecação da área deve ser feita no momento correto, geralmente 10 a 15 dias antes do plantio, para garantir que as plantas daninhas estejam controladas.",
        ],
      },
    ],
    keyPoints: [
      "Preserva a estrutura do solo",
      "Reduz custos operacionais",
      "Melhora a retenção de água",
      "Aumenta a biodiversidade",
      "Reduz a erosão significativamente",
    ],
    resources: [
      { name: "Manual de Plantio Direto", type: "PDF" },
      { name: "Checklist de Preparação", type: "PDF" },
      { name: "Vídeo Demonstrativo", type: "MP4" },
    ],
  },
  "agricultura-primavera-plantio-preparacao-solo": {
    id: "agricultura-primavera-plantio-preparacao-solo",
    title: "Preparação Adequada do Solo",
    description: "Como preparar o solo para maximizar o potencial produtivo",
    type: "Vídeo",
    duration: "22 min",
    progress: 0,
    sections: [
      {
        title: "Análise Química do Solo",
        content: [
          "A análise química revela os níveis de nutrientes disponíveis no solo, incluindo pH, fósforo, potássio e matéria orgânica.",
          "Com base nos resultados, é possível fazer a correção adequada com calcário e fertilizantes.",
        ],
      },
      {
        title: "Correção da Acidez",
        content: [
          "O pH ideal para a maioria das culturas está entre 6,0 e 6,5. Solos ácidos precisam de calagem.",
          "A aplicação de calcário deve ser feita com antecedência, preferencialmente 60 a 90 dias antes do plantio.",
        ],
      },
    ],
    keyPoints: [
      "pH ideal entre 6,0 e 6,5",
      "Análise química é fundamental",
      "Calagem antecipada",
      "Correção de nutrientes",
    ],
    resources: [
      { name: "Tabela de Correção de pH", type: "PDF" },
      { name: "Calculadora de Calagem", type: "Excel" },
    ],
  },
  "agricultura-primavera-plantio-selecao-sementes": {
    id: "agricultura-primavera-plantio-selecao-sementes",
    title: "Seleção de Sementes de Qualidade",
    description: "Critérios para escolher as melhores sementes para sua região",
    type: "Infográfico",
    duration: "10 min",
    progress: 0,
    featuredImage: "/placeholder.svg?height=600&width=800&text=Infográfico+Seleção+de+Sementes",
    sections: [
      {
        title: "Critérios de Qualidade",
        content: [
          "Pureza genética e física",
          "Alto poder germinativo",
          "Vigor das sementes",
          "Sanidade fitossanitária",
        ],
      },
      {
        title: "Certificação",
        content: [
          "Sementes certificadas garantem qualidade",
          "Rastreabilidade da origem",
          "Controle de qualidade rigoroso",
          "Garantia de performance",
        ],
      },
    ],
    keyPoints: [
      "Sempre use sementes certificadas",
      "Verifique o poder germinativo",
      "Considere a adaptação regional",
      "Armazene adequadamente",
    ],
    resources: [
      { name: "Guia de Certificação", type: "PDF" },
      { name: "Lista de Fornecedores", type: "PDF" },
    ],
  },
}

export function getContentData(setor: string, estacao: string, modulo: string, conteudo: string): ContentData | null {
  const key = `${setor}-${estacao}-${modulo}-${conteudo}`
  return contentDatabase[key] || null
}

export function getAllContentKeys(): string[] {
  return Object.keys(contentDatabase)
}

// Debug: Ver todas as chaves disponíveis
console.log("Content keys available:", Object.keys(contentDatabase))
