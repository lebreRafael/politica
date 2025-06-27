import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    const deputyId = params.id;

    // Buscar informações básicas do deputado
    const deputyResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputyId}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Politica-Transparencia/1.0",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!deputyResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Deputado não encontrado",
          message: `Deputado com ID ${deputyId} não foi encontrado`,
        },
        { status: 404 }
      );
    }

    const deputyData = await deputyResponse.json();
    const deputy = deputyData.dados;

    // Buscar votações recentes (últimas 100 votações)
    const votingSessionsResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/votacoes?itens=100&ordem=DESC&ordenarPor=data`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Politica-Transparencia/1.0",
        },
        next: { revalidate: 1800 },
      }
    );

    if (!votingSessionsResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao buscar votações",
          message: "Não foi possível buscar as sessões de votação",
        },
        { status: 500 }
      );
    }

    const votingSessionsData = await votingSessionsResponse.json();
    const votingSessions = votingSessionsData.dados;

    // Buscar votos do deputado em cada sessão
    const deputyVotes: any[] = [];

    for (const session of votingSessions) {
      try {
        // Buscar detalhes da sessão de votação para obter informações da proposta
        const sessionDetailsResponse = await fetch(
          `https://dadosabertos.camara.leg.br/api/v2/votacoes/${session.id}`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "Politica-Transparencia/1.0",
            },
            next: { revalidate: 1800 },
          }
        );

        let sessionDetails = null;
        if (sessionDetailsResponse.ok) {
          const sessionDetailsData = await sessionDetailsResponse.json();
          sessionDetails = sessionDetailsData.dados;
        }

        const sessionVotesResponse = await fetch(
          `https://dadosabertos.camara.leg.br/api/v2/votacoes/${session.id}/votos`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "Politica-Transparencia/1.0",
            },
            next: { revalidate: 1800 },
          }
        );

        if (sessionVotesResponse.ok) {
          const sessionVotesData = await sessionVotesResponse.json();
          const sessionVotes = sessionVotesData.dados;

          // Encontrar o voto do deputado específico
          const deputyVote = sessionVotes.find(
            (vote: any) => vote.deputado_.id.toString() === deputyId
          );

          if (deputyVote) {
            // Tentar obter informações da proposta dos detalhes da sessão
            const proposalInfo =
              sessionDetails?.proposicoesAfetadas?.[0] || null;

            deputyVotes.push({
              id: `${session.id}-${deputyId}`,
              sessionId: session.id,
              proposalId: proposalInfo?.id?.toString() || null,
              proposalNumber: proposalInfo?.numero || null,
              proposalYear: proposalInfo?.ano || null,
              proposalTitle: session.descricao || "Votação sem título",
              proposalType: proposalInfo?.siglaTipo || "N/A",
              vote: mapVoteType(deputyVote.tipoVoto),
              date: session.data,
              session: session.siglaOrgao,
              justification: null, // API não fornece justificativa individual
              rollCall: true,
              voteTime: deputyVote.dataRegistroVoto,
            });
          }
        }

        // Limitar o número de sessões para evitar muitas requisições
        if (deputyVotes.length >= parseInt(limit)) {
          break;
        }
      } catch (error) {
        console.error(`Erro ao buscar votos da sessão ${session.id}:`, error);
        continue;
      }
    }

    // Aplicar paginação
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedVotes = deputyVotes.slice(startIndex, endIndex);

    // Calcular estatísticas
    const totalVotes = deputyVotes.length;
    const yesVotes = deputyVotes.filter((v) => v.vote === "sim").length;
    const noVotes = deputyVotes.filter((v) => v.vote === "nao").length;
    const abstentions = deputyVotes.filter(
      (v) => v.vote === "abstencao"
    ).length;
    const absences = deputyVotes.filter((v) => v.vote === "ausente").length;

    const votingStats = {
      totalVotes,
      yesVotes,
      noVotes,
      abstentions,
      absences,
      attendanceRate:
        totalVotes > 0 ? ((totalVotes - absences) / totalVotes) * 100 : 0,
      yesPercentage: totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0,
      noPercentage: totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0,
      abstentionPercentage:
        totalVotes > 0 ? (abstentions / totalVotes) * 100 : 0,
    };

    // Informações do deputado
    const deputyInfo = {
      id: deputy.id.toString(),
      name: deputy.nome,
      party: deputy.siglaPartido,
      state: deputy.siglaUf,
      house: "deputado" as const,
      photo: deputy.urlFoto,
      email: deputy.email,
      mandate: {
        startDate: deputy.dataInicio,
        endDate: deputy.dataFim,
        isCurrent: deputy.dataFim === null,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        deputy: deputyInfo,
        votes: paginatedVotes,
        votingStats: votingStats,
      },
      pagination: {
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: totalVotes,
        hasMore: endIndex < totalVotes,
      },
      source: "Câmara dos Deputados API",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching deputy votes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar votações do deputado",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Função auxiliar para mapear tipos de voto
function mapVoteType(vote: string): "sim" | "nao" | "abstencao" | "ausente" {
  const voteMap: Record<string, "sim" | "nao" | "abstencao" | "ausente"> = {
    Sim: "sim",
    Não: "nao",
    Abstenção: "abstencao",
    Ausente: "ausente",
    Obstrução: "abstencao",
    "Artigo 17": "abstencao", // Artigo 17 é uma forma de abstenção
    sim: "sim",
    nao: "nao",
    abstencao: "abstencao",
    ausente: "ausente",
  };
  return voteMap[vote] || "ausente";
}
