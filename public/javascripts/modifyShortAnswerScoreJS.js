"use strict";

var testId = void 0; // 保存此测试结果的id

// 令答案不可更改
function soThatAnswerCanNotBeChange() {
	$("textarea").attr("readOnly", true);
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
			case "ShortAnswer":
				var _loop2 = function _loop2(i, len) {
					console.log(scoresObj[k]);
					var sentence1 = studentAnswer[i],
					    sentence2 = correctAnswerContent[k][i].answer[0].content,
					    scores = scoresObj[k],
					    professionalNounsArr = correctAnswerContent[k][i].answer[0].professionalNounsArr;
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
							for (var _i = 0, _len = theSameWordArr1.length; _i < _len; _i++) {
								sentence1 = sentence1.replace(new RegExp(theSameWordArr1[_i], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							for (var _i2 = 0, _len2 = theSameWordArr2.length; _i2 < _len2; _i2++) {
								sentence2 = sentence2.replace(new RegExp(theSameWordArr2[_i2], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							addShortAnswerScoreDetailDiv($(allContent[i]), scores[i], sentence1, sentence2);
						}
					});
					// addShortAnswerScoreDetailDiv($(allContent[i]), scoresObj[k][i], sentence1, sentence2);
				};

				for (var i = 0, len = allContent.length; i < len; i++) {
					_loop2(i, len);
				}
				break;
		}
	};

	for (var k in correctAnswerContent) {
		_loop();
	}
}

function addShortAnswerScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	var div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<input type="text" class="score" value=' + score + '></div>' + '<div>你的答案：<pre class="studentAnswer">' + studentAnswer + '</pre></div>' + '<div>正确答案：<pre class="correctAnswer">' + correctAnswer.replace(/[【】（\d*.\d*）{}]/g, "") + '</pre></div>';
	$target.append(div);
}

/** 在题目答案框中显示考生答案
 * @param studentAnswerContent Object 考生答案
 * studentAnswerContent = {
	ShortAnswer: Array
 }
*/
function showStudentAnswer(studentAnswerContent, correctAnswerContent) {
	for (var k in studentAnswerContent) {
		var _allContent = $("." + k + " > .content"),
		    answer = studentAnswerContent[k];
		switch (k) {
			case "ShortAnswer":
				for (var i = 0, len = _allContent.length; i < len; i++) {
					$(_allContent[i]).find(".answer > textarea").val(answer[i]);
				}
				break;
		}
	}
}

var changePraticeContentFn = changePraticeContent;
changePraticeContent = function changePraticeContent(index) {
	changePraticeContentFn(index);
	if ($(".next").val() === "提交") {
		$(".next").val("完成");
	}
};

function init() {
	praticeType = "examination";

	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	selectIndex = getValueInUrl("index");
	type = "ShortAnswer";

	findSubjectByName(subjectName, function (result) {
		var unitId = result["examinationPratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function (data) {
			var allPraticeContent = data[type];
			console.log(data);
			addNotChoicePratices(allPraticeContent, type);

			hasContentTypeArr.push(type);

			currentIndexArray[type] = {
				index: 0,
				length: allPraticeContent.length
			};
			addPraticeBlockIndex();
			addPraticeIndex(currentIndexArray[type].length);
			changePraticeContent(currentIndexArray[type].index);
		});
	});

	$.ajax({
		url: "../scoresDetail",
		type: "GET",
		success: function success(result) {
			console.log(result);
			testId = result.testId;
			soThatAnswerCanNotBeChange();
			showCorrectAnswer(result);
			showStudentAnswer(result.studentAnswerContent, result.correctAnswerContent);
		}
	});
}

function bindEvent() {
	// 点击题目编号事件
	$(".showPraticeIndex").click(function (e) {
		if (Number(getTarget(e).innerHTML)) {
			var index = getTarget(e).innerHTML - 1;
			currentIndexArray[type].index = index;
			changePraticeContent(index);
		}
	});

	$(".previous").click(function () {
		previousClick(this);
	});

	$(".next").click(function () {
		if (this.value === "完成") {
			var scoresArray = [],
			    ShortAnswerTotalScores = 0,
			    allScoresInput = $("input.score");
			for (var i = 0, len = allScoresInput.length; i < len; i++) {
				var thisScore = allScoresInput[i].value;
				ShortAnswerTotalScores += Number(thisScore);
				scoresArray.push(thisScore);
			}
			callDataProcessingFn({
				data: {
					data: "testResults",
					callFunction: "find",
					findOpt: {
						_id: testId
					}
				},
				success: function success(result) {
					var scoresObj = result.scoresObj,
					    scoresDetail = result.scoresDetail;
					var oldShortAnswerTotalScores = scoresDetail.details["简答题"], totalScores = scoresDetail.totalScore;
					scoresObj.ShortAnswer = scoresArray;
					scoresDetail.details["简答题"] = ShortAnswerTotalScores;
					scoresDetail.totalScore = totalScores - oldShortAnswerTotalScores + Number(ShortAnswerTotalScores);

					callDataProcessingFn({
						data: {
							data: "testResults",
							callFunction: "update",
							updateOpt: {
								_id: testId
							},
							operation: "set",
							update: {
								scoresObj: scoresObj,
								scoresDetail: scoresDetail
							}
						},
						success: function success() {
							var subjectName = decodeURIComponent(getValueInUrl("subjectName")),
							    index = getValueInUrl("index");
							window.location.href = "../testResultsManage?testName=" + (subjectName + " | 试卷" + (Number(index) + 1));
						}
					});
				}
			});
		} else {
			nextClick(this);
		}
	});
}