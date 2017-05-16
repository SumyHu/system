"use strict";

var initData = [],
    allDataGroupByNameAndDate = {},
    allDataGroupByNameAndOrderByUserid = {};

function getAllTestHistory(callback) {
	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "findAll"
		},
		success: function success(data) {
			console.log(data);
			dataProcess(data);
			callback(allDataGroupByNameAndOrderByUserid);
		}
	});
}

function dataProcess(data) {
	initData = data;

	for (var i = 0, len = data.length; i < len; i++) {
		var thisData = data[i],
		    testName = thisData.testName,
		    date = new Date(thisData.date),
		    dateString = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		if (!allDataGroupByNameAndDate[testName]) {
			allDataGroupByNameAndDate[testName] = {};
			allDataGroupByNameAndOrderByUserid[testName] = [];
		}
		if (!allDataGroupByNameAndDate[testName][dateString]) {
			allDataGroupByNameAndDate[testName][dateString] = [];
		}
		allDataGroupByNameAndDate[testName][dateString].push({
			index: i,
			content: thisData
		});
		allDataGroupByNameAndOrderByUserid[testName].push({
			index: i,
			content: thisData
		});
	}

	for (var _testName in allDataGroupByNameAndDate) {
		for (var _date in allDataGroupByNameAndDate[_testName]) {
			allDataGroupByNameAndDate[_testName][_date].sort(function (a, b) {
				return parseInt(a.content.userId) - parseInt(b.content.userId);
			});
		}
	}

	console.log(allDataGroupByNameAndOrderByUserid);

	for (var _testName2 in allDataGroupByNameAndOrderByUserid) {
		allDataGroupByNameAndOrderByUserid[_testName2].sort(function (a, b) {
			return parseInt(a.content.userId) - parseInt(b.content.userId);
		});
	}
}

function addRow(thisContent, testNameCount) {
	var realContent = thisContent.content,
	    scoresDetail = realContent.scoresDetail,
	    details = scoresDetail.details,
	    tbodyHtml = "",
	    contentHtml = "";
	contentHtml += "<tr class='testName" + testNameCount + "-content content' id='" + thisContent.index + "'><td class='userId'>" + realContent.userId + "</td><td>" + scoresDetail.totalScore + "</td><td><table><thead>";
	for (var type in details) {
		contentHtml += "<th>" + type + "</th>";

		if (type === "简答题") {
			tbodyHtml += "<td>" + details[type] + "<input type='button' class='modify'></td>";
		} else {
			tbodyHtml += "<td>" + details[type] + "</td>";
		}
	}
	contentHtml += "</thead><tbody><tr>" + tbodyHtml + "</tr></tbody></table></td><td>" + new Date(realContent.date).toLocaleString() + "</td><td><input type='button' class='remove'></td>";

	return contentHtml;
}

function addAllTestHistoryInTable(addData) {
	var tbody = $(".showtestResultsInfo > table > tbody")[0],
	    testNameCount = 0,
	    allContentHtml = "";
	tbody.innerHTML = "";
	for (var testName in addData) {
		var contentHtml = "<tr class='testName' id='testName" + testNameCount + "'><td colspan=4>" + testName + "<span class='icon'>︽</span></td><td><input type='button' class='remove'></td></tr>",
		    thisContentObj = addData[testName];

		if (thisContentObj instanceof Array) {
			for (var i = 0, len = thisContentObj.length; i < len; i++) {
				contentHtml += addRow(thisContentObj[i], testNameCount);
			}
		} else {
			for (var date in thisContentObj) {
				var thisContentArray = thisContentObj[date];
				for (var _i = 0, _len = thisContentArray.length; _i < _len; _i++) {
					contentHtml += addRow(thisContentArray[_i], testNameCount);
				}
			}
		}
		testNameCount++;
		allContentHtml += contentHtml;
	}
	$(tbody).html(allContentHtml);
}

