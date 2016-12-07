/**
 * 句法相似度计算
 * 参考文献《汉语词法分析和句法分析技术综述》
 * 参考网址：http://download.csdn.net/detail/tongtonggoodgood/5236310?locationNum=12&fps=1
*/

const participle = require("./participle");

/** 句法规则
 * PRON: 代词
 * N: 名词
 * V: 动词
 * ADJ: 形容词
 * ADV: 副词
 * NUM: 数词
 * CLAS: 度量单位
 * PREP: 介词

 ** 注意：有些规则间可能会导致无限死循环（如Sφ），要将可能导致死循环的部分在实际生成树的过程中添加限制条件，避免死循环的产生
*/
const SyntacticRules = {
	S: [["NP", "VP"]],
	NP: [["PRON"], ["N"], ["ADJ", "N"], ["Sφ", "的"] , ["DJ", "NP"]],
	DJ: [["NP", "的"], ["QUAN", "的"], ["VP", "的"]],
	// Sφ: [[NP, VPφ]],
	// VPφ: [[V, V]],
	Sφ: [["NP", "VC"]],
	QUAN: [["NUM", "N"], ["NUM", "CLAS"]],
	VP: [["VC"], ["DV", "ADJ"], ["PP", "VP"], ["VC", "NP"], ["VC", "VP"], ["DV", "VP"]],
	VC: [["V"], ["V", "V"], ["V", "ADJ"]],
	DV: [["ADV"], ["ADV", "地"], ["ADJ", "地"], ["NP", "地"]],
	PP: [["PREP", "NP"]]
}

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

	/** 不同词性组合成的所有句子的可能
	 * allPossibleSentence = [[{word: "", type: ""}, {}, {}...], []]
	*/
	var allPossibleSentence = [];

	if (typeNumMoreThanOne.length > 0) {
		/** 所有多词性词语的组合的可能，单单针对多词性的那几个词进行组合
		 * allPossible = [{
			word: String,
			type: String,
			wordIndex: Number
		 }]
		*/
		var allPossible = [];
		recursion(typeNumMoreThanOne, 0, [], allPossible);

		for(let i=0, len1=allPossible.length; i<len1; i++) {
			var lastIndex = allPossibleSentence.length;
			allPossibleSentence[lastIndex] = [];
			outer: for(let j=0, len2=wordArr.length; j<len2; j++) {
				for(let t=0, len3=allPossible[i].length; t<len3; t++) {
					if (j == allPossible[i][t].wordIndex) {
						var type = allPossible[i][t].type;
						if (allPossible[i][t].word == "的" || type != "STRU" || type != "ECHO" || type != "CONJ") {
							allPossibleSentence[lastIndex].push({
								word: allPossible[i][t].word,
								type: allPossible[i][t].type
							});
						}
						continue outer;
					}
				}
				if (wordArr[j].word == "的" || wordArr[j].type != "STRU" || wordArr[j].type != "ECHO" || wordArr[j].type != "CONJ") {
					allPossibleSentence[lastIndex].push({
						word: wordArr[j].word,
						type: wordArr[j].type[0]
					});
				}
			}
		}
	}

	else {
		allPossibleSentence[0] = []
		for(let i=0, len=wordArr.length; i<len; i++) {
			allPossibleSentence[0].push({
				word: wordArr[i].word,
				type: wordArr[i].type[0]
			});
		}
	}

	return allPossibleSentence;
}

// 判断该规则是否已经添加过了，避免死循环的产生
function judgeTheRulesIfHadPush(theRulesHadPush, stackListNode) {
	let pushArr = SyntacticRules[stackListNode.node][stackListNode.index];

	let hasPushFlag = false;
	for(let i=0, len1=theRulesHadPush.length; i<len1; i++) {
		hasPushFlag = false;
		if (theRulesHadPush[i].parent == stackListNode.node) {
			// console.log("0000000000");
			// console.log(theRulesHadPush[i].childNodes);
			// console.log("999999999999");
			// console.log(pushArr);
			hasPushFlag = true;

			if (theRulesHadPush.length == 0) {
				hasPushFlag = false;
			}
			else if (pushArr.length != theRulesHadPush[i].childNodes.length) {
				hasPushFlag = false;
			}
			else {
				for(let j=0, len2=pushArr.length; j<len2; j++) {
					if (theRulesHadPush[i].childNodes[j] != pushArr[j]) {
						hasPushFlag = false;
						break;
					}
				}
			}
		}
		if (hasPushFlag) break;
	}

	if (hasPushFlag) {
		// console.log("node: " + stackListNode.node + " index: " + stackListNode.index);
	}

	return hasPushFlag;
}

