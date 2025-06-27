"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Building,
} from "lucide-react";

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

interface ProposalResponse {
  success: boolean;
  data: Proposal;
}

export default function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProposal();
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/proposals/${params.id}`);
      const data: ProposalResponse = await response.json();

      if (data.success) {
        setProposal(data.data);
      } else {
        setError("Erro ao carregar dados da proposta");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("aprovado") ||
      statusLower.includes("sancionado")
    ) {
      return "bg-green-100 text-green-800";
    }
    if (statusLower.includes("rejeitado") || statusLower.includes("vetado")) {
      return "bg-red-100 text-red-800";
    }
    if (
      statusLower.includes("tramitando") ||
      statusLower.includes("em análise")
    ) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
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

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Proposta não encontrada
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

        {/* Proposal Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {proposal.type} {proposal.number}/{proposal.year}
                </h1>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {proposal.title}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}
              >
                {proposal.status}
              </span>
            </div>
          </div>

          {/* Author Information */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Autor: {proposal.author}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-1" />
                <span>{proposal.authorParty}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{proposal.authorState}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ementa
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {proposal.summary || "Ementa não disponível."}
              </p>
            </div>

            {/* Current Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Localização Atual
              </h3>
              <p className="text-gray-700">
                {proposal.currentLocation || "Informação não disponível."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cronologia
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Apresentação</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {formatDate(proposal.introductionDate)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Última Atualização</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {formatDate(proposal.lastUpdate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Voting Results */}
            {proposal.votingResults && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultado da Votação
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Sim</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {proposal.votingResults.yes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm text-gray-600">Não</span>
                    </div>
                    <span className="font-medium text-red-600">
                      {proposal.votingResults.no}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Minus className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-gray-600">Abstenções</span>
                    </div>
                    <span className="font-medium text-yellow-600">
                      {proposal.votingResults.abstentions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Ausências</span>
                    </div>
                    <span className="font-medium text-gray-600">
                      {proposal.votingResults.absences}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Total
                      </span>
                      <span className="font-bold text-gray-900">
                        {proposal.votingResults.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Links Externos
              </h3>
              <div className="space-y-2">
                <a
                  href={`https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${proposal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Ver na Câmara dos Deputados →
                </a>
                <a
                  href={`https://www25.senado.leg.br/web/atividade/materias/-/materia/${proposal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Ver no Senado Federal →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
