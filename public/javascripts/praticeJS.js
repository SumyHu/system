function showIndex(className) {
	$(".praticeContent > section").css("display", "none");
	$("." + className + "Content").css("display", "block");
}

function bindEvent() {
	$(".typeNav").click(function(e) {
		let allDiv = $(".typeNav div");
		for(let i=0, len=allDiv.length; i<len; i++) {
			$(allDiv[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(e.target).css("background", "rgba(249, 90, 78, 0.8)");

		let className = e.target.className;
		showIndex(className);
	});

	$(".praticeContent > aside > ul").click(function(e) {
		let allLi = $(".praticeContent > aside li");
		for(let i=0, len=allLi.length; i<len; i++) {
			$(allLi[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(e.target).css("background", "rgba(164, 205, 51, 0.4)");
	});

	$(".addMore")[0].onclick = function() {
		window.location.href = "../addPratice";
	};
}