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

		// ВАЛІДАЦІЯ: Захист від невірних типів (щоб не було 500 помилки)
		if (isNaN(id) || parseInt(id) <= 0) {
			throw new Error("ValidationError: Некоректний ID поста");
		}

		// АТОМАРНЕ ОНОВЛЕННЯ: База сама гарантує, що тільки один запит пройде успішно
		const updatedPost = await postRepository.markAsQueued(id);

		if (!updatedPost) {
			// Якщо update не пройшов, перевіряємо чи пост взагалі існує
			const existingPost = await postRepository.findById(id);
			if (!existingPost) throw new Error("NotFoundError: Пост не знайдено");

			logger.info(
				`Пост з ID: ${id} вже в черзі або опубліковано. Ідемпотентна відмова.`,
			);
			return { message: "Пост вже опубліковано або знаходиться в обробці", id };
		}

		// Контекст та EventBus (Context Propagation)
		const store = asyncLocalStorage.getStore();
		const traceId = store ? store.get("traceId") : "UNKNOWN";
		const userId = store ? store.get("userId") : "UNKNOWN";

		eventBus.emit("POST_PUBLISHED", { id, traceId, userId });

		return { message: "Пост прийнято до публікації (в черзі)", id };
	}
}
module.exports = new PostService();
