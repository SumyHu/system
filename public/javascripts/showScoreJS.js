"use strict";

function init() {
	var allDetails = $(".details");
	for (var i = 0, len = allDetails.length; i < len; i++) {
		if ($(allDetails[i]).find(".title")[0].innerHTML === "简答题得分") {
			$(".ps").css("display", "block");
		}
	}
}

function bindEvent() {
	$(".seeMoreBtn").click(function (e) {
		var preWindowLocationHref = window.location.href;
		window.location.href = "../pratice?" + $(".urlParam").val() + "&showScore=" + encodeURIComponent(preWindowLocationHref);
	});
}