// src/services/post.service.js
const postRepository = require("../repositories/post.repository");

class PostService {
	async createDraft(data) {
		// Шлях А: Базова ручна валідація
		if (!data.title || typeof data.title !== "string") {
			throw new Error(
				"ValidationError: Поле title є обовʼязковим і має бути рядком",
			);
		}
		if (!data.content) {
			throw new Error("ValidationError: Поле content є обовʼязковим");
		}

		// Передаємо об'єкт (DTO), щоб уникнути "протягування 10-15 параметрів"
		return postRepository.create({
			title: data.title,
			content: data.content,
			userId: 1, // Поки що хардкод, на Етапі 3 зробимо через AsyncLocalStorage
		});
	}

	async getFeed() {
		return postRepository.findAll();
	}

	async publishPost(id) {
		const post = await postRepository.findById(id);
		if (!post) {
			throw new Error("NotFoundError: Пост не знайдено");
		}

		// Ідемпотентність: якщо вже опубліковано, нічого не робимо
		if (post.status === "published") {
			return post;
		}

		return postRepository.updateStatus(id, "published");
	}
}

module.exports = new PostService();
