module.exports = {
	checkLogin: function checkLogin (req, res, next){
		if (!req.session.user){
			console.log("未登入")
			req.flash('error', "未登錄")
			return res.redirect("/signin")
		}
		next()
	},
	checkNotLogin: function checkNotLogin (req, res, next){
		if (req.session.user){
			console.log("已登入")
			req.flash('error', "已登錄")
			return res.redirect('back')
		}
		next()
	}

}