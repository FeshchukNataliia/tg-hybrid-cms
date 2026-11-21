/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: "node",
	setupFiles: ["<rootDir>/test/setup-env.js"],
	clearMocks: true,
	restoreMocks: true,
	collectCoverageFrom: ["src/services/post.service.js"],
	coverageDirectory: "coverage",
};
