"use strict";

var totalQuestion;
var questionType = [];
var currentTypeNum = 0;

var score = 0; // 记录总分情况
var answerCanNotChange = false;

/**
答案格式为{answer:["A","B","C"], score:5}
{answer: "HELLO", score: 20}
**/
var correctAnswer = {};
var userAnswer = {};

function getUserAnswer() {
	for (var i = 0, len = questionType.length; i < len; i++) {
		var quesType = questionType[i];
		var blankQuesNum = 0;
		var answerArr = $("." + quesType + " .answer");
		userAnswer[quesType] = [];
		for (var j = 0, len1 = answerArr.length; j < len1; j++) {
			if (answerArr[j].nodeName.toLowerCase() == "input") {
				if (answerArr[j].type == "radio") {
					if (answerArr[j].checked) {
						userAnswer[quesType][userAnswer[quesType].length] = {
							answer: answerArr[j].value
						};
					}
				} else if (answerArr[j].type == "checkbox") {
					var userAnswerLen = userAnswer[quesType].length;
					userAnswer[quesType][userAnswerLen] = {
						answer: []
					};
					for (var t = 0; t < 4; t++, j++) {
						if (answerArr[j].checked) {
							userAnswer[quesType][userAnswerLen].answer[t] = answerArr[j].value;
						}
					}
					j--;
				} else if (answerArr[j].type == "text") {
					var userAnswerLen = userAnswer[quesType].length;
					userAnswer[quesType][userAnswerLen] = {
						answer: []
					};
					for (var _t = 0; _t < totalQuestion["fill_in_the_blank"].exercise[blankQuesNum].answer.length; _t++, j++) {
						userAnswer[quesType][userAnswerLen].answer[_t] = answerArr[j].value;
					}
					j--;
					blankQuesNum++;
				}
			} else {
				userAnswer[quesType][userAnswer[quesType].length] = {
					answer: answerArr[j].value
				};
			}
		}
	}
}

function showQuesComment(content) {
	var div = document.createElement("div");
	div.className = questionType[currentTypeNum];

	var title = document.createElement("h1");
	title.className = "title";
	title.innerHTML = questionType[currentTypeNum];

	div.appendChild(title);
	div.appendChild(content);
	$(".totalQues").append(div);

	$(".runTest").click(function (e) {
		var url = window.location.href;
		var type = url.split("?")[1].split("=")[1];
		var textarea = $(getTarget(e)).parent().find("textarea");

		switch (type) {
			case "javaScript":
				jsCodeTest(textarea);
				break;
			case "java":
				javaCodeTest(textarea);
				break;
			case "c_c++":
				break;
		}
	});
}

function showChoiceQues(totalQues, inputType) {
	var content = document.createElement("div");
	content.className = "content";

	for (var i = 0, len = totalQues.length; i < len; i++) {
		var topic = totalQues[i].topic;
		var choices = totalQues[i].choices;

		var div = document.createElement("div");
		var topicDiv = "<div>" + topic.num + "." + topic.content + "</div>";
		var choicesDiv = "<div><ul>";
		for (var j = 0, len1 = choices.length; j < len1; j++) {
			choicesDiv = choicesDiv + "<li><input type='" + inputType + "' value='" + choices[j].num + "' name='MultipleChoice" + topic.num + "' class='answer'/>" + choices[j].content + "</li>";
		}
		choicesDiv = choicesDiv + "</ul></div>";
		div.innerHTML = topicDiv + choicesDiv + "<div class='showAnswer'></div>";
		content.appendChild(div);
	}
	return content;
}

function showBlankQues() {
	var content = document.createElement("div");
	content.className = "content";

	var totalQues = totalQuestion["fill_in_the_blank"].exercise;
	for (var i = 0, len = totalQues.length; i < len; i++) {
		var topic = totalQues[i].topic;

		var div = document.createElement("div");
		var topicDiv = "<div>" + topic.num + "." + topic.content + "</div>";
		var answerDiv = "<div>";
		for (var j = 0, answerLen = totalQues[i].answer.length; j < answerLen; j++) {
			answerDiv = answerDiv + "<span class='blankStyle'>" + j + ".<input type='text' class='blankAnswer answer'/>" + "</span>";
		}
		answerDiv = answerDiv + "</div>";
		div.innerHTML = topicDiv + answerDiv + "<div class='showAnswer'></div>";
		content.appendChild(div);
	}
	return content;
}

