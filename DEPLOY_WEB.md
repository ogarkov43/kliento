# Деплой в Vercel через веб-интерфейс (без терминала)

## Способ 1: Через GitHub (Рекомендуется)

### Шаг 1: Загрузите проект на GitHub

1. Перейдите на [github.com](https://github.com) и войдите в аккаунт
2. Нажмите кнопку **"+"** в правом верхнем углу → **"New repository"**
3. Заполните:
   - **Repository name:** `kliento`
   - **Description:** (опционально)
   - **Public** или **Private** (на ваш выбор)
   - **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите **"Create repository"**

### Шаг 2: Загрузите файлы через веб-интерфейс GitHub

1. На странице созданного репозитория найдите кнопку **"uploading an existing file"** или **"upload files"**
2. Перетащите все файлы из папки проекта (кроме `node_modules` и `dist`)
3. Внизу страницы введите сообщение коммита: `Initial commit`
4. Нажмите **"Commit changes"**

### Шаг 3: Деплой в Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign Up"** или **"Log In"**
3. Войдите через **GitHub** (рекомендуется)
4. После входа нажмите **"Add New..."** → **"Project"**
5. Выберите репозиторий **`kliento`**
6. Vercel автоматически определит настройки:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
7. Нажмите **"Deploy"**
8. Дождитесь завершения деплоя (1-2 минуты)

### Шаг 4: Получите URL

После деплоя вы увидите:
- **Production URL:** `https://kliento-xxxxx.vercel.app`
- Скопируйте этот URL

---

## Способ 2: Через Vercel CLI в браузере (если есть доступ к VS Code)

Если у вас установлен VS Code с расширением Terminal:

1. Откройте проект в VS Code
2. Нажмите `Ctrl+` (или `Cmd+` на Mac) для открытия терминала
3. Выполните:
   ```bash
   cd dist
   vercel --prod
   ```

---

## Способ 3: Используйте онлайн IDE

1. Перейдите на [codesandbox.io](https://codesandbox.io) или [stackblitz.com](https://stackblitz.com)
2. Импортируйте проект с GitHub
3. Используйте встроенный терминал для деплоя

---

## Настройка Telegram Bot

После получения URL от Vercel:

1. Откройте Telegram
2. Найдите [@BotFather](https://t.me/BotFather)
3. Отправьте команду `/mybots`
4. Выберите вашего бота
5. Нажмите **"Bot Settings"** → **"Menu Button"**
6. Введите URL: `https://kliento-xxxxx.vercel.app`
7. Готово!

---

## Важно

- Vercel автоматически будет обновлять деплой при каждом изменении в GitHub
- Бесплатный план: 100 ГБ трафика в месяц
- HTTPS включен автоматически
- Все настройки уже в файле `vercel.json`

