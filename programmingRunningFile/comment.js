let javascriptPrintResult = "";
function print() {
	let argumentsArray = [];
	for(let i=0, len=arguments.length; i<len; i++) {
		argumentsArray.push(arguments[i]);
	}
	javascriptPrintResult += (argumentsArray.join(", ") + "\n");
}