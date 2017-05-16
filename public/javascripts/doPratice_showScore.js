"use strict";

var editorCount = 0;

var changePraticeContentFn = changePraticeContent;
changePraticeContent = function changePraticeContent(index) {
	changePraticeContentFn(index);
	if ($(".next").val() === "提交") {
		// $(".next").val(">");
		// $(".next").addClass("disable");
		$(".next").val("总分 →");
	}
};

// 令答案不可更改
function soThatAnswerCanNotBeChange() {
	$("input[type=radio]").attr("disabled", true);
	$("input[type=checkbox]").attr("disabled", true);

	$(".textInput").attr("readOnly", true);
	$("textarea").attr("readOnly", true);
}

/** 在选择题中添加图标
 * @param $studentSelectTarget Object 考生选择的答案
*/
function addLogoInChoice($studentSelectTarget) {
	var logo = document.createElement("span");
	if ($studentSelectTarget.hasClass("correctChoiceBorder")) {
		logo.className = "correctLogo";
	} else {
		logo.className = "errorLogo";
	}
	$studentSelectTarget.append(logo);
}

/** 添加图标
 * @param classname String 添加的图标的类名
*/
function addLogo($target, classname) {
	var logo = document.createElement("span");
	logo.className = classname;
	$target.append(logo);
}

/** 添加得分情况详情的div
 * @param $target Object 添加div的对象
*/
function addShortScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	var div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' + '<div>你的答案：<span class="studentAnswer">' + studentAnswer + '</span></div>' + '<div>正确答案：<span class="correctAnswer">' + correctAnswer + '</span></div>';
	$target.append(div);
}
function addShortAnswerScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	var div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' + '<div>你的答案：<pre class="studentAnswer">' + studentAnswer + '</pre></div>' + '<div>正确答案：<pre class="correctAnswer">' + correctAnswer.replace(/[【】（\d*.\d*）{}]/g, "") + '</pre></div>';
	$target.append(div);
}
function addProgrammingScoreDetailDiv($target, score, studentAnswer, correctAnswer, mode) {
	var div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' + '<div>你的答案：<textarea id="studentAnswer' + editorCount + '"></textarea></div>' + '<div>正确答案：<textarea id="correctAnswer' + editorCount + '"></textarea></div>';
	$target.append(div);

	var editor1 = editorStyle("studentAnswer" + editorCount, mode);
	editor1.setValue(studentAnswer);
	editor1.setSize("auto", "auto");
	editor1.setOption("readOnly", true);
	setTimeout(function () {
		editor1.refresh();
	}, 1);

	var editor2 = editorStyle("correctAnswer" + editorCount, mode);
	editor2.setValue(correctAnswer);
	editor2.setSize("auto", "auto");
	editor2.setOption("readOnly", true);
	setTimeout(function () {
		editor2.refresh();
	}, 1);

	editorCount++;
}

