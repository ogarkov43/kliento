#!/bin/bash

echo "🚀 Автоматическая загрузка на GitHub..."
echo ""

# Проверяем наличие токена
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GitHub токен не найден в переменных окружения"
    echo ""
    echo "Для автоматической загрузки нужен Personal Access Token:"
    echo "1. GitHub → Settings → Developer settings → Personal access tokens"
    echo "2. Generate new token (classic)"
    echo "3. Выберите scope: repo"
    echo "4. Скопируйте токен"
    echo ""
    echo "Затем выполните:"
    echo "export GITHUB_TOKEN=ваш_токен"
    echo "bash auto-upload-github.sh"
    echo ""
    exit 1
fi

cd /Users/kirillogarkov/Desktop/kliento

# Настраиваем git для использования токена
git remote set-url origin https://${GITHUB_TOKEN}@github.com/ogarkov43/kliento.git

# Push
echo "📤 Отправка файлов..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Файлы успешно загружены!"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Откройте: https://github.com/ogarkov43/kliento/actions"
    echo "2. Дождитесь завершения workflow"
    echo "3. Settings → Pages → выберите ветку gh-pages"
    echo ""
else
    echo ""
    echo "❌ Ошибка. Используйте веб-интерфейс для загрузки."
fi

