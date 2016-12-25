function bindEvent() {
	$(".login").click(function() {
		if (isEmpty($(".username"))) {
			showTips("请输入账号！");
			return;
		}
		if (isEmpty($(".password"))) {
			showTips("请输入密码！");
			return;
		}
		hideTips();
		
		radioRest();
		inputRest("text");
		inputRest("password");
	});

	$(".register").click(function() {
		window.location.href = "../register";
	});

	$(".findPsw").click(function() {
		window.location.href = "../findPsw";
	});
}

$(function() {
	bindEvent();
});