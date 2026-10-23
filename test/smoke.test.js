const { test } = require("node:test");
const assert = require("node:assert");
// Імпортуємо наш реальний app, а не фейковий api/index.js
const app = require("../src/app.js");

test("Smoke Test: App is defined and exports an Express instance", () => {
	// Перевіряємо, що app існує
	assert.ok(app, "App should be defined");
	// Перевіряємо, що це дійсно Express-додаток (має метод use)
	assert.strictEqual(
		typeof app.use,
		"function",
		"App should have a use method",
	);
});
