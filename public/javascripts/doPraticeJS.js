"use strict";

var praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

var programmingTypeMode = {
	c: "text/x-c",
	"c++": "text/x-c++src",
	"c#": "text/x-csharp",
	java: "text/x-java",
	javascript: "application/javascript",
	php: "text/x-php",
	python: "text/x-python",
	Ruby: "text/x-ruby",
	"sql(mysql)": "text/x-mysql",
	"sql(oracle)": "text/x-sql"
};

var subjectName = void 0,
    praticeType = void 0,
    selectIndex = void 0,
    type = void 0,
    allPraticeContent = void 0;

var currentIndexArray = {}; // 存储当前所有类型的题目下标

var hasContentTypeArr = []; // 存储当前有题目的类型名

// 当练习类型为考试模拟时，进行正确答案和考生答案存储及匹配
var examinationCorrectAnswer = {},
    examinationStudentAnswer = {},
    scoresObj = {
	SingleChoice: [],
	MultipleChoices: [],
	TrueOrFalse: [],
	FillInTheBlank: [],
	ShortAnswer: [],
	Programming: []
};

// 记录Programing添加的editor，用于后面判断editor是否都不为空
var programingEditorArray = [];

/** 实现代码编辑器样式
 * @param id String textarea的id
 * @param mode String 代码类型
*/
function editorStyle(id, mode) {
	var editor = CodeMirror.fromTextArea(document.getElementById(id), {
		mode: mode, //实现Java代码高亮，通过CodeMirror.mimeModes查询支持哪些mode，不支持的mode可通过添加mode文件夹下的js文件将该类型添加
		lineNumbers: true, // 显示行号

		//设置主题
		theme: "seti",
		// theme: "monokai",

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

		extraKeys: { "Ctrl-Space": "autocomplete" } //ctrl-space唤起智能提示
	});
	return editor;
}

// 当练习类型为考试模拟时，添加类型块索引
function addPraticeBlockIndex() {
	$(".showPraticeBlockIndex").css("display", "block");
	for (var i = 0, len = hasContentTypeArr.length; i < len; i++) {
		var div = document.createElement("div");
		div.className = hasContentTypeArr[i] + "Block";
		div.innerHTML = typeChiness[hasContentTypeArr[i]];
		$(".showPraticeBlockIndex").append(div);
	}
}

/** 添加题号索引
 * @param count Number 题目数量
*/
function addPraticeIndex(count) {
	$(".showPraticeIndex")[0].innerHTML = "";
	for (var i = 1; i <= count; i++) {
		var div = document.createElement("div");
		div.innerHTML = i;
		$(".showPraticeIndex").append(div);
	}
}

/** 添加选项型习题（如单选题、多选题、判断题）
 * @param section Object 添加习题的父对象
 * @param praticeId String 添加的习题id
 * @param index Number 题号
 * @param addPraticeType 添加的习题类型
*/
function addChoicePraticesContent(section, praticeId, index, addPraticeType) {
	findPraticesById(praticeId, function (result) {
		var sec = document.createElement("section");
		sec.className = "content";
		var showIndex = index + 1,
		    inputType = void 0;

		var innerHtml = "<p class=\"title\"><span class=\"titleNum\">" + showIndex + "</span>" + result.topic;

		if (praticeType === "examination") {
			innerHtml += " (  <span class=\"score\">" + result.score + "</span>\u5206 )";
		}
		innerHtml += "</p><div class=\"answer\">";

		if (addPraticeType === "MultipleChoices") {
			inputType = "checkbox";
		} else {
			inputType = "radio";
		}
		for (var i = 0, len = result.choices.length; i < len; i++) {
			var choiceContent = result.choices[i].choiceContent;
			innerHtml = innerHtml + "<div>\n\t\t\t\t\t\t\t\t\t<input type=\"" + inputType + "\" id=\"" + addPraticeType + showIndex + i + "\" name=\"" + addPraticeType + showIndex + "\">\n\t\t\t\t\t\t\t\t\t<label for=\"" + addPraticeType + showIndex + i + "\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"num\">" + result.choices[i].num + "</span>\n\t\t\t\t\t\t\t\t\t" + (choiceContent ? choiceContent : "") + "</label>\n\t\t\t\t\t\t\t   </div>";
		}

		sec.innerHTML = innerHtml + "</div>";

		if (praticeType !== "examination") {
			sec.innerHTML = sec.innerHTML + "<div class=\"choiceAnswerBlock\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"showAnswer\">\u67E5\u770B\u6B63\u786E\u7B54\u6848<span class=\"icon\">\uFE3D</span></div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"answerContent\">" + result.answer.join(",") + "</div>\n\t\t\t\t\t\t\t\t\t</div>";
		} else {
			examinationCorrectAnswer[addPraticeType].answer.push(result.answer);

			if (index === 0) {
				examinationCorrectAnswer[addPraticeType].score = result.score;
			}
		}

		$(section).append(sec);
		$(".flip").before(section);
		$(sec).css("display", "none");
	});
}

