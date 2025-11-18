'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Invitation, Wish } from '../../../types'
import BackgroundBlock from '../../components/blocks/BackgroundBlock'
import NamesBlock from '../../components/blocks/NamesBlock'
import TextBlock from '../../components/blocks/TextBlock'
import VideoBlock from '../../components/blocks/VideoBlock'
import MapBlock from '../../components/blocks/MapBlock'
import StoryBlock from '../../components/blocks/StoryBlock'
import WishesBlock from '../../components/blocks/WishesBlock'
import WishesSliderBlock from '../../components/blocks/WishesSliderBlock'
import CountdownBlock from '../../components/blocks/CountdownBlock'
import WeddingDateBlock from '../../components/blocks/WeddingDateBlock'
import DressCodeBlock from '../../components/blocks/DressCodeBlock'
import GuestsBlock from '../../components/blocks/GuestsBlock'
import AnimatedBlock from '../../components/AnimatedBlock'
import ParticleEffects from '../../components/ParticleEffects'
import RomanticParticles from '../../components/RomanticParticles'
import RoseOpeningAnimation from '../../components/RoseOpeningAnimation'

export default function InvitationViewPage() {
  const params = useParams()
  const invitationId = params.id as string
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileWidth, setMobileWidth] = useState(360) // Дефолтная ширина для SSR
  const [scrollY, setScrollY] = useState(0)
  const [showInvitation, setShowInvitation] = useState(false)

  useEffect(() => {
    if (invitationId) {
      loadInvitation()
      loadWishes()
    }
  }, [invitationId])

  // Отслеживание прокрутки для эффектов
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Получаем ширину экрана для мобильной версии
  useEffect(() => {
    const updateWidth = () => {
      setMobileWidth(window.innerWidth)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Если анимация роз не включена, сразу показываем приглашение
  useEffect(() => {
    if (invitation) {
      if (!invitation.effects?.roseOpeningAnimation) {
        setShowInvitation(true)
      }
      // Логируем для отладки
      console.log('Invitation loaded:', {
        id: invitation.id,
        title: invitation.title,
        blocksCount: invitation.blocks?.length || 0,
        blocks: invitation.blocks,
        hasRoseAnimation: invitation.effects?.roseOpeningAnimation,
        showInvitation: !invitation.effects?.roseOpeningAnimation
      })
    }
  }, [invitation])

  const loadInvitation = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        setError(`Ошибка загрузки: ${error.message}`)
        throw error
      }
      
      if (!data) {
        setError('Приглашение не найдено')
        return
      }
      
      // КРИТИЧЕСКАЯ ПРОВЕРКА: парсим blocks если это JSON строка
      let parsedBlocks = data.blocks
      
      // Если blocks это строка, пытаемся распарсить
      if (typeof parsedBlocks === 'string') {
        try {
          parsedBlocks = JSON.parse(parsedBlocks)
          console.log('✅ Parsed blocks from JSON string')
        } catch (e) {
          console.error('❌ Failed to parse blocks JSON string:', e)
          parsedBlocks = []
        }
      }
      
      // Если blocks это null или undefined, используем пустой массив
      if (!parsedBlocks) {
        console.warn('⚠️ Blocks is null/undefined, using empty array')
        parsedBlocks = []
      }
      
      // Убеждаемся, что blocks это массив
      if (!Array.isArray(parsedBlocks)) {
        console.error('❌ Blocks is not an array after parsing:', typeof parsedBlocks, parsedBlocks)
        parsedBlocks = []
      }
      
      // Маппим данные из snake_case в camelCase
      const mappedInvitation = {
        id: data.id,
        title: data.title,
        backgroundImage: data.background_image,
        backgroundColor: data.background_color,
        backgroundMusic: data.background_music,
        fontFamily: data.font_family,
        fontSize: data.font_size,
        blocks: parsedBlocks,
        animations: data.animations || undefined,
        effects: data.effects || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      console.log('=== LOADED INVITATION DATA ===')
      console.log('Raw data from Supabase:', data)
      console.log('Raw blocks type:', typeof data.blocks)
      console.log('Raw blocks value:', data.blocks)
      console.log('Parsed blocks:', parsedBlocks)
      console.log('Parsed blocks type:', typeof parsedBlocks)
      console.log('Parsed blocks is array:', Array.isArray(parsedBlocks))
      console.log('Mapped invitation:', mappedInvitation)
      console.log('Blocks count:', mappedInvitation.blocks?.length || 0)
      console.log('Blocks content:', JSON.stringify(mappedInvitation.blocks, null, 2))
      console.log('Has animations column:', 'animations' in data)
      console.log('Has effects column:', 'effects' in data)
      console.log('Animations value:', data.animations)
      console.log('Effects value:', data.effects)
      
      // Убеждаемся, что все блоки имеют правильную структуру
      if (Array.isArray(mappedInvitation.blocks)) {
        mappedInvitation.blocks = mappedInvitation.blocks.map((block: any) => {
          // Если блок это строка, пытаемся распарсить
          if (typeof block === 'string') {
            try {
              block = JSON.parse(block)
            } catch (e) {
              console.error('Failed to parse block JSON:', e)
              return null
            }
          }
          // Проверяем, что блок имеет обязательные поля
          if (!block || !block.type || !block.id) {
            console.warn('⚠️ Invalid block structure:', block)
            return null
          }
          return block
        }).filter((block: any) => block !== null)
      }
      
      console.log('Final blocks after processing:', mappedInvitation.blocks)
      console.log('Blocks count after processing:', mappedInvitation.blocks?.length || 0)
      
      // КРИТИЧЕСКАЯ ПРОВЕРКА: если блоков нет, выводим предупреждение
      if (!mappedInvitation.blocks || mappedInvitation.blocks.length === 0) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Блоки не загружены или пусты!')
        console.error('Invitation ID:', data.id)
        console.error('Invitation title:', data.title)
        console.error('Raw blocks from DB:', data.blocks)
        console.error('Raw blocks type:', typeof data.blocks)
        console.error('Raw blocks is array:', Array.isArray(data.blocks))
      } else {
        console.log('✅ Блоки успешно загружены:', mappedInvitation.blocks.length, 'блоков')
        console.log('Типы блоков:', mappedInvitation.blocks.map((b: any) => b.type))
        console.log('Block IDs:', mappedInvitation.blocks.map((b: any) => b.id))
      }
      
      setInvitation(mappedInvitation)
    } catch (error) {
      console.error('Error loading invitation:', error)
      setError('Не удалось загрузить приглашение. Проверьте ссылку.')
    } finally {
      setLoading(false)
    }
  }

  const loadWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Маппим данные из базы (snake_case) в нужный формат
      const mappedWishes = (data || []).map((wish: any) => ({
        id: wish.id,
        invitationId: wish.invitation_id,
        name: wish.name,
        message: wish.message,
        createdAt: wish.created_at
      }))
      
      setWishes(mappedWishes)
    } catch (error) {
      console.error('Error loading wishes:', error)
    }
  }

  const addWish = async (name: string, message: string) => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert([{
          invitation_id: invitationId,
          name: name.trim(),
          message: message.trim()
        }])
        .select()
        .single()

      if (error) throw error
      
      // Маппим данные из базы в нужный формат
      const mappedWish = {
        id: data.id,
        invitationId: data.invitation_id,
        name: data.name,
        message: data.message,
        createdAt: data.created_at
      }
      
      setWishes(prev => [mappedWish, ...prev])
    } catch (error) {
      console.error('Error adding wish:', error)
      throw error
    }
  }

  const renderBlock = (block: any) => {
    const commonProps = {
      block,
      isSelected: false,
      onUpdate: () => {},
      onMouseDown: () => {},
      invitation, // Передаем настройки приглашения
      isPreview: true // Скрываем метки и кнопки редактирования в режиме просмотра
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
        return <WishesBlock {...commonProps} invitationId={invitationId} onAddWish={addWish} />
      case 'wishes-slider':
        return <WishesSliderBlock {...commonProps} wishes={wishes} />
      case 'countdown':
        return <CountdownBlock {...commonProps} />
      case 'wedding-date':
        return <WeddingDateBlock {...commonProps} />
      case 'dress-code':
        return <DressCodeBlock {...commonProps} />
      case 'guests':
        return <GuestsBlock {...commonProps} />
      default:
        console.warn('Unknown block type:', block.type)
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка приглашения...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">💒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Приглашение не найдено'}
          </h1>
          <p className="text-gray-600">
            {error 
              ? 'Проверьте правильность ссылки или попробуйте позже.'
              : 'Возможно, ссылка неверна или приглашение было удалено.'}
          </p>
        </div>
      </div>
    )
  }

  // Вычисляем эффекты для фона (с проверкой на null/undefined)
  const effects = invitation?.effects || {}
  const animations = invitation?.animations || {}
  const parallaxOffset = effects.parallax ? scrollY * 0.5 : 0
  const blurAmount = effects.blurOnScroll ? Math.min(scrollY / 20, 10) : 0
  const gradientRotation = effects.gradientAnimation ? (scrollY / 10) % 360 : 0

  // Если анимация роз включена и приглашение еще не показано, показываем анимацию
  const showRoseAnimation = effects.roseOpeningAnimation && !showInvitation

  // Находим блок фона (если есть)
  const backgroundBlock = invitation?.blocks?.find(b => b.type === 'background')
  
  // Определяем фон: приоритет у блока фона, затем настройки приглашения
  // Проверяем на пустую строку и null/undefined
  const backgroundImage = (backgroundBlock?.data?.image && backgroundBlock.data.image.trim() !== '') 
    ? backgroundBlock.data.image 
    : (invitation?.backgroundImage && invitation.backgroundImage.trim() !== '') 
      ? invitation.backgroundImage 
      : undefined
  const backgroundColor = (backgroundBlock?.data?.color && backgroundBlock.data.color.trim() !== '') 
    ? backgroundBlock.data.color 
    : (invitation?.backgroundColor && invitation.backgroundColor.trim() !== '') 
      ? invitation.backgroundColor 
      : '#ffffff'

  return (
    <div className="min-h-screen relative">
      {/* Background Layer - Full Screen (Desktop & Mobile) - ФИКСИРОВАННЫЙ */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          ...(effects.gradientAnimation && backgroundColor
            ? {
                background: `linear-gradient(${gradientRotation}deg, ${backgroundColor} 0%, ${backgroundColor}dd 50%, ${backgroundColor} 100%)${backgroundImage ? `, url(${backgroundImage})` : ''}`,
                backgroundSize: 'cover',
                backgroundPosition: effects.parallax ? `center ${50 + parallaxOffset}px` : 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                // Для мобильных устройств, где background-attachment: fixed не работает
                WebkitBackgroundAttachment: 'fixed',
                MozBackgroundAttachment: 'fixed'
              }
            : {
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundColor: backgroundColor,
                backgroundSize: 'cover',
                backgroundPosition: effects.parallax ? `center ${50 + parallaxOffset}px` : 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                // Для мобильных устройств, где background-attachment: fixed не работает
                WebkitBackgroundAttachment: 'fixed',
                MozBackgroundAttachment: 'fixed'
              }),
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
          // Убеждаемся, что фон не прокручивается
          willChange: 'transform',
          transform: 'translateZ(0)' // Аппаратное ускорение для фиксации
        }}
      />

      {/* Rose Opening Animation */}
      {showRoseAnimation && (
        <RoseOpeningAnimation
          enabled={true}
          onComplete={() => setShowInvitation(true)}
        />
      )}

      {/* Particle Effects */}
      {effects.particles && showInvitation && <ParticleEffects enabled={true} />}
      
      {/* Romantic Particles */}
      {effects.romanticParticles && showInvitation && <RomanticParticles enabled={true} />}

      {/* Header - только для десктопа */}
      {showInvitation && (
        <header className="hidden md:block bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 font-playfair">
              {invitation.title}
            </h1>
          </div>
        </header>
      )}

      {/* Invitation Content */}
      {showInvitation && (
      <div className="max-w-4xl mx-auto md:p-4 relative z-10" style={{ backgroundColor: 'transparent' }}>
        {/* Desktop View */}
        <div className="hidden md:block">
          <div
            className="relative mx-auto shadow-lg rounded-lg overflow-hidden"
            style={{
              width: '800px',
              minHeight: '600px',
              height: 'auto',
              fontFamily: invitation.fontFamily,
              fontSize: `${invitation.fontSize}px`,
              backgroundColor: 'transparent' // Фон уже применен на главном контейнере
            }}
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

            {/* Render Blocks */}
            {(() => {
              const nonBackgroundBlocks = invitation.blocks && Array.isArray(invitation.blocks) 
                ? invitation.blocks.filter(b => b.type !== 'background')
                : []
              
              console.log('Rendering blocks - total:', invitation.blocks?.length || 0)
              console.log('Non-background blocks:', nonBackgroundBlocks.length)
              
              if (nonBackgroundBlocks.length === 0) {
                console.warn('⚠️ Нет блоков для отображения (после фильтрации background)')
                return (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <p className="text-gray-500 text-lg">Приглашение пока пустое</p>
                      <p className="text-gray-400 text-sm mt-2">Добавьте блоки в конструкторе</p>
                    </div>
                  </div>
                )
              }
              
              return nonBackgroundBlocks
                .sort((a, b) => {
                  const aY = a.position?.y || 0
                  const bY = b.position?.y || 0
                  return aY - bY
                })
                .map((block, index) => {

                if (
                  block.type === 'story' &&
                  ((!block.data?.items || block.data.items.length === 0) && !block.data?.title)
                ) {
                  return null
                }
                
                // Для остальных блоков - вертикальное позиционирование
                const blockSpacing = 30
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
                    ? (prevBlock.size?.height || 200) + 30
                    : (prevBlock.size?.height || 200)
                  // Используем индивидуальный отступ блока или значение по умолчанию
                  const prevMarginBottom = prevBlock.marginBottom ?? blockSpacing
                  y += prevHeight + prevMarginBottom
                }
                
                // Используем размеры из блока
                const isStoryBlock = block.type === 'story'
                const blockWidth = block.size?.width || 760
                const blockHeight = block.size?.height || 200
                const currentHeight = isStoryBlock ? 'auto' : `${blockHeight}px`
                const minHeight = isStoryBlock ? `${blockHeight}px` : undefined
                
                const animatedBlockIndex = nonBackgroundBlocks.findIndex(b => b.id === block.id)
                return (
                  <AnimatedBlock
                    key={block.id}
                    index={animatedBlockIndex}
                    animations={animations}
                  >
                    <div
                      className="absolute"
                      style={{
                        left: '20px',
                        top: `${y}px`,
                        width: `${blockWidth}px`,
                        height: currentHeight,
                        minHeight: minHeight,
                        zIndex: 10,
                        pointerEvents: 'auto'
                      }}
                    >
                      {renderBlock(block)}
                    </div>
                  </AnimatedBlock>
                )
              })
            })()}
          </div>
        </div>

        {/* Mobile View - Scrollable */}
        <div className="md:hidden relative z-10">
          {/* Background уже применен на главном контейнере, здесь не нужен дубликат */}

          {/* Scrollable Content */}
          <div
            className="relative w-full min-h-screen"
            style={{
              fontFamily: invitation.fontFamily,
              fontSize: `${Math.max(14, invitation.fontSize * 0.8)}px`,
              backgroundColor: 'transparent',
              position: 'relative',
              zIndex: 10
            }}
          >
            {/* Background Music Player */}
            {invitation.backgroundMusic && (
              <div className="sticky top-2 right-2 z-50 flex justify-end p-2">
                <audio controls loop className="w-32 bg-white/80 rounded-lg">
                  <source src={invitation.backgroundMusic} type="audio/mpeg" />
                  Ваш браузер не поддерживает аудио элемент.
                </audio>
              </div>
            )}

            {/* Title for Mobile */}
            <div className="px-4 pt-4 pb-2">
              <h1 className="text-2xl font-bold text-center text-gray-900" style={{ fontFamily: invitation.fontFamily }}>
                {invitation.title}
              </h1>
            </div>

            {/* Render Blocks - Mobile Optimized with Normal Flow */}
            <div className="relative w-full pb-8" style={{ display: 'flex', flexDirection: 'column' }}>
              {invitation.blocks && Array.isArray(invitation.blocks) && invitation.blocks.length > 0 ? (
                invitation.blocks
                .filter(b => b.type !== 'background')
                .sort((a, b) => {
                  const aY = a.position?.y || 0
                  const bY = b.position?.y || 0
                  return aY - bY
                })
                .map((block, index) => {
                  
                  if (
                    block.type === 'story' &&
                    ((!block.data?.items || block.data.items.length === 0) && !block.data?.title)
                  ) {
                    return null
                  }
                  
                  // Используем размеры из блока с сохранением пропорций
                  const isStoryBlock = block.type === 'story'
                  const needsFixedHeight = block.type === 'video' || block.type === 'map' || block.type === 'countdown'
                  
                  // Для большинства блоков используем auto высоту, чтобы содержимое не обрезалось
                  // Для видео, карты и обратного отсчета - пропорциональная высота
                  let mobileHeight = 'auto'
                  let minHeight = '120px'
                  
                  if (needsFixedHeight) {
                    const originalWidth = block.size?.width || 760
                    const originalHeight = block.size?.height || 200
                    const blockMobileWidth = mobileWidth - 16
                    const aspectRatio = originalHeight / originalWidth
                    const proportionalHeight = blockMobileWidth * aspectRatio
                    mobileHeight = `${Math.max(proportionalHeight, 120)}px`
                    minHeight = `${Math.max(proportionalHeight, 120)}px`
                  } else if (isStoryBlock) {
                    // Story блок всегда auto
                    mobileHeight = 'auto'
                    minHeight = '150px'
                  } else {
                    // Для текстовых блоков используем минимальную высоту, но позволяем расширяться
                    const originalHeight = block.size?.height || 200
                    minHeight = `${Math.max(originalHeight * 0.7, 120)}px`
                  }
                  
                  // Минимальный отступ для мобильной версии увеличен для предотвращения наложения
                  const defaultMobileMargin = 32
                  // Для Story блоков добавляем дополнительный отступ, так как они могут расширяться
                  const additionalStoryMargin = isStoryBlock ? 16 : 0
                  const finalMarginBottom = (block.marginBottom ?? defaultMobileMargin) + additionalStoryMargin
                  
                  const blockIndex = invitation.blocks
                    .filter(b => b.type !== 'background')
                    .sort((a, b) => {
                      const aY = a.position?.y || 0
                      const bY = b.position?.y || 0
                      return aY - bY
                    })
                    .findIndex(b => b.id === block.id)

                  return (
                    <AnimatedBlock
                      key={block.id}
                      index={blockIndex}
                      animations={animations}
                    >
                      <div
                        className="relative mx-2 block"
                        style={{
                          width: 'calc(100% - 16px)',
                          height: mobileHeight,
                          minHeight: minHeight,
                          marginBottom: `${finalMarginBottom}px`,
                          clear: 'both',
                          display: 'block',
                          zIndex: 10
                        }}
                      >
                        {renderBlock(block)}
                      </div>
                    </AnimatedBlock>
                  )
                })
              ) : (
                <div className="flex items-center justify-center min-h-[400px] px-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">Приглашение пока пустое</p>
                    <p className="text-gray-400 text-sm mt-2">Добавьте блоки в конструкторе</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
