# Инструкция по деплою в Vercel

## Способ 1: Через веб-интерфейс Vercel (Рекомендуется)

### Шаг 1: Подготовка проекта

1. Убедитесь, что проект собран:
```bash
npm run build
```

2. Инициализируйте git репозиторий (если еще не сделано):
```bash
git init
git add .
git commit -m "Initial commit"
```

### Шаг 2: Создайте репозиторий на GitHub

1. Создайте новый репозиторий на [GitHub](https://github.com/new)
2. Назовите его, например, `kliento`
3. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
4. Выполните команды, которые GitHub покажет:

```bash
git remote add origin https://github.com/ВАШ_USERNAME/kliento.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой в Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub аккаунт
3. Нажмите "Add New Project"
4. Выберите репозиторий `kliento`
5. Vercel автоматически определит настройки:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Нажмите "Deploy"
7. Дождитесь завершения деплоя (обычно 1-2 минуты)

### Шаг 4: Настройка домена

После деплоя Vercel предоставит вам URL вида: `https://kliento-xxxxx.vercel.app`

Вы можете:
- Использовать этот URL напрямую
- Настроить кастомный домен (бесплатно)

## Способ 2: Через Vercel CLI

### Установка Vercel CLI

```bash
npm i -g vercel
```

### Деплой

1. Войдите в Vercel:
```bash
vercel login
```

2. Деплой проекта:
```bash
vercel
```

3. Для продакшн деплоя:
```bash
vercel --prod
```

## Настройка Telegram Bot

После получения URL от Vercel:

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Menu Button"
5. Введите URL вашего приложения: `https://ваш-домен.vercel.app`
6. Готово! Приложение доступно через кнопку меню в боте

## Важные моменты

- Vercel автоматически деплоит при каждом push в main ветку
- Бесплатный план включает 100 ГБ трафика в месяц
- HTTPS включен по умолчанию
- Все настройки уже в файле `vercel.json`

