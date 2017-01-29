$(function() {
	// $(".time").css("display", "none");

	// 点击用户头像，跳转到修改用户信息页面
	$(".userImg").click(function() {
		window.location.href = "../settings";
	});
	
	getCurrentToolbar();
	toobarEvent();

	try {
		init();
	} catch(e) {}

	bindEvent();
});