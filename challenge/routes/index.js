const express        = require('express');
const router         = express.Router({caseSensitive: true});
const bot            = require('../bot');
let db;

const response = data => ({ message: data });

router.get('/', (req, res) => {
	db.listPosts()
	.then(posts => {
		return res.render('index.html', {posts});
	})
	.catch(e => {
		res.render('index.html');
	})

});

router.get('/posts/:id', (req, res) => {
	const { id } = req.params;
	if(!isNaN(parseInt(id))) {
		db.getPost(parseInt(id))
			.then(post => {
				db.getComments(parseInt(id))
					.then(comments => {
						return res.render('post.html', {post: post , comments: comments});
					})
			})
	} else {
		return res.render('post.html', {error: 'Invalid post ID supplied!'});
	}
});

router.post('/api/report', async (req, res) => {
	const { id } = req.body;
	if(!isNaN(parseInt(id))) {
		await bot.visitPost(id);
		return res.send(response('Report received successfully!'));
	}
	return res.status(500).send(response('Missing required parameters!'));
});

module.exports = database => {
	db = database;
	return router;
};