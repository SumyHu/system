"use strict";

function getRandomNumber(numberType, numberLength) {
	var random = Math.random() * numberLength;
	switch (numberType) {
		case "int":
			return parseInt(random);
		case "float":
		case "double":
		case "Number":
			return parseFloat(random.toFixed(4));
	}
}

function getRandomChar() {
	var charNum = getRandomNumber("int", 58) + 65;
	return String.fromCharCode(charNum);
}

function getRandomString() {
	var str = "";
	var strLength = getRandomNumber("int", 30) + 1;
	for (var i = 0; i < strLength; i++) {
		str = str + getRandomChar();
	}
	return str;
}

function getRandomBoolean() {
	var random = getRandomNumber("int", 2);
	if (random === 0) {
		return true;
	} else {
		return false;
	}
}

function getRandomArray(arrayChildType) {
	var getChildFn = function getChildFn() {};
	if (arrayChildType === "int" || arrayChildType === "float" || arrayChildType === "double" || arrayChildType === "Number") {
		getChildFn = getRandomNumber;
	} else if (arrayChildType === "char") {
		getChildFn = getRandomChar;
	} else if (arrayChildType === "String") {
		getChildFn = getRandomString;
	}

	var array = [];
	var arrayLength = getRandomNumber("int", 30);
	for (var i = 0; i < arrayLength; i++) {
		if (getChildFn == getRandomNumber) {
			array.push(getChildFn(arrayChildType, 1000));
		} else {
			array.push(getChildFn());
		}
	}
	return array;
}

function getRandomValue(type, childType) {
	switch (type) {
		case "int":
		case "float":
		case "double":
		case "Number":
			return getRandomNumber(type, 1000);
		case "char":
			return getRandomChar();
		case "String":
			return getRandomString();
		case "boolean":
			return getRandomBoolean();
		case "Array":
			return getRandomArray(childType);
	}
}

function getRandomValueWithCounts(counts, inputTypeArray) {
	var inputValue = [];
	for (var i = 0; i < counts; i++) {
		inputValue[inputValue.length] = [];
		for (var _i = 0, len = inputTypeArray.length; _i < len; _i++) {
			if (inputTypeArray[_i].childType) {
				inputValue[inputValue.length - 1].push(getRandomValue(inputTypeArray[_i].thisType, inputTypeArray[_i].childType));
			} else {
				inputValue[inputValue.length - 1].push(getRandomValue(inputTypeArray[_i].thisType));
			}
		}
	}
	return inputValue;
}

var javascriptPrintResult = "";
function print() {
	var argumentsArray = [];
	for (var i = 0, len = arguments.length; i < len; i++) {
		argumentsArray.push(arguments[i]);
	}
	javascriptPrintResult += argumentsArray.join(", ") + "\n";
}

function runningCodeByCmd(type, code, inputValue, successCallback) {
	$.ajax({
		url: "../runningCodeByCmd",
		type: "POST",
		// async: false,
		data: {
			type: type,
			code: code,
			inputValue: inputValue
		},
		success: function success(res) {
			// result = res;
			successCallback(res);
		}
	});
}

function javascriptRunning(code, inputValue, callback) {
	$.ajax({
		url: "javascriptRunning",
		type: "POST",
		data: {
			code: code,
			inputValue: inputValue
		},
		success: callback
	});
}

function runningCode(mode, code, inputTypeArray, outputTypeArray, callback) {
	var inputValue = [];
	for (var i = 0, len = inputTypeArray.length; i < len; i++) {
		if (inputTypeArray[i].childType) {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType, inputTypeArray[i].childType));
		} else {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType));
		}
	}
	console.log(inputValue);

	switch (mode) {
		case "c":
		case "c++":
		case "c#":
		case "java":
		case "php":
		case "python":
		case "Ruby":
		case "sql(mysql)":
		case "sql(oracle)":
			runningCodeByCmd(mode, code, inputValue, callback);
			break;
		case "javascript":
			javascriptRunning(code, inputValue, callback);
			break;
	}
}

function runningOnceResult(type, code, inputValue, runCount, saveResultsArr, otherResultsArr, callback) {
	runningCodeByCmd(type, code, inputValue[runCount], function (result) {
		if (result.success || result.success === "") {
			saveResultsArr[runCount] = result.success;
		} else {
			runningOnceResult(type, code, inputValue, runCount, saveResultsArr);
		}

		if (saveResultsArr.length === 20 && otherResultsArr.length === 20) {
			compareResultsTwentyTimes(saveResultsArr, otherResultsArr, callback);
		}
	});
}

function compareResultsTwentyTimes(resultArray1, resultArray2, callback) {
	var rightCount = 0;
	for (var i = 0, len = resultArray1.length; i < len; i++) {
		var compareSuccess1 = resultArray1[i].replace(/\s+/g, ' '),
		    compareSuccess2 = resultArray2[i].replace(/\s+/g, ' ');
		if (compareSuccess1 == compareSuccess2) rightCount++;
	}
	callback(rightCount);
}

function runingOnceJavaCompare(type, correctCode, studentCode, inputValue, runCount, rightCount, callback) {
	runningCodeByCmd(type, correctCode, inputValue[runCount], function (result1) {
		runningCodeByCmd(type, studentCode, inputValue[runCount], function (result2) {
			runCount++;
			if ((result1.success || result1.success === "") && (result2.success || result2.success === "")) {
				console.log(result1.success, result2.success);
				var compareSuccess1 = result1.success.replace(/\s+/g, ' '),
				    compareSuccess2 = result2.success.replace(/\s+/g, ' ');
				if (compareSuccess1 === compareSuccess2) rightCount++;
			} else {
				runCount--; // 该次结果作废
			}

			if (runCount !== 20) {
				runingOnceJavaCompare(type, correctCode, studentCode, inputValue, runCount, rightCount, callback);
			} else {
				callback(rightCount);
			}
		});
	});
}

function runingJavascriptsCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback) {
	var _loop = function _loop(_i2) {
		javascriptRunning(correctCode, inputValue[_i2], function (result1) {
			javascriptRunning(studentCode, inputValue[_i2], function (result2) {
				if ((result1.success || result1.success === "") && (result2.success || result2.success === "")) {
					console.log(result1.success, result2.success);
					console.log("===========");
					if (result1.success === result2.success) {
						rightCount++;
					}
					runCount++;

					if (runCount === 20) {
						callback(rightCount);
					}
				} else {
					_i2--;
				}
			});
		});
		i = _i2;
	};

	for (var i = 0; i < 20; i++) {
		_loop(i);
	}
}

function runningCodeWithCorrectAnswer(mode, correctCode, studentCode, inputTypeArray, outputArray, callback) {
	var inputValue = getRandomValueWithCounts(20, inputTypeArray);
	console.log(inputValue);
	var runningFn = void 0,
	    rightCount = 0,
	    runCount = 0;
	switch (mode) {
		case "c":
		case "c++":
		case "c#":
		case "java":
		case "php":
		case "python":
		case "Ruby":
		case "sql(mysql)":
		case "sql(oracle)":
			// runingOnceJavaCompare(mode, correctCode, studentCode, inputValue, runCount, rightCount, callback);
			var resultArray1 = [],
			    resultArray2 = [];
			for (var _i3 = 0; _i3 < 20; _i3++) {
				runningOnceResult(mode, correctCode, inputValue, _i3, resultArray1, resultArray2, callback);
				runningOnceResult(mode, studentCode, inputValue, _i3, resultArray2, resultArray1, callback);
			}
			break;
		case "javascript":
			runingJavascriptsCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback);
			break;
	}
}