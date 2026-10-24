// src/utils/context.js
const { AsyncLocalStorage } = require("node:async_hooks");

// Створюємо глобальний екземпляр сховища
const asyncLocalStorage = new AsyncLocalStorage();

module.exports = { asyncLocalStorage };
