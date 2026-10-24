// src/app.js
const express = require("express");
const postsRouter = require("./routes/posts");
const traceMiddleware = require("./middlewares/trace.middleware");
const logger = require("./utils/logger"); // Підключаємо логер

const app = express();

app.use(express.json());

// 1. Підключаємо контекст одразу після парсера JSON
app.use(traceMiddleware);

// 2. Підключаємо роути
app.use("/posts", postsRouter);

// 3. Оновлюємо глобальний обробник помилок
app.use((err, req, res, next) => {
	// Тепер помилки будуть логуватися з Trace ID!
	logger.error(`Глобальна помилка: ${err.message}`);

	if (err.message.startsWith("Validation")) {
		return res.status(400).json({ error: err.message });
	}
	if (err.message.startsWith("NotFound")) {
		return res.status(404).json({ error: err.message });
	}

	res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
