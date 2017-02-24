const fs = require("fs");
const fse = require('fs-extra');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');
const iconv = require('iconv-lite');

// 文件上传插件
var multer = require('multer');

// 用md5对密码进行加密
const md = require("md5");

// 调用所有数据库的增删改查方法
const buildData = require("./buildData");

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

// 编程运行文件
const cCodePath = path.join(__dirname, "../programmingRunningFile/cTest.c"),
	  cppCodePath = path.join(__dirname, "../programmingRunningFile/cppTest.cpp"),
	  csCodePath = path.join(__dirname, "../programmingRunningFile/csTest.cs"),
	  javaCodePath = path.join(__dirname, "../programmingRunningFile/Main.java"),
	  phpCodePath = path.join(__dirname, "../programmingRunningFile/phpTest.php"),
	  pythonCodePath = path.join(__dirname, "../programmingRunningFile/pythonTest.py"),
	  rubyCodePath = path.join(__dirname, "../programmingRunningFile/rubyTest.rb"),
	  sqlCodePath = path.join(__dirname, "../programmingRunningFile/sqlTest.sql"),
	  commentJsPath = path.join(__dirname, "../programmingRunningFile/comment.js");

// 示例文件
const cCodeTestPath = path.join(__dirname, "../Test/cTest.c"),
	  cppCodeTestPath = path.join(__dirname, "../Test/cppTest.cpp"),
	  csCodeTestPath = path.join(__dirname, "../Test/csTest.cs"),
	  javascriptCodeTestPath = path.join(__dirname, "../Test/javascriptTest.js"),
	  javaCodeTestPath = path.join(__dirname, "../Test/Main.java"),
	  phpCodeTestPath = path.join(__dirname, "../Test/phpTest.php"),
	  pythonCodeTestPath = path.join(__dirname, "../Test/pythonTest.py"),
	  rubyCodeTestPath = path.join(__dirname, "../Test/rubyTest.rb"),
	  mysqlCodeTestPath = path.join(__dirname, "../Test/mysqlTest.sql"),
	  oracleCodeTestPath = path.join(__dirname, "../Test/oracleTest.sql");

let commentJs;

function isLoginIn(req, res, exitCallback) {
	if (req.session.userId) {
		exitCallback();
	}
	else {
		res.render("login");
	}
}

