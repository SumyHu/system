const fs = require("fs");
const fse = require('fs-extra');
const exec = require('child_process').exec;
const path = require('path');
const iconv = require('iconv-lite');

// 用md5对密码进行加密
const md = require("md5");

// 调用用户曾删改查方法
const users = require("./users");

// 调用各个界面的初始化内容
const initInterface = require("./initInterface")

// 调用文本计算相似度算法
var textSimilaryCal = require("./textSimilaryCal");

// 调用句子相似度算法
var sentenceSimilary = require("./sentenceSimilary");

// var Primitive = require("./Primitive");
var WordSimilary = require("./WordSimilary");

var participle = require("./participle");

// var jieba = require("nodejieba");

const javaCodePath = path.join(__dirname, "../Test/javaCodeParser.java");

module.exports = function(app) {
	// 解决跨域问题
	app.all("*", function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	    // res.setHeader("Content-Type", "text/html; charset=GBK");
	    // res.header("X-Powered-By",' 3.2.1')
	    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
	    else  next();
	});

	// app.get('/', function(req, res) {
	// 	res.render('javaRunTest');
	// });

	// app.post('/', function(req, res)  {
	// 	console.log(req.body.code);
	// 	if (!fs.existsSync(javaCodePath)) {
	//         fse.ensureFileSync(javaCodePath);
 //        }
 //        fs.writeFileSync(javaCodePath, 'public class javaCodeParser {'
 //        	+ req.body.code
 //        	+ 'public static void main(String[] args) {javaCodeParser instance = new javaCodeParser();System.out.println(instance.sum(1, 2));}}');

 //        var e = exec("javac javaCodeParser.java", {cwd: "./Test"}, function(err,stdout,stderr){
	// 	    if(err) {
	// 	    	console.log(11111,stderr);
	// 	    	// var str = iconv.decode(new Buffer(stderr, "binary"), "gbk");
	// 	    	// var str1 = iconv.decode(stderr, "gbk");

	// 	    	// let u1 = iconv.encode(stderr, "gbk").toString('gb2312');
	// 	    	// let u2 = iconv.encode("你好", "gbk");
	// 	    	// console.log(77777,u2);

	// 	        res.send(stderr);
	// 	    } else {	
	// 		    exec("java javaCodeParser", {cwd: "./Test"}, function(err, stdout, stderr) {
	// 	        	if (err) {
	// 	        		res.send(stderr);
	// 	        	} else {
	// 	        		res.send(stdout);
	// 	        	} 
	//         	});     
	// 	    }
	// 	});
	// 	e.stderr.setEncoding('utf8');
	// });

	app.get("/login", function(req, res) {
		res.render("login");
	});

	app.post("/login", function(req, res) {
		users.findUser(req.body.userId, function(data) {
			if (!data) {
				res.send({error: {message: "该用户不存在！", reason: "username"}});
			}
			else {
				if (data.password != md(req.body.password)) {
					res.send({error: {message: "密码错误！", reason: "password"}});
				}
				else if (data.identity != req.body.identity) {
					res.send({error: {message: "登录失败，请确定登录信息无误！", reason: "identity"}});
				}
				else {
					req.session.userId = req.body.userId;
					req.session.imageSrc = data.imageSrc;
					res.send({success: "login success!"});
				}
			}
		})
	});

	app.get("/register", function(req, res) {
		// users.removeUser("18824167803",function() {});
		res.render("register");
	});

	app.get("/findPsw", function(req, res) {
		res.render("findPsw");
	});

	app.get("/", function(req, res) {
		if (!req.session.userId) {
			res.render("login");
		}
		else {
			res.render("comment", {
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				imageSrc: req.session.imageSrc,
				cssFilePath: "stylesheets/indexStyle.css",
				scriptFilePath: "javascripts/indexJS.js",
				innerHtml: initInterface.indexInterface
			});
		}
	});

	app.get("/pratice", function(req, res) {
		console.log(req.query);
		res.render("comment", {
			cssFilePath: "stylesheets/praticeStyle.css",
			scriptFilePath: "javascripts/praticeJS.js",
			innerHtml: initInterface.praticeInterface
		});
	});

	app.get("/doPratice", function(req, res) {
		res.render("comment", {
			cssFilePath: "stylesheets/doPraticeStyle.css",
			scriptFilePath: "javascripts/doPraticeJS.js",
			innerHtml: initInterface.doPraticeInterface
		});
	});

	app.get("/addPratice", function(req, res) {
		// res.render("addPratice");
		res.render("comment", {
			cssFilePath: "stylesheets/addPraticeStyle.css",
			scriptFilePath: "javascripts/addPraticeJS.js",
			innerHtml: initInterface.addPraticeInterface
		});
	});

	app.get("/exercise", function(req, res) {
		res.render("exercise");
	});

	app.post("/exercise", function(req, res) {
		var filePath;
		switch(req.query.type) {
			case "javaScript":
				filePath = path.join(__dirname, "../exercise/javaScriptExercise.json");
				break;
			case "java":
				filePath = path.join(__dirname, "../exercise/javaExercise.json");
				break;
			case "c_c++":
				filePath = path.join(__dirname, "../exercise/c_c++Exercise.json");
				break;
		}
		fs.readFile(filePath, function(err, data) {
			if (!err) {
				// res.send("success");
				res.send(data);
			}
			else {
				res.send(err);
			}
		});
	});

	app.post("/javaTest", function(req, res)  {
		if (!fs.existsSync(javaCodePath)) {
	        fse.ensureFileSync(javaCodePath);
        }
        fs.writeFileSync(javaCodePath, 'public class javaCodeParser {'
        	+ req.body.code
        	+ 'public static void main(String[] args) {javaCodeParser instance = new javaCodeParser();System.out.println(instance.sum(1, 2));}}');

        var e = exec("javac javaCodeParser.java", {cwd: "./Test"}, function(err,stdout,stderr){
		    if(err) {
		    	// console.log(11111,stderr);
		    	// var str = iconv.decode(new Buffer(stderr, "binary"), "gbk");
		    	// var str1 = iconv.decode(stderr, "gbk");

		    	// let u1 = iconv.encode(stderr, "gbk").toString('gb2312');
		    	// let u2 = iconv.encode("你好", "gbk");
		    	// console.log(77777,u2);

		        res.send(stderr);
		    } else {	
			    exec("java javaCodeParser", {cwd: "./Test"}, function(err, stdout, stderr) {
		        	if (err) {
		        		res.send(stderr);
		        	} else {
		        		if (stdout == 3) {
		        			res.send("编译通过");
		        		}
		        		else {
		        			res.send("编译不通过");
		        		}
		        	} 
	        	});     
		    }
		});
		e.stderr.setEncoding('utf8');
	});

	app.get("/shortAnswerCheck", function(req, res) {
		// console.log(segment.doSegment("这是一个基于Node.js的中文分词模块。"));
		// console.log(Primitive.readWhole());
		res.render("wordSimilarTest");
	});

	app.post("/shortAnswerCheck", function(req, res) {
		// console.log(segment.doSegment("你好，你好，在做什么呢？我好想你呢，超级超级想你呢。"));
		// var result = wordSimilaryFn.simWord(req.body.word1, req.body.word2);
		// res.send(result.toString());
		// console.log(wordSimilaryFn.simWord);

		// jieba.analyse.set_idf_path("../dictionary/idf.txt");

		// var result = jieba.tag("我拿着如意");
		// console.log(result);

		var SyntacticSimilarity = require("./SyntacticSimilarity");
		// SyntacticSimilarity("数据的逻辑存储结构发生改变时", ["逻辑存储结构"]);
		let wordSimilaryFn = WordSimilary();
		// console.log(wordSimilaryFn.simWord("改变", "不改变"));
		// console.log(sentenceSimilary("数据的逻辑存储结构不发生改变", "数据的逻辑存储结构发生改变", ["逻辑存储结构"]));
		// console.log(textSimilaryCal("数据的逻辑存储结构改变", "数据的逻辑存储结构改变"));
		// console.log(SyntacticSimilarity("数据的逻辑存储结构发生改变", "数据的逻辑存储结构发生改变", ["逻辑存储结构"]));
		console.log(SyntacticSimilarity("没有运行其他事务时进行的转储操作"));

		// console.log(participle("数据的逻辑存储结构发生改变", ["逻辑存储结构"]));

		// var result;
		// switch(req.body.btnId) {
		// 	case "wordBtn":
		// 		let wordSimilaryFn = WordSimilary();
		// 		result = wordSimilaryFn.simWord(req.body.text1, req.body.text2);
		// 		break;
		// 	case "sentenceBtn":
		// 		result = sentenceSimilary([{word: "我",count: 1}, {word: "好", count: 1}, {word: "喜欢", count: 2}], [{word: "喜欢", count: 2}, {word: "超级", count: 1}]);
		// 		console.log(result);
		// 		break;
		// 	case "textBtn":
		// 		result = textSimilaryCal(req.body.text1, req.body.text2);
		// 		break;
		// }

		// res.send(result.toString());
	});

	app.get("/translater", function(req, res) {
		res.render("translater");
	});

	app.post("/callUsers", function(req, res) {
		switch(req.body.callFunction) {
			case "findUser":
				users.findUser(req.body.userId, function(data) {
					res.send(data);
				});
				break;
			case "saveUser":
				users.saveUser(req.body.userId, req.body.password, req.body.identity, req.body.checkContent, function(err) {
					res.send(err);
				});
				break;
			case "modifyUser":
				users.modifyUser(req.body.userId, req.body.update, function(data) {
					res.send(data);
				});
				break;
		}
	});
}