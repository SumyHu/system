let praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

let programmingTypeMode = {
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
}

let subjectName, praticeType, selectIndex, type, allPraticeContent;

let currentIndexArray = {};   // 存储当前所有类型的题目下标

let hasContentTypeArr = [];   // 存储当前有题目的类型名

// 当练习类型为考试模拟时，进行正确答案和考生答案存储及匹配
let examinationCorrectAnswer = {}, examinationStudentAnswer = {}, 
	scoresObj = {
		SingleChoice: [],
		MultipleChoices: [],
		TrueOrFalse: [],
		FillInTheBlank: [],
		ShortAnswer: [],
		Programming: []
	};

// 记录Programing添加的editor，用于后面判断editor是否都不为空
let programingEditorArray = [];

/** 实现代码编辑器样式
 * @param id String textarea的id
 * @param mode String 代码类型
*/
function editorStyle(id, mode) {
	var editor=CodeMirror.fromTextArea(document.getElementById(id), {
            mode: mode, //实现Java代码高亮，通过CodeMirror.mimeModes查询支持哪些mode，不支持的mode可通过添加mode文件夹下的js文件将该类型添加
            lineNumbers: true,   // 显示行号

	        //设置主题
	        // theme: "seti",
	        theme: "monokai",

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

// 当练习类型为考试模拟时，添加类型块索引
function addPraticeBlockIndex() {
	$(".showPraticeBlockIndex").css("display", "block");
	for(let i=0, len=hasContentTypeArr.length; i<len; i++) {
		let div = document.createElement("div");
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
	for(let i=1; i<=count; i++) {
		let div = document.createElement("div");
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
	findPraticesById(praticeId, function(result) {
		let sec = document.createElement("section");
		sec.className = "content";
		let showIndex = index+1, inputType;

		let innerHtml = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic;

		if (praticeType === "examination") {
			innerHtml += ` (  <span class="score">` + result.score + `</span>分 )`;
		}
		innerHtml += `</p><div class="answer">`;

		if (addPraticeType === "MultipleChoices") {
			inputType = "checkbox";
		}
		else {
			inputType = "radio";
		}
		for(let i=0, len=result.choices.length; i<len; i++) {
			let choiceContent = result.choices[i].choiceContent;
			innerHtml = innerHtml
							+ `<div>
									<input type="` + inputType + `" id="` + addPraticeType + showIndex + i + `" name="` + addPraticeType +  showIndex + `">
									<label for="` + addPraticeType + showIndex + i + `">
										<span class="num">` + result.choices[i].num + `</span>
									` + (choiceContent?choiceContent:"") + `</label>
							   </div>`;
		}

		sec.innerHTML = innerHtml + `</div>`;

		if (praticeType !== "examination") {
			sec.innerHTML = sec.innerHTML + `<div class="choiceAnswerBlock">
										<div class="showAnswer">查看正确答案<span class="icon">︽</span></div>
										<div class="answerContent">` + result.answer.join(",") + `</div>
									</div>`;
		}
		else {
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
	let section = document.createElement("section");
	section.className = addPraticeType;
	if (praticeType === "random") {
		let count = 0;
		let length = praticeIdArr.length;
		let tempArr = [];
		for(let i=0, len=praticeIdArr.length; i<len; i++) {
			tempArr.push(praticeIdArr[i]);
		}
		while(count < length) {
			let randomNum = parseInt(Math.random()*tempArr.length);
			addChoicePraticesContent(section, tempArr[randomNum], count, addPraticeType);
			tempArr.splice(randomNum, 1);
			count++;
		}
	}
	else {
		if (praticeType === "examination") {
			examinationCorrectAnswer[addPraticeType] = {
				answer: [],
				score: 0
			};
		}
		praticeIdArr.forEach(function(praticeId, index, array) {
			addChoicePraticesContent(section, praticeId, index, addPraticeType);
		});
	}

	$(".choiceAnswerBlock > .showAnswer").click(function(e) {
		let $shortAnswer;
		if (getTarget(e).className === "icon") {
			$showAnswer = $(getTarget(e)).parent();
		}
		else {
			$showAnswer = $(getTarget(e));
		}
		let $answerBlock = $showAnswer.parent(".choiceAnswerBlock");
		let height = $answerBlock.css("height");
		if (height === "35px") {
			$showAnswer.find(".icon")[0].innerHTML = "︾";
			$answerBlock.css("height", "80px");
		}
		else {
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
	findPraticesById(praticeId, function(result) {
		console.log(result);
		let sec = document.createElement("section");
		sec.className = "content";
		let showIndex = index+1;

		let innerHtml = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic;

		if (praticeType === "examination") {
			innerHtml += ` (  <span class="score">` + result.score + `</span>分 )`;
		}
		innerHtml += `</p><div class="answer">`;

		if (addPraticeType === "FillInTheBlank") {
			for(let i=1, len=result.answer.length; i<=len; i++) {
				innerHtml = innerHtml
							+ `<div>
									<span class="num">` + i + `</span>
									<input type="text" class="textInput">
							    </div>`;
			}
			sec.innerHTML = innerHtml + `</div>`;

			if (praticeType !== "examination") {
				let answer = result.answer, answerHtml = "";
				for(let i=0, len=answer.length; i<len; i++) {
					answerHtml = answerHtml + "<div>" + 	Number(Number(i)+1) + ". " + answer[i].join(" 或 ") + "</div>";
				}

				sec.innerHTML = sec.innerHTML + `<div class="answerBlock">
											<div class="showAnswer">查看正确答案<span class="icon">︽</span></div>
											<div class="answerContent">` + answerHtml + `</div>
										</div>`;
			}
			else {
				examinationCorrectAnswer[addPraticeType].answer.push(result.answer);

				if (index === 0) {
					examinationCorrectAnswer[addPraticeType].score = result.score;
				}
			}

			$(section).append(sec);
			$(".flip").before(section);
		}
		else if (addPraticeType === "ShortAnswer") {
			innerHtml += "<textarea></textarea><p class='ShortAnswerTips'>ps：尽量将带有否定意义的词写成“否定词+形容词”的形式，如将“不变”写成“不改变”或“不会变化”之类的。</p>";
			sec.innerHTML = innerHtml + `</div>`;

			if (praticeType !== "examination") {
				let answerHtml = result.answer[0].content;
				
				sec.innerHTML = sec.innerHTML + `<div class="answerBlock">
											<div class="showAnswer">查看正确答案<span class="icon">︽</span></div>
											<div class="answerContent">` + answerHtml.replace(/[【】（\d*）{}]/g, "") + `</div>
										</div>`;
			}
			else {
				examinationCorrectAnswer[addPraticeType].push({
					answer: result.answer,
					score: result.score
				});
			}

			$(section).append(sec);
			$(".flip").before(section);
		}
		else if (addPraticeType === "Programming") {
			let inputContent = result.answer[0].input, outputContent = result.answer[0].output;
			let inputType = [], outputType = [];
			if (inputContent.type) {
				for(let i=0, len=inputContent.type.length; i<len; i++) {
					inputType.push(inputContent.type[i].thisType);
					if (inputContent.type[i].childType) {
						inputType[inputType.length-1] += "(" + inputContent.type[i].childType + ")";
					}
				}
			}
		
			if (outputContent.type) {
				for(let i=0, len=outputContent.type.length; i<len; i++) {
					outputType.push(outputContent.type[i].thisType);
					if (outputContent.type[i].childType) {
						outputType[outputType.length-1] += "(" + outputContent.type[i].childType + ")";
					}
				}
			}

			let modeChiness = result.answer[0].programmingTypeMode, showMode;
			for(var k in programmingTypeMode) {
				if (programmingTypeMode[k] === modeChiness) {
					showMode = k;
				}
			}

			let helpMode = showMode;
			if (helpMode === "c++") {
				helpMode = "cpp";
			}
			else if (helpMode === "c#") {
				helpMode = "cs";
			}

			sec.innerHTML = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic 
							+ (praticeType === "examination" ? ` (  <span class="score">` + result.score + `</span>分 )` : ``) + `</p>
							<div class="inputBlock">
								<div class="description">输入要求：` + (inputContent.description ? inputContent.description : "无") + `</div>
								<div class="example">输入样例：` + (inputContent.example ? inputContent.example : "无") + `</div>
								<div class="inputType">输入类型（按照输入顺序）：` + (inputType.length>0 ? "" : "无") + `<span class="inputTypeContent">` + inputType.join("、") + `</span></div>
							</div>
							<div class="outputBlock">
								<div class="description">输出要求：` + (outputContent.description ? outputContent.description : "无") + `</div>
								<div class="example">输出样例：` + (outputContent.example ? outputContent.example : "无") + `</div>
								<div class="inputType">输出类型（按照输出顺序）：` + (outputType.length>0 ? "" : "无") + `<span class="inputTypeContent">` + outputType.join("、") + `</span></div>
							</div>
							<div class="programmingTypeMode">编程语言：<span class="mode">` + showMode + `</span><a href="help?mode=` + helpMode + `" target="blank" class="help">在线帮助</a></div>
						 <div class="longAnswer">` + `<div><textarea id="` + addPraticeType + `Editor` + index + `"></textarea></div></div>`;

			if (addPraticeType === "Programming") {
				sec.innerHTML = sec.innerHTML + `<input type="button" value="调试" class="runningBtn">
												<div class="runningResult">
													<div class="runningTitle">调试结果：</div>
													<div class="runningContent"></div>
												</div>`;
			}

			if (praticeType !== "examination") {
				if (addPraticeType === "Programming") {
					sec.innerHTML = sec.innerHTML + `<div class="answerBlock">
											<div class="showAnswer">查看正确答案<span class="icon">︽</span></div>
											<div class="answerContent"><textarea id="editor` + index + `">` + result.answer[0].content + `</textarea></div>
										</div>`;
				}
			}
			else {
				examinationCorrectAnswer[addPraticeType].push({
					answer: result.answer,
					score: result.score
				});
			}

			$(section).append(sec);
			$(".flip").before(section);

			$(".answer").addClass("longAnswer");

			let mode = "text/plain";
			if (addPraticeType === "Programming") {
				mode = result.answer[0].programmingTypeMode;
			}

			let editor = editorStyle(addPraticeType + 'Editor' + index, mode);
			programingEditorArray.push({
				textareaId: addPraticeType + "Editor" + index,
				editor:editor
			});

			editor.on("change", function() {
				$(section).find(".runningResult > .runningContent")[0].innerHTML
				 = "";
			});

			if ($("#editor" + index).length) {
				let editor1 = editorStyle("editor" + index, mode);
				editor1.setSize("auto", "auto");
				editor1.setOption("readOnly", true);
				setTimeout(function() {
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
	let section = document.createElement("section");
	section.className = addPraticeType;

	if (praticeType === "random") {
		let count = 0;
		let length = praticeIdArr.length;
		let tempArr = [];
		for(let i=0, len=praticeIdArr.length; i<len; i++) {
			tempArr.push(praticeIdArr[i]);
		}
		while(count < length) {
			let randomNum = parseInt(Math.random()*tempArr.length);
			addNotChoicePraticesContent(section, tempArr[randomNum], count, addPraticeType);
			tempArr.splice(randomNum, 1);
			count++;
		}
	}
	else {
		if (praticeType === "examination") {
			if (addPraticeType === "FillInTheBlank") {
				examinationCorrectAnswer[addPraticeType] = {
					answer: [],
					score: 0
				}
			}
			else {
				examinationCorrectAnswer[addPraticeType] = [];
			}
		}
		praticeIdArr.forEach(function(praticeId, index, array) {
			addNotChoicePraticesContent(section, praticeId, index, addPraticeType)
		});
	}

	$(".runningBtn").click(function(e) {});

	$(".answerBlock > .showAnswer").click(function(e) {
		let $shortAnswer;
		if (getTarget(e).className === "icon") {
			$showAnswer = $(getTarget(e)).parent();
		}
		else {
			$showAnswer = $(getTarget(e));
		}
		let $answerBlock = $showAnswer.parent(".answerBlock");
		let $answerContent = $answerBlock.find(".answerContent");
		if ($answerContent.css("display") === "none") {
			$showAnswer.find(".icon")[0].innerHTML = "︾";
			$answerContent.css("display", "block");
		}
		else {
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
	let $allIndex = $(".showPraticeIndex > div");
	$allIndex.css("background", "#eff0dc");
	$($allIndex[index]).css("background", "#c9cabb");

	// 显示对应题目
	let $allContent = $("." + type + " > .content");
	$(".content").css("display", "none");
	$($allContent[index]).css("display", "block");

	if (index === 0 && type === hasContentTypeArr[0]) {
		$(".previous").addClass("disable");
	}
	else {
		$(".previous").removeClass("disable");
	}

	if (index === currentIndexArray[type].length-1 && type === hasContentTypeArr[hasContentTypeArr.length-1]) {
		if (praticeType === "examination") {
			$(".next").val("提交");
		}
		else {
			$(".next").addClass("disable");
		}
	}
	else {
		$(".next").val(">");
		$(".next").removeClass("disable");
	}
}

/** 获得选项型题目的正确答案和考生答案
 * @param getType String 题目类型
*/
function getChoiceAnswer(getType) {
	examinationStudentAnswer[getType] = [];

	let inputType = "radio";
	if (getType === "MultipleChoices") {
		inputType = "checkbox";
	}

	let allContent = $("." + getType + " > .content");
	for(let i=0, len=allContent.length; i<len; i++) {
		examinationStudentAnswer[getType].push([]);
		let currentIndex = examinationStudentAnswer[getType].length-1;

		let allAnswer = $(allContent[i]).find(".answer input[type=" + inputType + "]"), hadSelected = false;
		for(let j=0, len1=allAnswer.length; j<len1; j++) {
			if (allAnswer[j].checked) {
				hadSelected = true;
				let label = $(allContent[i]).find(".answer .num")[j].innerHTML;
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
		let allContent = $("." + getType + " > .content");
		for(let i=0, len=allContent.length; i<len; i++) {
			examinationStudentAnswer[getType].push([]);
			let currentIndex = examinationStudentAnswer[getType].length-1;

			let allAnswer = $(allContent[i]).find(".answer .textInput");
			for(let j=0, len1=allAnswer.length; j<len1; j++) {
				examinationStudentAnswer[getType][currentIndex].push(allAnswer[j].value);
			}
		}
	}
	else if (getType === "ShortAnswer") {
		let allContent = $("." + getType + " > .content");
		for(let i=0, len=allContent.length; i<len; i++) {
			console.log($(allContent[i]).find(".answer > textarea").val());
			examinationStudentAnswer[getType].push($(allContent[i]).find(".answer > textarea").val());
		}
	}
	else if (getType === "Programming") {
		for(let i=0, len=programingEditorArray.length; i<len; i++) {
			let allContent = $("." + getType + " > .content");
			let showResult = $(allContent[i]).find(".runningResult > .runningContent")[0].innerHTML;
			console.log(showResult);
			if (!showResult || showResult === '<pre><div class="loading"></div></pre>') {
				return false;
			}
			examinationStudentAnswer[getType].push(programingEditorArray[i].editor.getValue());
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
	let totalScore = 0;
	outer: for(let i=0, len=choiceCorrectAnswer.length; i<len; i++) {
		if (choiceCorrectAnswer[i].length !== choiceStudentAnswer[i].length) {
			scoresObj[type].push(0);
			totalScore += 0;
			continue;
		}
		for(let j=0, len1=choiceCorrectAnswer[i].length; j<len1; j++) {
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
	let totalScore = 0;
	outer: for(let i=0, len=FillInTheBlankCorrectAnswer.length; i<len; i++) {
		scoresObj["FillInTheBlank"].push(0);

		for(let j=0, len1=FillInTheBlankCorrectAnswer[i].length; j<len1; j++) {
			for(let t=0, len2=FillInTheBlankCorrectAnswer[i][j].length; t<len2; t++) {
				if (FillInTheBlankStudentAnswer[i][j] === FillInTheBlankCorrectAnswer[i][j][t]) {
					let realScore = score/len1;
					console.log("realScore: " + realScore);
					scoresObj["FillInTheBlank"][scoresObj["FillInTheBlank"].length-1] += realScore;
					totalScore += realScore;
					console.log(i, j, score/len1);
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
	let totalScore = 0, count = 0;
	for(let i=0, len1=ShortAnswerCorrectAnswer.length; i<len1; i++) {
		let answer = ShortAnswerCorrectAnswer[i].answer[0];
		let correctAnswerContent = answer.content, professionalNounsArr = (answer.professionalNounsArr ? answer.professionalNounsArr : []), 
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
				success: function(result) {
					scoresObj["ShortAnswer"][i] = Number(result);
					totalScore += Number(result);
					count++;

					if (count === ShortAnswerCorrectAnswer.length) {
						callback(totalScore);
					}
				}
			});
		}
		else {
			count++;

			scoresObj["ShortAnswer"][i] = 0;

			if (count === ShortAnswerCorrectAnswer.length) {
				callback(totalScore);
			}
		}
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
	let allContent = $(".Programming > .content"), totalScore = 0;
	for(let i=0, len=ProgrammingCorrectAnswer.length; i<len; i++) {
		let realScore = 0;
		try {
			let result = $(allContent[i]).find(".runningResult > .runningContent > pre")[0].innerHTML, 
				score = ProgrammingCorrectAnswer[i].score, correctRate;

			if (result.indexOf("编译通过率：") > -1) {
				realScore = parseFloat(result.substr(6))/100*score;
				totalScore += realScore;
			}
		} catch(e) {}

		scoresObj["Programming"].push(realScore);
	}
	return totalScore;
}

function checkAnswer() {
	getAllAnswer();

	let SingleChoiceCorrectAnswer = examinationCorrectAnswer.SingleChoice,
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
		let SingleChoiceScore = checkChoiceAnswer(SingleChoiceCorrectAnswer.answer, SingleChoiceStudentAnswer, SingleChoiceCorrectAnswer.score, "SingleChoice");
		scoresDetail.details[typeChiness.SingleChoice] = SingleChoiceScore;
		totalScore += SingleChoiceScore;
	}
	if (MultipleChoicesCorrectAnswer) {
		let MultipleChoicesScore = checkChoiceAnswer(MultipleChoicesCorrectAnswer.answer, MultipleChoicesStudentAnswer, MultipleChoicesCorrectAnswer.score, "MultipleChoices");
		scoresDetail.details[typeChiness.MultipleChoices] = MultipleChoicesScore;
		totalScore += MultipleChoicesScore;
	}
	if (TrueOrFalseCorrectAnswer) {
		let TrueOrFalseScore = checkChoiceAnswer(TrueOrFalseCorrectAnswer.answer, TrueOrFalseStudentAnswer, TrueOrFalseCorrectAnswer.score, "TrueOrFalse");
		scoresDetail.details[typeChiness.TrueOrFalse] = TrueOrFalseScore;
		totalScore += TrueOrFalseScore;
	}
	if (FillInTheBlankCorrectAnswer) {
		let FillInTheBlankScore = checkFillIneBlankAnswer(FillInTheBlankCorrectAnswer.answer, FillInTheBlankStudentAnswer, FillInTheBlankCorrectAnswer.score);
		scoresDetail.details[typeChiness.FillInTheBlank] = FillInTheBlankScore;
		totalScore += FillInTheBlankScore;
	}
	
	if (ShortAnswerCorrectAnswer) {
		checkShortAnswer(ShortAnswerCorrectAnswer, ShortAnswerStudentAnswer, function(score) {
			scoresDetail.details[typeChiness.ShortAnswer] = score;
			console.log(scoresDetail);
			totalScore += score;

			if (ProgrammingCorrectAnswer) {
				let ProgrammingScore = checkProgrammingAnswer(ProgrammingCorrectAnswer);
				scoresDetail.details[typeChiness.Programming] = ProgrammingScore;
				totalScore += ProgrammingScore;
			}

			scoresDetail.totalScore = totalScore.toFixed(1);

			$.ajax({
				url: "../showScore",
				type: "POST",
				data: {
					correctAnswerContent: examinationCorrectAnswer,
					studentAnswerContent: examinationStudentAnswer,
					scoresObj: scoresObj
				},
				success: function() {
					window.location.href = "../showScore?scoresDetail=" + JSON.stringify(scoresDetail);
				}
			});
		});
	}
	else {
		if (ProgrammingCorrectAnswer) {
			let ProgrammingScore = checkProgrammingAnswer(ProgrammingCorrectAnswer);
			scoresDetail.details[typeChiness.Programming] = ProgrammingScore;
			totalScore += ProgrammingScore;
		}
		scoresDetail.totalScore = totalScore.toFixed(1);

		$.ajax({
			url: "../showScore",
			type: "POST",
			data: {
				correctAnswerContent: examinationCorrectAnswer,
				studentAnswerContent: examinationStudentAnswer,
				scoresObj: scoresObj
			},
			success: function() {
				window.location.href = "../showScore?scoresDetail=" + JSON.stringify(scoresDetail);
			}
		});
	}
}

/** 将运行按钮的状态改为不可点击状态
 * @param $runningBtn jQuery Object 运行按钮
*/
function changeRunningBtnToDisableStatus($runningBtn, milltime) {
	$runningBtn.addClass("disable");
	let runningBtnInitValue = $runningBtn.val();
	let time = milltime/1000;
	$runningBtn.val(runningBtnInitValue + "(" + time + ")");

	let interval = setInterval(function() {
		time -= 1;

		if (time === 0) {
			clearInterval(interval);
			$runningBtn.removeClass("disable");
			$runningBtn.val(runningBtnInitValue);
		}
		else {
			$runningBtn.val(runningBtnInitValue + "(" + time + ")");
		}
	}, 1000);
}

/** 进行代码运行
 * @param $programmingContent jQuery Object 该编程题目块
*/
function runningProgramming($programmingContent) {
	let textareaId = $programmingContent.find(".longAnswer textarea")[0].id, editor;
	for(let i=0, len=programingEditorArray.length; i<len; i++) {
		if (programingEditorArray[i].textareaId === textareaId) {
			editor = programingEditorArray[i].editor;
			break;
		}
	}
	let editorContent = editor.getValue();

	let inputType = $programmingContent.find(".inputBlock > .inputType > .inputTypeContent")[0].innerHTML.split("、"), 
		outputType = $programmingContent.find(".outputBlock > .inputType > .inputTypeContent")[0].innerHTML.split("、");

	if (inputType.length === 1 && !inputType[0]) {
		inputType = [];
	}

	if (outputType.length === 1 && !outputType[0]) {
		outputType = [];
	}

	let inputTypeArray = [], outputTypeArray = [];
	for(let i=0, len=inputType.length; i<len; i++) {
		if (inputType[i].indexOf("(") > -1) {
			let temp = inputType[i].split("(");
			inputTypeArray.push({
				thisType: temp[0],
				childType: temp[1].substr(0, temp[1].length-1)
			});
		}
		else {
			inputTypeArray.push({
				thisType: inputType[i]
			});
		}
	}

	for(let i=0, len=outputType.length; i<len; i++) {
		if (outputType[i].indexOf("(") > -1) {
			let temp = outputType[i].split("(");
			outputTypeArray.push({
				thisType: temp[0],
				childType: temp[1].substr(0, temp[1].length-1)
			});
		}
		else {
			outputTypeArray.push({
				thisType: inputType[i]
			});
		}
	}

	let programmingLanguage = $programmingContent.find("> .programmingTypeMode > .mode")[0].innerHTML;

	let answerCode;
	let titleNum = $programmingContent.find(".title > .titleNum")[0].innerHTML;
	findSubjectByName(subjectName, function(allUnits) {
		let unitId = allUnits[praticeType + "Pratices"][selectIndex];
		findUnitById(unitId, function(allTypePratices) {
			let praticeId = allTypePratices[type][titleNum-1];
			findPraticesById(praticeId, function(result) {
				answerCode = result.answer[0].content;
			});
		});
	});

	if (!editorContent) {
		showTips("请输入代码！", 1000);
		$programmingContent.find(".runningBtn").removeClass("disable");
		return;
	}

	runningCode(programmingLanguage, editorContent, inputTypeArray, outputTypeArray, function(result) {
		let showResult = "<div class='loading'></div>";
		console.log(result);
		if (!result.error) {
			if ((programmingLanguage !== "javascript") && result.inputCount !== inputTypeArray.length) {
				showResult = "编译不通过！";
				$programmingContent.find(".runningBtn").removeClass("disable");
			}
			else {
				let rightCount = runningCodeWithCorrectAnswer(programmingLanguage, answerCode, editorContent, inputTypeArray, outputTypeArray, function(rightCount) {
					console.log(rightCount);
					showResult = "编译通过率：" + rightCount/20*100 + "%";
					$programmingContent.find(".runningResult > .runningContent")[0].innerHTML = `<pre>`+ showResult + `</pre>`;
					$programmingContent.find(".runningBtn").removeClass("disable");
				});
			}
		}
		else {
			showResult = result.error;
			if (showResult === "选择的参数类型与实际不符！") {
				showResult = "编译不通过！";
			}
			$programmingContent.find(".runningBtn").removeClass("disable");
		}

		$programmingContent.find(".runningResult > .runningContent")[0].innerHTML = `<pre>`+ showResult + `</pre>`;
	})
}

function init() {
	$(".time").css("display", "block");

	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	type = getValueInUrl("type");

	if (praticeType !== "examination") {
		let name;
		if (praticeType === "chapter") {
			name = "章节" + (Number(selectIndex)+1);
		}
		if (name) {
			$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + "—" + name + " — " + typeChiness[type];
		}
		else {
			$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + " — " + typeChiness[type];
		}
	}
	else {
		// 考试模拟，将导航栏盖上蒙层
		$(".toolbarDisable").css("display", "block");

		// 考试模拟时计时开始
		var countdown = setInterval(function() {
			let hours = $(".hours")[0].innerHTML, minutes = $(".minutes")[0].innerHTML, seconds = $(".seconds")[0].innerHTML;
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
					hours = Number(hours)-1;
					if (hours < 10) {
						hours = "0" + hours;
					}
					$(".hours")[0].innerHTML = hours;
				}
				else {
					minutes = Number(minutes)-1;
					if (minutes < 10) {
						minutes = "0" + minutes;
					}
				}

				$(".minutes")[0].innerHTML = minutes;
			}
			else {
				seconds = Number(seconds)-1;
				if (seconds < 10) {
					seconds = "0" + seconds;
				}
			}

			$(".seconds")[0].innerHTML = seconds;
		}, 1000);
	}

	findSubjectByName(subjectName, function(result) {
		let unitId = result[praticeType+"Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
			let time = data.time;
			if (time) {
				let hours = time.hours, minutes = time.minutes, seconds = time.seconds;
				if (Number(hours) < 10) {
					hours = "0" + hours;
				}
				if (Number(minutes) < 10) {
					minutes = "0" + minutes;
				}
				if (Number(seconds) < 10) {
					seconds = "0" + seconds;
				}

				$(".time")[0].innerHTML = "<span class='hours'>" + hours + "</span>:<span class='minutes'>" 
											+ minutes + "</span>:<span class='seconds'>" + seconds + "</span>";
			}

			if (type) {
				allPraticeContent = data[type];

				switch(type) {
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
			}
			else {
				for(let i=0, len=praticeTypeArr.length; i<len; i++) {
					let length = data[praticeTypeArr[i]].length;
					if (length > 0) {
						switch(praticeTypeArr[i]) {
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
						}
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

function bindEvent() {
	// 当为考试模拟时，点击练习类型事件
	$(".showPraticeBlockIndex").click(function(e) {
		let className = getTarget(e).className;
		if ($("." + className.substr(0, className.length-5)).length > 0) {
			type = className.substr(0, className.length-5);
			changeTypeStyle();
			addPraticeIndex(currentIndexArray[type].length);
			changePraticeContent(currentIndexArray[type].index);
		}
	});

	// 点击题目编号事件
	$(".showPraticeIndex").click(function(e) {
		if (Number(getTarget(e).innerHTML)) {
			let index = getTarget(e).innerHTML-1;
			currentIndexArray[type].index = index;
			changePraticeContent(index);
		}
	});

	$(".previous").click(function() {
		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

		if ($(this).hasClass("disable")) return;

		if (currentIndexArray[type].index === 0) {
			for(let i=0, len=hasContentTypeArr.length; i<len; i++) {
				if (hasContentTypeArr[i] === type) {
					if (i !== 0) {
						type = hasContentTypeArr[--i];
						changeTypeStyle();
						addPraticeIndex(currentIndexArray[type].length);
						currentIndexArray[type].index = currentIndexArray[type].length-1;
						changePraticeContent(currentIndexArray[type].index);
					}
					return;
				}
			}
		}

		changePraticeContent(--currentIndexArray[type].index);
	});

	$(".next").click(function() {
		if (this.value === "提交") {
			if (!getNotChoiceAnswer("Programming")) {
				showTips("请确保所有编程题至少被运行一次！", 1500);
				return;
			}
			showWin("是否确定提交答案？（提交后将不能修改）", function() {
				addLoadingInterface();
				checkAnswer();
			});
			return;
		}

		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

		if ($(this).hasClass("disable")) return;

		if (currentIndexArray[type].index === currentIndexArray[type].length-1) {
			for(let i=0, len=hasContentTypeArr.length; i<len; i++) {
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
	});

	$(".runningBtn").click(function(e) {
		let $target = $(getTarget(e));
		if (!$target.hasClass("disable")) {
			// changeRunningBtnToDisableStatus($target, 15000);
			$target.addClass("disable");
			runningProgramming($(getTarget(e)).parent());
		}
	});
}