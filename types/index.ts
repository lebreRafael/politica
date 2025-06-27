// Tipos para dados políticos brasileiros

export interface Politician {
  id: string;
  name: string;
  party: string;
  state: string;
  house: 'deputado' | 'senador';
  photo?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  mandate: {
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  };
  committees?: string[];
  biography?: string;
}

export interface Proposal {
  id: string;
  number: string;
  year: number;
  type: 'PL' | 'PEC' | 'MPV' | 'PDL' | 'PDS' | 'PLP' | 'PRC' | 'REQ';
  title: string;
  description: string;
  author: string;
  status: 'em_tramitacao' | 'aprovada' | 'rejeitada' | 'vetada' | 'arquivada';
  date: string;
  house: 'camara' | 'senado';
  theme?: string[];
  urgency?: boolean;
  summary?: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  politicianId: string;
  vote: 'sim' | 'nao' | 'abstencao' | 'ausente';
  date: string;
  session: string;
  house: 'camara' | 'senado';
  justification?: string;
}

export interface VotingSession {
  id: string;
  date: string;
  session: string;
  house: 'camara' | 'senado';
  proposals: Proposal[];
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstentions: number;
  absences: number;
}

export interface PoliticianStats {
  politicianId: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstentions: number;
  absences: number;
  attendanceRate: number;
  votingPattern: {
    conservative: number;
    progressive: number;
    centrist: number;
  };
  topThemes: {
    theme: string;
    count: number;
  }[];
}

export interface Party {
  id: string;
  name: string;
  acronym: string;
  color: string;
  logo?: string;
  ideology?: 'esquerda' | 'centro-esquerda' | 'centro' | 'centro-direita' | 'direita';
  membersCount: number;
}

export interface State {
  id: string;
  name: string;
  acronym: string;
  region: 'norte' | 'nordeste' | 'centro-oeste' | 'sudeste' | 'sul';
  population: number;
  deputiesCount: number;
  senatorsCount: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
}

export interface SearchFilters {
  politician?: string;
  party?: string;
  state?: string;
  house?: 'camara' | 'senado' | 'ambos';
  dateFrom?: string;
  dateTo?: string;
  theme?: string;
  voteType?: 'sim' | 'nao' | 'abstencao' | 'ausente';
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
} 