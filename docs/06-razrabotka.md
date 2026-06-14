# 6. Разработка, отладка и FAQ

## 6.1. Среда разработки

Рекомендуется:

- **VS Code** или **Cursor** с расширениями ESLint и TypeScript.
- Два терминала: `npm run server` + `npm run dev`.
- Браузер с DevTools (F12) → вкладки Network, Console.

### Полезные скрипты

```bash
npm run dev      # фронтенд с HMR
npm run server   # API
npm run lint     # ESLint
npm run build    # tsc + vite build
```

---

## 6.2. Соглашения по коду

### TypeScript

- `strict: true` — избегайте `any`.
- Неиспользуемые переменные/параметры — ошибка линтера.
- Импорт типов: `import type { Bet } from "..."`.

### Компоненты

- Один компонент — папка `ComponentName/` с `ComponentName.tsx` и `ComponentName.styled.ts`.
- Default export для страниц и крупных компонентов.
- Бизнес-логику выносить в `lib/` рядом с feature, не в JSX.

### Именование

| Что | Стиль |
|-----|-------|
| Компоненты React | PascalCase |
| Хуки | `use` + PascalCase |
| Утилиты | camelCase |
| Константы | UPPER_SNAKE или camelCase для объектов метаданных |

### Стили

- MUI `sx` — для мелких правок таблиц/диалогов.
- styled-components — для фирменного UI (карточки, вкладки).

---

## 6.3. Как добавить новое поле в ставку (пошагово)

Пример: поле `note: string` — заметка к ставке.

### Шаг 1. Тип

`src/entities/bet/types.ts`:

```ts
export interface Bet {
  // ...
  note: string;
}
```

### Шаг 2. Нормализация

`src/features/profile/lib/normalizeBet.ts` — добавить чтение с дефолтом `""`.

### Шаг 3. Форма

`BetFormDialog` — поле ввода, включить в объект при submit.

### Шаг 4. Отображение

При необходимости — колонка в `BetsHistory` или строка в `MatchRelatedBets`.

### Шаг 5. Данные

Существующие записи в `db.json` без поля — normalize подставит дефолт.

### Шаг 6. Проверка

```bash
npm run lint
npm run build
```

API менять не нужно — json-server сохранит новое поле автоматически.

---

## 6.4. Как добавить новую вкладку

1. Создать компонент, например `features/foo/components/FooTab/FooTab.tsx`.
2. В `HomeTabs.tsx`:
   - добавить объект в `HOME_TABS` (label, id, icon);
   - добавить `TabsPanel` с `hidden={tab !== N}`;
   - пробросить нужные props из `HomeTabsProps`.
3. Если нужны данные с API — расширить `useProfileBets` и `HomePage`.

Нумерация `tab !== N` должна совпадать с порядком в `HOME_TABS`.

---

## 6.5. Отладка API

### Проверка, что сервер жив

Браузер или curl:

```
http://localhost:3001/profiles
```

Должен вернуть JSON-массив.

### Ошибка CORS

В dev CORS включён в `server/index.mjs`. Если обращаетесь к `:3001` напрямую с другого origin — возможны проблемы. Используйте прокси `/api` через Vite.

### Порт занят

```
Error: listen EADDRINUSE :::3001
```

Закройте старый процесс или смените порт:

```bash
node server/index.mjs db.json --port 3002
```

### json-server 404 на профиль

ID в URL должен существовать. ID в `db.json` могут быть строками `"1"` — клиент нормализует в number.

---

## 6.6. Отладка фронтенда

### Белый экран

1. Откройте Console — есть ли ошибка JavaScript?
2. Убедитесь, что API запущен.
3. Network — падают ли запросы `/api/...` с 502/ECONNREFUSED?

### Данные не обновились

- `useProfileBets` обновляет state после мутаций; при ручном edit `db.json` — F5.
- Проверьте, не смотрите ли вы `bets` вместо `allBets` (или наоборот).

### ESLint: setState in effect

Проект следует правилу не вызывать `setState` синхронно в `useEffect` без нужды. Предпочитайте сброс state при смене props во время render (паттерн с key / условный reset), как в `useLogoWithFallback`.

---

## 6.7. Резервное копирование

### Автоматически (ежедневно)

При запуске API (`npm run server` или десктоп-приложение) сервер создаёт dated-бэкапы:

