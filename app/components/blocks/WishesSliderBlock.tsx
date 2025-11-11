'use client'

import { useState, useEffect } from 'react'
import { InvitationBlock, Wish } from '../../../types'
import { Sliders, Edit3 } from 'lucide-react'

interface WishesSliderBlockProps {
  block: InvitationBlock
  isSelected: boolean
  onUpdate: (updates: Partial<InvitationBlock>) => void
  onMouseDown: (e: React.MouseEvent) => void
  isPreview?: boolean
  showEditButtons?: boolean
  wishes?: Wish[]
}

export default function WishesSliderBlock({ block, isSelected, onUpdate, onMouseDown, isPreview = false, showEditButtons = true, wishes }: WishesSliderBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const transparency = Math.max(0, Math.min(block.opacity ?? 1, 1))
  const gradientStart = (0.25 * transparency).toFixed(3)
  const gradientEnd = (0.12 * transparency).toFixed(3)
  const borderAlpha = (0.35 * transparency).toFixed(3)
  const shadowAlpha = (0.18 * transparency).toFixed(3)
  const innerOverlay = (0.22 * transparency).toFixed(3)

  const updateData = (updates: any) => {
    onUpdate({
      data: { ...block.data, ...updates }
    })
  }

  // Используем реальные пожелания из props, если они есть, иначе mock data для конструктора
  const displayWishes = wishes && wishes.length > 0 
    ? wishes.map(w => ({ name: w.name, message: w.message }))
    : [
        { name: 'Анна', message: 'Желаю вам счастливой семейной жизни!' },
        { name: 'Михаил', message: 'Пусть ваша любовь будет вечной!' },
        { name: 'Елена', message: 'Счастья, здоровья и взаимопонимания!' },
        { name: 'Дмитрий', message: 'Желаю вам много радостных моментов!' },
      ]

  const nextSlide = () => {
    if (displayWishes.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % displayWishes.length)
    }
  }

  const prevSlide = () => {
    if (displayWishes.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + displayWishes.length) % displayWishes.length)
    }
  }

  // Сброс слайда при изменении пожеланий
  useEffect(() => {
    if (displayWishes.length > 0 && currentSlide >= displayWishes.length) {
      setCurrentSlide(0)
    }
  }, [displayWishes.length, currentSlide])

  // Автоматическая прокрутка
  useEffect(() => {
    if (block.data.autoPlay !== false && displayWishes.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayWishes.length)
      }, block.data.speed || 3000)
      return () => clearInterval(interval)
    }
  }, [block.data.autoPlay, block.data.speed, displayWishes.length])

  return (
    <div
      className={`w-full h-full rounded-xl border-2 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } relative backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center`}
      onMouseDown={onMouseDown}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${gradientStart}) 0%, rgba(255,255,255,${gradientEnd}) 100%)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid rgba(255,255,255,${borderAlpha})`,
        boxShadow: `0 18px 40px rgba(15,23,42,${shadowAlpha})`
      }}
    >
      {/* Block Label */}
      {!isPreview && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <Sliders className="w-3 h-3 inline mr-1" />
          Слайдер пожеланий
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

      {/* Slider Content */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-8 w-full">
        {isEditing ? (
          <div className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Автопроигрывание
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={block.data.autoPlay !== false}
                  onChange={(e) => updateData({ autoPlay: e.target.checked })}
                  className="rounded accent-teal-500"
                />
                <span className="text-sm text-gray-600">Включить автопроигрывание</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Скорость: {block.data.speed || 3000}мс
              </label>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={block.data.speed || 3000}
                onChange={(e) => updateData({ speed: parseInt(e.target.value) })}
                className="w-full accent-teal-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Sliders className="w-6 h-6 text-teal-500 animate-pulse drop-shadow-sm" />
                <h3 className="text-lg font-bold text-gray-800 drop-shadow-sm">Пожелания гостей</h3>
                <Sliders className="w-6 h-6 text-teal-500 animate-pulse drop-shadow-sm" />
              </div>
              <p className="text-sm text-gray-600 drop-shadow-sm">Теплые слова от ваших близких</p>
            </div>

            {/* Wish Display */}
            {displayWishes.length > 0 ? (
              <>
                <div
                  className="rounded-xl p-6 shadow-lg"
                  style={{
                    background: `rgba(255,255,255,${innerOverlay})`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  <h4 className="font-bold text-gray-800 mb-3 text-center drop-shadow-sm">
                    {displayWishes[currentSlide]?.name || 'Гость'}
                  </h4>
                  <p className="text-gray-700 italic text-center drop-shadow-sm">
                    "{displayWishes[currentSlide]?.message || 'Пожелание...'}"
                  </p>
                </div>

                {/* Controls */}
                {displayWishes.length > 1 && (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevSlide}
                      className="p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{
                        background: `rgba(255,255,255,${innerOverlay})`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                      }}
                    >
                      ←
                    </button>

                    <div className="flex space-x-2">
                      {displayWishes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentSlide ? 'bg-teal-500 shadow-lg' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextSlide}
                      className="p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{
                        background: `rgba(255,255,255,${innerOverlay})`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-xl p-6 shadow-lg text-center"
                style={{
                  background: `rgba(255,255,255,${innerOverlay})`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              >
                <p className="text-gray-600">Пока нет пожеланий</p>
                <p className="text-sm text-gray-500 mt-2">Будьте первыми, кто оставит пожелание!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
