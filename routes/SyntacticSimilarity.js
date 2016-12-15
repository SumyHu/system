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
	S: [["NP"], ["VP"], ["NP", "VP"]],
	NP: [["PRON"], ["N"], ["ADJ", "N"], ["Sφ", "的"] , ["DJ", "NP"]],
	DJ: [["N", "的"], ["NP", "的"], ["QUAN", "的"], ["VP", "的"]],
	// Sφ: [[NP, VPφ]],
	// VPφ: [[V, V]],
	Sφ: [["NP", "VC"]],
	QUAN: [["NUM", "N"], ["NUM", "CLAS"]],
	VP: [["VC"], ["DV", "ADJ"], ["PP", "VP"], ["VC", "NP"], ["VC", "VP"], ["DV", "VP"]],
	VC: [["V"], ["V", "V"], ["V", "ADJ"]],
	DV: [["ADV"], ["ADJ"], ["ADV", "地"], ["ADJ", "地"], ["NP", "地"]],
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

 * @return allPossibleSentence Array 所有词性组合成句子的所有结果
 * allPossibleSentence = [[{word: String, type: String}, {}, {}...], []]
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
	 * allPossibleSentence = [[{word: String, type: String}, {}, {}...], []]
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
						if (type != "STRU" || type != "ECHO" || type != "CONJ") {
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

/** 判断该规则是否已经添加过了，避免死循环的产生
 * @param theRulesHadPush Array 该分词句法树已经添加的规则（避免重复添加，从而导致死循环）

 * @param stackListNode Object 当前想要扩展句法树的节点（判断想要扩展的规则是否与前面添加的规则重复）
 * stackListNode = {node: String, index: "-" or Number}

 * @return boolean 该规则是否已经存在，若存在，返回true，否则返回false
*/
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
		if (hasPushFlag) {
			return i;
		}
	}

	// if (hasPushFlag) {
		// console.log("node: " + stackListNode.node + " index: " + stackListNode.index);
	// }

	return -1;
}

/** 将新的规则添加进theRulesHadPush
 * @param theRulesHadPush Array 存储已经添加的规则的栈
 * @param stackListNode Object 栈中的某个节点
*/
function addRuleInHadPush(theRulesHadPush, stackListNode) {
	theRulesHadPush.push({
		parent: stackListNode.node,
		childNodes: []
	});
	let childNodesArr = SyntacticRules[stackListNode.node][stackListNode.index];
	for(let j=0, len=childNodesArr.length; j<len; j++) {
		theRulesHadPush[theRulesHadPush.length-1].childNodes.push(childNodesArr[j]);
	}
}

/** 判断即将改变的当前节点下是否有找到的分词
 * @parma stackList Array 当前句法树栈
 * @param wordSyntaxTree Array 当前已成功构成句法树的分词句法树集合
 * @param stackListLastNodeIndex Number 栈最后一个节点选取的规则下标
 * @param callback function 回调函数
*/
function findTreeInCurrentList(stackList, wordSyntaxTree, stackListLastNodeIndex, callback) {
	if (wordSyntaxTree.length > 0) {
		let compareTree = [{
			node: stackList[stackList.length-1].node,
			index: stackListLastNodeIndex
		}];
		for(let i=stackList.length-2; i>=0; i--) {
			if (stackList.index != "-") {
				compareTree.push({
					node: stackList[i].node,
					index: stackList[i].index
				});
			}
		}

		for(let i=wordSyntaxTree.length-1; i>=0; i--) {
			let flag = true;   // 判断相不相等的的标记
			if (wordSyntaxTree[i].tree.length < compareTree.length) {
				flag = false;
			}
			for(let n=wordSyntaxTree[i].tree.length-1, m=compareTree.length-1; m>=0;n--, m--) {
				if (!(wordSyntaxTree[i].tree[n].node == compareTree[m].node && wordSyntaxTree[i].tree[n].index == compareTree[m].index)) {
					flag = false;
					break;
				}
			}

			if (flag) {
				// console.log("wordSyntaxTree---------splice");
				// console.log(wordSyntaxTree[i]);
				callback(i);
			}
		}
	}
}

