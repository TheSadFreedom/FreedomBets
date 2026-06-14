# FreedomBets

**FreedomBets** — веб-приложение для учёта ставок на киберспорт (в первую очередь CS2). Несколько пользователей ведут свои профили, делают ставки, смотрят статистику, матчи, турниры, Major и Pick'em.

Это **локальный pet-проект**: данные хранятся в файле `db.json`, сервер поднимается на вашем компьютере. Настоящей авторизации с паролями нет — профиль выбирается из списка.

---

## Быстрый старт

### Что нужно установить

| Программа | Минимальная версия | Зачем |
|-----------|-------------------|--------|
| [Node.js](https://nodejs.org/) | 18+ (рекомендуется LTS) | Запуск сервера и сборки фронтенда |
| npm | идёт вместе с Node.js | Установка зависимостей |

Проверка в терминале:

```bash
node --version
npm --version
```

### Запуск (одна команда)

```bash
npm install
npm start
```

API: **http://localhost:3001**, интерфейс: **http://localhost:5173**.

> Vite проксирует запросы с `/api` на порт 3001, поэтому фронтенд обращается к `http://localhost:5173/api/...`, а до сервера доходит как `http://localhost:3001/...`.

### Другие команды

| Команда | Описание |
|---------|----------|
| `npm start` | API + dev-сервер (локальная разработка) |
| `npm run build` | Проверка TypeScript + production-сборка в `dist/` |
| `npm run preview` | Просмотр собранной версии |
| `npm run desktop:dev` | Десктоп-приложение (Electron) в режиме разработки |
| `npm run desktop` | Собранное десктоп-приложение без установщика |
| `npm run desktop:dist` | Сборка установщика Windows (`.exe` в папке `release/`) |
| `npm run lint` | Проверка кода ESLint |
| `npm run migrate:pickems` | Миграция старых изображений Pick'em (если нужно) |

### Десктоп-приложение (Windows)

**Разработка** (окно Electron + Vite):

```bash
npm run desktop:dev
```

**Установщик `.exe`** (первая сборка может занять 5–15 минут):

```bash
npm run desktop:dist
```

Или двойной клик по `build desktop.bat`.

Готовый файл появится в папке `release/`:

- `FreedomBets Setup 1.0.0.exe` — установщик (можно выбрать папку, создаст ярлыки)
- `win-unpacked/FreedomBets.exe` — portable-версия без установки

Данные приложения хранятся отдельно от установки:

`C:\Users\<имя>\AppData\Roaming\freedombets\`

Там лежат `db.json` и загруженные картинки Pick'em.

---

## Стек

- **Фронтенд:** React 19, TypeScript, Vite 7, MUI 7, styled-components, Axios
- **Бэкенд:** Node.js, json-server (REST API), lowdb (запись в JSON-файл), multer (загрузка картинок Pick'em)

---

## Документация

Подробная техническая документация для новичков — в папке [`docs/`](docs/README.md):

| Раздел | Файл |
|--------|------|
| Оглавление | [docs/README.md](docs/README.md) |
| Обзор, глоссарий, первый запуск | [docs/01-obzor-i-zapusk.md](docs/01-obzor-i-zapusk.md) |
| Архитектура и структура папок | [docs/02-arkhitektura.md](docs/02-arkhitektura.md) |
| База данных и API | [docs/03-baza-dannykh-i-api.md](docs/03-baza-dannykh-i-api.md) |
| Как устроен фронтенд | [docs/04-frontend.md](docs/04-frontend.md) |
| Функции приложения (вкладки, ставки, admin) | [docs/05-funkcionalnost.md](docs/05-funkcionalnost.md) |
| Разработка, отладка, FAQ | [docs/06-razrabotka.md](docs/06-razrabotka.md) |

---

## Лицензия

Приватный проект (`"private": true` в `package.json`).
