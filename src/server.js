// src/server.js
const app = require("./app");
const { initDb } = require("./db");

const PORT = 3000;

async function start() {
	// Явна ініціалізація ресурсів до запуску HTTP-сервера
	await initDb();

	app.listen(PORT, () => {
		console.log(`[Server] API працює на порту ${PORT}`);
	});
}

start();
