'use client'

import { InvitationBlock } from '../../../types'

interface BackgroundBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
}

export default function BackgroundBlock({ block, isSelected, onMouseDown, isPreview = false }: BackgroundBlockProps) {

  return (
    <div
      className={`w-full h-full rounded-lg border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      } relative overflow-hidden`}
      onMouseDown={onMouseDown}
      style={{
        backgroundColor: block.data.color || '#667eea',
        backgroundImage: block.data.image ? `url(${block.data.image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700">
          Фон
        </div>
      )}
    </div>
  )
}
