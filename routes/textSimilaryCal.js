const CustomizeParticiple = require("./participle"),   // 自定义中文分词
	  wordIdf = require("./wordIdf"),   // 获得词语的idf值
	  WordSimilary = require("./WordSimilary"),   // 自定义词语相似度计算
	  kMeans = require("kmeans-js");    // 调用k-means聚类算法

let unimportantAttr = ["ECHO", "PREP", "STRU", "CONJ", "SpecialSTRU"],   // 不重要的词语词性
	wordWeightByAttr = {
		N: 0.3,
		PRON: 0.3,
		V: 0.3,
		ADJ: 0.2,
		ADV: 0.2,
		NUM: 0.1,
		CLAS: 0.1
	};

const nVal = 0.3;   // 名词比重
const vVal = 0.3;   // 动词比重
const aVal = 0.15;   //形容词和副词比重;
const otherVal = 0.1;   // 其他类型词语比重

const alpha = 0.66;   // 计算分词权重中IF-IDF所占比值
const lambdoid = 1.5;   // 重合度函数中λ的取值
const beta = 0.6;   // 计算句子总体相似度的β取值
const k = 5;   // 句子聚类的k取值
const delta = 0.2;   // 计算文本总体相似度的δ值

/** 将ECHO（语气词）、PREP（介词）、STRU（虚词）、SpecialSTRU、CONJ（连词）等词性的词语去掉
 * @param wordArray Array 最初获得的分词结果
 * wordArray = [{word: String, type: Array}, {...}, {...}, ...]
*/
function removeUnimportantWord(wordArray) {
	for(let i=0, len1=wordArray.length; i<len1; i++) {
		let typeArray = wordArray[i].type;
		for(let j=0; j<typeArray.length; j++) {
			let type = typeArray[j];
			for(let t=0, len2=unimportantAttr.length; t<len2; t++) {
				if (type === unimportantAttr[t]) {
					typeArray.splice(j, 1);
					j--;
					break;
				}
			}
		}
	}

	for(let i=0; i<wordArray.length; i++) {
		if (wordArray[i].type.length === 0) {
			wordArray.splice(i, 1);
			i--;
		}
	}
}

/** 根据词语词性获取词语的权重
 * @param typeArray Array 某个词语的类型数组
*/
function getWordWeightByAttr(typeArray) {
	let sum = 0;
	for(let i=0, len=typeArray.length; i<len; i++) {
		sum += wordWeightByAttr[typeArray[i]];
	}
	return sum/typeArray.length;
}

/** 获取词语的idf值
 * @param wordObj Object 词语对象
 * wordObj = {
	word: String,
	type: Array,
	weight: Number,
	count: Number
 }
*/
function getWordIdf(wordObj, totalWordCount) {
	let idf = wordIdf(wordObj.word);
	if (!idf) {
		idf = wordObj.count/totalWordCount*100;
	}
	return idf;
}

/** 提取分词结果
 * @param sentence String 需要分词的句子
 * @param professionalNounsArr Array 专有名词数组
*/
function participle(sentence, professionalNounsArr) {
	let initResult = CustomizeParticiple(sentence, professionalNounsArr),    // 获得初始分词结果，已经去除了标点符号
		parResult = [];

	let totalWordCount = initResult.length;
	
	// ECHO（语气词）、PREP（介词）、STRU（虚词）、SpecialSTRU、CONJ（连词）等词性去掉
	removeUnimportantWord(initResult);

	for(let i=0, len1=initResult.length; i<len1; i++) {
		var flag = true;
		for(let j=0, len2=parResult.length; j<len2; j++) {
			if (parResult[j].word == initResult[i].word) {
				parResult[j].count = parResult[j].count+1;
				flag = false;
				break;
			}
		}
		if (flag) {
			parResult.push({
				word: initResult[i].word,
				type: initResult[i].type,
				weight: getWordWeightByAttr(initResult[i].type),
				count: 1
			});
		}
	}

	for(let i=0, len=parResult.length; i<len; i++) {
		parResult[i].idf = getWordIdf(parResult[i], totalWordCount);
	}
	return parResult;
}

