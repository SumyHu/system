let editorCount = 0;

let changePraticeContentFn = changePraticeContent;
changePraticeContent = function(index) {
	changePraticeContentFn(index);
	if ($(".next").val() === "提交") {
		// $(".next").val(">");
		// $(".next").addClass("disable");
		$(".next").val("总分 →");
	}
}

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
	let logo = document.createElement("span");
	if ($studentSelectTarget.hasClass("correctChoiceBorder")) {
		logo.className = "correctLogo";
	}
	else {
		logo.className = "errorLogo";
	}
	$studentSelectTarget.append(logo);
}

/** 添加图标
 * @param classname String 添加的图标的类名
*/
function addLogo($target, classname) {
	let logo = document.createElement("span");
	logo.className = classname;
	$target.append(logo);
}

/** 添加得分情况详情的div
 * @param $target Object 添加div的对象
*/
function addShortScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	let div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' +
					'<div>你的答案：<span class="studentAnswer">' + studentAnswer + '</span></div>' +
					'<div>正确答案：<span class="correctAnswer">' + correctAnswer + '</span></div>';
	$target.append(div);
}
function addShortAnswerScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	let div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' +
					'<div>你的答案：<pre class="studentAnswer">' + studentAnswer + '</pre></div>' +
					'<div>正确答案：<pre class="correctAnswer">' + correctAnswer.replace(/[【】（\d*）{}]/g, "") + '</pre></div>';
	$target.append(div);
}
function addProgrammingScoreDetailDiv($target, score, studentAnswer, correctAnswer, mode) {
	let div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<span class="score">' + score + '</span></div>' +
					'<div>你的答案：<textarea id="studentAnswer' + editorCount + '"></textarea></div>' +
					'<div>正确答案：<textarea id="correctAnswer' + editorCount + '"></textarea></div>';
	$target.append(div);

	let editor1 = editorStyle("studentAnswer" + editorCount, mode);
	editor1.setValue(studentAnswer);
	editor1.setSize("auto", "auto");
	editor1.setOption("readOnly", true);
	setTimeout(function() {
		editor1.refresh();
	}, 1);

	let editor2 = editorStyle("correctAnswer" + editorCount, mode);
	editor2.setValue(correctAnswer);
	editor2.setSize("auto", "auto");
	editor2.setOption("readOnly", true);
	setTimeout(function() {
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
	for(var k in studentAnswerContent) {
		let allContent = $("." + k + " > .content"), answer = studentAnswerContent[k];
		switch(k) {
			case "SingleChoice":
				for(let i=0, len=allContent.length; i<len; i++) {
					if (answer[i][0]) {
						let answerIndex = answer[i][0].charCodeAt()-65;
						let $studentSelectTarget = $($(allContent[i]).find(".answer > div")[answerIndex]);
						$studentSelectTarget.find("input")[0].checked = true;
						addLogoInChoice($studentSelectTarget);
					}
				}
				break;
			case "MultipleChoices":
				for(let i=0, len=allContent.length; i<len; i++) {
					for(let j=0, len1=answer[i].length; j<len1; j++) {
						if (answer[i][j]) {
							let answerIndex = answer[i][j].charCodeAt()-65;
							let $studentSelectTarget = $($(allContent[i]).find(".answer > div")[answerIndex]);
							$studentSelectTarget.find("input")[0].checked = true;
							addLogoInChoice($studentSelectTarget);
						}
					}
				}
				break;
			case "TrueOrFalse":
				for(let i=0, len=allContent.length; i<len; i++) {
					if (answer[i][0]) {
						let answerIndex = (answer[i][0] === "T" ? 0 : 1);
						let $studentSelectTarget = $($(allContent[i]).find(".answer > div")[answerIndex]);
						$studentSelectTarget.find("input")[0].checked = true;
						addLogoInChoice($studentSelectTarget);
					}
				}
				break;
			case "FillInTheBlank":
				$(".answerBlock").css("display", "block");

				let correctAnswer = correctAnswerContent[k].answer;
				for(let i=0, len=allContent.length; i<len; i++) {
					for(let j=0, len1=answer[i].length; j<len1; j++) {
						let $target = $($(allContent[i]).find(".answer > div")[j]);
						$target.find(".textInput").val(answer[i][j]);

						let thisCorrectAnswer = correctAnswer[i][j], logoClassName;
						for(let t=0, len=thisCorrectAnswer.length; t<len; t++) {
							if (thisCorrectAnswer[t] === answer[i][j]) {
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
				for(let i=0, len=allContent.length; i<len; i++) {
					$(allContent[i]).find(".answer > textarea").val(answer[i]);
				}
				break;
			case "Programming":
				for(let i=0, len=allContent.length; i<len; i++) {
					programingEditorArray[i].editor.setValue(answer[i]);
					programingEditorArray[i].editor.setOption("readOnly", true);
				}
				break;
		}
	}
}

function showCorrectAnswer(result) {
	console.log(result);
	let correctAnswerContent = result.correctAnswerContent, studentAnswerContent = result.studentAnswerContent, scoresObj = result.scoresObj;
	for(var k in correctAnswerContent) {
		let allContent = $("." + k + " > .content"), answer = correctAnswerContent[k].answer, studentAnswer = studentAnswerContent[k];
		switch(k) {
			case "SingleChoice":
				for(let i=0, len=allContent.length; i<len; i++) {
					let answerIndex = answer[i][0].charCodeAt()-65;
					$($(allContent[i]).find(".answer > div")[answerIndex]).addClass("correctChoiceBorder");
					addShortScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i][0], answer[i][0]);
				}
				break;
			case "MultipleChoices":
				for(let i=0, len=allContent.length; i<len; i++) {
					for(let j=0, len1=answer[i].length; j<len1; j++) {
						let answerIndex = answer[i][j].charCodeAt()-65;
						$($(allContent[i]).find(".answer > div")[answerIndex]).addClass("correctChoiceBorder");
					}
					addShortScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i].join(","), answer[i].join(","));
				}
				break;
			case "TrueOrFalse":
				for(let i=0, len=allContent.length; i<len; i++) {
					let answerIndex = (answer[i][0] === "T" ? 0 : 1);
					$($(allContent[i]).find(".answer > div")[answerIndex]).addClass("correctChoiceBorder");
					addShortScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i][0], answer[i][0]);
				}
				break;
			case "FillInTheBlank":
				for(let i=0, len=allContent.length; i<len; i++) {
					addShortScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i][0], answer[i].join("或"));
				}
				break;
			case "ShortAnswer":
				for(let i=0, len=allContent.length; i<len; i++) {
					let sentence1 = studentAnswer[i], sentence2 = correctAnswerContent[k][i].answer[0].content, scores = scoresObj[k],
						professionalNounsArr = correctAnswerContent[k][i].answer[0].professionalNounsArr;
					$.ajax({
						url: "../findTheSameWordInTwoSentence",
						type: "POST",
						data: {
							sentence1: sentence1,
							sentence2: sentence2,
							professionalNounsArr: professionalNounsArr
						},
						success: function(result) {
							let theSameWordArr1 = result.theSameWordArr1, theSameWordArr2 = result.theSameWordArr2;
							console.log(theSameWordArr1, theSameWordArr2, sentence1, sentence2);
							for(let i=0, len=theSameWordArr1.length; i<len; i++) {
								sentence1 = sentence1.replace(new RegExp(theSameWordArr1[i], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							for(let i=0, len=theSameWordArr2.length; i<len; i++) {
								sentence2 = sentence2.replace(new RegExp(theSameWordArr2[i], "ig"), "<span style='background: yellow;'>$&</span>");
							}
							addShortAnswerScoreDetailDiv($(allContent[i]), scores[i], sentence1, sentence2);
						}
					});
					// addShortAnswerScoreDetailDiv($(allContent[i]), scoresObj[k][i], sentence1, sentence2);
				}
				break;
			case "Programming":
				if (studentAnswer) {
					for(let i=0, len=allContent.length; i<len; i++) {
						let thisAnswerObj = correctAnswerContent[k][i].answer[0];
						addProgrammingScoreDetailDiv($(allContent[i]), scoresObj[k][i], studentAnswer[i], thisAnswerObj.content, thisAnswerObj.programmingTypeMode);
					}
				}
				break;
		}
	}
}

function init() {
	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	type = getValueInUrl("type");

	findSubjectByName(subjectName, function(result) {
		let unitId = result[praticeType+"Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
			if (type) {
				allPraticeContent = data[type];

				switch(type) {
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
			}
			else {
				for(let i=0, len=praticeTypeArr.length; i<len; i++) {
					let length = data[praticeTypeArr[i]].length;
					if (length > 0) {
						switch(praticeTypeArr[i]) {
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
						}
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
		success: function(result) {
			soThatAnswerCanNotBeChange();
			showCorrectAnswer(result);
			showStudentAnswer(result.studentAnswerContent, result.correctAnswerContent);
		}
	});
}

bindEvent = function() {
	// 当为考试模拟时，点击练习类型事件
	$(".showPraticeBlockIndex").click(function(e) {
		let className = getTarget(e).className;
		if ($("." + className.substr(0, className.length-5)).length > 0) {
			type = className.substr(0, className.length-5);
			changeTypeStyle();
			addPraticeIndex(currentIndexArray[type].length);
			changePraticeContent(currentIndexArray[type].index);
		}
	});

	// 点击题目编号事件
	$(".showPraticeIndex").click(function(e) {
		if (Number(getTarget(e).innerHTML)) {
			let index = getTarget(e).innerHTML-1;
			currentIndexArray[type].index = index;
			changePraticeContent(index);
		}
	});

	$(".previous").click(function() {
		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

		if ($(this).hasClass("disable")) return;

		if (currentIndexArray[type].index === 0) {
			for(let i=0, len=hasContentTypeArr.length; i<len; i++) {
				if (hasContentTypeArr[i] === type) {
					if (i !== 0) {
						type = hasContentTypeArr[--i];
						changeTypeStyle();
						addPraticeIndex(currentIndexArray[type].length);
						currentIndexArray[type].index = currentIndexArray[type].length-1;
						changePraticeContent(currentIndexArray[type].index);
					}
					return;
				}
			}
		}

		changePraticeContent(--currentIndexArray[type].index);
	});

	$(".runningBtn").click(function(e) {
		let $target = $(getTarget(e));
		if (!$target.hasClass("disable")) {
			// changeRunningBtnToDisableStatus($target, 15000);
			$target.addClass("disable");
			runningProgramming($(getTarget(e)).parent());
		}
	});

	$(".next").click(function() {
		if (this.value === "总分 →") {
			console.log(decodeURIComponent(getValueInUrl("showScore")));
			window.location.href = decodeURIComponent(getValueInUrl("showScore"));
			return;
		}

		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

		if ($(this).hasClass("disable")) return;

		if (currentIndexArray[type].index === currentIndexArray[type].length-1) {
			for(let i=0, len=hasContentTypeArr.length; i<len; i++) {
				if (hasContentTypeArr[i] === type) {
					type = hasContentTypeArr[++i];
					changeTypeStyle();
					addPraticeIndex(currentIndexArray[type].length);
					currentIndexArray[type].index = 0;
					changePraticeContent(0);
					return;
				}
			}
		}

		changePraticeContent(++currentIndexArray[type].index);
	});
}