'use client'

import { InvitationBlock } from '../../../types'
import { MapPin, ExternalLink } from 'lucide-react'

interface MapBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function MapBlock({ block, isSelected, onMouseDown, isPreview = false }: MapBlockProps) {
  const openInMaps = () => {
    const address = encodeURIComponent(block.data.address || '')
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
  }

  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.05 * transparency).toFixed(3)
  const gradientEnd = (0.02 * transparency).toFixed(3)
  const borderAlpha = (0.15 * transparency).toFixed(3)
  const shadowAlpha = (0.08 * transparency).toFixed(3)

  return (
    <div
      className={`w-full ${isPreview ? 'min-h-full' : 'h-full'} rounded-lg border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      } relative p-4 ${isPreview ? 'overflow-visible' : 'overflow-hidden'}`}
      onMouseDown={onMouseDown}
      style={{
        minHeight: '100%',
        background: `linear-gradient(135deg, rgba(255,255,255,${gradientStart}) 0%, rgba(255,255,255,${gradientEnd}) 100%)`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: `1px solid rgba(255,255,255,${borderAlpha})`,
        boxShadow: `0 18px 40px rgba(15,23,42,${shadowAlpha})`
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700">
          Карта
        </div>
      )}

      {/* Map Content */}
      <div className="h-full flex flex-col">
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 mb-2">Место проведения</h3>
            <p className="text-gray-600 mb-4">{block.data.address || 'Адрес мероприятия'}</p>
            
            <button
              onClick={openInMaps}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Открыть в картах</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
