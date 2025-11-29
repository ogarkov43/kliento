# Деплой папки dist напрямую

## Вариант 1: Vercel CLI (Рекомендуется)

### Установка Vercel CLI

```bash
npm i -g vercel
```

### Деплой папки dist

1. Соберите проект:
```bash
npm run build
```

2. Войдите в Vercel:
```bash
vercel login
```

3. Перейдите в папку dist и задеплойте:
```bash
cd dist
vercel
```

4. Для продакшн деплоя:
```bash
vercel --prod
```

Vercel спросит:
- Set up and deploy? → **Y**
- Which scope? → выберите ваш аккаунт
- Link to existing project? → **N** (для первого раза)
- Project name? → **kliento** (или любое другое)
- Directory? → **.** (текущая папка dist)

После деплоя вы получите URL вида: `https://kliento-xxxxx.vercel.app`

---

## Вариант 2: Surge.sh (Самый простой)

### Установка Surge

```bash
npm install -g surge
```

### Деплой

1. Соберите проект:
```bash
npm run build
```

2. Задеплойте папку dist:
```bash
cd dist
surge
```

3. Surge спросит:
   - Email: введите ваш email
   - Password: создайте пароль (при первом использовании)
   - Domain: введите домен (например: `kliento.surge.sh`)

Готово! Ваше приложение будет доступно по адресу: `https://kliento.surge.sh`

---

## Вариант 3: Cloudflare Pages (Drag & Drop)

1. Соберите проект:
```bash
npm run build
```

2. Перейдите на [pages.cloudflare.com](https://pages.cloudflare.com)
3. Войдите в аккаунт Cloudflare
4. Нажмите "Create a project" → "Upload assets"
5. Перетащите папку `dist` в браузер
6. Введите название проекта (например: `kliento`)
7. Нажмите "Deploy site"

После деплоя вы получите URL вида: `https://kliento.pages.dev`

---

## Вариант 4: Firebase Hosting

### Установка Firebase CLI

```bash
npm install -g firebase-tools
```

### Инициализация

1. Войдите в Firebase:
```bash
firebase login
```

2. Инициализируйте проект в корне проекта (не в dist):
```bash
firebase init hosting
```

Выберите:
- What do you want to use as your public directory? → **dist**
- Configure as a single-page app? → **Y**
- Set up automatic builds? → **N**

3. Создайте файл `firebase.json` в корне проекта (если не создался автоматически):

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. Деплой:
```bash
npm run build
firebase deploy --only hosting
```

---

## Рекомендация

**Самый простой вариант**: Surge.sh - просто установите, соберите проект и задеплойте папку dist.

**Самый надежный вариант**: Vercel CLI - больше функций, лучше для продакшна.

