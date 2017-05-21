"use strict";

var initData = [],
    allDataGroupByNameAndClassAndDate = {},
    allDataGroupByNameAndClassAndOrderByUserid = {}, 
    currentShowData = {};   // 存储搜索结果

/** 将数据导出成Excel文件
*/
function exportExcel(exportData) {
	var contentHtml = "<div class=\"title\">将数据导出成Excel文件</div><div class=\"filenameInWin\">文件名：<br><input type=\"text\" class=\"textInput\"></div><div class=\"filePathInWin\">文件保存路径（绝对路径）：<br><input type=\"text\" class=\"textInput\"><br><span class=\"defaultPath\">（默认路径为：C:/Users/Administrator/Downloads）</div></span>";

	showWin(contentHtml, function() {
		var filename = $(".filenameInWin > .textInput").val(), 
			dirPath = $(".filePathInWin > .textInput").val();

		if (!filename) {
			showTips("请填写文件名！", 1000);
			return;
		}

		if (!dirPath) {
			dirPath = "C:/Users/Administrator/Downloads";
		}

		exportData.splice(0, 0, ["学号", "姓名", "班级", "成绩"]);

		console.log(filename, dirPath);
		$.ajax({
			url: "../exportExcel",
			type: "post",
			data: {
				dirPath: dirPath,
				filename: filename,
				exportData: exportData
			},
			success: function(result) {
				if (result.success) {
					showTips("导出成功！（文件路径："+dirPath+filename + "）", 1500);
				}
				else {
					showTips(result.error, 1000);
				}
			}
		});
	});
}

/** 获取所有的测试记录
 * @param callback Function 回调函数
*/
function getAllTestHistory(callback) {
	callDataProcessingFn({
		data: {
			data: "testResults",
			callFunction: "findAll"
		},
		success: function success(data) {
			console.log(data);
			dataProcess(data);
			console.log(allDataGroupByNameAndClassAndOrderByUserid);
			currentShowData = allDataGroupByNameAndClassAndOrderByUserid;
			callback();
		}
	});
}

// 将obj对象按照key值进行排序
function objKeySort(obj) {  
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(obj).sort();
　　
    var newObj = {};   //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {   //遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]];   //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;   //返回排好序的新对象
}

/** 将所有以试卷名、班级名称分类的数据按照学号进行排序
 * @param data Object 数据
 * data = allDataGroupByNameAndClassAndOrderByUserid = {
    	"java|试卷1": {   // 存储有该试卷测试记录的所有班级名数组
			"13信管4": [...],
			"13信管2": [...],
			...
		},
		"c|试卷2": {},
		...
    }
*/
function sortDataGroupByNameAndClassAndOrderByUserid(data) {
	var newData = objKeySort(data);
	for(var name in newData) {
		newData[name] = objKeySort(newData[name]);
		for(var className in newData[name]) {
			newData[name][className].sort(function(a, b) {
				return parseInt(a.content.userId)-parseInt(b.content.userId);
			});
		}
	}
	return newData;
}

function dataProcess(data) {
	initData = data;
	allDataGroupByNameAndClassAndDate = {}, allDataGroupByNameAndClassAndOrderByUserid = {};

	for (var i = 0, len = data.length; i < len; i++) {
		var thisData = data[i],
		    testName = thisData.testName,
		    thisClass = thisData.class,
		    date = new Date(thisData.date),
		    dateString = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		if (!allDataGroupByNameAndClassAndDate[testName]) {
			allDataGroupByNameAndClassAndDate[testName] = {};
			allDataGroupByNameAndClassAndOrderByUserid[testName] = {};
		}
		if (!allDataGroupByNameAndClassAndDate[testName][thisClass]) {
			allDataGroupByNameAndClassAndDate[testName][thisClass] = {};
			allDataGroupByNameAndClassAndOrderByUserid[testName][thisClass] = [];
		}
		if (!allDataGroupByNameAndClassAndDate[testName][thisClass][dateString]) {
			allDataGroupByNameAndClassAndDate[testName][thisClass][dateString] = [];
		}

		allDataGroupByNameAndClassAndDate[testName][thisClass][dateString].push({
			index: i,
			content: thisData
		});
		allDataGroupByNameAndClassAndOrderByUserid[testName][thisClass].push({
			index: i,
			content: thisData
		});
	}

	// for (var _testName in allDataGroupByNameAndClassAndDate) {
	// 	for (var _date in allDataGroupByNameAndClassAndDate[_testName]) {
	// 		allDataGroupByNameAndDate[_testName][_date].sort(function (a, b) {
	// 			return parseInt(a.content.userId) - parseInt(b.content.userId);
	// 		});
	// 	}
	// }

	allDataGroupByNameAndClassAndOrderByUserid = sortDataGroupByNameAndClassAndOrderByUserid(allDataGroupByNameAndClassAndOrderByUserid);
}

