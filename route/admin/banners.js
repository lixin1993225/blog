const express = require("express");
const mysql = require("mysql");
var db = mysql.createPool({
	host:"139.199.133.110",
	user:"learn",
	password:"lx1993225",
	database:"learn"
});
module.exports =function(){
	var router = express.Router();
	router.get('/',(req,res)=>{
		switch(req.query.act){
			case 'mod':
				db.query(`SELECT * FROM banner_table WHERE id=${req.query.id}`,(err,data)=>{
					if(err){
						console.log(err)
						res.status(500).send('cuola').end()
					}else if(data.length==0){
						res.status(404).send('no data').end()
					}else{
						db.query("SELECT * FROM banner_table",(err,banners)=>{
							if(err){
								console.error(err)
								res.status(500).send('cuowu').end()
							}else{
								res.render("admin/banners.ejs",{banners,mod_data:data[0]})
							}
						})
					}
				});
			break;
			case 'del':
				db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`,(err,data)=>{
					if(err){
						res.status(500).send("database error").end()
					}else{
						console.log(123)
						res.redirect('/admin/banners')
					}
				});
			break;
			default:
				db.query("SELECT * FROM banner_table",(err,data)=>{
					if(err){
						console.error(err)
						res.status(500).send('cuowu').end()
					}else{
						res.render("admin/banners.ejs",{banners:data,})
					}
				});
			break;			
		}
	});
	router.post('/',(req,res)=>{
		var title = req.body.title;
		var descript = req.body.descript;
		var href = req.body.href;
		if(!title||!descript||!href){
			res.status(400).send('arg error').end()
		}else{
			if(req.body.mod_id){//修改
				db.query(`UPDATE banner_table SET \
					title='${req.body.title}',\
					description='${req.body.descript}',\
					href='${req.body.href}'\
					WHERE ID=${req.body.mod_id}`,(err,data)=>{
						if(err){
							console.error(err);
							res.status(500).send("database error").end()
						}else{
							res.redirect('/admin/banners')
						}
					})
			}else{
				db.query(`INSERT INTO banner_table (title,description,href) VALUE('${title}','${descript}','${href}')`,(err,data)=>{
					if(err){
						res.status(500).send('database errors').end()
					}else{
						res.redirect('/admin/banners')
					}
				})
			}
		}
	})
	return router;
}