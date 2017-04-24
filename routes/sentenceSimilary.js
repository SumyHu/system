/**
 * 句子相似度计算
 * 参考文献：《句子相似度算法》
 * 应用的算法：基于语义特征的句子相似度计算（比重：0.5）、句法相似度计算（难点，比重：0.4）、词形相似度算法（比重：0.1）
*/

// 结巴分词
// const jieba = require("nodejieba");

// 自定义分词库
const participleFn = require("./participle");

// 调用词语上下级结构库
const primitive = require("./Primitive");

// 调用词语计算库计算两个词语相似度的方法
const wordSimilary = require("./WordSimilary");

// 句法相似度实现库
const SyntacticSimilarity = require("./SyntacticSimilarity");

// 结巴分词非关键词词性标注头
const notKetwordTagFirstCharArr = ["p", "c", "u", "e", "y", "o", "h", "k", "x", "w"];

const alpha = 0.5;
const beta = 0.4;
const gama = 0.1;

/**句子分词，抽取关键词（名词、动词、形容词、副词）
 * @param sentence String 句子
 * @param professionalNounsArr Array 专业名词
 * @return result Array 抽取的关键词集合
*/
function participle(sentence, professionalNounsArr) {
	// var jiebaResult = jieba.tag(sentence);
	// var result = [];
	// for(let i=0, len1=jiebaResult.length; i<len1; i++) {
	// 	var flag = true;
	// 	for(let j=0, len2=notKetwordTagFirstCharArr.length; j<len2; j++) {
	// 		if (jiebaResult[i].tag != "eng" && jiebaResult[i].tag[0] == notKetwordTagFirstCharArr[j]) {
	// 			flag = false;
	// 			break;
	// 		}
	// 	}

	// 	if (flag) {
	// 		var f = true;
	// 		for(let t=0, len3=result.length; t<len3; t++) {
	// 			if (result[t].word == jiebaResult[i].word) {
	// 				result[t].count = result[t].count+1;
	// 				f = false;
	// 				break;
	// 			}
	// 		}
	// 		if (f) {
	// 			result[result.length] = {
	// 				word: jiebaResult[i].word,
	// 				tag: jiebaResult[i].tag,
	// 				count: 1
	// 			}
	// 		}
	// 	}
	// }
	var participleResult = participleFn(sentence, professionalNounsArr);
	let result = [];
	for(let i=0, len1=participleResult.length; i<len1; i++) {
		let flag = false;
		for(let j=0, len2=result.length; j<len2; j++) {
			if (participleResult[i].word == result[j].word) {
				flag = true;
				result[j].count ++;
				break;
			}
		}
		if (!flag) {
			result.push({
				word: participleResult[i].word,
				count: 1
			});
		}
	}

	return result;
}

/** 基于语义特征的句子相似度计算
 * @param keywordArr Array 提取的关键词数组
*/
function semSim(keywordArr1, keywordArr2) {
	var len1=keywordArr1.length, len2=keywordArr2.length;
	var similaryValueArr1 = [], similaryValueArr2 = [];
	// 计算词语之间的最大的相似度
	for(let i=0; i<len1; i++) {
		var max = 0;
		for(let j=0; j<len2; j++) {
			var simVal = wordSimilary(keywordArr1[i].word, keywordArr2[j].word);
			if (simVal > max) {
				max = simVal;
			}
		}
		similaryValueArr1.push(max);
	}
	for(let i=0; i<len2; i++) {
		var max = 0;
		for(let j=0; j<len1; j++) {
			var simVal = wordSimilary(keywordArr2[i].word, keywordArr1[j].word);
			if (simVal > max) {
				max = simVal;
			}
		}
		similaryValueArr2.push(max);
	}

	var sum1=0, sum2=0, count1=0, count2=0;
	for(let i=0; i<len1; i++) {
		sum1 = sum1 + similaryValueArr1[i]*keywordArr1[i].count;
		count1 = count1+keywordArr1[i].count;
	}
	for(let i=0; i<len2; i++) {
		sum2 = sum2 + similaryValueArr2[i]*keywordArr2[i].count;
		count2 = count2+keywordArr2[i].count;
	}

	return (sum1/count1 + sum2/count2)/2;
}

/** 句法相似度计算
*/
function treeSim(sentence1, sentence2, professionalNounsArr) {
	return SyntacticSimilarity(sentence1, sentence2, professionalNounsArr);
}

/** 词形相似度计算
 * @param keywordArr Array 抽取的关键词数组
*/
function wordSim(keywordArr1, keywordArr2) {
	var len1 = keywordArr1.length, len2 = keywordArr2.length;
	var simCount = 0, count1 = 0, count2 = 0;
	for(let i=0; i<len1; i++) {
		for(let j=0; j<len2; j++) {
			if (keywordArr1[i].word == keywordArr2[j].word) {
				var minCount = keywordArr1[i].count<keywordArr2[j].count ? keywordArr1[i].count : keywordArr2[j].count;
				simCount = simCount + minCount;
			}
		}
	}
	for(let i=0; i<len1; i++) {
		count1 = count1 + keywordArr1[i].count;
	}
	for(let i=0; i<len2; i++) {
		count2 = count2 + keywordArr2[i].count;
	}
	// console.log(simCount, count1, count2);

	return 2*simCount/(count1+count2);
}

/** 句子相似度计算
 * @param sentence1 String 句子1（考生答案）
 * @param sentence2 String 句子2（正确答案）
 * @param professionalNounsArr Array 专业名词数组
 * @return Number 句子相似度计算结果
*/
function sentenceSimilarity(sentence1, sentence2, professionalNounsArr) {
	let keywordArr1 = participle(sentence1, professionalNounsArr);
	let keywordArr2 = participle(sentence2, professionalNounsArr);

	let syn_sim = treeSim(sentence1, sentence2, professionalNounsArr);   // 句法相似度计算
	let sem_sim = semSim(keywordArr1, keywordArr2);   // 基于语义的句子相似度计算
	let word_sim = wordSim(keywordArr1, keywordArr2);   // 词形相似度计算

	console.log("syn_sim: " + syn_sim + ", sem_sim: " + sem_sim + ", word_sim: " + word_sim);

	return alpha*syn_sim + beta*sem_sim + gama* word_sim;
}

module.exports = sentenceSimilarity;