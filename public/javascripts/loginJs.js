init = function() {
	let query = window.location.href.split("?");
	if (query.length > 1) {
		if (query[1].indexOf("register=success") > -1) {
			showTips("注册成功！");
		}
		else if (query[1].indexOf("changeUser=success") > -1) {
			showTips("修改密码成功！");
		}
	}
}

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

		$.ajax({
			url: "../login",
			type: "POST",
			data: {
				userId: $(".username").val(),
				password: $(".password").val()
			},
			success: function(data) {
				if (data.error) {
					$("." + data.error.reason).select();
					showTips(data.error.message);
				}
				else {
					window.location.href = "../";

					hideTips();

					radioRest();
					inputRest("text");
					inputRest("password");
				}
			}
		});
	});

	$(".register").click(function() {
		window.location.href = "../register";
	});

	$(".findPsw").click(function() {
		window.location.href = "../findPsw";
	});
}

$(function() {
	init();
	bindEvent();
});