// src/server.js
const app = require("./app");
const { initDb } = require("./db");
const logger = require("./utils/logger"); // Наш крутий логер

const PORT = 3000;

async function start() {
	try {
		await initDb();
		app.listen(PORT, () => {
			logger.info(`API сервер успішно запущено на порту ${PORT}`);
		});
	} catch (error) {
		// Тепер помилка логується за всіма нашими правилами
		logger.error(
			"КРИТИЧНА ПОМИЛКА: Неможливо підключитися до бази даних під час старту.",
			error,
		);
		// І лише тепер зупиняємо процес
		process.exit(1);
	}
}

start();
