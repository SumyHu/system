'use strict';

var identity = void 0;

/** 在界面中添加某个科目
 * @param subjectName String 科目名称
*/
function addSubjectInView(subjectName, updateTime) {
	var section = document.createElement("section");
	// section.innerHTML = '<div><div class="subjectName" title="' + subjectName + '">' + subjectName 
	// 					+ '</div><input type="button" value="X" class="remove">'
	// 					+ '<input type="button" class="modify"></div>';
	section.innerHTML = '<div class="main"><div class="subjectName" title="' + subjectName + '">' + subjectName + '</div><input type="button" value="X" class="remove">' + '<input type="button" class="modify"></div>' + '<div class="updateTime">更新至' + updateTime + '</div>';

	var addSubject = $(".addSubject");
	addSubject.before(section);

	if (identity === "student") {
		$(".remove").css("display", "none");
		$(".modify").css("display", "none");
	}

	$(section).hover(function (e) {
		$(this).find(".remove").css("opacity", 1);
		$(this).find(".modify").css("opacity", 1);
		$(this).css("font-size", "35px");
	}, function (e) {
		$(this).find(".remove").css("opacity", 0);
		$(this).find(".modify").css("opacity", 0);
		$(this).css("font-size", "25px");
	});
}

/** 在界面和数据库中添加某个科目
 * @param subjectName String 科目名称
*/
function addSubject(subjectName) {
	findSubjectByName(subjectName, function () {
		showTips("该科目已存在！", 2000);
	}, function () {
		callDataProcessingFn({
			data: {
				data: "units",
				callFunction: "save"
			},
			success: function success(result) {
				if (!result.err) {
					var updateTime = new Date().toLocaleString();
					callDataProcessingFn({
						data: {
							data: "subjects",
							callFunction: "save",
							saveData: {
								subjectName: subjectName,
								randomPratices: result.id,
								updateTime: updateTime
							}
						},
						success: function success(result) {
							if (!result.err) {
								showTips("新建科目成功！", 2000);

								addSubjectInView(subjectName, updateTime);
							}
						}
					});
				}
			}
		});
	});
}

// 弹出新建科目的输入框，并绑定该弹出框的按钮事件
function newSubjectName() {
	var contentHTML = '<div>\u8BF7\u8F93\u5165\u79D1\u76EE\u540D\u79F0\uFF1A</div>\n\t\t\t\t\t\t<div><input class="textInput" type="text" autofocus=true \n\t\t\t\t\t\t style="color: #000; border-bottom-color: #000; margin: 20px 0;" maxLength=20>\n\t\t\t\t\t\t </div>';
	showWin(contentHTML, function () {
		var subjectName = decodeURIComponent($(".textInput").val());
		if (subjectName) {
			addSubject($(".textInput").val());
		}
		inputRest("text");
	}, function () {
		inputRest("text");
	});
}

// 请求进入某个科目的题库
function enterSubjectExercise(subjectName) {
	window.location.href = "/pratice?subjectName=" + subjectName;
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

/** 将某个科目从科目数据库中删除
 * @param subjectName String 科目名称
 * @param callback Function 回调函数
*/
function removeSubject(subjectName, callback) {
	callDataProcessingFn({
		data: {
			data: "subjects",
			callFunction: "remove",
			removeOpt: { subjectName: subjectName }
		},
		success: callback
	});
}

function removeOneUnitAllContent(unitId) {
	findUnitById(unitId, function (result) {
		removeUnit(unitId, function () {});

		console.log('find unit result', unitId, result);
		if (!result) return;

		console.log(result);

		var SingleChoice = result.SingleChoice,
		    MultipleChoices = result.MultipleChoices,
		    TrueOrFalse = result.TrueOrFalse,
		    FillInTheBlank = result.FillInTheBlank,
		    ShortAnswer = result.ShortAnswer,
		    Programming = result.Programming;

		SingleChoice.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
		});
		MultipleChoices.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
		});
		TrueOrFalse.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
		});
		FillInTheBlank.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
		});
		ShortAnswer.forEach(function (praticeId, index, array) {
			removePratice(praticeId, function () {});
		});
		Programming.forEach(function (praticeId, index, array) {
			console.log(praticeId);
			removePratice(praticeId, function () {});
		});
	});
}

