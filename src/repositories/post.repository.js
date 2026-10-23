// src/repositories/post.repository.js
const { sql } = require("../db");
const logger = require("../utils/logger");

class PostRepository {
	async create(postData) {
		logger.info("Виконання SQL-запиту: INSERT INTO posts...");
		const result = await sql`
      INSERT INTO posts (user_id, title, content, status) 
      VALUES (${postData.userId}, ${postData.title}, ${postData.content}, 'draft') 
      RETURNING *
    `;
		return result[0];
	}

	async findAll() {
		// Зараз це простий запит, пізніше (на Етапі 4) ми штучно зробимо тут проблему N+1
		return sql`SELECT * FROM posts`;
	}

	async findById(id) {
		const result = await sql`SELECT * FROM posts WHERE id = ${id}`;
		return result.length ? result[0] : null;
	}

	async updateStatus(id, status) {
		const result = await sql`
      UPDATE posts 
      SET status = ${status} 
      WHERE id = ${id} 
      RETURNING *
    `;
		return result.length ? result[0] : null;
	}
}

module.exports = new PostRepository();
