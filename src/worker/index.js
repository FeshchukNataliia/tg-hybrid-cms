// src/worker/index.js
const eventBus = require("../utils/eventBus");
const postRepository = require("../repositories/post.repository");
const logger = require("../utils/logger");
const { asyncLocalStorage } = require("../utils/context");

logger.info("[WORKER] Ініціалізація фонового воркера... Підписка на події.");

eventBus.on("POST_PUBLISHED", async (payload) => {
	const { id, traceId, userId } = payload;

	// 1. Створюємо нове сховище для фонового процесу
	const store = new Map();
	store.set("traceId", traceId);
	store.set("userId", userId);

	// 2. Запускаємо роботу з БД ВСЕРЕДИНІ відновленого контексту
	asyncLocalStorage.run(store, async () => {
		try {
			logger.info(`[WORKER] Початок фонової публікації поста ${id}...`);

			// Штучна затримка для демонстрації асинхронності (можна прибрати)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await postRepository.updateStatus(id, "published");
			logger.info(`[WORKER] Пост ${id} успішно оновлено в БД`);
		} catch (error) {
			logger.error(`[WORKER] Помилка під час публікації поста ${id}`, error);
		}
	});
});
