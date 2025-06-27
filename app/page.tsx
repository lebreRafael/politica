import Link from "next/link";
import { Users, TrendingUp, Search, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transparência na
            <span className="text-blue-600"> Política Brasileira</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore o histórico completo de votações dos deputados federais.
            Acompanhe como seus representantes votaram em propostas importantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deputies"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Explorar Deputados
            </Link>
            <Link
              href="/deputies"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar Votações
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que usar nossa plataforma?
            </h3>
            <p className="text-lg text-gray-600">
              Ferramentas poderosas para acompanhar a atividade parlamentar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Perfis Completos
              </h4>
              <p className="text-gray-600">
                Acesse informações detalhadas de todos os deputados federais,
                incluindo fotos, partidos e estatísticas de voto.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Histórico de Votações
              </h4>
              <p className="text-gray-600">
                Visualize cada voto individual dos deputados, com datas,
                propostas e justificativas quando disponíveis.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Estatísticas Detalhadas
              </h4>
              <p className="text-gray-600">
                Analise padrões de voto, taxas de presença e distribuição de
                votos por deputado e partido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Dados em Tempo Real
            </h3>
            <p className="text-lg text-gray-600">
              Informações atualizadas diretamente das APIs oficiais
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">513</div>
              <div className="text-gray-600">Deputados Federais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Transparência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Disponibilidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">API</div>
              <div className="text-gray-600">Dados Oficiais</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Comece a explorar agora
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Descubra como seus representantes estão votando no Congresso
          </p>
          <Link
            href="/deputies"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            <Users className="w-5 h-5 mr-2" />
            Ver Todos os Deputados
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">
              Política Transparência
            </h4>
            <p className="text-gray-400 mb-4">
              Ferramenta para acompanhar a atividade parlamentar brasileira
            </p>
            <div className="text-sm text-gray-500">
              <p>Dados fornecidos pela API da Câmara dos Deputados</p>
              <p className="mt-1">
                © 2024 Política Transparência. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
