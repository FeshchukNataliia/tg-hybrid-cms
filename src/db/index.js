const postgres = require("postgres");

let pool = null;

async function initDb() {
	if (pool) return;
	if (!process.env.DATABASE_URL) {
		throw new Error("КРИТИЧНА ПОМИЛКА: Не задано DATABASE_URL");
	}

	// Пул створюється тільки тут!
	pool = postgres(process.env.DATABASE_URL, { max: 10 });

	// Перевірка з'єднання
	const result = await pool`SELECT now()`;
	console.log(`[DB] Підключення успішне! Час: ${result[0].now}`);
}

function getDb() {
	if (!pool) {
		throw new Error(
			"Базу даних ще не ініціалізовано. Викличте initDb() в server.js",
		);
	}
	return pool;
}

module.exports = { initDb, getDb };
