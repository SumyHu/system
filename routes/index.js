const fs = require("fs");
const fse = require('fs-extra');
const exec = require('child_process').exec;
const path = require('path');
const iconv = require('iconv-lite');

// 中文分词模块，该模块以盘古分词组件中的词库为基础
var Segment = require("segment");
var segment = new Segment();
segment.useDefault();

// var Primitive = require("./Primitive");
var WordSimilary = require("./WordSimilary");

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

	app.get("/", function(req, res) {
		res.render("index");
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
		// console.log(segment.doSegment("这是一个基于Node.js的中文分词模块。"));
		let wordSimilaryFn = WordSimilary();
		var result = wordSimilaryFn.simWord(req.body.word1, req.body.word2);
		res.send(result.toString());
		// console.log(wordSimilaryFn.simWord);
	});
}