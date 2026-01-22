# Telegram Mini App - Галактика

Приложение для Telegram Mini Apps на React JS с интерактивной 3D галактикой.

## Установка

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## Деплой на GitHub Pages

### 1. Подготовка репозитория

```bash
# Инициализация git (если еще не сделано)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/ВАШ_РЕПОЗИТОРИЙ.git
git push -u origin main
```

### 2. Настройка GitHub Pages

1. Перейдите в Settings → Pages вашего репозитория
2. В разделе "Source" выберите "GitHub Actions"
3. Или выберите ветку `main` и папку `/dist`

### 3. Автоматический деплой (рекомендуется)

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v3
      - uses: actions/upload-pages-artifact@v1
        with:
          path: './dist'
      - id: deployment
        uses: actions/deploy-pages@v1
```

### 4. Ручной деплой

```bash
npm run build
# Скопируйте содержимое папки dist в корень ветки gh-pages
```

## Интеграция с Telegram

После деплоя на GitHub Pages:

1. Получите URL вашего приложения (например: `https://ВАШ_USERNAME.github.io/ВАШ_РЕПОЗИТОРИЙ/`)
2. Откройте @BotFather в Telegram
3. Выберите вашего бота или создайте нового
4. Используйте команду `/newapp` или `/editapp`
5. Укажите URL вашего приложения
6. Укажите название и описание приложения

## Особенности

- Интерактивная 3D галактика с вращением
- Масштабирование и поворот камеры
- Мерцающие частицы
- Адаптивный дизайн для мобильных устройств
- Оптимизированная производительность
