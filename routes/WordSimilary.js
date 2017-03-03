/**
 * 词语相似度计算
 * 参考文献：《基于<知网>的词汇语义相似度计算》论文
 * 知网的词语结构：第一基本义原（基本义原）、其他基本义原（语法义原）、关系义原、关系符号义原
 * 词典：glossary.dat
*/

const fs = require("fs");
const path = require("path");
const glossaryPath = path.join(__dirname, "../dictionary/glossary.dat");

var Primitive = require("./Primitive");
var Word = require("./Word");

/** 
 * 词库中所有的具体词，或者义原
 allWords = {
    "啊": [{
        word: "",
        type: "",
        firstPrimitive: "",   // 第一基本义原
        otherPrimitives: [],   // 其他基本义原
        structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
        relationalPrimitive: [],   // 关系义原
        relationSimbolPrimitive: []   // 关系符号义原
    }, {...}, {...}, ...],
    "不": [{...}, {...}, ...]
 }
*/
var allWords;

const alpha = 1.6;
const beta1 = 0.5;   // 计算实词的相似度，参数，基本义原权重
const beta2 = 0.2;   // 计算实词的相似度，参数，其他义原权重
const beta3 = 0.17;    //计算实词的相似度，参数，关系义原权重
const beta4 = 0.13;    // 计算实词的相似度，参数，关系符号义原权重

const gamma = 0.2;   // 具体词与义原的相似度一律处理为一个比较小的常数. 具体词和具体词的相似度，如果两个词相同，则为1，否则为0.
const delta = 0.2;   // 将任一非空值与空值的相似度定义为一个比较小的常数

const DEFAULT_PRIMITIVE_DIS = 20;   // 两个无关义原之间的默认距离
const LOGICAL_SYMBOL = ",~^";   // 知网中的逻辑符号
const RELATIONAL_SYMBOL = "#%$*+&@?!";   // 知网中的关系符号
const SPECIAL_SYMBOL = "{";   // 知网中的特殊符号，虚词，或具体词

// 加载glossary.dat文件
function loadGlossary() {
    allWords = {};
    var data = fs.readFileSync(glossaryPath, "utf-8");
    var line = data.split("\n");

    for(let i=0, len=line.length; i<len; i++) {
        let wordFn = Word();
        var lineTarget = line[i].trim().replace(/\s+/g, " ").split(" ");   // 去除收尾多余空格，并将多个空格合并成一个空格
        wordFn.setWord(lineTarget[0]);
        wordFn.setType(lineTarget[1]);
        sortRelation(lineTarget[2], wordFn);
        // allWords[i] = wordFn.getWord();
        if (!allWords[lineTarget[0][0]]) {
            allWords[lineTarget[0][0]] = [];
        }
        allWords[lineTarget[0][0]].push(wordFn.getWord());
    }
}

