# Деплой в Vercel - Простая инструкция

## Способ 1: Через Vercel CLI (Рекомендуется для папки dist)

### Шаг 1: Установите Vercel CLI

```bash
npm install -g vercel
```

### Шаг 2: Соберите проект

```bash
npm run build
```

### Шаг 3: Задеплойте папку dist

```bash
cd dist
vercel --prod
```

### Шаг 4: Следуйте инструкциям

Vercel спросит:
1. **Set up and deploy?** → Нажмите `Y`
2. **Which scope?** → Выберите ваш аккаунт (или создайте новый)
3. **Link to existing project?** → `N` (для первого раза)
4. **What's your project's name?** → `kliento` (или любое другое)
5. **In which directory is your code located?** → `.` (текущая папка dist)

После деплоя вы получите URL вида: `https://kliento-xxxxx.vercel.app`

---

## Способ 2: Через веб-интерфейс Vercel

### Шаг 1: Подготовьте проект на GitHub

1. Инициализируйте git (если еще не сделано):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Создайте репозиторий на [GitHub](https://github.com/new)

3. Загрузите код:
```bash
git remote add origin https://github.com/ВАШ_USERNAME/kliento.git
git branch -M main
git push -u origin main
```

### Шаг 2: Деплой через Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите репозиторий `kliento`
5. Vercel автоматически определит настройки (уже настроено в `vercel.json`)
6. Нажмите "Deploy"

---

## Настройка Telegram Bot

После получения URL от Vercel:

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Menu Button"
5. Введите URL вашего приложения: `https://ваш-домен.vercel.app`
6. Готово!

---

## Быстрый деплой одной командой

Используйте готовый скрипт:

```bash
bash deploy-vercel.sh
```

Или через npm:

```bash
npm run deploy:vercel
```

