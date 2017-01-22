$(function() {
	$(".time").css("display", "none");
	
	getCurrentToolbar();
	toobarEvent();

	try {
		init();
	} catch(e) {}

	bindEvent();
});