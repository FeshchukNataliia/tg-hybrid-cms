const fs = require("node:fs");
const path = require("node:path");

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
	process.loadEnvFile(envPath);
}
