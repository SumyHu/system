"use strict";

var type = void 0,
    index = void 0,
    typeArray = [],
    unitId = void 0;

var removePraticeArr = []; // 记录被删除的习题

/** 显示所有选择型的题目内容
 * @param praticeIdArr Array 习题id集合
 * @param showType String 习题类型
*/
function showAllChoicesContent(praticeIdArr, showType) {
	var score = void 0;

	var _loop = function _loop(i, len) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function success(result) {
				if (praticeType === "examination" && !score) {
					score = result.score;
				}

				var section = void 0,
				    inputType = "radio";
				switch (showType) {
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

				section.id = praticeIdArr[i];

				$(section).find(".topic > .textInput").val(result.topic);

				var choices = result.choices;
				if (choices.length > 4) {
					for (var j = 0, len1 = choices.length - 4; j < len1; j++) {
						addMoreChoice($(section).find(".allChoices"));
					}
				}

				var allChoicesDiv = $(section).find(".allChoices > .choice");
				for (var _j = 0, _len = choices.length; _j < _len; _j++) {
					$(allChoicesDiv[_j]).find(".textInput").val(choices[_j].choiceContent);
				}

				var allAnswer = result.answer;
				for (var _j2 = 0, _len2 = allAnswer.length; _j2 < _len2; _j2++) {
					var answerIndex = void 0;
					if (showType === "TrueOrFalse") {
						if (result.answer[0] === "T") {
							answerIndex = 0;
						} else {
							answerIndex = 1;
						}
					} else {
						answerIndex = result.answer[_j2].charCodeAt() - 65;
					}
					$(section).find("input[type=" + inputType + "]")[answerIndex].checked = true;
				}
			}
		});
	};

	for (var i = 0, len = praticeIdArr.length; i < len; i++) {
		_loop(i, len);
	}

	if (praticeType === "examination") {
		$(".add" + showType + " > .showScore > .textInput").val(score);
	}
}

/** 显示所有填空题内容
 * @param praticeIdArr Array 习题id集合
*/
function showAllFillInTheBlankContent(praticeIdArr) {
	var score = void 0;

	var _loop2 = function _loop2(i, len) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function success(result) {
				if (praticeType === "examination" && !score) {
					score = result.score;
				}

				var section = addFillInTheBlank();

				section.id = praticeIdArr[i];

				$(section).find(".topic > .textInput").val(result.topic);

				var allAnswer = result.answer;
				for (var j = 0, len1 = allAnswer.length; j < len1; j++) {
					var answer = allAnswer[j];
					if (j > 0) {
						addMoreBlank($(section).find(".allBlank"));
					}

					if (answer.length > 1) {
						for (var t = 0, len2 = answer.length - 1; t < len2; t++) {
							addMoreOtherAnswer($($(section).find(".allBlank > .blank")[j]).find(".addOtherAnswer"));
						}
					}

					for (var _t = 0, _len3 = answer.length; _t < _len3; _t++) {
						$($(section).find(".allBlank > .blank")[j]).find(".textInput")[_t].value = answer[_t];
					}
				}
			}
		});
	};

	for (var i = 0, len = praticeIdArr.length; i < len; i++) {
		_loop2(i, len);
	}

	if (praticeType === "examination") {
		$(".addFillInTheBlank > .showScore > .textInput").val(score);
	}
}

/** 显示所有简答题内容
 * @param praticeIdArr Array 习题id集合
*/
function showAllShortAnswerContent(praticeIdArr) {
	var _loop3 = function _loop3(i, len) {
		findPraticesById(praticeIdArr[i], function (result) {
			console.log(result);
			var section = addShortAnswer();

			section.id = praticeIdArr[i];

			$(section).find(".topic > .textInput").val(result.topic);
			$(section).find(".answer > textarea").val(result.answer[0].content);

			console.log(result.answer[0]);

			var professionalNounsArr = result.answer[0].professionalNounsArr;
			if (professionalNounsArr) {
				for (var _i = 0, _len4 = professionalNounsArr.length; _i < _len4; _i++) {
					var newDiv = addMoreProfessionalNouns($(section).find(".addProfessionalNouns .addProfessionalNounsBtn"));
					$(newDiv).find(".textInput").val(professionalNounsArr[_i]);
				}
			}

			if (praticeType === "examination") {
				$(section).find(".showScore > .textInput").val(result.score);
			}
		});
	};

	for (var i = 0, len = praticeIdArr.length; i < len; i++) {
		_loop3(i, len);
	}
}

