// src/db/index.js
const postgres = require("postgres");

const sql = postgres("postgres://admin:admin@localhost:5435/hybrid_cms", {
	max: 10,
});

async function initDb() {
	console.log("[DB] Ініціалізація пулу з'єднань...");
	// Якщо база не відповість, помилка просто вилетить з цієї функції нагору
	const result = await sql`SELECT now()`;
	console.log(`[DB] Підключення успішне! Час сервера БД: ${result[0].now}`);
}

module.exports = { sql, initDb };
