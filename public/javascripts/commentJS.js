function showTips(msg) {
	let $tips = $(".tips");
	$tips[0].innerHTML = msg;
	$tips.css("height", 50);
}

function isEmpty($inputTatget) {
	if (!$inputTatget.val()) {
		return true;
	}
	else {
		return false;
	}
}