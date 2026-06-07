# 3. База данных и API

## 3.1. Где хранятся данные

Все записи лежат в одном файле **`db.json`** в корне проекта.

Структура верхнего уровня:

```json
{
  "profiles": [ ... ],
  "bets": [ ... ],
  "matches": [ ... ],
  "pickems": [ ... ],
  "medals": [ ... ],
  "events": [ ... ]
}
```

> **Важно:** делайте резервные копии `db.json` перед экспериментами. Это единственный источник правды.

### Что привязано к профилю, а что общее

| Коллекция | Привязка к профилю | Пояснение |
|-----------|-------------------|-----------|
| `profiles` | — | Сами профили |
| `bets` | `profileId` | У каждой ставки есть владелец |
| `matches` | **нет** | Матчи общие для всех |
| `pickems` | `profileId` | Pick'em личный |
| `medals` | `profileId` | Медали личные |
| `events` | **нет** | Метаданные турнира (даты, tier) — общие для всех |

---

## 3.2. Profile (профиль)

### Поля

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string или number | Уникальный ID. В API при создании часто строка `"6"`, в коде нормализуется в `number` |
| `name` | string | Отображаемое имя |
| `balance` | number | Баланс в рублях (виртуальный) |
| `totalBets` | number | Количество ставок (синхронизируется из кода) |
| `winRate` | number | Винрейт 0–100 % по расчётным ставкам |
| `role` | `"admin"` (опционально) | Права администратора |

### Пример

```json
{
  "id": "3",
  "name": "admin",
  "balance": 0,
  "totalBets": 0,
  "winRate": 0,
  "role": "admin"
}
```

### API

```
GET    /profiles
GET    /profiles/:id
POST   /profiles
PATCH  /profiles/:id
DELETE /profiles/:id
```

---

## 3.3. Bet (ставка)

### Поля

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | Уникальный ID (генерирует json-server) |
| `profileId` | number | Владелец ставки |
| `date` | string | Дата матча `YYYY-MM-DD` |
| `time` | string | Время `HH:MM` |
| `format` | `"BO1"` \| `"BO3"` \| `"BO5"` | Формат серии |
| `organization1` | string | Команда 1 |
| `organization2` | string | Команда 2 |
| `betMarket` | `"match"` \| `"map"` \| `"pistol"` | Тип рынка |
| `betTeam` | `1` \| `2` | На какую команду ставка |
| `mapNumber` | number \| null | Номер карты (для `map` / `pistol`) |
| `pistolRound` | `1` \| `2` \| null | Номер пистолетки на карте |
| `betType` | string | Текстовое описание (для истории) |
| `amount` | number | Сумма ставки |
| `odds` | number | Коэффициент |
| `eventOrganization` | string | Организатор турнира |
| `eventName` | string | Название турнира |
| `eventTier` | `"Major"` \| `"Big"` \| `"Small"` | Уровень турнира |
| `majorStage` | string \| null | Стадия Major или `null` |
| `status` | `"WAIT"` \| `"WIN"` \| `"LOSE"` | Статус |

### Пример

```json
{
  "id": "0855",
  "profileId": 1,
  "date": "2026-06-04",
  "time": "13:00",
  "format": "BO3",
  "organization1": "ENCE",
  "organization2": "Entropy",
  "betMarket": "match",
  "betTeam": 1,
  "mapNumber": null,
  "pistolRound": null,
  "betType": "Победа в матче — ENCE",
  "amount": 100,
  "odds": 1.28,
  "eventOrganization": "CCT",
  "eventName": "2026 Europe Series 4 Closed Qualifier",
  "eventTier": "Small",
  "majorStage": null,
  "status": "WIN"
}
```

### API

```
GET    /bets
GET    /bets?profileId=1
GET    /bets/:id
POST   /bets
PATCH  /bets/:id
DELETE /bets/:id
```

### Логика баланса при операциях (клиент)

Описано в `useProfileBets.ts`:

| Действие | Изменение баланса |
|----------|-------------------|
| Создать ставку (WAIT) | `−amount` |
| WIN | `+amount × odds` |
| LOSE | без изменения (деньги уже списаны) |
| Удалить WAIT | `+amount` (возврат) |
| Удалить WIN | `−amount × odds` (откат выплаты) |
| Изменить сумму WAIT | разница `previous.amount − new.amount` |
| Откат WIN → WAIT | `−amount × odds` |

---

## 3.4. Match (матч)

Матчи **не принадлежат** профилю — это общее расписание/результаты.