module.exports = function(app) {
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './public/upload');
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname);
		}
	});

	var uploadImage = multer({
		storage: storage
	});

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

	app.post('/uploadImage',uploadImage.single('uploadImage'), function (req, res) {
		console.log(req.file);
		if (req.file == undefined) {
			res.redirect('/');
		}
		else {
			var uploadImage = req.file.path.substring(7).replace(/\\/g, '/');
			buildData.usersObj.update({_id: req.session.userId}, "set", {imageSrc: uploadImage}, function(data) {
				req.session.imageSrc = uploadImage;
				res.redirect('/');
			});
		}
	});

	app.get("/login", function(req, res) {
		if (req.query.exit) {
			req.session.userId = "";
		}
		isLoginIn(req, res, function() {
			res.render("comment", {
				fullName: req.session.userId,
				identity: req.session.identity,
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				imageSrc: req.session.imageSrc,
				cssFilePath: ["stylesheets/indexStyle.css"],
				scriptFilePath: ["javascripts/indexJS.js"],
				innerHtml: initInterface.indexInterface
			});
		});
	});

	app.post("/login", function(req, res) {
		buildData.usersObj.find({_id: req.body.userId}, function(data) {
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
					req.session.identity = req.body.identity;
					req.session.imageSrc = data.imageSrc;
					res.send({success: "login success!"});
				}
			}
		})
	});

	app.get("/register", function(req, res) {
		res.render("register");
	});

	app.get("/findPsw", function(req, res) {
		res.render("findPsw");
	});

	app.get("/", function(req, res) {
		isLoginIn(req, res, function() {
			res.render("comment", {
				fullName: req.session.userId,
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				identity: req.session.identity,
				imageSrc: req.session.imageSrc,
				cssFilePath: ["stylesheets/indexStyle.css"],
				scriptFilePath: ["javascripts/indexJS.js"],
				innerHtml: initInterface.indexInterface
			});
		});
	});

	app.get("/settings", function(req, res) {
		isLoginIn(req, res, function() {
			res.render("comment", {
				fullName: req.session.userId,
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				identity: req.session.identity,
				imageSrc: req.session.imageSrc,
				cssFilePath: ["stylesheets/settingsStyle.css"],
				scriptFilePath: ["javascripts/settingsJS.js"],
				innerHtml: initInterface.settingsInterface
			});
		})
	});

	app.get("/pratice", function(req, res) {
		isLoginIn(req, res, function() {
			let renderContent = {
				fullName: req.session.userId,
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				identity: req.session.identity,
				imageSrc: req.session.imageSrc
			}
			if (req.query.operation === "modify") {
				renderContent.cssFilePath = ["codemirror-5.23.0/lib/codemirror.css", "codemirror-5.23.0/theme/seti.css", "stylesheets/addPraticeStyle.css"];
				renderContent.scriptFilePath = ["codemirror-5.23.0/lib/codemirror.js", "codemirror-5.23.0/mode/clike/clike.js", "codemirror-5.23.0/mode/php/php.js", "codemirror-5.23.0/mode/python/python.js", "codemirror-5.23.0/mode/ruby/ruby.js", "codemirror-5.23.0/mode/sql/sql.js", "codemirror-5.23.0/mode/javascript/javascript.js", "codemirror-5.23.0/addon/edit/matchbrackets.js", "javascripts/programmingRunningJS.js", "javascripts/addPraticeJS.js", "javascripts/modifyPraticeJS.js"];
				renderContent.innerHtml = initInterface.addPraticeInterface;
			}
			else if (req.query.index || req.query.type) {
				renderContent.cssFilePath = ["codemirror-5.23.0/lib/codemirror.css", "codemirror-5.23.0/theme/seti.css", "stylesheets/doPraticeStyle.css"];
				renderContent.scriptFilePath = ["codemirror-5.23.0/lib/codemirror.js", "codemirror-5.23.0/mode/clike/clike.js", "codemirror-5.23.0/mode/php/php.js", "codemirror-5.23.0/mode/python/python.js", "codemirror-5.23.0/mode/ruby/ruby.js", "codemirror-5.23.0/mode/sql/sql.js", "codemirror-5.23.0/mode/javascript/javascript.js", "codemirror-5.23.0/addon/edit/matchbrackets.js", "javascripts/programmingRunningJS.js", "javascripts/doPraticeJS.js"];
				renderContent.innerHtml = initInterface.doPraticeInterface;
			}
			else if (req.query.praticeType) {
				renderContent.cssFilePath = ["codemirror-5.23.0/lib/codemirror.css", "codemirror-5.23.0/theme/seti.css", "stylesheets/addPraticeStyle.css"];
				renderContent.scriptFilePath = ["codemirror-5.23.0/lib/codemirror.js", "codemirror-5.23.0/mode/clike/clike.js", "codemirror-5.23.0/mode/php/php.js", "codemirror-5.23.0/mode/python/python.js", "codemirror-5.23.0/mode/ruby/ruby.js", "codemirror-5.23.0/mode/sql/sql.js", "codemirror-5.23.0/mode/javascript/javascript.js", "codemirror-5.23.0/addon/edit/matchbrackets.js", "javascripts/programmingRunningJS.js", "javascripts/addPraticeJS.js"];
				renderContent.innerHtml = initInterface.addPraticeInterface;
			}
			else if (req.query.subjectName) {
				renderContent.cssFilePath = ["stylesheets/praticeStyle.css"];
				renderContent.scriptFilePath = ["javascripts/praticeJS.js"];
				renderContent.innerHtml = initInterface.praticeInterface;
			}
			res.render("comment", renderContent);
		});
	});

	app.get("/doPratice", function(req, res) {
		isLoginIn(req, res, function() {
			res.render("comment", {
				fullName: req.session.userId,
				username: req.session.userId.substr(req.session.userId.length-5, 5),
				identity: req.session.identity,
				imageSrc: req.session.imageSrc,
				cssFilePath: ["codemirror-5.23.0/lib/codemirror.css", "codemirror-5.23.0/theme/seti.css", "stylesheets/doPraticeStyle.css"],
				scriptFilePath: ["codemirror-5.23.0/lib/codemirror.js", "codemirror-5.23.0/mode/clike/clike.js", "codemirror-5.23.0/mode/php/php.js", "codemirror-5.23.0/mode/python/python.js", "codemirror-5.23.0/mode/ruby/ruby.js", "codemirror-5.23.0/mode/sql/sql.js", "codemirror-5.23.0/mode/javascript/javascript.js", "codemirror-5.23.0/addon/edit/matchbrackets.js", "javascripts/doPraticeJS.js"],
				innerHtml: initInterface.doPraticeInterface
			});
		});
	});

	app.get("/javaRunTest", function(req, res) {
		res.render("javaRunTest");
	});

	app.post("/runningCodeByCmd", function(req, res)  {
		console.log(req.body.type);
		let filePath, cmd1, cmd2;
        switch(req.body.type) {
        	case "c":
	        	filePath = cCodePath;
        		cmd1 = "gcc cTest.c -o cTest";
        		cmd2 = "cTest";
        		break;
        	case "c++":
        		filePath = cppCodePath;
        		cmd1 = "g++ cppTest.cpp -o cppTest";
        		cmd2 = "cppTest";
        		break;
        	case "c#":
        		filePath = csCodePath;
        		cmd1 = "csc csTest.cs";
        		cmd2 = "csTest";
        		break;
        	case "java":
	        	filePath = javaCodePath;
	        	cmd1 = "javac -encoding utf-8 Main.java";
	        	cmd2 = "java Main";
	        	break;
	        case "php":
	        	filePath = phpCodePath;
	        	cmd1 = "php phpTest.php";
	        	break;
	        case "python":
	        	filePath = pythonCodePath;
	        	cmd1 = "python pythonTest.py";
	        	break;
	        case "Ruby":
	        	filePath = rubyCodePath;
	        	cmd1 = "ruby rubyTest.rb";
	        	break;
	        case "sql(mysql)":
	        	filePath = sqlCodePath;
	        	cmd1 = "mysql -uroot -p123456 -Dmysql < " + filePath;
	        	break;
	        case "sql(oracle)":
	        	filePath = sqlCodePath;
	        	// cmd1 = "sqlplus system/xg123@orcl @" + filePath;
	        	cmd1 = "sqlplus / as sysdba @"+filePath;
	        	// cmd2 = "exit";
	        	break;
        }

        console.log(cmd1, cmd2);

		if (!fs.existsSync(filePath)) {
	        fse.ensureFileSync(filePath);
        }

        if (req.body.type === "sql(oracle)") {
        	fs.writeFileSync(filePath, req.body.code+"\n/\nexit");
        }
        else {
	        fs.writeFileSync(filePath, req.body.code);
        }

        if (cmd2) {
        	exec(cmd1, {cwd: "./programmingRunningFile", encoding: "utf8"}, function(err,stdout,stderr){
			    if(err) {
			    	// console.log(11111,stderr);
			    	// var str = iconv.decode(new Buffer(stderr, "binary"), "gbk");
			    	// var str1 = iconv.decode(stderr, "gbk");

			    	// let u1 = iconv.encode(stderr, "gbk").toString('gb2312');
			    	// let u2 = iconv.encode("你好", "gbk");
			    	// console.log(77777,u2);
			    	console.log(1, stderr);

			        res.send({error: stderr});
			    } else {	
	        		let inputValueArray = req.body.inputValue, endStatus = false, error, inputCount = 0;

				    let e = exec(cmd2, {cwd: "./programmingRunningFile", encoding: "utf8"}, function(err, stdout, stderr) {
			        	if (err) {
			        		console.log(2, stderr);
			        		res.send({error: "选择的参数类型与实际不符！"});
			        	} else {
			        		console.log("stdout", stdout);
			        		res.send({success: stdout, inputCount: inputCount});
			        	} 
		        	});

		        	e.stdout.pipe(process.stdout);
		        	if (inputValueArray) {
		        		for(let i=0; i<inputValueArray.length; i++) {
			        		setTimeout(function() {
			        			console.log(inputValueArray[i]);
			        			if (!endStatus) {
				        			e.stdin.write(inputValueArray[i] + "\n");
				        			inputCount++;
			        			}
			        		}, 320*i);
			        	}
			        	setTimeout(function() {
			        		e.stdin.end();
			        	}, 320*inputValueArray.length);
		        	}
		        	else {
		        		e.stdin.end();
		        	}

		        	e.stdin.on('end', function() {
					    endStatus = true;
					});
			    }
			});
        }
        else {
        	let inputValueArray = req.body.inputValue, endStatus = false, error, inputCount = 0;
        	let e = exec(cmd1, {cwd: "./programmingRunningFile", encoding: "utf8"}, function(err,stdout,stderr){
			    if (err) {
	        		console.log(2, stdout);
	        		res.send({error: (stderr?stderr:stdout)});
	        	} else {
	        		console.log("stdout", stdout);
	        		res.send({success: stdout, inputCount: inputCount});
	        	} 
        	});

        	e.stdout.pipe(process.stdout);
    		if (inputValueArray) {
        		for(let i=0; i<inputValueArray.length; i++) {
	        		setTimeout(function() {
	        			console.log(inputValueArray[i]);
	        			if (!endStatus) {
		        			e.stdin.write(inputValueArray[i] + "\n");
		        			inputCount++;
	        			}
	        		}, 320*i);
	        	}
	        	setTimeout(function() {
	        		e.stdin.end();
	        	}, 320*inputValueArray.length);
        	}
        	else {
        		e.stdin.end();
        	}

        	e.stdin.on('end', function() {
			    endStatus = true;
			});
    	}
	});

	app.post("/javascriptRunning", function(req, res) {
		if (!commentJs) {
			commentJs = fs.readFileSync(commentJsPath);
		}
		try {
			let inputValue = req.body.inputValue;
			var result = eval(commentJs + "let i=-1; function read_line() {i++; return inputValue[i];}" + req.body.code + "\n (function() {return javascriptPrintResult;})()");
			res.send({success: result});
		} catch(e) {
			res.send({error: e.toString()});
		}
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

	app.post("/callDataProcessing", function(req, res) {
		switch(req.body.callFunction) {
			case "find":
				buildData[req.body.data+"Obj"].find(req.body.findOpt, function(data) {
					res.send(data);
				});
				break;
			case "findAll":
				buildData[req.body.data+"Obj"].findAll(function(data) {
					res.send(data);
				});
				break;
			case "save":
				buildData[req.body.data+"Obj"].save(req.body.saveData, function(err) {
					res.send(err);
				});
				break;
			case "update":
				buildData[req.body.data+"Obj"].update(req.body.updateOpt, req.body.operation, req.body.update, function(data) {
					res.send(data);
				});
				break;
			case "remove":
				buildData[req.body.data+"Obj"].remove(req.body.removeOpt, function(data) {
					res.send(data);
				});
		}
	});

	app.get("/help", function(req, res) {
		console.log(req.query.mode);
		let testFilePath, notice = "最好不要出现中文字样，可能会到导致编译失败！所有文件名大小写敏感。", topic = "求两个整数的和",
			input = {
				description: "分别输入两个整数",
				example: "2 \n 3",
				type: "int、int"
			},
			output = {
				description: "输出一个整数",
				example: "5",
				type: "int"
			};
		let mode = req.query.mode;
		switch(mode) {
			case "c":
				testFilePath = cCodeTestPath;
				break;
			case "cpp":
				testFilePath = cppCodeTestPath;
				mode = "c++";
				break;
			case "cs":
				testFilePath = csCodeTestPath;
				mode = "c#";
				break;
			case "javascript":
				testFilePath = javascriptCodeTestPath;
				notice += "读取一行输入：read_line()，输出一行：print(something)，注意使用print函数输出时，末尾自动带有换行符，无需自己添加。";
				break;
			case "java":
				testFilePath = javaCodeTestPath;
				notice += "您可以写很多个类，但是必须有一个类名为Main，并且为public属性，并且Main为唯一的public class，Main类的里面必须包含一个名字为'main'的静态方法（函数），这个方法是程序的入口。";
				break;
			case "php":
				testFilePath = phpCodeTestPath;
				break;
			case "python":
				testFilePath = pythonCodeTestPath;
				break;
			case "Ruby":
				testFilePath = rubyCodeTestPath;
				break;
			case "sql(mysql)":
				testFilePath = mysqlCodeTestPath;
				topic = "创建一个名为book的表";
				notice += "使用的数据库名为mysql。建议不要编写可能会造成冲突的程序，如创建表格（重复创建，数据库会报表格已存在错误）。若实在要编写这种程序，请在编写前去除冲突的可能，如判断数据库中是否存在该表格，若存在则将该表格删除，再按照题目要求创建新的表格。";
				input = {
					description: "表的字段有（请严格按照顺序）：tisbn(varchar(20) primary key)、tbname(varchar(100))、tauthor(varchar(100))、bookdate(date)、bookpage(int)、leixing(varchar(20))、bprice(float(6,2))",
					example: "无",
					type: "无"
				};
				output = {
					description: "显示书1的信息：9787111213826 Java Bruce Eckel	2007-06-00 880 computer 108.00，书2的信息：9787115167934 artist	Diomidis Spinellis 2008-01-00 384 computer 55.00",
					example: "无",
					type: "无"
				}
				break;
			case "sql(oracle)":
				testFilePath = oracleCodeTestPath;
				topic = "求1~100之间的整数和";
				notice += "建议不要编写可能会造成冲突的程序，如创建表格（重复创建，数据库会报表格已存在错误）。若实在要编写这种程序，请在编写前去除冲突的可能，如判断数据库中是否存在该表格，若存在则将该表格删除，再按照题目要求创建新的表格。";
				input = {
					description: "无",
					example: "无",
					type: "无"
				};
				output = {
					description: "无",
					example: "无",
					type: "无"
				}
				break;
		}
		let content = fs.readFileSync(testFilePath);
		res.render("help", {mode: mode, topic: topic, input: input, output: output, content: content, notice: notice});
	});
}