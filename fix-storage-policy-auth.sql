-- ИСПРАВЛЕНИЕ: Политика INSERT для загрузки видео
-- Проблема: auth.role() не работает правильно в Storage политиках
-- Решение: использовать auth.uid() IS NOT NULL для проверки аутентификации
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- Удаляем старую политику INSERT
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

-- Создаем правильную политику для INSERT с auth.uid()
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.uid() IS NOT NULL
);

-- Также обновляем политики UPDATE и DELETE для консистентности
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
CREATE POLICY "Authenticated users can update videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'videos' 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos' 
  AND auth.uid() IS NOT NULL
);

-- Проверка: убедитесь, что политики созданы правильно
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
  AND policyname LIKE '%video%'
ORDER BY cmd, policyname;

