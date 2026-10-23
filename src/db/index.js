// src/db/index.js
const postgres = require("postgres");

// Підключення до БД (порт 5435, щоб не порушувати вимогу викладача про 5432-5434)
const sql = postgres("postgres://admin:admin@localhost:5435/hybrid_cms", {
	max: 10, // Обмеження пулу з'єднань
});

async function initDb() {
	try {
		console.log("[DB] Ініціалізація пулу з'єднань...");
		// Вимога викладача: SELECT now() на старті
		const result = await sql`SELECT now()`;
		console.log(`[DB] Підключення успішне! Час сервера БД: ${result[0].now}`);
	} catch (error) {
		console.error(
			"[DB] КРИТИЧНА ПОМИЛКА: Неможливо підключитися до бази даних.",
		);
		console.error(error);
		// Вимога викладача: "падати одразу"
		process.exit(1);
	}
}

module.exports = { sql, initDb };