// 将词语具体信息进行分类
function sortRelation(relateStr, wordFn) {
	var parts = relateStr.split(",")
	var isFirst = true;
	var isRelational = false;
	var isSimbol = false;
	var chinese, relationalPrimitiveKey, simbolKey;
   
	for(let i=0, len=parts.length; i<len; i++) {
		if (parts[i][0] == "(") {   // 如果是具体词，则以括号开始和结尾
			parts[i] = parts[i].substring(1, parts[i].length-1);
		}

		if (parts[i].indexOf("=") != -1) {   // 关系义原，之后的都是关系义原
			isRelational = true;
			var strs = parts[i].split("=");
			relationalPrimitiveKey = strs[0];
			var value = strs[1].split("|")[1];
			wordFn.addRelationalPrimitive(relationalPrimitiveKey, value);
			continue;
		}

		var strs = parts[i].split("|");
		var type = getPrimitiveType(strs[0]);

		// 其中中文部分的词语,部分虚词没有中文解释
		if (strs.length > 1) {
			chinese = strs[1];
		}
		if (chinese && (chinese[chinese.length-1] == ")" || chinese[chinese.length-1] == "}")) {
            chinese = chinese.substring(0, chinese.length-1);
        }

        // 义原
        if (type == 0) {
            // 之前有一个关系义原
            if (isRelational) {
                wordFn.addRelationalPrimitive(relationalPrimitiveKey, chinese);
                continue;
            }
            // 之前有一个是符号义原
            if (isSimbol) {
                wordFn.addRelationSimbolPrimitive(simbolKey, chinese);
                continue;
            }
            if (isFirst) {
                wordFn.setFirstPrimitive(chinese);
                isFirst = false;
                continue;
            } else {
                wordFn.addOtherPrimitive(chinese);
                continue;
            }
        }

        // 关系符号表
        if (type == 1) {
            isSimbol = true;
            isRelational = false;
            simbolKey = strs[0][0];
            wordFn.addRelationSimbolPrimitive(simbolKey, chinese);
            continue;
        }

        if (type == 2) {
            // 虚词
            if (strs[0][0] == "{") {
                // 去掉开始第一个字符 "{"
                var english = strs[0].substring(1);
                // 去掉有半部分 "}"
                if (chinese != null) {
                    wordFn.addStructruralWord(chinese);
                    continue;
                } else {
                    // 如果没有中文部分，则使用英文词
                    wordFn.addStructruralWord(english);
                    continue;
                }
            }
        }
	}
}

// 通过开始的第一个字符，确定是否为义原，或是其他关系
// 0-----Primitive  1-----Relational 2-----Special
function getPrimitiveType(str) {
	var first = str[0];
	if (RELATIONAL_SYMBOL.indexOf(first) != -1) {
		return 1;
	}

	if (SPECIAL_SYMBOL.indexOf(first) != -1) {
		return 2;
	}

	return 0;
}

/**
 * 在allWords数组里查找匹配某个词
 * @param wordstr1 String 词语1
 * @param wordstr2 String 词语2
*/
function findWord(wordstr) {
    /**
        存储词语名相同的数组
        word = [{
            word: "",
            type: "",
            firstPrimitive: "",   // 第一基本义原
            otherPrimitives: [],   // 其他基本义原
            structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
            relationalPrimitive: [],   // 关系义原
            relationSimbolPrimitive: []   // 关系符号义原
        }, {...}, {...}]
    */
    var word = [];
    var wordFirst = wordstr[0];
    if (allWords[wordFirst]) {
        // 遍历词典寻找该词语时，应该充分考虑同一个词具有不同的词性，即词语名相同，类型不同
        for(let i=0, len=allWords[wordFirst].length; i<len; i++) {
            if (allWords[wordFirst][i].word == wordstr) {
                word.push(allWords[wordFirst][i]);
            }
        }
    }
    return word;
}

/** 
 * 计算两个词语对象的相似度
 * @param word1 Object 词语对象
 * @param word2 Object 词语对象
 word = {
    word: "",
    type: "",
    firstPrimitive: "",   // 第一基本义原
    otherPrimitives: [],   // 其他基本义原
    structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
    relationalPrimitive: [],   // 关系义原
    relationSimbolPrimitive: []   // 关系符号义原
 }
*/
function calSimWord(word1, word2) {
    /**
        word = {
            word: "",
            type: "",
            firstPrimitive: "",   // 第一基本义原
            otherPrimitives: [],   // 其他基本义原
            structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
            relationalPrimitive: [],   // 关系义原
            relationSimbolPrimitive: []   // 关系符号义原
        }
    */

    // console.log(word1);
    // console.log(word2);

    if ((word1.structruralWords.length != 0) != (word2.structruralWords.length != 0)) {
        return 0;
    }

    // 虚词
    if (word1.structruralWords.length && word2.structruralWords.length) {
        return simList(word1.structruralWords, word2.structruralWords);
    }

    // 实词
    if (!word1.structruralWords.length && !word2.structruralWords.length) {
        // 实词的相似度分为4个部分
        // 基本义原相似度
        var sim1 = simPrimitive(word1.firstPrimitive, word2.firstPrimitive);
        // console.log("sim1: " + sim1);

        // 其他基本义原相似度
        var sim2 = simList(word1.otherPrimitives, word2.otherPrimitives);
        // console.log("sim2: " + sim2);

        // 关系义原相似度
        var sim3 = simMap(word1.relationalPrimitive, word2.relationalPrimitive);
        // console.log("sim3: " + sim3);

        // 关系符号相似度
        var sim4 = simMap(word1.relationSimbolPrimitive, word2.relationSimbolPrimitive);
        // console.log("sim4: " + sim4);

        var product = sim1;
        var sum = beta1 * product;
        product *= sim2;
        sum += beta2 * product;
        product *= sim3;
        sum += beta3 * product;
        product *= sim4;
        sum += beta4 * product;
        return sum;
    }
    return 0;
}

