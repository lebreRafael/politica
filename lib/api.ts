import axios from 'axios';
import { 
  Politician, 
  Proposal, 
  Vote, 
  VotingSession, 
  PoliticianStats, 
  Party, 
  State, 
  Theme,
  SearchFilters,
  APIResponse 
} from '@/types';

// Configuração base do axios
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// URLs das APIs oficiais
const API_URLS = {
  CAMARA: 'https://dadosabertos.camara.leg.br/api/v2',
  SENADO: 'https://legis.senado.leg.br/dadosabertos',
  TRANSPARENCIA: 'https://www.portaltransparencia.gov.br/api-de-dados',
};

// Classe principal para gerenciar dados políticos
export class PoliticaAPI {
  private static instance: PoliticaAPI;

  private constructor() {}

  public static getInstance(): PoliticaAPI {
    if (!PoliticaAPI.instance) {
      PoliticaAPI.instance = new PoliticaAPI();
    }
    return PoliticaAPI.instance;
  }

  // Buscar deputados
  async getDeputies(filters?: SearchFilters): Promise<APIResponse<Politician[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.state) params.append('siglaUf', filters.state);
      if (filters?.party) params.append('siglaPartido', filters.party);

      const response = await api.get(`${API_URLS.CAMARA}/deputados?${params}`);
      
      const deputies = response.data.dados.map((dep: any) => ({
        id: dep.id.toString(),
        name: dep.nome,
        party: dep.siglaPartido,
        state: dep.siglaUf,
        house: 'deputado' as const,
        photo: dep.urlFoto,
        email: dep.email,
        mandate: {
          startDate: dep.dataInicio,
          endDate: dep.dataFim,
          isCurrent: dep.dataFim === null,
        },
      }));

      return {
        data: deputies,
        success: true,
        pagination: {
          page: 1,
          limit: 100,
          total: response.data.dados.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar deputados:', error);
      return {
        data: [],
        success: false,
        message: 'Erro ao buscar dados dos deputados',
      };
    }
  }

