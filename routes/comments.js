const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const CommentModel = require('../models/comments')


router.post('/',checkLogin , function(req, res, next){
	const author = req.session.user._id
	const postId = req.fields.postId
	const content = req.fields.content

	try{
		if (!content.length){
			throw new Error('請填寫留言內容')
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}

	const comment = {
		author: author,
		content: content,
		postId: postId
	}

	CommentModel.create(comment)
					.then(function(){
						req.flash('success', '留言成功')
						res.redirect('back')
					})
					.catch(next)
})

router.get('/:commentId/remove',checkLogin , function(req, res, next){
	const commentId = req.params.commentId
	const author = req.session.user._id

	CommentModel.delCommentById(commentId)
					.then(function() {
						req.flash('success', '刪除留言成功')
						res.redirect('back')
					})
					.catch(next)
})

module.exports = router