import { Politician } from '@/types'
import { UserIcon } from '@heroicons/react/24/outline'

interface PoliticianCardProps {
  politician: Politician
  onClick?: () => void
}

export default function PoliticianCard({ politician, onClick }: PoliticianCardProps) {
  const getHouseLabel = (house: string) => {
    return house === 'deputado' ? 'Deputado Federal' : 'Senador'
  }

  const getPartyColor = (party: string) => {
    // Cores dos principais partidos brasileiros
    const partyColors: Record<string, string> = {
      'PT': 'bg-red-100 text-red-800',
      'PSDB': 'bg-blue-100 text-blue-800',
      'MDB': 'bg-green-100 text-green-800',
      'PP': 'bg-purple-100 text-purple-800',
      'PL': 'bg-yellow-100 text-yellow-800',
      'PSB': 'bg-pink-100 text-pink-800',
      'PDT': 'bg-orange-100 text-orange-800',
      'PODE': 'bg-indigo-100 text-indigo-800',
      'UNIÃO': 'bg-gray-100 text-gray-800',
      'PSD': 'bg-teal-100 text-teal-800',
    }
    
    return partyColors[party] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div 
      className="card card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Foto do parlamentar */}
        <div className="flex-shrink-0">
          {politician.photo ? (
            <img
              src={politician.photo}
              alt={politician.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center ${!politician.photo ? '' : 'hidden'}`}>
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Informações do parlamentar */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {politician.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {getHouseLabel(politician.house)} • {politician.state}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${getPartyColor(politician.party)}`}>
              {politician.party}
            </span>
            
            {politician.mandate.isCurrent && (
              <span className="badge bg-green-100 text-green-800">
                Mandato Atual
              </span>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="text-xs text-gray-500 space-y-1">
            {politician.email && (
              <p className="truncate">
                📧 {politician.email}
              </p>
            )}
            
            <p>
              📅 {new Date(politician.mandate.startDate).getFullYear()} - {
                politician.mandate.endDate 
                  ? new Date(politician.mandate.endDate).getFullYear()
                  : 'Atual'
              }
            </p>
          </div>
        </div>

        {/* Indicador de ação */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Comissões (se disponível) */}
      {politician.committees && politician.committees.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Comissões:
          </p>
          <div className="flex flex-wrap gap-1">
            {politician.committees.slice(0, 3).map((committee, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {committee}
              </span>
            ))}
            {politician.committees.length > 3 && (
              <span className="text-xs text-gray-500">
                +{politician.committees.length - 3} mais
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 