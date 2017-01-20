let currentAddType = "SingleChoice";

let subjectName, praticeType;

let addSingleChoiceCount = 0, addMultipleChoicesCount = 0, addTrueOrFalseCount = 0,
	addFillInTheBlankCount = 0, addShortAnswerCount = 0, addProgrammingCount = 0;

function addSingleChoice() {
	addSingleChoiceCount++;
	let name = "singleChoice" + addSingleChoiceCount;
	let content = `<div class="topic">题目` + addSingleChoiceCount + `：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num">A.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `" checked>
						</div>
						<div class="choice">
							<span class="num">B.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
						<div class="choice">
							<span class="num">C.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
						<div class="choice">
							<span class="num">D.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
					</div>
					<input type="button" value="添加选项" class="addChoiceBtn">`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addSingleChoice").append(section);
}

function addMultipleChoices() {
	addMultipleChoicesCount++;
	let content = `<div class="topic">题目` + addMultipleChoicesCount 
					+ `：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num">A.</span>
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">B.</span>
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">C.</span>
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">D.</span>
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
					</div>
					<input type="button" value="添加选项" class="addChoiceBtn">`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addMultipleChoices").append(section);
}

function addTrueOrFalse() {
	addTrueOrFalseCount++;
	let name = "trueOrFalse" + addTrueOrFalseCount;
	let content = `<div class="topic">题目` + addTrueOrFalseCount + 
					`：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num true">T.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `" checked>
						</div>
						<div class="choice">
							<span class="num false">F.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
					</div>`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addTrueOrFalse").append(section);
}

function addFillInTheBlank() {
	addFillInTheBlankCount++;
	let content = `<div class="topic">题目` + addFillInTheBlankCount + 
					`：<input type="text" class="textInput"></div>
					<div class="allBlank">
						<div class="blank">
							<span class="num">1.</span>
							<input type="text" class="textInput">
							<input type="button" value="+" class="addOtherAnswer">
						</div>
					</div>
					<input type="button" value="添加答案" class="addBlankBtn">`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addFillInTheBlank").append(section);
}

function addShortAnswer() {
	// addShortAnswerCount++;
	// let name = "trueOrFalse" + addShortAnswerCount;
	// let content = ``;

	// let section = document.createElement("section");
	// section.className = "content";
	// section.innerHTML = content;
	// $(".addShortAnswerCount").append(section);
}

function addProgramming() {
	addProgrammingCount++;
	let content = `<div class="topic">题目` + addProgrammingCount + 
					`：<input type="text" class="textInput"></div>
					<div class="answer">
						答案：<textarea></textarea>
					</div>`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addProgramming").append(section);
}

function getAllExercise(callback) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "find",
			findOpt: {
				subjectName: subjectName
			}
		},
		success: function(data) {
			try {
				callback(data.pratice[praticeType]);
			} catch(e) {
				callback();
			}
		}
	});
}

function showSomePraticeType(praticeType) {
	if (praticeType === "Programming") {
		$(".next").css("width", "60px");
		$(".next").val("提交");
	}
	else {
		$(".next").css("width", "40px");
		$(".next").val(">");
	}
	$(".addPraticeToolbar > div").css("background", "rgba(0, 0, 0, 0.5)");
	$("." + praticeType).css("background", "rgba(249, 90, 78, 0.8)");

	$(".addPraticeContent > section").css("display", "none");
	$(".add" + praticeType).css("display", "block");

	currentAddType = praticeType;
}

/** 添加选项
 * @param $addChoiceSection Object 需要添加选项的section对象
*/
function addMoreChoice($addChoiceSection) {
	let addInputType, addInputName = "";
	let bgClassName = $addChoiceSection.parent().parent()[0].className;
	if (bgClassName === "addSingleChoice") {
		addInputType = "radio";
		addInputName = 'singleChoice' + addSingleChoiceCount;
	}
	else {
		addInputType = "checkbox";
	}

	let num = String.fromCharCode(65+$addChoiceSection.find(".choice").length);
	let div = document.createElement("div");
	div.className = "choice";
	div.innerHTML = `<span class="num">` + num + `.</span>
					<input type="text" class="textInput">
					<input type="` + addInputType + `" name="` + addInputName + `">`;
	$addChoiceSection.append(div);
}

/** 添加更多填充空格选项
 * @param $addBlankSection Object 需要添加更多空格选项的section对象
*/
function addMoreBlank($addBlankSection) {
	let num = $addBlankSection.find(".blank").length+1;
	let div = document.createElement("div");
	div.className = "blank";
	div.innerHTML = `<span class="num">` + num + `.</span>
					<input type="text" class="textInput">
					<input type="button" value="+" class="addOtherAnswer">`;
	$addBlankSection.append(div);
}

/** 添加更多可能的答案
 * @param $addOtherAnswerBtn Object 点击添加更多可能的答案的按钮
*/
function addMoreOtherAnswer($addOtherAnswerBtn) {
	let appendContent = `<br>【或：<input type="text" class="textInput">】`;
	$addOtherAnswerBtn.before(appendContent);
}

/** 获取所要添加的选择题内容
 * @param $content Object 所要添加的全部content对象
*/
function getChoiceContent($content) {
	if ($content.length === 0) return [];
	let allContent = [], type;

	let parentClassName = $content.parent()[0].className;
	if (parentClassName === "addSingleChoice" || parentClassName === "addTrueOrFalse") {
		type = "radio";
	}
	else {
		type = "checkbox";
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
	}

	return allContent;
}

/** 获取所要添加的填空题内容
 * @param $content Object 所要添加的全部content对象
*/
function getFillInTheBlankContent($content) {
	let allContent = [];

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
	}

	return allContent;
}

/** 获取所要添加的简答题内容
 * @param $content Object 所要添加的全部content对象
*/
function getShortAnswerContent($content) {
}

/** 获取所要添加的编程题内容
 * @param $content Object 所要添加的全部content对象
*/
function getProgrammingContent($content) {
	let allContent = [];

	for(let i=0, len=$content.length; i<len; i++) {
		let topic = $($content[i]).find(".topic > .textInput").val();
		let answer = $($content[i]).find(".answer textarea").val();
		
		allContent.push({
			topic: topic,
			answer: answer
		});
	}

	return allContent;
}

/** 在以习题为单位的数据库中添加一个新习题
 * @param contentObj Object 要添加的习题内容
 * @param callback Function 回调函数
*/
function addPratice(contentObj, callback) {
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "save",
			saveData: contentObj
		},
		success: function(result) {
			if (!result.err) {
				callback(result.id);
			}
		}
	});
}

/** 在以单元为单位的数据库中添加一个新单元
 * @param callback Function 回调函数
*/
function addUnit(callback) {
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "save"
		},
		success: function(result) {
			if (!result.err) {
				callback(result.id);
			}
		}
	});
}

/** 改变以完整单元为单位的数据库内容
 * @param param Object
 * param = {
 	praticeType: String,   // 习题所属的类型
	praticeId: String,   // 添加的习题的id
	unitId: String,   // 要添加习题的单元id
	callback: Function   // 回调函数
   }
*/
function addPraticeInUnits(param) {
	let update = {};
	update[param.praticeType] = param.praticeId;
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "update",
			updateOpt: {
				_id: param.unitId
			},
			operation: "addToSet",
			update: update
		},
		success: function(data) {
			param.callback(data);
		}
	});
}

/** 添加一个新的单元
* @param param Object
 * param = {
 	unitType: String,   // 单元所属的类型
	unitId: String,   // 添加的单元的id
	subjectName: String,   // 要添加单元的科目名称
	callback: Function   // 回调函数
   }
*/
function addOneUnitInSubject(param) {
	let update = {}, operation = "addToSet";

	update[param.unitType] = param.unitId;

	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "update",
			updateOpt: {
				subjectName: param.subjectName
			},
			operation: operation,
			update: update
		},
		success: function(data) {
			param.callback(data);
		}
	});
}

/** 将随机练习的题型单独出来
 * @param contentObj Array 题目内容
*/
function saveRandomPraticesInData(contentObj, addPraticeType) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "find",
			findOpt: {
				subjectName: subjectName
			}
		},
		success: function(result) {
			let randomId = result.randomPratices;

			for(let i=0, len=contentObj.length; i<len; i++) {
				addPratice(contentObj[i], function(praticeId) {
					addPraticeInUnits({
						praticeType: addPraticeType,
						praticeId: praticeId,
						unitId: randomId,
						callback: function(result) {
						}
					});
				});
			}
		}
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
function savePraticesInData(contentObj) {
	addUnit(function(unitId) {
		addOneUnitInSubject({
			unitType: praticeType + "Pratices",
			unitId: unitId,
			subjectName: subjectName,
			callback: function() {
				for(var key in contentObj) {
					let content = contentObj[key];
					for(let i=0, len=content.length; i<len; i++) {
						addPratice(content[i], function(praticeId) {
							addPraticeInUnits({
								praticeType: key,
								praticeId: praticeId,
								unitId: unitId,
								callback: function(result) {
									// callDataProcessingFn({
									// 	data: {
									// 		data: "units",
									// 		callFunction: "find",
									// 		findOpt: {
									// 			_id: unitId
									// 		}
									// 	},
									// 	success: function(result) {
									// 		console.log(i);
									// 	}
									// });
								}
							});
						});
					}
				}
			}
		});
	});
}
// function savePraticesInData(contentObj, addPraticeType) {
// 	if (contentObj.length > 0) {
// 		addUnit(function(unitId) {
// 			addOneUnitInSubject({
// 				unitType: praticeType + "Pratices",
// 				unitId: unitId,
// 				subjectName: subjectName,
// 				callback: function() {
// 					for(let i=0, len=contentObj.length; i<len; i++) {
// 						addPratice(contentObj[i], function(praticeId) {
// 							addPraticeInUnits({
// 								praticeType: addPraticeType,
// 								praticeId: praticeId,
// 								unitId: unitId,
// 								callback: function(result) {
// 									callDataProcessingFn({
// 										data: {
// 											data: "units",
// 											callFunction: "find",
// 											findOpt: {
// 												_id: unitId
// 											}
// 										},
// 										success: function(result) {
// 											console.log(i);
// 										}
// 									});
// 								}
// 							});
// 						});
// 					}
// 				}
// 			});
// 		});
// 	}
// }

/** 删除题目
*/
function removePratice(id) {
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "remove",
			removeOpt: {
				_id: id
			}
		},
		success: function(data) {
			let update = {};
			update[praticeType+"Pratices"] = id;
			$.ajax({
				url: "../callDataProcessing",
				type: "POST",
				data: {
					data: "subjects",
					callFunction: "update",
					updateOpt: {
						subjectName: subjectName
					},
					operation: "pull",
					update: update
				},
				success: function() {
					console.log("remove success");
				}
			});
		}
	});
}

/** 存储添加的所有习题
*/
function savePratices() {
	let SingleChoiceContentArr = [], MultipleChoicesContentArr = [], TrueOrFalseContentArr = [], FillInTheBlankContentArr = [], ShortAnswerContentArr = [], ProgrammingContentArr = [];

	let SingleChoiceContent = $(".addSingleChoice > .content");
	let MultipleChoicesContent = $(".addMultipleChoices > .content");
	let TrueOrFalseContent = $(".addTrueOrFalse > .content");
	let FillInTheBlankContent = $(".addFillInTheBlank > .content");
	let ShortAnswerContent = $(".addShortAnswer > .content");
	let ProgrammingContent = $(".addProgramming > .content");

	SingleChoiceContentArr = getChoiceContent(SingleChoiceContent);
	MultipleChoicesContentArr = getChoiceContent(MultipleChoicesContent);
	TrueOrFalseContentArr = getChoiceContent(TrueOrFalseContent);
	FillInTheBlankContentArr = getFillInTheBlankContent(FillInTheBlankContent);
	ProgrammingContentArr = getProgrammingContent(ProgrammingContent);

	console.log(SingleChoiceContentArr);
	console.log(MultipleChoicesContentArr);
	console.log(TrueOrFalseContentArr);
	console.log(FillInTheBlankContentArr);
	console.log(ProgrammingContentArr);

	let totalCount = SingleChoiceContentArr.length + MultipleChoicesContentArr.length + TrueOrFalseContentArr.length + FillInTheBlankContentArr.length + ProgrammingContentArr.length;

	// savePraticesInData(SingleChoiceContentArr, "SingleChoice");
	// savePraticesInData(MultipleChoicesContentArr, "MultipleChoices");
	// savePraticesInData(TrueOrFalseContentArr, "TrueOrFalse");
	// savePraticesInData(FillInTheBlankContentArr, "FillInTheBlank");
	// savePraticesInData(ProgrammingContentArr, "Programming");
	savePraticesInData({
		SingleChoice: SingleChoiceContentArr,
		MultipleChoices: MultipleChoicesContentArr,
		TrueOrFalse: TrueOrFalseContentArr,
		FillInTheBlank: FillInTheBlankContentArr,
		Programming: ProgrammingContentArr
	});
}

function checkMultipleChoicesAnswerExit() {
	let allContent = $(".addMultipleChoices > .content");
	if (allContent.length === 0) {
		return true;
	}
	else {
		let MultipleChoicesCheckAnswerExit = false;
		let lastMultipleChoicesContent = $(allContent[allContent.length-1]).find(".allChoices > .choice");
		for(let i=0, len=lastMultipleChoicesContent.length; i<len; i++) {
			if ($(lastMultipleChoicesContent[i]).find("input[type=checkbox]")[0].checked) {
				MultipleChoicesCheckAnswerExit = true;
				break;
			}
		}

		return MultipleChoicesCheckAnswerExit;
	}
}

function init() {
	getCurrentToolbar();

	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");

	// 正确显示当前添加题目的title
	let count = 0;
	getAllExercise(function(result) {
		if (result) {
			count = result.length;
		}
	});

	let innerHTML;
	switch(praticeType) {
		case "chapter": 
			innerHTML = "第 " + (++count) +" 章";
			break;
		case "examination":
			innerHTML = "试卷 " + (++count);
			break;
	}
	$(".addPratice .title")[0].innerHTML = innerHTML;
}

function bindEvent() {
	$(".addPraticeToolbar").click(function(e) {
		if (checkMultipleChoicesAnswerExit()) {
			showSomePraticeType(getTarget(e).className);
		}
		else {
			showTips("存在题目没有勾选标准答案！", 2000);
		}
	});

	$(".addMore")[0].onclick = function() {
		switch(currentAddType) {
			case "SingleChoice":
				addSingleChoice();
				break;
			case "MultipleChoices":
				if (checkMultipleChoicesAnswerExit()) {
					addMultipleChoices();
				}
				else {
					showTips("存在题目没有勾选标准答案！", 2000);
				}
				break;
			case "TrueOrFalse":
				addTrueOrFalse();
				break;
			case "FillInTheBlank":
				addFillInTheBlank();
				break;
			case "ShortAnswer":
				addShortAnswer();
				break;
			case "Programming":
				addProgramming();
				break;
		}
	}

	$(".addPraticeContent").click(function(e) {
		let className = getTarget(e).className;
		switch(className) {
			case "addChoiceBtn":
				addMoreChoice($(getTarget(e)).parent().find(".allChoices"));
				break;
			case "addBlankBtn":
				addMoreBlank($(getTarget(e)).parent().find(".allBlank"));
				break;
			case "addOtherAnswer":
				addMoreOtherAnswer($(getTarget(e)));
				break;
		}
	});

	$(".previous").click(function() {
		let showPraticeType;
		if (currentAddType === "SingleChoice") {
			return;
		}
		else if (currentAddType === "MultipleChoices") {
			if (checkMultipleChoicesAnswerExit()) {
				showPraticeType = "SingleChoice";
			}
			else {
				showTips("存在题目没有勾选标准答案！", 2000);
				return;
			}
		}
		else if (currentAddType === "TrueOrFalse") {
			showPraticeType = "MultipleChoices";
		}
		else if (currentAddType === "FillInTheBlank") {
			showPraticeType = "TrueOrFalse";
		}
		else if (currentAddType === "ShortAnswer") {
			showPraticeType = "FillInTheBlank";
		}
		else if (currentAddType === "Programming") {
			showPraticeType = "ShortAnswer";
		}
		showSomePraticeType(showPraticeType);
	});

	$(".next").click(function() {
		if (this.value === "提交") {
			showWin("确定提交所添加的所有习题？", function() {
				savePratices();
			});
			return;
		}
		let showPraticeType;
		if (currentAddType === "SingleChoice") {
			showPraticeType = "MultipleChoices";
		}
		else if (currentAddType === "MultipleChoices") {
			if (checkMultipleChoicesAnswerExit()) {
				showPraticeType = "TrueOrFalse";
			}
			else {
				showTips("存在题目没有勾选标准答案！", 2000);
				return;
			}
		}
		else if (currentAddType === "TrueOrFalse") {
			showPraticeType = "FillInTheBlank";
		}
		else if (currentAddType === "FillInTheBlank") {
			showPraticeType = "ShortAnswer";
		}
		else if (currentAddType === "ShortAnswer") {
			showPraticeType = "Programming";
		}
		showSomePraticeType(showPraticeType);
	});
}