function changeUserImg() {
}

function changePassword() {}

function changeFindPassword() {}

function showSettingsContent(changeContentName) {
	$(".settingsContent > aside > ul > li").css("background-color", "#333");
	$(".settingsContent > aside > ul > li.change" + changeContentName.substr(0, 1).toUpperCase() + changeContentName.substr(1))[0].style.backgroundColor = "rgba(249, 90, 78, 0.5)"

	$(".content > section").css("display", "none");
	$(".content > ." + changeContentName + "Info").css("display", "block");
}

function init() {
	// 显示用户头像
	$(".showUserImg").css("background-image", $(".userImg").css("background-image"));

	// 显示用户名
	$(".username")[0].innerHTML = $(".showUsername")[0].id;
}

function bindEvent() {
	$(".settingsContent > aside > ul").click(function(e) {
		let blockClassName;
		if (getTarget(e).className === "modify") {
			blockClassName = $(getTarget(e)).parent()[0].className;
		}
		else {
			blockClassName = getTarget(e).className;
		}

		showSettingsContent(blockClassName.substr(6, 1).toLowerCase() + blockClassName.substr(7));
	});

	$(".content .modify").click(function(e) {
		let className = $(getTarget(e)).parent()[0].className;

		showSettingsContent(className.substr(0, className.length-5));
	});

	$(".confirm").click(function(e) {
		let className = $(getTarget(e)).parent()[0].className;
		switch(className) {
			case "userImgInfo":
				changeUserImg();
				break;
			case "passwordInfo":
				changePassword();
				break;
			case "secondStep":
				changeFindPassword();
				break;
		}
	});

	$(".exitBtn").click(function() {
		window.location.href = "../login?exit=true";
	});
}