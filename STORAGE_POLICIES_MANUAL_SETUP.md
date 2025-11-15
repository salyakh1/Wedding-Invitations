# 🔧 РУЧНАЯ НАСТРОЙКА ПОЛИТИК STORAGE

## ⚠️ Проблема
Политики для `storage.objects` **нельзя создавать через SQL Editor** - нужно использовать веб-интерфейс Supabase Dashboard.

---

## 📋 Пошаговая инструкция

### 1. Откройте Storage в Supabase Dashboard
1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите в свой проект `wedding-invitations`
3. В левом меню выберите **"Storage"**

### 2. Откройте bucket "videos"
1. Найдите bucket с именем **"videos"**
2. Нажмите на него, чтобы открыть

### 3. Перейдите в раздел "Policies"
1. В верхней части страницы bucket найдите вкладку **"Policies"**
2. Нажмите на неё

### 4. Создайте политику для SELECT (публичное чтение)
1. Нажмите кнопку **"New Policy"** или **"Add Policy"**
2. Выберите **"For full customization"** или **"Custom policy"**
3. Заполните форму:
   - **Policy name:** `Public can view videos`
   - **Allowed operation:** `SELECT`
   - **Target roles:** `public` (или оставьте пустым для всех)
   - **USING expression:** 
     ```sql
     bucket_id = 'videos'
     ```
   - **WITH CHECK expression:** (оставьте пустым для SELECT)
4. Нажмите **"Review"** → **"Save policy"**

### 5. Создайте политику для INSERT (загрузка видео)
1. Нажмите **"New Policy"**
2. Заполните форму:
   - **Policy name:** `Authenticated users can upload videos`
   - **Allowed operation:** `INSERT`
   - **Target roles:** `authenticated` (или оставьте пустым)
   - **USING expression:** (оставьте пустым для INSERT)
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'videos' AND auth.uid() IS NOT NULL
     ```
3. Нажмите **"Review"** → **"Save policy"**

### 6. Создайте политику для UPDATE (обновление видео)
1. Нажмите **"New Policy"**
2. Заполните форму:
   - **Policy name:** `Authenticated users can update videos`
   - **Allowed operation:** `UPDATE`
   - **Target roles:** `authenticated`
   - **USING expression:**
     ```sql
     bucket_id = 'videos' AND auth.uid() IS NOT NULL
     ```
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'videos' AND auth.uid() IS NOT NULL
     ```
3. Нажмите **"Review"** → **"Save policy"**

### 7. Создайте политику для DELETE (удаление видео)
1. Нажмите **"New Policy"**
2. Заполните форму:
   - **Policy name:** `Authenticated users can delete videos`
   - **Allowed operation:** `DELETE`
   - **Target roles:** `authenticated`
   - **USING expression:**
     ```sql
     bucket_id = 'videos' AND auth.uid() IS NOT NULL
     ```
   - **WITH CHECK expression:** (оставьте пустым для DELETE)
3. Нажмите **"Review"** → **"Save policy"**

---

## ✅ Проверка

После создания всех политик:
1. В разделе "Policies" должны быть видны 4 политики:
   - ✅ `Public can view videos` (SELECT)
   - ✅ `Authenticated users can upload videos` (INSERT)
   - ✅ `Authenticated users can update videos` (UPDATE)
   - ✅ `Authenticated users can delete videos` (DELETE)

2. Попробуйте загрузить видео в конструкторе - должно работать!

---

## 🎯 Альтернативный способ (если веб-интерфейс не работает)

Если веб-интерфейс не позволяет создать политики, можно попробовать через Supabase CLI:

```bash
# Установите Supabase CLI (если еще не установлен)
npm install -g supabase

# Войдите в Supabase
supabase login

# Свяжите проект
supabase link --project-ref rforcwsyehlvvyvvpyxf

# Создайте политики через миграции
# (создайте файл migrations/YYYYMMDDHHMMSS_create_storage_policies.sql)
```

Но обычно веб-интерфейс работает лучше!

