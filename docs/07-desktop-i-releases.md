# 7. Десктоп-приложение, релизы и автообновление

FreedomBets можно запускать как **Windows-приложение** (Electron): внутри работают тот же API и React, но всё поднимается в одном окне без браузера.

---

## 7.1. Режимы запуска

| Команда | Что делает |
|---------|------------|
| `npm run desktop:dev` | Vite + Electron в режиме разработки (HMR) |
| `npm run desktop` | Production-сборка фронта + Electron без установщика |
| `npm run desktop:dist` | Сборка `.exe` **локально** в папку `release/` |
| `npm run desktop:publish` | Сборка + **загрузка** на GitHub Releases |

Или двойной клик по `build desktop.bat` — то же, что `desktop:dist`.

Первая сборка установщика может занять **5–15 минут** (скачивается Electron, упаковываются `node_modules`).

---

## 7.2. Где лежат данные десктоп-приложения

Установка (`.exe`) и пользовательские данные **разделены**.

| Что | Где |
|-----|-----|
| Программа | Папка, выбранная при установке (например `C:\Program Files\FreedomBets\`) |
| База и загрузки | `%AppData%\Roaming\FreedomBets\` |

> **Не путать с папкой установки.** Файл `resources\db.json` внутри `.exe`/Program Files — только **шаблон при первом запуске**. Дальше приложение читает и пишет **`%AppData%\Roaming\FreedomBets\db.json`**. Переустановка и обновление **не заменяют** эту базу.

В настройках профиля (десктоп): **Данные приложения → Открыть папку данных**.

Чтобы подставить базу из разработки: закройте приложение, сделайте бэкап `db.json` в AppData, скопируйте нужный `db.json` на его место.

В userData:

- `db.json` — ваша база (ставки, профили, матчи…);
- `public/` — картинки Pick'em и другие загрузки;
- `backups/` — ежедневные копии базы (см. [раздел 7.6](#76-ежедневные-бэкапы-базы)).

> В режиме `npm run server` + `npm run dev` база лежит в **корне проекта** (`db.json`), а не в AppData.

---

## 7.3. GitHub Releases — почему их может не быть

Раздел [Releases](https://github.com/TheSadFreedom/FreedomBets/releases) на GitHub **не создаётся автоматически** при `git push`.

| Действие | Создаёт Release? |
|----------|------------------|
| `git push` | Нет — только код в репозитории |
| `npm run desktop:dist` | Нет — файлы только в локальной `release/` |
| `npm run desktop:publish` с `GH_TOKEN` | **Да** — `.exe`, `latest.yml`, тег версии |

Без хотя бы одного опубликованного Release автообновление в установленном приложении **не найдёт** новую версию.

---

## 7.4. GitHub Personal Access Token (`GH_TOKEN`)

`electron-builder` загружает файлы через GitHub API. Для этого нужен **Personal Access Token** (PAT) — отдельный «пароль для программ», не ваш обычный пароль от GitHub.

### Вариант A — Classic token (рекомендуется для `desktop:publish`)

С fine-grained токенами часто приходит `403 Resource not accessible by personal access token` — для Releases надёжнее Classic.

1. Откройте: [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token → Generate new token (classic)**
3. **Note:** например `FreedomBets publish`
4. **Expiration:** на ваш выбор (90 days / No expiration)
5. Отметьте галочку **`repo`** (полный доступ к репозиториям — **обязательно** для создания Releases)
6. **Generate token**
7. **Скопируйте токен сразу** — он показывается **один раз**, начинается с `ghp_`

> Не ставьте только `public_repo`, если репозиторий приватный. Для FreedomBets достаточно **`repo`**.

### Вариант B — Fine-grained token (если Classic недоступен)

1. Откройте: [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens)
2. **Generate new token**
3. **Repository access:** Only select repositories → **FreedomBets**
4. **Repository permissions → Contents:** **Read and write** (не Read-only)
5. Создайте токен — начинается с `github_pat_`

Если после этого всё равно `403 Resource not accessible by personal access token` — используйте **Classic token с `repo`** (вариант A).

### Безопасность

- Не коммитьте токен в git, не вставляйте в чаты и README
- Токен действует только в том терминале, где вы его задали (`$env:GH_TOKEN`)
- Если токен утёк — **Revoke** на GitHub и создайте новый

---

## 7.5. Публикация релиза (пошагово)

### Шаг 1. Поднимите версию

В `package.json` измените поле `"version"`, например с `1.0.0` на `1.0.1`.  
Именно эта версия попадёт в Release и в автообновление.

### Шаг 2. Задайте токен в PowerShell

```powershell
cd D:\Projects\FreedomBets
$env:GH_TOKEN = "ghp_ваш_токен"
```

(или `github_pat_...` для fine-grained)

### Шаг 3. Опубликуйте

```powershell
npm run desktop:publish
```

Скрипт:

1. собирает фронтенд (`npm run build`);
2. упаковывает Electron (`electron-builder --win --publish always`);
3. создаёт GitHub Release с тегом `v<version>`;
4. загружает:
   - `FreedomBets Setup X.Y.Z.exe` — установщик;
   - `latest.yml` — манифест для `electron-updater`;
   - `.blockmap` — для дельта-обновлений.

### Быстрая повторная загрузка (без полной пересборки)

Если в `release/` уже лежат актуальные артефакты после `desktop:dist`:

```powershell
$env:GH_TOKEN = "ghp_..."
npx electron-builder --win --publish always
```

### Проверка токена перед publish

В PowerShell (подставьте свой токен):

```powershell
$env:GH_TOKEN = "ghp_..."
curl.exe -s -H "Authorization: Bearer $env:GH_TOKEN" https://api.github.com/repos/TheSadFreedom/FreedomBets/releases | Select-Object -First 5
```

- **`[]`** или список релизов — токен читает репозиторий, ок.
- **`401 Bad credentials`** — неверный или отозванный токен.
- **`404`** — токен не видит репозиторий (не тот аккаунт или нет доступа).

Создание Release проверяется только командой `desktop:publish`; если снова `403`, пересоздайте **Classic** token с галочкой **`repo`**.

### Шаг 4. Проверка

Откройте [github.com/TheSadFreedom/FreedomBets/releases](https://github.com/TheSadFreedom/FreedomBets/releases) — должен появиться релиз с `.exe` и `latest.yml`.

### Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `GitHub Personal Access Token is not set` | Не задан `GH_TOKEN` | `$env:GH_TOKEN = "..."` в том же окне PowerShell |
| `403` / `Resource not accessible by personal access token` | Fine-grained без **Contents: Read and write**, или Classic без **`repo`**, или токен другого аккаунта | Создайте **Classic token** с галочкой **`repo`**, задайте заново в том же терминале |
| `403` / `Bad credentials` | Неверный или отозванный токен | Создайте новый токен |
| Release пустой на сайте | Запускали только `desktop:dist` | Нужен `desktop:publish` с токеном |

---

## 7.6. Автообновление в установленном приложении

Реализовано через `electron-updater` и GitHub Releases.

### Как работает

1. Через ~**8 секунд** после запуска packaged-приложение проверяет Releases.
2. Если версия на GitHub новее — скачивает установщик в фоне.
3. После загрузки — диалог **«Перезапустить и установить»**.
4. При выходе из приложения обновление тоже может установиться (`autoInstallOnAppQuit`).

### Ручная проверка

**Профиль → настройки (шестерёнка) → Обновления → Проверить обновления**.

### Ограничения

| Ситуация | Поведение |
|----------|-----------|
| `npm run desktop:dev` | Автообновление **отключено** |
| Первый релиз с updater | Пользователям на **старой** сборке без updater нужен **один** ручной `.exe`; дальше — автоматически |
| Нет Release на GitHub | «Установлена последняя версия» или ошибка проверки |

Код: `electron/autoUpdater.mjs`, UI: `DesktopUpdateSection.tsx` в настройках профиля.

---

## 7.7. Ежедневные бэкапы базы

При каждом запуске API (и в десктоп-приложении) работает планировщик в `server/lib/dbBackup.mjs`.

| Параметр | Значение |
|----------|----------|
| Когда | При старте сервера + каждую **полночь** (локальное время), пока процесс жив |
| Куда | `backups/db-YYYY-MM-DD.json` рядом с `db.json` |
| Сколько хранить | **5 дней** по умолчанию, старше — удаляются |
| Повтор в тот же день | Не перезаписывает уже созданный файл |

Настройка срока хранения:

```powershell
$env:FREEDOMBETS_BACKUP_RETENTION_DAYS = "10"
npm run server
```

Отдельно перед синхронизацией Sports.ru создаётся быстрый снимок `db.json.bak` (на случай гонки при долгой записи).

Ручной бэкап перед экспериментами — см. [06-razrabotka.md → Резервное копирование](06-razrabotka.md#67-резервное-копирование).

---

## 7.8. Схема: от кода до обновления у пользователя

```
Разработчик                          GitHub                         Пользователь
     │                                  │                                │
     │  npm run desktop:publish         │                                │
     │  (GH_TOKEN)                      │                                │
     ├─────────────────────────────────►│  Release v1.0.1                │
     │                                  │  + Setup.exe + latest.yml      │
     │                                  │                                │
     │                                  │  electron-updater              │
     │                                  │◄───────────────────────────────┤
     │                                  │  проверка / скачивание         │
     │                                  ├───────────────────────────────►│
     │                                  │                                │  перезапуск
```

---

Далее: [Разработка →](06-razrabotka.md) | [Оглавление →](README.md)
