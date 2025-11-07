'use client'

import { InvitationBlock } from '../../../types'
import { useMemo } from 'react'

interface StoryBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  invitation?: any
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function StoryBlock({ block, isSelected, onMouseDown, invitation, isPreview = false }: StoryBlockProps) {
  const items = block.data?.items || []
  
  // Генерируем уникальный ID для SVG clipPath
  const heartClipId = useMemo(() => `heart-clip-${block.id}`, [block.id])

  const getImageClassName = (shape: string = 'square') => {
    const baseClasses = 'mx-auto object-cover'
    switch (shape) {
      case 'circle':
        return `${baseClasses} rounded-full`
      case 'heart':
        return `${baseClasses}`
      default:
        return `${baseClasses} rounded-lg`
    }
  }

  const getImageStyle = (shape: string = 'square') => {
    if (shape === 'heart') {
      // Используем SVG clipPath для правильной формы сердца
      return {
        clipPath: `url(#${heartClipId})`,
        WebkitClipPath: `url(#${heartClipId})`
      }
    }
    return {}
  }

  return (
    <div
      className={`w-full rounded-lg border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      } relative p-4`}
      onMouseDown={onMouseDown}
      style={{
        minHeight: '200px',
        height: 'auto',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      {/* SVG Definition for Heart Shape - Elegant and Romantic */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={heartClipId} clipPathUnits="objectBoundingBox">
            {/* Классическая элегантная форма сердца - два полукруга сверху, заостренный низ */}
            {/* Левая половина сердца */}
            <path d="M 0.5,0.8 
                     C 0.5,0.8 0.1,0.5 0.1,0.4
                     C 0.1,0.3 0.2,0.2 0.35,0.2
                     C 0.4,0.2 0.45,0.22 0.48,0.25
                     C 0.49,0.23 0.495,0.22 0.5,0.22
                     C 0.505,0.22 0.51,0.23 0.52,0.25
                     C 0.55,0.22 0.6,0.2 0.65,0.2
                     C 0.8,0.2 0.9,0.3 0.9,0.4
                     C 0.9,0.5 0.5,0.8 0.5,0.8 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
          История
        </div>
      )}

      {/* Story Content */}
      <div className="overflow-y-auto pt-2">
        <div className="space-y-6">
          {block.data?.title && (
            <h3 
              className="font-semibold text-gray-800 text-center"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${(invitation?.fontSize || 16) * 1.2}px`,
                color: invitation?.textColor || '#2D3748'
              }}
            >
              {block.data.title}
            </h3>
          )}

          {/* Items Sequence */}
          {items.length === 0 ? (
            <p 
              className="text-gray-500 text-center text-sm"
              style={{
                fontFamily: invitation?.fontFamily || 'Montserrat',
                fontSize: `${invitation?.fontSize || 16}px`,
                color: invitation?.textColor || '#666'
              }}
            >
              Добавьте элементы истории...
            </p>
          ) : (
            items.map((item: any, index: number) => {
              if (item.type === 'text') {
                return (
                  <div key={index} className="space-y-2">
                    <p 
                      className="text-gray-600 text-sm leading-relaxed text-center"
                      style={{
                        fontFamily: invitation?.fontFamily || 'Montserrat',
                        fontSize: `${invitation?.fontSize || 16}px`,
                        color: invitation?.textColor || '#4A5568'
                      }}
                    >
                      {item.content || 'Текст истории...'}
                    </p>
                  </div>
                )
              } else if (item.type === 'image' && item.imageUrl) {
                const imageSize = item.size || 192
                return (
                  <div key={index} className="flex justify-center">
                    <div 
                      className="relative"
                      style={{
                        width: `${imageSize}px`,
                        height: `${imageSize}px`,
                        filter: item.shape === 'heart' ? 'drop-shadow(0 4px 12px rgba(236, 72, 153, 0.3))' : undefined
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={`Story image ${index + 1}`}
                        className={getImageClassName(item.shape)}
                        style={{
                          ...getImageStyle(item.shape),
                          width: `${imageSize}px`,
                          height: `${imageSize}px`,
                          objectFit: 'cover',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )
              }
              return null
            })
          )}
        </div>
      </div>
    </div>
  )
}
