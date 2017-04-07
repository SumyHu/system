let type, index, typeArray = [], unitId;

let removePraticeArr = [];   // 记录被删除的习题

/** 显示所有选择型的题目内容
 * @param praticeIdArr Array 习题id集合
 * @param showType String 习题类型
*/
function showAllChoicesContent(praticeIdArr, showType) {
	let score;
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
				if (praticeType === "examination" && !score) {
					score = result.score;
				}

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

				section.id = praticeIdArr[i];

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

	if (praticeType === "examination") {
		$(".add" + showType + " > .showScore > .textInput").val(score);
	}
}

/** 显示所有填空题内容
 * @param praticeIdArr Array 习题id集合
*/
function showAllFillInTheBlankContent(praticeIdArr) {
	let score;
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
				if (praticeType === "examination" && !score) {
					score = result.score;
				}

				let section = addFillInTheBlank();

				section.id = praticeIdArr[i];

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

	if (praticeType === "examination") {
		$(".addFillInTheBlank > .showScore > .textInput").val(score);
	}
}

/** 显示所有简答题内容
 * @param praticeIdArr Array 习题id集合
*/
function showAllShortAnswerContent(praticeIdArr) {
	for(let i=0, len=praticeIdArr.length; i<len; i++) {
		findPraticesById(praticeIdArr[i], function(result) {
			console.log(result);
			let section = addShortAnswer();

			section.id = praticeIdArr[i];

			$(section).find(".topic > .textInput").val(result.topic);
			$(section).find(".answer > textarea").val(result.answer[0].content);

			console.log(result.answer[0]);

			let professionalNounsArr = result.answer[0].professionalNounsArr;
			if (professionalNounsArr) {
				for(let i=0, len=professionalNounsArr.length; i<len; i++) {
					let newDiv = addMoreProfessionalNouns($(section).find(".addProfessionalNouns .addProfessionalNounsBtn"));
					$(newDiv).find(".textInput").val(professionalNounsArr[i]);
				}
			}

			if (praticeType === "examination") {
				$(section).find(".showScore > .textInput").val(result.score);
			}
		});
	}
}

function showBasicSelectTypeInProgramming($selectInputTypeDiv, inputType) {
	console.log("inputType", inputType);
	let allRadio = $selectInputTypeDiv.find("> input[type=radio]");
	for(let i=0, len=allRadio.length; i<len; i++) {
		if (allRadio[i].value === inputType) {
			allRadio[i].checked = true;
			break;
		}
	}
}

function showSelectTypeInProgramming($selectInputTypeDiv, type) {
	let inputType = type.thisType, childType;
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

	let className = $section[0].className;
	let inputTypeDiv = $section.find(".inputType");

	if (objContent.type) {
		for(let i=0, len=objContent.type.length; i<len; i++) {
			let div = document.createElement("div");
			div.className = "selectInputType";
			div.innerHTML = selectInputType(selectInputTypeCount);
			$section.find(".addInputType").before(div);
			showSelectTypeInProgramming($(div), objContent.type[i]);
			selectInputTypeCount += 2;
		}
	}

	$section.find(".removeSelectType").click(function(e) {
		let selectInputType = $(getTarget(e)).parent();
		selectInputType.remove();
	});
}

/** 显示所有编程题内容
 * @param praticeIdArr Array 习题id集合
*/
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
				console.log(result);
				let section = addProgramming();

				section.id = praticeIdArr[i];

				$(section).find(".topic > .textInput").val(result.topic);

				showProgrammingObjContent(result.answer[0].input, $(section).find(".input"));
				showProgrammingObjContent(result.answer[0].output, $(section).find(".output"));

				let mode = result.answer[0].programmingTypeMode, modeIndex=0;
				for(var k in programmingTypeMode) {
					if (programmingTypeMode[k] === mode) {
						mode = k;
						break;
					}
					modeIndex++;
				}
				$(section).find(".programmingType > select").find("option")[modeIndex].selected = true;

				let helpMode = mode;
				if (helpMode === "c++") {
				 	helpMode = "cpp";
				 }
				 else if (helpMode === "c#") {
				 	helpMode = "cs";
				 }
				$(section).find(".help").attr("href", "help?mode=" + helpMode);

				if (praticeType === "examination") {
					$(section).find(".showScore > .textInput").val(result.score);
				}

				let answer = result.answer[0].content, editor = programingEditorArray[programingEditorArray.length-1].editor;

				$(section).find("textarea").val(answer);
				editor.setOption("mode", result.answer[0].programmingTypeMode);
				editor.setValue(answer);
				setTimeout(function() {
					editor.refresh();
					$(section).find("textarea").focus();
				}, 1);
			}
		});
	}
}

