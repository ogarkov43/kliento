# Инструкция по деплою на Netlify

## Шаг 1: Деплой на Netlify

1. Зайдите на [netlify.com](https://netlify.com) и войдите в аккаунт
2. Нажмите "Add new site" → "Deploy manually"
3. Перетащите папку `dist` в область загрузки
4. Или используйте Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## Шаг 2: Настройка бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Configure Mini App"
5. Введите URL вашего приложения на Netlify (например: `https://your-app.netlify.app`)
6. Сохраните изменения

## Шаг 3: Тестирование

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку "Menu" или отправьте команду `/start`
3. Если настроена кнопка Mini App, она появится в меню бота

## Токен бота

Токен вашего бота: `1995557521:AAEfIvCa9YxYDaGIZ-H_lScod2iTnaF5YNc`

⚠️ **Важно**: Не публикуйте токен в открытом доступе!

