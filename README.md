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

### Запуск (два терминала)

**Терминал 1 — API и база данных:**

```bash
npm install
npm run server
```

Сервер стартует на **http://localhost:3001** и читает/пишет `db.json`.

**Терминал 2 — интерфейс:**

```bash
npm run dev
```

Откройте в браузере **http://localhost:5173**.

> Vite проксирует запросы с `/api` на порт 3001, поэтому фронтенд обращается к `http://localhost:5173/api/...`, а до сервера доходит как `http://localhost:3001/...`.

### Другие команды

| Команда | Описание |
|---------|----------|
| `npm run build` | Проверка TypeScript + production-сборка в `dist/` |
| `npm run preview` | Просмотр собранной версии |
| `npm run lint` | Проверка кода ESLint |
| `npm run migrate:pickems` | Миграция старых изображений Pick'em (если нужно) |

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
