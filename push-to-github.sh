#!/bin/bash

echo "🚀 Загрузка проекта на GitHub..."
echo ""

# Проверяем remote
if ! git remote get-url origin &>/dev/null; then
    echo "📝 Настройка remote..."
    git remote add origin https://github.com/ogarkov43/kliento.git
fi

echo "📤 Отправка файлов на GitHub..."
echo ""
echo "⚠️  Вам потребуется ввести логин и пароль GitHub"
echo "   Или использовать Personal Access Token вместо пароля"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Файлы успешно загружены на GitHub!"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Откройте: https://github.com/ogarkov43/kliento/actions"
    echo "2. Дождитесь завершения workflow 'Deploy to GitHub Pages'"
    echo "3. Перейдите в Settings → Pages"
    echo "4. Выберите ветку gh-pages и нажмите Save"
    echo ""
    echo "🌐 Ваш сайт будет доступен: https://ogarkov43.github.io/kliento/"
else
    echo ""
    echo "❌ Ошибка при загрузке. Попробуйте загрузить файлы через веб-интерфейс GitHub."
fi