/** 添加选择类型的题目在界面上
 * @param praticeIdArr Array 习题id集合
 * @param addPraticeType String 要添加的习题类型
*/
function addChoicePratices(praticeIdArr, addPraticeType) {
	var section = document.createElement("section");
	section.className = addPraticeType;
	if (praticeType === "random") {
		var count = 0;
		var length = praticeIdArr.length;
		var tempArr = [];
		for (var i = 0, len = praticeIdArr.length; i < len; i++) {
			tempArr.push(praticeIdArr[i]);
		}
		while (count < length) {
			var randomNum = parseInt(Math.random() * tempArr.length);
			addChoicePraticesContent(section, tempArr[randomNum], count, addPraticeType);
			tempArr.splice(randomNum, 1);
			count++;
		}
	} else {
		if (praticeType === "examination") {
			examinationCorrectAnswer[addPraticeType] = {
				answer: [],
				score: 0
			};
		}
		praticeIdArr.forEach(function (praticeId, index, array) {
			addChoicePraticesContent(section, praticeId, index, addPraticeType);
		});
	}

	$(".choiceAnswerBlock > .showAnswer").click(function (e) {
		var $showAnswer = void 0;
		if (getTarget(e).className === "icon") {
			$showAnswer = $(getTarget(e)).parent();
		} else {
			$showAnswer = $(getTarget(e));
		}
		var $answerBlock = $showAnswer.parent(".choiceAnswerBlock");
		var height = $answerBlock.css("height");
		if (height === "35px") {
			$showAnswer.find(".icon")[0].innerHTML = "︾";
			$answerBlock.css("height", "80px");
		} else {
			$showAnswer.find(".icon")[0].innerHTML = "︽";
			$answerBlock.css("height", "35px");
		}
	});
}

