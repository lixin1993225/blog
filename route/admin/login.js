const express = require("express");
const common=require('../../libs/common');
const mysql = require("mysql");
const db = mysql.createPool({
	host:"139.199.133.110",
	user:"learn",
	password:"lx1993225",
	database:"learn"
});
module.exports = function(){
	var router = express.Router();
	router.get('/',(req,res)=>{
		res.render("admin/login.ejs",{})
	})
	router.post('/',(req,res)=>{
		var username = req.body.username;
		var password = common.md5(req.body.pass+common.md5_suffix);
		db.query(`SELECT * FROM admin WHERE username='${username}'`,(err,data)=>{
			if(err){
				console.log(err);
				res.status(500).send('database error').end();
			}else{
				if(data.length==0){
					res.status(400).send("no this admin").end()
				}else{
					if(data[0].password==password){
						req.session['admin_id']=data[0].ID;
						res.redirect('/admin/')
					}else{
						res.status(400).send('this password is error').end()
					}
				}
			}
		})
	});
	return router
}
