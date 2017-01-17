/** 根据科目名查找某个科目
 * @param subjectName String 科目名称
 * @param notFindCallback Function 没有找到该科目的回调函数
 * @param findCallback Function 找到该科目的回调函数
*/
function findSubjectByName(subjectName, notFindCallback, findCallback) {
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
			if (!data) {
				notFindCallback();
			}
			else {
				findCallback();
			}
		}
	});
}

/** 查找数据库中的所有subject
 * @param callback Function 回调函数
*/
function findAllSubject(callback) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
		data: {
			data: "subjects",
			callFunction: "findAll"
		},
		success: function(result) {
			callback(result);
		}
	});
}

/** 在界面中添加某个科目
 * @param subjectName String 科目名称
*/
function addSubjectInView(subjectName) {
	let section = document.createElement("section");
	section.innerHTML = '<div><div class="subjectName">' + subjectName 
						+ '</div><input type="button" value="X" class="remove">'
						+ '<input type="button" class="modify"></div>';

	let addSubject = $(".addSubject");
	addSubject.before(section);

	$(section).hover(function(e) {
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 1);
		$(target).find(".modify").css("opacity", 1);
	}, function(e) {
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 0);
		$(target).find(".modify").css("opacity", 0);
	});
}

/** 在界面和数据库中添加某个科目
 * @param subjectName String 科目名称
*/
function addSubject(subjectName) {
	findSubjectByName(subjectName, function() {
		$.ajax({
			url: "../callDataProcessing",
			type: "POST",
			data: {
				data: "subjects",
				callFunction: "save",
				saveData: {
					subjectName: subjectName,
					pratice: {
						chapter: [],
						examination: [],
						random: []
					}
				}
			},
			success: function(result) {
				if (!result.err) {
					showTips("新建科目成功！", 2000);

					addSubjectInView(subjectName);
				}
			}
		});
	}, function() {
		showTips("该科目已存在！", 2000);
	});
}

// 弹出新建科目的输入框，并绑定该弹出框的按钮事件
function newSubjectName() {
	let contentHTML = `<div>请输入科目名称：</div>
						<div><input class="textInput" type="text" autofocus=true 
						 style="color: #000; border-bottom-color: #000; margin: 20px 0;">
						 </div>`;
	showWin(contentHTML, function() {
		let subjectName = $(".textInput").val();
		if (subjectName) {
			addSubject($(".textInput").val());
		}
		inputRest("text");
	}, function() {
		inputRest("text");
	});
}

// 请求进入某个科目的题库
function enterSubjectExercise(subjectName) {
	window.location.href = "/pratice?subjectName=" + subjectName;
}

/** 删除某个科目，并将该科目的所有题库从数据库中删除
 * @param $removeTarget Object 删除的对象（jq对象）
*/
function removeSubject($removeTarget) {
	$.ajax({
		url: "../callDataProcessing",
		type: "POST",
		data: {
			data: "subjects",
			callFunction: "remove",
			removeOpt: {subjectName: $removeTarget.find(".subjectName")[0].innerHTML}
		},
		success: function() {
			$removeTarget.remove();
			showTips("删除成功！", 2000);
		}
	});
}

/** 修改科目名称
 * @param $modifyTarget Object 修改对象（jq对象）
*/
function modifySubjectName($modifyTarget) {
	let oldSubjectName = $modifyTarget.find(".subjectName")[0].innerHTML;
	let contentHTML = '<div>请输入新的科目名称：</div>'
						+ '<div><input class="textInput" type="text" autofocus=true value="'
						+ oldSubjectName 
						+ '" style="color: #000; border-bottom-color: #000; margin: 20px 0;"></div>';
	showWin(contentHTML, function() {
		let newSubjectName = $(".textInput").val();
		if (newSubjectName && newSubjectName != oldSubjectName) {
			findSubjectByName(newSubjectName, function() {
				$.ajax({
					url: "../callDataProcessing",
					type: "POST",
					data: {
						data: "subjects",
						callFunction: "update",
						updateOpt: {subjectName: oldSubjectName},
						operation: "set",
						update: {subjectName: newSubjectName}
					},
					success: function(result) {
						if (result) {
							$modifyTarget.find(".subjectName")[0].innerHTML = newSubjectName;
							showTips("科目名称修改成功！", 2000);
						}
					}
				});
			}, function() {
				showTips("该科目已存在！", 2000);
			});
		}
	});
}

function init() {
	findAllSubject(function(result) {
		for(let i=0, len=result.length; i<len; i++) {
			addSubjectInView(result[i].subjectName);
		}
	});
}

function bindEvent() {
	// 绑定添加科目事件
	$(".addSubject")[0].onclick = function() {
		newSubjectName();
	};

	$(".subject").click(function(e) {
		let target = getTarget(e);
		let className = target.className;

		switch(className) {
			case "subjectName":
				enterSubjectExercise($(target)[0].innerHTML);
				break;
			case "remove":   // 绑定删除科目事件
				showWin("确定删除该科目吗？（连同该科目的所有题库都删除）", function() {
					removeSubject($(target).parent());
				}, function() {}, true);
				break;
			case "modify":
				modifySubjectName($(target).parent());
				break;
		}
	});
}