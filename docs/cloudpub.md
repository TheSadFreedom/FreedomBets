# Публикация через CloudPub

[CloudPub](https://cloudpub.ru/) — туннель: ваш локальный сервер становится доступен по HTTPS-ссылке вида `https://….cloudpub.ru`.

FreedomBets публикуется **одним портом** (8080): фронтенд + API через прокси `/api`.

## 1. Установите CloudPub CLI

1. Скачайте `clo` для Windows: [документация](https://cloudpub.ru/docs/)
2. Распакуйте и добавьте папку в `PATH`
3. Войдите:

```powershell
clo login ваш@email.com
```

Или задайте токен из личного кабинета:

```powershell
clo set token ВАШ_ТОКЕН
```

## 2. Запуск одной командой

```powershell
npm install
npm run cloudpub
```

Скрипт:
1. Собирает фронтенд (`npm run build`)
2. Запускает API на `:3001` и preview на `:8080`
3. Публикует `http://8080` через CloudPub

В консоли появится публичный URL, например:

```
Сервис опубликован: http://localhost:8080 -> https://wildly-suitable-fish.cloudpub.ru
```

## 3. Пошаговый запуск (вручную)

**Терминал 1** — приложение:

```powershell
npm run serve
```

**Терминал 2** — туннель:

```powershell
clo publish http 8080 --name freedombets
```

### Базовая защита паролем (рекомендуется)

Приложение без паролей — ограничьте доступ на стороне CloudPub:

```powershell
clo publish http 8080 --name freedombets --auth basic
```

## 4. Docker + CloudPub

```powershell
copy .env.example .env
# Укажите CLOUDPUB_TOKEN в .env

docker compose -f docker-compose.cloudpub.yml up --build
```

Логи туннеля: `docker compose -f docker-compose.cloudpub.yml logs cloudpub`

## Важно

| Тема | Пояснение |
|------|-----------|
| **ПК должен быть включён** | CloudPub пробрасывает туннель на ваш компьютер, это не облачный хостинг |
| **Данные** | `db.json` и загрузки остаются локально на вашей машине |
| **Порт** | По умолчанию `8080` (`CLOUDPUB_PORT` в `.env`) |
| **Остановка** | `Ctrl+C` в терминале или `clo unpublish <guid>` |

## Локальная разработка

Для разработки по-прежнему:

```powershell
npm start
```

— API `:3001`, Vite `:5173` (без туннеля).
