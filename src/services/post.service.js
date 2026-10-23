// src/services/post.service.js
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

		logger.info(`Оновлення статусу поста ${id} на published...`);
		return postRepository.updateStatus(id, "published");
	}
}

module.exports = new PostService();
