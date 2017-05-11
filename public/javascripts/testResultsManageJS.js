let initData = [], allDataGroupByNameAndDate = {}, allDataGroupByNameAndOrderByUserid = {};

function getAllTestHistory(callback) {
	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "findAll"
		},
		success: function(data) {
			console.log(data);
			dataProcess(data);
			callback(allDataGroupByNameAndOrderByUserid);
		}
	});
}

function dataProcess(data) {
	initData = data;

	for(let i=0, len=data.length; i<len; i++) {
		let thisData = data[i], testName = thisData.testName, date = new Date(thisData.date),
			dateString = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
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

	for(let testName in allDataGroupByNameAndDate) {
		for(let date in allDataGroupByNameAndDate[testName]) {
			allDataGroupByNameAndDate[testName][date].sort(function(a, b) {
				return parseInt(a.content.userId)-parseInt(b.content.userId);
			});
		}
	}

	console.log(allDataGroupByNameAndOrderByUserid);

	for(let testName in allDataGroupByNameAndOrderByUserid) {
		allDataGroupByNameAndOrderByUserid[testName].sort(function(a, b) {
			return parseInt(a.content.userId)-parseInt(b.content.userId);
		});
	}
}

function addRow(thisContent, testNameCount) {
	let realContent = thisContent.content, scoresDetail = realContent.scoresDetail, details = scoresDetail.details, tbodyHtml = "", contentHtml = "";
	contentHtml += "<tr class='testName" + testNameCount + "-content content' id='" 
				+ thisContent.index + "'><td class='userId'>" + realContent.userId + "</td><td>"
				+ scoresDetail.totalScore + "</td><td><table><thead>";
	for(let type in details) {
		contentHtml += "<th>" + type + "</th>";

		if (type === "简答题") {
			tbodyHtml += "<td>" + details[type] + "<input type='button' class='modify'></td>";
		}
		else {
			tbodyHtml += "<td>" + details[type] + "</td>";
		}
	}
	contentHtml += "</thead><tbody><tr>" + tbodyHtml + "</tr></tbody></table></td><td>" + new Date(realContent.date).toLocaleString() + "</td><td><input type='button' class='remove'></td>";

	return contentHtml;
}

function addAllTestHistoryInTable(addData) {
	let tbody = $(".showtestResultsInfo > table > tbody")[0], testNameCount = 0;
	tbody.innerHTML = "";
	for(let testName in addData) {
		let contentHtml = "<tr class='testName' id='testName" + testNameCount + "'><td colspan=4>" + testName + "<span class='icon'>︽</span></td><td><input type='button' class='remove'></td></tr>",
			thisContentObj = addData[testName];

		if (thisContentObj instanceof Array) {
			for(let i=0, len=thisContentObj.length; i<len; i++) {
				contentHtml += addRow(thisContentObj[i], testNameCount);
			}
		}
		else {
			for(let date in thisContentObj) {
				let thisContentArray = thisContentObj[date];
				for(let i=0, len=thisContentArray.length; i<len; i++) {
					contentHtml += addRow(thisContentArray[i], testNameCount);
				}
			}
		}
		testNameCount ++;
		tbody.innerHTML += contentHtml;
	}
}

function testNameClick($trTarget) {
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

function removeOneTestNameAllRecord($removeTestName) {
	let content = $("." + $removeTestName[0].id + "-content");
	for(let i=0, len=content.length; i<len; i++) {
		removeOneRecord($(content[i]), function() {
			if (i === len-1) {
				showTips("删除成功！", 1000);
			}
		});
	}
}

function removeOneRecord($removeTarget, callback) {
	let classname = $removeTarget[0].className;
	$removeTarget.remove();

	let testNameId = classname.substr(0, 9);

	if ($("." + testNameId + "-content").length === 0) {
		$("#" + testNameId).remove();
	}

	let index = $removeTarget[0].id, testResultsId = initData[index]._id, 
		userId = $removeTarget.find(".userId")[0].innerHTML;

	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "remove",
			removeOpt: {
				_id: testResultsId
			}
		},
		success: function() {
			callDataProcessingFn({
				data: {
					data: "users",
					callFunction: "find",
					findOpt: {
						_id: userId
					}
				},
				success: function(data) {
					let testHistory = data.testHistory;
					for(let i=0, len=testHistory.length; i<len; i++) {
						if (testHistory[i] === testResultsId) {
							testHistory.splice(i, 1);
							break
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
						success: function() {
							if (callback) {
								callback();
							}
							else {
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

	let testName = decodeURIComponent(getValueInUrl("testName"));
	if (testName) {
		let count = 0;
		for(let name in allDataGroupByNameAndDate) {
			if (name == testName) {
				$(".testName" + count + "-content").css("display", "table-row");
				$("#testName" + count + " .icon").html("︾");
				break;
			}
			count ++;
		}

		window.history.pushState({}, 0, "../testResultsManage");
	}
}

function bindEvent() {
	$(".searchBtn").click(function() {
		let $dateSearch = $(this).parent(),
		yearString = $dateSearch.find(".year").val(),
		monthString = $dateSearch.find(".month").val(),
		dayString = $dateSearch.find(".day").val(),
		year = Number(yearString),
		month = Number(monthString),
		day = Number(dayString);

		if ((!year && yearString) || (!month && monthString) || (!day && dayString)) {
			showTips("请输入正确的日期！", 1000);
			return;
		}

		if (!(year || month || day)) {
			addAllTestHistoryInTable(allDataGroupByNameAndOrderByUserid);
		}
		else {
			let RegExpObject = new RegExp((year?year:"\\d+") + "\/" + (month?month:"\\d+") + "\/" + (day?day:"\\d+"));

			let addData = {}, outerFlag = false;
			for(let name in allDataGroupByNameAndDate) {
				let flag = false, addDataByDate = {};
				for(let date in allDataGroupByNameAndDate[name]) {
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
			}
			else {
				let tbody = $(".showtestResultsInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=5>暂无记录</td><tr>";
			}
		}
	});

	$(".showtestResultsInfo > table > tbody").click(function(e) {
		let $target = $(getTarget(e)), classname = $target[0].className;
		if (classname === "remove") {
			let $tr = $target.parent().parent(), trClassName = $tr[0].className, removeFn;
			if (trClassName === "testName") {
				removeFn = removeOneTestNameAllRecord;
			}
			else {
				removeFn = removeOneRecord;
			}
			showWin("确定删除该条记录？", function() {
				removeFn($tr);
			}, function() {}, true);
		}
		else if (classname === "modify") {
			let index = $target.parent().parent().parent().parent().parent().parent()[0].id,
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

			window.location.href = "../pratice?subjectName=" + testName[0] + "&index=" 
									+ (testName[1].substr(2)-1) + "&modifyShortAnswerScore=true"
									+ "&correctAnswerContent=" + JSON.stringify(correctAnswerContent)
									+ "&studentAnswerContent=" + JSON.stringify(studentAnswerContent)
									+ "&scoresObj=" + JSON.stringify(scoresObj)
									+ "&testId=" + testId;
		}
		else if (classname === "icon") {
			testNameClick($target.parent().parent());
		}
		else if ($target.parent()[0].className === "testName") {
			testNameClick($target.parent());
		}
	});
}