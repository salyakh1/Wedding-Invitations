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

export default function InvitationViewPage() {
  const params = useParams()
  const invitationId = params.id as string
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (invitationId) {
      loadInvitation()
      loadWishes()
    }
  }, [invitationId])

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
      
      // Маппим данные из snake_case в camelCase
      const mappedInvitation = {
        id: data.id,
        title: data.title,
        backgroundImage: data.background_image,
        backgroundColor: data.background_color,
        backgroundMusic: data.background_music,
        fontFamily: data.font_family,
        fontSize: data.font_size,
        blocks: data.blocks || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      console.log('=== LOADED INVITATION DATA ===')
      console.log('Raw data from Supabase:', data)
      console.log('Mapped invitation:', mappedInvitation)
      console.log('Blocks from database:', data.blocks)
      console.log('Blocks type:', typeof data.blocks)
      console.log('Blocks is array:', Array.isArray(data.blocks))
      console.log('Blocks count:', mappedInvitation.blocks?.length || 0)
      console.log('Blocks content:', JSON.stringify(mappedInvitation.blocks, null, 2))
      
      // Проверяем, что blocks - это массив
      if (!Array.isArray(mappedInvitation.blocks)) {
        console.error('ERROR: blocks is not an array!', mappedInvitation.blocks)
        mappedInvitation.blocks = []
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - только для десктопа */}
      <header className="hidden md:block bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 font-playfair">
            {invitation.title}
          </h1>
        </div>
      </header>

      {/* Invitation Content */}
      <div className="max-w-4xl mx-auto md:p-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div
            className="relative mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: '800px',
              minHeight: '600px',
              height: 'auto',
              fontFamily: invitation.fontFamily,
              fontSize: `${invitation.fontSize}px`,
              backgroundImage: invitation.backgroundImage ? `url(${invitation.backgroundImage})` : undefined,
              backgroundColor: invitation.backgroundColor,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
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
                  y += prevHeight + blockSpacing
                }
                
                // Используем размеры из блока
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
                      opacity: block.opacity !== undefined ? block.opacity : 1,
                      zIndex: 10,
                      pointerEvents: 'auto'
                    }}
                  >
                    {renderBlock(block)}
                  </div>
                )
              })}
          </div>
        </div>

        {/* Mobile View - Scrollable */}
        <div className="md:hidden">
          {/* Fixed Background Layer */}
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: invitation.backgroundImage ? `url(${invitation.backgroundImage})` : undefined,
              backgroundColor: invitation.backgroundColor,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Background Block Overlay */}
          {invitation.blocks
            .filter(b => b.type === 'background')
            .map((block) => (
              <div
                key={block.id}
                className="fixed inset-0 -z-10"
                style={{
                  opacity: block.opacity !== undefined ? block.opacity : 1,
                  backgroundImage: block.data?.image ? `url(${block.data.image})` : undefined,
                  backgroundColor: block.data?.color || 'transparent',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            ))}

          {/* Scrollable Content */}
          <div
            className="relative w-full min-h-screen"
            style={{
              fontFamily: invitation.fontFamily,
              fontSize: `${Math.max(14, invitation.fontSize * 0.8)}px`
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
            <div className="relative w-full pb-8">
              {invitation.blocks
                .filter(b => b.type !== 'background')
                .sort((a, b) => {
                  const aY = a.position?.y || 0
                  const bY = b.position?.y || 0
                  return aY - bY
                })
                .map((block, index) => {
                  
                  // Используем размеры из блока (на мобильных адаптируем)
                  const isStoryBlock = block.type === 'story'
                  const blockHeight = block.size?.height || 150
                  const mobileHeight = isStoryBlock ? 'auto' : `${Math.max(blockHeight * 0.8, 120)}px`
                  const minHeight = isStoryBlock ? `${Math.max(blockHeight * 0.8, 120)}px` : undefined
                  
                  return (
                    <div
                      key={block.id}
                      className="relative mx-2 mb-4"
                      style={{
                        width: 'calc(100% - 16px)',
                        height: mobileHeight,
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
        </div>
      </div>
    </div>
  )
}
