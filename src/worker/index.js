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

	try {
		logger.info(`[WORKER] Початок фонової публікації поста ${id}...`);

		// Імітація важкої роботи (наприклад, відправка в Telegram)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Уявимо, що тут може статися помилка мережі. Якщо все ок:
		await postRepository.updateStatus(id, "published");
		logger.info(`[WORKER] Пост ${id} успішно опубліковано`);
	} catch (error) {
		logger.error(
			`[WORKER] КРИТИЧНА ПОМИЛКА під час публікації поста ${id}`,
			error,
		);
		// Компенсаційна дія: відмічаємо пост як failed
		await postRepository
			.updateStatus(id, "failed")
			.catch((e) =>
				logger.error(
					`[WORKER] Не вдалося встановити статус failed для ${id}`,
					e,
				),
			);
	}
});
