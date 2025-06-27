import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const party = searchParams.get("party");
    const limit = searchParams.get("limit") || "100";
    const includeVotes = searchParams.get("includeVotes") === "true";

    // Construir URL da API da Câmara
    const params = new URLSearchParams();
    if (state) params.append("siglaUf", state);
    if (party) params.append("siglaPartido", party);
    params.append("itens", limit);

    const apiUrl = `https://dadosabertos.camara.leg.br/api/v2/deputados?${params}`;

    console.log("Fetching deputies from:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Politica-Transparencia/1.0",
      },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transformar dados para o formato da aplicação
    const deputies = await Promise.all(
      data.dados.map(async (dep: any) => {
        const deputy = {
          id: dep.id.toString(),
          name: dep.nome,
          party: dep.siglaPartido,
          state: dep.siglaUf,
          house: "deputado" as const,
          photo: dep.urlFoto,
          email: dep.email,
          mandate: {
            legislature: dep.idLegislatura,
            isCurrent: dep.idLegislatura === 57, // Current legislature is 57
          },
          votes: [] as any[],
          votingStats: {
            totalVotes: 0,
            yesVotes: 0,
            noVotes: 0,
            abstentions: 0,
            absences: 0,
            attendanceRate: 0,
          },
        };

        // Se solicitado, buscar dados de votações
        if (includeVotes) {
          try {
            const votesResponse = await fetch(
              `https://dadosabertos.camara.leg.br/api/v2/deputados/${dep.id}/votacoes?itens=50`,
              {
                headers: {
                  Accept: "application/json",
                  "User-Agent": "Politica-Transparencia/1.0",
                },
                next: { revalidate: 1800 }, // Cache por 30 minutos
              }
            );

            if (votesResponse.ok) {
              const votesData = await votesResponse.json();

              // Processar votações
              deputy.votes = votesData.dados.map((vote: any) => ({
                id: vote.id.toString(),
                proposalId: vote.proposicao?.id?.toString(),
                proposalTitle: vote.proposicao?.ementa || "Votação sem título",
                proposalType: vote.proposicao?.siglaTipo || "N/A",
                vote: mapVoteType(vote.voto),
                date: vote.data,
                session: vote.sessao,
                justification: vote.justificativa || null,
              }));

              // Calcular estatísticas
              const totalVotes = deputy.votes.length;
              const yesVotes = deputy.votes.filter(
                (v) => v.vote === "sim"
              ).length;
              const noVotes = deputy.votes.filter(
                (v) => v.vote === "nao"
              ).length;
              const abstentions = deputy.votes.filter(
                (v) => v.vote === "abstencao"
              ).length;
              const absences = deputy.votes.filter(
                (v) => v.vote === "ausente"
              ).length;

              deputy.votingStats = {
                totalVotes,
                yesVotes,
                noVotes,
                abstentions,
                absences,
                attendanceRate:
                  totalVotes > 0
                    ? ((totalVotes - absences) / totalVotes) * 100
                    : 0,
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch votes for deputy ${dep.id}:`, error);
            // Continue without votes if there's an error
          }
        }

        return deputy;
      })
    );

    return NextResponse.json({
      success: true,
      data: deputies,
      pagination: {
        page: 1,
        limit: parseInt(limit),
        total: deputies.length,
        totalPages: 1,
      },
      source: "Câmara dos Deputados API",
      timestamp: new Date().toISOString(),
      includeVotes: includeVotes,
    });
  } catch (error) {
    console.error("Error fetching deputies:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar dados dos deputados",
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
    sim: "sim",
    nao: "nao",
    abstencao: "abstencao",
    ausente: "ausente",
  };
  return voteMap[vote] || "ausente";
}