/** 获取表格中某行的数据
 * @param rowTarget jq对象
*/
function getDataInOneClass($firstRowInClass) {
	var data = [], $firstRowAllTd = $firstRowInClass.find("td"),
		rowSpan = $firstRowAllTd[0].rowSpan,
		classValue = $firstRowInClass.find(".classValueContent").html();

	var $target = $firstRowInClass;
	for(var i=0; i<rowSpan; i++) {
		data[i] = [$target.find(".userId").html(), $target.find(".name").html(), classValue, $target.find(".totalScore").html()]
		$target = $target.next();
	}
	return data;
}

/** 通过下标获取obj对象的某些值
 * @param startIndex Number 开始下标
 * @param endIndex 结束下标
*/
function getDataByIndex(obj, startIndex, endIndex) {
	var keysArray = Object.keys(obj), result = {};
	for(var i=startIndex; i<=endIndex; i++) {
		var key = keysArray[i];
		if (!obj[key]) break;

		result[key] = obj[key];
	}
	return result;
}

function addRow(thisContent, testNameCount, rowSpan) {
	var realContent = thisContent.content,
	    scoresDetail = realContent.scoresDetail,
	    details = scoresDetail.details,
	    tbodyHtml = "",
	    contentHtml = "";
	contentHtml += "<tr class='testName" + testNameCount + "-content content' id='" + thisContent.index + "'>";

	if (rowSpan) {
		contentHtml += "<td class='classValue' rowspan=" + rowSpan + "><span class='classValueContent'>" + realContent.class + "</span><input type='button' class='export'><input type='button' class='remove'></td>";
	}

	contentHtml += "<td class='userId'>" + realContent.userId + "</td><td class='name'>" + realContent.name + "</td><td class='totalScore'>" + scoresDetail.totalScore + "</td><td><table><thead>";
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

function addTestHistoryInTable(addData) {
	var tbody = $(".showtestResultsInfo > table > tbody")[0],
	    testNameCount = 0,
	    allContentHtml = "";
	tbody.innerHTML = "";
	for (var testName in addData) {
		var contentHtml = "<tr class='testName' id='testName" + testNameCount + "'><td><input type='button' class='export'></td><td colspan=5>" + testName + "<span class='icon'>︽</span></td><td><input type='button' class='remove'></td></tr>",
		    thisContentObj = addData[testName];

		for (var className in thisContentObj) {
			var thisContentArray = thisContentObj[className];
			for (var _i = 0, _len = thisContentArray.length; _i < _len; _i++) {
				if (_i === 0) {
					contentHtml += addRow(thisContentArray[_i], testNameCount, _len);
				}
				else {
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
				changeTestHistoryInfoWhenAllTestHistoryInfoChange();
			}
		});
	};

	for (var i = 0, len = content.length; i < len; i++) {
		_loop(i, len);
	}
}

function removeOneClassNameAllRecord($removeTarget) {
	var $target = $removeTarget;

	for (var i = 0, len = $removeTarget.find("td")[0].rowSpan; i < len; i++) {
		removeOneRecord($target, function () {
			if (i === len - 1) {
				showTips("删除成功！", 1000);
				changeTestHistoryInfoWhenAllTestHistoryInfoChange();
			}
		});
		$target = $target.next();
	}
}

function removeOneRecord($removeTarget, callback) {
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
								changeTestHistoryInfoWhenAllTestHistoryInfoChange();
							}
						}
					});
				}
			});
		}
	});
}

// 根据当前页数显示特定的用户信息
function showTestHistoryInfoByPage() {
	var currentPage = $(".currentPage").val(), startIndex, endIndex;

	startIndex = (currentPage - 1) * 5;
	endIndex = startIndex + 4;
	addTestHistoryInTable(getDataByIndex(currentShowData, startIndex, endIndex));

	checkPreviousStatus();
	checkNextStatus();
}

// 当当前页数发生改变时，显示的用户信息跟着改变
function changeTestHistoryInfoWhenPageChange() {
	var currentPage = $(".currentPage").val(),
	    totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage <= 0) {
		$(".currentPage").val(1);
	}
	else if (currentPage > totalPage) {
		$(".currentPage").val(totalPage);
	}

	showTestHistoryInfoByPage();
}

// 当存储的用户信息发生改变时，显示的用户信息跟着改变
function changeTestHistoryInfoWhenAllTestHistoryInfoChange() {
	getAllTestHistory(function() {
		var $totalPage = $(".totalPage"), totalPageCount;
		totalPageCount = Math.ceil(Object.keys(currentShowData).length/5);
		$totalPage.html(totalPageCount);
		var currentPage = Number($(".currentPage").val());
		if (currentPage > totalPageCount) {
			$(".currentPage").val(totalPageCount);
		}
		showTestHistoryInfoByPage();
	});
}

// 检查向前翻页按钮状态
function checkPreviousStatus() {
	var currentPage = $(".currentPage").val();
	if (currentPage == 1) {
		$(".previous").addClass("disable");
	} else {
		if ($(".previous").hasClass("disable")) {
			$(".previous").removeClass("disable");
		}
	}
}

