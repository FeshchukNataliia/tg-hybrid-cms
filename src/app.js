// src/app.js
const express = require("express");
const postsRouter = require("./routes/posts");

const app = express();

// Middleware для парсингу JSON
app.use(express.json());

// Підключення роутів
app.use("/posts", postsRouter);

// Глобальний обробник помилок (Global Error Handler)
app.use((err, req, res, next) => {
	console.error(`[Error]: ${err.message}`);

	if (err.message.startsWith("Validation")) {
		return res.status(400).json({ error: err.message });
	}
	if (err.message.startsWith("NotFound")) {
		return res.status(404).json({ error: err.message });
	}

	// Усі інші (неочікувані) помилки
	res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
