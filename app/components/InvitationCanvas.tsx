'use client'

import { useState, useRef, useEffect } from 'react'
import { Invitation, InvitationBlock } from '../../types'
import BackgroundBlock from './blocks/BackgroundBlock'
import NamesBlock from './blocks/NamesBlock'
import TextBlock from './blocks/TextBlock'
import VideoBlock from './blocks/VideoBlock'
import MapBlock from './blocks/MapBlock'
import StoryBlock from './blocks/StoryBlock'
import WishesBlock from './blocks/WishesBlock'
import WishesSliderBlock from './blocks/WishesSliderBlock'
import WeddingDateBlock from './blocks/WeddingDateBlock'
import CountdownBlock from './blocks/CountdownBlock'

interface InvitationCanvasProps {
  invitation: Invitation | null
  onUpdateInvitation: (invitation: Invitation) => void
  selectedBlock?: InvitationBlock | null
  onBlockSelect?: (block: InvitationBlock | null) => void
}

export default function InvitationCanvas({ invitation, onUpdateInvitation, selectedBlock: selectedBlockProp, onBlockSelect }: InvitationCanvasProps) {
  const [localSelectedBlock, setLocalSelectedBlock] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Функция для автоматического позиционирования блоков
  const getNextBlockPosition = (blockType: string) => {
    if (!invitation) return { x: 20, y: 20 }

    const existingBlocks = invitation.blocks.filter(b => b.type !== 'background')
    const blockHeight = 200 // Увеличиваем высоту блока
    const blockSpacing = 30 // Увеличиваем интервал
    
    // Позиционируем блоки вертикально по порядку
    const y = 20 + (existingBlocks.length * (blockHeight + blockSpacing))
    
    return { x: 20, y: y } // Убираем ограничение по Y
  }

  const updateBlock = (blockId: string, updates: Partial<InvitationBlock>) => {
    if (!invitation) return

    const updatedBlocks = invitation.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    )

    onUpdateInvitation({
      ...invitation,
      blocks: updatedBlocks
    })
  }

  const handleBlockMouseDown = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation()
    setLocalSelectedBlock(blockId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    
    const block = invitation?.blocks.find(b => b.id === blockId)
    if (block && onBlockSelect) {
      onBlockSelect(block)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !localSelectedBlock || !invitation) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    const block = invitation.blocks.find(b => b.id === localSelectedBlock)
    if (block) {
      updateBlock(localSelectedBlock, {
        position: {
          x: Math.max(0, Math.min(100, block.position.x + deltaX / 4)),
          y: Math.max(0, Math.min(100, block.position.y + deltaY / 4))
        }
      })
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const renderBlock = (block: InvitationBlock) => {
    const commonProps = {
      block,
      isSelected: localSelectedBlock === block.id,
      onUpdate: (updates: Partial<InvitationBlock>) => updateBlock(block.id, updates),
      onMouseDown: (e: React.MouseEvent) => handleBlockMouseDown(e, block.id),
      invitation, // Передаем настройки приглашения
      isPreview: false, // В конструкторе всегда показываем метки
      showEditButtons: false // Не показываем кнопки редактирования внутри блоков
    }

    switch (block.type) {
      case 'background':
        return <BackgroundBlock {...commonProps} />
      case 'names':
        return <NamesBlock {...commonProps} />
      case 'text':
        return <TextBlock {...commonProps} />
      case 'video':
        return <VideoBlock {...commonProps} />
      case 'map':
        return <MapBlock {...commonProps} />
      case 'story':
        return <StoryBlock {...commonProps} />
      case 'wishes':
        return <WishesBlock {...commonProps} />
      case 'wishes-slider':
        return <WishesSliderBlock {...commonProps} />
      case 'wedding-date':
        return <WeddingDateBlock {...commonProps} />
      case 'countdown':
        return <CountdownBlock {...commonProps} />
      default:
        return null
    }
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">💒</span>
          </div>
          <p className="text-gray-500">Выберите приглашение для редактирования</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">{invitation.title}</h2>
        <p className="text-sm text-gray-500">
          Размер: 800px ширина | Блоков: {invitation.blocks.length} | Прокручиваемое
        </p>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Background Container - на всю высоту прокручиваемой области */}
        <div
          className="relative mx-auto shadow-lg"
          style={{
            width: '800px',
            minHeight: '600px',
            height: 'auto',
            backgroundImage: invitation.backgroundImage ? `url(${invitation.backgroundImage})` : undefined,
            backgroundColor: invitation.backgroundColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'local'
          }}
        >
          {/* Canvas Content */}
          <div
            ref={canvasRef}
            className="relative w-full h-full"
            style={{
              fontFamily: invitation.fontFamily,
              fontSize: `${invitation.fontSize}px`
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background Music Player */}
            {invitation.backgroundMusic && (
              <div className="absolute top-4 right-4 z-10">
                <audio controls loop className="w-48">
                  <source src={invitation.backgroundMusic} type="audio/mpeg" />
                  Ваш браузер не поддерживает аудио элемент.
                </audio>
              </div>
              )}

            {/* Render Blocks in order */}
            {invitation.blocks
              .sort((a, b) => {
                // Background всегда внизу
                if (a.type === 'background') return -1
                if (b.type === 'background') return 1
                // Остальные блоки по порядку добавления
                return 0
              })
              .map((block, index) => {
                // Для background блока - просто рендерим компонент без дополнительных стилей
                if (block.type === 'background') {
                  return (
                    <div
                      key={block.id}
                      className="absolute inset-0"
                      style={{
                        zIndex: 1
                      }}
                    >
                      {renderBlock(block)}
                    </div>
                  )
                }
                
                // Для остальных блоков - строго вертикальное позиционирование
                const blockSpacing = 30
                // Сортируем блоки без background по position.y (порядок добавления)
                const nonBackgroundBlocks = invitation.blocks
                  .filter(b => b.type !== 'background')
                  .sort((a, b) => {
                    // Сортируем по position.y, если оно есть, иначе по порядку в массиве
                    const aY = a.position?.y || 0
                    const bY = b.position?.y || 0
                    return aY - bY
                  })
                const blockIndex = nonBackgroundBlocks.findIndex(b => b.id === block.id)
                
                // Вычисляем Y позицию на основе предыдущих блоков
                let y = 20
                for (let i = 0; i < blockIndex; i++) {
                  const prevBlock = nonBackgroundBlocks[i]
                  const prevHeight = prevBlock.type === 'story' 
                    ? (prevBlock.size?.height || 200) + 30  // Story блоки расширяются
                    : (prevBlock.size?.height || 200)
                  // Используем индивидуальный отступ блока или значение по умолчанию
                  const prevMarginBottom = prevBlock.marginBottom ?? blockSpacing
                  y += prevHeight + prevMarginBottom
                }
                
                // Для story блока - высота автоматическая (с учетом content)
                const isStoryBlock = block.type === 'story'
                const blockWidth = block.size?.width || 760
                const blockHeight = block.size?.height || 200
                const currentHeight = isStoryBlock ? 'auto' : `${blockHeight}px`
                const minHeight = isStoryBlock ? `${blockHeight}px` : undefined
                
                return (
                  <div
                    key={block.id}
                    className="absolute"
                    style={{
                      left: '20px',
                      top: `${y}px`,
                      width: `${blockWidth}px`,
                      height: currentHeight,
                      minHeight: minHeight,
                      zIndex: localSelectedBlock === block.id ? 1000 : 10
                    }}
                  >
                    {renderBlock(block)}
                  </div>
                )
              })}

            {/* Selection Overlay */}
            {localSelectedBlock && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border-2 border-blue-500 border-dashed opacity-50" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
