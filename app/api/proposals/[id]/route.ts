import { NextRequest, NextResponse } from "next/server";

interface Proposal {
  id: string;
  number: number;
  year: number;
  title: string;
  summary: string;
  type: string;
  status: string;
  author: string;
  authorParty: string;
  authorState: string;
  introductionDate: string;
  lastUpdate: string;
  currentLocation: string;
  votingResults?: {
    yes: number;
    no: number;
    abstentions: number;
    absences: number;
    total: number;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id;

    // Fetch proposal details from Chamber API
    const proposalResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${proposalId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!proposalResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    const proposalData = await proposalResponse.json();
    const proposal = proposalData.dados;

    // Fetch proposal details for more information
    const detailsResponse = await fetch(
      `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${proposalId}/tramitacoes`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    let currentLocation = "Informação não disponível";
    let lastUpdate = proposal.dataApresentacao;

    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      if (detailsData.dados && detailsData.dados.length > 0) {
        const lastTramitacao = detailsData.dados[0]; // Most recent
        currentLocation =
          lastTramitacao.situacao?.descricao || "Informação não disponível";
        lastUpdate = lastTramitacao.dataHora || proposal.dataApresentacao;
      }
    }

    // Try to fetch voting results if available
    let votingResults;
    try {
      const votingResponse = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro&idProposicao=${proposalId}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (votingResponse.ok) {
        const votingData = await votingResponse.json();
        if (votingData.dados && votingData.dados.length > 0) {
          const latestVote = votingData.dados[0];
          votingResults = {
            yes: latestVote.votosSim || 0,
            no: latestVote.votosNao || 0,
            abstentions: latestVote.abstencoes || 0,
            absences: latestVote.ausencias || 0,
            total:
              (latestVote.votosSim || 0) +
              (latestVote.votosNao || 0) +
              (latestVote.abstencoes || 0) +
              (latestVote.ausencias || 0),
          };
        }
      }
    } catch (error) {
      // Voting results are optional, so we don't fail if this fails
      console.log("Could not fetch voting results:", error);
    }

    const formattedProposal: Proposal = {
      id: proposal.id.toString(),
      number: proposal.numero,
      year: proposal.ano,
      title: proposal.ementa || "Título não disponível",
      summary: proposal.ementa || "Ementa não disponível",
      type: proposal.siglaTipo || "Tipo não disponível",
      status:
        proposal.statusProposicao?.tramitacao?.situacao?.descricao ||
        "Status não disponível",
      author: proposal.autor || "Autor não disponível",
      authorParty: proposal.autor?.partido?.sigla || "Partido não disponível",
      authorState: proposal.autor?.uf || "Estado não disponível",
      introductionDate: proposal.dataApresentacao,
      lastUpdate: lastUpdate,
      currentLocation: currentLocation,
      votingResults: votingResults,
    };

    return NextResponse.json({
      success: true,
      data: formattedProposal,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
