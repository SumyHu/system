function getRandomNumber(numberType, numberLength) {
	let random = Math.random()*numberLength;
	switch(numberType) {
		case "int":
			return parseInt(random);
		case "float":
		case "double":
			return parseFloat(random);
		case "Number":
			return random;
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
	let random = getRandomNumber("int", 1);
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
}

function javaRunning(code, inputValue, successCallback) {
	// let result;
	$.ajax({
		url: "../javaRunning",
		type: "POST",
		// async: false,
		data: {
			code: code,
			inputValue: inputValue
		},
		success: function(res) {
			// result = res;
			successCallback(res);
		}
	});
	// return result;
}

function javascriptRunning(code) {
	// try {
	// 	var n = eval("(" + textarea.val() + ")(2, 3)");
	// 	if (n === 5) {
	// 		runResult.innerHTML = "编译通过";
	// 		return true;
	// 	}
	// 	else {
	// 		runResult.innerHTML = "编译结果不正确";
	// 	}
	// } catch(e) {
	// 	runResult.innerHTML = e;
	// }
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

function runningCode(mode, code, inputTypeArray, outputArray, callback) {
	let inputValue = [];
	for(let i=0, len=inputTypeArray.length; i<len; i++) {
		if (inputTypeArray[i].childType) {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType, inputTypeArray[i].childType));
		}
		else {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType));
		}
	}

	switch(mode) {
		case "java":
			// return javaRunning(code, inputValue)
			javaRunning(code, inputValue, callback);
			break;
		case "javascript":
			// javascriptRunning(code, inputValue);
			javascriptRunning(code, inputValue, callback);
			break;
	}
}

function runingOnceJavaCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback) {
	javaRunning(correctCode, inputValue[runCount], function(result1) {
		javaRunning(studentCode, inputValue[runCount], function(result2) {
			runCount++;
			console.log(runCount);
			console.log(result1, result2);
			if (result1.success && result2.success) {
				console.log(result1.success, result2.success);
				if (result1.success === result2.success) rightCount++;
			}
			else {
				runCount--;   // 该次结果作废
			}

			if(runCount !== 20) {
				runingOnceJavaCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback);
			}
			else {
				callback(rightCount);
			}
		});
	});
}

function runningCodeWithCorrectAnswer(mode, correctCode, studentCode, inputTypeArray, outputArray, callback) {
	let inputValue = [];
	for(let i=0; i<20; i++) {
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

	let runningFn, rightCount = 0, runCount = 0;
	switch(mode) {
		case "java":
			runingOnceJavaCompare(correctCode, studentCode, inputValue, runCount, rightCount, callback);
			break;
		case "javascript":
			runningFn = javascriptRunning;
			break;
	}
}