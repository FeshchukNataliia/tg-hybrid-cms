// src/utils/logger.js
const { asyncLocalStorage } = require("./context");

const logger = {
	info: (message) => {
		const store = asyncLocalStorage.getStore();
		const traceId = store ? store.get("traceId") : "SYSTEM";
		const userId = store ? store.get("userId") : "UNKNOWN";

		console.log(`[INFO] [TraceID: ${traceId}] [User: ${userId}] ${message}`);
	},
	error: (message, err) => {
		const store = asyncLocalStorage.getStore();
		const traceId = store ? store.get("traceId") : "SYSTEM";

		console.error(`[ERROR] [TraceID: ${traceId}] ${message}`, err || "");
	},
};

module.exports = logger;
