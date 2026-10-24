// src/routes/posts.js
const express = require("express");
const postService = require("../services/post.service");

const router = express.Router();

// Express 5 автоматично ловить помилки з async функцій і передає їх у next()
router.post("/", async (req, res) => {
	const post = await postService.createDraft(req.body);
	res.status(201).json(post);
});

router.get("/", async (req, res) => {
	const posts = await postService.getFeed();
	res.status(200).json(posts);
});

router.post("/:id/publish", async (req, res) => {
	const post = await postService.publishPost(req.params.id);
	res.status(200).json(post); // Віддаємо 200, але статус зміниться пізніше воркером
});

module.exports = router;
