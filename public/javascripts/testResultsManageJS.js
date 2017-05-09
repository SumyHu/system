let initData = [], allDataGroupByNameAndDate = {};

function getAllTestHistory(callback) {
	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "findAll"
		},
		success: function(data) {
			dataProcess(data);
			callback(allDataGroupByNameAndDate);
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
		}
		if (!allDataGroupByNameAndDate[testName][dateString]) {
			allDataGroupByNameAndDate[testName][dateString] = [];
		}
		allDataGroupByNameAndDate[testName][dateString].push({
			index: i,
			content: thisData
		});
	}
}

function addAllTestHistoryInTable(addData) {
	let tbody = $(".showtestResultsInfo > table > tbody")[0], testNameCount = 0;
	tbody.innerHTML = "";
	for(let testName in addData) {
		let contentHtml = "<tr class='testName' id='testName" + testNameCount + "'><td colspan=5>" + testName + "<span class='icon'>︽</span></td></tr>",
			thisContentObj = addData[testName];
		for(let date in thisContentObj) {
			let thisContentArray = thisContentObj[date];
			for(let i=0, len=thisContentArray.length; i<len; i++) {
				let thisContent = thisContentArray[i], realContent = thisContent.content, scoresDetail = realContent.scoresDetail, details = scoresDetail.details, tbodyHtml = "";
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

function removeOneRecord($targetBtn) {
	let $removeTarget = $targetBtn.parent().parent(), classname = $removeTarget[0].className;
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
							showTips("删除成功！", 1000);
						}
					});
				}
			});
		}
	});
}

function init() {
	getAllTestHistory(addAllTestHistoryInTable);

	// callDataProcessingFn({
	// 	data: {
	// 		data: "users",
	// 		callFunction: "update",
	// 		updateOpt: {
	// 			_id: "201330810410"
	// 		},
	// 		operation: "pop",
	// 		update: {
	// 			"testHistory": "59106487135436c016dfc278"
	// 		}
	// 	},
	// 	success: function(data) {
	// 		console.log(data);
	// 	}
	// });
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

		if (year && month && day) {
			let addData = {}, outerFlag = false;
			for(let name in allDataGroupByNameAndDate) {
				let flag = false, addDataByDate = {};
				for(let date in allDataGroupByNameAndDate[name]) {
					if (date == (year+"/"+month+"/"+day)) {
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
				$(".icon")[0].innerHTML = "︾";
			}
			else {
				let tbody = $(".showtestResultsInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=5>暂无记录</td><tr>";
			}
		}
	});

	$(".showtestResultsInfo > table > tbody").click(function(e) {
		console.log(getTarget(e));
		let $target = $(getTarget(e)), classname = $target[0].className;
		if (classname === "remove") {
			showWin("确定删除该条记录？", function() {
				removeOneRecord($target);
			});
		}
		else if (classname === "icon") {
			testNameClick($target.parent().parent());
		}
		else if ($target[0].colSpan === 5 && $target.find(".icon").length) {
			testNameClick($target.parent());
		}
	});

	$(".remove").click(function() {
		// let $removeTarget = $(this).parent().parent(), classname = $removeTarget[0].className;
		// $removeTarget.remove();

		// let testNameId = classname.substr(0, 9);

		// if ($("." + testNameId + "-content").length === 0) {
		// 	$("#" + testNameId).remove();
		// }

		// let index = $removeTarget[0].id, testResultsId = initData[index]._id, 
		// 	userId = $removeTarget.find(".userId")[0].innerHTML;

		// callDataProcessingFn({
		// 	data: {
		// 		data: "testResults",
		// 		callFunction: "remove",
		// 		removeOpt: {
		// 			_id: testResultsId
		// 		}
		// 	},
		// 	success: function() {
		// 		callDataProcessingFn({
		// 			data: {
		// 				data: "users",
		// 				callFunction: "find",
		// 				findOpt: {
		// 					_id: userId
		// 				}
		// 			},
		// 			success: function(data) {
		// 				let testHistory = data.testHistory;
		// 				for(let i=0, len=testHistory.length; i<len; i++) {
		// 					if (testHistory[i] === testResultsId) {
		// 						testHistory.splice(i, 1);
		// 						break
		// 					}
		// 				}
		// 				callDataProcessingFn({
		// 					data: {
		// 						data: "users",
		// 						callFunction: "update",
		// 						updateOpt: {
		// 							_id: userId
		// 						},
		// 						operation: "set",
		// 						update: {
		// 							testHistory: testHistory
		// 						}
		// 					},
		// 					success: function() {
		// 						showTips("删除成功！", 1000);
		// 					}
		// 				});
		// 			}
		// 		});
		// 	}
		// });
	});
}