/** 在题目答案框中显示考生答案
 * @param studentAnswerContent Object 考生答案
 * studentAnswerContent = {
 	...,
	ShortAnswer: Array,
	programming: Array
 }
*/
function showStudentAnswer(studentAnswerContent, correctAnswerContent) {
	for (var k in studentAnswerContent) {
		var allContent = $("." + k + " > .content"),
		    answer = studentAnswerContent[k];
		switch (k) {
			case "SingleChoice":
				for (var i = 0, len = allContent.length; i < len; i++) {
					if (answer[i][0]) {
						var answerIndex = answer[i][0].charCodeAt() - 65;
						var $studentSelectTarget = $($(allContent[i]).find(".answer > div")[answerIndex]);
						$studentSelectTarget.find("input")[0].checked = true;
						addLogoInChoice($studentSelectTarget);
					}
				}
				break;
			case "MultipleChoices":
				for (var _i = 0, _len = allContent.length; _i < _len; _i++) {
					for (var j = 0, len1 = answer[_i].length; j < len1; j++) {
						if (answer[_i][j]) {
							var _answerIndex = answer[_i][j].charCodeAt() - 65;
							var _$studentSelectTarget = $($(allContent[_i]).find(".answer > div")[_answerIndex]);
							_$studentSelectTarget.find("input")[0].checked = true;
							addLogoInChoice(_$studentSelectTarget);
						}
					}
				}
				break;
			case "TrueOrFalse":
				for (var _i2 = 0, _len2 = allContent.length; _i2 < _len2; _i2++) {
					if (answer[_i2][0]) {
						var _answerIndex2 = answer[_i2][0] === "T" ? 0 : 1;
						var _$studentSelectTarget2 = $($(allContent[_i2]).find(".answer > div")[_answerIndex2]);
						_$studentSelectTarget2.find("input")[0].checked = true;
						addLogoInChoice(_$studentSelectTarget2);
					}
				}
				break;
			case "FillInTheBlank":
				$(".answerBlock").css("display", "block");

				var correctAnswer = correctAnswerContent[k].answer;
				for (var _i3 = 0, _len3 = allContent.length; _i3 < _len3; _i3++) {
					for (var _j = 0, _len4 = answer[_i3].length; _j < _len4; _j++) {
						var $target = $($(allContent[_i3]).find(".answer > div")[_j]);
						$target.find(".textInput").val(answer[_i3][_j]);

						var thisCorrectAnswer = correctAnswer[_i3][_j],
						    logoClassName = void 0;
						for (var t = 0, _len5 = thisCorrectAnswer.length; t < _len5; t++) {
							if (thisCorrectAnswer[t] === answer[_i3][_j]) {
								logoClassName = "correctLogo";
								break;
							}
						}
						if (!logoClassName) {
							logoClassName = "errorLogo";
						}
						addLogo($target, logoClassName);
					}
				}
				break;
			case "ShortAnswer":
				for (var _i4 = 0, _len6 = allContent.length; _i4 < _len6; _i4++) {
					$(allContent[_i4]).find(".answer > textarea").val(answer[_i4]);
				}
				break;
			case "Programming":
				for (var _i5 = 0, _len7 = allContent.length; _i5 < _len7; _i5++) {
					programingEditorArray[_i5].editor.setValue(answer[_i5]);
					programingEditorArray[_i5].editor.setOption("readOnly", true);
				}
				break;
		}
	}
}

