/**
 * 以《知网》词典为基础，采用正向最大匹配算法，实现自定义分词库
 * 知网词典词性标注有：N（名词）、ADJ（形容词）、V（动词）、ADV（副词）、PRON（代词）、NUM（数词）、PUNC（标点符号）、ECHO（语气词）、PREP（介词）、STRU（虚词）、CONJ（连词）、CLAS（度量单位）
*/

const fs = require("fs");
const path = require("path");
const glossaryPath = path.join(__dirname, "../dictionary/glossary.dat");

const maxLength = 9;   // 词语的最大长度

/**
 * allWordsInGlossary = {
	"啊": [{   // 词语的第一个索引
		word: String,
		type: Array  // 词语的所有词性
	}]
 }
*/
var allWordsInGlossary;

/** 加载glossary.dat文件
 * @return 返回一个以词语第一个字为索引、包含词语名字和词性的Object
*/
function loadGlossary() {
	allWordsInGlossary = {};
    var data = fs.readFileSync(glossaryPath, "utf-8");
    var line = data.split("\n");

    outer: for(let i=0, len=line.length; i<len; i++) {
        var lineTarget = line[i].trim().replace(/\s+/g, " ").split(" ");   // 去除首尾多余空格，并将多个空格合并成一个空格
        
        var index = lineTarget[0][0];
        if (!allWordsInGlossary[index]) {
            allWordsInGlossary[index] = [];
        }
        else {
        	for(let j=0, len1=allWordsInGlossary[index].length; j<len1; j++) {
        		if (allWordsInGlossary[index][j].word == lineTarget[0]) {
        			for(let t=0, len2=allWordsInGlossary[index][j].type.length; t<len2; t++) {
        				if (allWordsInGlossary[index][j].type[t] == lineTarget[1]) {   // 判断该词性是否已经存在
        					continue outer;
        				}
        			}
        			allWordsInGlossary[index][j].type.push(lineTarget[1]);
        			continue outer;
        		}
        	}
        }
        allWordsInGlossary[index].push({
        	word: lineTarget[0],
        	type: [lineTarget[1]]
        });
    }
}

/** 实现分词的函数
 * 以《知网》词典为基础，采用正向最大匹配算法，实现句子的分词
 * @param sentence String 分词的句子
 * @return sortResult Array 分词结果数组
 * sortResult = [{word: "", type: ["", "", ...]}, {}, {}, ...]
*/
function participleSentence(sentence) {
	if (!allWordsInGlossary) {
		loadGlossary();
	}

	var sentenceStr = sentence;

	/** 
	 * initResult = [{
			word: String,
			type: Array,   // 词语类型数组
			index: Number   // 该词语第一个字所在的下标，为之后排序分词结果提供依据
	 }]
	*/
	var initResult = [];

	var cutWordLength = sentence.length>maxLength ? maxLength : sentence.length;
	while(sentenceStr.length > 0) {
		for(let i=0;i<=(sentenceStr.length-cutWordLength); i++) {
			var cutWord = sentenceStr.substr(i, cutWordLength);
			var firstChar = cutWord[0];
			if (allWordsInGlossary[firstChar]) {
				for(let j=0, len=allWordsInGlossary[firstChar].length; j<len; j++) {
					if (allWordsInGlossary[firstChar][j].word == cutWord) {
						if (allWordsInGlossary[firstChar][j].type[0] != "PUNC") {   // 将标点符号去除
							initResult.push({
								word: cutWord,
								type: allWordsInGlossary[firstChar][j].type,
								index: sentence.indexOf(cutWord)
							});
						}
						// 将切分的词从句子中删除
						sentenceStr = sentenceStr.substring(0, i) + sentenceStr.substring(i+cutWordLength);
						i--;   // 将下一个匹配的下标矫正
						break;
					}
				}
			}
		}
		cutWordLength--;
	}

	var sortResult = [];
	// 将上面的分词结果按照句子中词语出现的顺序排序
	while(initResult.length > 0) {
		var min = initResult[0].index;
		var minIndex = 0;

		for(let i=0; i<initResult.length; i++) {
			if (min > initResult[i].index) {
				min = initResult[i].index;
				minIndex = i;
			}
		}

		sortResult.push({
			word: initResult[minIndex].word,
			type: initResult[minIndex].type
		});
		initResult.splice(minIndex, 1);
	}

	return sortResult;
}

module.exports = participleSentence;