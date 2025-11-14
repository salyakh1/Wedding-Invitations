-- Добавление колонок для анимаций и эффектов в таблицу invitations
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- Добавляем колонку animations (тип jsonb для хранения настроек анимаций)
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS animations jsonb DEFAULT NULL;

-- Добавляем колонку effects (тип jsonb для хранения настроек спецэффектов)
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS effects jsonb DEFAULT NULL;

-- Комментарии к колонкам для документации
COMMENT ON COLUMN invitations.animations IS 'Настройки анимаций блоков: fadeIn, slideUp, scaleIn, staggered';
COMMENT ON COLUMN invitations.effects IS 'Настройки спецэффектов: parallax, particles, gradientAnimation, blurOnScroll';

-- Пример структуры данных:
-- animations: {
--   "fadeIn": true,
--   "slideUp": false,
--   "scaleIn": true,
--   "staggered": false
-- }
--
-- effects: {
--   "parallax": true,
--   "particles": false,
--   "gradientAnimation": true,
--   "blurOnScroll": false
-- }

