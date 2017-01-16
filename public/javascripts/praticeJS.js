let currentPraticeType = "chapter";

let randomPraticeListInnerHtml = `<li>单选题</li><li>多选题</li><li>判断题</li>
                                  <li>填空题</li><li>简答题</li><li>编程题</li>`;

/** 显示当前练习的习题内容
 * @param className String 当前练习的类名（如chapter、random等）
*/
function showIndex(className) {
	$(".praticeContent > section").css("display", "none");
	$("." + className + "Content").css("display", "block");
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
	getCurrentToolbar();
}

function bindEvent() {
	$(".typeNav").click(function(e) {
		let target = getTarget(e);

		let allDiv = $(".typeNav div");
		for(let i=0, len=allDiv.length; i<len; i++) {
			$(allDiv[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(target).css("background", "rgba(249, 90, 78, 0.8)");

		let className = target.className;
		showIndex(className);
		currentPraticeType = className;

		if (e.target.className == "random") {
			$(".praticeContent aside ul")[0].innerHTML = randomPraticeListInnerHtml;
		}
	});

	$(".praticeContent > aside > ul").click(function(e) {
		if (getTarget(e).className === "removeIndex") {
			return;
		}
		
		let allLi = $(".praticeContent > aside li");
		for(let i=0, len=allLi.length; i<len; i++) {
			$(allLi[i]).css("background", "rgba(0, 0, 0, 0.5)");
		}
		$(getTarget(e)).css("background", "rgba(164, 205, 51, 0.4)");

		if (currentPraticeType == "random") {
			showRandomPraticeListEnter(e.target.innerHTML);
		}
	});

	$(".addMore")[0].onclick = function() {
		window.location.href = window.location.href + "&praticeType=" + currentPraticeType;
	};
}