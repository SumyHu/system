let subjectName, identity, currentPraticeType = "chapter",
	showExaminationInit = false, showRandomInit = false, 
	chapterPratices = [], examinationPratices = [], randomPratices;

function authorityControl() {
	if (identity !== "teacher") {
		$(".addMore").css("display", "none");
	}
	else {
		$(".addMore").css("display", "block");
	}

	if (identity !== "teacher") {
		$(".removeIndex").css("display", "none");
		$(".modifyBtn").css("display", "none");
	}
}

function showChapterIndex(indexCount) {
	// let innerHtml = `<li value=-1>示例</li>`;
	let innerHtml = "";
	for(let i=0; i<indexCount; i++) {
		innerHtml = innerHtml + `<li value=` + i + `>` + (i+1) + `<input type="button" class="removeIndex" value="X"><input type="button" class="modifyBtn"></li>`;
	}

	$(".chapterContent > aside > ul")[0].innerHTML = innerHtml;

	if (indexCount > 0) {
		$($(".chapterContent > aside > ul > li")[0]).addClass("select");
		showOneChapterContentType(chapterPratices[0]);
	}
}

function showOneChapterContentType(unitId) {
	$(".chapterContent > .content > section").css("display", "none");

	findUnitById(unitId, function(result) {
		if (result.SingleChoice.length > 0) {
			$(".chapterContent .SingleChoice").css("display", "inline-block");
			$(".chapterContent .SingleChoice .exerciseCount .num")[0].innerHTML = result.SingleChoice.length;
		}

		if (result.MultipleChoices.length > 0) {
			$(".chapterContent .MultipleChoices").css("display", "inline-block");
			$(".chapterContent .MultipleChoices .exerciseCount .num")[0].innerHTML = result.MultipleChoices.length;
		}

		if (result.TrueOrFalse.length > 0) {
			$(".chapterContent .TrueOrFalse").css("display", "inline-block");
			$(".chapterContent .TrueOrFalse .exerciseCount .num")[0].innerHTML = result.TrueOrFalse.length;
		}

		if (result.FillInTheBlank.length > 0) {
			$(".chapterContent .FillInTheBlank").css("display", "inline-block");
			$(".chapterContent .FillInTheBlank .exerciseCount .num")[0].innerHTML = result.FillInTheBlank.length;
		}

		if (result.ShortAnswer.length > 0) {
			$(".chapterContent .ShortAnswer").css("display", "inline-block");
			$(".chapterContent .ShortAnswer .exerciseCount .num")[0].innerHTML = result.ShortAnswer.length;
		}

		if (result.Programming.length > 0) {
			$(".chapterContent .Programming").css("display", "inline-block");
			$(".chapterContent .Programming .exerciseCount .num")[0].innerHTML = result.Programming.length;
		}
	});
}

function changeChapterIndexNum(index) {
	$(".chapterContent > aside > ul > li").removeClass("select");
	$($(".chapterContent > aside > ul > li")[ind]).addClass("select");

	showOneChapterContentType(chapterPratices[index]);
}

function addExamination(unitId, index) {
	findUnitById(unitId, function(result) {
		let section = document.createElement("section");
		section.className = "content";
		section.innerHTML = `<section class="showEg">
								<div class="title">试卷<span class="index">` + (index+1) + `</span></div>
								<section class="contentDetail">
									<div>
										<p class="showSingleChoiceCount">
											单选题：<span class="count">` + result.SingleChoice.length + `</span>道
										</p>
										<p class="showMultipleChoicesCount">
											多选题：<span class="count">` + result.MultipleChoices.length + `</span>道
										</p>
										<p class="showTrueOrFalseCount">
											判断题：<span class="count">` + result.TrueOrFalse.length + `</span>道
										</p>
										<p class="showFillInTheBlankCount">
											填空题：<span class="count">` + result.FillInTheBlank.length + `</span>道
										</p>
										<p class="showShortAnswerCount">
											简答题：<span class="count">` + result.ShortAnswer.length + `</span>道
										</p>
										<p class="showProgrammingCount">
											编程题：<span class="count">` + result.Programming.length + `</span>道
										</p>
										<p class="totalTime">
											完成时间：<span class="count">120</span>分钟
										</p>
										<p class="totalScore">
											总分：<span class="count">100</span>分
										</p>
									</div>
									<div>
										1、请在规定时间完成试卷内全部题目，考试时间结束，系统将自动交卷。<br>
										2、所有题目可通过答题卡返回修改，点击提前交卷后试卷提交，将无法继续答案，请谨慎提交。<br>
										3、请诚信答题，独立完成。<br>
										4、祝你好运
									</div>
								</section>
							</section>`;
		$(".examinationContent .addMore").before(section);
	});
}

function showAllExaminationIndex() {
	showExaminationInit = true;
	console.log(examinationPratices);
	for(let i=0, len=examinationPratices.length; i<len; i++) {
		addExamination(examinationPratices[i], i);
	}
}

function showRandomIndex() {
	showRandomInit = true;
	findUnitById(randomPratices, function(result) {
		$(".randomContent .SingleChoice .exerciseCount .num")[0].innerHTML = result.SingleChoice.length;
		$(".randomContent .MultipleChoices .exerciseCount .num")[0].innerHTML = result.MultipleChoices.length;
		$(".randomContent .TrueOrFalse .exerciseCount .num")[0].innerHTML = result.TrueOrFalse.length;
		$(".randomContent .FillInTheBlank .exerciseCount .num")[0].innerHTML = result.FillInTheBlank.length;
		$(".randomContent .ShortAnswer .exerciseCount .num")[0].innerHTML = result.ShortAnswer.length;
		$(".randomContent .Programming .exerciseCount .num")[0].innerHTML = result.Programming.length;
	});
}

function init() {
	identity = $(".identity")[0].id;
	subjectName = getValueInUrl("subjectName");

	authorityControl();

	findSubjectByName(subjectName, function(result) {
		chapterPratices = result.chapterPratices;
		examinationPratices = result.examinationPratices;
		randomPratices = result.randomPratices;
	});

	showChapterIndex(chapterPratices.length);
}

function bindEvent() {
	$(".navContent").click(function(e) {
		let target = getTarget(e), classname = target.className;
		currentPraticeType = classname;

		$(".navContent div").css("background", "transparent");
		$(target).css("background", "rgba(249, 90, 78, 0.8)");

		$(".praticeContent > section").css("display", "none");
		$("." + target.className + "Content").css("display", "block");

		if (classname === "examination") {
			if (!showExaminationInit) {
				showAllExaminationIndex();
			}
		}
		if (classname === "random") {
			if (!showRandomInit) {
				showRandomIndex();
			}
		}
	});

	$(".chapterContent > aside > ul").click(function(e) {
		let value = getTarget(e).value;
		if (value >= 0) {
			changeChapterIndexNum(value);
		}
	});

	$(".addMore").click(function(e) {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	});
}