'use client'

import { useState } from 'react'
import { InvitationBlock } from '../../../types'
import { MessageSquare, Edit3, Send } from 'lucide-react'

interface WishesBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
  invitationId?: string
  onAddWish?: (name: string, message: string) => Promise<void>
}

export default function WishesBlock({ block, isSelected, onUpdate, onMouseDown, isPreview = false, showEditButtons = true, invitationId, onAddWish }: WishesBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (updates: any) => {
    onUpdate({
      data: { ...block.data, ...updates }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('handleSubmit called', { name, message, onAddWish: !!onAddWish })
    
    if (!name.trim() || !message.trim()) {
      console.log('Form validation failed')
      return
    }

    // Если нет функции для добавления пожелания (например, в конструкторе), просто показываем сообщение
    if (!onAddWish) {
      console.log('onAddWish is not provided')
      alert('Функция отправки пожеланий доступна только на странице приглашения')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('Submitting wish...')
      await onAddWish(name.trim(), message.trim())
      
      // Очистка формы
      setName('')
      setMessage('')
      
      // Показать уведомление об успехе
      alert('Пожелание отправлено!')
    } catch (error) {
      console.error('Error sending wish:', error)
      alert('Ошибка при отправке пожелания: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative overflow-hidden`}
      onMouseDown={!isPreview ? onMouseDown : undefined}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        minHeight: '100%',
        pointerEvents: 'auto'
      }}
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col items-center justify-center" style={{ pointerEvents: 'auto' }}>
        {/* Block Label */}
        {!isPreview && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Пожелания
          </div>
        )}

        {/* Edit Button */}
        {!isPreview && showEditButtons && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Edit3 className="w-3 h-3 text-gray-600" />
          </button>
        )}

      {/* Wishes Content */}
      <div 
        className="flex flex-col items-center justify-center space-y-4 pt-8 w-full relative z-50"
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <div className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder текст
              </label>
              <input
                type="text"
                value={block.data.placeholder || 'Оставьте пожелание...'}
                onChange={(e) => updateData({ placeholder: e.target.value })}
                className="w-full px-4 py-3 border-0 rounded-xl bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Placeholder для поля сообщения"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <MessageSquare className="w-6 h-6 text-indigo-500 animate-pulse drop-shadow-sm" />
                <h3 className="text-lg font-bold text-gray-800 drop-shadow-sm">Оставьте пожелание</h3>
                <MessageSquare className="w-6 h-6 text-indigo-500 animate-pulse drop-shadow-sm" />
              </div>
              <p className="text-sm text-gray-600 drop-shadow-sm">Поделитесь своими теплыми словами</p>
            </div>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 relative z-50"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 50 }}
            >
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-0 rounded-xl bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                  placeholder="Ваше имя"
                  required
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border-0 rounded-xl bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 resize-none"
                  placeholder={block.data.placeholder || 'Оставьте пожелание...'}
                  rows={4}
                  required
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !onAddWish || !name.trim() || !message.trim()}
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Button clicked', { isSubmitting, hasOnAddWish: !!onAddWish, name, message })
                }}
                className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative z-50"
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50
                }}
              >
                <Send className="w-4 h-4" />
                <span className="font-medium">{isSubmitting ? 'Отправка...' : 'Отправить пожелание'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Close Content Layer */}
      </div>
    </div>
  )
}