/** 删除某个科目，并将该科目的所有题库从数据库中删除
 * @param $removeTarget Object 删除的对象（jq对象）
*/
function removeOneSubjectAllContent($removeTarget) {
	var subjectName = decodeURIComponent($removeTarget.find(".subjectName")[0].innerHTML);
	findSubjectByName(subjectName, function (result) {
		console.log('subject result', result);
		var chapterPratices = result.chapterPratices,
		    examinationPratices = result.examinationPratices,
		    randomPratices = result.randomPratices;

		removeSubject(subjectName, function () {
			$removeTarget.parent().remove();
			showTips("删除成功！", 2000);
		});

		chapterPratices.forEach(function (unitId, index, array) {
			removeOneUnitAllContent(unitId);
		});
		examinationPratices.forEach(function (unitId, index, array) {
			removeOneUnitAllContent(unitId);
		});
		removeOneUnitAllContent(randomPratices);
	});
}

/** 修改科目名称
 * @param $modifyTarget Object 修改对象（jq对象）
*/
function modifySubjectName($modifyTarget) {
	var oldSubjectName = decodeURIComponent($modifyTarget.find(".subjectName")[0].innerHTML);
	var contentHTML = '<div>请输入新的科目名称：</div>' + '<div><input class="textInput" type="text" autofocus=true value="' + oldSubjectName + '" style="color: #000; border-bottom-color: #000; margin: 20px 0;"></div>';
	showWin(contentHTML, function () {
		var newSubjectName = decodeURIComponent($(".textInput").val());
		if (newSubjectName && newSubjectName != oldSubjectName) {
			findSubjectByName(newSubjectName, function () {
				showTips("该科目已存在！", 2000);
			}, function () {
				$.ajax({
					url: "../callDataProcessing",
					type: "POST",
					data: {
						data: "subjects",
						callFunction: "update",
						updateOpt: { subjectName: oldSubjectName },
						operation: "set",
						update: { subjectName: newSubjectName }
					},
					success: function success(result) {
						if (result) {
							var updateTime = new Date().toLocaleDateString();
							callDataProcessingFn({
								data: {
									data: "subjects",
									callFunction: "update",
									updateOpt: {
										subjectName: newSubjectName
									},
									operation: "set",
									update: {
										updateTime: updateTime
									}
								},
								success: function success() {
									$modifyTarget.find(".subjectName")[0].innerHTML = newSubjectName;
									$modifyTarget.parent().find(".updateTime")[0].innerHTML = "更新至" + updateTime;
									showTips("科目名称修改成功！", 2000);
								}
							});
						}
					}
				});
			});
		}
	});
}

function init() {
	identity = $(".identity")[0].id;
	if (identity === "student") {
		$(".addSubject").css("display", "none");
	}

	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "findAll"
		},
		success: function success(result) {
			console.log(result);
		}
	});

	// callDataProcessingFn({
	// 	data: {
	// 		data: "testResults",
	// 		callFuntion: "findAll"
	// 	},
	// 	success: function(result) {
	// 		console.log(result);
	// 	}
	// });

	$(".time").css("display", "none");

	findAllSubject(function (result) {
		console.log(result);
		for (var i = 0, len = result.length; i < len; i++) {
			addSubjectInView(result[i].subjectName, result[i].updateTime);
		}
	});

	callDataProcessingFn({
		data: {
			data: "units",
			callFunction: "findAll"
		},
		success: function success(result) {
			console.log("units", result);
			// for(let i=0, len=result.length; i<len; i++) {
			// 	removeUnit(result[i]._id, function() {});
			// }
		}
	});

	callDataProcessingFn({
		data: {
			data: "pratices",
			callFunction: "findAll"
		},
		success: function success(result) {
			console.log("pratices", result);
			// for(let i=result.length-1, len=result.length; i<len; i++) {
			// 	console.log(result[i]._id);
			// 	removePratice(result[i]._id, function() {
			// 		console.log('success');
			// 	});
			// }
		}
	});
}

function bindEvent() {
	// 绑定添加科目事件
	$(".addSubject")[0].onclick = function () {
		newSubjectName();
	};

	$(".subject").click(function (e) {
		var target = getTarget(e);
		var className = target.className;
		console.log(className);

		switch (className) {
			case "main":
				enterSubjectExercise($(target).find(".subjectName")[0].innerHTML);
				break;
			case "subjectName":
				enterSubjectExercise($(target)[0].innerHTML);
				break;
			case "updateTime":
				enterSubjectExercise($(target).parent().find(".subjectName")[0].innerHTML);
				break;
			case "remove":
				// 绑定删除科目事件
				showWin("确定删除该科目吗？（连同该科目的所有题库都删除）", function () {
					removeOneSubjectAllContent($(target).parent());
				}, function () {}, true);
				break;
			case "modify":
				modifySubjectName($(target).parent());
				break;
		}
	});
}