/** 获得分词的实际权值
 * @param wordTarget = {
	word: String,
	type: Array,
	weight: Number,
	count: Number,
	idf: Number
 }
 * @return Number 分词的实际权值
*/
function getWordWeight(wordTarget) {
	return alpha*wordTarget.idf + (1-alpha)*wordTarget.count*wordTarget.weight
}

/** 基于余弦相似度的基础相似度计算
 * @param weightArr Array 存储一个句子中各个分词的权重
 * @return Number 余弦相似度的计算结果
*/
function baseSimilary(weightArr1, weightArr2) {
	var len1 = weightArr1.length;
	var len2 = weightArr2.length;
	var len = len1<len2 ? len1 : len2;
	var sum1=0, sum2=0, sum3=0;

	for(let i=0; i<len; i++) {
		sum1 = sum1 + weightArr1[i]*weightArr2[i];
	}
	for(let i=0; i<len1; i++) {
		sum2 = sum2 + weightArr1[i]*weightArr1[i];
	}
	for(let i=0; i<len2; i++) {
		sum3 = sum3 + weightArr2[i]*weightArr2[i];
	}

	return sum1/(Math.sqrt(sum2)*Math.sqrt(sum3));
}

/** 比较两个类型数组是否存在相同的类型值，若存在一个相同的类型，则返回true
 * @param typeArray1 Array 类型数组1
 * @param typeArray2 Array 类型数组2
*/
function compareTypeArray(typeArray1, typeArray2) {
	for(let i=0, len1=typeArray1.length; i<len1; i++) {
		for(let j=0, len2=typeArray2.length; j<len2; j++) {
			if (typeArray1[i] === typeArray2[j]) {
				return true;
			}
		}
	}
	return false;
}

/** 基于结构特性的结构相似度计算
 * @param wordTargetArr Array 存储一个句子中的各个分词对象
 * wordTargetArr = [{
	word: String,
	type: Array,
	weight: Number,
	count: Number,
	idf: Number
 }, ..., ...]
 * @return Number 结构特性的相似度计算结果
*/
function structureSimilary(wordTargetArr1, wordTargetArr2) {
	var len1 = wordTargetArr1.length;
	var len2 = wordTargetArr2.length;
	var N = len1<len2 ? len1 : len2;   // 表示两个句子中维数较小的词性标识数目
	var l = [];   // 存储最佳句法匹配对中词性标识数目的数组

	var minMatchCount = (len1 == 1 && len2 == 1) ? 1 : 2;

	for(let i=0; i<len1; i++) {
		for(let j=0; j<len2; j++) {
			if (compareTypeArray(wordTargetArr1[i].type, wordTargetArr2[j].type)) {
				console.log("==========");
				var matchCount = 0;
				for(let p=i, q=j; p<len1 && q<len2; p++, q++) {
					console.log(wordTargetArr1[p].type, wordTargetArr2[q].type)
					if (!compareTypeArray(wordTargetArr1[p].type, wordTargetArr2[q].type)) {
						break;
					}
					matchCount ++;
				}

				if (matchCount >= minMatchCount) {
					l.push(matchCount);
				}
			}
		}
	}

	var sum = 0;
	for(let i=0, len=l.length; i<len; i++) {
		sum = sum + l[i]*Math.exp(lambdoid*l[i]);
	}

	return sum/(N*Math.exp(lambdoid*N));
}

/** 句子之间的总体相似度计算
 * @param baseSimilary Number 基于余弦的相似度计算结果
 * @param structureSimilary Number 基于结构特性的相似度计算结果
 * @return Number 句子之间总体相似度的计算结果
*/
function sentenceSimilary(baseSimilaryVal, structureSimilaryVal) {
	return beta*baseSimilaryVal + (1-beta)*structureSimilaryVal;
}

