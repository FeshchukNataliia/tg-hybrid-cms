// src/repositories/post.repository.js
const posts = []; // Статичні дані (In-Memory БД)
let currentId = 1;

class PostRepository {
	async create(postData) {
		const newPost = {
			id: currentId++,
			...postData,
			status: "draft",
			createdAt: new Date().toISOString(),
		};
		posts.push(newPost);
		return newPost;
	}

	async findAll() {
		return posts; // У майбутньому тут буде імітація проблеми N+1
	}

	async findById(id) {
		return posts.find((p) => p.id === Number(id));
	}

	async updateStatus(id, status) {
		const post = await this.findById(id);
		if (post) {
			post.status = status;
		}
		return post;
	}
}

module.exports = new PostRepository();
