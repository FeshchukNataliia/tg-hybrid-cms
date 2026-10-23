# Специфікація: Telegram Hybrid CMS (v1.0.0)

## 1. Що і Навіщо (Мета)
База даних та QueueJobs: (Аудит) PostgreSQL та таблиця QueueJobs тимчасово відсутні. POST /posts наразі лише імітує роботу через console.log та одразу повертає статус 201.

## 2. Модель Даних (ER-модель PostgreSQL)
- **Users**: `id`, `email`, `password_hash`, `created_at`.
- **Channels**: `id`, `user_id` (FK), `tg_chat_id`, `tg_bot_token`, `name`.
- **Posts**: `id`, `channel_id` (FK), `content_payload` (JSONB для текстів та кнопок), `media_urls` (Array), `status` (draft, scheduled, published, failed), `scheduled_at`.
- **QueueJobs**: `id`, `post_id` (FK), `attempts`, `error_log`, `executed_at`.
Модуль Scheduler: (Аудит) Планувальник відкладених публікацій вилучено зі scope поточної версії та перенесено у беклог V2.

## 3. Архітектура та Межі (Модулі)
- **API Gateway (Express.js):** Приймає HTTP-запити, валідує payload, управляє CRUD-операціями для каналів та постів.
- **Scheduler (Timer):** Періодично сканує таблицю `Posts` (де `status = 'scheduled'` і `scheduled_at <= NOW()`) і пушить їхні ID у чергу на виконання.
- **Worker (Background Process):** Споживач черги. Забирає ID поста, дістає дані з БД, адаптує `content_payload` та виконує виклик до Telegram API. Оновлює таблиці `Posts` та `QueueJobs` за результатами.
Виправлено за результатами аудиту: API Gateway суворо ізольований від Worker. Будь-які прямі імпорти коду з src/worker всередині src/api заборонені. API лише зберігає ID поста у таблицю QueueJobs.
Залежності: (Аудит) Всі заплановані драйвери баз даних (наприклад, pg) не були додані до package.json, щоб уникнути встановлення зайвих/неправильних залежностей для модулів, які перенесено у V2.


## 4. Критерії Прийняття (Acceptance Criteria)
1. Користувач може створити відкладений пост через API.
2. Пост публікується у цільовий Telegram-канал у заданий час (з похибкою не більше 1 хвилини).
3. Якщо Telegram API недоступний (напр. Rate Limit 429), система логує помилку в `QueueJobs` і маркує пост як `failed`.