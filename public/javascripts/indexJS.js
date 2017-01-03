/** 在界面添加某个科目
 * @param subjectName String 科目名称
*/
function addSubject(subjectName) {
	let section = document.createElement("section");
	section.innerHTML = '<div><div class="subjectName">' + subjectName 
						+'</div><input type="button" value="X" class="remove"></div>';

	let addSubject = $(".addSubject");
	addSubject.before(section);

	$(section).hover(function(e) {
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 1);
	}, function(e) {
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 0);
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
	window.location.href = "/pratice?suubjectName=" + subjectName;
}

// 删除某个科目，并将该科目的所有题库从数据库中删除
function removeSubject(removeTarget) {
	removeTarget.remove();
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
		}
	});
}