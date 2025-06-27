"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Vote {
  id: string;
  sessionId: string;
  proposalId?: string;
  proposalNumber?: number;
  proposalYear?: number;
  proposalTitle: string;
  proposalType: string;
  vote: "sim" | "nao" | "abstencao" | "ausente";
  date: string;
  session: string;
  justification?: string;
  rollCall: boolean;
  voteTime?: string;
}

interface Deputy {
  id: string;
  name: string;
  party: string;
  state: string;
  house: string;
  photo: string;
  email: string;
  mandate: {
    isCurrent: boolean;
  };
}

interface VotingStats {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstentions: number;
  absences: number;
  attendanceRate: number;
  yesPercentage: number;
  noPercentage: number;
  abstentionPercentage: number;
}

interface DeputyVotesResponse {
  success: boolean;
  data: {
    deputy: Deputy;
    votes: Vote[];
    votingStats: VotingStats;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export default function DeputyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [deputy, setDeputy] = useState<Deputy | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [votingStats, setVotingStats] = useState<VotingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchDeputyVotes();
  }, [params.id, currentPage]);

  const fetchDeputyVotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/deputies/${params.id}/votes?limit=20&offset=${(currentPage - 1) * 20}`
      );
      const data: DeputyVotesResponse = await response.json();

      if (data.success) {
        if (currentPage === 1) {
          setDeputy(data.data.deputy);
          setVotes(data.data.votes);
          setVotingStats(data.data.votingStats);
        } else {
          setVotes((prev) => [...prev, ...data.data.votes]);
        }
        setHasMore(data.pagination.hasMore);
      } else {
        setError("Erro ao carregar dados do deputado");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case "sim":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "nao":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "abstencao":
        return <Minus className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVoteText = (vote: string) => {
    switch (vote) {
      case "sim":
        return "Sim";
      case "nao":
        return "Não";
      case "abstencao":
        return "Abstenção";
      default:
        return "Ausente";
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "sim":
        return "bg-green-100 text-green-800";
      case "nao":
        return "bg-red-100 text-red-800";
      case "abstencao":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !deputy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <Link
              href="/deputies"
              className="text-red-600 hover:text-red-800 underline"
            >
              Voltar para a lista de deputados
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!deputy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Deputado não encontrado
            </h2>
            <Link
              href="/deputies"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Voltar para a lista de deputados
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/deputies"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a lista de deputados
        </Link>

        {/* Deputy Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={deputy.photo}
              alt={deputy.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = document.createElement("div");
                  placeholder.className = "w-24 h-24";
                  placeholder.innerHTML = `<div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xl">${deputy.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}</div>`;
                  parent.insertBefore(placeholder, target);
                }
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {deputy.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {deputy.state}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {deputy.party}
                </div>
                {deputy.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <a
                      href={`mailto:${deputy.email}`}
                      className="hover:text-blue-600"
                    >
                      {deputy.email}
                    </a>
                  </div>
                )}
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  deputy.mandate.isCurrent
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {deputy.mandate.isCurrent
                  ? "Mandato Atual"
                  : "Mandato Anterior"}
              </span>
            </div>
          </div>
        </div>

        {/* Voting Statistics */}
        {votingStats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Estatísticas de Votação
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {votingStats.totalVotes}
                </div>
                <div className="text-sm text-gray-600">Total de Votações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {votingStats.yesVotes}
                </div>
                <div className="text-sm text-gray-600">Votos Sim</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {votingStats.noVotes}
                </div>
                <div className="text-sm text-gray-600">Votos Não</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {votingStats.attendanceRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Presença</div>
              </div>
            </div>

            {/* Vote Distribution */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Distribuição de votos</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${votingStats.yesPercentage}%` }}
                ></div>
                <div
                  className="bg-red-600 h-2 rounded-full -mt-2"
                  style={{
                    width: `${votingStats.noPercentage}%`,
                    marginLeft: `${votingStats.yesPercentage}%`,
                  }}
                ></div>
                <div
                  className="bg-yellow-600 h-2 rounded-full -mt-2"
                  style={{
                    width: `${votingStats.abstentionPercentage}%`,
                    marginLeft: `${votingStats.yesPercentage + votingStats.noPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sim: {votingStats.yesPercentage.toFixed(1)}%</span>
                <span>Não: {votingStats.noPercentage.toFixed(1)}%</span>
                <span>
                  Abstenção: {votingStats.abstentionPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Voting History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Histórico de Votações
          </h2>

          {votes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma votação encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Este deputado não possui votações registradas no período.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {votes.map((vote) => (
                <div
                  key={vote.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getVoteIcon(vote.vote)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getVoteColor(vote.vote)}`}
                        >
                          {getVoteText(vote.vote)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(vote.date)}
                        </span>
                        {vote.voteTime && (
                          <span className="text-sm text-gray-500">
                            {formatTime(vote.voteTime)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">
                        {vote.proposalTitle}
                      </h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Sessão: {vote.session}</span>
                        {vote.proposalNumber && (
                          <span>
                            Proposta: {vote.proposalNumber}/{vote.proposalYear}
                          </span>
                        )}
                        {vote.proposalType && vote.proposalType !== "N/A" && (
                          <span>Tipo: {vote.proposalType}</span>
                        )}
                      </div>

                      {/* Proposal Details Link */}
                      {vote.proposalId && (
                        <div className="mt-3">
                          <Link
                            href={`/proposals/${vote.proposalId}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ver detalhes da proposta
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Carregando..." : "Carregar mais votações"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