/**
 * 计算两个词语的相似度
 * @param wordstr1 String 词语1
 * @param wordstr2 String 词语2
*/
function calSimWordStr(wordstr1, wordstr2) {
    /**
         word = [{
            word: "",
            type: "",
            firstPrimitive: "",   // 第一基本义原
            otherPrimitives: [],   // 其他基本义原
            structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
            relationalPrimitive: [],   // 关系义原
            relationSimbolPrimitive: []   // 关系符号义原
        }, {...}, {...}]
    */
    var word1 = findWord(wordstr1);
    var word2 = findWord(wordstr2);

    if (word1.length && word2.length) {
        var max = 0;
        // for(let i=0, len1=word1.length; i<len1; i++) {
        //     for(let j=0, len2=word2.length; j<len2; j++) {
        //         if (word1[i].type == word2[j].type) {
        //             return calSimWord(word1[i], word2[j]);
        //         }
        //     }
        // }
        for(let i=0, len1=word1.length; i<len1; i++) {
            for(let j=0, len2=word2.length; j<len2; j++) {
                var result = calSimWord(word1[i], word2[j]);
                if (result > max) {
                    max = result;
                }
            }
        }
        return max;
    }
    else {
        console.log("其中有词没有被收录");
        if (wordstr1 == wordstr2) {
            return 1;
        }
        return 0;
    }
}

/** 
 * map的相似度
 * @param arr1 Array 内含键值对的数组
 * @param arr2 Array 内含键值对的数组
 * arr = [{key: key, value: value}, {...}, ...]
*/
function simMap(arr1, arr2) {
	if ((arr1.length == 0) && (arr2.length == 0)) {
        return 1;
    }

    var total = arr1.length + arr2.length;
    var sim = 0;
    var count = 0;
    
    for(let i=0, len1=arr1.length; i<len1; i++) {
    	for(let j=0, len2=arr2.length; j<len2; j++) {
    		if (arr1[i].key == arr2[j].key) {
    			sim += simList(arr1[i].value, arr2[j].value);
    			count ++;
    			break;
    		}
    	}
    }
    return (sim + delta * (total-2*count)) / (total-count);
}

/** 
 * 比较两个集合的相似度
 * @param value1 Array 其他义原集合
 * @param value2 Array 其他义原集合
 * value = [val1, val2, ...]
*/
function simList(value1, value2) {
    // console.log(value1);
    // console.log(value2);
	if ((value1.length == 0) && (value2.length == 0)) return 1;

    var m = value1.length;
    var n = value2.length;
    var big = (m > n) ? m : n;
    var N = (m < n) ? m : n;
    var count = 0;
    var index1 = 0, index2 = 0;
    var sum = 0;
    var max = 0;

    var valueTemp1 = [], valueTemp2 = [];
    for(let i=0, len=value1.length; i<len; i++) {
        valueTemp1[i] = value1[i];
    }
    for(let i=0, len=value2.length; i<len; i++) {
        valueTemp2[i] = value2[i];
    }

    while (count < N) {
        max = 0;
        for (let i = 0, len1=valueTemp1.length; i < len1; i++) {
            for (let j = 0, len2=valueTemp2.length; j < len2; j++) {
                var sim = innerSimWord(valueTemp1[i], valueTemp2[j]);
                if (sim > max) {
                    index1 = i;
                    index2 = j;
                    max = sim;
                }
            }
        }
        sum += max;
        valueTemp1.splice(index1, 1);
        valueTemp2.splice(index2, 1);
        count++;
    }
    return (sum + delta * (big - N)) / big;
}

