"use strict";

var currentAddType = "SingleChoice";

var subjectName, praticeType;

// 实际添加数目
var addSingleChoiceCount = 0,
    addMultipleChoicesCount = 0,
    addTrueOrFalseCount = 0,
    addFillInTheBlankCount = 0,
    addShortAnswerCount = 0,
    addProgrammingCount = 0;

// 包括被删除的总数目
var realSingleChoiceCount = 0,
    realMultipleChoicesCount = 0,
    realTrueOrFalseCount = 0,
    realFillInTheBlankCount = 0,
    realShortAnswerCount = 0,
    realProgrammingCount = 0;

var selectInputTypeCount = 0;

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

// 记录Programing添加的editor，用于后面判断editor是否都不为空
var programingEditorArray = [];

/** 将textarea转换为codemirror编辑器
 * @param id String textarea的id
 * @param mode String 编程类型
 * @return codemirror编辑器对象
*/
function editorStyle(id, mode) {
	var editor = CodeMirror.fromTextArea(document.getElementById(id), {
		mode: mode, //实现Java代码高亮，通过CodeMirror.mimeModes查询支持哪些mode，不支持的mode可通过添加mode文件夹下的js文件将该类型添加
		lineNumbers: true, // 显示行号
		autofocus: true,

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

// 添加单选题
function addSingleChoice() {
	addSingleChoiceCount++;
	realSingleChoiceCount++;
	var name = "singleChoice" + realSingleChoiceCount;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addSingleChoiceCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"allChoices\">\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">A</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\" checked>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">B</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">C</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">D</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input type=\"button\" value=\"\u6DFB\u52A0\u9009\u9879\" class=\"addChoiceBtn\">";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addSingleChoice").append(section);
	return section;
}

// 添加多选题
function addMultipleChoices() {
	addMultipleChoicesCount++;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addMultipleChoicesCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"allChoices\">\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">A</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"checkbox\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">B</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"checkbox\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">C</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"checkbox\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num\">D</span>.\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"checkbox\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input type=\"button\" value=\"\u6DFB\u52A0\u9009\u9879\" class=\"addChoiceBtn\">";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addMultipleChoices").append(section);
	return section;
}

// 添加判断题
function addTrueOrFalse() {
	addTrueOrFalseCount++;
	realTrueOrFalseCount++;
	var name = "trueOrFalse" + realTrueOrFalseCount;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addTrueOrFalseCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"allChoices\">\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num true\">T</span>.\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\" checked>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"choice\">\n\t\t\t\t\t\t\t<span class=\"num false\">F</span>.\n\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + name + "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addTrueOrFalse").append(section);
	return section;
}

// 添加填空题
function addFillInTheBlank() {
	addFillInTheBlankCount++;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addFillInTheBlankCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"allBlank\">\n\t\t\t\t\t\t<div class=\"blank\">\n\t\t\t\t\t\t\t<span class=\"num\">1.</span>\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t\t<input type=\"button\" value=\"+\" class=\"addOtherAnswer\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input type=\"button\" value=\"\u6DFB\u52A0\u7B54\u6848\" class=\"addBlankBtn\">";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addFillInTheBlank").append(section);
	return section;
}

// 添加简答题
function addShortAnswer() {
	addShortAnswerCount++;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"showScore\">\u5206\u503C\uFF1A<input type=\"text\" class=\"textInput\" placeholder=10></div>\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addShortAnswerCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"answer\">\n\t\t\t\t\t\t<textarea></textarea>\n\t\t\t\t\t\t<a class=\"ShortAnswerHelp\" href=\"../ShortAnswerHelp\" target=\"blank\">\u7B54\u6848\u4E66\u5199\u89C4\u5219\uFF1F</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"addProfessionalNouns\">\n\t\t\t\t\t\t\u7B54\u6848\u4E2D\u7684\u4E13\u6709\u540D\u8BCD\u6709\uFF1A\n\t\t\t\t\t\t<input type=\"button\" value=\"\u6DFB\u52A0\u4E13\u6709\u540D\u8BCD\" class=\"addProfessionalNounsBtn\">\n\t\t\t\t\t</div>";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addShortAnswer").append(section);

	if (praticeType === "examination") {
		$(".addProfessionalNouns").css("display", "block");
		$(".showScore").css("display", "block");
	}

	return section;
}

/** 输入、输出的基本类型
 * @param count Number 第几个类型选择，用于唯一标识
 * @param Prefix String 唯一标识前缀
 * @param firstInputChecked Boolean 是否默认选择第一个选项
 * @return String 类型选择的innerHTML
*/
function basicInputType(count, Prefix, firstInputChecked) {
	var prefix = Prefix ? Prefix : "";

	return "<input type=\"radio\" id=\"" + prefix + "Number" + count + "\" name=\"selectInputType" + count + (firstInputChecked ? '" checked' : '"') + " value=\"Number\"><label for=\"" + prefix + "Number" + count + "\">Number</label><input type=\"radio\" id=\"" + prefix + "int" + count + "\" name=\"selectInputType" + count + "\" value=\"int\"><label for=\"" + prefix + "int" + count + "\">int</label><input type=\"radio\" id=\"" + prefix + "float" + count + "\" name=\"selectInputType" + count + "\" value=\"float\"><label for=\"" + prefix + "float" + count + "\">float</label>\n\t<input type=\"radio\" id=\"" + prefix + "double" + count + "\" name=\"selectInputType" + count + "\" value=\"double\"><label for=\"" + prefix + "double" + count + "\">double</label>\n\t<input type=\"radio\" id=\"" + prefix + "String" + count + "\" name=\"selectInputType" + count + "\" value=\"String\"><label for=\"" + prefix + "String" + count + "\">String</label>\n\t<input type=\"radio\" id=\"" + prefix + "char" + count + "\" name=\"selectInputType" + count + "\" value=\"char\"><label for=\"" + prefix + "char" + count + "\">char</label>\n\t<input type=\"radio\" id=\"" + prefix + "boolean" + count + "\" name=\"selectInputType" + count + "\" value=\"boolean\"><label for=\"" + prefix + "boolean" + count + "\">boolean</label>";
}

/** 基本类型选择项+数组选择项
 * @param count Number 第几个类型选择，用于唯一标识
 * @return String 类型选择的innerHTML
*/
function selectInputType(count) {
	return basicInputType(count) + "<input type=\"radio\" id=\"Array" + count + "\" name=\"selectInputType" + count + "\" value=\"Array\"><label for=\"Array" + count + "\">Array</label>" + "<div class=\"arrayChildType\">\u3010\u6570\u7EC4\u7C7B\u578B\uFF1A" + basicInputType(count + 1, "array-", true) + "\u3011</div><input type=\"button\" value=\"X\" class=\"removeSelectType\">";
}

// 添加编程题
function addProgramming() {
	var selectInnerHtml = "<select>";
	for (var k in programmingTypeMode) {
		selectInnerHtml = selectInnerHtml + "<option>" + k + "</option>";
	}
	selectInnerHtml = selectInnerHtml + "</select>";

	addProgrammingCount++;
	realProgrammingCount++;
	var content = "<input type=\"button\" value=\"X\" class=\"remove\">\n\t\t\t\t\t<div class=\"showScore\">\u5206\u503C\uFF1A<input type=\"text\" class=\"textInput\" placeholder=30></div>\n\t\t\t\t\t<div class=\"topic\">\u9898\u76EE<span class=\"topicNum\">" + addProgrammingCount + "</span>\uFF1A<input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t<div class=\"input\">\n\t\t\t\t\t\t<div class=\"description\">\u8F93\u5165\u63CF\u8FF0\uFF1A<input class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"example\">\u8F93\u5165\u6837\u4F8B\uFF1A<input class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"inputType\">\u8F93\u5165\u7C7B\u578B\uFF08\u6309\u7167\u8F93\u5165\u987A\u5E8F\u9009\u62E9\uFF09\uFF1A<input type=\"button\" value=\"+\" class=\"addInputType\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"output\">\n\t\t\t\t\t\t<div class=\"description\">\u8F93\u51FA\u63CF\u8FF0\uFF1A<input class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"example\">\u8F93\u51FA\u6837\u4F8B\uFF1A<input class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"inputType\">\u8F93\u51FA\u7C7B\u578B\uFF08\u6309\u7167\u8F93\u51FA\u987A\u5E8F\u9009\u62E9\uFF09\uFF1A<input type=\"button\" value=\"+\" class=\"addInputType\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"answer\">\n\t\t\t\t\t\t<div class=\"programmingType\">\n\t\t\t\t\t\t\t\u7B54\u6848\uFF1A" + selectInnerHtml + "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<a href=\"help?mode=c\" target=\"blank\" class=\"help\">\u5728\u7EBF\u5E2E\u52A9</a>\n\t\t\t\t\t\t<textarea id=\"programming" + realProgrammingCount + "\"></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t\t<input type=\"button\" value=\"\u8FD0\u884C\" class=\"runningBtn\">\n\t\t\t\t\t<div class=\"runningResult\">\n\t\t\t\t\t\t<div class=\"runningTitle\">\u8FD0\u884C\u7ED3\u679C\uFF1A</div>\n\t\t\t\t\t\t<div class=\"runningContent\"></div>\n\t\t\t\t\t</div>";

	var section = document.createElement("section");
	section.className = "content";
	$(section).html(content);
	$(".addProgramming").append(section);

	if (praticeType === "examination") {
		$(".showScore").css("display", "block");
	}

	var editor = editorStyle("programming" + addProgrammingCount, "text/x-c");
	editor.setSize("auto", "700px");
	programingEditorArray.push({
		editor: editor,
		textareaId: "programming" + realProgrammingCount
	});

	$(section).change(function (e) {
		var target = getTarget(e);
		if (target.id.indexOf("Array") === 0) {
			$(target).parent().find(".arrayChildType").css("display", "block");
		} else {
			$(target).parent().find(".arrayChildType").css("display", "none");
		}
	});

	$(section).find(".addInputType").click(function (e) {
		var div = document.createElement("div");
		div.className = "selectInputType";
		$(div).html(selectInputType(selectInputTypeCount));
		$(getTarget(e)).before(div);
		selectInputTypeCount += 2;

		$(section).find(".removeSelectType").click(function (e) {
			var selectInputType = $(getTarget(e)).parent();
			selectInputType.remove();
		});
	});

	// 下拉框可选择代码类型，动态改变编辑器代码类型
	$(section).find(".programmingType select").change(function (e) {
		var selectType = $(getTarget(e)).find("option:selected").text();
		editor.setOption("mode", programmingTypeMode[selectType]);

		$($(section).find(".runningResult > .runningContent")[0]).html("");

		var mode = $(getTarget(e)).find("option:selected").text();
		if (mode === "c++") {
			mode = "cpp";
		} else if (mode === "c#") {
			mode = "cs";
		}
		$(section).find(".help").attr("href", "help?mode=" + mode);
	});

	editor.on("change", function () {
		$($(section).find(".runningResult > .runningContent")[0]).html("");
	});

	return section;
}

/** 获取所有的某练习类型（chapter、examination、random）的所有unitId
 * @param callback Function 回调函数
*/
function getAllExercise(callback) {
	findSubjectByName(subjectName, function (data) {
		try {
			callback(data[praticeType + "Pratices"]);
		} catch (e) {
			callback();
		}
	});
}

/** 显示某个类型的索引
 * @param praticeType String 练习类型
*/
function showSomePraticeType(praticeType) {
	// if (praticeType === "Programming") {
	// 	// $(".next").css("width", "60px");
	// 	$(".next").val("提交");
	// }
	// else {
	// 	// $(".next").css("width", "70px");
	// 	$(".next").val(">");
	// }
	$(".navContent > div").css("background", "#eff0dc");
	$("." + praticeType).css("background", "#f5f6eb");

	$(".addPraticeContent > section").css("display", "none");
	$(".add" + praticeType).css("display", "block");

	currentAddType = praticeType;
}

/** 添加选项
 * @param $addChoiceSection Object 需要添加选项的section对象
*/
function addMoreChoice($addChoiceSection) {
	var addInputType = void 0,
	    addInputName = "";
	var bgClassName = $addChoiceSection.parent().parent()[0].className;
	if (bgClassName === "addSingleChoice") {
		addInputType = "radio";
		addInputName = $addChoiceSection.find(".choice input[type=radio]")[0].name;
	} else {
		addInputType = "checkbox";
	}

	var num = String.fromCharCode(65 + $addChoiceSection.find(".choice").length);
	var div = document.createElement("div");
	div.className = "choice";
	div.innerHTML = "<span class=\"num\">" + num + "</span>.\n\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t<input type=\"" + addInputType + "\" name=\"" + addInputName + "\">";
	$addChoiceSection.append(div);
}

/** 添加更多填充空格选项
 * @param $addBlankSection Object 需要添加更多空格选项的section对象
*/
function addMoreBlank($addBlankSection) {
	var num = $addBlankSection.find(".blank").length + 1;
	var div = document.createElement("div");
	div.className = "blank";
	div.innerHTML = "<span class=\"num\">" + num + ".</span>\n\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t<input type=\"button\" value=\"+\" class=\"addOtherAnswer\">";
	$addBlankSection.append(div);
}

/** 添加更多简答题的专有名词
 * @param $addProfessionalNounsBtn Object 添加专有名词按钮对象
*/
function addMoreProfessionalNouns($addProfessionalNounsBtn) {
	var count = $addProfessionalNounsBtn.parent().find(".textInput").length + 1;

	var div = document.createElement("div");
	div.className = "professionalNounsDiv";
	div.innerHTML = count + ". <input type='text' class='textInput'>";
	$addProfessionalNounsBtn.before(div);
	return div;
}

/** 添加更多可能的答案
 * @param $addOtherAnswerBtn Object 点击添加更多可能的答案的按钮
*/
function addMoreOtherAnswer($addOtherAnswerBtn) {
	var appendContent = "<br>\u3010\u6216\uFF1A<input type=\"text\" class=\"textInput\">\u3011";
	$addOtherAnswerBtn.before(appendContent);
}

/** 获取所要添加的选择题内容
 * @param $content Object 所要添加的全部content对象
*/
function getChoiceContent($content) {
	console.log($content);
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

		if (praticeType === "examination") {
			allContent[allContent.length - 1].score = score;
		}
	}

	return allContent;
}

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
		for (var j = 0, len1 = allProfessionalNouns.length; j < len1; j++) {
			professionalNounsArr.push($(allProfessionalNouns[j]).find(".textInput").val());
		}

		allContent.push({
			topic: topic,
			answer: [{
				content: answer,
				professionalNounsArr: professionalNounsArr
			}]
		});

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

/** 获取编程题各项设定内容
 * @param $objTarget Object 编程题对象
*/
function getProgrammingObj($objTarget) {
	var obj = {};

	obj.description = $objTarget.find(".description > .textInput").val();
	obj.example = $objTarget.find(".example > .textInput").val();

	var selectInputType = $objTarget.find(".inputType > .selectInputType"),
	    selectInputTypeArray = [];
	for (var i = 0, len = selectInputType.length; i < len; i++) {
		var allRadio = $(selectInputType[i]).find("> input[type=radio]");
		for (var j = 0, len1 = allRadio.length; j < len1; j++) {
			if (allRadio[j].checked) {
				var value = allRadio[j].value;
				console.log(allRadio[j]);
				if (value === "Array") {
					var childInputType = $(selectInputType[i]).find(".arrayChildType > input[type=radio]");
					for (var t = 0, len2 = childInputType.length; t < len2; t++) {
						if (childInputType[t].checked) {
							selectInputTypeArray.push({
								thisType: allRadio[j].value,
								childType: childInputType[t].value
							});
							break;
						}
					}
				} else {
					selectInputTypeArray.push({ thisType: allRadio[j].value });
				}
				break;
			}
		}
	}

	obj.type = selectInputTypeArray;

	return obj;
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

/** 在以习题为单位的数据库中添加一个新习题
 * @param contentObj Object 要添加的习题内容
 * @param callback Function 回调函数
*/
function addPratice(contentObj, callback) {
	console.log(contentObj);
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "save",
			saveData: contentObj
		},
		success: function success(result) {
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
		success: function success(result) {
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
	var update = {};
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
		success: function success(data) {
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
	var update = {},
	    operation = "addToSet";

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
		success: function success(data) {
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
function savePraticesInData(contentObj, totalCount, examinationTime, existTime) {
	if (totalCount === 0) {
		return;
	}

	var randomUnitId = void 0;
	findSubjectByName(subjectName, function (result) {
		randomUnitId = result.randomPratices;
	});

	addUnit(function (unitId) {
		addOneUnitInSubject({
			unitType: praticeType + "Pratices",
			unitId: unitId,
			subjectName: subjectName,
			callback: function callback() {
				var _loop = function _loop() {
					var content = contentObj[key];

					var _loop2 = function _loop2(i, len) {
						(function (key) {
							addPratice(content[i], function (praticeId) {
								addPraticeInUnits({
									praticeType: key,
									praticeId: praticeId,
									unitId: unitId,
									callback: function callback(result) {
										console.log(content[i]);
									}
								});

								// 将习题添加进随机练习里面
								addPraticeInUnits({
									praticeType: key,
									praticeId: praticeId,
									unitId: randomUnitId,
									callback: function callback(result) {
										console.log(content[i]);
									}
								});
							});
						})(key);
					};

					for (var i = 0, len = content.length; i < len; i++) {
						_loop2(i, len);
					}
				};

				for (var key in contentObj) {
					_loop();
				}

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
			}
		});
	});

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
}

/** 删除题目
*/
function removePratice($target) {
	$target.remove();

	switch (currentAddType) {
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
			programingEditorArray.splice($target.find(".topic .topicNum")[0].innerHTML - 1, 1);
			break;
	}

	var allTopicNum = $(".add" + currentAddType + " .topicNum");
	for (var i = 0, len = allTopicNum.length; i < len; i++) {
		$(allTopicNum[i]).html(i + 1);
	}
}

/** 存储添加的所有习题
*/
function savePratices(examinationTime, existTime) {
	var SingleChoiceContentArr = [],
	    MultipleChoicesContentArr = [],
	    TrueOrFalseContentArr = [],
	    FillInTheBlankContentArr = [],
	    ShortAnswerContentArr = [],
	    ProgrammingContentArr = [];

	var SingleChoiceContent = $(".addSingleChoice > .content");
	var MultipleChoicesContent = $(".addMultipleChoices > .content");
	var TrueOrFalseContent = $(".addTrueOrFalse > .content");
	var FillInTheBlankContent = $(".addFillInTheBlank > .content");
	var ShortAnswerContent = $(".addShortAnswer > .content");
	var ProgrammingContent = $(".addProgramming > .content");

	SingleChoiceContentArr = getChoiceContent(SingleChoiceContent);
	MultipleChoicesContentArr = getChoiceContent(MultipleChoicesContent);
	TrueOrFalseContentArr = getChoiceContent(TrueOrFalseContent);
	FillInTheBlankContentArr = getFillInTheBlankContent(FillInTheBlankContent);
	ShortAnswerContentArr = getShortAnswerContent(ShortAnswerContent);
	ProgrammingContentArr = getProgrammingContent(ProgrammingContent);

	console.log(SingleChoiceContentArr);
	console.log(MultipleChoicesContentArr);
	console.log(TrueOrFalseContentArr);
	console.log(FillInTheBlankContentArr);
	console.log(ShortAnswerContentArr);
	console.log(ProgrammingContentArr);

	var totalCount = SingleChoiceContentArr.length + MultipleChoicesContentArr.length + TrueOrFalseContentArr.length + FillInTheBlankContentArr.length + ShortAnswerContentArr.length + ProgrammingContentArr.length;

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
		ShortAnswer: ShortAnswerContentArr,
		Programming: ProgrammingContentArr
	}, totalCount, examinationTime, existTime);

	window.location.href = "../pratice?subjectName=" + subjectName;
}

// 判断是否所有的空格都不为空
function checkAllTextInputHasVal() {
	var allTextInput = $(".add" + currentAddType + " .textInput");

	for (var i = 0, len = allTextInput.length; i < len; i++) {
		if (!allTextInput[i].value) {
			var parentClassName = $(allTextInput[i]).parent()[0].className;
			if (parentClassName === "description" || parentClassName === "example") continue;
			if (parentClassName === "showScore") {
				if ($(allTextInput[i]).attr("placeholder")) {
					continue;
				}
			}
			return false;
		}
	}

	var allShortAnswerContent = $(".addShortAnswer > .content");
	for (var _i = 0, _len = allShortAnswerContent.length; _i < _len; _i++) {
		if (!$(allShortAnswerContent[_i]).find(".answer > textarea").val()) {
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

	for (var _i2 = 0, _len2 = programingEditorArray.length; _i2 < _len2; _i2++) {
		if (!programingEditorArray[_i2].editor.getValue()) {
			return false;
		}
	}

	return true;
}

// 判断多选题是否都勾选了答案
function checkMultipleChoicesAnswerExit() {
	var allContent = $(".addMultipleChoices > .content");

	if (allContent.length === 0) return true;

	var lastMultipleChoicesContent = $(allContent[allContent.length - 1]).find(".allChoices > .choice");
	for (var i = 0, len = lastMultipleChoicesContent.length; i < len; i++) {
		if ($(lastMultipleChoicesContent[i]).find("input[type=checkbox]")[0].checked) {
			return true;
		}
	}

	return false;
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

/** 检测是否所有代码都能成功运行
*/
function checkAllProgrammingRunningSuccess() {
	var allProgrammingContent = $(".addProgramming > .content");
	for (var i = 0, len = allProgrammingContent.length; i < len; i++) {
		var runningContent = $(allProgrammingContent[i]).find(".runningResult > .runningContent")[0].innerHTML;
		if (runningContent !== "<pre>编译通过，能正常运行！</pre>") {
			return false;
		}
	}
	return true;
}

/** 检测考试时间是否合理
*/
function checkTimeValidation() {
	if ($(".examinationTime > input").hasClass("invalid")) {
		showTips("请确保考试时间的值符合要求！", 1500);
		return false;
	}

	var hours = $(".examinationTime > .hours").val(),
	    minutes = $(".examinationTime > .minutes").val(),
	    seconds = $(".examinationTime > .seconds").val();

	if (!hours) {
		hours = $(".examinationTime > .hours").attr("placeholder");
	}
	if (!minutes) {
		minutes = $(".examinationTime > .minutes").attr("placeholder");
	}
	if (!seconds) {
		seconds = $(".examinationTime > .seconds").attr("placeholder");
	}

	if (Number(hours + minutes + seconds) <= 0) {
		showTips("考试时间必须大于0s！", 1500);
		return false;
	}
	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
}

// 获得试卷有效时间
function getExistTime() {
	var $beginTimeDiv = $(".existTime > .beginTime"),
	    $endTimeDiv = $(".existTime > .endTime"),
	    $beginTimeInput = $beginTimeDiv.find("input"),
	    $endTimeInput = $endTimeDiv.find("input"),
	    beginTimeDivHasEmptyInput = false,
	    endTimeDivHasEmptyInput = false,
	    beginTimeDivEmptyInputCount = 0,
	    endTimeDivEmptyInputCount = 0,
	    beginHour = $(".beginTime .H").val(),
	    beginMinute = $(".beginTime .M").val(),
	    beginSecond = $(".beginTime .S").val(),
	    endHour = $(".endTime .H").val(),
	    endMinute = $(".endTime .M").val(),
	    endSecond = $(".endTime .S").val(),
	    beginTime = void 0,
	    endTime = void 0,
	    existTime = {};

	beginHour = beginHour ? Number(beginHour) : 0;beginMinute = beginMinute ? Number(beginMinute) : 0;beginSecond = beginSecond ? Number(beginSecond) : 0;
	endHour = endHour ? Number(endHour) : 0;endMinute = endMinute ? Number(endMinute) : 0;endSecond = endSecond ? Number(endSecond) : 0;

	if ($(".existTime input").hasClass("invalid")) {
		return false;
	}

	for (var i = 0, len = $beginTimeInput.length; i < len; i++) {
		if (!$beginTimeInput[i].value) {
			var classname = $beginTimeInput[i].className;
			if (classname !== "H" && classname !== "M" && classname !== "S") {
				beginTimeDivHasEmptyInput = true;
				beginTimeDivEmptyInputCount++;
			}
		}
	}

	for (var _i3 = 0, _len3 = $endTimeInput.length; _i3 < _len3; _i3++) {
		if (!$endTimeInput[_i3].value) {
			var _classname = $endTimeInput[_i3].className;
			if (_classname !== "H" && _classname !== "M" && _classname !== "S") {
				endTimeDivHasEmptyInput = true;
				endTimeDivEmptyInputCount++;
			}
		}
	}

	if (beginTimeDivHasEmptyInput) {
		if (beginTimeDivEmptyInputCount < 3) {
			return false;
		}
	}

	if (endTimeDivHasEmptyInput) {
		if (endTimeDivEmptyInputCount < 3) {
			return false;
		}
	}

	if (beginTimeDivEmptyInputCount === 3) {
		beginTime = "";
	} else {
		beginTime = new Date(Number($(".beginTime .year").val()) + "/" + Number($(".beginTime .month").val()) + "/" + Number($(".beginTime .day").val()) + " " + beginHour + ":" + beginMinute + ":" + beginSecond);
	}

	if (endTimeDivEmptyInputCount === 3) {
		endTime = "";
	} else {
		endTime = new Date(Number($(".endTime .year").val()) + "/" + Number($(".endTime .month").val()) + "/" + Number($(".endTime .day").val()) + " " + endHour + ":" + endMinute + ":" + endSecond);
	}

	if (beginTime && endTime) {
		if (beginTime > endTime) {
			return false;
		}
	}

	existTime = {
		beginTime: beginTime,
		endTime: endTime
	};
	return existTime;
}

/** 进行代码运行
 * @param $programmingContent jQuery Object 该编程题目块
*/
function runningProgramming($programmingContent) {
	var textareaId = $programmingContent.find(".answer textarea")[0].id,
	    editor = void 0;
	for (var i = 0, len = programingEditorArray.length; i < len; i++) {
		if (programingEditorArray[i].textareaId === textareaId) {
			editor = programingEditorArray[i].editor;
			break;
		}
	}
	var editorContent = editor.getValue();

	var inputObj = getProgrammingObj($programmingContent.find(".input")),
	    outputObj = getProgrammingObj($programmingContent.find(".output"));

	var programmingLanguage = $programmingContent.find(".answer > .programmingType > select option:selected").text();

	$($programmingContent.find(".runningResult > .runningContent")[0]).html("<div class='loading'></div>");

	runningCode(programmingLanguage, editorContent, inputObj.type, outputObj.type, function (result) {
		console.log(inputObj.type);
		console.log(result);
		if (!result.error) {
			if (programmingLanguage !== "javascript" && result.inputCount !== inputObj.type.length) {
				result = "选择的参数类型与实际不符！";
			} else {
				result = "编译通过，能正常运行！";
			}
		} else {
			result = result.error;
		}
		$($programmingContent.find(".runningResult > .runningContent")[0]).html("<pre>" + result + "</pre>");
		$programmingContent.find(".runningBtn").removeClass("disable");
	});
}

function init() {
	subjectName = decodeURIComponent(getValueInUrl("subjectName"));
	praticeType = getValueInUrl("praticeType");

	$(".time").html(subjectName + " — " + praticeTypeChiness[praticeType]);

	// 正确显示当前添加题目的title
	var count = 0;
	getAllExercise(function (result) {
		if (result) {
			count = result.length;
		}

		var innerHTML = "";
		switch (praticeType) {
			case "chapter":
				innerHTML = " — 第 " + ++count + " 章";
				break;
			case "examination":
				$(".existTime").css("display", "block");
				$(".examinationTime").css("display", "block");
				$(".showScore").css("display", "block");
				innerHTML = " — 试卷 " + ++count;
				break;
		}
		$(".time")[0].innerHTML += innerHTML;
	});
}

function bindEvent() {
	$(".navContent").click(function (e) {
		if (!checkAllTextInputHasVal()) {
			showTips("存在没有填写的空格！", 1000);
			return;
		}
		if (!checkMultipleChoicesAnswerExit()) {
			showTips("存在题目没有勾选标准答案！", 1000);
			return;
		}
		var className = getTarget(e).className;
		if (className !== "navContent") {
			showSomePraticeType(className);
		}
	});

	$(".addMore")[0].onclick = function () {
		switch (currentAddType) {
			case "SingleChoice":
				addSingleChoice();
				break;
			case "MultipleChoices":
				if (checkMultipleChoicesAnswerExit()) {
					addMultipleChoices();
				} else {
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
	};

	$(".addPraticeContent").click(function (e) {
		var className = getTarget(e).className;
		switch (className) {
			case "addChoiceBtn":
				addMoreChoice($(getTarget(e)).parent().find(".allChoices"));
				break;
			case "addBlankBtn":
				addMoreBlank($(getTarget(e)).parent().find(".allBlank"));
				break;
			case "addProfessionalNounsBtn":
				addMoreProfessionalNouns($(getTarget(e)));
				break;
			case "addOtherAnswer":
				addMoreOtherAnswer($(getTarget(e)));
				break;
			case "remove":
				// showWin("确定删除该习题？", function(e) {
				// 	removePratice($(getTarget(e)).parent());
				// });
				removePratice($(getTarget(e)).parent());
				break;
			case "runningBtn":
				var $target = $(getTarget(e));
				if (!$target.hasClass("disable")) {
					// changeRunningBtnToDisableStatus($target, 15000);
					$target.addClass("disable");
					runningProgramming($(getTarget(e)).parent());
				}
				break;
		}
	});

	if (praticeType === "examination") {
		$(".examinationTime > input").change(function (e) {
			var target = getTarget(e);
			var classname = target.className,
			    value = Number(target.value);

			if (value < 0) {
				$(target).addClass("invalid");
			} else {
				if ((classname === "minutes" || classname === "seconds") && value > 59) {
					$(target).addClass("invalid");
				} else if (value > 99) {
					$(target).addClass("invalid");
				} else {
					$(target).removeClass("invalid");
				}
			}
		});

		$(".existTime input").change(function (e) {
			var target = getTarget(e),
			    classname = target.className,
			    value = target.value ? Number(target.value) : target.value;

			if (value < 0) {
				$(target).addClass("invalid");
			} else {
				if (classname === "year" && value === 0) {
					$(target).addClass("invalid");
				}
				if (classname === "month" && (value === 0 || value > 12)) {
					$(target).addClass("invalid");
				} else if (classname === "day" && (value === 0 || value > 31)) {
					$(target).addClass("invalid");
				} else if (classname === "H" && value > 23) {
					$(target).addClass("invalid");
				} else if ((classname === "M" || classname === "S") && value > 59) {
					$(target).addClass("invalid");
				} else {
					$(target).removeClass("invalid");
				}
			}
		});
	}

	// $(".previous").click(function() {
	// 	let showPraticeType;
	// 	if (currentAddType === "SingleChoice") {
	// 		return;
	// 	}
	// 	if (!checkAllTextInputHasVal()) {
	// 		showTips("存在没有填写的空格！", 1000);
	// 		return;
	// 	}
	// 	else if (currentAddType === "MultipleChoices") {
	// 		if (checkMultipleChoicesAnswerExit()) {
	// 			showPraticeType = "SingleChoice";
	// 		}
	// 		else {
	// 			showTips("存在题目没有勾选标准答案！", 1000);
	// 			return;
	// 		}
	// 	}
	// 	else if (currentAddType === "TrueOrFalse") {
	// 		showPraticeType = "MultipleChoices";
	// 	}
	// 	else if (currentAddType === "FillInTheBlank") {
	// 		showPraticeType = "TrueOrFalse";
	// 	}
	// 	else if (currentAddType === "ShortAnswer") {
	// 		showPraticeType = "FillInTheBlank";
	// 	}
	// 	else if (currentAddType === "Programming") {
	// 		showPraticeType = "ShortAnswer";
	// 	}
	// 	showSomePraticeType(showPraticeType);
	// });

	// $(".next").click(function() {
	// 	if (!checkAllTextInputHasVal()) {
	// 		showTips("存在没有填写的空格！", 1000);
	// 		return;
	// 	}
	// 	if (!checkAllProgrammingRunningSuccess()) {
	// 		showTips("请确保所有编译都能成功运行！", 1000);
	// 		return;
	// 	}
	// 	if (this.value === "提交") {
	// 		showWin("确定提交所添加的所有习题？", function() {
	// 			savePratices();
	// 		});
	// 		return;
	// 	}
	// 	let showPraticeType;
	// 	if (currentAddType === "SingleChoice") {
	// 		showPraticeType = "MultipleChoices";
	// 	}
	// 	else if (currentAddType === "MultipleChoices") {
	// 		if (checkMultipleChoicesAnswerExit()) {
	// 			showPraticeType = "TrueOrFalse";
	// 		}
	// 		else {
	// 			showTips("存在题目没有勾选标准答案！", 1000);
	// 			return;
	// 		}
	// 	}
	// 	else if (currentAddType === "TrueOrFalse") {
	// 		showPraticeType = "FillInTheBlank";
	// 	}
	// 	else if (currentAddType === "FillInTheBlank") {
	// 		showPraticeType = "ShortAnswer";
	// 	}
	// 	else if (currentAddType === "ShortAnswer") {
	// 		showPraticeType = "Programming";
	// 	}
	// 	showSomePraticeType(showPraticeType);
	// });

	$(".submitBtn").click(function () {
		if (!checkAllTextInputHasVal()) {
			showTips("存在没有填写的空格！", 1000);
			return;
		}
		if (!checkMultipleChoicesAnswerExit()) {
			showTips("存在题目没有勾选标准答案！", 1000);
			return;
		}
		if (!checkAllProgrammingRunningSuccess()) {
			showTips("请确保所有编译都能成功运行！", 1000);
			return;
		}

		var examinationTime = void 0,
		    existTime = void 0;
		if (praticeType === "examination") {
			existTime = getExistTime();
			console.log(existTime);
			if (!existTime) {
				showTips("请确保试卷开放时间的值符合要求！", 1500);
				return;
			}
			examinationTime = checkTimeValidation();
			if (!examinationTime) {
				return;
			}
		}

		showWin("确定提交所添加的所有习题？", function () {
			savePratices(examinationTime, existTime);
		});
	});
}