function showBasicSelectTypeInProgramming($selectInputTypeDiv, inputType) {
	console.log("inputType", inputType);
	var allRadio = $selectInputTypeDiv.find("> input[type=radio]");
	for (var i = 0, len = allRadio.length; i < len; i++) {
		if (allRadio[i].value === inputType) {
			allRadio[i].checked = true;
			break;
		}
	}
}

function showSelectTypeInProgramming($selectInputTypeDiv, type) {
	var inputType = type.thisType,
	    childType = void 0;
	showBasicSelectTypeInProgramming($selectInputTypeDiv, inputType);

	if (type.childType) {
		childType = type.childType;
		$selectInputTypeDiv.find(".arrayChildType").css("display", "inline-block");

		showBasicSelectTypeInProgramming($selectInputTypeDiv.find(".arrayChildType"), childType);
	}
}

function showProgrammingObjContent(objContent, $section) {
	$section.find(".description > .textInput").val(objContent.description);
	$section.find(".example > .textInput").val(objContent.example);

	var className = $section[0].className;
	var inputTypeDiv = $section.find(".inputType");

	if (objContent.type) {
		for (var i = 0, len = objContent.type.length; i < len; i++) {
			var div = document.createElement("div");
			div.className = "selectInputType";
			div.innerHTML = selectInputType(selectInputTypeCount);
			$section.find(".addInputType").before(div);
			showSelectTypeInProgramming($(div), objContent.type[i]);
			selectInputTypeCount += 2;
		}
	}

	$section.find(".removeSelectType").click(function (e) {
		var selectInputType = $(getTarget(e)).parent();
		selectInputType.remove();
	});
}

/** 显示所有编程题内容
 * @param praticeIdArr Array 习题id集合
*/
function showAllProgrammingContent(praticeIdArr) {
	var _loop4 = function _loop4(i, len) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "find",
				findOpt: {
					_id: praticeIdArr[i]
				}
			},
			success: function success(result) {
				console.log(result);
				var section = addProgramming();

				section.id = praticeIdArr[i];

				$(section).find(".topic > .textInput").val(result.topic);

				showProgrammingObjContent(result.answer[0].input, $(section).find(".input"));
				showProgrammingObjContent(result.answer[0].output, $(section).find(".output"));

				var mode = result.answer[0].programmingTypeMode,
				    modeIndex = 0;
				for (var k in programmingTypeMode) {
					if (programmingTypeMode[k] === mode) {
						mode = k;
						break;
					}
					modeIndex++;
				}
				$(section).find(".programmingType > select").find("option")[modeIndex].selected = true;

				var helpMode = mode;
				if (helpMode === "c++") {
					helpMode = "cpp";
				} else if (helpMode === "c#") {
					helpMode = "cs";
				}
				$(section).find(".help").attr("href", "help?mode=" + helpMode);

				if (praticeType === "examination") {
					$(section).find(".showScore > .textInput").val(result.score);
				}

				var answer = result.answer[0].content,
				    editor = programingEditorArray[programingEditorArray.length - 1].editor;

				$(section).find("textarea").val(answer);
				editor.setOption("mode", result.answer[0].programmingTypeMode);
				editor.setValue(answer);
				setTimeout(function () {
					editor.refresh();
					$(section).find("textarea").focus();
				}, 1);
			}
		});
	};

	for (var i = 0, len = praticeIdArr.length; i < len; i++) {
		_loop4(i, len);
	}
}

