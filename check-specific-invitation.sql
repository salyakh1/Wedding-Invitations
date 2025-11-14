-- Проверка конкретного приглашения, которое не работает
-- ID из URL: c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a

-- 1. Основная информация о приглашении
SELECT 
    id,
    title,
    CASE 
        WHEN blocks IS NULL THEN 'NULL - блоки отсутствуют!'
        WHEN jsonb_typeof(blocks) = 'array' THEN 
            'array с ' || jsonb_array_length(blocks) || ' блоков'
        ELSE 
            'тип: ' || jsonb_typeof(blocks)::text
    END as blocks_info,
    CASE 
        WHEN blocks IS NULL THEN 0
        WHEN jsonb_typeof(blocks) = 'array' THEN jsonb_array_length(blocks)
        ELSE 0
    END as blocks_count,
    -- Показываем первые 1000 символов блоков
    CASE 
        WHEN blocks IS NULL THEN 'NULL'
        WHEN jsonb_typeof(blocks) != 'array' THEN blocks::text
        WHEN jsonb_array_length(blocks) = 0 THEN '[] - массив пустой!'
        ELSE LEFT(blocks::text, 1000) || CASE WHEN length(blocks::text) > 1000 THEN '...' ELSE '' END
    END as blocks_preview,
    animations,
    effects,
    created_at,
    updated_at
FROM invitations
WHERE id = 'c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a';

-- 2. Если блоки есть, показываем типы блоков
SELECT 
    i.id,
    i.title,
    jsonb_array_length(i.blocks) as total_blocks,
    jsonb_array_elements(i.blocks)->>'type' as block_type,
    jsonb_array_elements(i.blocks)->>'id' as block_id
FROM invitations i
WHERE i.id = 'c777d3c2-b1ee-43a6-b5dc-21c2ff2e200a'
  AND jsonb_typeof(i.blocks) = 'array'
  AND jsonb_array_length(i.blocks) > 0;

