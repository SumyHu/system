function init() {
	let allDetails = $(".details");
	for(let i=0, len=allDetails.length; i<len; i++) {
		console.log($(allDetails[i]).find(".title")[0].innerHTML);
		if($(allDetails[i]).find(".title")[0].innerHTML === "简答题得分") {
			$(".ps").css("display", "block");
		}
	}
}

function bindEvent() {
	$(".seeMoreBtn").click(function(e) {
		window.location.href = "../pratice?" + $(".urlParam").val() + "&showScore=true";
	});
}