/** 添加非选项型习题（如单选题、多选题、判断题）
 * @param section Object 添加习题的父对象
 * @param praticeId String 添加的习题id
 * @param index Number 题号
 * @param addPraticeType 添加的习题类型
*/
function addNotChoicePraticesContent(section, praticeId, index, addPraticeType) {
	findPraticesById(praticeId, function (result) {
		console.log(result);
		var sec = document.createElement("section");
		sec.className = "content";
		var showIndex = index + 1;

		var innerHtml = "<p class=\"title\"><span class=\"titleNum\">" + showIndex + "</span>" + result.topic;

		if (praticeType === "examination") {
			innerHtml += " (  <span class=\"score\">" + result.score + "</span>\u5206 )";
		}
		innerHtml += "</p><div class=\"answer\">";

		if (addPraticeType === "FillInTheBlank") {
			for (var i = 1, len = result.answer.length; i <= len; i++) {
				innerHtml = innerHtml + "<div>\n\t\t\t\t\t\t\t\t\t<span class=\"num\">" + i + "</span>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t    </div>";
			}
			sec.innerHTML = innerHtml + "</div>";

			if (praticeType !== "examination") {
				var answer = result.answer,
				    answerHtml = "";
				for (var _i = 0, _len = answer.length; _i < _len; _i++) {
					answerHtml = answerHtml + "<div>" + Number(Number(_i) + 1) + ". " + answer[_i].join(" 或 ") + "</div>";
				}

				sec.innerHTML = sec.innerHTML + "<div class=\"answerBlock\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"showAnswer\">\u67E5\u770B\u6B63\u786E\u7B54\u6848<span class=\"icon\">\uFE3D</span></div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"answerContent\">" + answerHtml + "</div>\n\t\t\t\t\t\t\t\t\t\t</div>";
			} else {
				examinationCorrectAnswer[addPraticeType].answer.push(result.answer);

				if (index === 0) {
					examinationCorrectAnswer[addPraticeType].score = result.score;
				}
			}

			$(section).append(sec);
			$(".flip").before(section);
		} else if (addPraticeType === "ShortAnswer") {
			innerHtml += "<textarea></textarea><p class='ShortAnswerTips'>ps：尽量将带有否定意义的词写成“否定词+形容词”的形式，如将“不变”写成“不改变”或“不会变化”之类的。</p>";
			sec.innerHTML = innerHtml + "</div>";

			if (praticeType !== "examination") {
				var _answerHtml = result.answer[0].content;

				sec.innerHTML = sec.innerHTML + "<div class=\"answerBlock\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"showAnswer\">\u67E5\u770B\u6B63\u786E\u7B54\u6848<span class=\"icon\">\uFE3D</span></div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"answerContent\"><pre>" + _answerHtml.replace(/[【】（\d*）{}]/g, "") + "<pre></div>\n\t\t\t\t\t\t\t\t\t\t</div>";
			} else {
				examinationCorrectAnswer[addPraticeType].push({
					answer: result.answer,
					score: result.score
				});
			}

			$(section).append(sec);
			$(".flip").before(section);
		} else if (addPraticeType === "Programming") {
			var inputContent = result.answer[0].input,
			    outputContent = result.answer[0].output;
			var inputType = [],
			    outputType = [];
			if (inputContent.type) {
				for (var _i2 = 0, _len2 = inputContent.type.length; _i2 < _len2; _i2++) {
					inputType.push(inputContent.type[_i2].thisType);
					if (inputContent.type[_i2].childType) {
						inputType[inputType.length - 1] += "(" + inputContent.type[_i2].childType + ")";
					}
				}
			}

			if (outputContent.type) {
				for (var _i3 = 0, _len3 = outputContent.type.length; _i3 < _len3; _i3++) {
					outputType.push(outputContent.type[_i3].thisType);
					if (outputContent.type[_i3].childType) {
						outputType[outputType.length - 1] += "(" + outputContent.type[_i3].childType + ")";
					}
				}
			}

			var modeChiness = result.answer[0].programmingTypeMode,
			    showMode = void 0;
			for (var k in programmingTypeMode) {
				if (programmingTypeMode[k] === modeChiness) {
					showMode = k;
				}
			}

			var helpMode = showMode;
			if (helpMode === "c++") {
				helpMode = "cpp";
			} else if (helpMode === "c#") {
				helpMode = "cs";
			}

			sec.innerHTML = "<p class=\"title\"><span class=\"titleNum\">" + showIndex + "</span>" + result.topic + (praticeType === "examination" ? " (  <span class=\"score\">" + result.score + "</span>\u5206 )" : "") + "</p>\n\t\t\t\t\t\t\t<div class=\"inputBlock\">\n\t\t\t\t\t\t\t\t<div class=\"description\">\u8F93\u5165\u8981\u6C42\uFF1A" + (inputContent.description ? inputContent.description : "无") + "</div>\n\t\t\t\t\t\t\t\t<div class=\"example\">\u8F93\u5165\u6837\u4F8B\uFF1A" + (inputContent.example ? inputContent.example : "无") + "</div>\n\t\t\t\t\t\t\t\t<div class=\"inputType\">\u8F93\u5165\u7C7B\u578B\uFF08\u6309\u7167\u8F93\u5165\u987A\u5E8F\uFF09\uFF1A" + (inputType.length > 0 ? "" : "无") + "<span class=\"inputTypeContent\">" + inputType.join("、") + "</span></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"outputBlock\">\n\t\t\t\t\t\t\t\t<div class=\"description\">\u8F93\u51FA\u8981\u6C42\uFF1A" + (outputContent.description ? outputContent.description : "无") + "</div>\n\t\t\t\t\t\t\t\t<div class=\"example\">\u8F93\u51FA\u6837\u4F8B\uFF1A" + (outputContent.example ? outputContent.example : "无") + "</div>\n\t\t\t\t\t\t\t\t<div class=\"inputType\">\u8F93\u51FA\u7C7B\u578B\uFF08\u6309\u7167\u8F93\u51FA\u987A\u5E8F\uFF09\uFF1A" + (outputType.length > 0 ? "" : "无") + "<span class=\"inputTypeContent\">" + outputType.join("、") + "</span></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"programmingTypeMode\">\u7F16\u7A0B\u8BED\u8A00\uFF1A<span class=\"mode\">" + showMode + "</span><a href=\"help?mode=" + helpMode + "\" target=\"blank\" class=\"help\">\u5728\u7EBF\u5E2E\u52A9</a></div>\n\t\t\t\t\t\t <div class=\"longAnswer\">" + "<div><textarea id=\"" + addPraticeType + "Editor" + index + "\"></textarea></div></div>";

			if (addPraticeType === "Programming") {
				sec.innerHTML = sec.innerHTML + "<input type=\"button\" value=\"\u8C03\u8BD5\" class=\"runningBtn\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"runningResult\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"runningTitle\">\u8C03\u8BD5\u7ED3\u679C\uFF1A</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"runningContent\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>";
			}

			if (praticeType !== "examination") {
				if (addPraticeType === "Programming") {
					sec.innerHTML = sec.innerHTML + "<div class=\"answerBlock\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"showAnswer\">\u67E5\u770B\u6B63\u786E\u7B54\u6848<span class=\"icon\">\uFE3D</span></div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"answerContent\"><textarea id=\"editor" + index + "\">" + result.answer[0].content + "</textarea></div>\n\t\t\t\t\t\t\t\t\t\t</div>";
				}
			} else {
				examinationCorrectAnswer[addPraticeType].push({
					answer: result.answer,
					score: result.score
				});
			}

			$(section).append(sec);
			$(".flip").before(section);

			$(".answer").addClass("longAnswer");

			var mode = "text/plain";
			if (addPraticeType === "Programming") {
				mode = result.answer[0].programmingTypeMode;
			}

			var editor = editorStyle(addPraticeType + 'Editor' + index, mode);
			programingEditorArray.push({
				textareaId: addPraticeType + "Editor" + index,
				editor: editor
			});

			editor.on("change", function () {
				$(sec).find(".runningResult > .runningContent")[0].innerHTML = "";
			});

			if ($("#editor" + index).length) {
				var editor1 = editorStyle("editor" + index, mode);
				editor1.setSize("auto", "auto");
				editor1.setOption("readOnly", true);
				setTimeout(function () {
					editor1.refresh();
				}, 1);
			}
		}
		$(sec).css("display", "none");
	});
}