/** 句子之间的总体相似度计算
 * @param sentence String 计算相似度的句子
 * @return Number 句子之间总体相似度的计算结果
*/
function calSentenceSimilary(sentence1, sentence2, professionalNounsArr) {
	// 句子分词
	var parResult1 = participle(sentence1, professionalNounsArr);
	var parResult2 = participle(sentence2, professionalNounsArr);

	var weightArr1 = [], weightArr2 = [];
	for(let i=0, len=parResult1.length; i<len; i++) {
		weightArr1.push(getWordWeight(parResult1[i]));
	}
	for(let i=0, len=parResult2.length; i<len; i++) {
		weightArr2.push(getWordWeight(parResult2[i]));
	}

	var baseSimilaryVal = baseSimilary(weightArr1, weightArr2);
	var structureSimilaryVal = structureSimilary(parResult1, parResult2);
	console.log("baseSimilaryVal: " + baseSimilaryVal);
	console.log("structureSimilaryVal: " + structureSimilaryVal);
	return sentenceSimilary(baseSimilaryVal, structureSimilaryVal);
}

/** 初次文本分句
 * @param text String 分句的文本
 * @return clauseTextResult Array 文本的分句结果
*/
function initClause(text) {
	var clauseBasis = ["，", "。", "；", "！", "？"];
	var clauseTextResult = [text];

	for(let i=0, len1=clauseBasis.length; i<len1; i++) {
		for(let j=0, len2=clauseTextResult.length; j<len2;) {
			var splitResult = clauseTextResult[j].split(clauseBasis[i]);
			var temp = [];
			for(let p=0; p<j; p++) {
				temp.push(clauseTextResult[p]);
			}
			for(let q=0, len3=splitResult.length; q<len3; q++) {
				temp.push(splitResult[q]);
			}
			for(let m=j+1, len4=clauseTextResult.length; m<len4; m++) {
				temp.push(clauseTextResult[m]);
			}
			clauseTextResult = temp;
			j = j+splitResult.length;
		}
	}

	for(let i=0, len=clauseTextResult.length; i<len; i++) {
		if (clauseTextResult[i] == "") {
			clauseTextResult.splice(i, 1);
		}
	}

	return clauseTextResult;
}

/** 在分句的结果数组中添加每个分句的各自权重（默认都为1，即均等）
 * @param clauseTextResult Array 分句结果
 * @param totalScore Number 该题目分值
*/
function clauseWithScore(clauseTextResult, totalScore) {
	let length = clauseTextResult.length, clauseWithScoreArr = [], score = 0, count = 0;
	for(let i=0; i<length; i++) {
		let sentence = clauseTextResult[i];
		clauseWithScoreArr.push({
			sentence: sentence
		});

		let index1 = sentence.indexOf("{"), index2 = sentence.indexOf("}");
		if (index1>-1 && index2>-1) {
			let sentenceScore = sentence.split("{")[1].split("}")[0];
			// let weight = sentenceScore/totalScore*initTotalWeight;
			clauseWithScoreArr[clauseWithScoreArr.length-1].score = sentenceScore;
			score += sentenceScore;   // 已占权重
			count++;   // 已分配权重的分句数

			clauseWithScoreArr[clauseWithScoreArr.length-1].sentence = sentence.substring(0, index1) + sentence.substring(index2+1);
		}
	}

	// 分句分值校验
	if (score >= totalScore || (score < totalScore && count === length)) {
		for(let i=0; i<clauseWithScoreArr.length; i++) {
			if (!clauseWithScoreArr[i].score) {
				clauseWithScoreArr.splice(i, 1);
				i--;
			}
			else if (score !== totalScore) {
				clauseWithScoreArr[i].score = clauseWithScoreArr[i].score/score*totalScore
			}
		}
	}
	else if (count<length) {
		let averageScore = (totalScore-score)/(length-count);
		for(let i=0; i<length; i++) {
			if (!clauseWithScoreArr[i].score) {
				clauseWithScoreArr[i].score = averageScore;
			}
		}
	}

	return clauseWithScoreArr;
}

