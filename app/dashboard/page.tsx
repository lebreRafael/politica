"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  AlertCircle,
  TrendingUp,
  FileText,
  Users,
  MapPin,
  Building,
  RefreshCw,
} from "lucide-react";
import {
  categorizeProposal,
  getTopicColor,
  TOPIC_CATEGORIES,
} from "../../lib/topicCategorization";

interface DailyVotingSession {
  id: string;
  data: string;
  dataHoraRegistro: string;
  descricao: string;
  siglaOrgao: string;
  status: string;
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

// Proposal type definitions
const PROPOSAL_TYPES = {
  PRC: {
    name: "Projeto de Resolução",
    description: "Resoluções parlamentares",
    color: "blue",
  },
  PL: {
    name: "Projeto de Lei",
    description: "Projetos de lei ordinária",
    color: "green",
  },
  PEC: {
    name: "Proposta de Emenda Constitucional",
    description: "Emendas à Constituição",
    color: "purple",
  },
  MPV: {
    name: "Medida Provisória",
    description: "Medidas provisórias",
    color: "orange",
  },
  PDL: {
    name: "Projeto de Decreto Legislativo",
    description: "Decretos legislativos",
    color: "red",
  },
  PDC: { name: "Projeto de Decreto", description: "Decretos", color: "indigo" },
  PRS: {
    name: "Projeto de Resolução",
    description: "Resoluções do Senado",
    color: "pink",
  },
  default: {
    name: "Outros",
    description: "Outros tipos de proposta",
    color: "gray",
  },
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await fetch("/api/dashboard/daily");
        console.log("Response status:", response.status);

        const result = await response.json();
        console.log("API result:", result);

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Error loading data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique proposals from all voting sessions
  const getUniqueProposals = () => {
    if (!data?.votingSessions) return [];

    const proposalMap = new Map();
    data.votingSessions.forEach((session: any) => {
      if (
        session.proposicoesAfetadas &&
        session.proposicoesAfetadas.length > 0
      ) {
        session.proposicoesAfetadas.forEach((proposal: any) => {
          const key = `${proposal.siglaTipo}-${proposal.numero}-${proposal.ano}`;
          if (!proposalMap.has(key)) {
            proposalMap.set(key, {
              ...proposal,
              sessions: [],
            });
          }
          proposalMap.get(key).sessions.push(session);
        });
      }
    });

    return Array.from(proposalMap.values());
  };

  // Group proposals by type
  const getProposalsByType = () => {
    const uniqueProposals = getUniqueProposals();
    const grouped = new Map();

    uniqueProposals.forEach((proposal: any) => {
      const type = proposal.siglaTipo;
      const typeInfo =
        PROPOSAL_TYPES[type as keyof typeof PROPOSAL_TYPES] ||
        PROPOSAL_TYPES.default;

      if (!grouped.has(type)) {
        grouped.set(type, {
          type,
          typeInfo,
          proposals: [],
        });
      }
      grouped.get(type).proposals.push(proposal);
    });

    return Array.from(grouped.values()).sort(
      (a, b) => b.proposals.length - a.proposals.length
    );
  };

  // Group proposals by topic
  const getProposalsByTopic = () => {
    const uniqueProposals = getUniqueProposals();
    const grouped = new Map();

    uniqueProposals.forEach((proposal: any) => {
      const topicMatches = categorizeProposal(proposal.ementa);

      if (topicMatches.length > 0) {
        const primaryTopic = topicMatches[0].category;

        if (!grouped.has(primaryTopic.id)) {
          grouped.set(primaryTopic.id, {
            topic: primaryTopic,
            proposals: [],
          });
        }
        grouped.get(primaryTopic.id).proposals.push({
          ...proposal,
          topicMatches,
          primaryTopic, // Store the primary topic for this proposal
        });
      } else {
        // Uncategorized proposals
        if (!grouped.has("uncategorized")) {
          grouped.set("uncategorized", {
            topic: {
              id: "uncategorized",
              name: "Não Categorizado",
              description: "Propostas sem classificação temática",
              color: "gray",
            },
            proposals: [],
          });
        }
        grouped.get("uncategorized").proposals.push({
          ...proposal,
          topicMatches: [],
          primaryTopic: null,
        });
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => b.proposals.length - a.proposals.length
    );
  };

  const getTypeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">Loading Dashboard...</h1>
        <p>Please wait while we fetch the data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const uniqueProposals = getUniqueProposals();
  const proposalsByType = getProposalsByType();
  const proposalsByTopic = getProposalsByTopic();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Dia</h1>

      {data && (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-bold text-black">{data.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-lg font-bold text-black">
                  {data.summary.totalSessions}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Votes</p>
                <p className="text-lg font-bold text-black">
                  {data.summary.completedVotes}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Proposals</p>
                <p className="text-lg font-bold text-black">
                  {uniqueProposals.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Topics Covered</p>
                <p className="text-lg font-bold text-black">
                  {
                    proposalsByTopic.filter(
                      (group: any) => group.topic.id !== "uncategorized"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Proposals by Topic */}
          {proposalsByTopic.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Propostas por Tema</h2>
              <div className="space-y-6">
                {proposalsByTopic.map((topicGroup: any) => (
                  <div
                    key={topicGroup.topic.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getTopicColor(topicGroup.topic.color)}`}
                        >
                          {topicGroup.topic.name}
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {topicGroup.topic.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {topicGroup.topic.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {topicGroup.proposals.length} proposta
                        {topicGroup.proposals.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {topicGroup.proposals.map(
                        (proposal: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-gray-200 pl-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Link
                                  href={`/proposals/${proposal.id}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {proposal.siglaTipo} {proposal.numero}/
                                  {proposal.ano}
                                </Link>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {proposal.sessions.length} sessão
                                    {proposal.sessions.length > 1 ? "ões" : ""}
                                  </span>
                                  {/* Always show the primary topic for this proposal */}
                                  {proposal.primaryTopic && (
                                    <span
                                      className={`px-2 py-1 rounded text-xs border ${getTopicColor(proposal.primaryTopic.color)}`}
                                      title={`${proposal.primaryTopic.name} (primary)`}
                                    >
                                      {proposal.primaryTopic.name}
                                    </span>
                                  )}
                                  {/* Show secondary topics that are different from primary */}
                                  {proposal.topicMatches &&
                                    proposal.topicMatches.length > 1 && (
                                      <div className="flex space-x-1">
                                        {proposal.topicMatches
                                          .slice(1)
                                          .filter(
                                            (match: any) =>
                                              match.category.id !==
                                              proposal.primaryTopic?.id
                                          )
                                          .map((match: any, idx: number) => (
                                            <span
                                              key={idx}
                                              className={`px-2 py-1 rounded text-xs border ${getTopicColor(match.category.color)}`}
                                              title={`${match.category.name} (${match.score.toFixed(1)})`}
                                            >
                                              {match.category.name}
                                            </span>
                                          ))}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {proposal.ementa}
                            </p>
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Status:</span>{" "}
                              {proposal.sessions[0].status}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposals by Type */}
          {proposalsByType.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Propostas por Tipo</h2>
              <div className="space-y-6">
                {proposalsByType.map((typeGroup: any) => (
                  <div
                    key={typeGroup.type}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(typeGroup.typeInfo.color)}`}
                        >
                          {typeGroup.type}
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {typeGroup.typeInfo.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {typeGroup.typeInfo.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {typeGroup.proposals.length} proposta
                        {typeGroup.proposals.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {typeGroup.proposals.map(
                        (proposal: any, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-gray-200 pl-4"
                          >
                            <div className="flex items-start justify-between">
                              <Link
                                href={`/proposals/${proposal.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {proposal.siglaTipo} {proposal.numero}/
                                {proposal.ano}
                              </Link>
                              <span className="text-sm text-gray-500">
                                {proposal.sessions.length} sessão
                                {proposal.sessions.length > 1 ? "ões" : ""}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {proposal.ementa}
                            </p>
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Status:</span>{" "}
                              {proposal.sessions[0].status}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voting Sessions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sessões de Votação</h2>
            {data.votingSessions && data.votingSessions.length > 0 ? (
              <div className="space-y-4">
                {data.votingSessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 rounded p-4"
                  >
                    <h3 className="font-medium text-lg mb-1">
                      {session.descricao}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-1">
                      <span>
                        <b>Órgão:</b> {session.siglaOrgao}
                      </span>
                      <span>
                        <b>Status:</b> {session.status}
                      </span>
                      <span>
                        <b>Horário:</b> {session.dataHoraRegistro}
                      </span>
                    </div>
                    {session.proposicoesAfetadas &&
                      session.proposicoesAfetadas.length > 0 && (
                        <div className="mt-1 p-2 bg-gray-50 rounded">
                          <div className="text-sm text-blue-800 font-semibold">
                            <Link
                              href={`/proposals/${session.proposicoesAfetadas[0].id}`}
                              className="hover:underline"
                            >
                              Proposta:{" "}
                              {session.proposicoesAfetadas[0].siglaTipo}{" "}
                              {session.proposicoesAfetadas[0].numero}/
                              {session.proposicoesAfetadas[0].ano}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-700 italic">
                            {session.proposicoesAfetadas[0].ementa}
                          </div>
                        </div>
                      )}
                    {(session.votosSim !== undefined ||
                      session.votosNao !== undefined) && (
                      <div className="flex flex-wrap gap-4 mt-2 text-xs">
                        {session.votosSim !== undefined && (
                          <span className="text-green-700">
                            Sim: {session.votosSim}
                          </span>
                        )}
                        {session.votosNao !== undefined && (
                          <span className="text-red-700">
                            Não: {session.votosNao}
                          </span>
                        )}
                        {session.abstencoes !== undefined && (
                          <span className="text-yellow-700">
                            Abstenções: {session.abstencoes}
                          </span>
                        )}
                        {session.ausencias !== undefined && (
                          <span className="text-gray-500">
                            Ausências: {session.ausencias}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No voting sessions today</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
