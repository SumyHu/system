let testId;   // 保存此测试结果的id

// 令答案不可更改
function soThatAnswerCanNotBeChange() {
	$("textarea").attr("readOnly", true);
}

function showCorrectAnswer(result) {
	console.log(result);
	let correctAnswerContent = result.correctAnswerContent, studentAnswerContent = result.studentAnswerContent, scoresObj = result.scoresObj;
	for(var k in correctAnswerContent) {
		let allContent = $("." + k + " > .content"), answer = correctAnswerContent[k].answer, studentAnswer = studentAnswerContent[k];
		switch(k) {
			case "ShortAnswer":
				for(let i=0, len=allContent.length; i<len; i++) {
					console.log(scoresObj[k]);
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
		}
	}
}

function addShortAnswerScoreDetailDiv($target, score, studentAnswer, correctAnswer) {
	let div = document.createElement("div");
	div.className = "showScoreDetails";
	div.innerHTML = '<div>本题得分：<input type="text" class="score" value=' + score + '></div>'
					+'<div>你的答案：<pre class="studentAnswer">' + studentAnswer 
					+ '</pre></div>' + '<div>正确答案：<pre class="correctAnswer">' 
					+ correctAnswer.replace(/[【】（\d*.\d*）{}]/g, "") + '</pre></div>';
	$target.append(div);
}

/** 在题目答案框中显示考生答案
 * @param studentAnswerContent Object 考生答案
 * studentAnswerContent = {
	ShortAnswer: Array
 }
*/
function showStudentAnswer(studentAnswerContent, correctAnswerContent) {
	for(var k in studentAnswerContent) {
		let allContent = $("." + k + " > .content"), answer = studentAnswerContent[k];
		switch(k) {
			case "ShortAnswer":
				for(let i=0, len=allContent.length; i<len; i++) {
					$(allContent[i]).find(".answer > textarea").val(answer[i]);
				}
				break;
		}
	}
}

let changePraticeContentFn = changePraticeContent;
changePraticeContent = function(index) {
	changePraticeContentFn(index);
	if ($(".next").val() === "提交") {
		$(".next").val("完成");
	}
}

function init() {
	praticeType = "examination";

	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	selectIndex = getValueInUrl("index");
	type = "ShortAnswer";

	findSubjectByName(subjectName, function(result) {
		let unitId = result["examinationPratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
			let allPraticeContent = data[type];
			console.log(data);
			addNotChoicePratices(allPraticeContent, type);

			hasContentTypeArr.push(type)

			currentIndexArray[type] = {
				index: 0,
				length: allPraticeContent.length
			}
			addPraticeBlockIndex();
			addPraticeIndex(currentIndexArray[type].length);
			changePraticeContent(currentIndexArray[type].index);
		});
	});

	$.ajax({
		url: "../scoresDetail",
		type: "GET",
		success: function(result) {
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
	$(".showPraticeIndex").click(function(e) {
		if (Number(getTarget(e).innerHTML)) {
			let index = getTarget(e).innerHTML-1;
			currentIndexArray[type].index = index;
			changePraticeContent(index);
		}
	});

	$(".previous").click(function() {
		previousClick(this);
	});

	$(".next").click(function() {
		if (this.value === "完成") {
			let scoresArray = [], ShortAnswerTotalScores = 0, allScoresInput = $("input.score");
			for(let i=0, len=allScoresInput.length; i<len; i++) {
				let thisScore = allScoresInput[i].value;
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
				success: function(result) {
					let scoresObj = result.scoresObj,
						scoresDetail = result.scoresDetail
						oldShortAnswerTotalScores = scoresDetail.details["简答题"],
						totalScores = scoresDetail.totalScore;
					scoresObj.ShortAnswer = scoresArray;
					scoresDetail.details["简答题"] = ShortAnswerTotalScores;
					scoresDetail.totalScore = totalScores-oldShortAnswerTotalScores+Number(ShortAnswerTotalScores);

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
						success: function() {
							let subjectName = decodeURIComponent(getValueInUrl("subjectName")), 
								index = getValueInUrl("index");
							window.location.href = "../testResultsManage?testName=" + (subjectName+" | 试卷"+(Number(index)+1));
						}
					});
				}
			});
		}
		else {
			nextClick(this);
		}
	});
}