'use client'

import { InvitationBlock } from '../../../types'
import { Shirt } from 'lucide-react'

interface DressCodeBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  invitation?: any // Настройки текста из приглашения
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function DressCodeBlock({ block, isSelected, onMouseDown, invitation, isPreview = false }: DressCodeBlockProps) {
  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.05 * transparency).toFixed(3)
  const gradientEnd = (0.02 * transparency).toFixed(3)
  const borderAlpha = (0.15 * transparency).toFixed(3)
  const shadowAlpha = (0.08 * transparency).toFixed(3)

  return (
    <div
      className={`w-full ${isPreview ? 'min-h-full' : 'h-full'} rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 p-4 ${isPreview ? 'overflow-visible' : 'overflow-hidden'}`}
      onMouseDown={onMouseDown}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${gradientStart}) 0%, rgba(255,255,255,${gradientEnd}) 100%)`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: `1px solid rgba(255,255,255,${borderAlpha})`,
        boxShadow: `0 18px 40px rgba(15,23,42,${shadowAlpha})`,
        minHeight: '100%'
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Shirt className="w-3 h-3 inline mr-1" />
          Дресс-код
        </div>
      )}

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center pt-8 space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shirt className="w-8 h-8 text-purple-500 animate-pulse drop-shadow-sm" />
          <h3 
            className="text-2xl font-bold drop-shadow-sm"
            style={{
              fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
              fontSize: `${(block.fontSize || invitation?.fontSize || 16) * 1.3}px`,
              color: block.textColor || invitation?.textColor || '#2D3748'
            }}
          >
            Дресс-код
          </h3>
          <Shirt className="w-8 h-8 text-purple-500 animate-pulse drop-shadow-sm" />
        </div>
        
        <div 
          className="text-center leading-relaxed drop-shadow-sm max-w-lg"
          style={{
            fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
            fontSize: `${block.fontSize || invitation?.fontSize || 16}px`,
            color: block.textColor || invitation?.textColor || '#4A5568'
          }}
        >
          {block.data?.description || 'Укажите дресс-код для вашей свадьбы...'}
        </div>
      </div>
    </div>
  )
}

