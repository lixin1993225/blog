const express = require('express');
module.exports = function(){
	var router = express.Router();
	router.use((req,res,next)=>{
		if(!req.session['admin_id']&&req.url!='/login'){
			res.redirect('/admin/login')
		};
		next()
	})
	router.get('/login',(req,res)=>{
		res.render("admin/login.ejs",{})
	});
	return router
};