let currentAddType = "SingleChoice";

let subjectName, praticeType;

let addSingleChoiceCount = 0, addMultipleChoicesCount = 0, addTrueOrFalseCount = 0,
	addFillInTheBlankCount = 0, addShortAnswerCount = 0, addProgrammingCount = 0;

let programmingTypeMode = {
	text: "text/plain",
	ecmascript: "application/ecmascript",
	javascript: "application/javascript",
	json: "application/json",
	typescript: "application/typescript",
	c: "text/x-c",
	java: "text/x-java"
}

// 记录Programing添加的editor，用于后面判断editor是否都不为空
let programingEditorArray = [];

function editorStyle(id, mode) {
	var editor=CodeMirror.fromTextArea(document.getElementById(id), {
            mode: mode, //实现Java代码高亮，通过CodeMirror.mimeModes查询支持哪些mode，不支持的mode可通过添加mode文件夹下的js文件将该类型添加
            lineNumbers: true,   // 显示行号

	        //设置主题
	        theme: "seti",

	        //绑定Vim
	        // keyMap: "vim",

	        //代码折叠
	        lineWrapping: true,
	        foldGutter: true,
	        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

	        //全屏模式
	        // fullScreen: true,

	        //括号匹配
	        matchBrackets: true,

	        extraKeys: {"Ctrl-Space":"autocomplete"}   //ctrl-space唤起智能提示
    });

    return editor;
}

function addSingleChoice() {
	addSingleChoiceCount++;
	let name = "singleChoice" + addSingleChoiceCount;
	let content = `<input type="button" value="X" class="remove">
					<div class="topic">题目<span class="topicNum">` + addSingleChoiceCount + `</span>：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num">A</span>.
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `" checked>
						</div>
						<div class="choice">
							<span class="num">B</span>.
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
						<div class="choice">
							<span class="num">C</span>.
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `">
						</div>
						<div class="choice">
							<span class="num">D</span>.
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
	let content = `<input type="button" value="X" class="remove">
					<div class="topic">题目<span class="topicNum">` + addMultipleChoicesCount 
					+ `</span>：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num">A</span>.
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">B</span>.
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">C</span>.
							<input type="text" class="textInput">
							<input type="checkbox">
						</div>
						<div class="choice">
							<span class="num">D</span>.
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
	let content = `<input type="button" value="X" class="remove">
					<div class="topic">题目<span class="topicNum">` + addTrueOrFalseCount + 
					`</span>：<input type="text" class="textInput"></div>
					<div class="allChoices">
						<div class="choice">
							<span class="num true">T</span>.
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `" checked>
						</div>
						<div class="choice">
							<span class="num false">F</span>.
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
	let content = `<input type="button" value="X" class="remove">
					<div class="topic">题目<span class="topicNum">` + addFillInTheBlankCount + 
					`</span>：<input type="text" class="textInput"></div>
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
	let selectInnerHtml = "<select>";
	for(var k in programmingTypeMode) {
		selectInnerHtml = selectInnerHtml + "<option>" + k + "</option>";
	}
	selectInnerHtml = selectInnerHtml + "</select>";

	addProgrammingCount++;
	let content = `<input type="button" value="X" class="remove">
					<div class="topic">题目<span class="topicNum">` + addProgrammingCount + 
					`</span>：<input type="text" class="textInput"></div>
					<div class="answer">
						<div class="programmingType">
							答案：` + selectInnerHtml + `
						</div>
						<textarea id="programming` + addProgrammingCount + `"></textarea>
					</div>`;

	let section = document.createElement("section");
	section.className = "content";
	section.innerHTML = content;
	$(".addProgramming").append(section);

	let editor = editorStyle("programming" + addProgrammingCount, "text/plain");
	programingEditorArray.push(editor);

	// 下拉框可选择代码类型，动态改变编辑器代码类型
	$(section).find(".programmingType select").change(function(e) {
		let selectType = $(getTarget(e)).find("option:selected").text();
		editor.setOption("mode", programmingTypeMode[selectType]);
	});
}

function getAllExercise(callback) {
	findSubjectByName(subjectName, function(data) {
		try {
			callback(data[praticeType + "Pratices"]);
		} catch(e) {
			callback();
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
	div.innerHTML = `<span class="num">` + num + `</span>.
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

		let programmingType = $($content[i]).find(".answer .programmingType select").find("option:selected").text();
		let mode = programmingTypeMode[programmingType];

		let answer = programingEditorArray[i].getValue();
		
		allContent.push({
			topic: topic,
			programmingTypeMode: mode,
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
					console.log(content);
					for(let i=0, len=content.length; i<len; i++) {
						(function(key) {
							addPratice(content[i], function(praticeId) {
								console.log(content[i]);
								addPraticeInUnits({
									praticeType: key,
									praticeId: praticeId,
									unitId: unitId,
									callback: function(result) {
										console.log(content[i]);
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
							}, true);
						})(key);
					}
				}
			}
		});
	});
}