function selectInputType(count) {
	return basicInputType(count) + "<input type=\"radio\" id=\"Array" + count + "\" name=\"selectInputType" + count + "\" value=\"Array\"><label for=\"Array" + count + "\">Array</label>" + "<div class=\"arrayChildType\">\u3010\u6570\u7EC4\u7C7B\u578B\uFF1A" + basicInputType(count + 1, "array-", true) + "\u3011</div><input type=\"button\" value=\"X\" class=\"removeSelectType\">";
}

/** 获取所要添加的选择题内容
 * @param $content Object 所要添加的全部content对象
*/
getChoiceContent = function getChoiceContent($content) {
	if ($content.length === 0) return [];
	var allContent = [],
	    type = void 0;

	var parentClassName = $content.parent()[0].className;
	if (parentClassName === "addSingleChoice" || parentClassName === "addTrueOrFalse") {
		type = "radio";
	} else {
		type = "checkbox";
	}

	var score = void 0;
	if (praticeType === "examination" && $content.length) {
		score = $content.parent().find(".showScore > .textInput").val();
		if (!score) {
			score = $($content.parent().find(".showScore > .textInput")[0]).attr("placeholder");
		}
	}

	for (var i = 0, len = $content.length; i < len; i++) {
		var topic = $($content[i]).find(".topic > .textInput").val();

		var allChoices = $($content[i]).find(".allChoices > .choice");
		var choiceArray = [],
		    answer = [];
		for (var j = 0, choiceLen = allChoices.length; j < choiceLen; j++) {
			choiceArray.push({
				num: $(allChoices[j]).find(".num")[0].innerHTML,
				choiceContent: $(allChoices[j]).find(".textInput").val()
			});

			if ($(allChoices[j]).find("input[type=" + type + "]")[0].checked) {
				answer.push(choiceArray[choiceArray.length - 1].num);
			}
		}

		allContent.push({
			topic: topic,
			choices: choiceArray,
			answer: answer
		});

		if ($content[i].id) {
			allContent[allContent.length - 1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			allContent[allContent.length - 1].score = score;
		}
	}

	return allContent;
};

/** 获取所要添加的填空题内容
 * @param $content Object 所要添加的全部content对象
*/
function getFillInTheBlankContent($content) {
	var allContent = [];

	var score = void 0;
	if (praticeType === "examination" && $content.length) {
		console.log($content);
		console.log($content.parent()[0]);
		score = $content.parent().find(".showScore > .textInput").val();
		if (!score) {
			score = $($content.parent().find(".showScore > .textInput")[0]).attr("placeholder");
		}
	}

	for (var i = 0, len = $content.length; i < len; i++) {
		var topic = $($content[i]).find(".topic > .textInput").val();

		var allBlank = $($content[i]).find(".allBlank > .blank");
		var answer = [];
		for (var j = 0, blankLen = allBlank.length; j < blankLen; j++) {
			var textInput = $(allBlank[j]).find(".textInput");
			var answerChild = [];
			for (var t = 0, textInputLen = textInput.length; t < textInputLen; t++) {
				answerChild.push(textInput[t].value);
			}
			answer.push(answerChild);
		}

		allContent.push({
			topic: topic,
			answer: answer
		});

		if ($content[i].id) {
			allContent[allContent.length - 1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			allContent[allContent.length - 1].score = score;
		}
	}

	return allContent;
}

/** 获取所要添加的简答题内容
 * @param $content Object 所要添加的全部content对象
*/
function getShortAnswerContent($content) {
	var allContent = [];

	for (var i = 0, len = $content.length; i < len; i++) {
		var topic = $($content[i]).find(".topic > .textInput").val();

		var answer = $($content[i]).find(".answer > textarea").val();

		var professionalNounsArr = [],
		    allProfessionalNouns = $($content[i]).find(".addProfessionalNouns .professionalNounsDiv");
		for (var _i2 = 0, _len5 = allProfessionalNouns.length; _i2 < _len5; _i2++) {
			professionalNounsArr.push($(allProfessionalNouns[_i2]).find(".textInput").val());
		}

		allContent.push({
			topic: topic,
			answer: [{
				content: answer,
				professionalNounsArr: professionalNounsArr
			}]
		});

		if ($content[i].id) {
			allContent[allContent.length - 1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			var score = $($content[i]).find(".showScore > .textInput").val();
			if (!score) {
				score = $($($content[i]).find(".showScore > .textInput")[0]).attr("placeholder");
			}

			allContent[allContent.length - 1].score = score;
		}
	}

	return allContent;
}

/** 获取所要添加的编程题内容
 * @param $content Object 所要添加的全部content对象
*/
function getProgrammingContent($content) {
	var allContent = [];

	for (var i = 0, len = $content.length; i < len; i++) {
		var topic = $($content[i]).find(".topic > .textInput").val();

		var inputObj = getProgrammingObj($($content[i]).find(".input")),
		    outputObj = getProgrammingObj($($content[i]).find(".output"));

		console.log(inputObj, outputObj);

		var programmingType = $($content[i]).find(".answer .programmingType select").find("option:selected").text();
		var mode = programmingTypeMode[programmingType];

		var answer = programingEditorArray[i].editor.getValue();

		allContent.push({
			topic: topic,
			// programmingTypeMode: mode,
			answer: [{
				input: inputObj,
				output: outputObj,
				content: answer,
				programmingTypeMode: mode
			}]
		});

		if ($content[i].id) {
			allContent[allContent.length - 1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			var score = $($content[i]).find(".showScore > .textInput").val();
			if (!score) {
				score = $($($content[i]).find(".showScore > .textInput")[0]).attr("placeholder");
			}

			allContent[allContent.length - 1].score = score;
		}
	}

	return allContent;
}

var commentRemovePratice = removePratice;
/** 删除题目
*/
removePratice = function removePratice($target) {
	console.log($target[0].id);
	commentRemovePratice($target);
	if ($target[0].id) {
		removePraticeArr.push({
			type: currentAddType,
			praticeId: $target[0].id
		});
	}
};

function init() {
	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	praticeType = getValueInUrl("praticeType");
	type = getValueInUrl("type");
	index = getValueInUrl("index");

	$(".time")[0].innerHTML = subjectName + " — " + praticeTypeChiness[praticeType];

	// 正确显示当前添加题目的title
	if (praticeType === "random") {
		$(".time")[0].innerHTML += " — " + typeChiness[type];
		$(".navContent > div").css("display", "none");
		$(".navContent > ." + type).css("display", "block");
		$(".navContent > ." + type).css("background", "rgba(249, 90, 78, 0.8)");
		$(".addPraticeContent > section").css("display", "none");
		$(".addPraticeContent > .add" + type).css("display", "block");
		// $(".previous").css("display", "none");
		// $(".flip").css("width", "60px");
		// $(".next").css("width", "60px");
		// $(".next").val("提交");
	} else {
		if (praticeType === "chapter") {
			$(".time")[0].innerHTML += " — 第 " + (Number(index) + 1) + " 章";
		} else {
			$(".existTime").css("display", "block");
			$(".examinationTime").css("display", "block");
			$(".showScore").css("display", "block");
			$(".time")[0].innerHTML += " — 试卷 " + (Number(index) + 1);
		}
	}

	var praticeIdObj = {};
	findPraticesByType(praticeType, function (result) {
		if (index) {
			unitId = result[index];
		} else {
			unitId = result;
		}

		findUnitById(unitId, function (data) {
			if (data.effectiveTime) {
				var effectiveTime = data.effectiveTime,
				    beginTime = effectiveTime.beginTime,
				    endTime = effectiveTime.endTime;
				if (beginTime) {
					beginTime = new Date(beginTime);
					$(".beginTime .year").val(beginTime.getFullYear());
					$(".beginTime .month").val(Number(beginTime.getMonth() + 1));
					$(".beginTime .day").val(beginTime.getDate());
					$(".beginTime .H").val(beginTime.getHours());
					$(".beginTime .M").val(beginTime.getMinutes());
					$(".beginTime .S").val(beginTime.getSeconds());
				}

				if (endTime) {
					endTime = new Date(endTime);
					$(".endTime .year").val(endTime.getFullYear());
					$(".endTime .month").val(Number(endTime.getMonth() + 1));
					$(".endTime .day").val(endTime.getDate());
					$(".endTime .H").val(endTime.getHours());
					$(".endTime .M").val(endTime.getMinutes());
					$(".endTime .S").val(endTime.getSeconds());
				}
			}

			if (data.time) {
				$(".examinationTime > .hours").val(data.time.hours);
				$(".examinationTime > .minutes").val(data.time.minutes);
				$(".examinationTime > .seconds").val(data.time.seconds);
			}

			if (type) {
				praticeIdObj[type] = data[type];
				currentAddType = type;
			} else {
				praticeIdObj = data;
			}

			for (var k in praticeIdObj) {
				switch (k) {
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

/** 将习题添加进数据库
 * @param contentObj Object 题目内容
 * contentObj = {
	SingleChoice: Array,    // 单选题内容
	MultipleChoices: Array,   // 多选题内容
	...
 }
*/
savePraticesInData = function savePraticesInData(contentObj, totalCount, examinationTime, existTime) {
	console.log(contentObj);
	console.log(removePraticeArr);

	var randomUnitId = void 0;
	if (praticeType !== "random") {
		findSubjectByName(subjectName, function (result) {
			randomUnitId = result.randomPratices;
		});
	}

	for (var k in typeChiness) {
		console.log(k);
		var praticeArr = contentObj[k];

		var _loop5 = function _loop5(i, len) {
			var praticeContent = praticeArr[i];
			console.log(praticeContent.answer);
			if (praticeContent.id) {
				callDataProcessingFn({
					data: {
						data: "pratices",
						callFunction: "update",
						updateOpt: {
							_id: praticeContent.id
						},
						operation: "set",
						update: {
							topic: praticeContent.topic,
							choices: praticeContent.choices,
							answer: praticeContent.answer,
							score: praticeContent.score
						}
					},
					success: function success(result) {
						console.log(result);
					}
				});
			} else {
				(function (key) {
					addPratice(praticeContent, function (praticeId) {
						addPraticeInUnits({
							praticeType: key,
							praticeId: praticeId,
							unitId: unitId,
							callback: function callback(result) {}
						});

						if (randomUnitId) {
							addPraticeInUnits({
								praticeType: key,
								praticeId: praticeId,
								unitId: randomUnitId,
								callback: function callback(result) {}
							});
						}
					});
				})(k);
			}
		};

		for (var i = 0, len = praticeArr.length; i < len; i++) {
			_loop5(i, len);
		}
	}

	for (var i = 0, len = removePraticeArr.length; i < len; i++) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "remove",
				removeOpt: {
					_id: removePraticeArr[i].praticeId
				}
			},
			success: function success() {}
		});

		var update = {};
		update[removePraticeArr[i].type] = removePraticeArr[i].praticeId;
		console.log(update);
		callDataProcessingFn({
			data: {
				data: "units",
				callFunction: "update",
				updateOpt: {
					_id: unitId
				},
				operation: "pull",
				update: update
			},
			success: function success() {}
		});

		if (randomUnitId) {
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
	}

	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "update",
			updateOpt: {
				subjectName: subjectName
			},
			operation: "set",
			update: {
				updateTime: new Date().toLocaleString()
			}
		},
		success: function success() {}
	});

	if (examinationTime) {
		callDataProcessingFn({
			data: {
				data: "units",
				callFunction: "update",
				updateOpt: {
					_id: unitId
				},
				operation: "set",
				update: {
					time: examinationTime,
					effectiveTime: existTime
				}
			},
			success: function success() {}
		});
	}
};