/** 将某个句法树回退
 * @param
*/
function wordTreeGoBack(wordSyntaxTreeTarget, stackList, theRulesHadPush) {
	// console.log("---------");
	// console.log(stackList);
	// console.log(theRulesHadPush);
	// console.log(wordSyntaxTreeTarget);
	let startIndex = 2, flag;
	if (wordSyntaxTreeTarget.tree[0].node == "的" || wordSyntaxTreeTarget.tree[0].node == "地") {
		startIndex = 1;
	}
	// 判断是否存在该分词的句法结构树是否还可以有其他可能
	for(let i=startIndex, len=wordSyntaxTreeTarget.tree.length; i<len; i++) {
		flag = false;
		if (wordSyntaxTreeTarget.tree[i].index < SyntacticRules[wordSyntaxTreeTarget.tree[i].node].length-1) {
			flag = true;
			break;
		}
	}

	if (flag) {
		while(stackList.length > 0) {
			stackList.pop();
		}
		while(theRulesHadPush.length > 0) {
			theRulesHadPush.pop();
		}
		for(let i=0, len=wordSyntaxTreeTarget.stackList.length; i<len; i++) {
			stackList.push({
				node: wordSyntaxTreeTarget.stackList[i].node,
				index: wordSyntaxTreeTarget.stackList[i].index
			});

			if (stackList[stackList.length-1].index >= 0) {
				addRuleInHadPush(theRulesHadPush, stackList[stackList.length-1]);
			}
		}
	}
	while(stackList[stackList.length-1].index == "-") {
		stackList.pop();
	}
	// console.log("=================");
	// console.log(stackList);
	// console.log(theRulesHadPush);
	// // 若该句法结构树存在其他可能，则重新构建句法树
	// if (flag) {
	// 	for(let i=wordSyntaxTreeTarget.length-1; i>=startIndex; i--) {
	// 		let bool = false, index;
	// 		for(let j=0, len=stackList.length; j<len; j++) {
	// 			if (stackList[j].node == wordSyntaxTreeTarget[i].node) {
	// 				index = j;
	// 				bool = true;
	// 				break;
	// 			}
	// 		}
	// 		if (bool) {
	// 			if (stackList[index].index >= 0) {
	// 				let theRulesHadPushIndex = judgeTheRulesIfHadPush(theRulesHadPush, stackList[index]);
	// 				if (theRulesHadPushIndex >= 0) {
	// 					if (stackList[index].node == "S") {
	// 						console.log("splice================");
	// 						console.log(theRulesHadPush[theRulesHadPushIndex]);
	// 					}
	// 					theRulesHadPush.splice(theRulesHadPushIndex, 1);
	// 				}
	// 			}
				
	// 			stackList[index].index = wordSyntaxTreeTarget[i].index;
	// 		}
	// 		else {
	// 			stackList.push({
	// 				node: wordSyntaxTreeTarget[i].node,
	// 				index: wordSyntaxTreeTarget[i].index
	// 			});
	// 		}

	// 		// 添加该新添加的栈的子句法树
	// 		let syntac = SyntacticRules[wordSyntaxTreeTarget[i].node][wordSyntaxTreeTarget[i].index];
	// 		// console.log("====================");
	// 		// console.log(wordSyntaxTreeTarget);
	// 		for(let t=syntac.length-1; t>=0; t--) {
	// 			stackList.push({
	// 				node: syntac[t],
	// 				index: "-"
	// 			});
	// 		}

	// 		// 添加相应的规则进theRulesHadPush
	// 		let theRulesHadPushIndex = judgeTheRulesIfHadPush(theRulesHadPush, wordSyntaxTreeTarget[i]);
	// 		if (theRulesHadPushIndex == -1) {
	// 			addRuleInHadPush(theRulesHadPush, wordSyntaxTreeTarget[i]);
	// 		}
	// 	}

		// while(stackList[stackList.length-1].index == "-") {
		// 	stackList.pop();
		// }
	// }

	// console.log("==============");
	// console.log(stackList);
	// console.log(theRulesHadPush);
	// console.log("7777777777777777");
	// console.log(stackList);
}

