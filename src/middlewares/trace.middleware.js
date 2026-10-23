// src/middlewares/trace.middleware.js
const { randomUUID } = require("node:crypto");
const { asyncLocalStorage } = require("../utils/context");

const traceMiddleware = (req, res, next) => {
	// Генеруємо унікальний ID для бізнес-процесу (або беремо з заголовків)
	const traceId = req.headers["x-trace-id"] || randomUUID();

	// Хардкодимо користувача-ініціатора (вимога викладача)
	// У реальному житті це діставалося б з JWT токена
	const userId = req.headers["x-user-id"] || 1;

	// Створюємо Map для зберігання даних контексту
	const store = new Map();
	store.set("traceId", traceId);
	store.set("userId", userId);

	// Запускаємо весь наступний ланцюжок запиту всередині цього контексту
	asyncLocalStorage.run(store, () => {
		next();
	});
};

module.exports = traceMiddleware;
