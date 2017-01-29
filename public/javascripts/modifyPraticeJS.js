let type, index, typeArray = [];

function showAllChoicesContent(praticeIdArr, showType) {
	for(let i=0, len=praticeIdArr.length; i<len; i++) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function(result) {
				let section, inputType = "radio";
				switch(showType) {
					case "SingleChoice":
						section = addSingleChoice();
						break;
					case "MultipleChoices":
						section = addMultipleChoices();
						inputType = "checkbox";
						break;
					case "TrueOrFalse":
						section = addTrueOrFalse();
						break;
				}

				$(section).find(".topic > .textInput").val(result.topic);

				let choices = result.choices;
				if (choices.length > 4) {
					for(let j=0, len1=choices.length-4; j<len1; j++) {
						addMoreChoice($(section).find(".allChoices"));
					}
				}

				let allChoicesDiv = $(section).find(".allChoices > .choice");
				for(let j=0, len1=choices.length; j<len1; j++) {
					$(allChoicesDiv[j]).find(".textInput").val(choices[j].choiceContent);
				}

				let allAnswer = result.answer;
				for(let j=0, len1=allAnswer.length; j<len1; j++) {
					let answerIndex;
					if (showType === "TrueOrFalse") {
						if (result.answer[0] === "T") {
							answerIndex = 0;
						}
						else {
							answerIndex = 1;
						}
					}
					else {
						answerIndex = result.answer[j].charCodeAt()-65;
					}
					$(section).find("input[type=" + inputType + "]")[answerIndex].checked = true;
				}
			}
		});
	}
}

function showAllFillInTheBlankContent(praticeIdArr) {
	for(let i=0, len=praticeIdArr.length; i<len; i++) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function(result) {
				let section = addFillInTheBlank();

				$(section).find(".topic > .textInput").val(result.topic);

				let allAnswer = result.answer;
				for(let j=0, len1=allAnswer.length; j<len1; j++) {
					let answer = allAnswer[j];
					if (j > 0) {
						addMoreBlank($(section).find(".allBlank"));
					}

					if (answer.length > 1) {
						for(let t=0, len2=answer.length-1; t<len2; t++) {
							addMoreOtherAnswer($($(section).find(".allBlank > .blank")[j]).find(".addOtherAnswer"));
						}
					}

					for(let t=0, len2=answer.length; t<len2; t++) {
						$($(section).find(".allBlank > .blank")[j]).find(".textInput")[t].value = answer[t];
					}
				}
			}
		});
	}
}

function showAllShortAnswerContent(praticeIdArr) {}

function showAllProgrammingContent(praticeIdArr) {
	for(let i=0, len=praticeIdArr.length; i<len; i++) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function(result) {
				let section = addProgramming();

				$(section).find(".topic > .textInput").val(result.topic);

				let mode = result.programmingTypeMode, modeIndex=0;
				for(var k in programmingTypeMode) {
					if (programmingTypeMode[k] === mode) {
						mode = k;
						break;
					}
					modeIndex++;
				}
				$(section).find(".programmingType > select").find("option")[modeIndex].selected = true;

				let answer = result.answer[0], editor = programingEditorArray[programingEditorArray.length-1];

				$(section).find("textarea").val(answer);
				editor.setOption("mode", result.programmingTypeMode);
				editor.setValue(answer);
				setTimeout(function() {
					editor.refresh();
					$(section).find("textarea").focus();
				}, 1);
			}
		});
	}
}

function init() {
	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");
	type = getValueInUrl("type");
	index = getValueInUrl("index");

	$(".time")[0].innerHTML = subjectName + " — " + praticeTypeChiness[praticeType];

	// 正确显示当前添加题目的title
	if (praticeType === "random") {
		$(".addPratice .title")[0].innerHTML = typeChiness[type];
	}
	else {
		if (praticeType === "chapter") {
			$(".addPratice .title")[0].innerHTML = "第 " + (Number(index)+1) +" 章";
		}
		else {
			$(".addPratice .title")[0].innerHTML = "试卷 " + (Number(index)+1);
		}
	}

	let unitId, praticeIdObj = {};
	findPraticesByType(praticeType, function(result) {
		if (index) {
			unitId = result[index];
		}
		else {
			unitId = result;
		}

		findUnitById(unitId, function(data) {
			if (type) {
				praticeIdObj[type] = data[type];
			}
			else {
				praticeIdObj = data;
			}

			for(var k in praticeIdObj) {
				switch(k) {
					case "SingleChoice":
					case "MultipleChoices":
					case "TrueOrFalse":
						showAllChoicesContent(praticeIdObj[k], k);
						break;
					case "FillInTheBlank":
						showAllFillInTheBlankContent(praticeIdObj[k]);
						break;
					case "ShortAnswer":
						showAllShortAnswerContent(praticeIdObj[k]);
						break;
					case "Programming":
						showAllProgrammingContent(praticeIdObj[k]);
						break;
				}
			}
		});
	});
}