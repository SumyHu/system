"use strict";

var allUsersInfo = void 0; // 存储所有用户信息的数组

var tableKey = ["_id", "password", "identity"];

/** 导入Excel表
 * @fileName input[type=file]的value值
*/
// function ReadExcel(filePath) {  
//     var tempStr = "";  
//     //创建操作EXCEL应用程序的实例  
//     var oXL = new ActiveXObject("Excel.application");  
//     //打开指定路径的excel文件  
//     var oWB = oXL.Workbooks.open(filePath);  
//     //操作第一个sheet(从一开始，而非零)  
//     oWB.worksheets(1).select();  
//     var oSheet = oWB.ActiveSheet;  
//     //使用的行数  
// 	var rows =  oSheet.usedrange.rows.count;   
//     try {  
//         for (var i = 2; i <= rows; i++) {  
// 	        if (oSheet.Cells(i, 2).value == "null" || oSheet.Cells(i, 3).value == "null") break;  
// 	        var a = oSheet.Cells(i, 2).value.toString() == "undefined" ? "": oSheet.Cells(i, 2).value;  
// 	        tempStr += (" " + oSheet.Cells(i, 2).value + " " + oSheet.Cells(i, 3).value + " " + oSheet.Cells(i, 4).value + " " + oSheet.Cells(i, 5).value + " " + oSheet.Cells(i, 6).value + "\n");  
// 	    }  
// 	} catch(e) {  
// 	    // document.getElementById("txtArea").value = tempStr;  
// 	}  
//     console.log(tempStr);
// 	// document.getElementById("txtArea").value = tempStr;  
//     //退出操作excel的实例对象  
//     oXL.Application.Quit();  
//     //手动调用垃圾收集器  
//     CollectGarbage();  
// }

// function importXLS(fileName) {
// 	var objCon = new ActiveXObject("ADODB.Connection");
// 	objCon.Provider = "Microsoft.Jet.OLEDB.4.0";
// 	objCon.ConnectionString = "Data Source=" + fileName + ";Extended Properties=Excel 8.0;";
// 	objCon.CursorLocation = 1;
// 	objCon.Open;
// 	var strQuery;
// 	//Get the SheetName
// 	var strSheetName = "Sheet1$";
// 	var rsTemp = new ActiveXObject("ADODB.Recordset");
// 	rsTemp = objCon.OpenSchema(20);
// 	if (!rsTemp.EOF) {
// 		strSheetName = rsTemp.Fields("Table_Name").Value;
// 	}
// 	rsTemp = null;
// 	rsExcel = new ActiveXObject("ADODB.Recordset");
// 	strQuery = "SELECT * FROM [" + strSheetName + "]";
// 	rsExcel.ActiveConnection = objCon;
// 	rsExcel.Open(strQuery);
// 	while (!rsExcel.EOF) {
// 		for (i = 0; i < rsExcel.Fields.Count; ++i) {
// 			alert(rsExcel.Fields(i).value);
// 		}
// 		rsExcel.MoveNext;
// 	}
// 	// Close the connection and dispose the file
// 	objCon.Close;
// 	objCon = null;
// 	rsExcel = null;
// }

function importExcel(filename) {
	$.ajax({
		url: "../importExcel",
		type: "post",
		data: {
			excelFile: filename
		},
		success: function(result) {
			console.log(result);
		}
	});
}

/** 获取所有用户信息
 * @param callback Function 回调函数
*/
function getAllUsersInfo(callback) {
	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "findAll"
		},
		success: function success(result) {
			allUsersInfo = [];
			for (var _i = 0, len = result.length; _i < len; _i++) {
				if (result[_i].identity !== "manager") {
					allUsersInfo.push(result[_i]);
				}
			}
			$(".totalPage")[0].innerHTML = Math.ceil(result.length / 10);
			callback(result);
		}
	});
}

/** 删除指定用户
 * @param userId String 用户id
*/
function removeUser(userId, callback) {
	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "remove",
			removeOpt: {
				_id: userId
			}
		},
		success: function success(result) {
			showTips("删除成功", 1000);
			callback();
		}
	});
}

