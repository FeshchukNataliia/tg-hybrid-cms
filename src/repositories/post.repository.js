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
		// Поки що простий селект, але тут ми скоро зробимо імітацію N+1
		const result = await sql`
      SELECT * FROM posts 
      ORDER BY created_at DESC
    `;
		return result;
	}

	async findById(id) {
		const sql = getDb();
		const result = await sql`
      SELECT * FROM posts 
      WHERE id = ${id}
    `;
		return result[0];
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
