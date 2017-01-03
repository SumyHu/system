/**
 * registerVal = {
	username: String,   // 用户ID
	password: String,   //用户密码
	questionAndAnswer1: {question: String, answer: String},   // 用户忘记密码时校验问题
	questionAndAnswer2: {question: String, answer: String},
	questionAndAnswer3: {question: String, answer: String},
 }
*/
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
		let pattern = /^[0-9]{11}$/
		if ($(".username").val().length != 11 || !(pattern.test($(".username").val()))) {
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
		console.log(registerVal.username);

		$.ajax({
			url: "../callUsers",
			type: "POST",
			data: {
				userId: registerVal.username,
				callFunction: "findUser"
			},
			success: function(data) {
				console.log(data);
				if (data.length > 0) {
					$(".username").select();
					showTips("该用户名已经存在，请重新输入！");
				}
				else {
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
				}
			}
		});
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

		$.ajax({
			url: "../callUsers",
			type: "POST",
			data: {
				userId: registerVal.username,
				password: registerVal.password,
				checkContent: [registerVal.questionAndAnswer1, registerVal.questionAndAnswer2, registerVal.questionAndAnswer3],
				callFunction: "saveUser"
			},
			success: function(err) {
				if (!err) {
					// $(".tips").css("height", 0);
					selectRest();
					radioRest();
					inputRest("text");
					inputRest("password");

					window.location.href = "../login";
					showTips("注册成功！");
				}
			},
			error: function() {
				showTips("注册失败，请重新注册！");
			}
		});
	});
}

$(function() {
	bindEvent();
});