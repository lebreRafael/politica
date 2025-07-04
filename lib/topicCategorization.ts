// Topic-based categorization for Brazilian legislative proposals

export interface TopicCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  keywords: string[];
  weight: number; // Higher weight = more specific/important
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: "saude",
    name: "Saúde",
    description:
      "Propostas relacionadas à saúde pública, medicamentos, hospitais",
    color: "red",
    keywords: [
      "saúde",
      "hospital",
      "medicamento",
      "vacina",
      "sistema único de saúde",
      "sus",
      "médico",
      "enfermeiro",
      "doença",
      "tratamento",
      "prevenção",
      "epidemia",
      "pandemia",
      "covid",
      "vacinação",
      "farmácia",
      "laboratório",
      "exame",
      "consulta",
      "emergência",
      "uti",
      "leito",
      "transplante",
      "doação de órgãos",
    ],
    weight: 10,
  },
  {
    id: "educacao",
    name: "Educação",
    description: "Propostas sobre ensino, escolas, universidades, bolsas",
    color: "blue",
    keywords: [
      "educação",
      "escola",
      "universidade",
      "faculdade",
      "professor",
      "aluno",
      "ensino",
      "aprendizado",
      "bolsa",
      "fies",
      "prouni",
      "enem",
      "vestibular",
      "graduação",
      "pós-graduação",
      "mestrado",
      "doutorado",
      "escolaridade",
      "alfabetização",
      "literatura",
      "matemática",
      "ciência",
      "tecnologia",
      "biblioteca",
      "laboratório escolar",
      "merenda escolar",
    ],
    weight: 10,
  },
  {
    id: "economia",
    name: "Economia",
    description:
      "Propostas sobre impostos, orçamento, desenvolvimento econômico",
    color: "green",
    keywords: [
      "economia",
      "imposto",
      "tributo",
      "orçamento",
      "receita",
      "despesa",
      "pib",
      "inflação",
      "juros",
      "taxa",
      "tarifa",
      "subsídio",
      "incentivo",
      "investimento",
      "empresa",
      "negócio",
      "comércio",
      "indústria",
      "produção",
      "exportação",
      "importação",
      "dólar",
      "real",
      "moeda",
      "banco",
      "crédito",
      "financiamento",
      "empréstimo",
      "dívida",
      "déficit",
      "superávit",
    ],
    weight: 9,
  },
  {
    id: "seguranca",
    name: "Segurança Pública",
    description: "Propostas sobre polícia, crime, justiça, penas",
    color: "purple",
    keywords: [
      "segurança",
      "polícia",
      "crime",
      "violência",
      "assalto",
      "homicídio",
      "tráfico",
      "drogas",
      "prisão",
      "pena",
      "justiça",
      "investigação",
      "proteção",
      "vigilância",
      "monitoramento",
      "armamento",
      "desarmamento",
      "violência doméstica",
      "feminicídio",
      "racismo",
      "discriminação",
      "direitos humanos",
      "defesa civil",
      "bombeiros",
    ],
    weight: 9,
  },
  {
    id: "meio-ambiente",
    name: "Meio Ambiente",
    description:
      "Propostas sobre sustentabilidade, preservação, mudanças climáticas",
    color: "emerald",
    keywords: [
      "meio ambiente",
      "sustentabilidade",
      "preservação",
      "conservação",
      "floresta",
      "amazônia",
      "biodiversidade",
      "espécie",
      "extinção",
      "poluição",
      "resíduo",
      "lixo",
      "reciclagem",
      "energia renovável",
      "solar",
      "eólica",
      "hidrelétrica",
      "petróleo",
      "gás",
      "mineração",
      "mudança climática",
      "aquecimento global",
      "carbono",
      "emissão",
      "água",
      "rio",
      "mar",
      "oceano",
      "terra",
      "solo",
      "ar",
    ],
    weight: 8,
  },
  {
    id: "trabalho",
    name: "Trabalho e Previdência",
    description:
      "Propostas sobre emprego, aposentadoria, direitos trabalhistas",
    color: "orange",
    keywords: [
      "trabalho",
      "emprego",
      "previdência",
      "aposentadoria",
      "inss",
      "funcionário",
      "empregado",
      "patrão",
      "empregador",
      "salário",
      "benefício",
      "auxílio",
      "pensão",
      "direito trabalhista",
      "clt",
      "sindicato",
      "greve",
      "demissão",
      "contratação",
      "estágio",
      "jornada de trabalho",
      "hora extra",
      "feriado",
      "férias",
      "13º salário",
    ],
    weight: 8,
  },
  {
    id: "infraestrutura",
    name: "Infraestrutura",
    description: "Propostas sobre transporte, obras, desenvolvimento urbano",
    color: "slate",
    keywords: [
      "infraestrutura",
      "transporte",
      "rodovia",
      "estrada",
      "ponte",
      "túnel",
      "metro",
      "ônibus",
      "trem",
      "avião",
      "porto",
      "aeroporto",
      "obra",
      "construção",
      "reforma",
      "manutenção",
      "urbanização",
      "saneamento",
      "esgoto",
      "água potável",
      "energia elétrica",
      "internet",
      "telecomunicação",
      "mobilidade urbana",
      "trânsito",
    ],
    weight: 7,
  },
  {
    id: "tecnologia",
    name: "Tecnologia e Inovação",
    description: "Propostas sobre tecnologia, inovação, digitalização",
    color: "cyan",
    keywords: [
      "tecnologia",
      "inovação",
      "digital",
      "internet",
      "computador",
      "software",
      "hardware",
      "inteligência artificial",
      "ia",
      "robótica",
      "automação",
      "startup",
      "empreendedorismo",
      "pesquisa",
      "desenvolvimento",
      "patente",
      "propriedade intelectual",
      "cibernética",
      "blockchain",
      "cryptocurrency",
      "bitcoin",
      "fintech",
      "govtech",
      "e-gov",
    ],
    weight: 7,
  },
  {
    id: "relacoes-internacionais",
    name: "Relações Internacionais",
    description:
      "Propostas sobre diplomacia, acordos internacionais, cooperação",
    color: "indigo",
    keywords: [
      "relações internacionais",
      "diplomacia",
      "diplomático",
      "embaixada",
      "consulado",
      "acordo internacional",
      "tratado",
      "cooperação internacional",
      "organização internacional",
      "onu",
      "oms",
      "unesco",
      "fao",
      "oit",
      "parlamento",
      "grupo parlamentar",
      "assembleia parlamentar",
      "comissão parlamentar",
      "delegação",
      "missão diplomática",
      "cooperação bilateral",
      "cooperação multilateral",
      "comércio internacional",
    ],
    weight: 8,
  },
  {
    id: "cultura",
    name: "Cultura e Esporte",
    description: "Propostas sobre artes, esportes, patrimônio cultural",
    color: "pink",
    keywords: [
      "cultura",
      "arte",
      "música",
      "teatro",
      "cinema",
      "literatura",
      "museu",
      "biblioteca",
      "patrimônio",
      "histórico",
      "tradição",
      "folclore",
      "carnaval",
      "festival",
      "esporte",
      "futebol",
      "olimpíada",
      "atleta",
      "competição",
      "treinamento",
      "academia",
      "ginásio",
      "estádio",
      "quadra",
      "piscina",
      "dança",
      "fotografia",
      "escultura",
    ],
    weight: 6,
  },
  {
    id: "agricultura",
    name: "Agricultura e Agropecuária",
    description: "Propostas sobre agricultura, pecuária, desenvolvimento rural",
    color: "lime",
    keywords: [
      "agricultura",
      "agropecuária",
      "fazenda",
      "roça",
      "plantação",
      "colheita",
      "semente",
      "adubo",
      "pesticida",
      "trator",
      "máquina",
      "gado",
      "boi",
      "vaca",
      "porco",
      "galinha",
      "peixe",
      "piscicultura",
      "apicultura",
      "mel",
      "leite",
      "carne",
      "grão",
      "soja",
      "milho",
      "arroz",
      "feijão",
      "café",
      "cana-de-açúcar",
      "laranja",
      "uva",
    ],
    weight: 6,
  },
  {
    id: "direitos-sociais",
    name: "Direitos Sociais",
    description: "Propostas sobre igualdade, inclusão, assistência social",
    color: "rose",
    keywords: [
      "direitos",
      "igualdade",
      "inclusão",
      "assistência social",
      "bolsa família",
      "pobreza",
      "miséria",
      "fome",
      "moradia",
      "habitação",
      "casa",
      "mulher",
      "feminismo",
      "gênero",
      "lgbt",
      "lgbtq+",
      "negro",
      "negro",
      "indígena",
      "quilombola",
      "pessoa com deficiência",
      "idoso",
      "criança",
      "adolescente",
      "juventude",
      "migrante",
      "refugiado",
      "discriminação",
    ],
    weight: 8,
  },
];

