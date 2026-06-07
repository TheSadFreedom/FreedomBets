# 4. Фронтенд

## 4.1. Точка входа

```
index.html
    └── <script src="/src/index.tsx">
            └── ReactDOM.createRoot(...).render(<App />)
```

`src/index.tsx` подключает глобальный CSS (`index.css`) и рендерит `App` в `<div id="root">`.

`React.StrictMode` в dev дважды вызывает некоторые эффекты — это нормально для React 19.

---

## 4.2. `App.tsx` — маршрутизация без react-router

В проекте **нет** react-router. Один экран выбирается условным рендерингом:

```tsx
// Упрощённо
if (loading) return <PageLoader />;
if (error) return <PageError />;
if (!profile) return <ProfileGate />;
return <HomePage />;
```

| Состояние | Экран |
|-----------|-------|
| `loading === true` | Спиннер |
| `error` | Ошибка + кнопка «Повторить» |
| `profile === null` | Выбор/создание профиля |
| иначе | Главная с вкладками |

Обёртки:

- `AppProviders` — MUI `ThemeProvider`, `CssBaseline`, глобальные стили.
- `AppLayout` — шапка; `ProfileHeader` показывается только когда профиль выбран.

---

## 4.3. Выбор профиля

### `ProfileGate`

`src/features/profile/components/ProfileGate/ProfileGate.tsx`

- Список кнопок существующих профилей.
- Поле ввода + «Создать» для нового.

### Хранение активного профиля

`src/features/profile/lib/activeProfileStorage.ts`

- Ключ в `localStorage`: `freedombets.activeProfileId`.
- При `selectProfile(id)` — запись в storage и `setActiveProfileId`.
- `exitProfile()` — очистка, возврат на экран выбора.

---

## 4.4. `useProfileBets` — главный источник данных

Файл: `src/features/profile/hooks/useProfileBets.ts`

### Загрузка при смене профиля

Параллельно запрашивается:

```ts
GET /profiles/:id
GET /bets?profileId=:id
GET /bets                    // все ставки
GET /profiles
GET /matches
GET /pickems?profileId=:id
GET /medals?profileId=:id
GET /events?profileId=:id
```

### Возвращаемый объект (основное)

| Поле / метод | Назначение |
|--------------|------------|
| `profile`, `profiles` | Текущий и все профили |
| `bets` | Ставки текущего профиля |
| `allBets` | Все ставки (все профили) |
| `matches` | Все матчи |
| `pickems`, `medals`, `events` | Данные текущего профиля |
| `addBet`, `updateBet`, `deleteBet` | CRUD ставок |
| `settleWin`, `settleLose`, `revertToPending` | Смена статуса |
| `addMatch`, `updateMatch`, `deleteMatch` | Матчи |
| `addEvent`, `updateEvent` | Ивенты |
| `addPickemMajor`, `uploadPickemStageImage`, … | Pick'em |
| `uploadMedal`, `deleteMedal` | Медали |
| `setBalance`, `updateProfileName`, `deleteProfile` | Профиль |
| `selectProfile`, `createProfile`, `exitProfile` | Сессия |
| `reload` | Повторная загрузка |

`HomePage` получает всё это через prop `profileBets: ProfileBetsState`.

---

## 4.5. `HomePage` и диалоги

`src/pages/HomePage/HomePage.tsx`

Собирает:

1. **HomeTabs** — вкладки с контентом.
2. **HomeQuickActions** — кнопки admin (новый матч / ивент).
3. Модальные окна:
   - `MatchFormDialog` — создание матча;
   - `EventFormDialog` — создание ивента;
   - `BetFormDialog` — создание/редактирование ставки.

Ставка из матча: `handleBetFromMatch` → `matchToBetSeed` → открывает `BetFormDialog` с предзаполнением.

---

## 4.6. `HomeTabs` — восемь вкладок

`src/features/home/components/HomeTabs/HomeTabs.tsx`

| № | ID | Компонент | Данные |
|---|-----|-----------|--------|
| 0 | matches | `MatchesTab` | `allBets` для ставок под матчем, `bets` для формы |
| 1 | bets | `BetsHistory` | `bets` |
| 2 | summary | `StatsSummary` | `bets` |
| 3 | ranking | `ProfileRankingTab` | `allBets`, `profiles` |
| 4 | teams | `TeamsTab` | `allBets` |
| 5 | events | `EventStats` | `bets` (без Major) |
| 6 | majors | `MajorEventStats` | `bets` (только Major) |
| 7 | pickem | `PickemTab` | `pickems`, `medals` |

Вкладки — MUI `Tabs` + кастомный `TabsBar` (styled-components): иконки, сетка, pill-стиль активной вкладки.

Состояние активной вкладки: `useState(0)` — при перезагрузке страницы сбрасывается на «Матчи».

---

## 4.7. Стилизация

### Два подхода одновременно

1. **MUI** — таблицы, диалоги, поля ввода, тема (`src/app/theme/theme.ts`).
2. **styled-components** — карточки матчей, вкладки, ProfileGate, тост логотипа.

Файлы стилей рядом с компонентом: `ComponentName.styled.ts`.

### Глобальные стили

`src/app/styles/global.styled.ts` — фон, шрифт Play, сброс скроллбаров.

### Адаптив

`src/shared/styles/breakpoints.ts` — медиа-запросы для сетки вкладок (8 → 4 → 2 колонки).

---

## 4.8. Логотипы команд и организаций

`TeamLogo` / `OrganizationLogo` → `useLogoWithFallback` / `useMultiSrcLogo`

Алгоритм:

1. По имени команды строится slug (транслит, lowercase).
2. Пробуются пути вида `/teams/{slug}.png`, `.webp`, …
3. Если файла нет — показывается заглушка (инициалы).

Добавить логотип команды: положить файл в `public/teams/` с правильным именем (см. `shared/lib/logos/teamLogo.ts`).

---

## 4.9. Формы и подсказки

`SuggestTextField` — поле с автодополнением из уже существующих названий (команды, ивенты).

`BetFormDialog` — самая большая форма: выбор ивента, команд, рынка, карты, пистолетки, суммы, кэфа. Валидация баланса перед отправкой.

`DateInput` / `TimeInput` — парсинг ввода пользователя (`parseDateInput`, `parseTimeInput`).

---

## 4.10. Entities vs Features

### Entities (`src/entities/`)

**Только типы и чистые функции** без React и без API.

Примеры:

- `Bet`, `BetStatus`, `BET_MARKET_LABELS` — `entities/bet/`
- `formatBetDescriptionLines(bet)` — текст ставки для UI
- `Match`, `MATCH_STATUSES` — `entities/match/`

### Features (`src/features/`)

UI + бизнес-логика домена:

- `features/bets/lib/calculations/` — профит, винрейт, exposure
- `features/matches/lib/findBetsForMatch.ts` — связь ставки и матча
- `features/profile/lib/buildProfileRankings.ts` — таблица «Топ»

---

## 4.11. Типичный путь добавления UI-элемента

1. Определить, нужен ли новый тип в `entities/`.
2. Добавить normalize + API-поле в `db.json` (если новые данные).
3. Расширить `useProfileBets` (загрузка + мутация).
4. Пробросить props через `HomePage` → `HomeTabs` → ваш компонент.
5. Стили в `.styled.ts`, логику — в `lib/` рядом с feature.

---

## 4.12. Алиас `@/`

Вместо `import { Bet } from "../../../entities/bet"`:

```ts
import type { Bet } from "@/entities/bet";
```

Настроено в `tsconfig.app.json` и `vite.config.ts`.

---

Далее: [Функциональность →](05-funkcionalnost.md)