/** 建立句法树
 * @param onePossibleSentenceWordArr Array 分词后的某一可能的句子的词语数组
 * onePossibleSentenceWordArr = [{
		word: String,
		type: String
 }, {}, {}, ...]
*/
function buildTree(onePossibleSentenceWordArr) {
	var currentWordArrIndex = 0;    // 记录当前还未被句法树找到的第一个词语的下标

	/** 用于存储当前的句法树的栈
	 * stackList = [{
		node: String,   // 非终结符号
		index: Number or "-"    // 当前非终结符号所选组成部分的下标，"-"表示还未开始选择
	 }]
	*/
	var stackList = [{node: "S", index: "-"}];

	/** 用于存储每个分词生成的句法树
	 * 从最底层开始存储句法树的node值
	 * wordSyntaxTree = [[{node: "我", index: "-"}, {node: "PRON", index: 1}, {}, ...]]
	*/
	var wordSyntaxTree = [];

	/** 用于存储已经入栈的规则，若该规则已经存在，则不添加，避免死循环的产生
	 * 一个词一个存储入栈的规则的数组
	*/
	var theRulesHadPush = [];

	while(stackList.length > 0 && currentWordArrIndex < onePossibleSentenceWordArr.length) {
		// 若该非终结符在句法规则找不到该非终结符对应的键值，则说明该非终结符是词语的词性或“的”
		// console.log("stackList");
		// console.log(stackList);
		// console.log("theRulesHadPush");
		// console.log(theRulesHadPush);
		if (!SyntacticRules[stackList[stackList.length-1].node]) {
			console.log("node: " + stackList[stackList.length-1].node);

			// 若最后的非终结符跟当前未被句法树找到的第一个词语的词性相等
			// 将该词语的句法树存储到wordSyntaxTree数组中
			if ((stackList[stackList.length-1].node == onePossibleSentenceWordArr[currentWordArrIndex].type) || (stackList[stackList.length-1].node == "的" && onePossibleSentenceWordArr[currentWordArrIndex].word == "的") || (stackList[stackList.length-1].node == "地" && onePossibleSentenceWordArr[currentWordArrIndex].word == "地")) {
				let pushTarget = wordSyntaxTree[wordSyntaxTree.length] = [];
				pushTarget.push({
					node: onePossibleSentenceWordArr[currentWordArrIndex].word,
					index: "-"
				});

				let removeNode = stackList.pop();

				if (removeNode.node == onePossibleSentenceWordArr[currentWordArrIndex].type) {
					// console.log("len: " + stackList.length);
					console.log("stackList");
					console.log(stackList);
					// console.log("theRulesHadPush");
					// console.log(theRulesHadPush);
					console.log("node: " + removeNode.node + "  word: " + onePossibleSentenceWordArr[currentWordArrIndex].word + " index: " + currentWordArrIndex);
					pushTarget.push({
						node: removeNode.node,
						index: removeNode.index
					});
				}

				currentWordArrIndex ++;   // 当前还未被句法树找到的第一个词语的下标下移一位

				while(stackList[stackList.length-1] && stackList[stackList.length-1].index != "-") {   // 将该节点从栈中移除
					let removeNode = stackList.pop();
					theRulesHadPush.pop();
					pushTarget.push({
						node: removeNode.node,
						index: removeNode.index
					});
				}
				for(let i=stackList.length-1; i>=0; i--) {
					if (stackList[i].index != "-") {
						// console.log("node: " + stackList[i].node);

						pushTarget.push({
							node:stackList[i].node,
							index: stackList[i].index
						});
					}
				}
			}
			// else if(stackList[stackList.length-1].node == "的" || stackList[stackList.length-1].node == "地") {
			// 	let pushTarget = wordSyntaxTree[wordSyntaxTree.length] = [];
			// 	pushTarget.push(stackList.pop().node);
			// 	while(stackList[stackList.length-1] && stackList[stackList.length-1].index != "-") {   // 将该节点从栈中移除
			// 		theRulesHadPush.pop();
			// 		pushTarget.push(stackList.pop().node);
			// 	}
			// 	for(let i=stackList.length-1; i>=0; i--) {
			// 		if (stackList[i].index != "-") {
			// 			// console.log("node: " + stackList[i].node);

			// 			pushTarget.push(stackList[i].node);
			// 		}
			// 	}
			// }
			else {   
				let endFlag = stackList[1];

				// 将不可行的节点从栈中一一删除
				while(stackList.length > 0 && (stackList[stackList.length-1].index == "-" || stackList[stackList.length-1].index == SyntacticRules[stackList[stackList.length-1].node].length-1)){
					let removeNode = stackList.pop();
					// console.log("removeNode: ");
					// console.log(removeNode);
					// console.log("len: " + stackList.length);
					if (removeNode.index != "-") {
						theRulesHadPush.pop();
					}
				}

				if (stackList.length == 0 && endFlag.node == "NP" && endFlag.index == SyntacticRules["NP"].length-1) {
					console.log("ending");
					return;
				}

				let removeTree = [];
				// 将不可行的句法树的前面匹配部分一一添加到removeTree数组中
				for(let i=stackList.length-1; i>=0; i--) {
					if (stackList[i].index != "-") {
						removeTree.push(stackList[i].node);
					}
				}

				// console.log("removeTree----------");
				// console.log(removeTree);

				if (removeTree.length > 0) {
					// 将从wordSyntaxTree一一找出不可行的句法树，并从wordSyntaxTree中全部删除
					for(let i=wordSyntaxTree.length-1; i>=0; i--) {
						let flag = true;
						for(let w=wordSyntaxTree[i].length-1, r=removeTree.length-1; r>=0; w--, r--) {
							if (wordSyntaxTree[i][w].node != removeTree[r]) {
								flag = false;
								break;
							}
						}

						if (flag) {
							let lastWordSyntaxTree = wordSyntaxTree[i];
							// console.log(lastWordSyntaxTree);

							for(let j=1, len=lastWordSyntaxTree.length-stackList.length-1; j<len; i++) {
								stackList.push({
									node: lastWordSyntaxTree[j].node,
									index: lastWordSyntaxTree[j].index
								});

								theRulesHadPush.push({
									parent: lastWordSyntaxTree[j].node,
									childNodes: []
								});
								if (lastWordSyntaxTree[j].index >= 0) {
									let SyntacticRulesContent = SyntacticRules[lastWordSyntaxTree[j].node][lastWordSyntaxTree[j].index];
									for(let t=0,len1=SyntacticRulesContent.length; t<len1; t++) {
										theRulesHadPush[theRulesHadPush.length-1].childNodes.push(SyntacticRulesContent[t]);
									}
								}
							}

							wordSyntaxTree.splice(i, 1);
							currentWordArrIndex --;   // 当前还未被句法树找到的第一个词语的下标上移一位
							break;
							// console.log(removeTree);
							// console.log("currentWordArrIndex: " + currentWordArrIndex);
						}
					}
				}

				// let lastWordSyntaxTree = wordSyntaxTree[wordSyntaxTree.length-1];
				// for(let i=1, len=lastWordSyntaxTree.length-stackList.length-1; i<len; i++) {
				// 	stackList.push({
				// 		node: lastWordSyntaxTree.node,
				// 		index: lastWordSyntaxTree.index
				// 	});

				// 	theRulesHadPush.push({
				// 		parent: lastWordSyntaxTree.node,
				// 		childNodes: []
				// 	});
				// 	let SyntacticRulesContent = SyntacticRules[lastWordSyntaxTree.node][lastWordSyntaxTree.index];
				// 	for(let j=0,len1=SyntacticRulesContent.length; j<len1; j++) {
				// 		theRulesHadPush[theRulesHadPush.length-1].childNodes.push(SyntacticRulesContent[j]);
				// 	}
				// }

				// wordSyntaxTree.splice(wordSyntaxTree.length-1, 1);
				// currentWordArrIndex --;   // 当前还未被句法树找到的第一个词语的下标上移一位
			}
		}
		else {   // 继续往下扩展规则
			let stackListLastNode = stackList[stackList.length-1];
			// console.log("stackListLastNode===============");
			// console.log(stackListLastNode);
			if (stackListLastNode.index == "-") {
				stackListLastNode.index = 0;
			}
			else {
				// 判断最后一个节点是否已经遍历完了所有的可能
				if (stackListLastNode.index < SyntacticRules[stackListLastNode.node].length-1) {
					stackListLastNode.index ++;
				}
				else {
					stackListLastNode.index = -1;
				}
			}

			if (stackListLastNode.index > -1) {
				let pushArr = SyntacticRules[stackListLastNode.node][stackListLastNode.index];

				// 判断该规则是否已经添加过了，避免死循环的产生
				let hasPushFlag = judgeTheRulesIfHadPush(theRulesHadPush, stackListLastNode);
				// let hasPushFlag = false;
				// for(let i=0, len1=theRulesHadPush.length; i<len1; i++) {
				// 	hasPushFlag = false;
				// 	if (theRulesHadPush[i].parent == stackListLastNode.node) {
				// 		// console.log("0000000000");
				// 		// console.log(theRulesHadPush[i].childNodes);
				// 		// console.log("999999999999");
				// 		// console.log(pushArr);
				// 		hasPushFlag = true;

				// 		if (pushArr.length != theRulesHadPush[i].childNodes.length) {
				// 			hasPushFlag = false;
				// 		}
				// 		else {
				// 			for(let j=0, len2=pushArr.length; j<len2; j++) {
				// 				if (theRulesHadPush[i].childNodes[j] != pushArr[j]) {
				// 					hasPushFlag = false;
				// 					break;
				// 				}
				// 			}
				// 		}
				// 	}
				// 	if (hasPushFlag) break;
				// }

				if (!hasPushFlag) {   // 若该规则没有被添加过，则添加
					for(let i=pushArr.length-1; i>=0; i--) {
						stackList.push({
							node: pushArr[i],
							index: "-"
						});
					}
					let childNodes = [];
					for(let i=0, len=pushArr.length; i<len; i++) {
						childNodes.push(pushArr[i]);
					}

					let prevIndex = stackListLastNode.index-1;
					if (prevIndex >= 0) {
						// let theRulesHadPushLastNode = theRulesHadPush[theRulesHadPush.length-1];
						// if (stackListLastNode.node == theRulesHadPushLastNode.parent) {
						// 	let simFlag = true;
						// 	let stackListLastNodeChildNodes = SyntacticRules[stackListLastNode.node][prevIndex];
						// 	for(let i=0, len=theRulesHadPushLastNode.childNodes.length; i<len; i++) {
						// 		if (stackListLastNodeChildNodes[i] != theRulesHadPushLastNode.childNodes[i]) {
						// 			simFlag = false;
						// 			break;
						// 		}
						// 	}

						// 	if (simFlag) {
						// 		theRulesHadPush.pop();
						// 	}
						// }

						let judgeFlag = judgeTheRulesIfHadPush(theRulesHadPush, {node: stackListLastNode.node, index: prevIndex});

						// if (stackListLastNode.hasPushTheRules) {
						// 	theRulesHadPush.pop();
						// }
						if (judgeFlag) {
							theRulesHadPush.pop();
						}
					}

					// stackListLastNode.hasPushTheRules = true;

					theRulesHadPush.push({
						parent: stackListLastNode.node,
						childNodes: childNodes
					});

					// console.log(theRulesHadPush);
				}
			}
			else {
				let removeNode = stackList.pop();   // 将已经遍历完了的当前节点删除
				// console.log("remove:   --------------");
				// console.log(removeNode);
				// if (removeNode.hasPushTheRules) {
				// 	theRulesHadPush.pop();
				// }
				if (judgeTheRulesIfHadPush(theRulesHadPush, {node: removeNode.node, index: SyntacticRules[removeNode.node].length-1})) {
					theRulesHadPush.pop();
				}

				while(stackList.length > 0 && stackList[stackList.length-1].index == "-") {
					stackList.pop();
				}

				if (stackList.length == 0) {
					console.log("end");
					return;
				}
			}
		}

		// if (stackList.length == 1 && stackList[0].node == "S" && stackList[0].index == 0) {
		// 	console.log("ending");
		// 	return;
		// }

		// 栈为空，但还有分词没有被找到，或者栈不为空，但所有的分词已经被找到了，执行算法回退
		if ((stackList.length == 0 && currentWordArrIndex < onePossibleSentenceWordArr.length && wordSyntaxTree.length > 0) || (stackList.length > 0 && currentWordArrIndex == onePossibleSentenceWordArr.length && wordSyntaxTree.length > 0)) {
			// console.log("wwwwwwwwwww: " + stackList.length + ", " + currentWordArrIndex);

			let lastWordSyntaxTree = wordSyntaxTree[wordSyntaxTree.length-1];
			let cutIndex;
			for(let i=0, len=lastWordSyntaxTree.length; i<len; i++) {
				if (SyntacticRules[lastWordSyntaxTree[i].node]) {
					cutIndex = i;
					break;
				}
			}

			if (stackList.length > 0 && currentWordArrIndex == onePossibleSentenceWordArr.length) {
				while (stackList[stackList.length-1].index == "-") {
					stackList.pop();
				}
			}
			else {
				for(let i=lastWordSyntaxTree.length-1; i>=cutIndex; i--) {
					stackList.push({
						node: lastWordSyntaxTree[i].node,
						index: lastWordSyntaxTree[i].index
					});

					if (!judgeTheRulesIfHadPush(theRulesHadPush, stackList[stackList.length-1])) {
						theRulesHadPush.push({
							parent: stackList[stackList.length-1].node,
							childNodes: []
						});
						let childNodesArr = SyntacticRules[stackList[stackList.length-1].node][stackList[stackList.length-1].index];
						for(let j=0, len=childNodesArr.length; j<len; j++) {
							theRulesHadPush[theRulesHadPush.length-1].childNodes.push(childNodesArr[j]);
						}
					}
				}
			}

			wordSyntaxTree.splice(wordSyntaxTree.length-1, 1);
			currentWordArrIndex --;
		}
	}

	// console.log("len: " + stackList.length);
	// console.log("currentWordArrIndex: " + currentWordArrIndex);
	// console.log("0: " + onePossibleSentenceWordArr.length);

	if (stackList.length == 0 && currentWordArrIndex == onePossibleSentenceWordArr.length) {
		return wordSyntaxTree;
	}
	else {
		console.log(stackList.length, currentWordArrIndex);
		console.log("该句子不能构成句法树");
		return;
	}
}

/** 将一个句子的所有可能句法树罗列出来
 * @param sentence String 句子
*/
function allTreeOfOneSentence(sentence) {
	var participleResult = participle(sentence);   // 将句子分词
	console.log(participleResult);
	var allPossibleSentence = combinAllPosibility(participleResult);   // 获取所有可能词性组合的所有句子集合
	console.log(allPossibleSentence[8]);

	// var allTreeArr = [];
	// for(let i=0, len=allPossibleSentence.length; i<len; i++) {
	// 	console.log("i: " + i);

	// 	var result = buildTree(allPossibleSentence[i]);

	// 	if (result) {
	// 		console.log(allPossibleSentence[i]);
	// 		console.log(result);
	// 		allTreeArr.push(result);
	// 	}
	// }
	// console.log(allTreeArr);

	console.log(buildTree(allPossibleSentence[8]));
}

function synaticSimilaryCla() {}

module.exports = allTreeOfOneSentence;