/** 在表格中添加一行用户信息
 * @param contentObj Object 每个用户具体信息的对象 
*/
function addRow(contentObj) {
	var tr = document.createElement("tr"),
	    innerHtml = "";
	for (var _i2 = 0, len = tableKey.length; _i2 < len; _i2++) {
		innerHtml += "<td>" + contentObj[tableKey[_i2]] + "</td>";
	}
	innerHtml += "<td>\n\t\t\t\t\t\t<input type=\"button\" class=\"modify\">\n\t\t\t\t\t\t<input type=\"button\" class=\"remove\">\n\t\t\t\t\t</td>";
	tr.innerHTML = innerHtml;
	$(".showUsersInfo > table > tbody").append(tr);

	$(tr).find(".modify").click(function (e) {
		console.log($(this).parent().parent().find("td")[0].innerHTML);
		var tr = $(this).parent().parent();
		var userId = tr.find("td")[0].innerHTML,
		    identity = tr.find("td")[2].innerHTML;
		createWinToModifyUserInfo(userId, identity);
	});

	$(tr).find(".remove").click(function (e) {
		var userId = $(this).parent().parent().find("td")[0].innerHTML;
		removeUser(userId, function () {
			getAllUsersInfo(showUserInfoByPage);
		});
	});
}

/** 显示特定的用户信息
 * @param startIndex Number 开始下标
 * @param endIndex Number 结束下标
*/
function showUsersInfo(startIndex, endIndex) {
	$(".showUsersInfo > table > tbody")[0].innerHTML = "";
	for (var _i3 = startIndex; _i3 <= endIndex; _i3++) {
		if (!allUsersInfo[_i3]) {
			return;
		}
		addRow(allUsersInfo[_i3]);
	}
}

// 根据当前页数显示特定的用户信息
function showUserInfoByPage() {
	var currentPage = $(".currentPage").val();
	var startIndex = (currentPage - 1) * 10;
	var endIndex = startIndex + 9;
	showUsersInfo(startIndex, endIndex);
}

// 当当前页数发生改变时，显示的用户信息跟着改变
function changeUserInfoWhenPageChange() {
	var currentPage = $(".currentPage").val(),
	    totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage <= 0 || currentPage > totalPage) {
		currentPage = 1;
		$(".currentPage").val(1);
	}
	showUserInfoByPage();
}

// 创建一个添加用户的窗口
function createWinToAddUser(callback) {
	var contentHtml = "<div class=\"title\">\u7528\u6237\u4FE1\u606F\u6DFB\u52A0</div>\n\t\t\t\t\t\t<div class=\"userIdInWin\">\u7528\u6237\u540D\uFF1A<br><input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"passwordInWin\">\u5BC6\u7801\uFF1A<br><input type=\"text\" class=\"textInput\"></div>\n\t\t\t\t\t\t<div class=\"identityInWin\">\u7528\u6237\u8EAB\u4EFD\uFF1A<br>\n\t\t\t\t\t\t\t<input type=\"radio\" value=\"teacher\" id=\"teacherRadio\" name=\"identityName\">\n\t\t\t\t\t\t\t<label for=\"teacherRadio\">teacher</label>\n\t\t\t\t\t\t\t<input type=\"radio\" value=\"student\" id=\"studentRadio\" name=\"identityName\" checked>\n\t\t\t\t\t\t\t<label for=\"studentRadio\">student</label>\n\t\t\t\t\t\t</div>";
	showWin(contentHtml, function () {
		if (!$(".userIdInWin .textInput").val() || !$(".passwordInWin .textInput").val()) {
			showTips("信息不完整，添加失败！", 1000);
			return;
		}

		var identity = $("#teacherRadio")[0].checked ? "teacher" : "student";

		callDataProcessingFn({
			data: {
				data: "users",
				callFunction: "save",
				saveData: {
					_id: $(".userIdInWin .textInput").val(),
					password: $(".passwordInWin .textInput").val(),
					identity: identity,
					imageSrc: "upload/default.jpg"
				}
			},
			success: function success(result) {
				if (result.err) {
					showTips("该用户已存在，添加失败！", 1000);
				} else {
					showTips("添加成功！", 1000);
					getAllUsersInfo(showUserInfoByPage);
				}
			}
		});
	}, function () {}, true);
}

