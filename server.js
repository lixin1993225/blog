const express = require("express");
const expressStatic = require("express-static");
const multer = require("multer")
const multerObj = multer({dest:'./static/upload'})
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const consolidate = require("consolidate");
const ejs = require("ejs")
const expressRoute = require('express-route');
var server = express();
server.listen(8080)
//1.获取请求数据
//get自带
server.use(multerObj.any());//上传东西
//2.cookie session
server.use(cookieParser());
(function(){
	var keysarr = [];
	for(var i=0;i<10000;i++){
		keysarr[i] = 'a_'+Math.random();
	}
	server.use(cookieSession({
		name:'lizn',
		keys:keysarr,
		maxAge:20*3600*1000
	}))
})();
//3模板
server.set('views','./template');//在哪里获取模板
server.set('view engine','html');//需要视图引擎来进行渲染html
server.engine('html',consolidate.ejs);//需要用ejs来渲染html模版
//4route

// var r2 = express.Router();

// server.use('/artical/',createRouter());
// function createRouter(){
// 	var r1 = express.Router();
// 	r1.get('/1.html',function(req,res){
// 		res.send('我是blog').end();
// 	});
// 	r1.get('/b.html',(req,res)=>{
// 		res.send('我不是blog').end();
// 	});	
// 	return r1
// }


// server.use('/blog',r2);
// r2.use('/a.html',(req,res)=>{
// 	res.send('我是lizn').end()
// });
// r2.use('/b.html',(req,res)=>{
// 	res.send('我不是lizn').end()
// })

//4 route
server.use('/admin',require('./route/admin.js')());
server.use('/',require('./route/web')());


//在那个目录下获取东西
server.use(expressStatic('./static/'))
