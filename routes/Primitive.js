const fs = require("fs");
const path = require("path");

const wholePath = path.join(__dirname, "../dictionary/WHOLE.DAT");   // WHOLE.DAT文件所在路径

var allPrimitive = [];   // 用于存放WHOLE.DAT词典的数组
var indexOfAllPrimitive = {};   // 建立数组allPrimitive的索引，用于快速查找

var Primitive = {};

// 读取整个WHOLE.DAT词典，并将其存储在allPrimitive数组中
function readWhole(callback) {
	var result = fs.readFile(wholePath, "utf-8", function(err, data) {
		if (!err) {
			var line = data.split("\n");

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

			callback();
		}
	});
}

// 提供获取存储WHOLE.DAT词典数据数组的接口
Primitive.getPrimitive = function(callback) {
	if (allPrimitive.length == 0) {
		readWhole(function() {
			callback(allPrimitive);
		});
	}
	else {
		callback(allPrimitive);
	}
}

// 判断该词汇是否是WHOLE.DAT的最顶层
Primitive.isTop = function(word) {
	return word.id == word.parentId;
}


// 获取某个词汇的所有父词汇
Primitive.getAllParents = function(word, callback) {
	this.getPrimitive(function() {
		var parentsArray = [];

		do {
			parentsArray.push(allPrimitive[word.parentId]);
			word = allPrimitive[word.parentId];
		} while(!this.isTop(word));

		callback(parentsArray);
	});
}

// 判断该中文是否在词典WHOLE.DAT中存在
Primitive.isPrimitive = function(chinese) {
	var chineseFirstChar = chinese[0];
	for(let i=0, len=indexOfAllPrimitive[chineseFirstChar].length; i<len; i++) {
		if (indexOfAllPrimitive[chineseFirstChar][i].chinese == chinese) {
			return allPrimitive[indexOfAllPrimitive[chineseFirstChar][i].id];
		}
	}

	return false;
}

module.exports = Primitive;