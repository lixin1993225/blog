const express = require('express');
const common = require("../../libs/common");
const mysql = require("mysql");
var db = mysql.createPool({
	host:"139.199.133.110",
	user:"learn",
	password:"lx1993225",
	database:"learn"
});
module.exports = function(){
	var router = express.Router();
	router.use((req,res,next)=>{
		if(!req.session['admin_id']&&req.url!='/login'){
			res.redirect('/admin/login')
		};
		next();
	})
	router.get('/',(req,res)=>{
		res.render("admin/index.ejs",{})
	});
	router.use('/login',require('./login')());
	router.use('/banners',require('./banners')());
	router.use('/custom',require('./custom')())
	return router
};