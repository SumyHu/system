/**
 * 非规则文本相似度计算
 * 参考文献：《基于语义的文本相似度算法研究及应用》 作者：张金鹏
 * 算法实现：分句——>分词——>根据词语的idf值和词语的出现次数获得该词语的实际权值——>基于余弦相似度的基础相似度计算+基于结构特性的结构相似度计算，求得句子的总体相似度——>句子聚类，求聚类后句子中间的相似度——>计算文本之间的相似度

 * 缺点：①过分依赖idf词典，如何填补词典没有的词语的idf值？②计算句子相似度中，基于结构特性的结构相似度计算是基于词语的词性匹配计算的，并没有实际深入考虑词义结构；③k-means聚类算法自身就存在一定的缺陷。
 * 优点：时间复杂度小
*/

const wordIdf = require("./wordIdf");
const postag = require("./postag");   // 转换词性

// 中文分词模块，该模块以盘古分词组件中的词库为基础
var Segment = require("segment");
var segment = new Segment();
segment.useDefault();

// 调用结巴分词
// var jieba = require("nodejieba");

// 调用k-means聚类算法
var kMeans = require("kmeans-js");

const nVal = 0.3;   // 名词比重
const vVal = 0.3;   // 动词比重
const aVal = 0.15;   //形容词和副词比重;
const otherVal = 0.1;   // 其他类型词语比重

const alpha = 0.66;   // 计算分词权重中IF-IDF所占比值
const lambdoid = 1.5;   // 重合度函数中λ的取值
const beta = 0.6;   // 计算句子总体相似度的β取值
const k = 5;   // 句子聚类的k取值
const delta = 0.2;   // 计算文本总体相似度的δ值

/** 文本分句
 * @param text String 分句的文本
 * @return clauseTextResult Array 文本的分句结果
*/
function clause(text) {
	var clauseBasis = ["。", "；", "！", "？"];
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

/** 获取词语的idf值
 * @param word String 词语
 * @return Number 传入的词语的idf值
*/
function getWordIdf(word) {
	return wordIdf.getWordIdf(word);
}

/** 句子分词，且获得各个分词在句子中出现的次数、权重和idf值
 * @param sentence String 句子
 * @return parResult Array 句子的分词结果
*/
function participle(sentence) {
	// var result = jieba.extract(sentence, kTop=100);
	// var result = jieba.tag("你好，你好，在做什么呢？我好想你呢，超级超级想你地地呢。");
	var segResult = segment.doSegment(sentence, {
		stripPunctuation: true,   // 去除标点符号
		stripStopword: true   // 去除停止符
	});

	var parResult = [];

	for(let i=0, len1=segResult.length; i<len1; i++) {
		var flag = true;
		for(let j=0, len2=parResult.length; j<len2; j++) {
			if (parResult[j].word == segResult[i].w) {
				parResult[j].count = parResult[j].count+1;
				flag = false;
				break;
			}
		}
		if (flag) {
			parResult.push({
				word: segResult[i].w,
				type: postag.getType(segResult[i].p),
				chsName: postag.chsName(segResult[i].p),
				weight: postag.getWeight(segResult[i].p),
				count: 1,
				idf: getWordIdf(segResult[i].w)
			});
		}
	}
	return parResult;
}

/** 获得分词的实际权值
 * @param wordTarget = {
	word: String,
	type: String,
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

/** 基于结构特性的结构相似度计算
 * @param wordTargetArr Array 存储一个句子中的各个分词对象
 * wordTargetArr = [{
	word: String,
	type: String,
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
			if (wordTargetArr1[i].type == wordTargetArr2[j].type) {
				console.log("==========");
				var matchCount = 0;
				for(let p=i, q=j; p<len1 && q<len2; p++, q++) {
					console.log(wordTargetArr1[p].type, wordTargetArr2[q].type)
					if (wordTargetArr1[p].type != wordTargetArr2[q].type) {
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

	console.log(l);

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
function calSentenceSimilary(sentence1, sentence2) {
	// 句子分词
	var parResult1 = participle(sentence1);
	var parResult2 = participle(sentence2);

	var weightArr1 = [], weightArr2 = [];
	for(let i=0, len=parResult1.length; i<len; i++) {
		weightArr1.push(getWordWeight(parResult1[i]));
	}
	for(let i=0, len=parResult2.length; i<len; i++) {
		weightArr2.push(getWordWeight(parResult2[i]));
	}

	var baseSimilaryVal = baseSimilary(weightArr1, weightArr2);
	var structureSimilaryVal = structureSimilary(parResult1, parResult2);
	return sentenceSimilary(baseSimilaryVal, structureSimilaryVal);
}

/** 文本句子聚类
 * @param data Array 存储需要聚类的句子数组
 * @return Array 文本句子聚类的结果
*/
function textClustering(data) {
	var reallyK = data.length<k ? data.length : k;
	console.log("reallyK: " + reallyK);
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

/** 句子数组之间相似度计算
 * @param sentenceArr Array 比较的句子数组（该句子数组已经经过处理，如聚类）
 * @return Number 句子数组之间相似度的计算结果
*/
function calTotalSentenceSimilary(sentenceArr1, sentenceArr2) {
	var len1 = sentenceArr1.length; 
	var len2 = sentenceArr2.length;

	var tempSentenceArr1=[], tempSentenceArr2=[];
	for(let i=0; i<len1; i++) {
		tempSentenceArr1[i] = sentenceArr1[i];
	}
	for(let i=0; i<len2; i++) {
		tempSentenceArr2[i] = sentenceArr2[i];
	}

	var big = (len1>len2) ? len1 : len2;
	var matchCount = (len1<len2) ? len1 : len2;
	var count = 0, sum=0;
	while(count < matchCount) {
		var maxSentenceSimilaryVal = 0;
		var index1=0, index2=0;
		for(let i=0; i<len1; i++) {
			for(let j=0; j<len2; j++) {
				var currentSentenceSimilaryVal = calSentenceSimilary(sentenceArr1[i], sentenceArr2[j]);
				if (currentSentenceSimilaryVal > maxSentenceSimilaryVal) {
					maxSentenceSimilaryVal = currentSentenceSimilaryVal;
					index1 = i;
					index2 = j;
				}
			}
		}
		// 欠一个计算句子数组相似度的公式，暂定
		sum += maxSentenceSimilaryVal;
		tempSentenceArr1.splice(index1, 1);
		tempSentenceArr2.splice(index2, 1);
		count ++;
	}

	return (sum + delta * (big - matchCount)) / big;
}

/** 文本之间的总体相似度计算
 * @param text String 计算相似度的文本
*/
function calTextSimilary(text1, text2) {
	// 段落分句
	var clauseTextResult1 = clause(text1);
	var clauseTextResult2 = clause(text2);

	var sentenceArr1 = clauseTextResult1, sentenceArr2 = clauseTextResult2;
	if (clauseTextResult1.length > 10 && clauseTextResult2 > 10) {
		sentenceArr1 = textClustering(clauseTextResult1);
		sentenceArr2 = textClustering(clauseTextResult2);
	}
	return calTotalSentenceSimilary(sentenceArr1, sentenceArr2);
}

module.exports = calTextSimilary;