function testNameClick($trTarget) {
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

function removeOneTestNameAllRecord($removeTestName) {
	var content = $("." + $removeTestName[0].id + "-content");

	var _loop = function _loop(i, len) {
		removeOneRecord($(content[i]), function () {
			if (i === len - 1) {
				showTips("删除成功！", 1000);
			}
		});
	};

	for (var i = 0, len = content.length; i < len; i++) {
		_loop(i, len);
	}
}

function removeOneRecord($removeTarget, callback) {
	var classname = $removeTarget[0].className;
	$removeTarget.remove();

	var testNameId = classname.substr(0, 9);

	if ($("." + testNameId + "-content").length === 0) {
		$("#" + testNameId).remove();
	}

	var index = $removeTarget[0].id,
	    testResultsId = initData[index]._id,
	    userId = $removeTarget.find(".userId")[0].innerHTML;

	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "remove",
			removeOpt: {
				_id: testResultsId
			}
		},
		success: function success() {
			callDataProcessingFn({
				data: {
					data: "users",
					callFunction: "find",
					findOpt: {
						_id: userId
					}
				},
				success: function success(data) {
					var testHistory = data.testHistory;
					for (var i = 0, len = testHistory.length; i < len; i++) {
						if (testHistory[i] === testResultsId) {
							testHistory.splice(i, 1);
							break;
						}
					}
					callDataProcessingFn({
						data: {
							data: "users",
							callFunction: "update",
							updateOpt: {
								_id: userId
							},
							operation: "set",
							update: {
								testHistory: testHistory
							}
						},
						success: function success() {
							if (callback) {
								callback();
							} else {
								showTips("删除成功！", 1000);
							}
						}
					});
				}
			});
		}
	});
}

function init() {
	getAllTestHistory(addAllTestHistoryInTable);

	var testName = decodeURIComponent(getValueInUrl("testName"));
	if (testName) {
		var count = 0;
		for (var name in allDataGroupByNameAndDate) {
			if (name == testName) {
				$(".testName" + count + "-content").css("display", "table-row");
				$("#testName" + count + " .icon").html("︾");
				break;
			}
			count++;
		}

		window.history.pushState({}, 0, "../testResultsManage");
	}
}

function bindEvent() {
	$(".searchBtn").click(function () {
		var $dateSearch = $(this).parent(),
		    yearString = $dateSearch.find(".year").val(),
		    monthString = $dateSearch.find(".month").val(),
		    dayString = $dateSearch.find(".day").val(),
		    year = Number(yearString),
		    month = Number(monthString),
		    day = Number(dayString);

		if (!year && yearString || !month && monthString || !day && dayString) {
			showTips("请输入正确的日期！", 1000);
			return;
		}

		if (!(year || month || day)) {
			addAllTestHistoryInTable(allDataGroupByNameAndOrderByUserid);
		} else {
			var RegExpObject = new RegExp((year ? year : "\\d+") + "\/" + (month ? month : "\\d+") + "\/" + (day ? day : "\\d+"));

			var addData = {},
			    outerFlag = false;
			for (var name in allDataGroupByNameAndDate) {
				var flag = false,
				    addDataByDate = {};
				for (var date in allDataGroupByNameAndDate[name]) {
					if (RegExpObject.test(date)) {
						flag = true;
						addDataByDate[date] = allDataGroupByNameAndDate[name][date];
					}
				}
				if (flag) {
					outerFlag = true;
					addData[name] = addDataByDate;
				}
			}
			if (outerFlag) {
				addAllTestHistoryInTable(addData);
				$(".content").css("display", "table-row");
				$(".icon").html("︾");
			} else {
				var tbody = $(".showtestResultsInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=5>暂无记录</td><tr>";
			}
		}
	});

	$(".showtestResultsInfo > table > tbody").click(function (e) {
		var $target = $(getTarget(e)),
		    classname = $target[0].className;
		if (classname === "remove") {
			var $tr = $target.parent().parent(),
			    trClassName = $tr[0].className,
			    removeFn = void 0;
			if (trClassName === "testName") {
				removeFn = removeOneTestNameAllRecord;
			} else {
				removeFn = removeOneRecord;
			}
			showWin("确定删除该条记录？", function () {
				removeFn($tr);
			}, function () {}, true);
		} else if (classname === "modify") {
			var index = $target.parent().parent().parent().parent().parent().parent()[0].id,
			    data = initData[index],
			    testName = data.testName.replace(/\s+/g, "").split("|"),
			    correctAnswerContent = {
				ShortAnswer: data.correctAnswerContent.ShortAnswer
			},
			    studentAnswerContent = {
				ShortAnswer: data.studentAnswerContent.ShortAnswer
			},
			    scoresObj = {
				ShortAnswer: data.scoresObj.ShortAnswer
			},
			    testId = data._id;
			console.log(data.scoresObj.ShortAnswer);

			window.location.href = "../pratice?subjectName=" + testName[0] + "&index=" + (testName[1].substr(2) - 1) + "&modifyShortAnswerScore=true" + "&correctAnswerContent=" + JSON.stringify(correctAnswerContent) + "&studentAnswerContent=" + JSON.stringify(studentAnswerContent) + "&scoresObj=" + JSON.stringify(scoresObj) + "&testId=" + testId;
		} else if (classname === "icon") {
			testNameClick($target.parent().parent());
		} else if ($target.parent()[0].className === "testName") {
			testNameClick($target.parent());
		}
	});
}