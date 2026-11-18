const { getDb } = require("../db/index"); // Імпортуємо геттер

class PostRepository {
	async create(data) {
		const sql = getDb(); // Дістаємо підключення перед самим запитом
		const result = await sql`
      INSERT INTO posts (title, content, user_id)
      VALUES (${data.title}, ${data.content}, ${data.userId})
      RETURNING *
    `;
		return result[0];
	}

	async findAll() {
		const sql = getDb();

		console.log("[JOIN РІШЕННЯ] Виконуємо ОДИН об'єднаний запит...");
		// Один запит замість 101!
		const posts = await sql`
      SELECT p.*, u.username as author_name 
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;

		return posts;
	}

	async findById(id) {
		const sql = getDb();
		const result = await sql`
      SELECT * FROM posts 
      WHERE id = ${id}
    `;
		return result[0];
	}

	// Атомарно переводимо пост у статус 'queued' тільки якщо він 'draft'
	async markAsQueued(id) {
		const sql = getDb();
		const result = await sql`
      UPDATE posts
      SET status = 'queued'
      WHERE id = ${id} AND status = 'draft'
      RETURNING *
    `;
		return result[0]; // Поверне undefined, якщо пост не був draft
	}

	async updateStatus(id, status) {
		const sql = getDb();
		const result = await sql`
      UPDATE posts
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
		return result[0];
	}
}

module.exports = new PostRepository();
