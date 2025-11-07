# Скрипт для добавления переменных окружения в Vercel через CLI

Write-Host "Установка Vercel CLI..." -ForegroundColor Yellow
npm i -g vercel

Write-Host "`nВход в Vercel..." -ForegroundColor Yellow
vercel login

Write-Host "`nДобавление NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Green
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
Write-Host "Введите значение: https://rforcwsyehlvvyvvpyxf.supabase.co" -ForegroundColor Cyan

Write-Host "`nДобавление NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Green
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
Write-Host "Введите значение: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmb3Jjd3N5ZWhsdnZ2cHl4ZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzYxMTQ1MDY0LCJleHAiOjIwNzY3MjEwNjR9.Htpz940p6fxv8j7KYfsFseD1jKeuKpZ0DO2S35591ek" -ForegroundColor Cyan

Write-Host "`nГотово! Переменные добавлены." -ForegroundColor Green

