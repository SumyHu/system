let praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

let praticeTypeChiness = {
	chapter: "章节练习",
	examination: "考试模拟",
	random: "随机练习"
}

let typeChiness = {
	SingleChoice: "单选题",
	MultipleChoices: "多选题",
	TrueOrFalse: "判断题",
	FillInTheBlank: "填空题",
	ShortAnswer: "简答题",
	Programming: "编程题"
}

let subjectName, praticeType, selectIndex, type, allPraticeContent;

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

function addPraticeIndex(count) {
	for(let i=1; i<=count; i++) {
		let div = document.createElement("div");
		div.innerHTML = i;
		$(".showPraticeIndex").append(div);
	}
}

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

			if (index !== 0) {
				$(sec).css("display", "none");
			}
		});
	});
}

function addNotChoicePratices(praticeIdArr, addPraticeType) {
	let section = document.createElement("section");
	section.className = "FillInTheBlank";
	praticeIdArr.forEach(function(praticeId, index, array) {
		findPraticesById(praticeId, function(result) {
			console.log(result);
			let sec = document.createElement("section");
			sec.className = "content";
			let showIndex = index+1;

			let innerHtml = `<p class="title"><span class="titleNum">` + showIndex + `</span>` + result.topic + `</p>
							 <div class="answer">`;

			if (addPraticeType === "FillInTheBlank") {
				for(let i=0, len=result.answer.length; i<len; i++) {
					innerHtml = innerHtml
								+ `<div>
										<span class="num">` + i + `</span>.
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

			if (index !== 0) {
				$(sec).css("display", "none");
			}
		});
	});
}

function init() {
	$(".time").css("display", "block");

	subjectName = getValueInUrl("subjectName");
	praticeType = getValueInUrl("praticeType");
	selectIndex = getValueInUrl("index");
	type = getValueInUrl("type");

	if (praticeType !== "random") {
		$(".time")[0].innerHTML = praticeTypeChiness[praticeType] + " — " + typeChiness[type];
	}

	findSubjectByName(subjectName, function(result) {
		let unitId = result[praticeType+"Pratices"];
		if (selectIndex) {
			unitId = unitId[selectIndex];
		}

		findUnitById(unitId, function(data) {
			if (type) {
				allPraticeContent = data[type];

				addPraticeIndex(allPraticeContent.length);

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
			}
			else {
				allPraticeContent = data;
			}

			console.log(allPraticeContent);
		});
	});

	$(".showPraticeIndex").click(function(e) {});

	$(".previous").click(function() {});
	$(".next").click(function() {});
}

function bindEvent() {}