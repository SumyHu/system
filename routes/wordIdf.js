// 获取带有idf的词典
const fs = require("fs");
const path = require("path");
const idfPath = path.join(__dirname, "../dictionary/idf.dat");

// 存储idf词典的对象，并且以词语开头为索引，方便查找
var allWords;

function loadIdf() {
	allWords = {};
    var data = fs.readFileSync(idfPath, "utf-8");
    var line = data.split("\n");

    for(let i=0, len=line.length; i<len; i++) {
    	var lineTarget = line[i].split(" ");
        if (!allWords[lineTarget[0][0]]) {
            allWords[lineTarget[0][0]] = [];
        }
        allWords[lineTarget[0][0]].push({
        	word: lineTarget[0],
        	idfVal: lineTarget[1]
        });
    }
}

function findWordIdf(word) {
	var findArray = allWords[word[0]];
	if (findArray) {
		for(let i=0, len=findArray.length; i<len; i++) {
			if (findArray[i].word == word) {
				return findArray[i].idfVal;
			}
		}
	}

	return null;
}

function getWordIdf(word) {
	if (!allWords) {
		loadIdf();
	}
	return findWordIdf(word);
}

module.exports = getWordIdf;