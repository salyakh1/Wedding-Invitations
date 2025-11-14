'use client'

import { InvitationBlock } from '../../../types'
import { Users, User } from 'lucide-react'

interface GuestsBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  invitation?: any // Настройки текста из приглашения
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function GuestsBlock({ block, isSelected, onMouseDown, invitation, isPreview = false }: GuestsBlockProps) {
  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.05 * transparency).toFixed(3)
  const gradientEnd = (0.02 * transparency).toFixed(3)
  const borderAlpha = (0.15 * transparency).toFixed(3)
  const shadowAlpha = (0.08 * transparency).toFixed(3)

  const guests = block.data?.guests || []

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
        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Users className="w-3 h-3 inline mr-1" />
          Гости
        </div>
      )}

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center pt-8 space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Users className="w-8 h-8 text-amber-500 animate-pulse drop-shadow-sm" />
          <h3 
            className="text-2xl font-bold drop-shadow-sm"
            style={{
              fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
              fontSize: `${(block.fontSize || invitation?.fontSize || 16) * 1.3}px`,
              color: block.textColor || invitation?.textColor || '#2D3748'
            }}
          >
            {block.data?.title || 'Наши гости'}
          </h3>
          <Users className="w-8 h-8 text-amber-500 animate-pulse drop-shadow-sm" />
        </div>

        {guests.length === 0 ? (
          <p 
            className={`text-center text-gray-500 ${isPreview ? 'hidden' : ''}`}
            style={{
              fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
              fontSize: `${block.fontSize || invitation?.fontSize || 16}px`,
              color: block.textColor || invitation?.textColor || '#718096'
            }}
          >
            Добавьте гостей...
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {guests.map((guest: any, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg"
                style={{
                  background: `rgba(255,255,255,${(0.1 * transparency).toFixed(3)})`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {guest.photo ? (
                    <img
                      src={guest.photo}
                      alt={guest.name || 'Гость'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <p 
                  className="text-center font-semibold drop-shadow-sm"
                  style={{
                    fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
                    fontSize: `${(block.fontSize || invitation?.fontSize || 16) * 0.9}px`,
                    color: block.textColor || invitation?.textColor || '#2D3748'
                  }}
                >
                  {guest.name || 'Имя гостя'}
                </p>
                {guest.role && (
                  <p 
                    className="text-center text-xs drop-shadow-sm"
                    style={{
                      fontFamily: block.fontFamily || invitation?.fontFamily || 'Montserrat',
                      fontSize: `${(block.fontSize || invitation?.fontSize || 16) * 0.75}px`,
                      color: block.textColor || invitation?.textColor || '#718096'
                    }}
                  >
                    {guest.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