### Поля

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | ID |
| `date`, `time` | string | Когда игра |
| `format` | MatchFormat | BO1/BO3/BO5 |
| `organization1`, `organization2` | string | Команды |
| `eventOrganization`, `eventName` | string | Турнир |
| `majorStage` | string \| null | Стадия Major |
| `score1`, `score2` | number \| null | Счёт по картам; `null` — не указан |
| `status` | `"scheduled"` \| `"finished"` | Статус |

### Пример

```json
{
  "id": "cbfa",
  "date": "2026-06-04",
  "time": "13:00",
  "format": "BO3",
  "organization1": "ENCE",
  "organization2": "Entropy",
  "eventOrganization": "CCT",
  "eventName": "2026 Europe Series 4 Closed Qualifier",
  "status": "finished",
  "score1": 2,
  "score2": 1,
  "majorStage": null
}
```

### API

```
GET    /matches
GET    /matches/:id
POST   /matches
PATCH  /matches/:id
DELETE /matches/:id
```

---

## 3.5. EventRecord (метаданные турнира)

Хранит даты и tier для турнира — **глобально**, без привязки к профилю.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | ID |
| `eventOrganization`, `eventName` | string | Ключ турнира |
| `date` | string | Дата начала |
| `endDate` | string | Дата окончания |
| `eventTier` | EventTier | Major / Big / Small |

### API

```
GET    /events
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

---

## 3.6. PickemMajor

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | ID |
| `profileId` | number | Владелец |
| `eventOrganization`, `eventName` | string | Какой Major |
| `stages` | массив | 4 стадии: Stage 1, Stage 2, Stage 3, Playoff |

Каждая стадия:

```json
{
  "stage": "Stage 1",
  "imageUrl": "/uploads/pickems/9439/stage-1.jpg",
  "result": "not_played"
}
```

- `imageUrl` — путь к файлу в `public/uploads/pickems/`.
- `result` — `"played"` \| `"not_played"` \| `null`.

### API

```
GET    /pickems?profileId=1
POST   /pickems
PATCH  /pickems/:id
DELETE /pickems/:id
POST   /pickems/:id/stage-image   # multipart: stage + file
DELETE /uploads/pickems/:pickemId # только файлы
```

#### Загрузка картинки стадии

```http
POST /pickems/9439/stage-image
Content-Type: multipart/form-data

stage=Stage 1
file=<binary image>
```

Ответ — обновлённый объект Pick'em.

---

## 3.7. ProfileMedal (медаль)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | ID |
| `profileId` | number | Владелец |
| `imageData` | string | Data URL (base64) картинки |
| `createdAt` | string | Дата `YYYY-MM-DD` |

### API

```
GET    /medals?profileId=1
POST   /medals
DELETE /medals/:id
```

---

## 3.8. Нормализация данных

Сырые данные из API могут отличаться от типов TypeScript (например, `id` профиля как строка). Перед использованием их прогоняют через **normalize-функции**:

| Файл | Сущность |
|------|----------|
| `normalizeProfile.ts` | Profile |
| `normalizeBet.ts` | Bet |
| `normalizeMatch.ts` | Match |
| `normalizeEventRecord.ts` | EventRecord |
| `normalizePickem.ts` | PickemMajor |
| `normalizeMedal.ts` | ProfileMedal |

Если нормализация падает — запись пропускается с `console.error` (для списков профилей).

---

## 3.9. Примеры запросов (curl)

Список всех ставок:

```bash
curl http://localhost:3001/bets
```

Ставки профиля 1:

```bash
curl "http://localhost:3001/bets?profileId=1"
```

Создать профиль:

```bash
curl -X POST http://localhost:3001/profiles \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"10\",\"name\":\"Тест\",\"balance\":0,\"totalBets\":0,\"winRate\":0}"
```

Обновить статус ставки:

```bash
curl -X PATCH http://localhost:3001/bets/0855 \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"WIN\"}"
```

> PATCH в json-server обычно мержит поля; клиент часто шлёт полный объект ставки.

---

## 3.10. Ручное редактирование db.json

Можно открыть `db.json` в редакторе, пока сервер запущен:

1. Сохраните файл.
2. Сервер перечитает его (watch).
3. Обновите страницу в браузере или вызовите действие, которое перезагрузит данные.

**Осторожно:** невалидный JSON сломает чтение — в консоли сервера будет ошибка parse.

---

Далее: [Фронтенд →](04-frontend.md)
