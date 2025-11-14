-- Полная проверка и исправление схемы базы данных для приглашений
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- 1. Проверяем и добавляем колонку animations, если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invitations' AND column_name = 'animations'
    ) THEN
        ALTER TABLE invitations ADD COLUMN animations JSONB DEFAULT NULL;
        RAISE NOTICE 'Колонка animations добавлена';
    ELSE
        RAISE NOTICE 'Колонка animations уже существует';
    END IF;
END $$;

-- 2. Проверяем и добавляем колонку effects, если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invitations' AND column_name = 'effects'
    ) THEN
        ALTER TABLE invitations ADD COLUMN effects JSONB DEFAULT NULL;
        RAISE NOTICE 'Колонка effects добавлена';
    ELSE
        RAISE NOTICE 'Колонка effects уже существует';
    END IF;
END $$;

-- 3. Проверяем, что колонка blocks существует и имеет тип JSONB
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invitations' AND column_name = 'blocks'
    ) THEN
        ALTER TABLE invitations ADD COLUMN blocks JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Колонка blocks добавлена';
    ELSE
        -- Проверяем тип колонки
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'invitations' 
            AND column_name = 'blocks' 
            AND data_type != 'jsonb'
        ) THEN
            RAISE NOTICE 'Колонка blocks существует, но имеет неправильный тип. Требуется ручное исправление.';
        ELSE
            RAISE NOTICE 'Колонка blocks уже существует с правильным типом JSONB';
        END IF;
    END IF;
END $$;

-- 4. Проверяем публичные политики для чтения приглашений
-- Удаляем старые политики, если они есть
DROP POLICY IF EXISTS "Anyone can view invitations by id" ON invitations;

-- Создаем публичную политику для чтения приглашений по ID
CREATE POLICY "Anyone can view invitations by id" ON invitations
    FOR SELECT USING (true);

-- 5. Проверяем публичные политики для wishes
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);

-- 6. Проверяем структуру таблицы invitations
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'invitations'
ORDER BY ordinal_position;

-- 7. Проверяем количество приглашений и их блоки
SELECT 
    id,
    title,
    CASE 
        WHEN blocks IS NULL THEN 'NULL'
        WHEN jsonb_typeof(blocks) = 'array' THEN 'array (' || jsonb_array_length(blocks) || ' blocks)'
        ELSE jsonb_typeof(blocks)::text
    END as blocks_status,
    CASE 
        WHEN animations IS NULL THEN 'NULL'
        ELSE 'has animations'
    END as animations_status,
    CASE 
        WHEN effects IS NULL THEN 'NULL'
        ELSE 'has effects'
    END as effects_status
FROM invitations
ORDER BY created_at DESC
LIMIT 10;

