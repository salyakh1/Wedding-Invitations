-- Исправление политики INSERT для загрузки видео
-- Выполните этот скрипт, если политика INSERT не работает

-- Удаляем старую политику
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

-- Создаем правильную политику для INSERT
-- Для INSERT в Supabase используется только WITH CHECK
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);

-- Проверка: убедитесь, что политика создана
SELECT 
    policyname as "Имя политики",
    cmd as "Команда",
    CASE 
        WHEN qual IS NOT NULL THEN '✅ USING'
        ELSE '❌ Нет USING (нормально для INSERT)'
    END as "USING",
    CASE 
        WHEN with_check IS NOT NULL THEN '✅ WITH CHECK'
        ELSE '❌ Нет WITH CHECK'
    END as "WITH CHECK"
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname = 'Authenticated users can upload videos';

