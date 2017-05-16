"use strict";

var subjectName = void 0,
    identity = void 0,
    currentPraticeType = "chapter",
    currentChapterIndex = 0,
    showExaminationInit = false,
    showRandomInit = false,
    chapterPratices = [],
    examinationPratices = [],
    randomPratices = void 0;

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
	var update = {};
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
		success: function success() {}
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
	findUnitById(unitId, function (result) {
		removeUnit(unitId, function () {});

		console.log('find unit result', unitId, result);
		if (!result) return;

		var randomUnitId = void 0;
		findSubjectByName(subjectName, function (result) {
			randomUnitId = result.randomPratices;
		});

		var SingleChoice = result.SingleChoice,
		    MultipleChoices = result.MultipleChoices,
		    TrueOrFalse = result.TrueOrFalse,
		    FillInTheBlank = result.FillInTheBlank,
		    ShortAnswer = result.ShortAnswer,
		    Programming = result.Programming;

		SingleChoice.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "SingleChoice", praticeId);
		});
		MultipleChoices.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "MultipleChoices", praticeId);
		});
		TrueOrFalse.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "TrueOrFalse", praticeId);
		});
		FillInTheBlank.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "FillInTheBlank", praticeId);
		});
		ShortAnswer.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "ShortAnswer", praticeId);
		});
		Programming.forEach(function (praticeId, index, array) {
			console.log(praticeId);
			removePratice(praticeId, function () {});
			removePraticeInRandomUnit(randomUnitId, "Programming", praticeId);
		});
	});
}

function removeUnitFormSubject(unitId) {
	var update = {};
	update[currentPraticeType + "Pratices"] = unitId;
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
		success: function success() {}
	});
}

