$(function() {
	getCurrentToolbar();
	toobarEvent();

	try {
		init();
	} catch(e) {}

	bindEvent();
});