/** 添加非选择类型的题目
 * @param praticeIdArray Array 习题id集合
 * @param addPraticeType String 要添加的习题类型
*/
function addNotChoicePratices(praticeIdArr, addPraticeType) {
	var section = document.createElement("section");
	section.className = addPraticeType;

	if (praticeType === "random") {
		var count = 0;
		var length = praticeIdArr.length;
		var tempArr = [];
		for (var i = 0, len = praticeIdArr.length; i < len; i++) {
			tempArr.push(praticeIdArr[i]);
		}
		while (count < length) {
			var randomNum = parseInt(Math.random() * tempArr.length);
			addNotChoicePraticesContent(section, tempArr[randomNum], count, addPraticeType);
			tempArr.splice(randomNum, 1);
			count++;
		}
	} else {
		if (praticeType === "examination") {
			if (addPraticeType === "FillInTheBlank") {
				examinationCorrectAnswer[addPraticeType] = {
					answer: [],
					score: 0
				};
			} else {
				examinationCorrectAnswer[addPraticeType] = [];
			}
		}
		praticeIdArr.forEach(function (praticeId, index, array) {
			addNotChoicePraticesContent(section, praticeId, index, addPraticeType);
		});
	}

	$(".runningBtn").click(function (e) {});

	$(".answerBlock > .showAnswer").click(function (e) {
		var $shortAnswer = void 0;
		if (getTarget(e).className === "icon") {
			$showAnswer = $(getTarget(e)).parent();
		} else {
			$showAnswer = $(getTarget(e));
		}
		var $answerBlock = $showAnswer.parent(".answerBlock");
		var $answerContent = $answerBlock.find(".answerContent");
		if ($answerContent.css("display") === "none") {
			$showAnswer.find(".icon")[0].innerHTML = "︾";
			$answerContent.css("display", "block");
		} else {
			$showAnswer.find(".icon")[0].innerHTML = "︽";
			$answerContent.css("display", "none");
		}
	});
}

// 根据当前题目类型改变类型索引块的样式
function changeTypeStyle() {
	$(".showPraticeBlockIndex > div").css("background", "#eff0dc");
	$("." + type + "Block").css("background", "#c9cabb");
}

/** 根据当前类型和题目下标显示对应的内容
 * @param index Number 题目下标
*/
function changePraticeContent(index) {
	// 修改对应索引的样式
	var $allIndex = $(".showPraticeIndex > div");
	$allIndex.css("background", "#eff0dc");
	$($allIndex[index]).css("background", "#c9cabb");

	// 显示对应题目
	var $allContent = $("." + type + " > .content");
	$(".content").css("display", "none");
	$($allContent[index]).css("display", "block");

	if (index === 0 && type === hasContentTypeArr[0]) {
		$(".previous").addClass("disable");
	} else {
		$(".previous").removeClass("disable");
	}

	if (index === currentIndexArray[type].length - 1 && type === hasContentTypeArr[hasContentTypeArr.length - 1]) {
		if (praticeType === "examination") {
			$(".next").val("提交");
		} else {
			$(".next").addClass("disable");
		}
	} else {
		$(".next").val(">");
		$(".next").removeClass("disable");
	}
}

/** 获得选项型题目的正确答案和考生答案
 * @param getType String 题目类型
*/
function getChoiceAnswer(getType) {
	examinationStudentAnswer[getType] = [];

	var inputType = "radio";
	if (getType === "MultipleChoices") {
		inputType = "checkbox";
	}

	var allContent = $("." + getType + " > .content");
	for (var i = 0, len = allContent.length; i < len; i++) {
		examinationStudentAnswer[getType].push([]);
		var currentIndex = examinationStudentAnswer[getType].length - 1;

		var allAnswer = $(allContent[i]).find(".answer input[type=" + inputType + "]"),
		    hadSelected = false;
		for (var j = 0, len1 = allAnswer.length; j < len1; j++) {
			if (allAnswer[j].checked) {
				hadSelected = true;
				var label = $(allContent[i]).find(".answer .num")[j].innerHTML;
				examinationStudentAnswer[getType][currentIndex].push(label);
				if (getType !== "MultipleChoices") {
					break;
				}
			}
		}

		if (!hadSelected) {
			examinationStudentAnswer[getType][currentIndex].push("");
		}
	}
}

/** 获得非选项型题目的正确答案和考生答案
 * @param getType String 题目类型
*/
function getNotChoiceAnswer(getType) {
	examinationStudentAnswer[getType] = [];

	if (getType === "FillInTheBlank") {
		var allContent = $("." + getType + " > .content");
		for (var i = 0, len = allContent.length; i < len; i++) {
			examinationStudentAnswer[getType].push([]);
			var currentIndex = examinationStudentAnswer[getType].length - 1;

			var allAnswer = $(allContent[i]).find(".answer .textInput");
			for (var j = 0, len1 = allAnswer.length; j < len1; j++) {
				examinationStudentAnswer[getType][currentIndex].push(allAnswer[j].value);
			}
		}
	} else if (getType === "ShortAnswer") {
		var _allContent = $("." + getType + " > .content");
		for (var _i4 = 0, _len4 = _allContent.length; _i4 < _len4; _i4++) {
			console.log($(_allContent[_i4]).find(".answer > textarea").val());
			examinationStudentAnswer[getType].push($(_allContent[_i4]).find(".answer > textarea").val());
		}
	} else if (getType === "Programming") {
		for (var _i5 = 0, _len5 = programingEditorArray.length; _i5 < _len5; _i5++) {
			var _allContent2 = $("." + getType + " > .content");
			var showResult = $(_allContent2[_i5]).find(".runningResult > .runningContent")[0].innerHTML;
			console.log(showResult);
			if (!showResult || showResult === '<pre><div class="loading"></div></pre>') {
				return false;
			}
			examinationStudentAnswer[getType].push(programingEditorArray[_i5].editor.getValue());
		}
		return true;
	}
}

