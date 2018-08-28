const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const UserModel = require('../models/users')

const checkLogin = require('../middlewares/check').checkLogin


router.get('/', function(req, res, next){
	let user = {
		name: 'ERIC',
		password: sha1('123456789'),
		gender:'m',
		bio: 'hello',
		avatar: 'yeee'
	}
	UserModel.create(user)


})

module.exports = router

