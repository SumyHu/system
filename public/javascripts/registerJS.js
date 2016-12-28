let registerVal = {};

function judgeThePswIsConsistent() {
	let password = $(".password").val();
	let pswConfirm = $(".pswConfirm").val();
	if (password == pswConfirm) {
		return true;
	}
	else {
		return false;
	}
}

function bindEvent() {
	$(".previousStep").click(function() {
		$(".secondStep").css("height", 0);
		$(".firstStep").css("height", 264);
		$(".tips").css("height", 0);
	});

	$(".nextStep").click(function() {
		if (isEmpty($(".username"))) {
			showTips("账号不能为空！");
			return;
		}
		if ($(".username").val().length != 13 || !(Number($(".username").val()) || Number($(".username").val()) == 0)) {
			showTips("请输入正确的手机号！");
			return;
		}
		if (isEmpty($(".password"))) {
			showTips("密码不能为空！");
			return;
		}
		if (isEmpty($(".pswConfirm"))) {
			showTips("确认密码不能为空！");
			return;
		}
		if (!judgeThePswIsConsistent()) {
			showTips("密码不一致，请重新输入！");
			return;
		}

		registerVal.username = $(".username").val();
		registerVal.password = $(".password").val();

		if ($("#teacher")[0].checked) {
			registerVal.identity = $("#teacher").val();
		}
		else {
			registerVal.identity = $("#student").val();
		}

		$(".firstStep").css("height", 0);
		$(".secondStep").css("height", 372);
		hideTips();
	});

	$(".registerConfirm").click(function() {
		if (isEmpty($(".answer1")) || isEmpty($(".answer2")) || isEmpty($(".answer3"))) {
			showTips("请将答案填写完整！");
			return;
		}

		for(let i=1, len=$("select").length; i<=len; i++) {
			let select = $(".select" + i);
			let options = select.find("option");
			selectIndex = select[0].selectedIndex;
			registerVal["questionAndAnswer"+ i] = {
				question: options[selectIndex].value,
				answer: $(".answer" + i).val()
			}
		}

		$(".tips").css("height", 0);

		selectRest();
		radioRest();
		inputRest("text");
		inputRest("password");
	});
}

$(function() {
	bindEvent();
});