// 获得所有题目的正确答案和考生答案
function getAllAnswer() {
	getChoiceAnswer("SingleChoice");
	getChoiceAnswer("MultipleChoices");
	getChoiceAnswer("TrueOrFalse");
	getNotChoiceAnswer("FillInTheBlank");
	getNotChoiceAnswer("ShortAnswer");
	// getNotChoiceAnswer("Programming");

	console.log(examinationCorrectAnswer);
	console.log(examinationStudentAnswer);
}

/** 比对选项型答案，并作出相应给分
 * @param choiceCorrectAnswer Array 正确答案
 * @param choiceStudentAnswer Array 考生答案
 * @param score Number 每题分值
*/
function checkChoiceAnswer(choiceCorrectAnswer, choiceStudentAnswer, score, type) {
	var totalScore = 0;
	outer: for (var i = 0, len = choiceCorrectAnswer.length; i < len; i++) {
		if (choiceCorrectAnswer[i].length !== choiceStudentAnswer[i].length) {
			scoresObj[type].push(0);
			totalScore += 0;
			continue;
		}
		for (var j = 0, len1 = choiceCorrectAnswer[i].length; j < len1; j++) {
			if (choiceCorrectAnswer[i][j] !== choiceStudentAnswer[i][j]) {
				scoresObj[type].push(0);
				totalScore += 0;
				continue outer;
			}
		}
		scoresObj[type].push(score);
		totalScore += score;
		console.log("choice: " + i + ", score: " + score);
	}
	return totalScore;
}

/** 比对填空题答案，并作出相应给分
 * @param FillInTheBlankCorrectAnswer Array 正确答案
 * @param FillInTheBlankStudentAnswer Array 考生答案
 * @param score Number 每题分值
*/
function checkFillIneBlankAnswer(FillInTheBlankCorrectAnswer, FillInTheBlankStudentAnswer, score) {
	var totalScore = 0;
	outer: for (var i = 0, len = FillInTheBlankCorrectAnswer.length; i < len; i++) {
		scoresObj["FillInTheBlank"].push(0);

		for (var j = 0, len1 = FillInTheBlankCorrectAnswer[i].length; j < len1; j++) {
			for (var t = 0, len2 = FillInTheBlankCorrectAnswer[i][j].length; t < len2; t++) {
				if (FillInTheBlankStudentAnswer[i][j] === FillInTheBlankCorrectAnswer[i][j][t]) {
					var realScore = score / len1;
					console.log("realScore: " + realScore);
					scoresObj["FillInTheBlank"][scoresObj["FillInTheBlank"].length - 1] += realScore;
					totalScore += realScore;
					console.log(i, j, score / len1);
					break;
				}
			}
		}
	}
	return totalScore;
}

/** 比对简答题答案，并作出相应给分
 * @param ShortAnswerCorrectAnswer Array 正确答案
 * @param ShortAnswerStudentAnswer Array 考生答案

 * ShortAnswerCorrectAnswer = [{
	answer: [],
	score: Number
 }, {...}, ...]
*/
function checkShortAnswer(ShortAnswerCorrectAnswer, ShortAnswerStudentAnswer, callback) {
	var totalScore = 0,
	    count = 0;

	var _loop = function _loop(i, len1) {
		var answer = ShortAnswerCorrectAnswer[i].answer[0];
		var correctAnswerContent = answer.content,
		    professionalNounsArr = answer.professionalNounsArr ? answer.professionalNounsArr : [],
		    score = ShortAnswerCorrectAnswer[i].score,
		    studentAnswerContent = ShortAnswerStudentAnswer[i];

		console.log(correctAnswerContent, professionalNounsArr, score, studentAnswerContent);

		if (studentAnswerContent) {
			$.ajax({
				url: "./calShortAnswerScore",
				type: "POST",
				data: {
					correctAnswerContent: correctAnswerContent,
					studentAnswerContent: studentAnswerContent,
					professionalNounsArr: professionalNounsArr,
					score: score
				},
				success: function success(result) {
					scoresObj["ShortAnswer"][i] = Number(result);
					totalScore += Number(result);
					count++;

					if (count === ShortAnswerCorrectAnswer.length) {
						callback(totalScore);
					}
				}
			});
		} else {
			count++;

			scoresObj["ShortAnswer"][i] = 0;

			if (count === ShortAnswerCorrectAnswer.length) {
				callback(totalScore);
			}
		}
	};

	for (var i = 0, len1 = ShortAnswerCorrectAnswer.length; i < len1; i++) {
		_loop(i, len1);
	}
}

/** 比对编程题答案，并作出相应给分
 * @param ProgrammingCorrectAnswer Array 正确答案
 * @param ProgrammingStudentAnswer Array 考生答案

 * ProgrammingCorrectAnswer = [{
	answer: [],
	score: Number
 }]
*/
function checkProgrammingAnswer(ProgrammingCorrectAnswer) {
	var allContent = $(".Programming > .content"),
	    totalScore = 0;
	for (var i = 0, len = ProgrammingCorrectAnswer.length; i < len; i++) {
		var realScore = 0;
		try {
			var result = $(allContent[i]).find(".runningResult > .runningContent > pre")[0].innerHTML,
			    _score = ProgrammingCorrectAnswer[i].score,
			    correctRate = void 0;

			if (result.indexOf("编译通过率：") > -1) {
				realScore = parseFloat(result.substr(6)) / 100 * _score;
				totalScore += realScore;
			}
		} catch (e) {}

		scoresObj["Programming"].push(realScore);
	}
	return totalScore;
}

