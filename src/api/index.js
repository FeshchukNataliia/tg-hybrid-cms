const express = require("express");
const app = express();

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", service: "tg-hybrid-cms" });
});

app.post("/posts", (req, res) => {
	// Правильно: API нічого не знає про Worker. Він просто кладе задачу в абстрактну чергу (БД).
	console.log("[API] Pushing post 123 to QueueJobs database table...");
	res.status(201).json({ status: "queued" });
});

module.exports = app;
