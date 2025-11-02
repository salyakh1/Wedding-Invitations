-- =====================================================
-- ПРОВЕРОЧНЫЙ SQL ЗАПРОС ДЛЯ ТАБЛИЦЫ wishes
-- =====================================================

-- 1. Проверка существования таблицы wishes
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'wishes'
);

-- 2. Проверка структуры таблицы (если существует)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'wishes'
ORDER BY ordinal_position;

-- 3. Проверка индексов
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'wishes';

-- 4. Проверка RLS политик
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'wishes';

-- 5. Проверка данных (пример запроса, который используется в слайдере)
-- Замените 'YOUR_INVITATION_ID' на реальный ID приглашения
SELECT id, invitation_id, name, message, created_at
FROM wishes
WHERE invitation_id = 'YOUR_INVITATION_ID'
ORDER BY created_at DESC;

