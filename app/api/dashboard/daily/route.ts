import { NextRequest, NextResponse } from "next/server";

interface DailyVotingSession {
  id: string;
  data: string;
  dataHoraRegistro: string;
  descricao: string;
  siglaOrgao: string;
  status: string;
  aprovacao?: number;
  proposicoesAfetadas?: Array<{
    id: number;
    numero: number;
    ano: number;
    siglaTipo: string;
    ementa: string;
  }>;
  votosSim?: number;
  votosNao?: number;
  abstencoes?: number;
  ausencias?: number;
}

interface DailyProposal {
  id: string;
  numero: number;
  ano: number;
  siglaTipo: string;
  ementa: string;
  dataApresentacao: string;
  statusProposicao: {
    tramitacao: {
      situacao: {
        descricao: string;
      };
    };
  };
  autor: {
    nome: string;
    partido: {
      sigla: string;
    };
    uf: string;
  };
}

interface DailyDashboardData {
  date: string;
  votingSessions: DailyVotingSession[];
  proposals: DailyProposal[];
  summary: {
    totalSessions: number;
    totalProposals: number;
    completedVotes: number;
    pendingVotes: number;
  };
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedDate = searchParams.get("date");

    // Convert to GMT/UTC timezone (API likely expects GMT)
    const getGMTDate = (dateString?: string) => {
      let date: Date;

      if (dateString) {
        // If specific date provided, parse it and convert to GMT
        date = new Date(dateString + "T00:00:00Z"); // GMT/UTC timezone
      } else {
        // Use current date in GMT timezone
        const now = new Date();
        // Convert to UTC by subtracting the timezone offset
        const utc = now.getTime() - now.getTimezoneOffset() * 60000;
        date = new Date(utc);
      }

      return date.toISOString().split("T")[0];
    };

    const date = getGMTDate(requestedDate || undefined);
    console.log(
      `Fetching daily dashboard for date: ${date} (GMT/UTC timezone)`
    );

    // Fetch today's voting sessions
    const votingSessionsResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/votacoes?dataInicio=${date}&dataFim=${date}&ordem=DESC&ordenarPor=dataHoraRegistro&itens=50`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Politica-Transparencia/1.0",
        },
        next: { revalidate: 900 }, // Cache for 15 minutes
      }
    );

    if (!votingSessionsResponse.ok) {
      throw new Error(
        `Failed to fetch voting sessions: ${votingSessionsResponse.status}`
      );
    }

    const votingSessionsData = await votingSessionsResponse.json();
    const votingSessions: DailyVotingSession[] = (
      votingSessionsData.dados || []
    ).map((session: any) => ({
      ...session,
      status:
        session.aprovacao === 1
          ? "Aprovada"
          : session.aprovacao === 0
            ? "Rejeitada"
            : "Em andamento",
    }));

    // Fetch detailed information for each voting session to get affected proposals
    const enhancedVotingSessions = await Promise.all(
      votingSessions.map(async (session) => {
        try {
          const sessionDetailsResponse = await fetch(
            `https://dadosabertos.camara.leg.br/api/v2/votacoes/${session.id}`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "Politica-Transparencia/1.0",
              },
              next: { revalidate: 900 }, // Cache for 15 minutes
            }
          );

          if (sessionDetailsResponse.ok) {
            const sessionDetailsData = await sessionDetailsResponse.json();
            const sessionDetails = sessionDetailsData.dados;

            return {
              ...session,
              proposicoesAfetadas: sessionDetails.proposicoesAfetadas || [],
              votosSim: sessionDetails.votosSim,
              votosNao: sessionDetails.votosNao,
              abstencoes: sessionDetails.abstencoes,
              ausencias: sessionDetails.ausencias,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching details for session ${session.id}:`,
            error
          );
        }

        return session;
      })
    );

    // Fetch proposals that might be discussed today
    // We'll get recent proposals and filter by activity
    const proposalsResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/proposicoes?dataInicio=${date}&ordem=DESC&ordenarPor=dataApresentacao&itens=20`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Politica-Transparencia/1.0",
        },
        next: { revalidate: 900 }, // Cache for 15 minutes
      }
    );

    let proposals: DailyProposal[] = [];
    if (proposalsResponse.ok) {
      const proposalsData = await proposalsResponse.json();
      proposals = proposalsData.dados || [];
    }

    // Calculate summary statistics
    const completedVotes = votingSessions.filter(
      (session) =>
        session.status === "Aprovada" || session.status === "Rejeitada"
    ).length;

    const pendingVotes = votingSessions.filter(
      (session) => session.status === "Em andamento"
    ).length;

    const dashboardData: DailyDashboardData = {
      date,
      votingSessions: enhancedVotingSessions,
      proposals,
      summary: {
        totalSessions: enhancedVotingSessions.length,
        totalProposals: proposals.length,
        completedVotes,
        pendingVotes,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      source: "Câmara dos Deputados API",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching daily dashboard:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar dados do dashboard diário",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
