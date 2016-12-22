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
	$(".nextStep").click(function() {
		if (isEmpty($(".username"))) {
			showTips("账号不能为空！");
			return;
		}
		if (!judgeThePswIsConsistent()) {
			showTips("密码不一致，请重新输入！");
		}
	});
}

$(function() {
	bindEvent();
});