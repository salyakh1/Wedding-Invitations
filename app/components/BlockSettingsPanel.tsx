'use client'

import { useState } from 'react'
import { Invitation, InvitationBlock } from '../../types'
import { Settings, Layers, Edit, Circle, Square, Upload, Trash2, Plus, Type, Image, Heart, ArrowUp, ArrowDown } from 'lucide-react'
import { uploadVideoToStorage } from '../../lib/storage'

interface BlockSettingsPanelProps {
  invitation: Invitation | null
  selectedBlock: InvitationBlock | null
  onUpdateInvitation: (invitation: Invitation) => void
  onUpdateBlock: (updates: Partial<InvitationBlock>) => void
}

export default function BlockSettingsPanel({ 
  invitation, 
  selectedBlock, 
  onUpdateInvitation, 
  onUpdateBlock 
}: BlockSettingsPanelProps) {
  const [settingsMode, setSettingsMode] = useState<'all' | 'selected'>('all')
  const [uploadingVideo, setUploadingVideo] = useState(false)

  if (!invitation) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Выберите приглашение</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Settings className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Настройки блоков</h2>
        </div>
        <p className="text-sm text-gray-600">Управление настройками блоков</p>
      </div>

      {/* Mode Switcher */}
      <div className="mb-6 bg-gray-100 rounded-lg p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setSettingsMode('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              settingsMode === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Все блоки</span>
            </div>
          </button>
          <button
            onClick={() => setSettingsMode('selected')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              settingsMode === 'selected'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Выбранный</span>
            </div>
          </button>
        </div>
      </div>

      {/* Settings Content */}
      {settingsMode === 'all' ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Настройки всех блоков</h3>
            <p className="text-xs text-gray-600">
              Изменения будут применены ко всем блокам
            </p>
          </div>
          
          {/* Global Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Прозрачность блоков
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={invitation.blocks[0]?.opacity || 1}
                  onChange={(e) => {
                    const opacity = parseFloat(e.target.value)
                    const updatedBlocks = invitation.blocks.map(block => ({
                      ...block,
                      opacity
                    }))
                    onUpdateInvitation({ ...invitation, blocks: updatedBlocks })
                  }}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Прозрачный</span>
                  <span>Непрозрачный</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedBlock ? (
            <div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border-2 border-green-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Настройки: {selectedBlock.type}
                </h3>
                <p className="text-xs text-gray-600">
                  Редактируйте выбранный блок
                </p>
              </div>

              {/* Block-specific Settings */}
              <div className="space-y-4">
                {/* Прозрачность */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Прозрачность: {Math.round((selectedBlock.opacity || 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedBlock.opacity || 1}
                    onChange={(e) => {
                      const opacity = parseFloat(e.target.value)
                      onUpdateBlock({ opacity })
                    }}
                    className="w-full accent-green-500"
                  />
                </div>

                {/* Размер */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Размер блока
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Ширина</label>
                      <input
                        type="number"
                        value={selectedBlock.size.width}
                        onChange={(e) => {
                          onUpdateBlock({
                            size: {
                              ...selectedBlock.size,
                              width: parseInt(e.target.value)
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Высота</label>
                      <input
                        type="number"
                        value={selectedBlock.size.height}
                        onChange={(e) => {
                          onUpdateBlock({
                            size: {
                              ...selectedBlock.size,
                              height: parseInt(e.target.value)
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Отступ снизу */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Отступ снизу: {selectedBlock.marginBottom || 24}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="4"
                    value={selectedBlock.marginBottom ?? 24}
                    onChange={(e) => {
                      onUpdateBlock({
                        marginBottom: parseInt(e.target.value)
                      })
                    }}
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0px</span>
                    <span>100px</span>
                  </div>
                </div>

                {/* Настройки шрифта для блока */}
                {selectedBlock.type !== 'background' && (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <Type className="w-4 h-4 text-purple-500" />
                      <span>Настройки текста</span>
                    </h4>

                    {/* Выбор шрифта */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Шрифт
                      </label>
                      <select
                        value={selectedBlock.fontFamily || invitation.fontFamily || 'Montserrat'}
                        onChange={(e) => {
                          onUpdateBlock({
                            fontFamily: e.target.value
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{
                          fontFamily: selectedBlock.fontFamily || invitation.fontFamily || 'Montserrat'
                        }}
                      >
                        <optgroup label="Романтичные">
                          <option value="Dancing Script" style={{ fontFamily: 'Dancing Script' }}>Dancing Script</option>
                          <option value="Great Vibes" style={{ fontFamily: 'Great Vibes' }}>Great Vibes</option>
                          <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair Display</option>
                          <option value="Cormorant Garamond" style={{ fontFamily: 'Cormorant Garamond' }}>Cormorant Garamond</option>
                          <option value="Satisfy" style={{ fontFamily: 'Satisfy' }}>Satisfy</option>
                        </optgroup>
                        <optgroup label="Обычные">
                          <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                          <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                        </optgroup>
                        <optgroup label="Аристократичные">
                          <option value="Cinzel" style={{ fontFamily: 'Cinzel' }}>Cinzel</option>
                          <option value="Libre Baskerville" style={{ fontFamily: 'Libre Baskerville' }}>Libre Baskerville</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Размер шрифта */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Размер шрифта: {selectedBlock.fontSize || invitation.fontSize || 16}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="48"
                        step="1"
                        value={selectedBlock.fontSize || invitation.fontSize || 16}
                        onChange={(e) => {
                          onUpdateBlock({
                            fontSize: parseInt(e.target.value)
                          })
                        }}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10px</span>
                        <span>48px</span>
                      </div>
                    </div>

                    {/* Цвет текста */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Цвет текста
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={selectedBlock.textColor || invitation.textColor || '#2D3748'}
                          onChange={(e) => {
                            onUpdateBlock({
                              textColor: e.target.value
                            })
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedBlock.textColor || invitation.textColor || '#2D3748'}
                          onChange={(e) => {
                            onUpdateBlock({
                              textColor: e.target.value
                            })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="#2D3748"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Специфичные настройки для каждого типа блока */}
                
                {/* Text Block */}
                {selectedBlock.type === 'text' && (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Содержание текста
                    </label>
                    <textarea
                      value={selectedBlock.data?.content || ''}
                      onChange={(e) => {
                        onUpdateBlock({
                          data: {
                            ...selectedBlock.data,
                            content: e.target.value
                          }
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Введите ваш текст..."
                      rows={4}
                    />
                  </div>
                )}

                {/* Names Block */}
                {selectedBlock.type === 'names' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Способ отображения
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                layout: 'two-lines'
                              }
                            })
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            (selectedBlock.data?.layout || 'two-lines') === 'two-lines'
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          В две линии
                        </button>
                        <button
                          onClick={() => {
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                layout: 'one-line'
                              }
                            })
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            selectedBlock.data?.layout === 'one-line'
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          В одну линию
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя жениха
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.data?.groomName || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              groomName: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Имя жениха"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя невесты
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.data?.brideName || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              brideName: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Имя невесты"
                      />
                    </div>
                  </div>
                )}

                {/* Video Block */}
                {selectedBlock.type === 'video' && (
                  <>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Загрузить видео с компьютера
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        disabled={uploadingVideo}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          if (file.size > 50 * 1024 * 1024) {
                            alert('Размер файла не должен превышать 50MB')
                            return
                          }

                          if (!invitation?.id || !selectedBlock?.id) {
                            alert('Ошибка: отсутствует ID приглашения или блока')
                            return
                          }

                          setUploadingVideo(true)
                          
                          try {
                            // Загружаем видео в Supabase Storage
                            const videoUrl = await uploadVideoToStorage(
                              file,
                              invitation.id,
                              selectedBlock.id
                            )

                            if (!videoUrl) {
                              alert('Ошибка при загрузке видео. Попробуйте еще раз.')
                              setUploadingVideo(false)
                              return
                            }

                            // Сохраняем URL из Storage в базу данных
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                videoUrl: videoUrl, // URL из Supabase Storage
                                videoFileName: file.name,
                                videoFileSize: file.size,
                                videoFileType: file.type
                              }
                            })

                            alert('Видео успешно загружено!')
                          } catch (error) {
                            console.error('Error uploading video:', error)
                            alert('Ошибка при загрузке видео. Попробуйте еще раз.')
                          } finally {
                            setUploadingVideo(false)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {uploadingVideo && (
                        <p className="text-xs text-blue-500 mt-1">
                          Загрузка видео...
                        </p>
                      )}
                      {selectedBlock.data?.videoFileName && !uploadingVideo && (
                        <p className="text-xs text-gray-500 mt-1">
                          Файл: {selectedBlock.data.videoFileName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Форма видео
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                shape: 'circle'
                              }
                            })
                          }}
                          className={`p-3 rounded-lg transition-all ${
                            selectedBlock.data?.shape === 'circle' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                shape: 'square'
                              }
                            })
                          }}
                          className={`p-3 rounded-lg transition-all ${
                            selectedBlock.data?.shape === 'square' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Размер видео: {selectedBlock.data?.size || 200}px
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        value={selectedBlock.data?.size || 200}
                        onChange={(e) => {
                          const size = parseInt(e.target.value)
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              size
                            },
                            size: { width: size, height: size }
                          })
                        }}
                        className="w-full accent-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание видео
                      </label>
                      <textarea
                        value={selectedBlock.data?.description || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              description: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Добавьте описание..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Map Block */}
                {selectedBlock.type === 'map' && (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес мероприятия
                    </label>
                    <textarea
                      value={selectedBlock.data?.address || ''}
                      onChange={(e) => {
                        onUpdateBlock({
                          data: {
                            ...selectedBlock.data,
                            address: e.target.value
                          }
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Введите адрес..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Story Block */}
                {selectedBlock.type === 'story' && (
                  <>
                    <div className="border-t pt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Заголовок истории
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.data?.title || ''}
                          onChange={(e) => {
                            onUpdateBlock({
                              data: {
                                ...selectedBlock.data,
                                title: e.target.value
                              }
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Заголовок истории"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Элементы истории
                        </label>
                        <div className="flex space-x-2 mb-3">
                          <button
                            onClick={() => {
                              const currentItems = selectedBlock.data?.items || []
                              onUpdateBlock({
                                data: {
                                  ...selectedBlock.data,
                                  items: [...currentItems, { type: 'text', content: 'Новый текст...', id: `text-${Date.now()}` }]
                                }
                              })
                            }}
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Type className="w-4 h-4" />
                            <span>Добавить текст</span>
                          </button>
                          <button
                            onClick={() => {
                              const currentItems = selectedBlock.data?.items || []
                              onUpdateBlock({
                                data: {
                                  ...selectedBlock.data,
                                  items: [...currentItems, { type: 'image', imageUrl: '', shape: 'square', size: 192, id: `image-${Date.now()}` }]
                                }
                              })
                            }}
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <Image className="w-4 h-4" />
                            <span>Добавить фото</span>
                          </button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                          {(selectedBlock.data?.items || []).map((item: any, index: number) => (
                            <div key={item.id || index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600">
                                  {item.type === 'text' ? '📝 Текст' : '🖼️ Фото'}
                                </span>
                                <div className="flex space-x-1">
                                  {index > 0 && (
                                    <button
                                      onClick={() => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        const temp = items[index]
                                        items[index] = items[index - 1]
                                        items[index - 1] = temp
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                      title="Вверх"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                  )}
                                  {index < (selectedBlock.data?.items || []).length - 1 && (
                                    <button
                                      onClick={() => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        const temp = items[index]
                                        items[index] = items[index + 1]
                                        items[index + 1] = temp
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                      title="Вниз"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      const items = (selectedBlock.data?.items || []).filter((_: any, i: number) => i !== index)
                                      onUpdateBlock({
                                        data: {
                                          ...selectedBlock.data,
                                          items
                                        }
                                      })
                                    }}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Удалить"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {item.type === 'text' ? (
                                <textarea
                                  value={item.content || ''}
                                  onChange={(e) => {
                                    const items = [...(selectedBlock.data?.items || [])]
                                    items[index] = { ...item, content: e.target.value }
                                    onUpdateBlock({
                                      data: {
                                        ...selectedBlock.data,
                                        items
                                      }
                                    })
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder="Текст истории..."
                                  rows={3}
                                />
                              ) : (
                                <div className="space-y-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        const reader = new FileReader()
                                        reader.onload = (event) => {
                                          const items = [...(selectedBlock.data?.items || [])]
                                          items[index] = { ...item, imageUrl: event.target?.result as string }
                                          onUpdateBlock({
                                            data: {
                                              ...selectedBlock.data,
                                              items
                                            }
                                          })
                                        }
                                        reader.readAsDataURL(file)
                                      }
                                    }}
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                  />
                                  {item.imageUrl && (
                                    <img src={item.imageUrl} alt="Preview" className="w-full h-24 object-cover rounded" />
                                  )}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Размер: {item.size || 192}px
                                    </label>
                                    <input
                                      type="range"
                                      min="100"
                                      max="400"
                                      step="10"
                                      value={item.size || 192}
                                      onChange={(e) => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        items[index] = { ...item, size: parseInt(e.target.value) }
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className="w-full accent-green-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                      <span>100px</span>
                                      <span>400px</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        items[index] = { ...item, shape: 'square' }
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className={`flex-1 py-1 px-2 text-xs rounded transition-all ${
                                        item.shape === 'square'
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      <Square className="w-3 h-3 inline" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        items[index] = { ...item, shape: 'circle' }
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className={`flex-1 py-1 px-2 text-xs rounded transition-all ${
                                        item.shape === 'circle'
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      <Circle className="w-3 h-3 inline" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const items = [...(selectedBlock.data?.items || [])]
                                        items[index] = { ...item, shape: 'heart' }
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            items
                                          }
                                        })
                                      }}
                                      className={`flex-1 py-1 px-2 text-xs rounded transition-all ${
                                        item.shape === 'heart'
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      <Heart className="w-3 h-3 inline" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Wedding Date Block */}
                {selectedBlock.type === 'wedding-date' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дата свадьбы
                      </label>
                      <input
                        type="date"
                        value={selectedBlock.data?.weddingDate || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              weddingDate: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Время начала
                      </label>
                      <input
                        type="time"
                        value={selectedBlock.data?.weddingTime || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              weddingTime: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Место проведения
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.data?.weddingLocation || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              weddingLocation: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Название места..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание
                      </label>
                      <textarea
                        value={selectedBlock.data?.description || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              description: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Дополнительная информация..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Countdown Block */}
                {selectedBlock.type === 'countdown' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дата свадьбы для отсчета
                      </label>
                      <input
                        type="date"
                        value={selectedBlock.data?.weddingDate || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              weddingDate: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Заголовок
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.data?.title || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              title: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="До свадьбы осталось..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание
                      </label>
                      <textarea
                        value={selectedBlock.data?.description || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              description: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Дополнительная информация..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Dress Code Block */}
                {selectedBlock.type === 'dress-code' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание дресс-кода
                      </label>
                      <textarea
                        value={selectedBlock.data?.description || ''}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              description: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Укажите дресс-код для вашей свадьбы..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Guests Block */}
                {selectedBlock.type === 'guests' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Заголовок блока
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.data?.title || 'Наши гости'}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              title: e.target.value
                            }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Наши гости"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Гости
                      </label>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {(selectedBlock.data?.guests || []).map((guest: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Гость #{index + 1}</span>
                              <button
                                onClick={() => {
                                  const updatedGuests = [...(selectedBlock.data?.guests || [])]
                                  updatedGuests.splice(index, 1)
                                  onUpdateBlock({
                                    data: {
                                      ...selectedBlock.data,
                                      guests: updatedGuests
                                    }
                                  })
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Имя</label>
                              <input
                                type="text"
                                value={guest.name || ''}
                                onChange={(e) => {
                                  const updatedGuests = [...(selectedBlock.data?.guests || [])]
                                  updatedGuests[index] = { ...guest, name: e.target.value }
                                  onUpdateBlock({
                                    data: {
                                      ...selectedBlock.data,
                                      guests: updatedGuests
                                    }
                                  })
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Имя гостя"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Роль (опционально)</label>
                              <input
                                type="text"
                                value={guest.role || ''}
                                onChange={(e) => {
                                  const updatedGuests = [...(selectedBlock.data?.guests || [])]
                                  updatedGuests[index] = { ...guest, role: e.target.value }
                                  onUpdateBlock({
                                    data: {
                                      ...selectedBlock.data,
                                      guests: updatedGuests
                                    }
                                  })
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Организатор, Певцы, Танцевальная группа..."
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Фотография</label>
                              <div className="flex items-center space-x-2">
                                {guest.photo && (
                                  <img
                                    src={guest.photo}
                                    alt={guest.name || 'Гость'}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                                  />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (event) => {
                                        const updatedGuests = [...(selectedBlock.data?.guests || [])]
                                        updatedGuests[index] = { ...guest, photo: event.target?.result as string }
                                        onUpdateBlock({
                                          data: {
                                            ...selectedBlock.data,
                                            guests: updatedGuests
                                          }
                                        })
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                  className="text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => {
                          const updatedGuests = [...(selectedBlock.data?.guests || []), { name: '', role: '', photo: '' }]
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              guests: updatedGuests
                            }
                          })
                        }}
                        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Добавить гостя</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Background Block */}
                {selectedBlock.type === 'background' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Цвет фона
                      </label>
                      <input
                        type="color"
                        value={selectedBlock.data?.color || '#667eea'}
                        onChange={(e) => {
                          onUpdateBlock({
                            data: {
                              ...selectedBlock.data,
                              color: e.target.value
                            }
                          })
                        }}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Изображение фона
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              onUpdateBlock({
                                data: {
                                  ...selectedBlock.data,
                                  image: event.target?.result as string
                                }
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Layers className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Выберите блок для редактирования</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
