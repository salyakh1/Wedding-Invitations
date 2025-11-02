'use client'

import { useState, useEffect } from 'react'
import { InvitationBlock } from '../../../types'
import { Clock, Calendar } from 'lucide-react'

interface CountdownBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
}

export default function CountdownBlock({ block, isSelected, onMouseDown, isPreview = false }: CountdownBlockProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    if (!block.data.weddingDate) return

    const calculateTimeLeft = () => {
      const weddingDate = new Date(block.data.weddingDate).getTime()
      const now = new Date().getTime()
      const difference = weddingDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [block.data.weddingDate])

  const isWeddingDay = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

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
        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Clock className="w-3 h-3 inline mr-1" />
          Обратный отсчет
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-8">
        <div className="text-center">
            {block.data.weddingDate ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 drop-shadow-sm">
                  {block.data.title || 'До свадьбы осталось'}
                </h3>
                
                {isWeddingDay ? (
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Calendar className="w-6 h-6" />
                      <span className="text-xl font-bold">Сегодня свадьба!</span>
                    </div>
                    <p className="text-sm opacity-90">Поздравляем с этим особенным днем!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        {timeLeft.days}
                      </div>
                      <div className="text-xs text-gray-600 drop-shadow-sm">
                        {timeLeft.days === 1 ? 'день' : timeLeft.days < 5 ? 'дня' : 'дней'}
                      </div>
                    </div>
                    
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        {timeLeft.hours}
                      </div>
                      <div className="text-xs text-gray-600 drop-shadow-sm">
                        {timeLeft.hours === 1 ? 'час' : timeLeft.hours < 5 ? 'часа' : 'часов'}
                      </div>
                    </div>
                    
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-xs text-gray-600 drop-shadow-sm">
                        {timeLeft.minutes === 1 ? 'минута' : timeLeft.minutes < 5 ? 'минуты' : 'минут'}
                      </div>
                    </div>
                    
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-xs text-gray-600 drop-shadow-sm">
                        {timeLeft.seconds === 1 ? 'секунда' : timeLeft.seconds < 5 ? 'секунды' : 'секунд'}
                      </div>
                    </div>
                  </div>
                )}
                
                {block.data.description && (
                  <p className="text-sm text-gray-600 drop-shadow-sm mt-3">
                    {block.data.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Clock className="w-12 h-12 text-gray-400 drop-shadow-sm" />
                <p className="text-sm text-gray-500">Выберите дату свадьбы</p>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
