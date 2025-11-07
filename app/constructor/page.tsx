'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { Invitation, InvitationBlock } from '../../types'
import ConstructorPanel from '../components/ConstructorPanel'
import InvitationCanvas from '../components/InvitationCanvas'
import SettingsPanel from '../components/SettingsPanel'
import BlockSettingsPanel from '../components/BlockSettingsPanel'
import PhoneMockup from '../components/iPhoneMockup'
import { LogOut, Save, Eye, Plus, Smartphone, Settings, ChevronDown, FileText, Trash2 } from 'lucide-react'

export default function ConstructorPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [selectedBlock, setSelectedBlock] = useState<InvitationBlock | null>(null)
  const [showInvitationsList, setShowInvitationsList] = useState(false)

  // Функция загрузки приглашений
  const loadInvitations = useCallback(async () => {
    try {
      if (!user) {
        console.log('No user found, skipping load invitations')
        setLoading(false)
        return
      }

      console.log('Loading invitations for user:', user.id)
      
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error loading invitations:', error)
        alert(`Ошибка загрузки приглашений: ${error.message}`)
        setLoading(false)
        return
      }
      
      console.log('Loaded invitations:', data)
      
      // Маппим данные из snake_case в camelCase
      const mappedInvitations = (data || []).map((invitation: any) => ({
        id: invitation.id,
        title: invitation.title,
        backgroundImage: invitation.background_image,
        backgroundColor: invitation.background_color,
        backgroundMusic: invitation.background_music,
        fontFamily: invitation.font_family,
        fontSize: invitation.font_size,
        blocks: invitation.blocks || [],
        createdAt: invitation.created_at,
        updatedAt: invitation.updated_at
      }))
      
      setInvitations(mappedInvitations)
      
      // Если есть приглашения, выбираем первое (только если текущее не выбрано)
      setCurrentInvitation(prev => {
        if (prev) return prev
        return mappedInvitations.length > 0 ? mappedInvitations[0] : null
      })
    } catch (error) {
      console.error('Error loading invitations:', error)
      alert(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Защита: редирект если user == null
  useEffect(() => {
    if (user === null) {
      router.push('/')
      return
    }
  }, [user, router])

  // Загрузка приглашений только если user существует
  useEffect(() => {
    if (user) {
      loadInvitations()
    } else {
      setLoading(false)
    }
  }, [user, loadInvitations])

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.invitations-dropdown')) {
        setShowInvitationsList(false)
      }
    }
    
    if (showInvitationsList) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInvitationsList])

  const createNewInvitation = async () => {
    try {
      if (!user) {
        alert('Пользователь не аутентифицирован. Войдите в систему.')
        return
      }

      console.log('Creating new invitation for user:', user.id)
      console.log('User object:', user)
      console.log('Auth status:', await supabase.auth.getSession())

      const newInvitation: Omit<Invitation, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Новое приглашение',
        backgroundImage: '',
        backgroundColor: '#667eea',
        backgroundMusic: '',
        fontFamily: 'Montserrat',
        fontSize: 16,
        blocks: []
      }

      const { data, error } = await supabase
        .from('invitations')
        .insert([{ 
          title: newInvitation.title,
          background_image: newInvitation.backgroundImage,
          background_color: newInvitation.backgroundColor,
          background_music: newInvitation.backgroundMusic,
          font_family: newInvitation.fontFamily,
          font_size: newInvitation.fontSize,
          blocks: newInvitation.blocks,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        alert(`Ошибка создания приглашения: ${error.message}`)
        return
      }
      
      console.log('Invitation created successfully:', data)
      
      // Маппим данные из snake_case в camelCase
      const mappedInvitation = {
        id: data.id,
        title: data.title,
        backgroundImage: data.background_image,
        backgroundColor: data.background_color,
        backgroundMusic: data.background_music,
        fontFamily: data.font_family,
        fontSize: data.font_size,
        blocks: data.blocks,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      setCurrentInvitation(mappedInvitation)
      setInvitations(prev => [mappedInvitation, ...prev])
      setShowInvitationsList(false)
    } catch (error) {
      console.error('Error creating invitation:', error)
      alert(`Ошибка: ${error}`)
    }
  }

  const saveInvitation = async () => {
    if (!currentInvitation) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('invitations')
        .update({
          title: currentInvitation.title,
          background_image: currentInvitation.backgroundImage,
          background_color: currentInvitation.backgroundColor,
          background_music: currentInvitation.backgroundMusic,
          font_family: currentInvitation.fontFamily,
          font_size: currentInvitation.fontSize,
          blocks: currentInvitation.blocks
        })
        .eq('id', currentInvitation.id)

      if (error) throw error
      
      setInvitations(prev => 
        prev.map(inv => inv.id === currentInvitation.id ? currentInvitation : inv)
      )
    } catch (error) {
      console.error('Error saving invitation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const viewInvitation = () => {
    if (currentInvitation) {
      window.open(`/invitation/${currentInvitation.id}`, '_blank')
    }
  }

  const handleBlockSelect = (block: InvitationBlock | null) => {
    setSelectedBlock(block)
  }

  const handleBlockUpdate = (updates: Partial<InvitationBlock>) => {
    if (!currentInvitation || !selectedBlock) return
    
    const updatedBlocks = currentInvitation.blocks.map(block => 
      block.id === selectedBlock.id ? { ...block, ...updates } : block
    )
    
    setCurrentInvitation({
      ...currentInvitation,
      blocks: updatedBlocks
    })
    
    setSelectedBlock({ ...selectedBlock, ...updates })
  }

  const selectInvitation = (invitation: Invitation) => {
    setCurrentInvitation(invitation)
    setShowInvitationsList(false)
    setSelectedBlock(null)
  }

  const deleteInvitation = async (invitationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Предотвращаем выбор приглашения при клике на кнопку удаления
    
    if (!confirm('Вы уверены, что хотите удалить это приглашение? Это действие нельзя отменить.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId)

      if (error) throw error

      // Удаляем из локального состояния
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      
      // Если удаляемое приглашение было текущим, выбираем первое из списка или null
      if (currentInvitation?.id === invitationId) {
        const remainingInvitations = invitations.filter(inv => inv.id !== invitationId)
        setCurrentInvitation(remainingInvitations.length > 0 ? remainingInvitations[0] : null)
      }
    } catch (error) {
      console.error('Error deleting invitation:', error)
      alert(`Ошибка при удалении приглашения: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Защита: не рендерим контент если user == null
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Wedding Invitations</h1>
              
              {/* Invitations Dropdown */}
              <div className="relative invitations-dropdown">
                <button
                  onClick={() => setShowInvitationsList(!showInvitationsList)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="max-w-[200px] truncate">
                    {currentInvitation ? currentInvitation.title : 'Выберите приглашение'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showInvitationsList && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Мои приглашения ({invitations.length})
                      </div>
                      {invitations.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">
                          Нет приглашений. Создайте новое!
                        </div>
                      ) : (
                        invitations.map((inv) => (
                          <div
                            key={inv.id}
                            className={`group relative w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                              currentInvitation?.id === inv.id ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                          >
                            <button
                              onClick={() => selectInvitation(inv)}
                              className="w-full text-left"
                            >
                              <div className="font-medium text-sm text-gray-900 truncate pr-8">
                                {inv.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(inv.createdAt).toLocaleDateString('ru-RU')} • {inv.blocks.length} блоков
                              </div>
                            </button>
                            <button
                              onClick={(e) => deleteInvitation(inv.id, e)}
                              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Удалить приглашение"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={createNewInvitation}
                  className="flex items-center space-x-2 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Новое</span>
                </button>
                <button
                  onClick={saveInvitation}
                  disabled={saving}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
                </button>
                <button
                  onClick={viewInvitation}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Просмотр</span>
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    viewMode === 'mobile'
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {viewMode === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                  <span>{viewMode === 'mobile' ? 'Mobile' : 'Desktop'}</span>
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    showSettings 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Настройки</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Blocks */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <ConstructorPanel
            invitation={currentInvitation}
            onUpdateInvitation={setCurrentInvitation}
          />
        </div>

        {/* Center - Canvas or Mobile Preview */}
        <div className="flex-1 bg-gray-50 p-4">
          {viewMode === 'desktop' ? (
            <InvitationCanvas
              invitation={currentInvitation}
              onUpdateInvitation={setCurrentInvitation}
              selectedBlock={selectedBlock}
              onBlockSelect={handleBlockSelect}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Мобильный просмотр</h3>
                <p className="text-sm text-gray-500 mb-6">Как выглядит приглашение на iPhone 16 Pro Max</p>
                <PhoneMockup invitation={currentInvitation} />
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Settings */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="border-b p-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                showSettings
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showSettings ? 'Настройки блоков' : 'Настройки приглашения'}
            </button>
          </div>
          
          {showSettings ? (
            <BlockSettingsPanel
              invitation={currentInvitation}
              selectedBlock={selectedBlock}
              onUpdateInvitation={setCurrentInvitation}
              onUpdateBlock={handleBlockUpdate}
            />
          ) : (
            <SettingsPanel
              invitation={currentInvitation}
              onUpdateInvitation={setCurrentInvitation}
            />
          )}
        </div>
      </div>
    </div>
  )
}