- **Папка:** `backups/` рядом с `db.json` (в десктопе — в `%AppData%\Roaming\FreedomBets\backups\`)
- **Имя:** `db-2026-06-14.json` (один файл на календарный день)
- **Хранение:** последние **5 дней**, старые удаляются
- **Полночь:** новый бэкап, пока процесс API работает

Срок хранения: `$env:FREEDOMBETS_BACKUP_RETENTION_DAYS = "10"`.

Перед синхронизацией Sports.ru дополнительно пишется `db.json.bak`.

Подробнее: [07-desktop-i-releases.md → Ежедневные бэкапы](07-desktop-i-releases.md#77-ежедневные-бэкапы-базы).

### Вручную (перед экспериментами)

```powershell
copy db.json db.json.backup
```

Восстановление:

```powershell
copy db.json.backup db.json
```

Pick'em-файлы — копируйте папку `public/uploads/pickems/`.

---

## 6.8. Миграция Pick'em

Если менялась структура путей картинок:

```bash
npm run migrate:pickems
```

Скрипт: `scripts/migratePickemImages.mjs`.

---

## 6.9. Сборка и размер бандла

`npm run build` может предупредить о chunk > 500 KB — это ожидаемо для MUI + всего приложения в одном бандле. Для pet-проекта допустимо; для оптимизации — code splitting по вкладкам (`React.lazy`).

---

## 6.10. FAQ — частые проблемы

### «Не удалось загрузить данные»

| Причина | Решение |
|---------|---------|
| API не запущен | `npm run server` |
| Неверный `activeProfileId` в localStorage | Выйти из профиля или очистить localStorage |
| Битый `db.json` | Проверить JSON валидатором, восстановить из бэкапа |

### Vite пишет `Port 5173 is in use`

Используйте URL из вывода терминала (5174, …) или завершите старый процесс Vite.

### npm warn Unknown env config "devdir"

Предупреждение npm из окружения, на работу проекта не влияет.

### Ставки пропали после смены профиля

Это нормально: `bets` — только текущий профиль. В «Топ» и под матчами — `allBets`.

### Admin-кнопки не видны

Проверьте `role: "admin"` или имя `admin` у **текущего** профиля в `db.json`.

### Логотип команды не показывается

Добавьте файл в `public/teams/` или `public/orgs/`. Имя файла зависит от slug — см. `assetLogo.ts`.

### EBUSY при записи manifest

Плагин `majorsManifest` может конфликтовать с антивирусом/индексацией Windows при записи `public/majors/manifest.json`. В проекте добавлены try/catch и debounce; при повторении — временно отключить плагин в `vite.config.ts`.

### На GitHub нет Releases

`git push` не создаёт Releases. Нужны `npm run desktop:publish` и переменная `GH_TOKEN`. Подробно: [07-desktop-i-releases.md](07-desktop-i-releases.md).

### `GH_TOKEN is not set` при publish

Задайте токен в **том же** окне PowerShell перед командой: `$env:GH_TOKEN = "ghp_..."`. Как получить токен — [07-desktop-i-releases.md § 7.4](07-desktop-i-releases.md#74-github-personal-access-token-gh_token).

### `403 Resource not accessible by personal access token`

Токен не может **создавать** Releases. Чаще всего fine-grained с **Contents: Read** вместо Read and write, или Classic без полной галочки **`repo`**. Решение: новый **Classic token** → только **`repo`** → снова `$env:GH_TOKEN` и `npm run desktop:publish`.

---

## 6.11. Git и деплой

Проект `private`. Типичный `.gitignore` исключает `node_modules/`, `dist/`.

Для «домашнего» использования достаточно:

1. Клонировать репозиторий.
2. `npm install`.
3. Запускать server + dev на своём ПК.

Для доступа из локальной сети:

```bash
npm run dev -- --host
```

(и настроить firewall; API тоже должен быть доступен или настроен proxy).

---

## 6.12. Карта ключевых файлов (шпаргалка)

| Задача | Файл |
|--------|------|
| Всё про загрузку данных | `src/features/profile/hooks/useProfileBets.ts` |
| Главный экран | `src/pages/HomePage/HomePage.tsx` |
| Вкладки | `src/features/home/components/HomeTabs/HomeTabs.tsx` |
| Форма ставки | `src/features/bets/components/BetFormDialog/BetFormDialog.tsx` |
| Матчи | `src/features/matches/components/MatchesTab/MatchesTab.tsx` |
| Связь ставка↔матч | `src/features/matches/lib/findBetsForMatch.ts` |
| Расчёты | `src/features/bets/lib/calculations/basic.ts` |
| Admin-проверка | `src/features/profile/lib/isAdminProfile.ts` |
| HTTP | `src/shared/api/httpClient.ts` |
| API-сервер | `server/index.mjs` |
| Ежедневные бэкапы | `server/lib/dbBackup.mjs` |
| Автообновление (Electron) | `electron/autoUpdater.mjs` |
| База | `db.json` |
| Прокси dev | `vite.config.ts` |

---

## 6.13. Десктоп и GitHub Releases

Сборка Windows-приложения, получение `GH_TOKEN`, публикация Release и автообновление — в отдельном разделе:

**[07-desktop-i-releases.md](07-desktop-i-releases.md)**

---

## 6.14. Куда смотреть дальше

- [Обзор и запуск](01-obzor-i-zapusk.md) — если забыли, как поднять проект.
- [База данных и API](03-baza-dannykh-i-api.md) — поля и эндпоинты.
- [Функциональность](05-funkcionalnost.md) — поведение вкладок и бизнес-правила.
- [Десктоп и релизы](07-desktop-i-releases.md) — `.exe`, token, автообновление.

Если добавляете крупную фичу — обновите соответствующий раздел документации, чтобы новичку было проще разобраться.