function removeIndexEvent(index) {
	$(".btnDiv").css("display", "none");
	showWin("确定删除？", function () {
		findSubjectByName(subjectName, function (result) {
			var unitId = result[currentPraticeType + "Pratices"][index];
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
	if (identity === "student") {
		$(".addMore").css("display", "none");
	} else {
		$(".addMore").css("display", "inline-block");
	}

	if (identity === "student") {
		$(".removeIndex").css("display", "none");
		$(".modifyBtn").css("display", "none");
	}
}

function showChapterIndex(indexCount) {
	// let innerHtml = `<li value=-1>示例</li>`;
	var innerHtml = "";
	for (var i = 0; i < indexCount; i++) {
		innerHtml = innerHtml + "<li value=" + i + ">" + (i + 1) + "<div class=\"btnDiv\"><input type=\"button\" class=\"modifyBtn\"><input type=\"button\" class=\"removeIndex\" value=\"X\"></div></li>";
	}

	$(".chapterContent > aside > ul")[0].innerHTML = innerHtml;

	if (indexCount > 0) {
		$($(".chapterContent > aside > ul > li")[0]).addClass("select");
		showOneChapterContentType(chapterPratices[0]);
	}

	if (identity !== "student") {
		$(".chapterContent > aside > ul > li").hover(function (e) {
			$(getTarget(e)).find(".btnDiv").css("display", "block");
		}, function (e) {
			$(getTarget(e)).find(".btnDiv").css("display", "none");
		});
	}
}

function showOneChapterContentType(unitId) {
	$(".chapterContent > .content > section").css("display", "none");

	findUnitById(unitId, function (result) {
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

/** 计算试卷的总分
 * @param result Object 查询试卷unitId后得到的result
*/
function calTotalScore(result) {
	var SingleChoiceArr = result.SingleChoice,
	    MultipleChoicesArr = result.MultipleChoices,
	    TrueOrFalseArr = result.TrueOrFalse,
	    FillInTheBlankArr = result.FillInTheBlank,
	    ShortAnswerArr = result.ShortAnswer,
	    ProgrammingArr = result.Programming,
	    SingleChoiceTotalScore = 0,
	    MultipleChoicesTotalScore = 0,
	    TrueOrFalseTotalScore = 0,
	    FillInTheBlankTotalScore = 0,
	    ShortAnswerTotalScore = 0,
	    ProgrammingTotalScore = 0,
	    totalScore = void 0;

	if (SingleChoiceArr.length) {
		findPraticesById(SingleChoiceArr[0], function (data) {
			SingleChoiceTotalScore = SingleChoiceArr.length * data.score;
		});
	}
	if (MultipleChoicesArr.length) {
		findPraticesById(MultipleChoicesArr[0], function (data) {
			MultipleChoicesTotalScore = MultipleChoicesArr.length * data.score;
		});
	}
	if (TrueOrFalseArr.length) {
		findPraticesById(TrueOrFalseArr[0], function (data) {
			TrueOrFalseTotalScore = TrueOrFalseArr.length * data.score;
		});
	}
	if (FillInTheBlankArr.length) {
		findPraticesById(FillInTheBlankArr[0], function (data) {
			FillInTheBlankTotalScore = FillInTheBlankArr.length * data.score;
		});
	}

	for (var i = 0, len = ShortAnswerArr.length; i < len; i++) {
		findPraticesById(ShortAnswerArr[i], function (data) {
			ShortAnswerTotalScore += data.score;
		});
	}

	for (var _i = 0, _len = ProgrammingArr.length; _i < _len; _i++) {
		findPraticesById(ProgrammingArr[_i], function (data) {
			ProgrammingTotalScore += data.score;
		});
	}

	totalScore = SingleChoiceTotalScore + MultipleChoicesTotalScore + TrueOrFalseTotalScore + FillInTheBlankTotalScore + ShortAnswerTotalScore + ProgrammingTotalScore;

	return {
		SingleChoiceTotalScore: SingleChoiceTotalScore,
		MultipleChoicesTotalScore: MultipleChoicesTotalScore,
		TrueOrFalseTotalScore: TrueOrFalseTotalScore,
		FillInTheBlankTotalScore: FillInTheBlankTotalScore,
		ShortAnswerTotalScore: ShortAnswerTotalScore,
		ProgrammingTotalScore: ProgrammingTotalScore,
		totalScore: totalScore
	};
}

function addExamination(unitId, index) {
	findUnitById(unitId, function (result) {
		var section = document.createElement("section");
		section.className = "content";
		var totalScore = calTotalScore(result),
		    time = result.time,
		    beginTime = result.effectiveTime.beginTime,
		    endTime = result.effectiveTime.endTime,
			openTimeHtml = "";

		if (!beginTime && !endTime) {
			openTimeHtml = '不限';
		} else {
			openTimeHtml = '<br>';

			if (beginTime) {
				beginTime = new Date(beginTime);
				openTimeHtml += '<span class="beginTime" id="' + beginTime.getTime() + '">' + beginTime.toLocaleString() + '</span>';
			} else {
				openTimeHtml += '不限';
			}

			openTimeHtml += " — ";

			if (endTime) {
				endTime = new Date(endTime);
				openTimeHtml += '<span class="endTime" id="' + endTime.getTime() + '">' + endTime.toLocaleString() + '</span>';
			} else {
				openTimeHtml += '不限';
			}
		}

		section.innerHTML = "<section class=\"showEg\">\n\t\t\t\t\t\t\t\t<div class=\"btnDiv\"><input type=\"button\" class=\"modifyBtn\"><input type=\"button\" class=\"removeIndex\" value=\"X\"></div>\n\t\t\t\t\t\t\t\t<div class=\"title\">\u8BD5\u5377<span class=\"index\">" + (index + 1) + "</span></div>\n\t\t\t\t\t\t\t\t<section class=\"contentDetail\">\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showSingleChoiceCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u5355\u9009\u9898\uFF1A" + result.SingleChoice.length + "\u9053 \u5171" + totalScore.SingleChoiceTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showMultipleChoicesCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u591A\u9009\u9898\uFF1A" + result.MultipleChoices.length + "\u9053 \u5171" + totalScore.MultipleChoicesTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showTrueOrFalseCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u5224\u65AD\u9898\uFF1A" + result.TrueOrFalse.length + "\u9053 \u5171" + totalScore.TrueOrFalseTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showFillInTheBlankCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u586B\u7A7A\u9898\uFF1A" + result.FillInTheBlank.length + "\u9053 \u5171" + totalScore.FillInTheBlankTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showShortAnswerCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u7B80\u7B54\u9898\uFF1A" + result.ShortAnswer.length + "\u9053 \u5171" + totalScore.ShortAnswerTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"showProgrammingCount\">\n\t\t\t\t\t\t\t\t\t\t\t\u7F16\u7A0B\u9898\uFF1A" + result.Programming.length + "\u9053 \u5171" + totalScore.ProgrammingTotalScore + "\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"totalTime\">\n\t\t\t\t\t\t\t\t\t\t\t\u5B8C\u6210\u65F6\u95F4\uFF1A" + time.hours + "\u5C0F\u65F6" + time.minutes + "\u5206\u949F" + time.seconds + "\u79D2\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"totalScore\">\n\t\t\t\t\t\t\t\t\t\t\t\u603B\u5206\uFF1A<span class=\"count\">" + totalScore.totalScore + "</span>\u5206\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<p class=\"openTime\">\n\t\t\t\t\t\t\t\t\t\t\t\u5F00\u653E\u65F6\u95F4\uFF1A" + openTimeHtml + "\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t1\u3001\u8BF7\u5728\u89C4\u5B9A\u65F6\u95F4\u5B8C\u6210\u8BD5\u5377\u5185\u5168\u90E8\u9898\u76EE\uFF0C\u8003\u8BD5\u65F6\u95F4\u7ED3\u675F\uFF0C\u7CFB\u7EDF\u5C06\u81EA\u52A8\u4EA4\u5377\u3002<br>\n\t\t\t\t\t\t\t\t\t\t2\u3001\u6240\u6709\u9898\u76EE\u53EF\u901A\u8FC7\u7B54\u9898\u5361\u8FD4\u56DE\u4FEE\u6539\uFF0C\u70B9\u51FB\u63D0\u524D\u4EA4\u5377\u540E\u8BD5\u5377\u63D0\u4EA4\uFF0C\u5C06\u65E0\u6CD5\u7EE7\u7EED\u7B54\u6848\uFF0C\u8BF7\u8C28\u614E\u63D0\u4EA4\u3002<br>\n\t\t\t\t\t\t\t\t\t\t3\u3001\u8BF7\u8BDA\u4FE1\u7B54\u9898\uFF0C\u72EC\u7ACB\u5B8C\u6210\u3002<br>\n\t\t\t\t\t\t\t\t\t\t4\u3001\u795D\u4F60\u597D\u8FD0\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t</section>";
		$(".examinationContent .addMore").before(section);

		if (identity !== "student") {
			$(section).hover(function (e) {
				$(this).find(".showEg > .btnDiv").css("display", "block");
				// let target = getTarget(e);
				// let classname = target.className;
				// switch(classname) {
				// 	case "contentDetail":
				// 	case "title":
				// 		$(target).parent().find(".btnDiv").css("display", "block");
				// 		break;
				// 	case "showEg":
				// 		$(target).find(".btnDiv").css("display", "block");
				// 		break;
				// }
			}, function (e) {
				$(this).find(".showEg > .btnDiv").css("display", "none");
			});
		}

		$(section).click(function (e) {
			var classname = getTarget(e).className;
			if (classname === "modifyBtn") {
				modifyNotRandom(index);
				return;
			}

			if (classname === "removeIndex") {
				removeIndexEvent(index);
				return;
			}

			var beginTime = void 0,
			    endTime = void 0,
			    beginTimeDiv = $(this).find(".openTime > .beginTime")[0],
			    endTimeDiv = $(this).find(".openTime > .endTime")[0];
			if (beginTimeDiv) {
				beginTime = new Date(Number(beginTimeDiv.id));
			}
			if (endTimeDiv) {
				endTime = new Date(Number(endTimeDiv.id));
			}

			var thisDate = new Date(),
			    inDateFlag = true;
			if (beginTime) {
				if (beginTime > thisDate) {
					inDateFlag = false;
				}
			}
			if (endTime) {
				if (endTime < thisDate) {
					inDateFlag = false;
				}
			}

			if (inDateFlag) {
				var _queryParam = "&index=" + index;
				doPratice(_queryParam);
			} else {
				showTips("该试卷暂不开放！", 1000);
				return;
			}
		});
	});
}

function showAllExaminationIndex() {
	showExaminationInit = true;
	console.log(examinationPratices);
	for (var i = 0, len = examinationPratices.length; i < len; i++) {
		addExamination(examinationPratices[i], i);
	}
}

function showRandomIndex() {
	showRandomInit = true;
	findUnitById(randomPratices, function (result) {
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
	subjectName = decodeURIComponent(getValueInUrl("subjectName"));

	authorityControl();

	findSubjectByName(subjectName, function (result) {
		chapterPratices = result.chapterPratices;
		examinationPratices = result.examinationPratices;
		randomPratices = result.randomPratices;
	});

	showChapterIndex(chapterPratices.length);
}

function bindEvent() {
	$(".navContent").click(function (e) {
		var target = getTarget(e),
		    classname = target.className;
		currentPraticeType = classname;

		$(".navContent div").css("background", "transparent");
		$(target).css("background", "#f5f6eb");

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

	$(".chapterContent > aside > ul").click(function (e) {
		var value = getTarget(e).value;
		if (value > 0 || value === 0) {
			changeChapterIndexNum(value);
			currentChapterIndex = value;
			return;
		}

		if (getTarget(e).className === "modifyBtn") {
			var index = $(getTarget(e)).parent().parent().val();
			modifyNotRandom(index);
			return;
		}

		if (getTarget(e).className === "removeIndex") {
			var _index = $(getTarget(e)).parent().parent().val();
			removeIndexEvent(_index);
		}
	});

	$(".addMore").click(function (e) {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	});

	if (identity !== "student") {
		$(".randomContent > .content > section").hover(function (e) {
			$(this).find(".showEg > .btnDiv").css("display", "block");
		}, function (e) {
			$(this).find(".showEg > .btnDiv").css("display", "none");
		});
	}

	$(".content section").click(function (e) {
		var type = this.className, queryParam;

		if (currentPraticeType === "random") {
			type = type.split(" ")[1];
			if (getTarget(e).className === "modifyBtn") {
				modifyRandom(type);
				return;
			}

			var exerciseCount = Number($(this).find(".exerciseCount .num")[0].innerHTML);
			if (exerciseCount === 0) {
				showTips("该题型内容为空！", 1500);
				return;
			}

			queryParam = "&type=" + type;
		} else if (currentPraticeType === "chapter") {
			queryParam = "&index=" + currentChapterIndex + "&type=" + type;
		}

		doPratice(queryParam);
	});
}