"use strict";

var allUsersInfo = void 0,    // 存储所有用户信息的数组
	currentShowIdentity = "teacher",    // 存储当前用户身份
	teacherTableCurrentPage = 1,   // 切换为学生信息时，教师信息的当前页数
	studentTableCurrentPage = 1;   // 切换为教师信息时，学生信息的当前页数

var tableKey = ["_id", "name", "password"];

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
			allUsersInfo = {
				teacher: [],
				student: {
					class: [],
					info: {}
				}
			};
			for (var _i = 0, len = result.length; _i < len; _i++) {
				var thisUserIdentity = result[_i].identity;
				if (thisUserIdentity !== "manager") {
					if (thisUserIdentity === "teacher") {
						allUsersInfo.teacher.push(result[_i]);
					}
					else {
						var classValue = result[_i].class, studentObj = allUsersInfo.student;
						if (!studentObj.info[classValue]) {
							studentObj.class.push(classValue);
							studentObj.info[classValue] = [];
						}
						studentObj.info[classValue].push(result[_i]);
					}
				}
			}
			console.log(allUsersInfo);
			allUsersInfo.teacher.sort(function(a, b) {
				return parseInt(a._id)-parseInt(b._id);
			});

			allUsersInfo.student.class.sort(function(a, b) {
				console.log(a, b);
				return a>b;
			});

			var allStudentClass = allUsersInfo.student.class;
			for(let i=0, len=allStudentClass.length; i<len; i++) {
				allUsersInfo.student.info[allStudentClass[i]].sort(function(a, b) {
					return parseInt(a._id)-parseInt(b._id);
				});
			}

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

/** 在表格中添加一行班级分类标题
 * @param classValue String 班级名称
*/
function addClassTitle(classValue, idNum) {
	var tr = document.createElement("tr");
	tr.className = "className";
	tr.id = "className" + idNum;
    $(tr).html("<td colspan=3><span class='classValue'>" + classValue + "</span><span class='icon'>︽</span></td><td><input type='button' class='remove'></td>");
    $(".showUsersInfo > table > tbody").append(tr);

    $(tr).click(function(e) {
    	if (getTarget(e).className !== "remove") {
    		var $icon = $(this).find(".icon"), id = this.id;
    		if ($icon.html() === "︽") {
    			$icon.html("︾");
    			$("." + id + "-content").css("display", "table-row");
    		}
    		else {
    			$icon.html("︽");
    			$("." + id + "-content").css("display", "none");
    		}
    	}
    	else {
    		var allRemoveTarget = $("." + tr.id + "-content");
    		for(var i=0, len=allRemoveTarget.length; i<len; i++) {
    			var thisUserId = $(allRemoveTarget[i]).find("td")[0].innerHTML;
    			callDataProcessingFn({
    				data: {
    					data: "users",
    					callFunction: "remove",
    					removeOpt: {
    						_id: thisUserId
    					}
    				},
    				success: function() {
    					if (i === len-1) {
    						showTips("删除成功！", 1000);
    						changeUserInfoWhenAllUsersInfoChange();
    					}
    				}
    			});
    		}
    	}
    });
}

/** 在表格中添加一行用户信息
 * @param contentObj Object 每个用户具体信息的对象 
*/
function addRow(contentObj, idNum) {
	var tr = document.createElement("tr"),
	    innerHtml = "";
	for (var _i2 = 0, len = tableKey.length; _i2 < len; _i2++) {
		innerHtml += "<td>" + contentObj[tableKey[_i2]] + "</td>";
	}
	innerHtml += "<td><input type=\"button\" class=\"modify\"><input type=\"button\" class=\"remove\"></td>";
	tr.innerHTML = innerHtml;

	if (currentShowIdentity === "student") {
		tr.className = "className" + idNum + "-content content";
	}

	$(".showUsersInfo > table > tbody").append(tr);

	$(tr).find(".modify").click(function (e) {
		var tr = $(this).parent().parent();
		var userId = tr.find("td")[0].innerHTML,
		    name = tr.find("td")[1].innerHTML;

		if (currentShowIdentity === "student") {
			var classValue = $("#" + tr[0].className.split(" ")[0].split("-")[0]).find(".classValue").html();
			createWinToModifyUserInfo(userId, name, classValue);
		}
		else {
			createWinToModifyUserInfo(userId, name);
		}
	});

	$(tr).find(".remove").click(function (e) {
		var userId = $(this).parent().parent().find("td")[0].innerHTML;
		removeUser(userId, function () {
			changeUserInfoWhenAllUsersInfoChange();
		});
	});
}

