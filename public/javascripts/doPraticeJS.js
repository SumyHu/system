let praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

let subjectName, praticeType, selectIndex, type, allPraticeContent;

let currentIndexArray = {};   // 存储当前所有类型的题目下标

let hasContentTypeArr = [];   // 存储当前有题目的类型名

/** 实现代码编辑器样式
 * @param id String textarea的id
 * @param mode String 代码类型
*/
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

/** 添加选择类型的题目在界面上
 * @param praticeIdArr Array 习题id集合
 * @param addPraticeType String 要添加的习题类型
*/
function addChoicePratices(praticeIdArr, addPraticeType) {
	let section = document.createElement("section");
	section.className = addPraticeType;
	praticeIdArr.forEach(function(praticeId, index, array) {
		findPraticesById(praticeId, function(result) {
			let sec = document.createElement("section");
			sec.className = "content";
			let showIndex = index+1;

			let innerHtml = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic + `</p>
							 <div class="answer">`;

			if (addPraticeType === "MultipleChoices") {
				inputType = "checkbox";
			}
			else {
				inputType = "radio";
			}
			for(let i=0, len=result.choices.length; i<len; i++) {
				innerHtml = innerHtml
								+ `<div>
										<input type="` + inputType + `" id="` + addPraticeType + showIndex + i + `" name="` + addPraticeType +  showIndex + `">
										<label for="` + addPraticeType + showIndex + i + `">
											<span class="num">` + result.choices[i].num + `</span>
										` + result.choices[i].choiceContent + `</label>
								   </div>`;
			}
			sec.innerHTML = innerHtml + `</div>`;
			$(section).append(sec);
			$(".flip").before(section);
			$(sec).css("display", "none");
		});
	});
}

/** 添加非选择类型的题目
 * @param praticeIdArray Array 习题id集合
 * @param addPraticeType String 要添加的习题类型
*/
function addNotChoicePratices(praticeIdArr, addPraticeType) {
	let section = document.createElement("section");
	section.className = addPraticeType;
	praticeIdArr.forEach(function(praticeId, index, array) {
		findPraticesById(praticeId, function(result) {
			console.log(result);
			let sec = document.createElement("section");
			sec.className = "content";
			let showIndex = index+1;

			let innerHtml = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic + `</p>
							 <div class="answer">`;

			if (addPraticeType === "FillInTheBlank") {
				for(let i=1, len=result.answer.length; i<=len; i++) {
					innerHtml = innerHtml
								+ `<div>
										<span class="num">` + i + `</span>
										<input type="text" class="textInput">
								    </div>`;
				}
				sec.innerHTML = innerHtml + `</div>`;
				$(section).append(sec);
				$(".flip").before(section);
			}
			else {
				sec.innerHTML = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic + `</p>
							 <div class="longAnswer">` + `<div><textarea id="` + addPraticeType + `Editor` + index + `"></textarea></div></div>`;

				$(section).append(sec);
				$(".flip").before(section);

				$(".answer").addClass("longAnswer");

				let mode = "text/plain";
				if (addPraticeType === "Programming") {
					mode = result.programmingTypeMode;
				}

				editorStyle(addPraticeType + 'Editor' + index, mode);
			}
			$(sec).css("display", "none");
		});
	});
}

// 根据当前题目类型改变类型索引块的样式
function changeTypeStyle() {
	$(".showPraticeBlockIndex > div").css("background", "rgba(0, 0, 0, 0.5)");
	$("." + type + "Block").css("background", "rgba(249, 90, 78, 0.8)");
}

/** 根据当前类型和题目下标显示对应的内容
 * @param index Number 题目下标
*/
function changePraticeContent(index) {
	// 修改对应索引的样式
	let $allIndex = $(".showPraticeIndex > div");
	$allIndex.css("background", "#333");
	$($allIndex[index]).css("background", "rgba(249, 90, 78, 0.8");

	// 显示对应题目
	let $allContent = $("." + type + " > .content");
	$(".content").css("display", "none");
	$($allContent[index]).css("display", "block");

	if (index === currentIndexArray[type].length-1 && type === hasContentTypeArr[hasContentTypeArr.length-1]) {
		$(".next").val("提交");
	}
	else {
		$(".next").val(">");
	}
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
		$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + "—" + name + " — " + typeChiness[type];
	}
	else {
		$(".time")[0].innerHTML = "90 : 00";
	}

	findSubjectByName(subjectName, function(result) {
		let unitId = result[praticeType+"Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
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
		let index = getTarget(e).innerHTML-1;
		currentIndexArray[type].index = index;
		changePraticeContent(index);
	});

	$(".previous").click(function() {
		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

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
			showWin("是否确定提交答案？（提交后将不能修改）", function() {});
			return;
		}

		// 将滚动条滚动到顶部，并添加动画效果
		$("body").animate({
			scrollTop: 0
		}, 300);

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
}