/** 在分句的结果数组中添加每个分句的各自的关键词数组（如果有细分的话）
 * @param clauseWithScoreArr Array 分句结果
*/
function clauseWithKeyWord(clauseWithScoreArr) {
	for(let i=0, len=clauseWithScoreArr.length; i<len; i++) {
		let sentence = clauseWithScoreArr[i].sentence, score=0;
		clauseWithScoreArr[i].keywordArray = [];
		let keywordBlockArray = sentence.split("【");
		for(let j=1, len1=keywordBlockArray.length; j<len1; j++) {
			if (keywordBlockArray[j].indexOf("】")>-1) {
				let temp = keywordBlockArray[j].split("】")[0].split("（");
				let keyword = temp[0], keywordScore = Number(temp[1].split("）")[0]);
				clauseWithScoreArr[i].keywordArray.push({
					keyword: keyword,
					keywordScore: keywordScore
				});
				score += keywordScore;
			}
		}

		// 关键词分值校验
		let sentenceScore = clauseWithScoreArr[i].score
		if (score > sentenceScore) {
			let keywordArray = clauseWithScoreArr[i].keywordArray;
			for(let j=0, len1=keywordArray.length; j<len1; j++) {
				keywordArray[j].keywordScore = keywordArray[j].keywordScore/score*sentenceScore;
			}
		}

		clauseWithScoreArr[i].sentence = sentence.replace(/[【】（\d*）]/g, "");
	}
}

/** 文本分句
 * @param text String 文本
 * @param totalScore Number 题目分值
 * @return clauseWithWeight Array
 * clauseWithWeight = {
	sentence: String,   //分句
	score: Number,   // 该分句所占分值
	keywordArray: Array   // 关键词数组
 }
 * keywordArray = [{
 		keyword: String,   // 关键词
 		keywordScore: Number   //关键词分值
 	}]
*/
function clause(text, totalScore) {
	let clauseWithScoreArr = clauseWithScore(initClause(text), totalScore);
	clauseWithKeyWord(clauseWithScoreArr);
	return clauseWithScoreArr;
}

/** 文本句子聚类
 * @param data Array 存储需要聚类的句子数组
 * @return Array 文本句子聚类的结果
*/
function textClustering(data) {
	var reallyK = data.length<k ? data.length : k;
	var km = new kMeans({
	    K: reallyK
	});

	km.cluster(data);
	while (km.step()) {
	    km.findClosestCentroids();
	    km.moveCentroids();

	    if(km.hasConverged()) break;
	}

	return km.centroids;   // 返回聚类后的语义簇集合
}

/** 没有关键词的分句数组之间相似度计算
 * @param paramObj Object 参数对象
 * paramObj = {
	sentenceArr1: Array,   //没有关键词的分句数组
	sentenceArr2: Array, 
	professionalNounsArr: Array,   //专有名词数组
	totalScore: Number    // 该题分值
 }
 * sentenceArr1 = [{
	sentence: String,   //分句
	score: Number,   // 该分句所占分值
	keywordArray: Array   // 关键词数组
 }, {...}, ...]
 * sentenceArr2 = ["...", "....", ...]
 * @return Number 句子数组之间相似度的计算结果
*/
function clacalTotalSentenceSimilaryWithoutKeyword(paramObj) {
	let sentenceArr1 = paramObj.sentenceArr1, sentenceArr2 = paramObj.sentenceArr2, professionalNounsArr = paramObj.professionalNounsArr;
	var len1 = sentenceArr1.length; 
	var len2 = sentenceArr2.length;

	var matchCount = (len1<len2) ? len1 : len2;
	var count = 0, sum=0;
	while(count < matchCount) {
		var maxSentenceSimilaryVal = 0;
		var index1=0, index2=0;
		for(let i=0; i<sentenceArr1.length; i++) {
			for(let j=0; j<sentenceArr2.length; j++) {
				var currentSentenceSimilaryVal = calSentenceSimilary(sentenceArr1[i].sentence, sentenceArr2[j], professionalNounsArr);
				if (currentSentenceSimilaryVal > maxSentenceSimilaryVal) {
					maxSentenceSimilaryVal = currentSentenceSimilaryVal;
					index1 = i;
					index2 = j;
				}
			}
		}

		let weight = sentenceArr1[index1].score/paramObj.totalScore*len1;
		// 欠一个计算句子数组相似度的公式，暂定
		sum += maxSentenceSimilaryVal*weight;
		// tempSentenceArr1.splice(index1, 1);
		// tempSentenceArr2.splice(index2, 1);
		sentenceArr1.splice(index1, 1);
		sentenceArr2.splice(index2, 1);
		count ++;
	}

	return sum;
}

