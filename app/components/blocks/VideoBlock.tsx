'use client'

import { InvitationBlock } from '../../../types'
import { Video } from 'lucide-react'

interface VideoBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
  invitation?: any // Настройки текста из приглашения
}

export default function VideoBlock({ block, isSelected, onMouseDown, isPreview = false, invitation }: VideoBlockProps) {
  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.05 * transparency).toFixed(3)
  const gradientEnd = (0.02 * transparency).toFixed(3)
  const borderAlpha = (0.15 * transparency).toFixed(3)
  const shadowAlpha = (0.08 * transparency).toFixed(3)

  return (
    <div
      className={`w-full ${isPreview ? 'min-h-full' : 'h-full'} rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center ${isPreview ? 'overflow-visible' : 'overflow-hidden'}`}
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
        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Video className="w-3 h-3 inline mr-1" />
          Видео
        </div>
      )}

      {/* Video Content */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-8">
        <div className="text-center">
          {/* Загруженное видео */}
          {block.data?.videoFile ? (
            <div 
              className={`${block.data.shape === 'circle' ? 'rounded-full' : 'rounded-xl'} overflow-hidden shadow-lg`}
              style={{
                width: `${block.data.size || 200}px`,
                height: `${block.data.size || 200}px`
              }}
            >
              <video
                src={block.data.videoFile}
                width={block.data.size || 200}
                height={block.data.size || 200}
                controls
                className="w-full h-full object-contain"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                preload="metadata"
              >
                Ваш браузер не поддерживает видео элемент.
              </video>
            </div>
          ) : null}

          {/* Заглушка если нет видео */}
          {!block.data?.videoFile && (
            <div className="flex flex-col items-center space-y-2">
              <Video className="w-12 h-12 text-gray-400 drop-shadow-sm" />
              <p className={`text-sm text-gray-500 ${isPreview ? 'hidden' : ''}`}>Добавьте видео</p>
            </div>
          )}
          
          {block.data?.description && (
            <p 
              className="text-sm mt-2 drop-shadow-sm"
              style={{
                fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
                fontSize: `${block.fontSize || invitation?.fontSize || 16}px`,
                color: block.textColor || invitation?.textColor || '#4A5568'
              }}
            >
              {block.data.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
