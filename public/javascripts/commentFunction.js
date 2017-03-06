let praticeTypeChiness = {
	chapter: "章节练习",
	examination: "考试模拟",
	random: "随机练习"
}

let typeChiness = {
	SingleChoice: "单选题",
	MultipleChoices: "多选题",
	TrueOrFalse: "判断题",
	FillInTheBlank: "填空题",
	ShortAnswer: "简答题",
	Programming: "编程题"
}

/** 兼容ie浏览器
*/
function getEvent(e) {
	return e.event || window.event;
}

function getTarget(e) {
	return e.target || e.srcElement;
}

/** 显示提示
 * @param msg String 提示的信息
*/
function showTips(msg, millTime) {
	if ($(".tips").length == 0) {
		let div = document.createElement("div");
		div.className = "tips";
		document.getElementsByTagName("body")[0].appendChild(div);
	}
	let $tips = $(".tips");

	if ($tips.css("height") == "0px") {
		$tips[0].innerHTML = msg;
		$tips.css("height", 70);

		if (millTime) {
			setTimeout(function() {
				$tips.css("height", 0);
			}, millTime);
		}
	}
	else {
		$tips.css("opacity", 0);

		setTimeout(function() {
			$tips[0].innerHTML = msg;
			$tips.css("opacity", 1);
		}, 500);

		if (millTime) {
			setTimeout(function() {
				$tips.css("opacity", 0);
			}, 500+millTime);
		}
	}
}

// 隐藏提示
function hideTips() {
	$(".tips").css("height", 0);
}

/** 判断某个input的值是否为空
 * @param $inputTarget Object 某个input的jq对象
 * @return boolean 返回是否为空的Boolean值
*/
function isEmpty($inputTatget) {
	if (!$inputTatget.val()) {
		return true;
	}
	else {
		return false;
	}
}

/** 重置input值
 * @param type String input的类型
*/
function inputRest(type) {
	var textInput = $("input[type=" + type + "]");
	textInput.val("");
}

// 重置下拉列表的值
function selectRest() {
	for(let i=1, len=$("select").length; i<=len; i++) {
		let select = $(".select" + i);
		let options = select.find("option");
		options[0].selected = true;
	}
}

// 重置单选框的值
function radioRest() {
	let allRadio = $("input[type=radio]");

	/** 以radio的name值为键值
	 * radioObj = {
		"identity": [allRadio[0], allRadio[1]]
	 }
	*/
	let radioObj = {};

	for(let i=0, len=allRadio.length; i<len; i++) {
		if (!radioObj[allRadio[i].name]) {
			radioObj[allRadio[i].name] = [];
		}
		radioObj[allRadio[i].name].push(allRadio[i]);
	}

	for(var k in radioObj) {
		radioObj[k][0].checked = true;
	}
}

// 获取当前的导航栏内容并正确显示
function getCurrentToolbar() {
	let subjectName;
	let location = "http://localhost:3000/pratice?";
	if (window.location.href.split("?").length < 2) return;
	let paramArray = window.location.href.split("?")[1].split("&");
	// for(let i=0, len=paramArray.length; i<len; i++) {
	// 	let keyValuePair = paramArray[i].split("=");
	// 	if (i != 0) {
	// 		location = location + "&";
	// 	}
	// 	location = location + paramArray[i];
	// 	$(".navigation")[0].innerHTML = $(".navigation")[0].innerHTML + ">>>>><a class='link' href='" + location + "'>" + keyValuePair[1] +"</a>";
	// }

	if (paramArray.length > 0) {
		let keyValuePair = paramArray[0].split("=");
		location = location + paramArray[0];
		$(".navigation")[0].innerHTML = $(".navigation")[0].innerHTML + ">>>>><a class='link' href='" + location + "'>" + keyValuePair[1] +"</a>";
	}
}

// 绑定顶部导航栏事件
function toobarEvent() {
	// $(".tab").hover(function() {
	// 	$(".navigation").css("height", "30px");
	// 	$(".navigation").css("opacity", 1);
	// });

	// $(".naviSec").hover(function() {
	// }, function() {
	// 	if ($(".navigation").css("opacity") == 1) {
	// 		$(".navigation").css("height", 0);
	// 		$(".navigation").css("opacity", 0);
	// 	}
	// });

	//绑定导航目录事件
	$(".naviSec").click(function(e) {
		let className = getTarget(e).className;
		switch(className) {
			case "home":
				window.location.href = "http://localhost:3000/";
				break;
		}
	});
}