function showBigQues(quesType) {
	var content = document.createElement("div");
	content.className = "content";

	var totalQues = totalQuestion[questionType[currentTypeNum]];
	for (var i = 0, len = totalQues.length; i < len; i++) {
		var topic = totalQues[i].topic;

		var div = document.createElement("div");
		var topicDiv = "<div>" + topic.num + "." + topic.content + "</div>";
		var textarea = "<textarea style='width:500px; height: 200px;' class='answer'></textarea>";
		if (quesType === "Programming") {
			var testBtn = "<input type='button' value='调试' class='runTest'/>";
			var runResult = "<div>显示测试结果：</div><div class='runResult'></div>";
			div.innerHTML = topicDiv + textarea + testBtn + runResult + "<div class='showAnswer'></div>";
		} else {
			div.innerHTML = topicDiv + textarea + "<div class='showAnswer'></div>";
		}
		content.appendChild(div);
	}
	return content;
}

function showQues() {
	var content;
	switch (questionType[currentTypeNum]) {
		case "Multiple_Choice":
			content = showChoiceQues(totalQuestion["Multiple_Choice"].exercise, "radio");
			break;
		case "Multiple_Choices":
			content = showChoiceQues(totalQuestion["Multiple_Choices"].exercise, "checkbox");
			break;
		case "fill_in_the_blank":
			content = showBlankQues();
			break;
		case "Short_Answer":
			content = showBigQues("Short_Answer");
			break;
		case "Programming":
			content = showBigQues("Programming");
			break;
	}
	showQuesComment(content);
}

function jsCodeTest(textarea) {
	var runResult = $(".runResult")[0];
	try {
		var n = eval("(" + textarea.val() + ")(2, 3)");
		if (n === 5) {
			runResult.innerHTML = "编译通过";
			return true;
		} else {
			runResult.innerHTML = "编译结果不正确";
		}
	} catch (e) {
		runResult.innerHTML = e;
	}
}

function javaCodeTest(textarea) {
	console.log(textarea.val());
	$.ajax({
		url: "http://127.0.0.1:3000/javaTest",
		type: "POST",
		crossDomain: true,
		defaultType: "json",
		data: {
			code: textarea.val()
		},
		success: function success(result) {
			$(".runResult")[0].innerHTML = "<pre>" + result + "</pre>";
			if (result == "编译通过") {
				return true;
			}
		},
		error: function error(_error) {
			console.log(_error);
		}
	});
}

function showAnswer(k, i, className) {
	if (userAnswer[k][i].answer) {
		userAnswer[k][i].answer == "";
	}

	console.log($("." + className + " .showAnswer"));

	$("." + className + " .showAnswer")[i].innerHTML = "正确答案为:" + correctAnswer[k][i].answer + ", 分数为：" + correctAnswer[k][i].score + "</br>" + "您的答案是：" + userAnswer[k][i].answer + ", 得分为：" + userAnswer[k][i].score;
}

function matchAnswer() {
	$(".questionBlock").css("display", "none");
	$(".next").val("查看分数");
	for (var k in correctAnswer) {
		switch (k) {
			case "Multiple_Choice":
				for (var i = 0, len = correctAnswer[k].length; i < len; i++) {
					if (!userAnswer[k][i]) {
						userAnswer[k][i] = {
							answer: "",
							score: 0
						};
					} else {
						if (correctAnswer[k][i].answer == userAnswer[k][i].answer) {
							userAnswer[k][i].score = correctAnswer[k][i].score;
							score = score + correctAnswer[k][i].score;
						} else {
							userAnswer[k][i].score = 0;
						}
					}

					showAnswer(k, i, "Multiple_Choice");
				}
				break;
			case "Multiple_Choices":
				for (var _i = 0, _len = correctAnswer[k].length; _i < _len; _i++) {
					if (userAnswer[k][_i].answer.length === 0) {
						userAnswer[k][_i].score = 0;
					} else {
						var flag = true;
						for (var j = 0, len1 = correctAnswer[k][_i].answer.length; j < len1; j++) {
							if (userAnswer[k][_i].answer[j] != correctAnswer[k][_i].answer[j]) {
								flag = false;
								userAnswer[k][_i].score = 0;
								break;
							}
						}
						if (flag) {
							userAnswer[k][_i].score = correctAnswer[k][_i].score;
							score = score + correctAnswer[k][_i].score;
						}
					}
					showAnswer(k, _i, "Multiple_Choices");
				}
				break;
			case "fill_in_the_blank":
				for (var _i2 = 0, _len2 = correctAnswer[k].length; _i2 < _len2; _i2++) {
					var tempScore = 0;
					for (var _j = 0, _len3 = correctAnswer[k][_i2].answer.length; _j < _len3; _j++) {
						if (userAnswer[k][_i2].answer[_j] == correctAnswer[k][_i2].answer[_j]) {
							tempScore = tempScore + correctAnswer[k][_i2].score;
							score = score + correctAnswer[k][_i2].score;
						}
					}
					userAnswer[k][_i2].score = tempScore;
					showAnswer(k, _i2, "fill_in_the_blank");
				}
				break;
			case "Short_Answer":
				for (var _i3 = 0, _len4 = correctAnswer[k].length; _i3 < _len4; _i3++) {
					showAnswer(k, _i3, "Short_Answer");
				}
				break;
			case "Programming":
				var url = window.location.href;
				var type = url.split("?")[1].split("=")[1];
				var textarea = $(".Programming textarea");
				var fn;

				switch (type) {
					case "javaScript":
						fn = jsCodeTest;
						break;
					case "java":
						fn = javaCodeTest;
						break;
					case "c_c++":
						break;
				}

				for (var _i4 = 0, _len5 = textarea.length; _i4 < _len5; _i4++) {
					if (fn($(textarea[_i4]))) {
						score = score + correctAnswer[k][_i4].score;
						userAnswer[k][_i4] = { score: correctAnswer[k][_i4].score };
					} else {
						userAnswer[k][_i4] = { score: 0 };
					}
					showAnswer(k, _i4, "Programming");
				}
				break;
		}
	}
}

