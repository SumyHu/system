let subjectName, currentPraticeType = "chapter", identity;

let randomPraticeListInnerHtml = `<li value=0>单选题<input type="button" class="modifyBtn"></li><li value=1>多选题<input type="button" class="modifyBtn"></li><li value=2>判断题<input type="button" class="modifyBtn"></li>
                                  <li value=3>填空题<input type="button" class="modifyBtn"></li><li value=4>简答题<input type="button" class="modifyBtn"></li><li value=5>编程题<input type="button" class="modifyBtn"></li>`;

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
					$(".randomContent > .content > ." + type + " .enter .enterPratice").addClass("disable");
				}
				else {
					$(".randomContent > .content > ." + type + " .enter .enterPratice").removeClass("disable");
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
				$(".chapterContent > .content > section").css("display", "block");
				
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
	if (identity !== "teacher") {
		$(".addMore").css("display", "none");
	}
	else {
		$(".addMore").css("display", "block");
	}

	let innerHtml = `<li value=-1>示例</li>`;
	switch(currentPraticeType) {
		case "chapter":
			for(let i=0; i<count; i++) {
				innerHtml = innerHtml + `<li value=` + i + `>第` + (i+1) + `章 <input type="button" class="removeIndex" value="X"><input type="button" class="modifyBtn"></li>`;
			}
			break;
		case "examination":
			for(let i=0; i<count; i++) {
				innerHtml = innerHtml + `<li value=` + i + `>试卷` + (i+1) + ` <input type="button" class="removeIndex" value="X"><input type="button" class="modifyBtn"></li>`;
			}
			break;
		case "random":
			$(".addMore").css("display", "none");
			innerHtml = randomPraticeListInnerHtml;
			break;
	}
	$(".praticeContent > aside > ul")[0].innerHTML = innerHtml;

	if (currentPraticeType !== "random") {
		index = index + 1;
	}
	$(".praticeContent > aside > ul > li").removeClass("select");
	$($(".praticeContent > aside > ul > li")[index]).addClass("select");

	if (identity !== "teacher") {
		$(".removeIndex").css("display", "none");
		$(".modifyBtn").css("display", "none");
	}
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

/** 将某个习题从以习题为单位的数据库中删除
 * @param praticeId String 习题id
 * @param callback Function 回调函数
*/
function removePratice(praticeId, callback) {
	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "remove",
			removeOpt: {
				_id: praticeId
			}
		},
		success: callback
	});
}

function removePraticeInRandomUnit(randomUnitId, type, praticeId) {
	let update = {};
	update[type] = praticeId;
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "update",
			updateOpt: {
				_id: randomUnitId
			},
			operation: "pull",
			update: update
		},
		success: function() {}
	});
}

/** 将某个单元从以单元为单位的数据库中删除
 * @param unitId String 单元id
 * @param callback Function 回调函数
*/
function removeUnit(unitId, callback) {
	console.log('unitId: ' + unitId);
	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "remove",
			removeOpt: {
				_id: unitId
			}
		},
		success: callback
	});
}

/** 将某个单元从以单元为单位的数据库中删除，并将该单元内的所以习题都从以习题为单位的数据库中删除
 * @param unitId String 单元id
*/
function removeUnitAndAllPraticesInThisUnit(unitId) {
	findUnitById(unitId, function(result) {
		removeUnit(unitId, function() {});

		console.log('find unit result', unitId, result);
		if (!result) return;

		console.log(result);

		let randomUnitId;
		findSubjectByName(subjectName, function(result) {
			randomUnitId = result.randomPratices;
		});

		let SingleChoice = result.SingleChoice,
			MultipleChoices = result.MultipleChoices,
			TrueOrFalse = result.TrueOrFalse,
			FillInTheBlank = result.FillInTheBlank,
			ShortAnswer = result.ShortAnswer,
			Programming = result.Programming;

		SingleChoice.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "SingleChoice", praticeId)
		});
		MultipleChoices.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "MultipleChoices", praticeId)
		});
		TrueOrFalse.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "TrueOrFalse", praticeId)
		});
		FillInTheBlank.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "FillInTheBlank", praticeId)
		});
		ShortAnswer.forEach(function(praticeId, index, array) {
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "ShortAnswer", praticeId)
		});
		Programming.forEach(function(praticeId, index, array) {
			console.log(praticeId);
			removePratice(praticeId, function() {});
			removePraticeInRandomUnit(randomUnitId, "Programming", praticeId)
		});
	});
}

function removeUnitFormSubject(unitId) {
	let update = {};
	update[currentPraticeType+"Pratices"] = unitId;
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "update",
			updateOpt: {
				subjectName: subjectName
			},
			operation: "pull",
			update: update
		}
	});
}

function init() {
	identity = $(".identity")[0].id;

	subjectName = getValueInUrl("subjectName");

	$(".time")[0].innerHTML = subjectName;

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
		let index = $(getTarget(e)).parent().val();
		if (getTarget(e).className === "removeIndex") {
			showWin("确定删除？", function() {
				findSubjectByName(subjectName, function(result) {
					let unitId = result[currentPraticeType+"Pratices"][index];
					removeUnitAndAllPraticesInThisUnit(unitId);
					removeUnitFormSubject(unitId);
				});
				location.reload(true);
			});
			return;
		}

		if (getTarget(e).className === "modifyBtn") {
			let locationHref;
			if (currentPraticeType === "random") {
				locationHref = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + "&type=" + praticeTypeArr[index] + "&operation=modify"
			}
			else {
				locationHref = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + "&index=" + index + "&operation=modify";
			}

			window.location.href = locationHref;
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

		locationHref = "../pratice?subjectName=" + subjectName + "&praticeType=" + currentPraticeType + queryParam;
		// if (target.className === "modify") {
		// 	locationHref = locationHref + "&operation=modify";
		// }
		window.location.href = locationHref;
	});

	$(".addMore")[0].onclick = function() {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	};
}