function selectInputType(count) {
	return basicInputType(count) + `<input type="radio" id="Array` + count + `" name="selectInputType` + count + `" value="Array"><label for="Array` + count + `">Array</label>`
		+ `<div class="arrayChildType">【数组类型：` + basicInputType(count+1, "array-", true) + `】</div><input type="button" value="X" class="removeSelectType">`;
}

/** 获取所要添加的选择题内容
 * @param $content Object 所要添加的全部content对象
*/
getChoiceContent = function($content) {
	if ($content.length === 0) return [];
	let allContent = [], type;

	let parentClassName = $content.parent()[0].className;
	if (parentClassName === "addSingleChoice" || parentClassName === "addTrueOrFalse") {
		type = "radio";
	}
	else {
		type = "checkbox";
	}

	let score;
	if (praticeType === "examination" && $content.length) {
		score = $content.parent().find(".showScore > .textInput").val();
		if (!score) {
			score = $content.parent().find(".showScore > .textInput")[0].placeholder;
		}
	}

	for(let i=0, len=$content.length; i<len; i++) {
		let topic = $($content[i]).find(".topic > .textInput").val();

		let allChoices = $($content[i]).find(".allChoices > .choice");
		let choiceArray = [], answer = [];
		for(let j=0, choiceLen=allChoices.length; j<choiceLen; j++) {
			choiceArray.push({
				num: $(allChoices[j]).find(".num")[0].innerHTML,
				choiceContent: $(allChoices[j]).find(".textInput").val()
			});

			if ($(allChoices[j]).find("input[type=" + type + "]")[0].checked) {
				answer.push(choiceArray[choiceArray.length-1].num);
			}
		}

		allContent.push({
			topic: topic,
			choices: choiceArray,
			answer: answer
		});

		if ($content[i].id) {
			allContent[allContent.length-1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			allContent[allContent.length-1].score = score;
		}
	}

	return allContent;
}

/** 获取所要添加的填空题内容
 * @param $content Object 所要添加的全部content对象
*/
function getFillInTheBlankContent($content) {
	let allContent = [];

	let score;
	if (praticeType === "examination"  && $content.length) {
		console.log($content);
		console.log($content.parent()[0]);
		score = $content.parent().find(".showScore > .textInput").val();
		if (!score) {
			score = $content.parent().find(".showScore > .textInput")[0].placeholder;
		}
	}

	for(let i=0, len=$content.length; i<len; i++) {
		let topic = $($content[i]).find(".topic > .textInput").val();

		let allBlank = $($content[i]).find(".allBlank > .blank");
		let answer = [];
		for(let j=0, blankLen=allBlank.length; j<blankLen; j++) {
			let textInput = $(allBlank[j]).find(".textInput");
			let answerChild = [];
			for(let t=0, textInputLen=textInput.length; t<textInputLen; t++) {
				answerChild.push(textInput[t].value);
			}
			answer.push(answerChild);
		}

		allContent.push({
			topic: topic,
			answer: answer
		});

		if ($content[i].id) {
			allContent[allContent.length-1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			allContent[allContent.length-1].score = score;
		}
	}

	return allContent;
}

/** 获取所要添加的简答题内容
 * @param $content Object 所要添加的全部content对象
*/
function getShortAnswerContent($content) {
	let allContent = [];

	for(let i=0, len=$content.length; i<len; i++) {
		let topic = $($content[i]).find(".topic > .textInput").val();

		let answer = $($content[i]).find(".answer > textarea").val();
		
		let professionalNounsArr = [], allProfessionalNouns = $($content[i]).find(".addProfessionalNouns .professionalNounsDiv");
		for(let i=0, len=allProfessionalNouns.length; i<len; i++) {
			professionalNounsArr.push($(allProfessionalNouns[i]).find(".textInput").val());
		}
		
		allContent.push({
			topic: topic,
			answer: [{
				content: answer,
				professionalNounsArr: professionalNounsArr
			}]
		});

		if ($content[i].id) {
			allContent[allContent.length-1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			let score = $($content[i]).find(".showScore > .textInput").val();
			if (!score) {
				score = $($content[i]).find(".showScore > .textInput")[0].placeholder;
			}

			allContent[allContent.length-1].score = score;
		}
	}

	return allContent;
}

/** 获取所要添加的编程题内容
 * @param $content Object 所要添加的全部content对象
*/
function getProgrammingContent($content) {
	let allContent = [];

	for(let i=0, len=$content.length; i<len; i++) {
		let topic = $($content[i]).find(".topic > .textInput").val();

		let inputObj = getProgrammingObj($($content[i]).find(".input")), outputObj = getProgrammingObj($($content[i]).find(".output"));

		console.log(inputObj, outputObj);

		let programmingType = $($content[i]).find(".answer .programmingType select").find("option:selected").text();
		let mode = programmingTypeMode[programmingType];

		let answer = programingEditorArray[i].editor.getValue();
		
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
			allContent[allContent.length-1].id = $content[i].id;
		}

		if (praticeType === "examination") {
			let score = $($content[i]).find(".showScore > .textInput").val();
			if (!score) {
				score = $($content[i]).find(".showScore > .textInput")[0].placeholder;
			}

			allContent[allContent.length-1].score = score;
		}
	}

	return allContent;
}

let commentRemovePratice = removePratice;
/** 删除题目
*/
removePratice = function($target) {
	console.log($target[0].id);
	commentRemovePratice($target);
	if ($target[0].id) {
		removePraticeArr.push({
			type: currentAddType,
			praticeId: $target[0].id
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
	}
	else {
		if (praticeType === "chapter") {
			$(".time")[0].innerHTML += " — 第 " + (Number(index)+1) +" 章";
		}
		else {
			$(".examinationTime").css("display", "block");
			$(".showScore").css("display", "block");
			$(".time")[0].innerHTML += " — 试卷 " + (Number(index)+1);
		}
	}

	praticeIdObj = {};
	findPraticesByType(praticeType, function(result) {
		if (index) {
			unitId = result[index];
		}
		else {
			unitId = result;
		}

		findUnitById(unitId, function(data) {
			if (data.time) {
				$(".examinationTime > .hours").val(data.time.hours);
				$(".examinationTime > .minutes").val(data.time.minutes);
				$(".examinationTime > .seconds").val(data.time.seconds);
			}

			if (type) {
				praticeIdObj[type] = data[type];
				currentAddType = type;
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

/** 将习题添加进数据库
 * @param contentObj Object 题目内容
 * contentObj = {
	SingleChoice: Array,    // 单选题内容
	MultipleChoices: Array,   // 多选题内容
	...
 }
*/
savePraticesInData = function(contentObj, totalCount, examinationTime) {
	console.log(contentObj);
	console.log(removePraticeArr);

	let randomUnitId;
	if (praticeType !== "random") {
		findSubjectByName(subjectName, function(result) {
			randomUnitId = result.randomPratices;
		});
	}

	for(var k in typeChiness) {
		console.log(k);
		let praticeArr = contentObj[k];
		for(let i=0, len=praticeArr.length; i<len; i++) {
			let praticeContent = praticeArr[i];
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
					success: function(result) {
						console.log(result);
					}
				});
			}
			else {
				(function(key) {
					addPratice(praticeContent, function(praticeId) {
						addPraticeInUnits({
							praticeType: key,
							praticeId: praticeId,
							unitId: unitId,
							callback: function(result) {
							}
						});

						if (randomUnitId) {
							addPraticeInUnits({
								praticeType: key,
								praticeId: praticeId,
								unitId: randomUnitId,
								callback: function(result) {
								}
							});
						}
					});
				})(k);
			}
		}
	}

	for(let i=0, len=removePraticeArr.length; i<len; i++) {
		callDataProcessingFn({
			data: {
				data: "pratices",
				callFunction: "remove",
				removeOpt: {
					_id: removePraticeArr[i].praticeId
				}
			},
			success: function() {}
		});

		let update = {};
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
			success: function() {}
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
				success: function() {}
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
		success: function() {}
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
					time: examinationTime
				}
			},
			success: function() {}
		});
	}
}