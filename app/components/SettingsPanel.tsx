'use client'

import { useState } from 'react'
import { Invitation } from '../../types'
import { Upload, Music, Palette, Type, Eye, Settings, Sparkles } from 'lucide-react'
import TextSettingsPanel from './TextSettingsPanel'

interface SettingsPanelProps {
  invitation: Invitation | null
  onUpdateInvitation: (invitation: Invitation) => void
}

const fontFamilies = [
  { name: 'Montserrat', value: 'Montserrat', class: 'font-montserrat' },
  { name: 'Playfair Display', value: 'Playfair Display', class: 'font-playfair' },
  { name: 'Dancing Script', value: 'Dancing Script', class: 'font-dancing' },
  { name: 'Great Vibes', value: 'Great Vibes', class: 'font-great-vibes' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond', class: 'font-cormorant' },
]

const backgroundColors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
  '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
  '#d299c2', '#fef9d7', '#89f7fe', '#66a6ff', '#fad0c4', '#ffd1ff'
]

export default function SettingsPanel({ invitation, onUpdateInvitation }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'media' | 'text' | 'animations'>('general')

  const updateInvitation = (updates: Partial<Invitation>) => {
    if (!invitation) return
    onUpdateInvitation({ ...invitation, ...updates })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateInvitation({ backgroundImage: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateInvitation({ backgroundMusic: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!invitation) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Выберите приглашение</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Настройки</h2>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'general' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Общие
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'appearance' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Внешний вид
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'media' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Медиа
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'text' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Текст
        </button>
        <button
          onClick={() => setActiveTab('animations')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'animations' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>Эффекты</span>
          </div>
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название приглашения
            </label>
            <input
              type="text"
              value={invitation.title}
              onChange={(e) => updateInvitation({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Введите название"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Размер текста
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="12"
                max="32"
                value={invitation.fontSize}
                onChange={(e) => updateInvitation({ fontSize: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-8">{invitation.fontSize}px</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Шрифт
            </label>
            <select
              value={invitation.fontFamily}
              onChange={(e) => updateInvitation({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цвет фона
            </label>
            <div className="grid grid-cols-6 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateInvitation({ backgroundColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    invitation.backgroundColor === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={invitation.backgroundColor}
              onChange={(e) => updateInvitation({ backgroundColor: e.target.value })}
              className="mt-2 w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Прозрачность блоков
            </label>
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value="0.9"
                onChange={(e) => {
                  const opacity = parseFloat(e.target.value)
                  const updatedBlocks = invitation.blocks.map(block => ({
                    ...block,
                    opacity
                  }))
                  updateInvitation({ blocks: updatedBlocks })
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-8">90%</span>
            </div>
          </div>
        </div>
      )}

      {/* Media Settings */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фоновое изображение
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="cursor-pointer text-sm text-gray-600 hover:text-gray-900"
              >
                Загрузить изображение
              </label>
              {invitation.backgroundImage && (
                <div className="mt-2">
                  <img
                    src={invitation.backgroundImage}
                    alt="Background preview"
                    className="w-full h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фоновая музыка
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="hidden"
                id="music-upload"
              />
              <label
                htmlFor="music-upload"
                className="cursor-pointer text-sm text-gray-600 hover:text-gray-900"
              >
                Загрузить музыку
              </label>
              {invitation.backgroundMusic && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={invitation.backgroundMusic} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Text Settings */}
      {activeTab === 'text' && (
        <TextSettingsPanel 
          invitation={invitation} 
          onUpdateInvitation={onUpdateInvitation} 
        />
      )}

      {/* Animations & Effects Settings */}
      {activeTab === 'animations' && (
        <div className="space-y-6">
          {/* Анимации блоков */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Анимации появления блоков</span>
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Fade-in (Плавное появление)</span>
                <input
                  type="checkbox"
                  checked={invitation.animations?.fadeIn ?? false}
                  onChange={(e) => updateInvitation({
                    animations: {
                      ...invitation.animations,
                      fadeIn: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Slide-up (Снизу вверх)</span>
                <input
                  type="checkbox"
                  checked={invitation.animations?.slideUp ?? false}
                  onChange={(e) => updateInvitation({
                    animations: {
                      ...invitation.animations,
                      slideUp: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Scale-in (С увеличением)</span>
                <input
                  type="checkbox"
                  checked={invitation.animations?.scaleIn ?? false}
                  onChange={(e) => updateInvitation({
                    animations: {
                      ...invitation.animations,
                      scaleIn: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Staggered (По очереди с задержкой)</span>
                <input
                  type="checkbox"
                  checked={invitation.animations?.staggered ?? false}
                  onChange={(e) => updateInvitation({
                    animations: {
                      ...invitation.animations,
                      staggered: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
            </div>
          </div>

          {/* Спецэффекты */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Спецэффекты для фона</span>
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Parallax scrolling (Параллакс)</span>
                <input
                  type="checkbox"
                  checked={invitation.effects?.parallax ?? false}
                  onChange={(e) => updateInvitation({
                    effects: {
                      ...invitation.effects,
                      parallax: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Particle effects (Частицы: конфетти, звезды, сердечки)</span>
                <input
                  type="checkbox"
                  checked={invitation.effects?.particles ?? false}
                  onChange={(e) => updateInvitation({
                    effects: {
                      ...invitation.effects,
                      particles: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Gradient animation (Анимация градиента)</span>
                <input
                  type="checkbox"
                  checked={invitation.effects?.gradientAnimation ?? false}
                  onChange={(e) => updateInvitation({
                    effects: {
                      ...invitation.effects,
                      gradientAnimation: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Blur on scroll (Размытие при прокрутке)</span>
                <input
                  type="checkbox"
                  checked={invitation.effects?.blurOnScroll ?? false}
                  onChange={(e) => updateInvitation({
                    effects: {
                      ...invitation.effects,
                      blurOnScroll: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
