-- =====================================================
-- БЫСТРОЕ СОЗДАНИЕ/НАСТРОЙКА ТАБЛИЦЫ wishes
-- Скопируйте и выполните ВСЕ эти запросы по порядку
-- =====================================================

-- 1. Создание таблицы wishes (если не существует)
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Создание индекса для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);

-- 3. Включение RLS (Row Level Security)
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- 4. Удаление старых политик (если существуют)
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

-- 5. Создание политики для чтения (SELECT) - любой может читать
CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

-- 6. Создание политики для добавления (INSERT) - любой может добавлять
CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- ПРОВЕРОЧНЫЙ ЗАПРОС (выполните для проверки)
-- =====================================================

-- Проверка что таблица создана и политики настроены
SELECT 
    'Таблица существует' as status,
    COUNT(*)::text as column_count
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'wishes'
UNION ALL
SELECT 
    'Политики RLS' as status,
    COUNT(*)::text as column_count
FROM pg_policies
WHERE tablename = 'wishes';

-- Должно вернуть:
-- status: "Таблица существует", column_count: "5"
-- status: "Политики RLS", column_count: "2"

