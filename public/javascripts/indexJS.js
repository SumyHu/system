function newSubjectName() {
	if ($(".winBg").length == 0) {
		let contentHTML = `<div>请输入科目名称：</div>
							<div><input class="textInput" type="text"
							 style="color: #000; border-bottom-color: #000; margin: 20px 0;">
							 </div>`
		createWin(contentHTML);
	}
	showWin();
}

function addSubject(subjectName) {
	let section = document.createElement("section");
	section.innerHTML = '<div><div>' + subjectName 
						+'</div><input type="button" value="X" class="remove"></div>';

	let addSubject = $(".addSubject");
	addSubject.before(section);
}

function bindEvent() {
	toobarEvent();

	// 当鼠标经过科目时，显示删除按钮
	$(".subject > section").hover(function(e) {
		// $(".remove").css("display", "none");
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 1);
	}, function(e) {
		let target = getTarget(e);
		$(target).find(".remove").css("opacity", 0);
	});

	// 绑定添加科目事件
	$(".addSubject")[0].onclick = function() {
		newSubjectName();
		bindWinEvent(function() {
			let subjectName = $(".textInput").val();
			if (subjectName) {
				addSubject($(".textInput").val());
			}
			inputRest("text");
		}, function() {
			inputRest("text");
		});
	};
}

$(function() {
	bindEvent();
});