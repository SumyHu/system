let commentJs;

function getRandomNumber(numberType, numberLength) {
	let random = Math.random()*numberLength;
	switch(numberType) {
		case "int":
			return parseInt(random);
		case "float":
		case "double":
		case "Number":
			return parseFloat(random.toFixed(4));
	}
}

function getRandomChar() {
	let charNum = getRandomNumber("int", 58)+65;
	return String.fromCharCode(charNum);
}

function getRandomString() {
	let str = "";
	let strLength = getRandomNumber("int", 30);
	for(let i=0; i<strLength; i++) {
		str = str + getRandomChar();
	}
	return str;
}

function getRandomBoolean() {
	let random = getRandomNumber("int", 2);
	if (random === 0) {
		return true;
	}
	else {
		return false;
	}
}

function getRandomArray(arrayChildType) {
	let getChildFn = function() {};
	if (arrayChildType === "int" || arrayChildType === "float" || arrayChildType === "double" || arrayChildType === "Number") {
		getChildFn = getRandomNumber;
	}
	else if (arrayChildType === "char") {
		getChildFn = getRandomChar;
	}
	else if (arrayChildType === "String") {
		getChildFn = getRandomString;
	}

	let array = [];
	let arrayLength = getRandomNumber("int", 30);
	for(let i=0; i<arrayLength; i++) {
		if (getChildFn == getRandomNumber) {
			array.push(getChildFn(arrayChildType, 1000));
		}
		else {
			array.push(getChildFn());
		}
	}
	return array;
}

function getRandomValue(type, childType) {
	switch(type) {
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
	let inputValue = [];
	for(let i=0; i<counts; i++) {
		inputValue[inputValue.length] = [];
		for(let i=0, len=inputTypeArray.length; i<len; i++) {
			if (inputTypeArray[i].childType) {
				inputValue[inputValue.length-1].push(getRandomValue(inputTypeArray[i].thisType, inputTypeArray[i].childType));
			}
			else {
				inputValue[inputValue.length-1].push(getRandomValue(inputTypeArray[i].thisType));
			}
		}
	}
	return inputValue;
}

let javascriptPrintResult = "";
function print() {
	let argumentsArray = [];
	for(let i=0, len=arguments.length; i<len; i++) {
		argumentsArray.push(arguments[i]);
	}
	javascriptPrintResult += (argumentsArray.join(", ") + "\n");
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
		success: function(res) {
			// result = res;
			successCallback(res);
		}
	});
}

function javascriptRunning(code, inputValue, callback) {
	$.ajax ({
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
	let inputValue = [];
	for(let i=0, len=inputTypeArray.length; i<len; i++) {
		if (inputTypeArray[i].childType) {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType, inputTypeArray[i].childType));
		}
		else {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType));
		}
	}
	console.log(inputValue);

	switch(mode) {
		case "c":
		case "c++":
		case "c#":
		case "java":
		case "php":
			runningCodeByCmd(mode, code, inputValue, callback);
			break;
		case "javascript":
			javascriptRunning(code, inputValue, callback);
			break;
	}
}

function runingOnceJavaCompare(type, correctCode, studentCode, inputValue, runCount, rightCount, callback) {
	runningCodeByCmd(type, correctCode, inputValue[runCount], function(result1) {
		runningCodeByCmd(type, studentCode, inputValue[runCount], function(result2) {
			runCount++;
			if (result1.success && result2.success) {
				console.log(result1.success, result2.success);
				if (result1.success === result2.success) rightCount++;
			}
			else {
				runCount--;   // 该次结果作废
			}

			if(runCount !== 20) {
				runingOnceJavaCompare(type, correctCode, studentCode, inputValue, runCount, rightCount, callback);
			}
			else {
				callback(rightCount);
			}
		});
	});
}

function runingJavascriptsCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback) {
	for(let i=0; i<20; i++) {
		console.log(inputValue[i]);
		javascriptRunning(correctCode, inputValue[i], function(result1) {
			javascriptRunning(studentCode, inputValue[i], function(result2) {
				if (result1.success && result2.success) {
					console.log(result1.success, result2.success);
					console.log("===========");
					if (result1.success === result2.success) {
						rightCount++;
					}
					runCount++;

					if (runCount === 20) {
						callback(rightCount);
					}
				}
				else {
					i--;
				}
			});
		});
	}
}

function runningCodeWithCorrectAnswer(mode, correctCode, studentCode, inputTypeArray, outputArray, callback) {
	let inputValue = getRandomValueWithCounts(20, inputTypeArray);
	let runningFn, rightCount = 0, runCount = 0;
	switch(mode) {
		case "c":
		case "c++":
		case "c#":
		case "java":
		case "php":
			runingOnceJavaCompare(mode, correctCode, studentCode, inputValue, runCount, rightCount, callback);
			break;
		case "javascript":
			runingJavascriptsCompare(mode, correctCode, studentCode, inputValue, runCount, rightCount, callback);
			break;
	}
}