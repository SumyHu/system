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
function showTips(msg) {
	let $tips = $(".tips");
	if ($tips.css("height") == "0px") {
		$tips[0].innerHTML = msg;
		$tips.css("height", 50);
	}
	else {
		$tips.css("opacity", 0);

		setTimeout(function() {
			$tips[0].innerHTML = msg;
			$tips.css("opacity", 1);
		}, 500);
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

// 绑定顶部导航栏事件
function toobarEvent() {
	$(".tab").hover(function() {
		$(".navigation").css("height", "30px");
		$(".navigation").css("opacity", 1);
	});

	$(".naviSec").hover(function() {
	}, function() {
		if ($(".navigation").css("opacity") == 1) {
			$(".navigation").css("height", 0);
			$(".navigation").css("opacity", 0);
		}
	});
}

/** 新建弹出框
 * @param contentHTML String 弹出框内容
*/
function createWin(contentHTML) {
	let div = document.createElement("div");
	div.className = "winBg";
	div.innerHTML = '<div class="win">'
					+ '<div class="winContent">' + contentHTML
					+ '</div><div class="btnContent">'
					+ '<input type="button" value="ok" class="okBtn">'
					+ '<input type="button" value="cancel" class="cancelBtn">'
					+ '</div>'
					+ '</div>';

	let body = document.getElementsByTagName("body")[0];
	body.appendChild(div);
}

function showWin() {
	$(".winBg").css("display", "block");
}

function hideWin() {
	$(".winBg").css("display", "none");
}

// 绑定弹出框事件
function bindWinEvent(okCallback, cancelCallback) {
	$(".okBtn")[0].onclick = function() {
		hideWin();
		okCallback();
	};

	$(".cancelBtn")[0].onclick = function() {
		hideWin();
		if (cancelCallback) {
			cancelCallback();
		}
	};
}