import { createClient } from '@supabase/supabase-js'

// Создаем клиент Supabase для Storage
// Используем createClient вместо createBrowserClient для более надежной работы с сессией
const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Storage functions can only be called on the client side')
  }
  
  // createClient автоматически использует localStorage для сессии
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}

/**
 * Загружает видео файл в Supabase Storage
 * @param file - Видео файл для загрузки
 * @param invitationId - ID приглашения (для организации файлов)
 * @param blockId - ID блока (для уникальности имени файла)
 * @returns Публичный URL загруженного видео или null в случае ошибки
 */
export async function uploadVideoToStorage(
  file: File,
  invitationId: string,
  blockId: string
): Promise<string | null> {
  try {
    // Используем клиент с правильной настройкой сессии
    const supabase = getSupabaseClient()
    
    // Проверяем, что пользователь аутентифицирован
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('User not authenticated:', authError)
      throw new Error('User must be authenticated to upload videos')
    }
    
    // Создаем уникальное имя файла
    const fileExt = file.name.split('.').pop()
    const fileName = `${invitationId}/${blockId}-${Date.now()}.${fileExt}`
    
    // Загружаем файл в bucket 'videos'
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading video to storage:', error)
      throw error
    }

    // Получаем публичный URL
    const { data: urlData } = getSupabaseClient().storage
      .from('videos')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded video')
    }

    console.log('Video uploaded successfully:', urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadVideoToStorage:', error)
    return null
  }
}

/**
 * Удаляет видео файл из Supabase Storage
 * @param videoUrl - Публичный URL видео для удаления
 */
export async function deleteVideoFromStorage(videoUrl: string): Promise<void> {
  try {
    // Используем клиент с правильной настройкой сессии
    const supabase = getSupabaseClient()
    
    // Извлекаем путь к файлу из URL
    const urlParts = videoUrl.split('/videos/')
    if (urlParts.length < 2) {
      console.warn('Invalid video URL format:', videoUrl)
      return
    }

    const filePath = urlParts[1].split('?')[0] // Убираем query параметры

    const { error } = await supabase.storage
      .from('videos')
      .remove([filePath])

    if (error) {
      console.error('Error deleting video from storage:', error)
    } else {
      console.log('Video deleted successfully:', filePath)
    }
  } catch (error) {
    console.error('Error in deleteVideoFromStorage:', error)
  }
}