/** 显示教师信息
 * @param startIndex Number 教师信息数组开始下标
 * @param endIndex Number 教师信息数组结束下标
*/
function showTeacherInfo(startIndex, endIndex) {
	var usersInfoArr = allUsersInfo.teacher;
	$(".showUsersInfo > table > tbody")[0].innerHTML = "";
	for (var _i3 = startIndex; _i3 <= endIndex; _i3++) {
		if (!usersInfoArr[_i3]) {
			return;
		}
		addRow(usersInfoArr[_i3]);
	}
}

/** 显示教师信息
 * @param startIndex Number 班级数组开始下标
 * @param endIndex Number 班级数组结束下标
*/
function showStudentInfo(startIndex, endIndex) {
	$(".showUsersInfo > table > tbody")[0].innerHTML = "";

	var studentObj = allUsersInfo.student, allClassValue = studentObj.class, 
			allStudentInfo = studentObj.info;
	for(let i=startIndex; i<=endIndex; i++) {
		var thisClassValue = allClassValue[i],
			studentInfoArr = allStudentInfo[thisClassValue];
		if (!thisClassValue) {
			return;
		}
		addClassTitle(thisClassValue, i);
		for(let j=0, len=studentInfoArr.length; j<len; j++) {
			addRow(studentInfoArr[j], i);
		}
	}
}

// 根据当前页数显示特定的用户信息
function showUserInfoByPage() {
	var currentPage = $(".currentPage").val(), startIndex, endIndex;

	if (currentShowIdentity === "teacher") {
		startIndex = (currentPage - 1) * 10;
		endIndex = startIndex + 9;
		showTeacherInfo(startIndex, endIndex);
	}
	else {		
		startIndex = (currentPage - 1) * 4;
		endIndex = startIndex + 3;
		showStudentInfo(startIndex, endIndex);
	}

	checkPreviousStatus();
	checkNextStatus();
}

// 当当前页数发生改变时，显示的用户信息跟着改变
function changeUserInfoWhenPageChange() {
	var currentPage = $(".currentPage").val(),
	    totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage <= 0) {
		$(".currentPage").val(1);
	}
	else if (currentPage > totalPage) {
		$(".currentPage").val(totalPage);
	}

	showUserInfoByPage();
}

// 当存储的用户信息发生改变时，显示的用户信息跟着改变
function changeUserInfoWhenAllUsersInfoChange() {
	getAllUsersInfo(function() {
		var $totalPage = $(".totalPage"), totalPageCount;
		if (currentShowIdentity === "teacher") {
			totalPageCount = Math.ceil(allUsersInfo.teacher.length/10);
		}
		else {
			totalPageCount = Math.ceil(allUsersInfo.student.class.length/4);
		}
		$totalPage.html(totalPageCount);
		var currentPage = Number($(".currentPage").val());
		if (currentPage > totalPageCount) {
			$(".currentPage").val(totalPageCount);
		}
		showUserInfoByPage();
	});
}

