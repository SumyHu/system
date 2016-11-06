var totalQuestion;
var questionType = [];
var currentTypeNum = 0;

var correctAnswer = {};
var userAnswer = {};

function getUserAnswer() {
	for(var i=0, len=questionType.length; i<len; i++) {
		var quesType = questionType[i];
		var answerArr = $("." + quesType + " .answer");
		userAnswer[quesType] = [];
		for(let j=0, len1=answerArr.length; j<len1; j++) {
			if (answerArr[j].nodeName.toLowerCase() == "input") {
				if (answerArr[j].type != "checkbox") {
					if (answerArr[j].checked) {
						userAnswer[quesType][userAnswer[quesType].length] = answerArr[j].value;
					}
				}
				else {
					var userAnswerLen = userAnswer[quesType].length;
					userAnswer[quesType][userAnswerLen] = [];
					for(let t=0; t<4; t++,j++) {
						if (answerArr[j].checked) {
							userAnswer[quesType][userAnswerLen][t] = answerArr[j].value;
						}
					}
				}
			}
			else {
				userAnswer[quesType][userAnswer[quesType].length] = answerArr[j].value;
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

	$(".runTest").click(function() {
		var url = window.location.href;
		var type = url.split("?")[1].split("=")[1];

		switch(type) {
			case "javaScript":
				jsCodeTest();
				break;
			case "java":
				javaCodeTest();
				break;
			case "c_c++":
				break;
		}
	});
}

function showChoiceQues(totalQues, inputType) {
	var content = document.createElement("div");
	content.className = "content";

	for(let i=0, len=totalQues.length; i<len; i++) {
		var topic = totalQues[i].topic;
		var choices = totalQues[i].choices;

		let div = document.createElement("div");
		var topicDiv = "<div>" + topic.num + "." + topic.content + "</div>";
		var choicesDiv = "<div><ul>";
		for(let j=0, len1=choices.length; j<len1; j++) {
			choicesDiv = choicesDiv + "<li><input type='" + inputType + "' value='" + choices[j].num 
			+ "' name='MultipleChoice" + topic.num + "' class='answer'/>" + choices[j].content 
			+ "</li>";
		}
		choicesDiv = choicesDiv + "</ul></div>";
		div.innerHTML = topicDiv + choicesDiv;
		content.appendChild(div);
	}
	return content;
}

function showBigQues(quesType) {
	var content = document.createElement("div");
	content.className = "content";

	var totalQues = totalQuestion[questionType[currentTypeNum]];
	for(let i=0, len=totalQues.length; i<len; i++) {
		var topic = totalQues[i].topic;

		var div = document.createElement("div");
		var topicDiv = "<div>" + topic.num + "." + topic.content + "</div>";
		var textarea = "<textarea style='width:500px; height: 200px;' class='answer'></textarea>"
		if (quesType === "Programming") {
			var testBtn = "<input type='button' value='调试' class='runTest'/>"
			var runResult = "<div>显示测试结果：</div><div class='runResult'></div>"
			div.innerHTML = topicDiv + textarea + testBtn + runResult;
		}
		else {
			div.innerHTML = topicDiv + textarea;
		}
		content.appendChild(div);
	}
	return content;
}

function showQues() {
	var content;
	switch(questionType[currentTypeNum]) {
		case "Multiple_Choice":
			content = showChoiceQues(totalQuestion["Multiple_Choice"], "radio");
			break;
		case "Multiple_Choices":
			content = showChoiceQues(totalQuestion["Multiple_Choices"], "checkbox");
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

function jsCodeTest() {
	var textarea = $(".Programming").find("textarea");
	var runResult = $(".runResult")[0];
	try {
		var n = eval("(" + textarea.val() + ")(2, 3)");
		if (n === 5) {
			runResult.innerHTML = "编译通过";
		}
		else {
			runResult.innerHTML = "编译结果不正确";
		}
	} catch(e) {
		runResult.innerHTML = e;
	}
}

function javaCodeTest() {
	var textarea = $(".Programming").find("textarea");
	$.ajax ({
		url: "http://127.0.0.1:3000/javaTest",
		type: "POST",
		crossDomain: true,
		defaultType: "json",
		data: {
			code: textarea.val()
		},
		success: function(result) {
			$(".runResult")[0].innerHTML = "<pre>" + result + "</pre>";
		},
		error: function(error) {
			console.log(error);
	});
}

function matchAnswer() {}

$(function() {
	$(".beginBtn").click(function() {
		$.ajax({
			url: window.location.href,
			type: "POST",
			crossDomain: true,
			defaultType: "json",
			success: function(result) {
				var data = JSON.parse(result);
				totalQuestion = data;
				for(var k in data) {
					questionType[questionType.length] = k;
					correctAnswer[k] = new Array();
					for(let i=0, len=data[k].length; i<len; i++) {
						correctAnswer[k][i] = data[k][i].answer;
					}
				}

				$(".beginBtn").css("display", "none");
				showQues();
				$(".questionBlock").css("display", "block");
			},
			error: function(error) {
				console.log(error);
			}
		});
	});

	$(".preview").click(function() {
		if (currentTypeNum === 0) {
			alert("当前已经是第一部分了");
			return;
		}

		if ($(".next").val() !== "next") {
			$(".next").val("next");
		}

		currentTypeNum --;
		var showBlock = $("." + questionType[currentTypeNum]);
		var hideBlock = $("." + questionType[currentTypeNum+1]);
		if (showBlock.length != 0) {
			$("." + questionType[currentTypeNum]).css("display", "block");
		}
		else {
			showQues();
		}
		hideBlock.css("display", "none");
	});

	$(".next").click(function() {
		if (currentTypeNum === questionType.length-1) {
			getUserAnswer();
			matchAnswer();
			return;
		}

		if (currentTypeNum === questionType.length-2) {
			$(".next").val("提交试卷");
		}

		currentTypeNum ++;
		var showBlock = $("." + questionType[currentTypeNum]);
		var hideBlock = $("." + questionType[currentTypeNum-1]);
		if (showBlock.length != 0) {
			$("." + questionType[currentTypeNum]).css("display", "block");
		}
		else {
			showQues();
		}
		hideBlock.css("display", "none");
	});
});