/** 
 * 内部比较两个词，可能是为具体词，也可能是义原
 * @param wordTarget1 String 基本义原
 * @param wordTarget2 String 基本义原
*/
function innerSimWord(wordTarget1, wordTarget2) {
    var word1, word2;
	Primitive.isPrimitive(wordTarget1, function(result) {
        word1 = result;
    });
    Primitive.isPrimitive(wordTarget2, function(result) {
        word2 = result;
    });
    // 两个义原
    if (word1 && word2)
        return simPrimitive(word1, word2);

    // 具体词
    if (!word1 && !word2) {
        if (wordTarget1 == wordTarget2)
            return 1;
        else
            return 0;
    }
    // 义原和具体词的相似度, 默认为gamma=0.2
    return gamma;
}

/** 
 * @param word1 Object 词语对象
 * @param word2 Object 词语对象
 * word = {
    id: 0,
    english: "evetn",
    chinese: "事件",
    parentId: 0
 }
*/
function simPrimitive(word1, word2) {
    var dis = disPrimitive(word1, word2);
    return alpha / (dis + alpha);
}

/** 
 * 计算两个义原之间的距离，如果两个义原层次没有共同节点，则设置他们的距离为20
 * @param word1 Object 词语对象
 * @param word2 Object 词语对象
 * word = {
    id: 0,
    english: "evetn",
    chinese: "事件",
    parentId: 0
 }
*/
function disPrimitive(word1, word2) {
    if (typeof word1 == "string") {
        Primitive.isPrimitive(word1, function(result) {
            word1 = result;
        });
    }
    if (typeof word2 == "string") {
        Primitive.isPrimitive(word2, function(result) {
            word2 = result;
        });
    }

    var wordParents1, wordParents2;
    Primitive.getAllParents(word1, function(parentsArray) {
        wordParents1 = parentsArray;
    });
    Primitive.getAllParents(word2, function(parentsArray) {
        wordParents2 = parentsArray;
    });


    for(let i=0, len1=wordParents1.length; i<len1; i++) {
        for(let j=0, len2=wordParents2.length; j<len2; j++) {
            if (wordParents1[i].id == wordParents2[j].id) {
                // 单纯地计算两个词汇的距离，没有考虑到层次结构的不同以及词汇密度不同所造成的相似度的影响
                return i+j;
            }
        }
    }

    return DEFAULT_PRIMITIVE_DIS;
}

/** 
 * 加入或更新一个词语
 * @param word Object 词语对象
 * word = {
        word: "",
        type: "",
        firstPrimitive: "",   // 第一基本义原
        otherPrimitives: [],   // 其他基本义原
        structruralWords: [],   // 如果该数组非空，则该词是一个虚词。列表里存放的是该虚词的一个义原，部分虚词无中文虚词解释
        relationalPrimitive: [],   // 关系义原
        relationSimbolPrimitive: []   // 关系符号义原
    }
*/
function addWord(word) {
    var firstChar = word[0];
    if (allWords[firstChar]) {   // 该词语索引存在
        for(let i=0, len=allWords[firstChar].length; i<len; i++) {
            if (allWords[firstChar][i].word == word.word && allWords[firstChar][i].type == word.type) {   // 如果该词语存在，则更新
                allWords[firstChar][i] = word;
                return;
            }
        }
    }
    else {
        allWords[firstChar] = [];
    }
    allWords[firstChar].push(word);   // 若该词语不存在，则在该索引下添加该词语
}

//提供计算两个词语之间的相似度的接口
function simWord(wordstr1, wordstr2) {
    if (!allWords) {
        loadGlossary();
    }
    return calSimWordStr(wordstr1, wordstr2);
}

module.exports = simWord;