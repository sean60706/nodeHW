const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

//?? 為什麼checkNotLogin會自動執行?
router.get('/', checkNotLogin, function(req, res, next){
	res.render('signin')
})


router.post('/', checkNotLogin, function(req, res, next){
	const name = req.fields.name
	const password = req.fields.password

	try{
		if(!name.length){
			throw new Error('請填寫用戶名')
		}
		if(!password.length){
			throw new Error('請輸入密碼')
		}
	}catch (e){
		req.flash('error', e.message)
		return res.redirect('back')
	}


	UserModel.getUserByName(name).then(function(user){
		if(!user){
			req.flash('error', '用戶不存在')
			return res.redirect('back')
		}

		if (sha1(password) !== user.password){
			req.flash('error', '用戶名或密碼錯誤')
			return res.redirect('back')
		}

		req.flash('success', '登入成功')
		delete user.password
		req.session.user = user

		res.redirect('/posts')
	}).catch(next)
})

module.exports = router