/** 创建一个修改用户信息的窗口
 * @param userId String 用户id
 * @param identity String 用户身份
*/
function createWinToModifyUserInfo(userId, identity) {
	var contentHtml = "<div class=\"title\">\u7528\u6237\u4FE1\u606F\u4FEE\u6539</div>\n\t\t\t\t\t\t<div class=\"userIdInWin\">\n\t\t\t\t\t\t\t\u7528\u6237\u540D\uFF1A" + userId + "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"passwordInWin\">\u5BC6\u7801\uFF08md5\u52A0\u5BC6\u524D\uFF09\uFF1A<br>\n\t\t\t\t\t\t\t<input type=\"text\" class=\"textInput\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"identityInWin\">\u7528\u6237\u8EAB\u4EFD\uFF1A<br>\n\t\t\t\t\t\t\t<input type=\"radio\" value=\"teacher\" id=\"teacherRadio\" name=\"identityName\" " + (identity === "teacher" ? "checked" : "") + ">\n\t\t\t\t\t\t\t<label for=\"teacherRadio\">teacher</label>\n\t\t\t\t\t\t\t<input type=\"radio\" value=\"student\" id=\"studentRadio\" name=\"identityName\" " + (identity === "student" ? "checked" : "") + ">\n\t\t\t\t\t\t\t<label for=\"studentRadio\">student</label>\n\t\t\t\t\t\t</div>";
	showWin(contentHtml, function () {
		var updateObj = {
			identity: $("#teacherRadio")[0].checked ? "teacher" : "student"
		};

		if ($(".passwordInWin .textInput").val()) {
			updateObj.password = $(".passwordInWin .textInput").val();
		}

		callDataProcessingFn({
			data: {
				data: "users",
				callFunction: "update",
				updateOpt: {
					_id: userId
				},
				operation: "set",
				update: updateObj
			},
			success: function success() {
				showTips("修改成功！", 1000);
				getAllUsersInfo(showUserInfoByPage);
			}
		});
	}, function () {}, true);
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
	// getAllUsersInfo(function(result) {
	// 	showUsersInfo(0, 9);

	// 	checkPreviousStatus();
	// 	checkNextStatus();
	// });
}

function bindEvent() {
	$(".importExcelBtn").click(function () {
		var filename = $(".excelFile").val();
		if (!filename) {
			showTips("请选择导出文件！", 1000);
			return;
		}

		var fileType = filename.split(".");
		fileType = fileType[fileType.length - 1];
		if (fileType !== "xls" && fileType !== "xlsx") {
			showTips("请导出正确的Excel文件！", 1000);
			return;
		}

		$(".importExcel").click();
		// ReadExcel(filename);
	});

	$(".addBtn").click(function () {
		createWinToAddUser();
	});

	$(".currentPage").focus(function () {
		$(".currentPage").select();
	});

	$(".currentPage").blur(function () {
		changeUserInfoWhenPageChange();
	});

	$(".currentPage").bind("keyup", function (e) {
		var theEvent = e || window.event;
		var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		if (event.keyCode === 13) {
			changeUserInfoWhenPageChange();
		}
	});

	$(".previous").click(function () {
		if ($(this).hasClass("disable")) {
			return;
		}
		var prevPage = $(".currentPage").val();
		$(".currentPage").val(prevPage - 1);
		checkPreviousStatus();
		showUserInfoByPage();
	});

	$(".next").click(function () {
		if ($(this).hasClass("disable")) {
			return;
		}
		var prevPage = $(".currentPage").val();
		$(".currentPage").val(prevPage + 1);
		checkNextStatus();
		showUserInfoByPage();
	});
}