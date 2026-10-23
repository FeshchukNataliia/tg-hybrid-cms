// src/services/post.service.js
const eventBus = require("../utils/eventBus");
const postRepository = require("../repositories/post.repository");
const logger = require("../utils/logger"); // Наш логер
const { asyncLocalStorage } = require("../utils/context"); // Контекст

class PostService {
	async createDraft(data) {
		logger.info(`Запит на створення чернетки: ${data.title}`);

		if (!data.title || typeof data.title !== "string") {
			throw new Error(
				"ValidationError: Поле title є обовʼязковим і має бути рядком",
			);
		}
		if (!data.content) {
			throw new Error("ValidationError: Поле content є обовʼязковим");
		}

		// Дістаємо userId з контексту, без передачі через аргументи роута!
		const store = asyncLocalStorage.getStore();
		const userId = store ? store.get("userId") : 1;

		logger.info(`Користувач [${userId}] пройшов валідацію. Звернення до БД...`);

		return postRepository.create({
			title: data.title,
			content: data.content,
			userId: userId,
		});
	}

	async getFeed() {
		logger.info("Запит на отримання стрічки постів");
		return postRepository.findAll();
	}

	async publishPost(id) {
		logger.info(`Запит на публікацію поста з ID: ${id}`);
		const post = await postRepository.findById(id);

		if (!post) {
			throw new Error("NotFoundError: Пост не знайдено");
		}
		if (post.status === "published") {
			logger.info(`Пост з ID: ${id} вже опубліковано, повертаємо існуючий`);
			return post;
		}

		// Дістаємо контекст поточного HTTP-запиту
		const store = asyncLocalStorage.getStore();
		const traceId = store ? store.get("traceId") : "UNKNOWN";
		const userId = store ? store.get("userId") : "UNKNOWN";

		logger.info("Відправка завдання на публікацію у фоновий воркер...");

		// ПУБЛІКУЄМО ПОДІЮ У ШИНУ (Прокидаємо payload + контекст)
		eventBus.emit("POST_PUBLISHED", { id, traceId, userId });

		// Віддаємо миттєву відповідь клієнту (Event-Driven підхід)
		return { message: "Пост прийнято до публікації (в черзі)", id };
	}
}
module.exports = new PostService();
