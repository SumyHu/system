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
							<input type="radio" name="` + name + `"">
						</div>
						<div class="choice">
							<span class="num">B.</span>
							<input type="text" class="textInput">
							<input type="radio" name="` + name + `"">
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
							<input type="radio" name="` + name + `">
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
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
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
	if ($content.length === 0) return;
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
			choice: choiceArray,
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

/** 将习题添加进以习题为单位的数据库里面
 * @param contentObj Object 要添加的习题内容
 * @param callback Function 回调函数
*/
function addPraticeInPratice(contentObj, callback) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
		data: {
			data: "pratices",
			callFunction: "save",
			saveData: contentObj
		},
		success: function(result) {
			callback(result);
		}
	});
}

/** 改变以完整单元为单位的数据库内容
*/
function changeUnitsData() {}

/** 添加一个新的单元
*/
function addOneUnit() {}

/** 将习题添加进数据库
 * @param contentObj Object 题目内容
*/
function savePraticeInData(contentObj) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
		data: {
			data: "pratices",
			callFunction: "save",
			saveData: contentObj
		},
		success: function(result) {
			let update = {};
			update[praticeType+"Pratices"] = result.id;
			if (!result.err) {
				$.ajax({
					url: "../callDataProcessing",
					type: "POST",
					data: {
						data: "subjects",
						callFunction: "update",
						updateOpt: {
							subjectName: subjectName
						},
						operation: "addToSet",
						update: update
					}
				});
			}
		}
	});
}

/** 删除题目
*/
function removePratice(id) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
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
function savePratice() {
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

	for(let i=0, len=SingleChoiceContentArr.length; i<len; i++) {
		savePraticeInData(SingleChoiceContentArr[i]);
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
		showSomePraticeType(getTarget(e).className);
	});

	$(".addMore")[0].onclick = function() {
		switch(currentAddType) {
			case "SingleChoice":
				addSingleChoice();
				break;
			case "MultipleChoices":
				addMultipleChoices();
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
			showPraticeType = "SingleChoice";
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
				savePratice();
			});
			return;
		}
		let showPraticeType;
		if (currentAddType === "SingleChoice") {
			showPraticeType = "MultipleChoices";
		}
		else if (currentAddType === "MultipleChoices") {
			showPraticeType = "TrueOrFalse";
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