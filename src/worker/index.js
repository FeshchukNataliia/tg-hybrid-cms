// Worker для фонової відправки в Telegram
function publishPost(postId) {
	// Симуляція важкої роботи
	console.log(`[Worker] Direct execution for post: ${postId}`);
	return true;
}

module.exports = { publishPost };
