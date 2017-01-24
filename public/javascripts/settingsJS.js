function init() {
	// 显示用户头像
	$(".showUserImg").css("background-image", $(".userImg").css("background-image"));

	// 显示用户名
	$(".username")[0].innerHTML = $(".showUsername")[0].id;
}

function bindEvent() {}