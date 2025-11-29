#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node

echo "🔨 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке проекта"
    exit 1
fi

echo "✅ Проект собран!"
echo ""
echo "🚀 Деплой в Vercel..."
echo ""

cd dist

# Проверяем, установлен ли Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Установка Vercel CLI..."
    npm install -g vercel
fi

# Деплой
vercel --prod

echo ""
echo "✅ Деплой завершен!"

