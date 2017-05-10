let userId, dataGroupByDate = {}, allData = [];

function getUserTestHistoryId(callback) {
	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "find",
			findOpt: {
				_id: userId
			}
		},
		success: function(result) {
			let testHistoryArray = result.testHistory;
			callback(testHistoryArray);
		}
	});
}

function showUserTestHistory(testHistoryArray) {
	for(let i=0, len=testHistoryArray.length; i<len; i++) {
		callDataProcessingFn({
			data: {
				data: "testResults",
				callFunction: "find",
				findOpt: {
					_id: testHistoryArray[i]
				}
			},
			success: function(data) {
				historyProcess(data);
				if (i === len-1) {
					addAllHistoryInTable(dataGroupByDate);
				}
			}
		});
	}
}

function historyProcess(data) {
	let year = new Date(data.date).getFullYear(), month = (new Date(data.date).getMonth()+1);
	if (!dataGroupByDate[year + "/" + month]) {
		dataGroupByDate[year + "/" + month] = [];
	}
	dataGroupByDate[year + "/" + month].push(data);
	allData.push(data);
}

function addAllHistoryInTable(dataGroupByDateTarget) {
	let tableTbody = $(".showtestHistoryInfo > table > tbody")[0], testTimeCount = 0, contentCount = 0;
	tableTbody.innerHTML = "";
	for(let date in dataGroupByDateTarget) {
		let contentHtml = "<tr class='testTime' id='testTime" + testTimeCount + "'><td colspan=5>" + date + "<span class='icon'>︽</span></td></tr>", 
			historyContentArray = dataGroupByDateTarget[date];
		for(let i=0, len=historyContentArray.length; i<len; i++) {
			let thisContent = historyContentArray[i], scoresDetail = thisContent.scoresDetail, details = scoresDetail.details;
			contentHtml += "<tr class='testTime" + testTimeCount + "-content content' id='" 
						+ contentCount + "''><td>"
						+ thisContent.testName + "</td><td>"
						+ scoresDetail.totalScore + "</td><td><table><thead>";
			let childTbodyHtml = "<tbody><tr>";
			for(let type in details) {
				contentHtml += "<th>" + type + "</th>"
				childTbodyHtml += "<td>" + details[type] + "</td>"
			}
			childTbodyHtml += "</tr></tbody>"
			contentHtml += "</thead>" + childTbodyHtml + "</table>"
						+ "<td>" + new Date(thisContent.date).toLocaleString() + "</td>"
						+ "<td class='seeMore'>查看详情</td></tr>";

			contentCount ++;
		}
	    testTimeCount ++;
		tableTbody.innerHTML += contentHtml;
	}
}

function testTimeClick($trTarget) {
	let icon = $trTarget.find(".icon")[0].innerHTML, id = $trTarget[0].id, displayStyle;
		if (icon === "︽") {
			icon = "︾";
			displayStyle = "table-row";
		}
		else {
			icon = "︽";
			displayStyle = "none";
		}
		$trTarget.find(".icon")[0].innerHTML = icon;
		$("." + id + "-content").css("display", displayStyle);
}

function seeMore($tdTarget) {
	let index = $tdTarget.parent()[0].id, content = allData[index], 
	scoresDetail = content.scoresDetail,
	queryScoresDetail = {
		correctAnswerContent: content.correctAnswerContent,
		studentAnswerContent: content.studentAnswerContent,
		scoresObj: content.scoresObj
	};
	console.log(content);
	window.location.href = "../pratice?" + decodeURIComponent(scoresDetail.urlParam) + "&showScore=" + encodeURIComponent("../showScore?scoresDetail=") + encodeURIComponent(JSON.stringify(scoresDetail)) + "&scoresDetail=" + encodeURIComponent(JSON.stringify(queryScoresDetail));
}

function init() {
	userId = $(".showUsername")[0].id;
	getUserTestHistoryId(showUserTestHistory);
}

function bindEvent() {
	$(".showtestHistoryInfo > table > tbody").click(function(e) {
		let $target = $(getTarget(e)), classname = $target[0].className;
		if (classname === "seeMore") {
			seeMore($target);
		}
		else if (classname === "icon") {
			testTimeClick($target.parent().parent());
		}
		else if ($target[0].colSpan === 5) {
			if ($target[0].innerHTML === "暂无记录") {
				return;
			}
			testTimeClick($target.parent());
		}
	});

	$(".searchBtn").click(function() {
		let $dateSearch = $(this).parent(), 
			yearString = $dateSearch.find(".year").val(),
			monthString = $dateSearch.find(".month").val(),
			year = Number(yearString),
			month = Number(monthString);
		if ((!year&&yearString) || (!month&&monthString)) {
			showTips("请输入正确的日期！", 1000);
			return;
		}
		if (!yearString && !monthString) {
			addAllHistoryInTable(dataGroupByDate);
		}
		else {
			let RegExpObject = new RegExp((year?year:"\\d+") + "\/" + (month?month:"\\d+"));
			let addData = {}, flag = false;
			for(let date in dataGroupByDate) {
				if (RegExpObject.test(date)) {
					flag = true;
					addData[date] = dataGroupByDate[date];
				}
			}
			if (flag) {
				addAllHistoryInTable(addData);
				$(".content").css("display", "table-row");
				$(".icon").html("︾");
			}
			else {
				let tbody = $(".showtestHistoryInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=5>暂无记录</td><tr>";
			}
		}
	});
}