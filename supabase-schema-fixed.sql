-- Удаляем существующие таблицы и пересоздаем их
DROP TABLE IF EXISTS wishes CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;

-- Создание таблицы для пригласительных
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  background_image TEXT,
  background_color TEXT DEFAULT '#667eea',
  background_music TEXT,
  font_family TEXT DEFAULT 'Montserrat',
  font_size INTEGER DEFAULT 16,
  blocks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Создание таблицы для пожеланий
CREATE TABLE wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_wishes_invitation_id ON wishes(invitation_id);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггера для автоматического обновления updated_at
CREATE TRIGGER update_invitations_updated_at 
    BEFORE UPDATE ON invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Включение RLS (Row Level Security)
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для invitations
CREATE POLICY "Users can view their own invitations" ON invitations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invitations" ON invitations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" ON invitations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" ON invitations
    FOR DELETE USING (auth.uid() = user_id);

-- Политики безопасности для wishes (публичный доступ для чтения и записи)
CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);
