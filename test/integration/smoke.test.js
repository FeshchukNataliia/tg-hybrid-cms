const request = require("supertest");
const app = require("../../src/app");

describe("Smoke Test", () => {
	test("API is running and GET /version returns 200", async () => {
		const response = await request(app).get("/version");

		expect(response.status).toBe(200);
		expect(response.body.status).toBe("ok");
		expect(response.body.version).toBe("1.0.0");
	});
});