// 新建弹出框
function createWin() {
	let div = document.createElement("div");
	div.className = "winBg";
	div.innerHTML = '<div class="win">'
					+ '<div class="winContentBg"><div class="winContent"></div>'
					+ '</div><div class="btnContent">'
					+ '<input type="button" value="ok" class="okBtn">'
					+ '<input type="button" value="cancel" class="cancelBtn">'
					+ '</div>'
					+ '</div>';

	let body = document.getElementsByTagName("body")[0];
	body.appendChild(div);
}

/** 绑定弹出框按钮事件
 * @param okCallback function 确定按钮事件
 * @param cancelCallback function 取消按钮事件
*/
function bindWinEvent(okCallback, cancelCallback) {
	$(".okBtn")[0].onclick = function() {
		hideWin();
		if (okCallback) {
			okCallback();
		}
	};

	$(".cancelBtn")[0].onclick = function() {
		hideWin();
		if (cancelCallback) {
			cancelCallback();
		}
	};
}

/** 显示弹出框，并绑定该弹出框的按钮事件
 * @param contentHTML String 弹出框内容
 * @param okCallback function 确定按钮事件
 * @param cancelCallback function 取消按钮事件
*/
function showWin(contentHTML, okCallback, cancelCallback, focusRefresh) {
	if ($(".winBg").length == 0) {
		createWin();
	}
	if (focusRefresh || $(".winContent")[0].innerHTML != contentHTML) {
		$(".winContent")[0].innerHTML = contentHTML;
		bindWinEvent(okCallback, cancelCallback);
	}
	
	$(".winBg").css("display", "block");
}

// 隐藏弹出框
function hideWin() {
	$(".winBg").css("display", "none");
}

// 为目录导航添加子目录
function addDir(dirName, linkHref) {
	let appenHtml = '>>>>> <a class="link" href="' + linkHref + '">' + dirName + '</div>';
	let initHtml = $(".navigation").innerHtml;
	$(".navigation").innerHtml = initHtml + appendHtml;
}

/** 获取url传参的值
 * @param key String 键名
*/
function getValueInUrl(key) {
	let queryParamArr = window.location.href.split("?")[1].split("&");
	for(let i=0, len=queryParamArr.length; i<len; i++) {
		let keyValuePair = queryParamArr[i].split("=");
		if (keyValuePair[0] == key) {
			return keyValuePair[1];
		}
	}
	return;
}

/** 调用后台数据库处理方法
 * @param param Object
 * param = {
	data: Object,   // 传给后台的数据
	success: Function,   // 调用成功的回调函数
	error: Function    // 调用失败的回调函数（可选）
 }
*/
function callDataProcessingFn(param) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
		async: false,
		data: param.data,
		success: function(result) {
			param.success(result);
		},
		error: function(error) {
			if (param.error) {
				param.error(error);
			}
		}
	});
}

/** 根据科目名查找某个科目
 * @param subjectName String 科目名称
 * @param notFindCallback Function 没有找到该科目的回调函数
 * @param findCallback Function 找到该科目的回调函数
*/
function findSubjectByName(subjectName, findCallback, notFindCallback) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "find",
			findOpt: {
				subjectName: subjectName
			}
		},
		success: function(data) {
			if (!data) {
				if (notFindCallback) {
					notFindCallback();
				}
			}
			else {
				findCallback(data);
			}
		}
	});
}

/** 查找数据库中的所有subject
 * @param callback Function 回调函数
*/
function findAllSubject(callback) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "findAll"
		},
		success: callback
	});
}

/** 查找某个单元
 * @param unitId String 单元id
 * @param callback 回调函数
*/
function findUnitById(unitId, callback) {
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "find",
			findOpt: {
				_id: unitId
			}
		},
		success: callback
	});
}

/** 通过练习类型查找习题内容
 * @param praticeType String 练习类型
*/
function findPraticesByType(praticeType, callback) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "find",
			findOpt: {
				subjectName: subjectName
			}
		},
		success: function(data) {
			callback(data[praticeType+"Pratices"]);
		}
	});
}

/** 通过习题id查找习题的具体内容
 * @param praticeId String 习题id
 * @param callback Function 回调函数
*/
function findPraticesById(praticeId, callback) {
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "find",
			findOpt: {
				_id: praticeId
			}
		},
		success: callback
	});
}
