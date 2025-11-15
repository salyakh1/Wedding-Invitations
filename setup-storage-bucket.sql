-- SQL скрипт для настройки Supabase Storage bucket для видео
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- 0. Включаем RLS для storage.objects (если еще не включен)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Создаем bucket 'videos' для хранения видео файлов
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true, -- Публичный доступ для чтения
  52428800, -- Лимит размера файла: 50MB (в байтах)
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Удаляем старые политики, если они существуют (все возможные варианты имен)
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- 3. Создаем политику для публичного чтения видео
CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- 4. Создаем политику для загрузки видео (только для аутентифицированных пользователей)
-- Для INSERT политик используется только WITH CHECK
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- 5. Создаем политику для обновления видео (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can update videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);

-- 6. Создаем политику для удаления видео (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);

-- Проверка: убедитесь, что bucket создан
SELECT * FROM storage.buckets WHERE id = 'videos';

