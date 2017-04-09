$(function() {
	try {
		init();
	} catch(e) {}

	if ($(".identity")[0].id === "manager") {
		$(".usersManage").css("display", "block");
	}

	// 点击用户头像，跳转到修改用户信息页面
	$(".userImg").click(function() {
		window.location.href = "../settings";
	});

	$(".usersManage").click(function() {
		window.location.href = "../usersManage";
	});
	
	getCurrentToolbar();

	toobarEvent();

	bindEvent();
});