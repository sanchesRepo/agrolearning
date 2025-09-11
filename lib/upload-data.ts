// Nova estrutura de dados para upload baseada na imagem fornecida
export interface UploadStructure {
  title: string
  slug: string
  subSubjects: {
    name: string
    slug: string
    modules: {
      name: string
      slug: string
    }[]
  }[]
}

export const uploadSubjects: UploadStructure[] = [
  {
    title: "GOA",
    slug: "goa",
    subSubjects: [
      {
        name: "Estação O.S.",
        slug: "estacao-os",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Estação Formação",
        slug: "estacao-formacao",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Estação Tratos",
        slug: "estacao-tratos",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Estação Logística",
        slug: "estacao-logistica",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Estação Monit. de Risco",
        slug: "estacao-monit-risco",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
    ],
  },
  {
    title: "Automotiva mecânica",
    slug: "automotiva-mecanica",
    subSubjects: [
      {
        name: "Pilares da automotiva mecânica",
        slug: "pilares-automotiva",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Setores da Automotiva Mecânica",
        slug: "setores-automotiva",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
    ],
  },
  {
    title: "Tecnologia Agrícola",
    slug: "tecnologia-agricola",
    subSubjects: [
      {
        name: "Importância e abrangência da T.A",
        slug: "importancia-abrangencia",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Equipamentos e Automação",
        slug: "equipamentos-automacao",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
    ],
  },
  {
    title: "Produção Agrícola",
    slug: "producao-agricola",
    subSubjects: [
      {
        name: "Formação",
        slug: "formacao",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Tratos",
        slug: "tratos",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
      {
        name: "Logística",
        slug: "logistica",
        modules: [
          { name: "Módulo 1", slug: "modulo-1" },
          { name: "Módulo 2", slug: "modulo-2" },
          { name: "Módulo 3", slug: "modulo-3" },
          { name: "Módulo 4", slug: "modulo-4" },
          { name: "Módulo 5", slug: "modulo-5" },
          { name: "Módulo 6", slug: "modulo-6" },
        ],
      },
    ],
  },
]

// Função helper para encontrar sub-assuntos por assunto
export function getSubSubjectsBySubject(subjectSlug: string) {
  const subject = uploadSubjects.find(s => s.slug === subjectSlug)
  return subject?.subSubjects || []
}

// Função helper para encontrar módulos por assunto e sub-assunto
export function getModulesBySubjectAndSubSubject(subjectSlug: string, subSubjectSlug: string) {
  const subject = uploadSubjects.find(s => s.slug === subjectSlug)
  const subSubject = subject?.subSubjects.find(ss => ss.slug === subSubjectSlug)
  return subSubject?.modules || []
}

