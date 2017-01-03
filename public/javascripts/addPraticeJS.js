let currentAddType = "SingleChoice";

function addSingleChoice() {}

function addMultipleChoices() {}

function addTrueOrFalse() {}

function addFillInTheBlank() {}

function addShortAnswer() {}

function addProgramming() {}

init = function() {
	showWin("若没有该题型的题目，可直接不添加任何题目。");
}

function bindEvent() {
	$(".addPraticeToolbar").click(function(e) {
		let target = getTarget(e);
		$(".addPraticeToolbar > div").css("background", "rgba(0, 0, 0, 0.5)");
		$(target).css("background", "rgba(249, 90, 78, 0.8)");

		$(".addPraticeContent > section").css("display", "none");
		$(".add" + target.className).css("display", "block");

		currentAddType = target.className;

		console.log(currentAddType);
	});

	$(".addMore")[0].onclick = function() {
		switch(currentAddType) {}
	}
}