function checkAnswer() {
	getAllAnswer();

	var SingleChoiceCorrectAnswer = examinationCorrectAnswer.SingleChoice,
	    SingleChoiceStudentAnswer = examinationStudentAnswer.SingleChoice,
	    MultipleChoicesCorrectAnswer = examinationCorrectAnswer.MultipleChoices,
	    MultipleChoicesStudentAnswer = examinationStudentAnswer.MultipleChoices,
	    TrueOrFalseCorrectAnswer = examinationCorrectAnswer.TrueOrFalse,
	    TrueOrFalseStudentAnswer = examinationStudentAnswer.TrueOrFalse,
	    FillInTheBlankCorrectAnswer = examinationCorrectAnswer.FillInTheBlank,
	    FillInTheBlankStudentAnswer = examinationStudentAnswer.FillInTheBlank,
	    ShortAnswerCorrectAnswer = examinationCorrectAnswer.ShortAnswer,
	    ShortAnswerStudentAnswer = examinationStudentAnswer.ShortAnswer,
	    ProgrammingCorrectAnswer = examinationCorrectAnswer.Programming,
	    ProgrammingStudentAnswer = examinationStudentAnswer.Programming,
	    totalScore = 0,
	    scoresDetail = {
		totalScore: 0,
		details: {},
		urlParam: encodeURIComponent(window.location.href.split("?")[1])
	};

	if (SingleChoiceCorrectAnswer) {
		var SingleChoiceScore = checkChoiceAnswer(SingleChoiceCorrectAnswer.answer, SingleChoiceStudentAnswer, SingleChoiceCorrectAnswer.score, "SingleChoice");
		scoresDetail.details[typeChiness.SingleChoice] = SingleChoiceScore;
		totalScore += SingleChoiceScore;
	}
	if (MultipleChoicesCorrectAnswer) {
		var MultipleChoicesScore = checkChoiceAnswer(MultipleChoicesCorrectAnswer.answer, MultipleChoicesStudentAnswer, MultipleChoicesCorrectAnswer.score, "MultipleChoices");
		scoresDetail.details[typeChiness.MultipleChoices] = MultipleChoicesScore;
		totalScore += MultipleChoicesScore;
	}
	if (TrueOrFalseCorrectAnswer) {
		var TrueOrFalseScore = checkChoiceAnswer(TrueOrFalseCorrectAnswer.answer, TrueOrFalseStudentAnswer, TrueOrFalseCorrectAnswer.score, "TrueOrFalse");
		scoresDetail.details[typeChiness.TrueOrFalse] = TrueOrFalseScore;
		totalScore += TrueOrFalseScore;
	}
	if (FillInTheBlankCorrectAnswer) {
		var FillInTheBlankScore = checkFillIneBlankAnswer(FillInTheBlankCorrectAnswer.answer, FillInTheBlankStudentAnswer, FillInTheBlankCorrectAnswer.score);
		scoresDetail.details[typeChiness.FillInTheBlank] = FillInTheBlankScore;
		totalScore += FillInTheBlankScore;
	}

	if (ShortAnswerCorrectAnswer) {
		checkShortAnswer(ShortAnswerCorrectAnswer, ShortAnswerStudentAnswer, function (score) {
			scoresDetail.details[typeChiness.ShortAnswer] = score;
			console.log(scoresDetail);
			totalScore += score;

			if (ProgrammingCorrectAnswer) {
				var ProgrammingScore = checkProgrammingAnswer(ProgrammingCorrectAnswer);
				scoresDetail.details[typeChiness.Programming] = ProgrammingScore;
				totalScore += ProgrammingScore;
			}

			scoresDetail.totalScore = totalScore.toFixed(1);

			var userId = $(".showUsername")[0].id;
			callDataProcessingFn({
				data: {
					data: "users",
					callFunction: "find",
					findOpt: {
						_id: userId
					}
				},
				success: function(result) {
					$.ajax({
						url: "../showScore",
						type: "POST",
						data: {
							correctAnswerContent: examinationCorrectAnswer,
							studentAnswerContent: examinationStudentAnswer,
							scoresObj: scoresObj,
							scoresDetail: scoresDetail,
							userId: userId,
							name: result.name,
							class: result.class
						},
						success: function success() {
							window.location.href = "../showScore?scoresDetail=" + JSON.stringify(scoresDetail);
						}
					});
				}
			});
		});
	} else {
		if (ProgrammingCorrectAnswer) {
			var ProgrammingScore = checkProgrammingAnswer(ProgrammingCorrectAnswer);
			scoresDetail.details[typeChiness.Programming] = ProgrammingScore;
			totalScore += ProgrammingScore;
		}
		scoresDetail.totalScore = totalScore.toFixed(1);

		var userId = $(".showUsername")[0].id;
		callDataProcessingFn({
			data: {
				data: "users",
				callFunction: "find",
				findOpt: {
					_id: userId
				}
			},
			success: function(result) {
				$.ajax({
					url: "../showScore",
					type: "POST",
					data: {
						correctAnswerContent: examinationCorrectAnswer,
						studentAnswerContent: examinationStudentAnswer,
						scoresObj: scoresObj,
						scoresDetail: scoresDetail,
						userId: userId,
						name: result.name,
						class: result.class
					},
					success: function success() {
						window.location.href = "../showScore?scoresDetail=" + JSON.stringify(scoresDetail);
					}
				});
			}
		});
	}
}

