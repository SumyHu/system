let changeUser = {
	username: "",
	checkContent: []
}

function bindevent() {
	$(".findPswBtn").click(function(e) {
		let className = getTarget(e).className;

		if (className.indexOf("firstStepBtn") > -1) {
			if (isEmpty($(".username"))) {
				showTips("请填写用户名！");
				return;
			}

			$.ajax({
				url: "../callDataProcessing",
				type: "POST",
				data: {
					data: "users",
					findOpt: {_id: $(".username").val()},
					callFunction: "find"
				},
				success: function(data) {
					if (!data) {
						showTips("该用户名不存在！");
						$(".username").select();
					}
					else {
						hideTips();
						changeUser.username = $(".username").val();
						changeUser.checkContent = data.checkContent;
						$(".firstStep").css("height", 0);
						$(".secondStep").css("height", "382px");
					}
				}
			});
		}
		else if (className.indexOf("secondStepBtn") > -1) {
			if (isEmpty($(".answer1")) || isEmpty($(".answer2")) || isEmpty($(".answer3"))) {
				showTips("请将答案填写完整！");
				return;
			}

			let flag = true;
			for(let i=0, len=changeUser.checkContent.length; i<len; i++) {
				let options = $(".select" + (i+1)).find("option");
				let question;
				for(let j=0, len1=options.length; j<len1; j++) {
					if (options[j].selected) {
						question = options[j].innerHTML;
					}
				}
				if (changeUser.checkContent[i].question != question || changeUser.checkContent[i].answer != $(".answer" + (i+1)).val()) {
					flag = false;
					break;
				}
			}

			if (!flag) {
				showTips("答案有误，请重新填写！");
			}
			else {
				hideTips();
				$(".secondStep").css("height", 0);
				$(".thirdStep").css("height", "181px");
			}
		}
		else if (className.indexOf("thirdStepBtn") > -1) {
			if (isEmpty($(".newPasswd")) || isEmpty($(".passwdConfirm"))) {
				showTips("密码不能为空！");
				return;
			}

			if ($(".newPasswd").val() != $(".passwdConfirm").val()) {
				showTips("密码不一致，请重新输入！");
			}
			else {
				hideTips();
				$.ajax({
					url: "../callDataProcessing",
					type: "POST",
					data: {
						data: "users",
						updateOpt: {_id: changeUser.username},
						operation: "set",
						update: {
							password: $(".newPasswd").val()
						},
						callFunction: "update"
					},
					success: function(data) {
						if (data) {
							window.location.href  = "../login?changeUser=success";
						}
					}
				})
			}
		}

		// hideTips();

		// selectRest();
		// inputRest("text");
	});
}

$(function() {
	bindevent();
});