'use client'

import { InvitationBlock } from '../../../types'
import { Heart } from 'lucide-react'

interface NamesBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  invitation?: any // Настройки текста из приглашения
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function NamesBlock({ block, isSelected, onMouseDown, invitation, isPreview = false }: NamesBlockProps) {

  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center overflow-hidden`}
      onMouseDown={onMouseDown}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        minHeight: '100%'
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Heart className="w-3 h-3 inline mr-1" />
          Имена
        </div>
      )}

      {/* Names Content */}
      <div className="text-center pt-8">
        {block.data?.layout === 'one-line' ? (
          // Отображение в одну линию
          <div className="flex items-center justify-center space-x-4">
            <h2 
              className="text-3xl font-bold drop-shadow-sm"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${(invitation?.fontSize || 16) * 1.5}px`,
                color: invitation?.textColor || '#2D3748'
              }}
            >
              {block.data.groomName || 'Имя жениха'}
            </h2>
            <Heart className="w-8 h-8 text-pink-500 animate-pulse drop-shadow-lg" />
            <h2 
              className="text-3xl font-bold drop-shadow-sm"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${(invitation?.fontSize || 16) * 1.5}px`,
                color: invitation?.textColor || '#2D3748'
              }}
            >
              {block.data.brideName || 'Имя невесты'}
            </h2>
          </div>
        ) : (
          // Отображение в две линии (по умолчанию)
          <div className="space-y-6">
            <h2 
              className="text-3xl font-bold drop-shadow-sm"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${(invitation?.fontSize || 16) * 1.5}px`,
                color: invitation?.textColor || '#2D3748'
              }}
            >
              {block.data.groomName || 'Имя жениха'}
            </h2>
            <div className="flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500 animate-pulse drop-shadow-lg" />
            </div>
            <h2 
              className="text-3xl font-bold drop-shadow-sm"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${(invitation?.fontSize || 16) * 1.5}px`,
                color: invitation?.textColor || '#2D3748'
              }}
            >
              {block.data.brideName || 'Имя невесты'}
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}
