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
		switch(req.query.act){
			case "mod" : 
			db.query(`SELECT * FROM custom_evaluation_table WHERE ID='${req.query.id}'`,(err,data)=>{
				if(err){
					console.error(err);
					res.status(500).send(err).end();
				}else if(data.length==0){
					res.status(404).send("database no data").end()
				}else{
					db.query(`SELECT * FROM custom_evaluation_table`,(err,evaluation)=>{
						if(err){
							res.status(500).send(err).end()
						}else{
							res.render('admin/custom.ejs',{evaluation,mod_data:data[0]})
						}
					})
				}
			});
			break;
			case "del":
			db.query(`SELECT * FROM custom_evaluation_table WHERE ID='${req.query.id}'`,(err,data)=>{
				if(err){
					console.error(err);
					res.status(500).send(err).end();
				}else{
					if(data.length==0){
						res.status(404).send('no data').end()
					}else{
						fs.unlink('static/upload/'+data[0].src,(err)=>{
							if(err){
								res.status(500).send(err).end()
							}else{
								db.query(`DELETE FROM custom_evaluation_table WHERE ID='${req.query.id}'`,(err,data)=>{
									if(err){
										console.error(err);
										res.status(500).send(err).end()
									}else{
										res.redirect('/admin/custom')
									}
								})								
							}
						})
					}
				}
			});
			break;
			default:
			db.query(`SELECT * FROM custom_evaluation_table`,(err,evaluation)=>{
				if(err){
					console.error(err);
					res.status(500).send(err).end()
				}else{
					res.render("admin/custom.ejs",{evaluation})
				}
			});
			break;			
		}

	});
	router.post("/",(req,res)=>{
		const title = req.body.title;
		const description =req.body.description;
		if(req.files[0]){
			var ext = pathObj.parse(req.files[0].originalname).ext;
			var oldPath = req.files[0].path;
			var newPath = req.files[0].path+ext;
			var newFileName = req.files[0].filename+ext;			
		}else{
			var newFileName = null;		
		};

		if(newFileName){
			fs.rename(oldPath,newPath,(err)=>{
				if(err){
					console.error(err)
					res.status(500).send(err).end()
				}else{
					if(req.body.mod_id){//判断是否为修改或者添加;//这是修改
						db.query(`SELECT * FROM custom_evaluation_table WHERE ID='${req.body.mod_id}'`,(err,data)=>{
							if(err){
								res.status(500).send(err).end()
							}else if(data.length==0){
								res.status(404).send('no data').end()
							}else{
								fs.unlink('static/upload/'+data[0].src,(err)=>{
									if(err){
										res.status(500).send(err).end()
									}else{
										db.query(`UPDATE custom_evaluation_table SET \
											title='${req.body.title}',\
											description='${req.body.description}',\
											src='${newFileName}'`,(err)=>{
												if(err){
													res.status(500).send(err).end()
												}else{
													res.redirect('/admin/custom')
												}
											})
									}
								})
							}
						})
					}else{
						db.query(`INSERT INTO custom_evaluation_table \
							(title,description,src) \
							VALUE('${title}','${description}','${newFileName}')`,(err,data)=>{
								if(err){
									res.status(500).send(err).end()
								}else{
									res.redirect('/admin/custom')
								}
							})
					}
				}
			})	
		}else{
			if(req.body.mod_id){
				db.query(`UPDATE custom_evaluation_table SET \
					title='${title}',\
					description='${description}',\
					src='${newFileName}' \
					WHERE ID='${req.body.mod_id}'`,(err,data)=>{
						if(err){
							res.status(500).send(err).end()
						}else{
							res.redirect('/admin/custom')
						}
					})
			}else{
				db.query(`INSERT INTO custom_evaluation_table \
				(title,description,src) \
				VALUE('${title}','${description}','${newFileName}')`,(err,data)=>{
					if(err){
						res.status(500).send(err).end();
					}else{
						res.redirect('/admin/custom')
					}
				})					
			}
		};
	});
	return router
}