$(function () {
	$(".beginBtn").click(function () {
		$.ajax({
			url: window.location.href,
			type: "POST",
			crossDomain: true,
			defaultType: "json",
			success: function success(result) {
				var data = JSON.parse(result);
				totalQuestion = data;
				for (var k in data) {
					questionType[questionType.length] = k;
					correctAnswer[k] = new Array();
					var len = void 0,
					    exer = void 0;
					if (data[k].exercise) {
						len = data[k].exercise.length;
						exer = data[k].exercise;
					} else {
						len = data[k].length;
						exer = data[k];
					}
					for (var i = 0; i < len; i++) {
						correctAnswer[k][i] = {
							answer: exer[i].answer
						};
						if (exer[i].score) {
							correctAnswer[k][i].score = exer[i].score;
						} else {
							correctAnswer[k][i].score = data[k].score;
						}
					}
				}

				$(".beginBtn").css("display", "none");
				showQues();
				$(".questionBlock").css("display", "block");
			},
			error: function error(_error2) {
				console.log(_error2);
			}
		});
	});

	$(".preview").click(function () {
		if (currentTypeNum === 0) {
			alert("当前已经是第一部分了");
			return;
		}

		if ($(".next").val() !== "next") {
			$(".next").val("next");
		}

		currentTypeNum--;
		var showBlock = $("." + questionType[currentTypeNum]);
		var hideBlock = $("." + questionType[currentTypeNum + 1]);
		if (showBlock.length != 0) {
			$("." + questionType[currentTypeNum]).css("display", "block");
		} else {
			showQues();
		}
		hideBlock.css("display", "none");
	});

	$(".next").click(function () {
		if (currentTypeNum === questionType.length - 1) {
			if (!answerCanNotChange) {
				getUserAnswer();
				matchAnswer();
				console.log(correctAnswer);
				console.log(userAnswer);
				answerCanNotChange = true;
			}

			$(".questionBlock").css("display", "none");
			$(".showScoreBlock").css("display", "block");
			$(".showTotalScore")[0].innerHTML = "您的分数是 ：" + score;
			return;
		}

		if (currentTypeNum === questionType.length - 2) {
			if (answerCanNotChange) {
				$(".next").val("查看总分");
			} else {
				$(".next").val("提交试卷");
			}
		}

		currentTypeNum++;
		var showBlock = $("." + questionType[currentTypeNum]);
		var hideBlock = $("." + questionType[currentTypeNum - 1]);
		if (showBlock.length != 0) {
			$("." + questionType[currentTypeNum]).css("display", "block");
		} else {
			showQues();
		}
		hideBlock.css("display", "none");
	});

	$(".showScoreDetail").click(function () {
		$(".showScoreBlock").css("display", "none");
		$(".questionBlock").css("display", "block");
		$("." + questionType[questionType.length - 1]).css("display", "none");
		$("." + questionType[0]).css('display', "block");
		currentTypeNum = 0;
		$(".next").val("next");
	});
});