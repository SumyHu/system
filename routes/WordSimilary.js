const fs = require("fs");
const path = require("path");
const glossaryPath = path.join(__dirname, "../dictionary/glossary.dat");

var Word = require("./Word");

var allWords = {};   // 词库中所有的具体词，或者义原

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
function loadGlossary(callback) {
	fs.readFile(glossaryPath, "utf-8", function(err, data) {
		if (!err) {
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

			console.log(allWords);

			callback();
		}
	});
}

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

// 计算两个词语的相似度
function calSimWord(wordstr1, wordstr2) {
	var word1, word2;
	var wordFirst1 = wordstr1[0];
	var wordFirst2 = wordstr2[0];
	if (allWords[wordFirst1]) {
		for(let i=0, len=allWords[wordFirst1].length; i<len; i++) {
			if (allWords[wordFirst1][i].word == wordstr1) {
				word1 = allWords[wordFirst1][i];
				break;
			}
		}
	}

	if (allWords[wordFirst2]) {
		for(let i=0, len=allWords[wordFirst2].length; i<len; i++) {
			if (allWords[wordFirst2][i].word == wordstr2) {
				word2 = allWords[wordFirst2][i];
				break;
			}
		}
	}

	if (word1 && word2) {
		// 虚词和实词的相似度为零
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

            // 其他基本义原相似度
            var sim2 = simList(word1.otherPrimitives, word2.otherPrimitives);

            // 关系义原相似度
            var sim3 = simMap(word1.relationalPrimitive, word2.relationalPrimitive);

            // 关系符号相似度
            var sim4 = simMap(word1.relationSimbolPrimitive, word2.relationSimbolPrimitive);

            var product = sim1;
            int sum = beta1 * product;
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
	else {
		console.log("其中有词没有被收录");
		return 0;
	}
}

// map的相似度
function simMap(arr1, arr2) {
	if ((arr1.length == 0) && (arr2.length == 0)) {
        return 1;
    }

    var total = arr1.length + arr2.length;
    var sim = 0;
    var count = 0;
    
    for(let i=0, len1=arrl.length; i<len1; i++) {
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

// 比较两个集合的相似度
function simList(value1, value2) {
	if ((value1.length == 0) && (value2.length == 0)) return 1;

    var m = value1.length;
    var n = value2.length;
    var big = (m > n) ? m : n;
    var N = (m < n) ? m : n;
    var count = 0;
    var index1 = 0, index2 = 0;
    var sum = 0;
    var max = 0;
    while (count < N) {
        max = 0;
        for (let i = 0; i < value1.length; i++) {
            for (let j = 0; j < value2.length; j++) {
                var sim = innerSimWord(value1[i], value2[j]);
                if (sim > max) {
                    index1 = i;
                    index2 = j;
                    max = sim;
                }
            }
        }
        sum += max;
        // list1.remove(index1);
        // list2.remove(index2);
        value1.splice(index1, 1);
        value2.splice(index2, 1);
        count++;
    }
    return (sum + delta * (big - N)) / big;
}

// 内部比较两个词，可能是为具体词，也可能是义原
function innerSimWord(wordTarget1, wordTarget2) {
	var word1 = Primitive.isPrimitive(word1);
    var word2 = Primitive.isPrimitive(word2);
    // 两个义原
    if (word1 && word2)
        return simPrimitive(word1, word2);

    // 具体词
    if (!word1 && !word2) {
        if (wordTarget1.equals(wordTarget2))
            return 1;
        else
            return 0;
    }
    // 义原和具体词的相似度, 默认为gamma=0.2
    return gamma;
}

function simPrimitive(word1, word2) {}

module.exports = function() {
	return {
		//提供计算两个词语之间的相似度的接口
		simWord: function(wordstr1, wordstr2) {
			if (allWords.length == 0) {
				loadGlossary(function() {
					calSimWord(wordstr1, wordstr2);
				});
			}
			else {
				calSimWord(wordstr1, wordstr2);
			}
		}
	}
	// loadGlossary();
};