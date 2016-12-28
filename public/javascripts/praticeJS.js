function showChapterIndex() {}

function showExaminationIndex() {}

function showRandomIndex() {}

function bindEvent() {
	toobarEvent();

	$(".typeNav").click(function(e) {
		let allDiv = $(".typeNav div");
		for(let i=0, len=allDiv.length; i<len; i++) {
			$(allDiv[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(e.target).css("background", "rgba(249, 90, 78, 0.8)");

		let className = e.target.className;
		switch(className) {
			case "chapter":
				showChapterIndex();
				break;
			case "examination":
				showExaminationIndex();
				break;
			case "random":
				showRandomIndex();
				break;
		}
	});

	$(".praticeContent > aside > ul").click(function(e) {
		let allLi = $(".praticeContent > aside li");
		for(let i=0, len=allLi.length; i<len; i++) {
			$(allLi[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(e.target).css("background", "rgba(164, 205, 51, 0.4)");
	});
}

$(function() {
	bindEvent();
});