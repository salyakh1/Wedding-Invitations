'use client'

import { InvitationBlock } from '../../../types'
import { Type } from 'lucide-react'

interface TextBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  invitation?: any // Настройки текста из приглашения
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function TextBlock({ block, isSelected, onMouseDown, invitation, isPreview = false }: TextBlockProps) {
  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.18 * transparency).toFixed(3)
  const gradientEnd = (0.06 * transparency).toFixed(3)
  const borderAlpha = (0.28 * transparency).toFixed(3)
  const shadowAlpha = (0.14 * transparency).toFixed(3)

  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 p-4 overflow-hidden`}
      onMouseDown={onMouseDown}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${gradientStart}) 0%, rgba(255,255,255,${gradientEnd}) 100%)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid rgba(255,255,255,${borderAlpha})`,
        boxShadow: `0 18px 40px rgba(15,23,42,${shadowAlpha})`,
        minHeight: '100%'
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Type className="w-3 h-3 inline mr-1" />
          Текст
        </div>
      )}

      {/* Text Content */}
      <div className="h-full flex items-center justify-center pt-8">
        <p 
          className="text-center leading-relaxed drop-shadow-sm"
          style={{
            fontFamily: invitation?.fontFamily || 'Montserrat',
            fontSize: `${invitation?.fontSize || 16}px`,
            color: invitation?.textColor || '#2D3748'
          }}
        >
          {block.data.content || 'Ваш текст здесь...'}
        </p>
      </div>
    </div>
  )
}
