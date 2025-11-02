# 📋 Инструкция по настройке таблицы wishes для слайдера пожеланий

## Шаг 1: Откройте SQL Editor в Supabase

1. Зайдите на https://supabase.com/dashboard
2. Выберите ваш проект (wedding-invitations)
3. В левом меню нажмите на **"SQL Editor"** (иконка базы данных)

## Шаг 2: Проверьте существование таблицы wishes

Скопируйте и выполните этот запрос в SQL Editor:

```sql
-- Проверка существования таблицы
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'wishes'
) as table_exists;
```

**Результат:**
- Если `table_exists = true` → таблица существует, переходите к Шагу 4
- Если `table_exists = false` → таблицы нет, переходите к Шагу 3

## Шаг 3: Создание таблицы wishes (если её нет)

Скопируйте и выполните ВСЕ эти запросы по порядку:

```sql
-- 1. Создание таблицы wishes
CREATE TABLE IF NOT EXISTS wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Создание индекса для оптимизации
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);

-- 3. Включение RLS (Row Level Security)
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- 4. Удаление старых политик (если они существуют)
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

-- 5. Создание политики для чтения (публичный доступ)
CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

-- 6. Создание политики для добавления (публичный доступ)
CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);
```

## Шаг 4: Проверка RLS политик

Выполните этот запрос для проверки политик:

```sql
-- Проверка политик безопасности
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'wishes';
```

**Ожидаемый результат:**
Должно быть 2 политики:
1. `Anyone can view wishes` (SELECT)
2. `Anyone can insert wishes` (INSERT)

Если политик нет или меньше 2, выполните Шаг 3 с пунктов 4-6.

## Шаг 5: Проверка структуры таблицы

Выполните этот запрос:

```sql
-- Проверка структуры таблицы
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'wishes'
ORDER BY ordinal_position;
```

**Ожидаемый результат:**
Должно быть 5 колонок:
- `id` (uuid)
- `invitation_id` (uuid)
- `name` (text)
- `message` (text)
- `created_at` (timestamp with time zone)

## Шаг 6: Тестовая проверка (опционально)

Если у вас есть хотя бы одно приглашение, можете протестировать:

```sql
-- Замените 'ВАШ_ID_ПРИГЛАШЕНИЯ' на реальный ID из таблицы invitations
SELECT id FROM invitations LIMIT 1;

-- Затем используйте этот ID для проверки
SELECT * FROM wishes 
WHERE invitation_id = 'ВАШ_ID_ПРИГЛАШЕНИЯ';
```

## ✅ Готово!

После выполнения всех шагов таблица `wishes` будет настроена и слайдер пожеланий будет автоматически показывать все пожелания из базы данных.

---

## 🔧 Быстрое решение (если что-то не работает)

Если таблица уже существует, но есть проблемы с политиками, выполните только эти команды:

```sql
-- Пересоздание политик
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);
```

