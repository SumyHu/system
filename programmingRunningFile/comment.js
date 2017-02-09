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

function readline(type, childType) {
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

function print() {}