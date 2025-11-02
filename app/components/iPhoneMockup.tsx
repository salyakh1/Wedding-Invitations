'use client'

import { Invitation } from '../../types'
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

interface iPhoneMockupProps {
  invitation: Invitation | null
}

export default function iPhoneMockup({ invitation }: iPhoneMockupProps) {
  const renderBlock = (block: any) => {
    const commonProps = {
      block,
      isSelected: false,
      onUpdate: () => {},
      onMouseDown: () => {},
      invitation, // Передаем настройки приглашения
      isPreview: true
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
            <span className="text-gray-400 text-2xl">📱</span>
          </div>
          <p className="text-gray-500">Выберите приглашение для просмотра</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* iPhone 16 Pro Max Frame */}
      <div className="relative">
        {/* iPhone Body */}
        <div 
          className="relative bg-black rounded-[3rem] p-2 shadow-2xl"
          style={{
            width: '320px',
            height: '680px'
          }}
        >
          {/* Screen */}
          <div 
            className="relative bg-black rounded-[2.5rem] overflow-hidden"
            style={{
              width: '312px',
              height: '672px'
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20"></div>
            
            {/* Screen Content */}
            <div 
              className="relative w-full h-full overflow-auto"
              style={{
                backgroundImage: invitation.backgroundImage ? `url(${invitation.backgroundImage})` : undefined,
                backgroundColor: invitation.backgroundColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                fontFamily: invitation.fontFamily,
                fontSize: `${Math.max(12, invitation.fontSize * 0.6)}px`
              }}
            >
              {/* Background Music Player */}
              {invitation.backgroundMusic && (
                <div className="absolute top-12 right-4 z-10">
                  <audio controls loop className="w-24">
                    <source src={invitation.backgroundMusic} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Render Blocks - Mobile Optimized */}
              {invitation.blocks
                .sort((a, b) => {
                  if (a.type === 'background') return -1
                  if (b.type === 'background') return 1
                  return 0
                })
                .map((block, index) => {
                  // Для background блока - просто рендерим компонент
                  if (block.type === 'background') {
                    return (
                      <div
                        key={block.id}
                        className="absolute inset-0"
                        style={{
                          opacity: block.opacity !== undefined ? block.opacity : 1,
                          zIndex: 1
                        }}
                      >
                        {renderBlock(block)}
                      </div>
                    )
                  }
                  
                  // Для остальных блоков - вертикальное позиционирование для мобильных
                  const blockSpacing = 15
                  // Сортируем блоки без background по position.y (порядок добавления)
                  const nonBackgroundBlocks = invitation.blocks
                    .filter(b => b.type !== 'background')
                    .sort((a, b) => {
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
                      ? (prevBlock.size?.height || 120) + 15
                      : (prevBlock.size?.height || 120)
                    y += Math.max(prevHeight * 0.6, 80) + blockSpacing // Масштабируем для мобильных
                  }
                  
                  // Используем размеры из блока (масштабируем для мобильных)
                  const isStoryBlock = block.type === 'story'
                  const blockWidth = block.size?.width || 760
                  const blockHeight = block.size?.height || 120
                  // На мобильных используем фиксированную ширину, но масштабируем высоту
                  const mobileWidth = '292px'
                  const scaledHeight = Math.max(blockHeight * 0.6, 80) // Масштабируем высоту для мобильных
                  const currentHeight = isStoryBlock ? 'auto' : `${scaledHeight}px`
                  const minHeight = isStoryBlock ? '120px' : `${scaledHeight}px`
                  
                  return (
                    <div
                      key={block.id}
                      className="absolute"
                      style={{
                        left: '10px',
                        top: `${y}px`,
                        width: mobileWidth,
                        height: currentHeight,
                        minHeight: minHeight,
                        opacity: block.opacity !== undefined ? block.opacity : 1,
                        zIndex: 10
                      }}
                    >
                      {renderBlock(block)}
                    </div>
                  )
                })}
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-30"></div>
        </div>
      </div>
      
      {/* Device Label */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">iPhone 16 Pro Max</h3>
        <p className="text-sm text-gray-500">Мобильный просмотр</p>
      </div>
    </div>
  )
}
