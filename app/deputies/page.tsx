"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Users, Filter } from "lucide-react";

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

interface DeputiesResponse {
  success: boolean;
  data: Deputy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function DeputiesPage() {
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [allDeputies, setAllDeputies] = useState<Deputy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOnlyCurrent, setShowOnlyCurrent] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAllDeputies();
  }, []);

  useEffect(() => {
    if (allDeputies.length > 0) {
      filterAndPaginateDeputies();
    }
  }, [allDeputies, searchTerm, showOnlyCurrent, currentPage]);

  const fetchAllDeputies = async () => {
    try {
      setLoading(true);
      // Fetch all deputies (using a large limit to get all)
      const response = await fetch(`/api/deputies?limit=1000`);
      const data: DeputiesResponse = await response.json();

      if (data.success) {
        setAllDeputies(data.data);
      } else {
        setError("Erro ao carregar deputados");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateDeputies = () => {
    setIsSearching(true);

    // Filter deputies based on search term and current mandate filter
    let filtered = allDeputies.filter((deputy) => {
      const matchesSearch =
        searchTerm === "" ||
        deputy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deputy.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deputy.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCurrentFilter = !showOnlyCurrent || deputy.mandate.isCurrent;

      return matchesSearch && matchesCurrentFilter;
    });

    // Calculate pagination
    const itemsPerPage = 20;
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);

    // Paginate results
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDeputies = filtered.slice(startIndex, endIndex);

    setDeputies(paginatedDeputies);
    setTotalPages(totalPages);
    setIsSearching(false);
  };

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showOnlyCurrent]);

  if (loading && deputies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Deputados Federais
          </h1>
          <p className="text-gray-600">
            Explore o histórico de votações dos deputados da Câmara dos
            Deputados
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, partido ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Checkbox */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={showOnlyCurrent}
                    onChange={(e) => setShowOnlyCurrent(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Apenas mandato atual</span>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {isSearching
                  ? "Buscando..."
                  : `${deputies.length} deputados encontrados`}
                {searchTerm && ` para "${searchTerm}"`}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Deputies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deputies.map((deputy) => (
            <Link
              key={deputy.id}
              href={`/deputies/${deputy.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={deputy.photo}
                    alt={deputy.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement("div");
                        placeholder.className = "w-16 h-16";
                        placeholder.innerHTML = `<div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">${deputy.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}</div>`;
                        parent.insertBefore(placeholder, target);
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {deputy.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {deputy.party} • {deputy.state}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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

                {/* Call to Action */}
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium">
                    Ver histórico de votações →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="px-3 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </nav>
          </div>
        )}

        {/* Empty State */}
        {deputies.length === 0 && !loading && !isSearching && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum deputado encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `Nenhum deputado encontrado para "${searchTerm}". Tente ajustar os termos de busca.`
                : "Tente ajustar os filtros de busca."}
            </p>
          </div>
        )}

        {/* Search Loading State */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Buscando deputados...</p>
          </div>
        )}
      </div>
    </div>
  );
}