function showCorrectAnswer(result) {
	console.log(result);
	var correctAnswerContent = result.correctAnswerContent,
	    studentAnswerContent = result.studentAnswerContent,
	    scoresObj = result.scoresObj;

	var _loop = function _loop() {
		var allContent = $("." + k + " > .content"),
		    answer = correctAnswerContent[k].answer,
		    studentAnswer = studentAnswerContent[k];
		switch (k) {
			case "SingleChoice":
				for (var i = 0, len = allContent.length; i < len; i++) {
					var answerIndex = answer[i][0].charCodeAt() - 65;
					$($(allContent[i]).find(".answer > div")[answerIndex]).addClass("correctChoiceBorder");
					addShortScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i][0], answer[i][0]);
				}
				break;
			case "MultipleChoices":
				for (var _i6 = 0, _len8 = allContent.length; _i6 < _len8; _i6++) {
					for (var j = 0, len1 = answer[_i6].length; j < len1; j++) {
						var _answerIndex3 = answer[_i6][j].charCodeAt() - 65;
						$($(allContent[_i6]).find(".answer > div")[_answerIndex3]).addClass("correctChoiceBorder");
					}
					addShortScoreDetailDiv($(allContent[_i6]), scoresObj[k][_i6], studentAnswer[_i6].join(","), answer[_i6].join(","));
				}
				break;
			case "TrueOrFalse":
				for (var _i7 = 0, _len9 = allContent.length; _i7 < _len9; _i7++) {
					var _answerIndex4 = answer[_i7][0] === "T" ? 0 : 1;
					$($(allContent[_i7]).find(".answer > div")[_answerIndex4]).addClass("correctChoiceBorder");
					addShortScoreDetailDiv($(allContent[_i7]), scoresObj[k][_i7], studentAnswer[_i7][0], answer[_i7][0]);
				}
				break;
			case "FillInTheBlank":
				for (var _i8 = 0, _len10 = allContent.length; _i8 < _len10; _i8++) {
					var correctAnswer = "";
					for (var _j2 = 0, _len11 = answer[_i8].length; _j2 < _len11; _j2++) {
						correctAnswer += "<br><br>" + Number(_j2 + 1) + "." + answer[_i8][_j2].join("或");
					}
					addShortScoreDetailDiv($(allContent[_i8]), scoresObj[k][_i8], studentAnswer[_i8][0], correctAnswer);
				}
				break;
			case "ShortAnswer":
				var _loop2 = function _loop2(_i9, _len12) {
					console.log(scoresObj[k]);
					var sentence1 = studentAnswer[_i9],
					    sentence2 = correctAnswerContent[k][_i9].answer[0].content,
					    scores = scoresObj[k],
					    professionalNounsArr = correctAnswerContent[k][_i9].answer[0].professionalNounsArr;
					$.ajax({
						url: "../findTheSameWordInTwoSentence",
						type: "POST",
						data: {
							sentence1: sentence1,
							sentence2: sentence2,
							professionalNounsArr: professionalNounsArr
						},
						success: function success(result) {
							var theSameWordArr1 = result.theSameWordArr1,
							    theSameWordArr2 = result.theSameWordArr2;
							console.log(theSameWordArr1, theSameWordArr2, sentence1, sentence2);
							for (var _i10 = 0, _len13 = theSameWordArr1.length; _i10 < _len13; _i10++) {
								sentence1 = sentence1.replace(new RegExp(theSameWordArr1[_i10], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							for (var _i11 = 0, _len14 = theSameWordArr2.length; _i11 < _len14; _i11++) {
								sentence2 = sentence2.replace(new RegExp(theSameWordArr2[_i11], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							addShortAnswerScoreDetailDiv($(allContent[_i9]), scores[_i9], sentence1, sentence2);
						}
					});
					// addShortAnswerScoreDetailDiv($(allContent[i]), scoresObj[k][i], sentence1, sentence2);
				};

				for (var _i9 = 0, _len12 = allContent.length; _i9 < _len12; _i9++) {
					_loop2(_i9, _len12);
				}
				break;
			case "Programming":
				if (studentAnswer) {
					for (var _i12 = 0, _len15 = allContent.length; _i12 < _len15; _i12++) {
						var thisAnswerObj = correctAnswerContent[k][_i12].answer[0];
						addProgrammingScoreDetailDiv($(allContent[_i12]), scoresObj[k][_i12], studentAnswer[_i12], thisAnswerObj.content, thisAnswerObj.programmingTypeMode);
					}
				}
				break;
		}
	};

	for (var k in correctAnswerContent) {
		_loop();
	}
}

function init() {
	praticeType = "examination";

	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	// praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	// type = getValueInUrl("type");

	findSubjectByName(subjectName, function (result) {
		var unitId = result["examinationPratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function (data) {
			if (type) {
				allPraticeContent = data[type];

				switch (type) {
					case "SingleChoice":
					case "MultipleChoices":
					case "TrueOrFalse":
						addChoicePratices(allPraticeContent, type);
						break;
					case "FillInTheBlank":
					case "ShortAnswer":
					case "Programming":
						addNotChoicePratices(allPraticeContent, type);
						break;
				}

				hasContentTypeArr.push(type);

				currentIndexArray[type] = {
					index: 0,
					length: allPraticeContent.length
				};
			} else {
				for (var i = 0, len = praticeTypeArr.length; i < len; i++) {
					var length = data[praticeTypeArr[i]].length;
					if (length > 0) {
						switch (praticeTypeArr[i]) {
							case "SingleChoice":
							case "MultipleChoices":
							case "TrueOrFalse":
								addChoicePratices(data[praticeTypeArr[i]], praticeTypeArr[i]);
								break;
							case "FillInTheBlank":
							case "ShortAnswer":
							case "Programming":
								addNotChoicePratices(data[praticeTypeArr[i]], praticeTypeArr[i]);
								break;
						}

						currentIndexArray[praticeTypeArr[i]] = {
							index: 0,
							length: length
						};
						hasContentTypeArr.push(praticeTypeArr[i]);
					}
				}

				type = hasContentTypeArr[0];

				addPraticeBlockIndex();
			}

			addPraticeIndex(currentIndexArray[type].length);

			changePraticeContent(currentIndexArray[type].index);
		});
	});

	$.ajax({
		url: "../scoresDetail",
		type: "GET",
		success: function success(result) {
			soThatAnswerCanNotBeChange();
			showCorrectAnswer(result);
			showStudentAnswer(result.studentAnswerContent, result.correctAnswerContent);
		}
	});
}

bindEvent = function bindEvent() {
	// 当为考试模拟时，点击练习类型事件
	$(".showPraticeBlockIndex").click(function (e) {
		showPraticeBlockIndexClick(e);
	});

	// 点击题目编号事件
	$(".showPraticeIndex").click(function (e) {
		showPraticeIndexClick(e);
	});

	$(".previous").click(function () {
		previousClick(this);
	});

	$(".runningBtn").click(function (e) {
		runningBtnClick(e);
	});

	$(".next").click(function () {
		if (this.value === "总分 →") {
			console.log(decodeURIComponent(getValueInUrl("showScore")));
			window.location.href = decodeURIComponent(getValueInUrl("showScore"));
			return;
		}
		nextClick(this);
	});
};