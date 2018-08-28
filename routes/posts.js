const express =require('express')
const PostModel= require('../models/posts')
const CommentModel = require('../models/comments')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/', function(req, res, next){
	const author = req.query.author

	PostModel.getPosts(author).then(function(posts){
		res.render('posts',{
			posts: posts
		})
	}).catch(next)
	
})

//發表文章
router.post('/create', checkLogin, function(req, res, next){
	const author = req.session.user._id
	const title = req.fields.title
	const content = req.fields.content

	try{
		if(!title.length){
			throw new error("請輸入標題")
		}
		if(!content.length){
			throw new error("請輸入內容")
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}

	let post = {
		author: author,
		title: title,
		content: content
	}

	PostModel.create(post).then(function(result){
		post = result.ops[0]
		req.flash('success', '發表成功')
		res.redirect(`/posts/${post._id}`)
	}).catch(next)

})

//發表文章頁
router.get('/create', checkLogin, function(req, res, next){
	res.render('create')
})

router.get('/:postId', function(req, res, next){
	const postId = req.params.postId

	Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	]).then(function(result){
		const post = result[0]
		const comments = result[1]
		if (!post){
			throw new Error('該文章不存在')
		}

		res.render('post', {
			post: post,
			comments: comments
		})
	}).catch(next)
	
})

router.get('/:postId/edit', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const author = req.session.user._id

	PostModel.getRawPostById(postId)
		.then(function (post){
			if(!post){
				throw new Error("該文章不存在")
			}
			if(author.toString()!==post.author._id.toString()){
				throw new Error("權限不足")
			}
			res.render('edit',{
				post: post
			})
		}).catch(next)

})

router.post('/:postId/edit', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const title = req.fields.title
	const content = req.fields.content
	const author = req.session.user._id

	try{
		if(!title.length){
			throw new Error("請輸入標題")
		}

		if(!content.length){
			throw new Error("請輸入內容")
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}

	PostModel.getRawPostById(postId).then(function(post){
		if(!post){
			throw new Error("文章不存在")
		}
		if(author.toString() !== post.author._id.toString()){
			throw new Error("權限不足")
		}
		PostModel.updatePostById(postId, {title: title, content: content}).then(function(){
			req.flash('success', "編輯文章成功")
			res.redirect(`/posts/${postId}`)
		}).catch(next)

	})


})

router.get('/:postId/remove', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const author = req.session.user._id

	PostModel.getRawPostById(postId).then(function(post){
		if(!post){
			throw new Error("文章不存在")
		}
		if(author.toString() !== post.author._id.toString()){
			throw new Error("權限不夠")
		}
		PostModel.delPostById(postId).then(function(){
			req.flash('success', "刪除文章成功")
			res.redirect('/posts')
		}).catch(next)

	})
})

module.exports = router