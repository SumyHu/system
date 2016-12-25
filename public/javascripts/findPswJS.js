function bindevent() {
	$(".findPswBtn").click(function() {
		if (isEmpty($(".answer1")) || isEmpty($(".answer2")) || isEmpty($(".answer3"))) {
			showTips("请将答案填写完整！");
			return;
		}

		hideTips();

		selectRest();
		inputRest("text");
	});
}

$(function() {
	bindevent();
});