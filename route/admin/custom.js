const express = require("express");
const mysql = require("mysql");
const db = mysql.createPool({
	host:"139.199.133.110",
	user:"learn",
	password:"lx1993225",
	database:"learn"
});
const pathObj = require("path");
const fs = require("fs");
module.exports = function(){
	var router = express.Router();
	router.get("/",(req,res)=>{
		db.query(`SELECT * FROM custom_evaluation_table`,(err,evaluation)=>{
			if(err){
				console.error(err);
				res.status(500).send(err).end()
			}else{
				console.log(evaluation)
				res.render("admin/custom.ejs",{evaluation})
			}
		})
	});
	router.post("/",(req,res)=>{
		console.log(req.files[0])
	})
	return router
}