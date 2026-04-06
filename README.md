# weforever

Приглашение (Vite + React). Статика в `public/` (видео, музыка, модели) подключается через `src/lib/publicUrl.js`, чтобы работать на **GitHub Pages** (подпапка репозитория).

## Локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Результат — папка `dist/`. Проверка локально:

```bash
npm run preview
```

## GitHub

1. **Репозиторий** — залейте проект (включая `package-lock.json`).
2. **GitHub Pages** — Settings → Pages → **Source: GitHub Actions** (после первого push в `main`/`master` сработает workflow из `.github/workflows/deploy-github-pages.yml`).
3. Сайт будет по адресу вида `https://<user>.github.io/<repo>/`.

Если нужен другой **base** (редко), в `vite.config.js` поменяйте `base` (например `'/имя-репо/'`) и пересоберите.

## Важно

- В `.gitignore` указан `dist` — артефакт собирается на CI или вручную перед деплоем.
- Переменные `VITE_*` в `.env` для кастомных URL (см. `ambientMusic.js`).
