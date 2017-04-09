let allUsersInfo;   // 存储所有用户信息的数组

let tableKey = ["_id", "password", "identity"];

/** 获取所有用户信息
 * @param callback Function 回调函数
*/
function getAllUsersInfo(callback) {
	callDataProcessingFn({
		data: {
			data: "users",
			callFunction: "findAll"
		},
		success: function(result) {
			allUsersInfo = [];
			for(let i=0, len=result.length; i<len; i++) {
				if (result[i].identity !== "manager") {
					allUsersInfo.push(result[i]);
				}
			}
			$(".totalPage")[0].innerHTML = Math.ceil(result.length/10);
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
		success: function(result) {
			showTips("删除成功", 1000);
			callback();
		}
	});
}

/** 在表格中添加一行用户信息
 * @param contentObj Object 每个用户具体信息的对象 
*/
function addRow(contentObj) {
	let tr = document.createElement("tr"), innerHtml = "";
	for(let i=0, len=tableKey.length; i<len; i++) {
		innerHtml += "<td>" + contentObj[tableKey[i]] + "</td>";
	}
	innerHtml += `<td>
						<input type="button" class="modify">
						<input type="button" class="remove">
					</td>`;
	tr.innerHTML = innerHtml;
	$(".showUsersInfo > table > tbody").append(tr);

	$(tr).find(".modify").click(function(e) {
		console.log($(this).parent().parent().find("td")[0].innerHTML);
		let tr = $(this).parent().parent();
		let userId = tr.find("td")[0].innerHTML, identity = tr.find("td")[2].innerHTML;
		createWinToModifyUserInfo(userId, identity);
	});

	$(tr).find(".remove").click(function(e) {
		let userId = $(this).parent().parent().find("td")[0].innerHTML;
		removeUser(userId, function() {
			getAllUsersInfo(showUserInfoByPage);
		});
	});

	$(tr).hover(function() {
		$(tr).css("background", "#fff");
	}, function() {
		$(tr).css("background", "transparent");
	});
}

/** 显示特定的用户信息
 * @param startIndex Number 开始下标
 * @param endIndex Number 结束下标
*/
function showUsersInfo(startIndex, endIndex) {
	$(".showUsersInfo > table > tbody")[0].innerHTML = "";
	for(let i=startIndex; i<=endIndex; i++) {
		if (!allUsersInfo[i]) {
			return;
		}
		addRow(allUsersInfo[i]);
	}
}

// 根据当前页数显示特定的用户信息
function showUserInfoByPage() {
	let currentPage = $(".currentPage").val();
	let startIndex = (currentPage-1)*10;
	let endIndex = startIndex + 9;
	showUsersInfo(startIndex, endIndex);
}

// 当当前页数发生改变时，显示的用户信息跟着改变
function changeUserInfoWhenPageChange() {
	let currentPage = $(".currentPage").val(), totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage<=0 || currentPage > totalPage) {
		currentPage = 1;
		$(".currentPage").val(1);
	}
	showUserInfoByPage();
}

// 创建一个添加用户的窗口
function createWinToAddUser(callback) {
	let contentHtml = `<div class="title">用户信息添加</div>
						<div class="userIdInWin">用户名：<br><input type="text" class="textInput"></div>
						<div class="passwordInWin">密码：<br><input type="text" class="textInput"></div>
						<div class="identityInWin">用户身份：<br>
							<input type="radio" value="teacher" id="teacherRadio" name="identityName">
							<label for="teacherRadio">teacher</label>
							<input type="radio" value="student" id="studentRadio" name="identityName" checked>
							<label for="studentRadio">student</label>
						</div>`;
	showWin(contentHtml, function() {
		if (!$(".userIdInWin .textInput").val() || !$(".passwordInWin .textInput").val()) {
			showTips("信息不完整，添加失败！", 1000);
			return;
		}

		let identity = ($("#teacherRadio")[0].checked ? "teacher" : "student");

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
			success: function() {
				showTips("添加成功！", 1000);
				getAllUsersInfo(showUserInfoByPage);
			}
		});
	}, function() {}, true);
}

/** 创建一个修改用户信息的窗口
 * @param userId String 用户id
 * @param identity String 用户身份
*/
function createWinToModifyUserInfo(userId, identity) {
	let contentHtml = `<div class="title">用户信息修改</div>
						<div class="userIdInWin">
							用户名：` + userId + `
						</div>
						<div class="passwordInWin">密码（md5加密前）：<br>
							<input type="text" class="textInput">
						</div>
						<div class="identityInWin">用户身份：<br>
							<input type="radio" value="teacher" id="teacherRadio" name="identityName" ` + (identity === "teacher" ? "checked" : "") + `>
							<label for="teacherRadio">teacher</label>
							<input type="radio" value="student" id="studentRadio" name="identityName" ` + (identity === "student" ? "checked" : "") + `>
							<label for="studentRadio">student</label>
						</div>`;
	showWin(contentHtml, function() {
		let updateObj = {
			identity: ($("#teacherRadio")[0].checked ? "teacher" : "student")
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
			success: function() {
				showTips("修改成功！", 1000);
				getAllUsersInfo(showUserInfoByPage);
			}
		});
	}, function() {}, true);
}

// 检查向前翻页按钮状态
function checkPreviousStatus() {
	let currentPage = $(".currentPage").val();
	if (currentPage == 1) {
		$(".previous").addClass("disable");
	}
	else {
		if ($(".previous").hasClass("disable")) {
			$(".previous").removeClass("disable");
		}
	}
}

// 检查向后翻页按钮状态
function checkNextStatus() {
	let currentPage = $(".currentPage").val(), totalPage = $(".totalPage")[0].innerHTML;
	if (currentPage == totalPage) {
		$(".next").addClass("disable");
	}
	else {
		if ($(".next").hasClass("disable")) {
			$(".next").removeClass("disable");
		}
	}
}

function init() {
	getAllUsersInfo(function(result) {
		showUsersInfo(0, 9);

		checkPreviousStatus();
		checkNextStatus();
	});
}

function bindEvent() {
	$(".addBtn").click(function() {
		createWinToAddUser();
	});

	$(".currentPage").focus(function() {
		$(".currentPage").select();
	});

	$(".currentPage").blur(function() {
		changeUserInfoWhenPageChange();
	});

	$(".currentPage").bind("keyup", function(e) {
		var theEvent = e || window.event;    
		var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		if (event.keyCode === 13) {
			changeUserInfoWhenPageChange();
		}
	});

	$(".previous").click(function() {
		if ($(this).hasClass("disable")) {
			return;
		}
		let prevPage = $(".currentPage").val();
		$(".currentPage").val(prevPage-1);
		checkPreviousStatus();
		showUserInfoByPage();
	});

	$(".next").click(function() {
		if ($(this).hasClass("disable")) {
			return;
		}
		let prevPage = $(".currentPage").val();
		$(".currentPage").val(prevPage+1);
		checkNextStatus();
		showUserInfoByPage();
	});
}