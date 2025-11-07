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
  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-4 overflow-hidden`}
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
