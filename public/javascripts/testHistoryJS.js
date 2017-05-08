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
			console.log(testHistoryArray);
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
					addAllHistoryInTable();
				}
			}
		});
	}
}

function historyProcess(data) {
	let year = new Date(data.date).getFullYear(), month = new Date(data.date).getMonth();
	if (!dataGroupByDate[year + "/" + month]) {
		dataGroupByDate[year + "/" + month] = [];
	}
	dataGroupByDate[year + "/" + month].push(data);
	allData.push(data);
}

function addAllHistoryInTable() {
	let tableTbody = $(".showtestHistoryInfo > table > tbody")[0], testTimeCount = 0, contentCount = 0;
	for(let date in dataGroupByDate) {
		let contentHtml = "<tr class='testTime' id='testTime" + testTimeCount + "'><td colspan=5>" + date + "<span class='icon'>︽</span></td></tr>", 
			historyContentArray = dataGroupByDate[date];
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

		    testTimeCount ++;
			contentCount ++;
		}
		tableTbody.innerHTML += contentHtml;
	}
}

function init() {
	userId = $(".showUsername")[0].id;
	getUserTestHistoryId(showUserTestHistory);
}

function bindEvent() {
	$(".testTime").click(function() {
		let icon = $(this).find(".icon")[0].innerHTML, id = this.id, displayStyle;
		if (icon === "︽") {
			icon = "︾";
			displayStyle = "table-row";
		}
		else {
			icon = "︽";
			displayStyle = "none";
		}
		$(this).find(".icon")[0].innerHTML = icon;
		$("." + id + "-content").css("display", displayStyle);
	});

	$(".seeMore").click(function() {
		let index = $(this).parent()[0].id, content = allData[index], 
		scoresDetail = content.scoresDetail,
		queryScoresDetail = {
			correctAnswerContent: content.correctAnswerContent,
			studentAnswerContent: content.studentAnswerContent,
			scoresObj: content.scoresObj
		};
		console.log(content);
		window.location.href = "../pratice?" + decodeURIComponent(scoresDetail.urlParam) + "&showScore=" + encodeURIComponent("../showScore?scoresDetail=") + encodeURIComponent(JSON.stringify(scoresDetail)) + "&scoresDetail=" + encodeURIComponent(JSON.stringify(queryScoresDetail));
	});
}