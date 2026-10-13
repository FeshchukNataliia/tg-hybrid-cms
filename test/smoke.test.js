const { test } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../src/api/index");

test("Smoke test: API Gateway responds to /health", async () => {
	const response = await request(app).get("/health");
	assert.strictEqual(response.status, 200, "HTTP status should be 200");
	assert.strictEqual(response.body.status, "ok", "Body status should be ok");
});
