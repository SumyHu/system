let clauseBasis = {   // 文本分句依据，分中文和英文
	Chiness: ["，", "。", "；", "！", "？", "、"],
	English: [",", ".", ";", "!", "?"]
	},

	fetchKeyword = {   // 提取关键词依据
		Chiness: ["【", "】"],
		English: ["[", "]"]
	},

	fetchTypeAndScore = {   // 获取给分点类型和分值
		Chiness: ["（", "）", "，"],
		English: ["(", ")", ","]
	};


/** 文本分句
 * @param language String 语言
 * @param text String 分句的文本
 * @return clauseTextResult Array 文本的分句结果
*/
function clause(languaue, text) {
	var realClauseBasis = clauseBasis[languaue];
	var clauseTextResult = [text];

	for(let i=0, len1=realClauseBasis.length; i<len1; i++) {
		for(let j=0, len2=clauseTextResult.length; j<len2;) {
			var splitResult = clauseTextResult[j].split(realClauseBasis[i]);
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

/** 将正确答案进行分解，提取出关键字、对应的关键字分值和关键字所在的句子
 * @param correctAnswer String 正确答案
*/
function handleCorrectAnswer(langeuage, correctAnswer) {
	let realFetchKeyword = fetchKeyword[langeuage], realFetchTypeAndScore = fetchTypeAndScore[langeuage], keywordArray = [], keywordBlock = [],
		tempKeywordBlock = correctAnswer.split(realFetchKeyword[0]);

	for(let i=1, len=tempKeywordBlock.length; i<len; i++) {
		keywordBlock.push(tempKeywordBlock[i].split(realFetchKeyword[1])[0]);
	}

	for(let i=0, len=keywordBlock.length; i<len; i++) {
		let temp = keywordBlock[i].split(realFetchTypeAndScore[0]);
		let keyword = temp[0], typeAndScore = temp[1].split(realFetchTypeAndScore[1])[0].split(realFetchTypeAndScore[2]);
		let NP = (typeAndScore[0] === "T" ? true : false),
			score = typeAndScore[1];
		keywordArray.push({
			keyword: keyword,
			NP: NP,
			score: score
		});
	}

	return keywordArray;
}

$(function() {
	console.log(handleCorrectAnswer("English", "测试[一下(F,3)]【关键字（T，2）】但并不只是【这个关键字（F，1）】"));
});