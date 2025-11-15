-- Проверка политик Storage для bucket 'videos'
-- Выполните этот скрипт для проверки, что все политики созданы правильно

-- 1. Проверяем, что bucket существует
SELECT 
    'Bucket videos' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'videos') 
        THEN '✅ Создан' 
        ELSE '❌ Не найден' 
    END as status;

-- 2. Проверяем все политики для storage.objects
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%video%'
ORDER BY policyname;

-- 3. Проверяем, включен ли RLS для storage.objects
SELECT 
    'RLS для storage.objects' as check_type,
    CASE 
        WHEN relrowsecurity = true 
        THEN '✅ Включен' 
        ELSE '❌ Выключен' 
    END as status
FROM pg_class 
WHERE relname = 'objects' 
  AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');

-- 4. Список всех политик для storage.objects (для отладки)
SELECT 
    policyname as "Имя политики",
    cmd as "Команда",
    CASE 
        WHEN qual IS NOT NULL THEN '✅ USING'
        ELSE '❌ Нет USING'
    END as "USING",
    CASE 
        WHEN with_check IS NOT NULL THEN '✅ WITH CHECK'
        ELSE '❌ Нет WITH CHECK'
    END as "WITH CHECK"
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY cmd, policyname;

