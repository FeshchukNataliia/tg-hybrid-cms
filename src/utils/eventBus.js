// src/utils/eventBus.js
const EventEmitter = require("node:events");

// Створюємо власний клас на базі EventEmitter для розширення в майбутньому (якщо знадобиться)
class EventBus extends EventEmitter {}

// Експортуємо єдиний екземпляр (Singleton)
module.exports = new EventBus();
