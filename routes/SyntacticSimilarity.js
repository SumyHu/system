/**
 * 句法相似度计算
 * 参考文献《汉语词法分析和句法分析技术综述》
 * 参考网址：http://download.csdn.net/detail/tongtonggoodgood/5236310?locationNum=12&fps=1
*/

/** 递归罗列出具有多种词性词语的各种组合
 * @param arr Array 具有多种词性的词语数组
 * @param currentArrayIndex Number 当前arr的下标
 * @param currentIndexArr Array 当前记录递归各层次下标的数组
 * @param result Array 记录各种可能的组合的数组
*/
function recursion(arr, currentArrayIndex, currentIndexArr, result) {
	// console.log(arr.length-1);
	// console.log("00000: " + currentArrayIndex);
	// console.log(currentIndexArr);
	// console.log(result);
	if (currentArrayIndex == arr.length-1) {
		for(let i=0, len=arr[currentArrayIndex].type.length; i<len; i++) {
			currentIndexArr.push(i);

			var lastIndex = result.length;
			if (!result[lastIndex]) {
				result[lastIndex] = [];
			}
			for(let j=0, len1=currentIndexArr.length; j<len1; j++) {
				result[lastIndex].push({
					wordIndex: arr[j].wordIndex,
					word: arr[j].word,
					type: arr[j].type[currentIndexArr[j]]
				});
			}

			currentIndexArr.pop();
		}
	}
	else {
		for(let i=0, len=arr[currentArrayIndex].type.length; i<len; i++) {
			currentIndexArr.push(i);

			recursion(arr, currentArrayIndex+1, currentIndexArr, result);

			currentIndexArr.pop();
		}
	}

	// return indexArr;
}

/** 由于有些词语可能具有不止一个的词性，因此罗列出一个句子不同词性组合的所有结果
 * @param wordArr Array 分词的结果
 * wordArr = [{word: "", type: ["", "", ...]}, {}, {}, ...]
*/
function combinAllPosibility(wordArr) {
	var typeNumMoreThanOne = [];
	for(let i=0, len=wordArr.length; i<len; i++) {
		if (wordArr[i].type.length > 1) {
			typeNumMoreThanOne.push({
				word: wordArr[i].word,
				type: wordArr[i].type,
				wordIndex: i   // 该分词在分词数组中的下标
			});
		}
	}

	console.log(typeNumMoreThanOne);

	/** 所有多词性词语的组合的可能，单单针对多词性的那几个词进行组合
	 * allPossible = [{
		word: "",
		type: "",
		wordIndex: 0
	 }]
	*/
	var allPossible = [];
	recursion(typeNumMoreThanOne, 0, [], allPossible);

	console.log(allPossible);

	/** 不同词性组合成的所有句子的可能
	 * allPossibleSentence = [[{word: "", type: ""}, {}, {}...], []]
	*/
	var allPossibleSentence = [];
	for(let i=0, len1=allPossible.length; i<len1; i++) {
		var lastIndex = allPossibleSentence.length;
		allPossibleSentence[lastIndex] = [];
		outer: for(let j=0, len2=wordArr.length; j<len2; j++) {
			for(let t=0, len3=allPossible[i].length; t<len3; t++) {
				if (j == allPossible[i][t].wordIndex) {
					if (allPossible[i][t].word == "的" || allPossible[i][t].type != "STRU") {
						allPossibleSentence[lastIndex].push({
							word: allPossible[i][t].word,
							type: allPossible[i][t].type
						});
					}
					continue outer;
				}
			}
			if (wordArr[j].type == "的" || wordArr[j].type != "STRU") {
				allPossibleSentence[lastIndex].push({
					word: wordArr[j].word,
					type: wordArr[j].type[0]
				});
			}
		}
	}

	console.log(allPossibleSentence);
}

module.exports = combinAllPosibility;