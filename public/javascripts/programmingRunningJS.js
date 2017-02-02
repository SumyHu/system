function javaRunning(code) {
	let result;
	$.ajax({
		url: "../javaRunning",
		type: "POST",
		async: false,
		data: {
			code: code
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