/** 删除题目
*/
function removePratice($target) {
	$target.remove();


	switch(currentAddType) {
		case "SingleChoice":
			addSingleChoiceCount--;
			break;
		case "MultipleChoices":
			addMultipleChoicesCount--;
			break;
		case "TrueOrFalse":
			addTrueOrFalseCount--;
			break;
		case "FillInTheBlank":
			addFillInTheBlankCount--;
			break;
		case "ShortAnswer":
			addShortAnswerCount--;
			break;
		case "Programming":
			addProgrammingCount--;
			programingEditorArray.splice($target.find(".topic .topicNum")[0].innerHTML-1, 1);
			break;
	}

	let allTopicNum = $(".add" + currentAddType + " .topicNum");
	for(let i=0, len=allTopicNum.length; i<len; i++) {
		allTopicNum[i].innerHTML = i+1;
	}
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

	if (totalCount === 0) {
		window.location.href = "../pratice?subjectName=" + subjectName;
		return;
	}

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

	window.location.href = "../pratice?subjectName=" + subjectName;
}

// 判断是否所有的空格都不为空
function checkAllTextInputHasVal() {
	let allTextInput = $(".add" + currentAddType + " .textInput");

	for(let i=0, len=allTextInput.length; i<len; i++) {
		if (!allTextInput[i].value) {
			return false;
		}
	}

	// let textarea = $(".add" + currentAddType + " textarea");
	// console.log(textarea);
	// if (textarea.length > 0) {
	// 	for(let i=0, len=textarea.length; i<len; i++) {
	// 		console.log(textarea[i].value);
	// 		if (!textarea[i].value) {
	// 			return false;
	// 		}
	// 	}
	// }

	for(let i=0, len=programingEditorArray.length; i<len; i++) {
		console.log(programingEditorArray[i].getValue());
		if (!programingEditorArray[i].getValue()) {
			return false;
		}
	}

	return true;
}

// 判断多选题是否都勾选了答案
function checkMultipleChoicesAnswerExit() {
	let allContent = $(".addMultipleChoices > .content");

	if (allContent.length === 0) return true;

	let lastMultipleChoicesContent = $(allContent[allContent.length-1]).find(".allChoices > .choice");
	for(let i=0, len=lastMultipleChoicesContent.length; i<len; i++) {
		if ($(lastMultipleChoicesContent[i]).find("input[type=checkbox]")[0].checked) {
			return true;
		}
	}

	return false;
}

function init() {
	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");

	// 正确显示当前添加题目的title
	let count = 0;
	getAllExercise(function(result) {
		if (result) {
			count = result.length;
		}

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
	});
}

function bindEvent() {
	$(".addPraticeToolbar").click(function(e) {
		if (!checkAllTextInputHasVal()) {
			showTips("存在没有填写的空格！", 1000);
			return;
		}
		if (!checkMultipleChoicesAnswerExit()) {
			showTips("存在题目没有勾选标准答案！", 1000);
			return;
		}
		showSomePraticeType(getTarget(e).className);
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
					showTips("存在题目没有勾选标准答案！", 1000);
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
			case "remove":
				removePratice($(getTarget(e)).parent());
				break;
		}
	});

	$(".previous").click(function() {
		let showPraticeType;
		if (currentAddType === "SingleChoice") {
			return;
		}
		if (!checkAllTextInputHasVal()) {
			showTips("存在没有填写的空格！", 1000);
			return;
		}
		else if (currentAddType === "MultipleChoices") {
			if (checkMultipleChoicesAnswerExit()) {
				showPraticeType = "SingleChoice";
			}
			else {
				showTips("存在题目没有勾选标准答案！", 1000);
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
		if (!checkAllTextInputHasVal()) {
			showTips("存在没有填写的空格！", 1000);
			return;
		}
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
				showTips("存在题目没有勾选标准答案！", 1000);
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