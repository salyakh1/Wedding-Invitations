-- =====================================================
-- SQL ЗАПРОСЫ ДЛЯ СОЗДАНИЯ ТАБЛИЦЫ wishes
-- Используйте эти запросы, если таблица не создана
-- =====================================================

-- 1. Создание таблицы wishes (если не существует)
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Создание индекса для оптимизации запросов по invitation_id
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);

-- 3. Включение RLS (Row Level Security)
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- 4. Удаление старых политик (если нужно пересоздать)
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

-- 5. Создание RLS политики для чтения (SELECT) - публичный доступ
CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

-- 6. Создание RLS политики для добавления (INSERT) - публичный доступ
CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- ПРИМЕРЫ ЗАПРОСОВ, КОТОРЫЕ ИСПОЛЬЗУЕТ ПРИЛОЖЕНИЕ:
-- =====================================================

-- Запрос для получения пожеланий для конкретного приглашения (используется в слайдере):
-- SELECT * FROM wishes 
-- WHERE invitation_id = 'UUID_ПРИГЛАШЕНИЯ'
-- ORDER BY created_at DESC;

-- Запрос для добавления нового пожелания:
-- INSERT INTO wishes (invitation_id, name, message)
-- VALUES ('UUID_ПРИГЛАШЕНИЯ', 'Имя гостя', 'Текст пожелания');

