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
	/**
	 * allWordsInGlossary = {
		"啊": [{
			word: String,
			type: Array
		}, {}, ...],
		"..": [{}]
	 }
	*/
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

/** 句子分词具体实现
 * @param sentence String 整个原始句子 用于记录分词位置
 * @param sentenceStr String 用于分词的目标句子
 * @param cutWordLength Number 分词长度
 * @param initResult 用于记住词语类型、位置等信息
 * initResult = [{
		word: String,
		type: Array,   // 词语类型数组
		index: Number   // 该词语第一个字所在的下标，为之后排序分词结果提供依据
    }]
*/
function participleSentenceDetail(sentence, sentenceStr, cutWordLength, initResult) {
	if(sentenceStr.length > 0) {
		if (cutWordLength  === 0) {
			let index = sentence.indexOf(sentenceStr);
			let flag = false;
			while(!flag) {
				flag = true;
				for(let t=0, len1=initResult.length; t<len1; t++) {
					if (initResult[t].index == index) {
						index = sentence.indexOf(sentenceStr, index+sentenceStr.length);
						flag = false;
					}
				}
			}

			initResult.push({
				word: sentenceStr,
				type: ["N"],
				index: index
			});
			return;
		}

		for(let i=0; i<=(sentenceStr.length-cutWordLength); i++) {
			var cutWord = sentenceStr.substr(i, cutWordLength);
			var firstChar = cutWord[0];
			if (allWordsInGlossary[firstChar]) {
				for(let j=0, len=allWordsInGlossary[firstChar].length; j<len; j++) {
					if (allWordsInGlossary[firstChar][j].word == cutWord) {
						if (allWordsInGlossary[firstChar][j].type[0] != "PUNC") {   // 将标点符号去除
							let index = sentence.indexOf(cutWord);
							let flag = false;
							while(!flag) {
								flag = true;
								for(let t=0, len1=initResult.length; t<len1; t++) {
									if (initResult[t].index == index) {
										index = sentence.indexOf(cutWord, index+cutWord.length);
										flag = false;
									}
								}
							}
							
							initResult.push({
								word: cutWord,
								type: allWordsInGlossary[firstChar][j].type,
								index: index
							});

							// 将“的”字词性统一化，减少句法树结果的数量
							if (cutWord == "的" || cutWord == "地") {
								initResult[initResult.length-1].type = ["SpecialSTRU"];
							}
						}
						// 将切分的词从句子中删除
						sentenceStr = sentenceStr.substring(0, i) + "|" + sentenceStr.substring(i+cutWordLength);
						i--;   // 将下一个匹配的下标矫正
						break;
					}
				}
			}
		}
		cutWordLength--;
		let sentenceStrArr = sentenceStr.split("|");
		for(let i=0, len=sentenceStrArr.length; i<len; i++) {
			participleSentenceDetail(sentence, sentenceStrArr[i], cutWordLength, initResult);
		}
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

	var cutWordLength = sentence.length>maxLength ? maxLength : sentence.length, specialStr = "";
	participleSentenceDetail(sentence, sentenceStr, cutWordLength, initResult);
	
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

function participle(sentence, professionalNounsArr) {
	let initResult = [], result=[], spliceArr = [], sentenceStr = sentence;

	if (professionalNounsArr) {
		for(let i=0, len=professionalNounsArr.length; i<len; i++) {
			var proIndex = sentenceStr.indexOf(professionalNounsArr[i]);
			if (proIndex > -1) {
				initResult.push({
					word: professionalNounsArr[i],
					type: ["N"],
					index: proIndex
				});
				sentenceStr = sentenceStr.substring(0, proIndex) + "N" + sentenceStr.substring(proIndex+professionalNounsArr[i].length);
				i--;
			}
		}

		if (sentenceStr != sentence) {
			let sentenceArr = sentenceStr.split("N");
			console.log("sentenceArr", sentenceArr);
			for(let i=0, len1=sentenceArr.length; i<len1; i++) {
				if (sentenceArr[i]) {
					let sortResult = participleSentence(sentenceArr[i]);
					for(let j=0, len2=sortResult.length; j<len2; j++) {
						result.push({
							word: sortResult[j].word,
							type: sortResult[j].type
						});
					}
				}
				if (initResult[i]) {
					result.push({
						word: initResult[i].word,
						type: initResult[i].type
					});
				}
			}
			console.log("result", result);
			return result;
		}
		else {
			return participleSentence(sentence);
		}
	}
	else {
		return participleSentence(sentence);
	}
}

module.exports = participle;