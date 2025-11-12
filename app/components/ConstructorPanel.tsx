'use client'

import { useState } from 'react'
import { Invitation, InvitationBlock } from '../../types'
import { 
  Image, 
  Type, 
  Video, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Sliders,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock
} from 'lucide-react'

interface ConstructorPanelProps {
  invitation: Invitation | null
  onUpdateInvitation: (invitation: Invitation) => void
}

const blockTypes = [
  { type: 'background', label: 'Фон', icon: Image, color: 'bg-purple-500' },
  { type: 'names', label: 'Имена', icon: Heart, color: 'bg-pink-500' },
  { type: 'text', label: 'Текст', icon: Type, color: 'bg-blue-500' },
  { type: 'video', label: 'Видео', icon: Video, color: 'bg-green-500' },
  { type: 'map', label: 'Карта', icon: MapPin, color: 'bg-red-500' },
  { type: 'story', label: 'История', icon: Edit3, color: 'bg-yellow-500' },
  { type: 'wishes', label: 'Пожелания', icon: MessageSquare, color: 'bg-indigo-500' },
  { type: 'wishes-slider', label: 'Слайдер пожеланий', icon: Sliders, color: 'bg-teal-500' },
  { type: 'wedding-date', label: 'День свадьбы', icon: Calendar, color: 'bg-rose-500' },
  { type: 'countdown', label: 'Обратный отсчет', icon: Clock, color: 'bg-violet-500' }
]

export default function ConstructorPanel({ invitation, onUpdateInvitation }: ConstructorPanelProps) {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  const addBlock = (type: string) => {
    if (!invitation) return

    // Вычисляем позицию для нового блока на основе реальных высот предыдущих блоков
    const existingBlocks = invitation.blocks.filter(b => b.type !== 'background')
    const blockSpacing = 30
    
    // Вычисляем Y позицию на основе реальных высот всех предыдущих блоков
    let y = 20
    for (const prevBlock of existingBlocks) {
      // Используем реальную высоту блока, учитывая story блоки
      const prevHeight = prevBlock.type === 'story' 
        ? (prevBlock.size?.height || 200) + 30  // Story блоки могут расширяться
        : (prevBlock.size?.height || 200)
      // Используем индивидуальный отступ блока или значение по умолчанию
      const prevMarginBottom = prevBlock.marginBottom ?? blockSpacing
      y += prevHeight + prevMarginBottom
    }
    
    const newBlock: InvitationBlock = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position: { x: 20, y: y },
      size: { width: 760, height: 200 }, // Ширина с отступами
      data: getDefaultBlockData(type),
      opacity: 0.9,
      marginBottom: 24 // Отступ по умолчанию
    }

    const updatedInvitation = {
      ...invitation,
      blocks: [...invitation.blocks, newBlock]
    }

    onUpdateInvitation(updatedInvitation)
  }

  const getDefaultBlockData = (type: string) => {
    switch (type) {
      case 'background':
        return { image: '', color: '#667eea' }
      case 'names':
        return { groomName: 'Имя жениха', brideName: 'Имя невесты' }
      case 'text':
        return { content: 'Ваш текст здесь...' }
      case 'video':
        return { url: '', shape: 'circle', size: 200, description: '' }
      case 'map':
        return { address: 'Адрес мероприятия' }
      case 'story':
        return { title: 'Наша история', items: [] }
      case 'wishes':
        return { placeholder: 'Оставьте пожелание...' }
      case 'wishes-slider':
        return { autoPlay: true, speed: 3000 }
      case 'wedding-date':
        return { weddingDate: '', weddingTime: '', weddingLocation: '', description: '' }
      case 'countdown':
        return { weddingDate: '', title: 'До свадьбы осталось', description: '' }
      default:
        return {}
    }
  }

  const removeBlock = (blockId: string) => {
    if (!invitation) return

    const updatedInvitation = {
      ...invitation,
      blocks: invitation.blocks.filter(block => block.id !== blockId)
    }

    onUpdateInvitation(updatedInvitation)
  }

  const handleDragStart = (e: React.DragEvent, type: string) => {
    setDraggedBlock(type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Блоки</h2>
      
      {/* Available Blocks */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Добавить блок</h3>
        <div className="grid grid-cols-2 gap-2">
          {blockTypes.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => addBlock(type)}
              className={`flex flex-col items-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors ${draggedBlock === type ? 'opacity-50' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Blocks */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Текущие блоки</h3>
        <div className="space-y-2">
          {invitation.blocks.map((block) => {
            const blockType = blockTypes.find(bt => bt.type === block.type)
            const Icon = blockType?.icon || Plus
            
            return (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${blockType?.color || 'bg-gray-500'} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{blockType?.label}</p>
                    <p className="text-xs text-gray-500">Прозрачность: {Math.round(block.opacity * 100)}%</p>
                  </div>
                </div>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
          
          {invitation.blocks.length === 0 && (
            <p className="text-gray-500 text-center py-4">Нет добавленных блоков</p>
          )}
        </div>
      </div>
    </div>
  )
}
