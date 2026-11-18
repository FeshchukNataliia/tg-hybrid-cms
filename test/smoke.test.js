const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../src/app"); // Переконайся, що шлях до твого app.js правильний

test("Smoke Test: API is running and /version returns 200", async () => {
	// Робимо реальний HTTP-запит до нашого додатку в пам'яті
	const response = await request(app).get("/version");

	// Перевіряємо, що сервер відповів 200 OK
	assert.strictEqual(response.status, 200, "Статус код має бути 200");

	// Перевіряємо тіло відповіді
	assert.strictEqual(response.body.status, "ok", 'Статус у тілі має бути "ok"');
	assert.strictEqual(response.body.version, "1.0.0", "Версія має співпадати");
});
