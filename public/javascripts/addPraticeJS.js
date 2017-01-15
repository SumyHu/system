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
	let appendContent = `<div class="choice">
							<span class="num">` + num + `.</span>
							<input type="text" class="textInput">
							<input type="` + addInputType + `" name="` + addInputName + `">
						</div>`;
	$addChoiceSection[0].innerHTML = $addChoiceSection[0].innerHTML + appendContent;
}

/** 添加更多填充空格选项
 * @param addBlankSection Object 需要添加更多空格选项的section对象
*/
function addMoreBlank($addBlankSection) {
	let num = $addBlankSection.find(".blank").length+1;
	let appendContent = `<div class="blank">
							<span class="num">` + num + `.</span>
							<input type="text" class="textInput">
							<input type="button" value="+" class="addOtherAnswer">
						</div>`;
	$addBlankSection[0].innerHTML = $addBlankSection[0].innerHTML + appendContent;
}

function addMoreOtherAnswer($addOtherAnswerBtn) {
	let appendContent = `<br>【或：<input type="text" class="textInput">】`;
	$addOtherAnswerBtn.before(appendContent);
}

function init() {
	showWin("若没有该题型的题目，可直接不添加任何题目。");
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

	$(".addChoiceBtn").click(function(e) {
		console.log($(getTarget(e)).parent().find(".allChoices").length);
	});

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
			showWin("确定提交所添加的所有习题？", function() {});
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