'use client'

import { useState } from 'react'
import { Invitation } from '../../types'
import { Type, Palette, Ruler, BookOpen } from 'lucide-react'

interface TextSettingsPanelProps {
  invitation: Invitation | null
  onUpdateInvitation: (invitation: Invitation) => void
}

const fontOptions = [
  { value: 'Montserrat', label: 'Montserrat', category: 'Sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Dancing Script', label: 'Dancing Script', category: 'Script' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans-serif' },
  { value: 'Great Vibes', label: 'Great Vibes', category: 'Script' },
  { value: 'Lato', label: 'Lato', category: 'Sans-serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Pacifico', label: 'Pacifico', category: 'Script' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Sans-serif' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond', category: 'Serif' }
]

const colorPresets = [
  { name: 'Классический', colors: ['#2D3748', '#4A5568', '#718096'] },
  { name: 'Романтичный', colors: ['#E53E3E', '#F56565', '#FC8181'] },
  { name: 'Элегантный', colors: ['#2B6CB0', '#3182CE', '#4299E1'] },
  { name: 'Золотой', colors: ['#D69E2E', '#F6E05E', '#FEF5E7'] },
  { name: 'Фиолетовый', colors: ['#805AD5', '#9F7AEA', '#B794F6'] },
  { name: 'Зеленый', colors: ['#38A169', '#68D391', '#9AE6B4'] }
]

export default function TextSettingsPanel({ invitation, onUpdateInvitation }: TextSettingsPanelProps) {
  const [selectedColor, setSelectedColor] = useState('#2D3748')
  const [selectedFont, setSelectedFont] = useState(invitation?.fontFamily || 'Montserrat')
  const [fontSize, setFontSize] = useState(invitation?.fontSize || 16)

  const updateTextSettings = (updates: Partial<Invitation>) => {
    if (!invitation) return
    
    const updatedInvitation = {
      ...invitation,
      ...updates
    }
    onUpdateInvitation(updatedInvitation)
  }

  const handleFontChange = (font: string) => {
    setSelectedFont(font)
    updateTextSettings({ fontFamily: font })
  }

  const handleFontSizeChange = (size: number) => {
    setFontSize(size)
    updateTextSettings({ fontSize: size })
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    updateTextSettings({ textColor: color })
  }

  if (!invitation) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Выберите приглашение</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Type className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Настройки текста</h2>
        </div>
        <p className="text-sm text-gray-600">Управление шрифтами, размерами и цветами для всех блоков</p>
      </div>

      {/* Font Family */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Шрифт</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              onClick={() => handleFontChange(font.value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedFont === font.value
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div 
                    className="font-medium text-gray-800"
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{font.category}</div>
                </div>
                <div 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: font.value }}
                >
                  Aa
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Ruler className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Размер текста</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Размер: {fontSize}px</span>
            <div 
              className="text-lg font-medium"
              style={{ 
                fontFamily: selectedFont,
                fontSize: `${fontSize}px`,
                color: selectedColor
              }}
            >
              Пример текста
            </div>
          </div>
          
          <input
            type="range"
            min="12"
            max="32"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>12px</span>
            <span>32px</span>
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Цвет текста</h3>
        </div>
        
        {/* Color Presets */}
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Готовые палитры:</div>
          <div className="grid grid-cols-2 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleColorChange(preset.colors[0])}
                className="p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <div className="text-sm font-medium text-gray-800 mb-2">{preset.name}</div>
                <div className="flex space-x-1">
                  {preset.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color */}
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Пользовательский цвет:</div>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-2">Предварительный просмотр:</div>
          <div 
            className="text-lg font-medium"
            style={{ 
              fontFamily: selectedFont,
              fontSize: `${fontSize}px`,
              color: selectedColor
            }}
          >
            Жених и Невеста
          </div>
          <div 
            className="text-sm mt-2"
            style={{ 
              fontFamily: selectedFont,
              fontSize: `${Math.max(12, fontSize - 4)}px`,
              color: selectedColor
            }}
          >
            Добро пожаловать на нашу свадьбу!
          </div>
        </div>
      </div>

      {/* Apply to All Blocks */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Применить настройки ко всем блокам
            const updatedBlocks = invitation.blocks.map((block: any) => ({
              ...block,
              data: {
                ...block.data,
                fontFamily: selectedFont,
                fontSize: fontSize,
                textColor: selectedColor
              }
            }))
            updateTextSettings({ blocks: updatedBlocks })
          }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Применить ко всем блокам
        </button>
      </div>
    </div>
  )
}
