-- Проверка данных конкретного приглашения
-- Замените 'c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a' на ID вашего приглашения

SELECT 
    id,
    title,
    -- Проверяем блоки
    CASE 
        WHEN blocks IS NULL THEN 'NULL - блоки отсутствуют!'
        WHEN jsonb_typeof(blocks) = 'array' THEN 
            'array с ' || jsonb_array_length(blocks) || ' блоков'
        ELSE 
            'тип: ' || jsonb_typeof(blocks)::text
    END as blocks_info,
    -- Показываем все блоки (первые 500 символов)
    CASE 
        WHEN blocks IS NULL THEN 'NULL'
        WHEN jsonb_typeof(blocks) != 'array' THEN blocks::text
        WHEN jsonb_array_length(blocks) = 0 THEN '[] - массив пустой!'
        ELSE LEFT(blocks::text, 500) || '...'
    END as blocks_preview,
    -- Проверяем анимации
    CASE 
        WHEN animations IS NULL THEN 'NULL'
        ELSE animations::text
    END as animations_info,
    -- Проверяем эффекты
    CASE 
        WHEN effects IS NULL THEN 'NULL'
        ELSE effects::text
    END as effects_info,
    created_at,
    updated_at
FROM invitations
WHERE id = 'c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a';

-- Или посмотрите все приглашения с информацией о блоках
SELECT 
    id,
    title,
    CASE 
        WHEN blocks IS NULL THEN 0
        WHEN jsonb_typeof(blocks) = 'array' THEN jsonb_array_length(blocks)
        ELSE 0
    END as blocks_count,
    CASE 
        WHEN blocks IS NULL THEN 'NULL'
        WHEN jsonb_typeof(blocks) != 'array' THEN 'не массив'
        WHEN jsonb_array_length(blocks) = 0 THEN 'пустой массив []'
        ELSE 'есть блоки'
    END as blocks_status,
    created_at
FROM invitations
ORDER BY created_at DESC
LIMIT 10;

-- Детальная информация о блоках конкретного приглашения (если нужно посмотреть каждый блок отдельно)
-- Раскомментируйте и замените ID если нужно:
/*
SELECT 
    i.id,
    i.title,
    jsonb_array_length(i.blocks) as total_blocks,
    jsonb_array_elements(i.blocks) as block_data
FROM invitations i
WHERE i.id = 'c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a'
  AND jsonb_typeof(i.blocks) = 'array'
  AND jsonb_array_length(i.blocks) > 0;
*/

