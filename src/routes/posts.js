// src/routes/posts.js
const express = require("express");
const postService = require("../services/post.service");

const router = express.Router();

// Обгортка для лову асинхронних помилок
const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

// POST /posts (Створити чернетку)
router.post(
	"/",
	asyncHandler(async (req, res) => {
		const post = await postService.createDraft(req.body);
		res.status(201).json(post);
	}),
);

// GET /posts (Стрічка постів)
router.get(
	"/",
	asyncHandler(async (req, res) => {
		const posts = await postService.getFeed();
		res.status(200).json(posts);
	}),
);

// POST /posts/:id/publish (Опублікувати)
router.post(
	"/:id/publish",
	asyncHandler(async (req, res) => {
		const post = await postService.publishPost(req.params.id);
		res.status(200).json(post);
	}),
);

module.exports = router;