// 检查向后翻页按钮状态
function checkNextStatus() {
	var currentPage = $(".currentPage").val(),
	    totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage == totalPage) {
		$(".next").addClass("disable");
	} else {
		if ($(".next").hasClass("disable")) {
			$(".next").removeClass("disable");
		}
	}
}

function init() {
	getAllTestHistory(function() {
		$(".totalPage").html(Math.ceil(Object.keys(currentShowData).length/5));
		showTestHistoryInfoByPage();
	});

	var testName = decodeURIComponent(getValueInUrl("testName"));
	if (testName) {
		var count = 0;
		for (var name in allDataGroupByNameAndClassAndOrderByUserid) {
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
			currentShowData = allDataGroupByNameAndClassAndOrderByUserid;
			$(".totalPage").html(Math.ceil(Object.keys(currentShowData).length/5));
			showTestHistoryInfoByPage();
		} else {
			var RegExpObject = new RegExp((year ? year : "\\d+") + "\/" + (month ? month : "\\d+") + "\/" + (day ? day : "\\d+"));

			currentShowData = {};
			var outerFlag = false;
			for (var name in allDataGroupByNameAndClassAndDate) {
				var flag = false,
				    addDataByDate = {};
				for(var className in allDataGroupByNameAndClassAndDate[name]) {
					addDataByDate[className] = [];
					for (var date in allDataGroupByNameAndClassAndDate[name][className]) {
						if (RegExpObject.test(date)) {
							flag = true;
							var array = allDataGroupByNameAndClassAndDate[name][className][date];
							for(var i=0, len=array.length; i<len; i++) {
								addDataByDate[className].push(array[i]);
							}
						}
					}
				}
				if (flag) {
					outerFlag = true;
					currentShowData[name] = addDataByDate;
				}
			}
			if (outerFlag) {
				currentShowData = sortDataGroupByNameAndClassAndOrderByUserid(currentShowData);
				addTestHistoryInTable(currentShowData);
				$(".totalPage").html(1);
				$(".currentPage").val(1);
				checkPreviousStatus();
				checkNextStatus();
				// showTestHistoryInfoByPage();

				$(".content").css("display", "table-row");
				$(".icon").html("︾");
			} else {
				var tbody = $(".showtestResultsInfo > table > tbody")[0];
				tbody.innerHTML = "<tr><td colspan=7>暂无记录</td><tr>";
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
				var tdClassName = $target.parent()[0].className;
				if (tdClassName === "classValue") {
					removeFn = removeOneClassNameAllRecord;
				}
				else {
					removeFn = removeOneRecord;
				}
			}
			removeFn($tr);
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

			window.location.href = "../pratice?subjectName=" + testName[0] + "&index=" + (testName[1].substr(2) - 1) + "&modifyShortAnswerScore=true" + "&correctAnswerContent=" + JSON.stringify(correctAnswerContent) + "&studentAnswerContent=" + JSON.stringify(studentAnswerContent) + "&scoresObj=" + JSON.stringify(scoresObj) + "&testId=" + testId;
		} else if (classname === "icon") {
			testNameClick($target.parent().parent());
		} else if(classname === "export") {
			var $tr = $target.parent().parent(), exportData = [];
			if ($tr[0].className === "testName") {
				var allContent = $("." + $tr[0].id + "-content");
				for(var i=0, len1=allContent.length; i<len1; i++) {
					var thisContentFirstTd = $(allContent[i]).find("td")[0];
					if (thisContentFirstTd.className === "classValue") {
						var oneClassData = getDataInOneClass($(allContent[i]));
						for(var j=0, len2=oneClassData.length; j<len2; j++) {
							exportData.push(oneClassData[j]);
						}
					}
				}
			}
			else {
				var rowSpan = $tr.find("td")[0].rowSpan, $thisRow = $tr;
				exportData = getDataInOneClass($thisRow);
			}
			exportExcel(exportData);
		} else if ($target.parent()[0].className === "testName") {
			testNameClick($target.parent());
		}
	});

	$(".currentPage").focus(function () {
		$(".currentPage").select();
	});

	$(".currentPage").blur(function () {
		changeTestHistoryInfoWhenPageChange();
	});

	$(".currentPage").bind("keyup", function (e) {
		var theEvent = e || window.event;
		var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		if (event.keyCode === 13) {
			changeTestHistoryInfoWhenPageChange();
		}
	});

	$(".previous").click(function () {
		if ($(this).hasClass("disable")) {
			return;
		}
		var prevPage = $(".currentPage").val();
		$(".currentPage").val(prevPage - 1);
		showTestHistoryInfoByPage();
	});

	$(".next").click(function () {
		if ($(this).hasClass("disable")) {
			return;
		}
		var prevPage = Number($(".currentPage").val());
		$(".currentPage").val(prevPage + 1);
		showTestHistoryInfoByPage();
	});
}