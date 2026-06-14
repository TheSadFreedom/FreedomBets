# Техническая документация FreedomBets

Документация написана так, чтобы её мог прочитать **новичок**: с объяснением терминов, пошаговым запуском и схемами «кто с кем разговаривает».

## Оглавление

1. **[Обзор и запуск](01-obzor-i-zapusk.md)**  
   Что делает приложение, словарь терминов, установка Node.js, первый запуск, что видно в браузере.

2. **[Архитектура](02-arkhitektura.md)**  
   Клиент ↔ сервер ↔ `db.json`, дерево папок проекта, слои кода (entities, features, shared).

3. **[База данных и API](03-baza-dannykh-i-api.md)**  
   Все сущности в `db.json`, поля, примеры JSON, REST-эндпоинты, загрузка файлов.

4. **[Фронтенд](04-frontend.md)**  
   Точка входа, `useProfileBets`, маршрутизация экранов, стили, HTTP-клиент, нормализация данных.

5. **[Функциональность](05-funkcionalnost.md)**  
   Профили, ставки, матчи, турниры, Major, Pick'em, медали, рейтинг, права admin.

6. **[Разработка](06-razrabotka.md)**  
   Как добавить фичу, соглашения по коду, lint/build, типичные ошибки, бэкап `db.json`.

7. **[Десктоп, релизы и автообновление](07-desktop-i-releases.md)**  
   Electron, сборка `.exe`, GitHub token, публикация Release, автообновление, ежедневные бэкапы.

## С чего начать

| Вы хотите… | Читайте |
|------------|---------|
| Просто запустить приложение | [01-obzor-i-zapusk.md](01-obzor-i-zapusk.md) → раздел «Первый запуск» |
| Понять, где лежит код ставок | [02-arkhitektura.md](02-arkhitektura.md) → «Структура `src/`» |
| Добавить поле в ставку | [03-baza-dannykh-i-api.md](03-baza-dannykh-i-api.md) + [06-razrabotka.md](06-razrabotka.md) |
| Понять, почему ставка не привязалась к матчу | [05-funkcionalnost.md](05-funkcionalnost.md) → «Связь ставки и матча» |
| Сделать новую вкладку | [04-frontend.md](04-frontend.md) + [05-funkcionalnost.md](05-funkcionalnost.md) |
| Собрать `.exe` или опубликовать Release | [07-desktop-i-releases.md](07-desktop-i-releases.md) |
| Получить GitHub token для публикации | [07-desktop-i-releases.md → GH_TOKEN](07-desktop-i-releases.md#74-github-personal-access-token-gh_token) |
| Понять, почему нет Releases на GitHub | [07-desktop-i-releases.md → GitHub Releases](07-desktop-i-releases.md#73-github-releases--почему-их-может-не-быть) |

## Схема системы (кратко)

```
Браузер (React)
    │  HTTP  /api/*
    ▼
Vite dev-server :5173  ──proxy──►  Node API :3001
                                        │
                                        ▼
                                   db.json  +  public/uploads/
```
