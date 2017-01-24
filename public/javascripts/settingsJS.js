function init() {
	// 显示用户头像
	$(".showUserImg").css("background-image", $(".userImg").css("background-image"));

	// 显示用户名
	$(".username")[0].innerHTML = $(".showUsername")[0].id;
}

function changeUserImg() {
}

function changePassword() {}

function changeFindPassword() {}

function bindEvent() {
	$(".settingsContent > aside > ul").click(function(e) {
		switch($(getTarget(e)).parent()[0].className) {
			case "changeUserImg":
				changeUserImg();
				break;
			case "changePassword":
				changePassword();
				break;
			case "changeFindPassword":
				changeFindPassword();
				break;
		}
	});

	$(".content .modify").click(function(e) {
		switch($(getTarget(e)).parent()[0].className) {
			case "userImgBlock":
				changeUserImg();
				break;
			case "password":
				changePassword();
				break;
			case "findPasswordBlock":
				changeFindPassword();
				break;
		}
	});
}