"use strict";

var userId = void 0,
    dataGroupByDate = {},
    allData = [];

function getUserTestHistoryId(callback) {
	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "find",
			findOpt: {
				_id: userId
			}
		},
		success: function success(result) {
			var testHistoryArray = result.testHistory;
			callback(testHistoryArray);
		}
	});
}

function showUserTestHistory(testHistoryArray) {
	var _loop = function _loop(i, len) {
		callDataProcessingFn({
			data: {
				data: "testResults",
				callFunction: "find",
				findOpt: {
					_id: testHistoryArray[i]
				}
			},
			success: function success(data) {
				historyProcess(data);
				if (i === len - 1) {
					addAllHistoryInTable(dataGroupByDate);
				}
			}
		});
	};

	for (var i = 0, len = testHistoryArray.length; i < len; i++) {
		_loop(i, len);
	}
}

function historyProcess(data) {
	var year = new Date(data.date).getFullYear(),
	    month = new Date(data.date).getMonth() + 1;
	if (!dataGroupByDate[year + "/" + month]) {
		dataGroupByDate[year + "/" + month] = [];
	}
	dataGroupByDate[year + "/" + month].push(data);
	allData.push(data);
}

function addAllHistoryInTable(dataGroupByDateTarget) {
	var tableTbody = $(".showtestHistoryInfo > table > tbody")[0],
	    testTimeCount = 0,
	    contentCount = 0,
	    allContentHtml = "";
	tableTbody.innerHTML = "";
	for (var date in dataGroupByDateTarget) {
		var contentHtml = "<tr class='testTime' id='testTime" + testTimeCount + "'><td colspan=5>" + date + "<span class='icon'>︽</span></td></tr>",
		    historyContentArray = dataGroupByDateTarget[date];
		for (var i = 0, len = historyContentArray.length; i < len; i++) {
			var thisContent = historyContentArray[i],
			    scoresDetail = thisContent.scoresDetail,
			    details = scoresDetail.details;
			contentHtml += "<tr class='testTime" + testTimeCount + "-content content' id='" + contentCount + "''><td>" + thisContent.testName + "</td><td>" + scoresDetail.totalScore + "</td><td><table><thead>";
			var childTbodyHtml = "<tbody><tr>";
			for (var type in details) {
				contentHtml += "<th>" + type + "</th>";
				childTbodyHtml += "<td>" + details[type] + "</td>";
			}
			childTbodyHtml += "</tr></tbody>";
			contentHtml += "</thead>" + childTbodyHtml + "</table>" + "<td>" + new Date(thisContent.date).toLocaleString() + "</td>" + "<td class='seeMore'>查看详情</td></tr>";

			contentCount++;
		}
		testTimeCount++;
		allContentHtml += contentHtml;
	}
	$(tableTbody).html(allContentHtml);
}

function testTimeClick($trTarget) {
	var icon = $trTarget.find(".icon")[0].innerHTML,
	    id = $trTarget[0].id,
	    displayStyle = void 0;
	if (icon === "︽") {
		icon = "︾";
		displayStyle = "table-row";
	} else {
		icon = "︽";
		displayStyle = "none";
	}
	$trTarget.find(".icon")[0].innerHTML = icon;
	$("." + id + "-content").css("display", displayStyle);
}

function seeMore($tdTarget) {
	var index = $tdTarget.parent()[0].id,
	    content = allData[index],
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
	$(".showtestHistoryInfo > table > tbody").click(function (e) {
		var $target = $(getTarget(e)),
		    classname = $target[0].className;
		if (classname === "seeMore") {
			seeMore($target);
		} else if (classname === "icon") {
			testTimeClick($target.parent().parent());
		} else if ($target[0].colSpan === 5) {
			if ($target[0].innerHTML === "暂无记录") {
				return;
			}
			testTimeClick($target.parent());
		}
	});

	$(".searchBtn").click(function () {
		var $dateSearch = $(this).parent(),
		    yearString = $dateSearch.find(".year").val(),
		    monthString = $dateSearch.find(".month").val(),
		    year = Number(yearString),
		    month = Number(monthString);
		if (!year && yearString || !month && monthString) {
			showTips("请输入正确的日期！", 1000);
			return;
		}
		if (!yearString && !monthString) {
			addAllHistoryInTable(dataGroupByDate);
		} else {
			var RegExpObject = new RegExp((year ? year : "\\d+") + "\/" + (month ? month : "\\d+"));
			var addData = {},
			    flag = false;
			for (var date in dataGroupByDate) {
				if (RegExpObject.test(date)) {
					flag = true;
					addData[date] = dataGroupByDate[date];
				}
			}
			if (flag) {
				addAllHistoryInTable(addData);
				$(".content").css("display", "table-row");
				$(".icon").html("︾");
			} else {
				var tbody = $(".showtestHistoryInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=5>暂无记录</td><tr>";
			}
		}
	});
}