/** 计算分词相似度，并返回该分词匹配结果的最大相似度值和匹配的是哪个分句
 * @param keyword String 匹配的关键词
 * @param professionalNounsArr Array 专有名词数组
 * @param totalCompareWords Array 匹配的分词数组，并且里面按照分句分组
*/
function calWordSimilary(keyword, professionalNounsArr, totalCompareWords, flag) {
	let maxWordSimilaryVal = 0, index = 0;

	for(let i=0, len1=totalCompareWords.length; i<len1; i++) {
		for(let j=0, len2=totalCompareWords[i].length; j<len2; j++) {
			if (flag) {
				wordSimilaryVal = (keyword === totalCompareWords[i][j].word ? 1 : 0);
			}
			else {
				wordSimilaryVal = WordSimilary(keyword, totalCompareWords[i][j]);
			}
			if (wordSimilaryVal > maxWordSimilaryVal) {
				maxWordSimilaryVal = wordSimilaryVal;
				index = i;
			}
		}
	}
	console.log(index);

	return {
		maxWordSimilaryVal: maxWordSimilaryVal, 
		index: index
	}
}

/** 有关键词的分句数组之间相似度计算
 * @param paramObj Object 参数对象
 * paramObj = {
	sentenceArr1: Array,   //有关键词的分句数组
	sentenceArr2: Array,   // 考生答案分句数组
	professionalNounsArr: Array,   //专有名词数组
	totalScore: Number    // 该题分值
 }
 * sentenceArr1 = [{
	sentence: String,   //分句
	score: Number,   // 该分句所占分值
	keywordArray: Array   // 关键词数组
 }, {...}, ...]
 * keywordArray = [{keyword: String, keywordScore: Number}, {...}, ...]
 * sentenceArr2 = ["...", "....", ...]
 * @return Number 句子数组之间相似度的计算结果
*/
function claTotalSentenceSimilaryWithKeyword(paramObj) {
	let sentenceArr1 = paramObj.sentenceArr1, sentenceArr2 = paramObj.sentenceArr2, professionalNounsArr = paramObj.professionalNounsArr, 
		totalCompareWords = [], record = [];

	for(let i=0, len=sentenceArr2.length; i<len; i++) {
		totalCompareWords.push(participle(sentenceArr2[i], professionalNounsArr));
	}

	for(let i=0, len1=sentenceArr1.length; i<len1; i++) {
		let keywordArray = sentenceArr1[i].keywordArray; 
		record.push({sentenceArr1_index: i, keywordRecode: []});
		for(let j=0, len2=keywordArray.length; j<len2; j++) {
			let keyword = keywordArray[j].keyword, 
				keywordWeight = keywordArray[j].keywordScore/sentenceArr1[i].score;

			// 判断是否是专有名词，professionalNounsFlag为true代表是
			let professionalNounsFlag = false;
			for(let i=0, len=professionalNounsArr.length; i<len; i++) {
				if (keyword === professionalNounsArr[i]) {
					professionalNounsFlag = true;
					break;
				}
			}

			let maxParticipleKeywordSimilaryVal = 0, realIndex = 0;

			if (professionalNounsFlag) {
				let result = calWordSimilary(keyword, professionalNounsArr, totalCompareWords, true);
				maxParticipleKeywordSimilaryVal = result.maxWordSimilaryVal, realIndex = result.index;
			}
			else {
				let participleKeyword = CustomizeParticiple(keyword, professionalNounsArr), realResult = [];
				for(let t=0, len3=participleKeyword.length; t<len3; t++) {
					let result = calWordSimilary(participleKeyword[t].word, professionalNounsArr, totalCompareWords), exitFlag = false;
					console.log(result);

					// 判断该index是否存在在realIndex中，若存在，则exitFlag为true
					for(let m=0, len4=realResult.length; m<len4; m++) {
						if (realResult[m].index === result.index) {
							exitFlag = true;
						}
					}
					if (!exitFlag) {
						realResult.push(result.index);
					}
				}

				let participleKeywordLength = participleKeyword.length;
				for(let t=0, len3=realResult.length; t<len3; t++) {
					let wordSimilarySum = 0, compareWordArray = totalCompareWords[realResult[t]];
					for(let m=0; m<participleKeywordLength; m++) {
						wordSimilarySum += calWordSimilary(participleKeyword[m], professionalNounsArr, [compareWordArray]).maxWordSimilaryVal;
					}
					if (wordSimilarySum > maxParticipleKeywordSimilaryVal) {
						maxParticipleKeywordSimilaryVal = wordSimilarySum/participleKeywordLength;
						realIndex = realResult[t];
					}
				}
			}

			// let result = calWordSimilary(keyword, professionalNounsArr, totalCompareWords);

			record[record.length-1].keywordRecode.push({
				keyword: keyword,
				keywordWeight: keywordWeight,
				maxWordSimilaryVal: maxParticipleKeywordSimilaryVal,
				sentenceArr2_index: realIndex
			});
		}
	}

	return record;
}