/** 将运行按钮的状态改为不可点击状态
 * @param $runningBtn jQuery Object 运行按钮
*/
function changeRunningBtnToDisableStatus($runningBtn, milltime) {
	$runningBtn.addClass("disable");
	var runningBtnInitValue = $runningBtn.val();
	var time = milltime / 1000;
	$runningBtn.val(runningBtnInitValue + "(" + time + ")");

	var interval = setInterval(function () {
		time -= 1;

		if (time === 0) {
			clearInterval(interval);
			$runningBtn.removeClass("disable");
			$runningBtn.val(runningBtnInitValue);
		} else {
			$runningBtn.val(runningBtnInitValue + "(" + time + ")");
		}
	}, 1000);
}

/** 进行代码运行
 * @param $programmingContent jQuery Object 该编程题目块
*/
function runningProgramming($programmingContent) {
	var textareaId = $programmingContent.find(".longAnswer textarea")[0].id,
	    editor = void 0;
	for (var i = 0, len = programingEditorArray.length; i < len; i++) {
		if (programingEditorArray[i].textareaId === textareaId) {
			editor = programingEditorArray[i].editor;
			break;
		}
	}
	var editorContent = editor.getValue();

	var inputType = $programmingContent.find(".inputBlock > .inputType > .inputTypeContent")[0].innerHTML.split("、"),
	    outputType = $programmingContent.find(".outputBlock > .inputType > .inputTypeContent")[0].innerHTML.split("、");

	if (inputType.length === 1 && !inputType[0]) {
		inputType = [];
	}

	if (outputType.length === 1 && !outputType[0]) {
		outputType = [];
	}

	var inputTypeArray = [],
	    outputTypeArray = [];
	for (var _i6 = 0, _len6 = inputType.length; _i6 < _len6; _i6++) {
		if (inputType[_i6].indexOf("(") > -1) {
			var temp = inputType[_i6].split("(");
			inputTypeArray.push({
				thisType: temp[0],
				childType: temp[1].substr(0, temp[1].length - 1)
			});
		} else {
			inputTypeArray.push({
				thisType: inputType[_i6]
			});
		}
	}

	for (var _i7 = 0, _len7 = outputType.length; _i7 < _len7; _i7++) {
		if (outputType[_i7].indexOf("(") > -1) {
			var _temp = outputType[_i7].split("(");
			outputTypeArray.push({
				thisType: _temp[0],
				childType: _temp[1].substr(0, _temp[1].length - 1)
			});
		} else {
			outputTypeArray.push({
				thisType: inputType[_i7]
			});
		}
	}

	var programmingLanguage = $programmingContent.find("> .programmingTypeMode > .mode")[0].innerHTML;

	var answerCode = void 0;
	var titleNum = $programmingContent.find(".title > .titleNum")[0].innerHTML;
	findSubjectByName(subjectName, function (allUnits) {
		var unitId = allUnits[praticeType + "Pratices"][selectIndex];
		findUnitById(unitId, function (allTypePratices) {
			var praticeId = allTypePratices[type][titleNum - 1];
			findPraticesById(praticeId, function (result) {
				answerCode = result.answer[0].content;
			});
		});
	});

	if (!editorContent) {
		showTips("请输入代码！", 1000);
		$programmingContent.find(".runningBtn").removeClass("disable");
		return;
	}

	$programmingContent.find(".runningResult > .runningContent")[0].innerHTML = "<pre><div class='loading'></div></pre>";

	runningCode(programmingLanguage, editorContent, inputTypeArray, outputTypeArray, function (result) {
		var showResult = void 0;
		console.log(result);
		if (!result.error) {
			if (programmingLanguage !== "javascript" && result.inputCount !== inputTypeArray.length) {
				showResult = "编译不通过！";
				$programmingContent.find(".runningBtn").removeClass("disable");
			} else {
				var rightCount = runningCodeWithCorrectAnswer(programmingLanguage, answerCode, editorContent, inputTypeArray, outputTypeArray, function (rightCount) {
					console.log(rightCount);
					showResult = "编译通过率：" + rightCount / 20 * 100 + "%";
					$programmingContent.find(".runningResult > .runningContent")[0].innerHTML = "<pre>" + showResult + "</pre>";
					$programmingContent.find(".runningBtn").removeClass("disable");
				});
			}
		} else {
			showResult = result.error;
			if (showResult === "选择的参数类型与实际不符！") {
				showResult = "编译不通过！";
			}
			$programmingContent.find(".runningBtn").removeClass("disable");
		}

		console.log($programmingContent[0]);

		if (showResult) {
			$programmingContent.find(".runningResult > .runningContent")[0].innerHTML = "<pre>" + showResult + "</pre>";
		}
	});
}

