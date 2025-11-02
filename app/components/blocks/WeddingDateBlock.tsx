'use client'

import { InvitationBlock } from '../../../types'
import { Calendar, Heart } from 'lucide-react'

interface WeddingDateBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function WeddingDateBlock({ block, isSelected, onMouseDown, isPreview = false }: WeddingDateBlockProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center overflow-hidden`}
      onMouseDown={onMouseDown}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        minHeight: '100%'
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Calendar className="w-3 h-3 inline mr-1" />
          День свадьбы
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-8">
        <div className="text-center">
          {block.data.weddingDate ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-6 h-6 text-pink-500 animate-pulse drop-shadow-sm" />
                <h3 className="text-xl font-bold text-gray-800 drop-shadow-sm">День свадьбы</h3>
                <Heart className="w-6 h-6 text-pink-500 animate-pulse drop-shadow-sm" />
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <p className="text-lg font-semibold text-gray-800 drop-shadow-sm">
                  {formatDate(block.data.weddingDate)}
                </p>
                
                {block.data.weddingTime && (
                  <p className="text-md text-gray-700 drop-shadow-sm mt-1">
                    Время: {block.data.weddingTime}
                  </p>
                )}
                
                {block.data.weddingLocation && (
                  <p className="text-md text-gray-700 drop-shadow-sm mt-1">
                    Место: {block.data.weddingLocation}
                  </p>
                )}
              </div>
              
              {block.data.description && (
                <p className="text-sm text-gray-600 drop-shadow-sm mt-2">
                  {block.data.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Calendar className="w-12 h-12 text-gray-400 drop-shadow-sm" />
              <p className="text-sm text-gray-500">Выберите дату свадьбы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
