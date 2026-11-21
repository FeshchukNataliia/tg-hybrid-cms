# ADR 0003: Стек тестування, мутаційного аналізу та оркестрації `make test`

- **Status:** Accepted
- **Date:** 2026-11-21

## Context (Контекст і проблема)
- Проєкт `tg-hybrid-cms` побудовано на Node.js у форматі CommonJS (`"type": "commonjs"`), PostgreSQL у Docker (`postgres:15-alpine`, порт `5435`, том `pgdata`) та Express 5.
- Для Лабораторної №3 потрібні 3 рівні тестів (Unit із 100% покриттям гілок `branches` для `src/services/post.service.js`, Integration із реальною БД, E2E), мутаційне тестування через StrykerJS та відтворюваний запуск однією командою (`make test`, `make mutation`).
- Цільовий модуль `src/services/post.service.js` експортує синглтон (`new PostService()`) і напряму імпортує залежності (`postRepository`, `eventBus`, `logger`, `asyncLocalStorage`).

## Considered Options (Розглянуті альтернативи)
### 1. Тест-раннер і мутаційне тестування
1. **Jest + `@stryker-mutator/jest-runner`**
2. **Vitest + `@stryker-mutator/vitest-runner`**
3. **Нативний `node:test` + Stryker `command` runner**

### 2. Ізоляція залежностей у Unit-тестах (`PostService`)
1. **Мокування через `jest.spyOn`** без рефакторингу production-коду на старті.
2. **Попередній рефакторинг `PostService` під Dependency Injection** (передача залежностей у конструктор).

### 3. Оркестрація та стан тестової БД (`make test`)
1. **GNU `Makefile` + існуючий `docker-compose.yml` (`5435`)** з очікуванням `pg_isready` та очищенням таблиць (`TRUNCATE`) перед тестами.
2. **Окремий ефемерний `docker-compose.test.yml`** (інший порт, без `pgdata`).
3. **Повне перестворення контейнера (`docker compose down -v`)** на кожному запуску.

## Decision Outcome (Обрані рішення)
- **Jest + `@stryker-mutator/jest-runner`**: нативна сумісність із CommonJS, офіційний плагін Stryker із режимом `coverageAnalysis: "perTest"`, вбудований звіт `Branches` без зайвих плагінів.
Vitest відхилено через потенційні нюанси мокування CommonJS-модулів.
node:test — через відсутність офіційного плагіна Stryker.
- **`jest.spyOn`**: тестуємо реальний код Лаби №2 як є, без ризику внести регресію до появи базових тестів.
- **GNU `Makefile` + існуючий `docker-compose.yml` з `pg_isready` та `TRUNCATE`:** швидкі повторні прогони без зайвих .env.test і конфліктів портів на Windows.

## Consequences (Наслідки)
### Позитивні (Good)
- Швидкий і точний мутаційний аналіз (`perTest`) + прозора метрика покриття гілок (`branches`).
- Відтворюваний запуск усіх рівнів тестів і мутацій однією командою (`make test`, `make mutation`) локально на Windows та в середовищі рев'юера.
- Чиста перевірка існуючого `post.service.js` без передчасних змін у прод-коді.

### Негативні / Компроміси (Bad)
- `jest` збільшує `node_modules` і стартує повільніше за `node:test`; існуючий `test/smoke.test.js` потрібно адаптувати під Jest.
- `jest.spyOn` прив'язаний до кешу `require` (при переході на ESM у майбутньому знадобиться DI).
- Використання спільної локальної БД hybrid_cms призводить до очищення локальних даних розробки під час запуску інтеграційних тестів.