function init() {
	$(".time").css("display", "block");

	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	type = getValueInUrl("type");

	if (praticeType !== "examination") {
		var name = void 0;
		if (praticeType === "chapter") {
			name = "章节" + (Number(selectIndex) + 1);
		}
		if (name) {
			$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + "—" + name + " — " + typeChiness[type];
		} else {
			$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + " — " + typeChiness[type];
		}
	} else {
		// 考试模拟，将导航栏盖上蒙层
		$(".toolbarDisable").css("display", "block");

		// 考试模拟时计时开始
		var countdown = setInterval(function () {
			var hours = $(".hours")[0].innerHTML,
			    minutes = $(".minutes")[0].innerHTML,
			    seconds = $(".seconds")[0].innerHTML;
			if (seconds === "00" && minutes === "00" && hours === "00") {
				clearInterval(countdown);
				addLoadingInterface();
				checkAnswer();
				return;
			}

			if (seconds === "00") {
				seconds = "59";

				if (minutes === "00") {
					minutes = "59";
					hours = Number(hours) - 1;
					if (hours < 10) {
						hours = "0" + hours;
					}
					$(".hours")[0].innerHTML = hours;
				} else {
					minutes = Number(minutes) - 1;
					if (minutes < 10) {
						minutes = "0" + minutes;
					}
				}

				$(".minutes")[0].innerHTML = minutes;
			} else {
				seconds = Number(seconds) - 1;
				if (seconds < 10) {
					seconds = "0" + seconds;
				}
			}

			$(".seconds")[0].innerHTML = seconds;
		}, 1000);
	}

	findSubjectByName(subjectName, function (result) {
		var unitId = result[praticeType + "Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function (data) {
			var time = data.time;
			if (time) {
				var hours = time.hours,
				    minutes = time.minutes,
				    seconds = time.seconds;
				if (Number(hours) < 10) {
					hours = "0" + hours;
				}
				if (Number(minutes) < 10) {
					minutes = "0" + minutes;
				}
				if (Number(seconds) < 10) {
					seconds = "0" + seconds;
				}

				$(".time")[0].innerHTML = "<span class='hours'>" + hours + "</span>:<span class='minutes'>" + minutes + "</span>:<span class='seconds'>" + seconds + "</span>";
			}

			if (type) {
				allPraticeContent = data[type];

				switch (type) {
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
			} else {
				for (var i = 0, len = praticeTypeArr.length; i < len; i++) {
					var length = data[praticeTypeArr[i]].length;
					if (length > 0) {
						switch (praticeTypeArr[i]) {
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
						};
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
}

function showPraticeBlockIndexClick(e) {
	var className = getTarget(e).className;
	if ($("." + className.substr(0, className.length - 5)).length > 0) {
		type = className.substr(0, className.length - 5);
		changeTypeStyle();
		addPraticeIndex(currentIndexArray[type].length);
		changePraticeContent(currentIndexArray[type].index);
	}
}

function showPraticeIndexClick(e) {
	if (Number(getTarget(e).innerHTML)) {
		var index = getTarget(e).innerHTML - 1;
		currentIndexArray[type].index = index;
		changePraticeContent(index);
	}
}

function previousClick(target) {
	// 将滚动条滚动到顶部，并添加动画效果
	$("body").animate({
		scrollTop: 0
	}, 300);

	if ($(target).hasClass("disable")) return;

	if (currentIndexArray[type].index === 0) {
		for (var i = 0, len = hasContentTypeArr.length; i < len; i++) {
			if (hasContentTypeArr[i] === type) {
				if (i !== 0) {
					type = hasContentTypeArr[--i];
					changeTypeStyle();
					addPraticeIndex(currentIndexArray[type].length);
					currentIndexArray[type].index = currentIndexArray[type].length - 1;
					changePraticeContent(currentIndexArray[type].index);
				}
				return;
			}
		}
	}

	changePraticeContent(--currentIndexArray[type].index);
}

function nextClick(target) {
	// 将滚动条滚动到顶部，并添加动画效果
	$("body").animate({
		scrollTop: 0
	}, 300);

	if ($(this).hasClass("disable")) return;

	if (currentIndexArray[type].index === currentIndexArray[type].length - 1) {
		for (var i = 0, len = hasContentTypeArr.length; i < len; i++) {
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
}

function runningBtnClick(e) {
	var $target = $(getTarget(e));
	if (!$target.hasClass("disable")) {
		// changeRunningBtnToDisableStatus($target, 15000);
		$target.addClass("disable");
		runningProgramming($(getTarget(e)).parent());
	}
}

function bindEvent() {
	// 当为考试模拟时，点击练习类型事件
	$(".showPraticeBlockIndex").click(function (e) {
		showPraticeBlockIndexClick(e);
	});

	// 点击题目编号事件
	$(".showPraticeIndex").click(function (e) {
		showPraticeIndexClick(e);
	});

	$(".previous").click(function () {
		previousClick(this);
	});

	$(".next").click(function () {
		if (this.value === "提交") {
			if (!getNotChoiceAnswer("Programming")) {
				showTips("请确保所有编程题至少被运行一次！", 1500);
				return;
			}
			showWin("是否确定提交答案？（提交后将不能修改）", function () {
				addLoadingInterface();
				checkAnswer();
			});
			return;
		}
		nextClick(this);
	});

	$(".runningBtn").click(function (e) {
		runningBtnClick(e);
	});
}