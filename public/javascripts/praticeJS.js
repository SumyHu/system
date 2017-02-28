let subjectName, identity, currentPraticeType = "chapter", currentChapterIndex = 0,
	showExaminationInit = false, showRandomInit = false, 
	chapterPratices = [], examinationPratices = [], randomPratices;

function modifyRandom(type) {
	window.location.href = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + "&type=" + type + "&operation=modify";
}

function modifyNotRandom(index) {
	window.location.href = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + "&index=" + index + "&operation=modify";
}

/** 将某个习题从以习题为单位的数据库中删除
 * @param praticeId String 习题id
 * @param callback Function 回调函数
*/
function removePratice(praticeId, callback) {
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "remove",
			removeOpt: {
				_id: praticeId
			}
		},
		success: callback
	});
}

function removePraticeInRandomUnit(randomUnitId, type, praticeId) {
	let update = {};
	update[type] = praticeId;
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "update",
			updateOpt: {
				_id: randomUnitId
			},
			operation: "pull",
			update: update
		},
		success: function() {}
	});
}

/** 将某个单元从以单元为单位的数据库中删除
 * @param unitId String 单元id
 * @param callback Function 回调函数
*/
function removeUnit(unitId, callback) {
	console.log('unitId: ' + unitId);
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "remove",
			removeOpt: {
				_id: unitId
			}
		},
		success: callback
	});
}

/** 将某个单元从以单元为单位的数据库中删除，并将该单元内的所以习题都从以习题为单位的数据库中删除
 * @param unitId String 单元id
*/
function removeUnitAndAllPraticesInThisUnit(unitId) {
	findUnitById(unitId, function(result) {
		removeUnit(unitId, function() {});

		console.log('find unit result', unitId, result);
		if (!result) return;

		let randomUnitId;
		findSubjectByName(subjectName, function(result) {
			randomUnitId = result.randomPratices;
		});

		let SingleChoice = result.SingleChoice,
			MultipleChoices = result.MultipleChoices,
			TrueOrFalse = result.TrueOrFalse,
			FillInTheBlank = result.FillInTheBlank,
			ShortAnswer = result.ShortAnswer,
			Programming = result.Programming;

		SingleChoice.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "SingleChoice", praticeId)
		});
		MultipleChoices.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "MultipleChoices", praticeId)
		});
		TrueOrFalse.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "TrueOrFalse", praticeId)
		});
		FillInTheBlank.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "FillInTheBlank", praticeId)
		});
		ShortAnswer.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "ShortAnswer", praticeId)
		});
		Programming.forEach(function(praticeId, index, array) {
			console.log(praticeId);
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "Programming", praticeId)
		});
	});
}

function removeUnitFormSubject(unitId) {
	let update = {};
	update[currentPraticeType+"Pratices"] = unitId;
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "update",
			updateOpt: {
				subjectName: subjectName
			},
			operation: "pull",
			update: update
		},
		success: function() {}
	});
}

function removeIndexEvent(index) {
	$(".btnDiv").css("display", "none");
	showWin("确定删除？", function() {
		findSubjectByName(subjectName, function(result) {
			let unitId = result[currentPraticeType+"Pratices"][index];
			removeUnitAndAllPraticesInThisUnit(unitId);
			removeUnitFormSubject(unitId);
		});
		location.reload(true);
	});
}

function doPratice(queryParam) {
	window.location.href = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + queryParam;
}

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
		innerHtml = innerHtml + `<li value=` + i + `>` + (i+1) + `<div class="btnDiv"><input type="button" class="modifyBtn"><input type="button" class="removeIndex" value="X"></div></li>`;
	}

	$(".chapterContent > aside > ul")[0].innerHTML = innerHtml;

	if (indexCount > 0) {
		$($(".chapterContent > aside > ul > li")[0]).addClass("select");
		showOneChapterContentType(chapterPratices[0]);
	}

	if (identity === "teacher") {
		$(".chapterContent > aside > ul > li").hover(function(e) {
			$(getTarget(e)).find(".btnDiv").css("display", "block");
		}, function(e) {
			$(getTarget(e)).find(".btnDiv").css("display", "none");
		});
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
	$($(".chapterContent > aside > ul > li")[index]).addClass("select");

	showOneChapterContentType(chapterPratices[index]);
}

function addExamination(unitId, index) {
	findUnitById(unitId, function(result) {
		let section = document.createElement("section");
		section.className = "content";
		section.innerHTML = `<section class="showEg">
								<div class="btnDiv"><input type="button" class="modifyBtn"><input type="button" class="removeIndex" value="X"></div>
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

		if (identity === "teacher") {
			$(section).hover(function(e) {
				let target = getTarget(e);
				let classname = target.className;
				switch(classname) {
					case "contentDetail":
					case "title":
						$(target).parent().find(".btnDiv").css("display", "block");
						break;
					case "showEg":
						$(target).find(".btnDiv").css("display", "block");
						break;
				}
			}, function(e) {
				$(".examinationContent .btnDiv").css("display", "none");
			});

			$(section).find(".removeIndex").click(function() {
				removeIndexEvent(index);
			});
		}

		section.onclick = function() {
			let queryParam = "&index=" + ($(section).find(".title .index")[0].innerHTML-1);
			doPratice(queryParam);
		};
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
			currentChapterIndex = value;
			return;
		}

		if (getTarget(e).className === "modifyBtn") {
			let index = $(getTarget(e)).parent().parent().val();
			modifyNotRandom(index);
			return;
		}

		if (getTarget(e).className === "removeIndex") {
			let index = $(getTarget(e)).parent().parent().val();
			removeIndexEvent(index);
		}
	});

	$(".addMore").click(function(e) {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	});

	if (identity === "teacher") {
		$(".randomContent > .content > section").hover(function(e) {
			let target = getTarget(e);
			let classname = target.className;
			switch(classname) {
				case "showOneType SingleChoice":
				case "showOneType MultipleChoices":
				case "showOneType TrueOrFalse":
				case "showOneType FillInTheBlank":
				case "showOneType ShortAnswer":
				case "showOneType Programming":
					$(target).find(".showEg .btnDiv").css("display", "block");
					break;
				case "showEg":
					$(target).find(".btnDiv").css("display", "block");
					break;
				case "title":
				case "eg":
					$(target).parent().find(".btnDiv").css("display", "block");
					break;
				case "exerciseCount":
					$(target).parent().find(".showEg .btnDiv").css("display", "block");
					break;
			}
		}, function(e) {
			$(".randomContent .btnDiv").css("display", "none");
		});
	}

	$(".content section").click(function(e) {
		let target = getTarget(e);
		let classname = target.className, index, type;
		
		switch(classname) {
			case "title":
			case "btnDiv":
				type = $(target).parent().parent()[0].className;
				break;
			case "showEg":
			case "exerciseCount":
				type = $(target).parent()[0].className;
				break;
		}

		if (currentPraticeType === "chapter") {
			queryParam = "&index=" + currentChapterIndex + "&type=" + type;
		}
		else if (currentPraticeType === "random") {
			queryParam = "&type=" + type.split(" ")[1];
		}
		doPratice(queryParam);
	});
}