export interface TopicMatch {
  category: TopicCategory;
  score: number;
  matchedKeywords: string[];
}

export function categorizeProposal(ementa: string): TopicMatch[] {
  if (!ementa) return [];

  const normalizedEmenta = ementa
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove accents

  const matches: TopicMatch[] = [];

  // Special handling for parliamentary groups and international relations
  if (
    normalizedEmenta.includes("grupo parlamentar") ||
    normalizedEmenta.includes("assembleia parlamentar") ||
    normalizedEmenta.includes("comissao parlamentar") ||
    normalizedEmenta.includes("delegacao") ||
    normalizedEmenta.includes("missao diplomatica")
  ) {
    // Find the international relations category
    const internationalCategory = TOPIC_CATEGORIES.find(
      (cat) => cat.id === "relacoes-internacionais"
    );
    if (internationalCategory) {
      matches.push({
        category: internationalCategory,
        score: 15, // High score for parliamentary groups
        matchedKeywords: ["grupo parlamentar", "relações internacionais"],
      });
    }

    // Return only international relations for parliamentary groups
    return matches;
  }

  TOPIC_CATEGORIES.forEach((category) => {
    const matchedKeywords: string[] = [];
    let score = 0;

    category.keywords.forEach((keyword) => {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (normalizedEmenta.includes(normalizedKeyword)) {
        // Skip certain keywords that cause false positives
        if (
          normalizedKeyword === "grupo" &&
          !normalizedEmenta.includes("parlamentar")
        ) {
          return; // Skip generic 'grupo' without 'parlamentar'
        }
        if (
          normalizedKeyword === "associacao" &&
          !normalizedEmenta.includes("nacoes")
        ) {
          return; // Skip generic 'associação' without 'nações'
        }

        matchedKeywords.push(keyword);
        // Score based on keyword length and category weight
        score += (keyword.length * category.weight) / 10;
      }
    });

    if (matchedKeywords.length > 0) {
      matches.push({
        category,
        score,
        matchedKeywords,
      });
    }
  });

  // Sort by score (highest first) and return top 3 matches
  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function getPrimaryTopic(ementa: string): TopicCategory | null {
  const matches = categorizeProposal(ementa);
  return matches.length > 0 ? matches[0].category : null;
}

export function getTopicColor(color: string): string {
  const colors = {
    red: "bg-red-100 text-red-800 border-red-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    emerald: "bg-teal-100 text-teal-800 border-teal-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    slate: "bg-gray-100 text-gray-800 border-gray-200",
    cyan: "bg-indigo-100 text-indigo-800 border-indigo-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    lime: "bg-green-200 text-green-900 border-green-300",
    rose: "bg-red-200 text-red-900 border-red-300",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };
  return colors[color as keyof typeof colors] || colors.slate;
}
