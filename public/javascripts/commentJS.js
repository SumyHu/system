$(function() {
	try {
		init();
	} catch(e) {}

	let identity = $(".identity")[0].id, locationHref;

	if (identity === "manager") {
		$(".usersManage").css("display", "block");
		// $(".usersManage > input").val("用户管理");
		locationHref = "../usersManage";
	}
	// else if (identity === "teacher") {
	// 	$(".usersManage > input").val("学生考试模拟成绩查看");
	// 	locationHref = "../testResultsManage";
	// }
	// else if (identity === "student") {
	// 	$(".usersManage > input").val("考试模拟记录查看");
	// 	locationHref = "../testHistory";
	// }

	// 点击用户头像，跳转到修改用户信息页面
	$(".userImg").click(function() {
		window.location.href = "../settings";
	});

	$(".usersManage").click(function() {
		window.location.href = locationHref;
	});
	
	getCurrentToolbar();

	toobarEvent();

	bindEvent();
});