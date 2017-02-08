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

function javaRunning(code, inputValue) {
	let result;
	$.ajax({
		url: "../javaRunning",
		type: "POST",
		async: false,
		data: {
			code: code,
			inputValue: inputValue
		},
		success: function(res) {
			console.log(res);
			result = res;
		}
	});
	return result;
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

function runningCode(mode, code, inputTypeArray, outputArray) {
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
			return javaRunning(code, inputValue);
			break;
		case "javascript":
			javascriptRunning(code, inputValue);
			break;
	}
}

function runningCodeWithCorrectAnswer(mode, correctCode, studentCode, inputTypeArray, outputArray) {
	let inputValue = [];
	for(let i=0, len=inputTypeArray.length; i<len; i++) {
		if (inputTypeArray[i].childType) {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType, inputTypeArray[i].childType));
		}
		else {
			inputValue.push(getRandomValue(inputTypeArray[i].thisType));
		}
	}

	let runningFn;
	switch(mode) {
		case "java":
			runningFn = javaRunning;
			break;
		case "javascript":
			runningFn = javascriptRunning;
			break;
	}

	let rightCount = 0;
	for(let i=0; i<100; i++) {
		let result1 = runningFn(correctCode, inputValue);
		let result2 = runningFn(studentCode, inputValue);
		if (result1 == result2) rightCount++;
	}
	return rightCount;
}