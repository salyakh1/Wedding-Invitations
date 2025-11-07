-- Добавление публичной политики для чтения приглашений
-- Это позволит любому пользователю просматривать приглашения по ссылке

-- Удаляем старую политику, если она существует
DROP POLICY IF EXISTS "Anyone can view invitations by id" ON invitations;

-- Создаем новую публичную политику для чтения приглашений
CREATE POLICY "Anyone can view invitations by id" ON invitations
    FOR SELECT USING (true);

-- Также убедимся, что политики для wishes публичные (они уже должны быть)
DROP POLICY IF EXISTS "Anyone can view wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can insert wishes" ON wishes;

CREATE POLICY "Anyone can view wishes" ON wishes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert wishes" ON wishes
    FOR INSERT WITH CHECK (true);