/** 句子数组之间相似度计算
 * @param paramObj Object 参数对象
 * paramObj = {
	sentenceArr1: Array,   //比较的句子数组
	sentenceArr2: Array, 
	professionalNounsArr: Array,   //专有名词数组
	totalScore: Number    // 该题分值
 }
 * sentenceArr1 = [{
	sentence: String,   //分句
	score: Number,   // 该分句所占分值
	keywordArray: Array   // 关键词数组
 }, {...}, ...]
 * sentenceArr2 = ["...", "....", ...]
 * @return Number 句子数组之间相似度的计算结果
*/
function calTotalSentenceSimilary(paramObj) {
	let sentenceArr1 = paramObj.sentenceArr1, sentenceArr2 = paramObj.sentenceArr2, professionalNounsArr = paramObj.professionalNounsArr,
		sentenceArrWithKeyWord = [], sentenceArrWithoutKeyword = [];

	for(let i=0, len=sentenceArr1.length; i<len; i++) {
		if (sentenceArr1[i].keywordArray.length > 0) {
			sentenceArrWithKeyWord.push(sentenceArr1[i]);
		}
		else {
			sentenceArrWithoutKeyword.push(sentenceArr1[i]);
		}
	}

	return claTotalSentenceSimilaryWithKeyword({
		sentenceArr1: sentenceArrWithKeyWord, 
		sentenceArr2: sentenceArr2, 
		professionalNounsArr: professionalNounsArr, 
		totalScore: paramObj.totalScore
	});

	// return (sum + delta * (big - matchCount)) / big;
	// return (sum + delta * (len1 - matchCount)) / len1;
}

/** 文本之间的总体相似度计算
 * @param paramObj Object 参数对象
 * paramObj = {
	text1: String,   //比较的文本
	text2: String, 
	professionalNounsArr: Array,   //专有名词数组
	totalScore: Number   // 该题分值
 }
*/
function OverallCalTextSimilary(paramObj) {
	// 段落分句
	var clauseTextResult1 = clause(paramObj.text1, paramObj.totalScore);
	var clauseTextResult2 = initClause(paramObj.text2);
	console.log(clauseTextResult1, clauseTextResult2);
	return calTotalSentenceSimilary({
		sentenceArr1: clauseTextResult1, 
		sentenceArr2: clauseTextResult2, 
		professionalNounsArr: paramObj.professionalNounsArr,
		totalScore: paramObj.totalScore
	});
	// return [clauseTextResult1, clauseTextResult2];
}

module.exports = OverallCalTextSimilary;