  // Buscar senadores
  async getSenators(filters?: SearchFilters): Promise<APIResponse<Politician[]>> {
    try {
      const response = await api.get(`${API_URLS.SENADO}/senador/lista/atual`);
      
      const senators = response.data.ListaParlamentarEmExercicio.Parlamentares.Parlamentar.map((sen: any) => ({
        id: sen.IdentificacaoParlamentar.CodigoParlamentar,
        name: sen.IdentificacaoParlamentar.NomeParlamentar,
        party: sen.IdentificacaoParlamentar.SiglaPartidoParlamentar,
        state: sen.IdentificacaoParlamentar.UfParlamentar,
        house: 'senador' as const,
        photo: sen.IdentificacaoParlamentar.UrlFotoParlamentar,
        mandate: {
          startDate: sen.Mandatos.Mandato[0].PrimeiraLegislaturaDoMandato.DataInicio,
          endDate: sen.Mandatos.Mandato[0].SegundaLegislaturaDoMandato.DataFim,
          isCurrent: true,
        },
      }));

      return {
        data: senators,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar senadores:', error);
      return {
        data: [],
        success: false,
        message: 'Erro ao buscar dados dos senadores',
      };
    }
  }

  // Buscar votações de um parlamentar
  async getPoliticianVotes(politicianId: string, house: 'camara' | 'senado'): Promise<APIResponse<Vote[]>> {
    try {
      let url: string;
      
      if (house === 'camara') {
        url = `${API_URLS.CAMARA}/deputados/${politicianId}/votacoes`;
      } else {
        url = `${API_URLS.SENADO}/votacao/senador/${politicianId}`;
      }

      const response = await api.get(url);
      
      const votes = response.data.dados.map((vote: any) => ({
        id: vote.id.toString(),
        proposalId: vote.proposicao?.id?.toString() || vote.idProposicao,
        politicianId,
        vote: this.mapVoteType(vote.voto),
        date: vote.data,
        session: vote.sessao,
        house,
        justification: vote.justificativa,
      }));

      return {
        data: votes,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar votações:', error);
      return {
        data: [],
        success: false,
        message: 'Erro ao buscar votações do parlamentar',
      };
    }
  }

  // Buscar detalhes de uma proposta
  async getProposal(proposalId: string, house: 'camara' | 'senado'): Promise<APIResponse<Proposal>> {
    try {
      let url: string;
      
      if (house === 'camara') {
        url = `${API_URLS.CAMARA}/proposicoes/${proposalId}`;
      } else {
        url = `${API_URLS.SENADO}/materia/${proposalId}`;
      }

      const response = await api.get(url);
      const data = response.data.dados;

      const proposal: Proposal = {
        id: data.id.toString(),
        number: data.numero,
        year: data.ano,
        type: data.siglaTipo,
        title: data.ementa,
        description: data.ementa,
        author: data.autor,
        status: this.mapStatus(data.statusProposicao?.situacao),
        date: data.dataApresentacao,
        house,
        urgency: data.urgente,
      };

      return {
        data: proposal,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      return {
        data: {} as Proposal,
        success: false,
        message: 'Erro ao buscar dados da proposta',
      };
    }
  }

  // Buscar estatísticas de um parlamentar
  async getPoliticianStats(politicianId: string): Promise<APIResponse<PoliticianStats>> {
    try {
      const votesResponse = await this.getPoliticianVotes(politicianId, 'camara');
      const votes = votesResponse.data;

      const totalVotes = votes.length;
      const yesVotes = votes.filter(v => v.vote === 'sim').length;
      const noVotes = votes.filter(v => v.vote === 'nao').length;
      const abstentions = votes.filter(v => v.vote === 'abstencao').length;
      const absences = votes.filter(v => v.vote === 'ausente').length;

      const stats: PoliticianStats = {
        politicianId,
        totalVotes,
        yesVotes,
        noVotes,
        abstentions,
        absences,
        attendanceRate: ((totalVotes - absences) / totalVotes) * 100,
        votingPattern: {
          conservative: (noVotes / totalVotes) * 100,
          progressive: (yesVotes / totalVotes) * 100,
          centrist: (abstentions / totalVotes) * 100,
        },
        topThemes: [], // Será implementado com análise de temas
      };

      return {
        data: stats,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        data: {} as PoliticianStats,
        success: false,
        message: 'Erro ao buscar estatísticas do parlamentar',
      };
    }
  }

  // Buscar partidos
  async getParties(): Promise<APIResponse<Party[]>> {
    try {
      const response = await api.get(`${API_URLS.CAMARA}/partidos`);
      
      const parties = response.data.dados.map((party: any) => ({
        id: party.id.toString(),
        name: party.nome,
        acronym: party.sigla,
        color: party.cor,
        membersCount: party.numeroMembros,
      }));

      return {
        data: parties,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar partidos:', error);
      return {
        data: [],
        success: false,
        message: 'Erro ao buscar dados dos partidos',
      };
    }
  }

  // Buscar estados
  async getStates(): Promise<APIResponse<State[]>> {
    try {
      const response = await api.get(`${API_URLS.CAMARA}/referencias/ufs`);
      
      const states = response.data.dados.map((state: any) => ({
        id: state.id.toString(),
        name: state.nome,
        acronym: state.sigla,
        region: this.mapRegion(state.sigla),
        population: 0, // Será implementado com dados do IBGE
        deputiesCount: 0, // Será calculado dinamicamente
        senatorsCount: 3, // Fixo para cada estado
      }));

      return {
        data: states,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return {
        data: [],
        success: false,
        message: 'Erro ao buscar dados dos estados',
      };
    }
  }

  // Métodos auxiliares
  private mapVoteType(vote: string): 'sim' | 'nao' | 'abstencao' | 'ausente' {
    const voteMap: Record<string, 'sim' | 'nao' | 'abstencao' | 'ausente'> = {
      'Sim': 'sim',
      'Não': 'nao',
      'Abstenção': 'abstencao',
      'Ausente': 'ausente',
      'Obstrução': 'abstencao',
    };
    return voteMap[vote] || 'ausente';
  }

  private mapStatus(status: string): 'em_tramitacao' | 'aprovada' | 'rejeitada' | 'vetada' | 'arquivada' {
    const statusMap: Record<string, 'em_tramitacao' | 'aprovada' | 'rejeitada' | 'vetada' | 'arquivada'> = {
      'Em Tramitação': 'em_tramitacao',
      'Aprovada': 'aprovada',
      'Rejeitada': 'rejeitada',
      'Vetada': 'vetada',
      'Arquivada': 'arquivada',
    };
    return statusMap[status] || 'em_tramitacao';
  }

  private mapRegion(state: string): 'norte' | 'nordeste' | 'centro-oeste' | 'sudeste' | 'sul' {
    const regions: Record<string, 'norte' | 'nordeste' | 'centro-oeste' | 'sudeste' | 'sul'> = {
      'AC': 'norte', 'AP': 'norte', 'AM': 'norte', 'PA': 'norte', 'RO': 'norte', 'RR': 'norte', 'TO': 'norte',
      'AL': 'nordeste', 'BA': 'nordeste', 'CE': 'nordeste', 'MA': 'nordeste', 'PB': 'nordeste', 'PE': 'nordeste', 'PI': 'nordeste', 'RN': 'nordeste', 'SE': 'nordeste',
      'DF': 'centro-oeste', 'GO': 'centro-oeste', 'MT': 'centro-oeste', 'MS': 'centro-oeste',
      'ES': 'sudeste', 'MG': 'sudeste', 'RJ': 'sudeste', 'SP': 'sudeste',
      'PR': 'sul', 'RS': 'sul', 'SC': 'sul',
    };
    return regions[state] || 'sudeste';
  }
}

// Instância singleton
export const politicaAPI = PoliticaAPI.getInstance(); 