/** 建立句法树
 * @param onePossibleSentenceWordArr Array 分词后的某一可能的句子的词语数组
 * onePossibleSentenceWordArr = [{
		word: String,
		type: String
 }, {}, {}, ...]

 //若为该句子成功构建句法树
 * @return wordSyntaxTree Array 该句子所有分词构成的句法树的集合
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
	 * wordSyntaxTree = [{
	 	stackList: [{node: "S", index: "2"}, {node: "VP", index: "-"}, {node: "NP", index: "1"}, {node: "PRON", index: "-"}],
	 	tree: [{node: "我", index: "-"}, {node: "PRON", index: "-"}, {node: "NP", index: 1}, {node: "S", index: 2}],
	 	{}, {}, ...]
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
		// for(let i=0, len=wordSyntaxTree.length; i<len; i++) {
		// 	console.log(wordSyntaxTree[i].stackList);
		// 	console.log(wordSyntaxTree[i].tree);
		// }
		if (!SyntacticRules[stackList[stackList.length-1].node]) {
			// console.log("node: " + stackList[stackList.length-1].node);

			// 若最后的非终结符跟当前未被句法树找到的第一个词语的词性相等
			// 将该词语的句法树存储到wordSyntaxTree数组中
			if ((stackList[stackList.length-1].node == onePossibleSentenceWordArr[currentWordArrIndex].type) || (stackList[stackList.length-1].node == "的" && onePossibleSentenceWordArr[currentWordArrIndex].word == "的") || (stackList[stackList.length-1].node == "地" && onePossibleSentenceWordArr[currentWordArrIndex].word == "地")) {
				let lastWordSyntaxTree = wordSyntaxTree[wordSyntaxTree.length] = {
					stackList: [],
					tree: []
				};
				let wordStackList = lastWordSyntaxTree.stackList;
				let tree = lastWordSyntaxTree.tree;

				for(let i=0, len=stackList.length; i<len; i++) {
					wordStackList.push({
						node: stackList[i].node,
						index: stackList[i].index
					});
				}

				tree.push({
					node: onePossibleSentenceWordArr[currentWordArrIndex].word,
					index: "-"
				});

				let removeNode = stackList.pop();

				if (removeNode.node == onePossibleSentenceWordArr[currentWordArrIndex].type) {
					console.log("len: " + stackList.length);
					console.log("stackList");
					console.log(stackList);
					console.log("theRulesHadPush");
					console.log(theRulesHadPush);
					console.log("node: " + removeNode.node + "  word: " + onePossibleSentenceWordArr[currentWordArrIndex].word + " index: " + currentWordArrIndex);
					tree.push({
						node: removeNode.node,
						index: removeNode.index
					});
				}
				else {
					wordStackList.push({
						node: onePossibleSentenceWordArr[currentWordArrIndex].word,
						index: "-"
					});
				}

				currentWordArrIndex ++;   // 当前还未被句法树找到的第一个词语的下标下移一位

				while(stackList[stackList.length-1] && stackList[stackList.length-1].index != "-") {   // 将该节点从栈中移除
					let removeNode = stackList.pop();
					theRulesHadPush.pop();
					tree.push({
						node: removeNode.node,
						index: removeNode.index
					});
				}
				for(let i=stackList.length-1; i>=0; i--) {
					if (stackList[i].index != "-") {
						// console.log("node: " + stackList[i].node);

						tree.push({
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
				// let endFlag = stackList[1];

				// 将不可行的节点从栈中一一删除
				// while(stackList.length > 0 && stackList[stackList.length-1].index == "-"){
				// 	let removeNode = stackList.pop();
					// console.log("removeNode: ");
					// console.log(removeNode);
					// console.log("len: " + stackList.length);
					// if (removeNode.index != "-") {
					// 	theRulesHadPush.pop();
					// }
				// }

				// if (stackList.length == 0 && endFlag.node == "NP" && endFlag.index == SyntacticRules["NP"].length-1) {
				// 	console.log("ending");
				// 	return;
				// }

				while(stackList[stackList.length-1].index == "-") {
					stackList.pop();
				}

				// if (wordSyntaxTree.length == 0) {
				// 	while(stackList[stackList.length-1].index == "-") {
				// 		stackList.pop();
				// 	}
				// }
				// else {
				// 	let removeTree = [];
				// 	// 将不可行的句法树的前面匹配部分一一添加到removeTree数组中
				// 	for(let i=stackList.length-1; i>=0; i--) {
				// 		if (stackList[i].index != "-") {
				// 			removeTree.push({
				// 				node: stackList[i].node,
				// 				index: stackList[i].index
				// 			});
				// 		}
				// 	}

				// 	// console.log("removeTree----------");
				// 	// console.log(removeTree);

				// 	// 将从wordSyntaxTree一一找出不可行的句法树，并从wordSyntaxTree中全部删除
				// 	let flag, spliceIndex;
				// 	for(let i=wordSyntaxTree.length-1; i>=0; i--) {
				// 		flag = true;
				// 		if (wordSyntaxTree[i].length < removeTree.length) {
				// 			flag = false;
				// 		}
				// 		else {
				// 			for(let w=wordSyntaxTree[i].length-1, r=removeTree.length-1; r>=0; w--, r--) {
				// 				if (wordSyntaxTree[i][w].node != removeTree[r].node || wordSyntaxTree[i][w].index != removeTree[r].index) {
				// 					flag = false;
				// 					break;
				// 				}
				// 			}
				// 		}

				// 		if (flag) {
				// 			spliceIndex = i;
				// 			break;
				// 			// console.log(removeTree);
				// 			// console.log("currentWordArrIndex: " + currentWordArrIndex);
				// 		}
				// 	}

				// 	if (flag) {
				// 		let lastWordSyntaxTree = wordSyntaxTree[spliceIndex];
				// 		// console.log(lastWordSyntaxTree);

				// 		let startIndex = 2;
				// 		if (lastWordSyntaxTree[0].node == "的" || lastWordSyntaxTree[0].node == "地") {
				// 			startIndex = 1;
				// 		}

				// 		let endIndex = lastWordSyntaxTree.length-removeTree.length-1;

				// 		if(endIndex >= startIndex) {
				// 			let initLen = stackList.length, bool, index;
				// 			for(let j=endIndex; j>=startIndex; j--) {
				// 				bool = false;
				// 				for(let t=initLen; t<stackList.length; t++) {
				// 					if (stackList[t].node == lastWordSyntaxTree[j].node) {
				// 						bool = true;
				// 						index = t;
				// 						break;
				// 					}
				// 				}
				// 				if (bool) {
				// 					let rulesIndex = judgeTheRulesIfHadPush(theRulesHadPush, stackList[index]);
				// 					if (rulesIndex >= 0) {
				// 						theRulesHadPush.splice(rulesIndex, 1);
				// 					}
				// 					stackList[index].index = lastWordSyntaxTree[j].index;
				// 				}
				// 				else {
				// 					stackList.push({
				// 						node: lastWordSyntaxTree[j].node,
				// 						index: lastWordSyntaxTree[j].index
				// 					});
				// 				}

				// 				if (lastWordSyntaxTree[j].index >= 0) {
				// 					let syntac = SyntacticRules[lastWordSyntaxTree[j].node][lastWordSyntaxTree[j].index];
				// 					for(let p=syntac.length-1; p>=0; p--) {
				// 						stackList.push({
				// 							node: syntac[p],
				// 							index: "-"
				// 						});
				// 					}
				// 					addRuleInHadPush(theRulesHadPush, lastWordSyntaxTree[j]);
				// 				}
				// 			}
				// 		}
				// 		while(stackList[stackList.length-1].index == "-") {
				// 			stackList.pop();
				// 		}

				// 		// console.log("test-----------------");
				// 		// console.log(stackList);

				// 		// console.log("0");
				// 		// console.log(wordSyntaxTree[spliceIndex]);
				// 		wordSyntaxTree.splice(spliceIndex, 1);
				// 		currentWordArrIndex --;   // 当前还未被句法树找到的第一个词语的下标上移一位
				// 	}
				// 	else {
				// 		while(stackList[stackList.length-1].index == "-") {
				// 			stackList.pop();
				// 		}
				// 	}
				// }

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
					// if (wordSyntaxTree.length > 0) {
					// 	let compareTree = [{
					// 		node: stackList[stackList.length-1].node,
					// 		index: stackListLastNode.index
					// 	}];
					// 	for(let i=stackList.length-2; i>=0; i--) {
					// 		if (stackList.index != "-") {
					// 			compareTree.push({
					// 				node: stackList[i].node,
					// 				index: stackList[i].index
					// 			});
					// 		}
					// 	}

					// 	for(let i=wordSyntaxTree.length-1; i>=0; i--) {
					// 		let flag = true;   // 判断相不相等的的标记
					// 		if (wordSyntaxTree[i].length < compareTree.length) {
					// 			flag = false;
					// 		}
					// 		for(let n=wordSyntaxTree[i].length-1, m=compareTree.length-1; m>=0;n--, m--) {
					// 			if (!(wordSyntaxTree[i][n].node == compareTree[m].node && wordSyntaxTree[i][n].index == compareTree[m].index)) {
					// 				flag = false;
					// 				break;
					// 			}
					// 		}

					// 		if (flag) {
					// 			// console.log("wordSyntaxTree---------splice");
					// 			// console.log(wordSyntaxTree[i]);
					// 			wordSyntaxTree.splice(i, 1);
					// 			currentWordArrIndex--;
					// 		}
					// 	}
					// }

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

				if (hasPushFlag == -1) {   // 若该规则没有被添加过，则添加
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
						if (judgeFlag >= 0) {
							theRulesHadPush.pop();
						}

						// if (wordSyntaxTree.length > 0) {
						// 	let compareTree = [{
						// 		node: stackList[stackList.length-1].node,
						// 		index: prevIndex
						// 	}];
						// 	for(let i=stackList.length-2; i>=0; i--) {
						// 		if (stackList.index != "-") {
						// 			compareTree.push({
						// 				node: stackList[i].node,
						// 				index: stackList[i].index
						// 			});
						// 		}
						// 	}

						// 	for(let i=wordSyntaxTree.length-1; i>=0; i--) {
						// 		let flag = true;   // 判断相不相等的的标记
						// 		if (wordSyntaxTree[i].length < compareTree.length) {
						// 			flag = false;
						// 		}
						// 		for(let n=wordSyntaxTree[i].length-1, m=compareTree.length-1; m>=0;n--, m--) {
						// 			if (!(wordSyntaxTree[i][n].node == compareTree[m].node && wordSyntaxTree[i][n].index == compareTree[m].index)) {
						// 				flag = false;
						// 				break;
						// 			}
						// 		}

						// 		if (flag) {
						// 			// console.log("wordSyntaxTree---------splice");
						// 			// console.log(wordSyntaxTree[i]);
						// 			wordSyntaxTree.splice(i, 1);
						// 			currentWordArrIndex--;
						// 		}
						// 	}
						// }

						findTreeInCurrentList(stackList, wordSyntaxTree, prevIndex, function(spliceIndex) {
							// console.log("2");
							// console.log(wordSyntaxTree[spliceIndex]);
							wordSyntaxTree.splice(spliceIndex, 1);
							currentWordArrIndex--;
						});
					}

					for(let i=pushArr.length-1; i>=0; i--) {
						stackList.push({
							node: pushArr[i],
							index: "-"
						});
					}

					addRuleInHadPush(theRulesHadPush, stackListLastNode);

					// console.log(theRulesHadPush);
				}
			}
			else {
				// let removeNode = stackList.pop();   // 将已经遍历完了的当前节点删除
				// console.log("remove:   --------------");
				// console.log(removeNode);
				// if (removeNode.hasPushTheRules) {
				// 	theRulesHadPush.pop();
				// }
				// if (judgeTheRulesIfHadPush(theRulesHadPush, {node: removeNode.node, index: SyntacticRules[removeNode.node].length-1})) {
				// 	theRulesHadPush.pop();
				// }

				// while(stackList.length > 0 && stackList[stackList.length-1].index == "-") {
				// 	stackList.pop();
				// }

				stackListLastNode.index = SyntacticRules[stackListLastNode.node].length-1;

				// console.log("00000000");
				// console.log(stackList);
				// console.log(wordSyntaxTree);
				// console.log(currentWordArrIndex);

				let flag = false;
				findTreeInCurrentList(stackList, wordSyntaxTree, SyntacticRules[stackListLastNode.node].length-1, function(spliceIndex) {
					// console.log("1");
					// console.log(wordSyntaxTree[spliceIndex]);
					// console.log(stackList);
					if (stackList.length == 1 && stackList[0].node == "S" && stackList[0].index == 2) {
						// console.log("=--------============");
						// console.log(stackList);
						// console.log(theRulesHadPush);
						flag = true;
						wordTreeGoBack(wordSyntaxTree[spliceIndex], stackList, theRulesHadPush);

						// 导致stackList和theRulesHadPush不一致的问题所在
						// console.log("==============");
						// console.log(stackList);
						// console.log(theRulesHadPush);
					}
					// wordTreeGoBack(wordSyntaxTree[spliceIndex], stackList, theRulesHadPush);
					wordSyntaxTree.splice(spliceIndex, 1);
					currentWordArrIndex--;
				});

				if (!flag) {
					let removeNode = stackList.pop();   // 将已经遍历完了的当前节点删除
					let judgeFlag = judgeTheRulesIfHadPush(theRulesHadPush, removeNode);
					if (judgeFlag >= 0) {
						theRulesHadPush.pop();
					}

					while(stackList.length > 0 && stackList[stackList.length-1].index == "-") {
						stackList.pop();
					}
				}

				// if (stackList.length == 0) {
				// 	console.log("end");
				// 	return;
				// }
			}
		}

		// if (stackList.length == 1 && stackList[0].node == "S" && stackList[0].index == 0) {
		// 	console.log("ending");
		// 	return;
		// }

		// 栈为空，但还有分词没有被找到，或者栈不为空，但所有的分词已经被找到了，执行算法回退
		if ((stackList.length == 0 && currentWordArrIndex < onePossibleSentenceWordArr.length && wordSyntaxTree.length > 0) || (stackList.length > 0 && currentWordArrIndex == onePossibleSentenceWordArr.length)) {
			// console.log("wwwwwwwwwww: " + stackList.length + ", " + currentWordArrIndex);

			let lastWordSyntaxTree = wordSyntaxTree[wordSyntaxTree.length-1];

			// if (stackList.length > 0 && currentWordArrIndex == onePossibleSentenceWordArr.length) {
			// 	while (stackList[stackList.length-1].index == "-") {
			// 		stackList.pop();
			// 	}
			// }
			// else {
				// let cutIndex;
				// for(let i=0, len=lastWordSyntaxTree.length; i<len; i++) {
				// 	if (SyntacticRules[lastWordSyntaxTree[i].node]) {
				// 		cutIndex = i;
				// 		break;
				// 	}
				// }
				// for(let i=lastWordSyntaxTree.length-1; i>=cutIndex; i--) {
				// 	stackList.push({
				// 		node: lastWordSyntaxTree[i].node,
				// 		index: lastWordSyntaxTree[i].index
				// 	});

				// 	if (!judgeTheRulesIfHadPush(theRulesHadPush, stackList[stackList.length-1])) {
				// 		addRuleInHadPush(theRulesHadPush, stackList[stackList.length-1]);
				// 	}
				// }
			// 	wordTreeGoBack(lastWordSyntaxTree, stackList, theRulesHadPush);
			// }

			wordTreeGoBack(lastWordSyntaxTree, stackList, theRulesHadPush);

			// console.log("3");
			// console.log(wordSyntaxTree[wordSyntaxTree.length-1]);
			wordSyntaxTree.splice(wordSyntaxTree.length-1, 1);
			currentWordArrIndex --;
		}
	}

	// console.log("len: " + stackList.length);
	// console.log("currentWordArrIndex: " + currentWordArrIndex);
	// console.log("0: " + onePossibleSentenceWordArr.length);

	// if (stackList.length == 0 && currentWordArrIndex == onePossibleSentenceWordArr.length) {
	// 	return wordSyntaxTree;
	// }
	// else {
	// 	console.log(stackList.length, currentWordArrIndex);
	// 	console.log("该句子不能构成句法树");
	// 	return;
	// }

	return wordSyntaxTree;
}

/** 将一个句子的所有可能句法树罗列出来
 * @param sentence String 句子

 * @return allTreeArr Array 句子所有可能构成的句法树集合
 * allTreeArr = [[[{node: String, index: "-" or Number}, {...}, {...}], [...], ...], [...], [...]]
*/
function allTreeOfOneSentence(sentence, professionalNounsArr) {
	var participleResult = participle(sentence, professionalNounsArr);   // 将句子分词
	console.log(participleResult);
	var allPossibleSentence = combinAllPosibility(participleResult);   // 获取所有可能词性组合的所有句子集合
	console.log(allPossibleSentence[8]);

	// var allTreeArr = [];
	// for(let i=0, len=allPossibleSentence.length; i<len; i++) {
	// 	console.log("i: " + i);

	// 	var result = buildTree(allPossibleSentence[i]);

	// 	if (result) {
	// 		// console.log(allPossibleSentence[i]);
	// 		console.log(result);
	// 		allTreeArr.push(result);
	// 	}
	// }
	// console.log(allTreeArr[0]);

	console.log(buildTree(allPossibleSentence[8]));

	// return allTreeArr;
}

