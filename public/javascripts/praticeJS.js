let subjectName, currentPraticeType = "chapter";

let randomPraticeListInnerHtml = `<li value=0>单选题</li><li value=1>多选题</li><li value=2>判断题</li>
                                  <li value=3>填空题</li><li value=4>简答题</li><li value=5>编程题</li>`;

let praticeTypeArr = ["SingleChoice", "MultipleChoices", "TrueOrFalse", "FillInTheBlank", "ShortAnswer", "Programming"];

// 当前各个类型的题目的选择的下标
let selectIndex = {
	chapterIndex: -1, 
	examinationIndex: -1, 
	randomIndex: 0
};

/** 显示当前练习的习题内容
 * @param className String 当前练习的类名（如chapter、random等）
*/
function showIndex(praticeType, index) {
	$(".praticeContent > section").css("display", "none");
	$("." + praticeType + "Content").css("display", "block");

	if (praticeType === "random") {
		let type = praticeTypeArr[index];
		$(".randomContent > .content > .showOneType").css("display", "none");
		$(".randomContent > .content > ." + type).css("display", "block");

		findPraticesByType("random", function(result) {
			findUnitById(result, function(data) {
				let praticeCount = data[type].length;
				$(".randomContent > .content > ." + type + " > .exerciseCount > .num")[0].innerHTML = praticeCount;
				if (praticeCount === 0) {
					$(".randomContent > .content > ." + type + " .enter input").addClass("disable");
				}
				else {
					$(".randomContent > .content > ." + type + " .enter input").removeClass("disable");
				}
			});
		});
	}
	else {
		if (index === -1) {
			if (praticeType === "chapter") {
				$(".chapterContent > .content > section").css("display", "block");
			}
			$("." + praticeType + "Content" + " > .content .enter input").addClass("disable");
		}
		else {
			if (praticeType === "chapter") {
				findPraticesByType("chapter", function(result) {
					let selectChapterId = result[index];
					findUnitById(selectChapterId, function(data) {
						for(var key in data) {
							if (data[key].length === 0) {
								$(".chapterContent > .content > ." + key).css("display", "none");
							}
						}
					});
				});
			}
			$("." + praticeType + "Content" + " > .content .enter input").removeClass("disable");
		}
	}
}

/** 显示当前练习的目录
 * @param count Number 【章节数|试卷数】
*/
function showList(count, index) {
	let innerHtml = `<li value=-1>示例</li>`;
	switch(currentPraticeType) {
		case "chapter":
			for(let i=0; i<count; i++) {
				innerHtml = innerHtml + `<li value=` + i + `>第` + (i+1) + `章 <input type="button" class="removeIndex" value="X"></li>`;
			}
			break;
		case "examination":
			for(let i=0; i<count; i++) {
				innerHtml = innerHtml + `<li value=` + i + `>试卷` + (i+1) + ` <input type="button" class="removeIndex" value="X"></li>`;
			}
			break;
		case "random":
			innerHtml = randomPraticeListInnerHtml;
			break;
	}
	$(".praticeContent > aside > ul")[0].innerHTML = innerHtml;

	if (currentPraticeType !== "random") {
		index = index + 1;
	}
	$(".praticeContent > aside > ul > li").removeClass("select");
	$($(".praticeContent > aside > ul > li")[index]).addClass("select");
}

/** 显示随机练习某个目录的入口
 * @param exerciseName String 目录名称
*/
function showRandomPraticeListEnter(exerciseName) {
	$(".randomContent .showOneType").css("display", "none");
	switch(exerciseName) {
		case "单选题": 
			$(".randomContent > .content > .SingleChoice").css("display", "block");
			break;
		case "多选题":
			$(".randomContent > .content > .MultipleChoices").css("display", "block");
			break;
		case "判断题":
			$(".randomContent > .content > .TrueOrFalse").css("display", "block");
			break;
		case "填空题":
			$(".randomContent > .content > .FillInTheBlank").css("display", "block");
			break;
		case "简答题":
			$(".randomContent > .content > .ShortAnswer").css("display", "block");
			break;
		case "编程题":
			$(".randomContent > .content > .Programming").css("display", "block");
			break;
	}
}

function init() {
	subjectName = getValueInUrl("subjectName");

	findPraticesByType(currentPraticeType, function(data) {
		showList(data.length, -1);

		// 显示习题内容变化
		showIndex("chapter", -1);
	});
}

function bindEvent() {
	// 练习类型选择事件
	$(".typeNav").click(function(e) {
		let target = getTarget(e);

		// 顶部习题类型导航栏颜色变化
		let allDiv = $(".typeNav div");
		for(let i=0, len=allDiv.length; i<len; i++) {
			$(allDiv[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(target).css("background", "rgba(249, 90, 78, 0.8)");

		let className = target.className;
		currentPraticeType = className;

		let index = selectIndex[currentPraticeType + "Index"];

		// 目录变化
		findPraticesByType(currentPraticeType, function(data) {
			showList(data.length, index);
		});

		// 显示习题内容变化
		showIndex(currentPraticeType, index);
	});

	// 目录点击事件
	$(".praticeContent > aside > ul").click(function(e) {
		if (getTarget(e).className === "removeIndex") {
			return;
		}
		
		// 目录的样式变化
		$(".praticeContent > aside li").removeClass("select");
		$(getTarget(e)).addClass("select");

		selectIndex[currentPraticeType + "Index"] = getTarget(e).value;

		// 显示对应内容入口
		showIndex(currentPraticeType, getTarget(e).value);

	});

	// 修改、进入按钮跳转事件
	$(".enter").click(function(e) {
		let target = getTarget(e);

		// 判断按钮是否可用
		if ($(target).hasClass("disable")) {
			return;
		}

		let queryParam, index = selectIndex[currentPraticeType + "Index"];
		switch(currentPraticeType) {
			case "chapter":
				let type = $(target).parent().parent()[0].className;
				queryParam = "&index=" + index + "&type=" + type;
				break;
			case "examination":
				queryParam = "&index=" + index;
				break;
			case "random":
				queryParam = "&type=" + praticeTypeArr[index];
				break;
		}

		console.log(target.className);

		locationHref = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + queryParam;
		if (target.className === "modify") {
			locationHref = locationHref + "&operation=modify";
		}
		window.location.href = locationHref;
	});

	$(".addMore")[0].onclick = function() {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	};
}