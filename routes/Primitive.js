/**
 * 建立词语之间的上下层结构关系
*/

const fs = require("fs");
const path = require("path");

const wholePath = path.join(__dirname, "../dictionary/WHOLE.DAT");   // WHOLE.DAT文件所在路径

/**
 * 用于存放WHOLE.DAT词典的数组
 * allPrimitive = [{
	id: 0,
	english: "event",
	chinese: "事件",
	parentId: 0
 }, {...}, ]
*/
var allPrimitive = [];

/* 
 * 建立数组allPrimitive的索引，用于快速查找
 * indexOfAllPrimitive = {
	"啊": [{id: 10, chinese: "阿拉伯"}, {...}, {...}, ...],
	"不": [{...}, {...}, ...],
	...
 }
*/
var indexOfAllPrimitive = {};

var Primitive = {};

// 读取整个WHOLE.DAT词典，并将其存储在allPrimitive数组中
function readWhole() {
	// fs.readFile(wholePath, "utf-8", function(err, data) {
	// 	if (!err) {
	// 		var line = data.split("\n");

	// 		for(let i=0, len=line.length; i<len; i++) {
	// 			var lineTarget = line[i].trim().replace(/\s+/g, " ").split(" ");   // 去除收尾多余空格，并将多个空格合并成一个空格
	// 			allPrimitive[i] = {
	// 				id: Number(lineTarget[0]),
	// 				english: lineTarget[1].split("|")[0],
	// 				chinese: lineTarget[1].split("|")[1],
	// 				parentId: Number(lineTarget[2])
	// 			}

	// 			if (!indexOfAllPrimitive[allPrimitive[i].chinese[0]]) {
	// 				indexOfAllPrimitive[allPrimitive[i].chinese[0]] = [];
	// 			}
	// 			indexOfAllPrimitive[allPrimitive[i].chinese[0]].push({
	// 				chinese: allPrimitive[i].chinese,
	// 				id: allPrimitive[i].id
	// 			});
	// 		}

	// 		callback();
	// 	}
	// });

	var result = fs.readFileSync(wholePath, "utf-8");
	var line = result.split("\n");

	for(let i=0, len=line.length; i<len; i++) {
		var lineTarget = line[i].trim().replace(/\s+/g, " ").split(" ");   // 去除收尾多余空格，并将多个空格合并成一个空格
		allPrimitive[i] = {
			id: Number(lineTarget[0]),
			english: lineTarget[1].split("|")[0],
			chinese: lineTarget[1].split("|")[1],
			parentId: Number(lineTarget[2])
		}

		if (!indexOfAllPrimitive[allPrimitive[i].chinese[0]]) {
			indexOfAllPrimitive[allPrimitive[i].chinese[0]] = [];
		}
		indexOfAllPrimitive[allPrimitive[i].chinese[0]].push({
			chinese: allPrimitive[i].chinese,
			id: allPrimitive[i].id
		});
	}
}

// 提供获取存储WHOLE.DAT词典数据数组的接口
Primitive.getPrimitive = function(callback) {
	if (allPrimitive.length == 0) {
		readWhole();
	}
	callback(allPrimitive);
}

// 判断该词汇是否是WHOLE.DAT的最顶层
Primitive.isTop = function(word) {
	return word.id == word.parentId;
}


// 获取某个词汇的所有父词汇，包括自身
Primitive.getAllParents = function(word, callback) {
	this.getPrimitive(function(allPrimitive) {
		var parentsArray = [];

		parentsArray.push(allPrimitive[word.id]);
		while(!Primitive.isTop(word)) {
			parentsArray.push(allPrimitive[word.parentId]);
			word = allPrimitive[word.parentId];
		}

		callback(parentsArray);
	});
}

// 判断该中文是否在词典WHOLE.DAT中存在
Primitive.isPrimitive = function(chinese, callback) {
	this.getPrimitive(function(allPrimitive) {
		var chineseFirstChar = chinese[0];

		if (indexOfAllPrimitive[chineseFirstChar]) {
			for(let i=0, len=indexOfAllPrimitive[chineseFirstChar].length; i<len; i++) {
				if (indexOfAllPrimitive[chineseFirstChar][i].chinese == chinese) {
					callback(allPrimitive[indexOfAllPrimitive[chineseFirstChar][i].id]);
					return;
				}
			}
		}

		callback(false);
	});
}

module.exports = Primitive;