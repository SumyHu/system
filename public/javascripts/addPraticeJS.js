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
						</div>
						<input type="button" value="添加答案" class="addBlankBtn">
					</div>`;

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
		let target = getTarget(e);
		$(".addPraticeToolbar > div").css("background", "rgba(0, 0, 0, 0.5)");
		$(target).css("background", "rgba(249, 90, 78, 0.8)");

		$(".addPraticeContent > section").css("display", "none");
		$(".add" + target.className).css("display", "block");

		currentAddType = target.className;
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
				break;
		}
	});
}