// 创建一个添加用户的窗口
function createWinToAddUser(callback) {
	var contentHtml = "<div class=\"title\">用户信息添加</div><div class=\"userIdInWin\">用户ID：<br><input type=\"text\" class=\"textInput\"></div><div class=\"nameInWin\">姓名：<br><input type=\"text\" class=\"textInput\"></div><div class=\"passwordInWin\">密码（md5加密前）：<br><input type=\"text\" class=\"textInput\"></div>";

	if (currentShowIdentity === "student") {
		contentHtml += "<div class=\"classInWin\">班级：<br><input type=\"text\" class=\"textInput\"></div>"
	}

	showWin(contentHtml, function () {
		if (!$(".userIdInWin .textInput").val() || !$(".passwordInWin .textInput").val()) {
			showTips("信息不完整，添加失败！", 1000);
			return;
		}

		var saveData = {
				_id: $(".userIdInWin .textInput").val(),
				name: $(".nameInWin .textInput").val(),
				password: $(".passwordInWin .textInput").val(),
				identity: currentShowIdentity,
				imageSrc: "upload/default.jpg"
			};

		if (currentShowIdentity === "student") {
			saveData.class = $(".classInWin .textInput").val();
		}

		callDataProcessingFn({
			data: {
				data: "users",
				callFunction: "save",
				saveData: saveData
			},
			success: function success(result) {
				if (result.err) {
					showTips("该用户已存在，添加失败！", 1000);
				} else {
					showTips("添加成功！", 1000);

					changeUserInfoWhenAllUsersInfoChange();
				}
			}
		});
	}, function () {}, true);
}

/** 创建一个修改用户信息的窗口
 * @param userId String 用户id
 * @param identity String 用户身份
*/
function createWinToModifyUserInfo(userId, name, classValue) {
	var contentHtml = "<div class=\"title\">用户信息修改</div><div class=\"userIdInWin\">用户ID：" + userId + "</div><div class=\"nameInWin\">姓名：<br><input type=\"text\" class=\"textInput\" value=\"" + name + "\"></div><div class=\"passwordInWin\">密码（md5加密前）：<br><input type=\"text\" class=\"textInput\"></div>";

	if (currentShowIdentity === "student") {
		contentHtml += "</div><div class=\"classInWin\">班级：<br><input type=\"text\" class=\"textInput\" value=\"" + classValue + "\"></div>";
	}

	showWin(contentHtml, function () {
		var updateObj = {}, updateFlag = false, 
		newName = $(".nameInWin .textInput").val(),
		newPassword = $(".passwordInWin .textInput").val(),
		newClassValue = $(".classInWin .textInput").val();

		if (newName && newName !== name) {
			updateFlag = true;
			updateObj.name = newName;
		}

		if (newPassword) {
			updateFlag = true;
			updateObj.password = newPassword;
		}

		if (classValue) {
			if (newClassValue && newClassValue !== classValue) {
				updateFlag = true;
				updateObj.class = newClassValue;
			}
		}

		if (updateFlag) {
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
					if (currentShowIdentity === "teacher") {
						getAllUsersInfo(showUserInfoByPage);
					}
					else {
						changeUserInfoWhenAllUsersInfoChange();
					}
				}
			});
		}
	}, function () {}, true);
}

// 检查向前翻页按钮状态
function checkPreviousStatus() {
	var currentPage = $(".currentPage").val();
	console.log(currentPage);
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
	getAllUsersInfo(function() {
		$(".totalPage").html(Math.ceil(allUsersInfo.teacher.length/10));
		showUserInfoByPage();
	});
}

function bindEvent() {
	$(".usersType > ul > li").click(function(e) {
		var classname = this.className;
		if (classname === currentShowIdentity) {
			return;
		}

		var $allLi = $(".usersType > ul >li");
		$allLi.css("color", "#8c8c8c");
		$allLi.css("background", "rgba(255, 255, 255, 0.3)");

		$(this).css("color", "#000");
		$(this).css("background", "#fff");

		if (currentShowIdentity === "teacher") {
			teacherTableCurrentPage = Number($(".currentPage").val());
			$(".currentPage").val(studentTableCurrentPage);
			$(".totalPage").html(Math.ceil(allUsersInfo.student.class.length/4));
		}
		else {
			studentTableCurrentPage = Number($(".currentPage").val());
			$(".currentPage").val(teacherTableCurrentPage);
			$(".totalPage").html(Math.ceil(allUsersInfo.teacher.length/10));
		}

		$(".userIdentity").val(classname);
		currentShowIdentity = classname;

		showUserInfoByPage();
	});

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
		showUserInfoByPage();
	});

	$(".next").click(function () {
		if ($(this).hasClass("disable")) {
			return;
		}
		var prevPage = Number($(".currentPage").val());
		$(".currentPage").val(prevPage + 1);
		showUserInfoByPage();
	});
}