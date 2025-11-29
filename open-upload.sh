#!/bin/bash

echo "🚀 Подготовка к загрузке на GitHub..."
echo ""

# Открываем Finder с нужной папкой
open /Users/kirillogarkov/Desktop/kliento

# Открываем страницу загрузки на GitHub
open "https://github.com/ogarkov43/kliento/upload"

echo "✅ Открыты:"
echo "   1. Finder с папкой проекта"
echo "   2. Страница загрузки на GitHub"
echo ""
echo "📋 Инструкция:"
echo "   1. В Finder выделите все файлы (Cmd+A)"
echo "   2. Исключите папки: node_modules, dist, .git"
echo "   3. Перетащите файлы в окно GitHub"
echo "   4. Введите 'Initial commit' и нажмите 'Commit changes'"
echo ""