/** 将句法树转化为可以计算的对象
 * @param wordSyntaxTree Array 某一个句子分词构成的句法树集合
 * @return compareObj Object 转换后句子整体句法树对象
 * compareObj = {
	"我": {
		index: "-",
		count: 1
	},
	"R": {
		index: 0,
		count: 1
	},
	...
 }
*/
function transformWordSyntaxTree(wordSyntaxTree) {
	let compareObj = {};
	for(let i=0, len=wordSyntaxTree.length; i<len; i++) {
		for(let j=wordSyntaxTree[i].length-1; j>=0; j--) {
			if (!compareObj[wordSyntaxTree[i][j].node]) {
				compareObj[wordSyntaxTree[i][j].node] = {
					index: wordSyntaxTree[i][j].index,
					count: 1
				}
			}
			else {
				compareObj[wordSyntaxTree[i][j].node].count ++;
			}
		}
	}
	return compareObj;
}

/** 句法相似度计算
 * @param wordSyntaxTree Array 某一句子分词句法树的集合（集合1为考试答案，集合2为正确答案）
 * @return result Number 返回计算结果
*/
function synaticSimilaryCla(wordSyntaxTree1, wordSyntaxTree2) {
	/**
	 * compareObj = {
		"我": {
			index: "-",
			count: 1
		},
		"R": {
			index: 0,
			count: 1
		},
		...
	 }
	*/
	let compareObj1 = transformWordSyntaxTree(wordSyntaxTree1);
	// console.log(compareObj1);
	let compareObj2 = transformWordSyntaxTree(wordSyntaxTree2);
	// console.log(compareObj2);

	let result = 0;   //用于累积计算相似度结果
	for(let i in compareObj1) {
		for(let j in compareObj2) {
			if (i == j) {
				if (compareObj1[i].index == compareObj2[j].index) {
					let count1 = compareObj1[i].count, count2 = compareObj2[j].count;
					let count = count1<count2 ? count1 : count2;
					result += count;
				}
			}
		}
	}

	let sum = 0;
	for(let i in compareObj2) {
		sum = sum + compareObj2[i].count;
	}

	return result/sum;
}

/** 句法相似度计算
 * @param studentAnswer String 学生答案
 * @parma correctAnswer String 正确答案
 * @return max Number 计算结果
*/
function SyntacticSimilarity(studentAnswer, correctAnswer, professionalNounsArr) {
	let wordSyntaxTreeArr1 = allTreeOfOneSentence(studentAnswer, professionalNounsArr);
	let wordSyntaxTreeArr2 = allTreeOfOneSentence(correctAnswer, professionalNounsArr);

	let max = 0, index1 = 0, index2 = 0;
	for(let i=0, len1=wordSyntaxTreeArr1.length; i<len1; i++) {
		for(let j=0, len2=wordSyntaxTreeArr2.length; j<len2; j++) {
			var result = synaticSimilaryCla(wordSyntaxTreeArr1[i], wordSyntaxTreeArr2[j]);
			if (result > max) {
				max = result;
			}
		}
	}
	// console.log(max);
	return max;
}

// module.exports = SyntacticSimilarity;
module.exports = allTreeOfOneSentence;