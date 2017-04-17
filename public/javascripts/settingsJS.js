let userId, identity, imageSrc;

$.imageFileVisible = function(options) {     

	// 默认选项

	var defaults = {    

		//包裹图片的元素

		wrapSelector: null,    

		//<input type=file />元素

		fileSelector:  null ,

		errorMessage: "不是图片，请重新选择！"

	};    

	// Extend our default options with those provided.    

	var opts = $.extend(defaults, options);

	$(opts.fileSelector).on("change",function(e){
		var file = this.files[0];

		if (!this.files[0]) {
			return;
		}

		var imageType = /image.*/;

		if (file.type.match(imageType)) {

				var reader = new FileReader();

				reader.onload = function(){
					imageSrc = reader.result;

					$(opts.wrapSelector).css("background", "url('" + imageSrc + "') no-repeat");
					$(opts.wrapSelector).css("background-size", "100%");
				}

				reader.readAsDataURL(file);

		}else{
			alert(opts.errorMessage);

		}

	});
}

function changePassword() {
	let oldPassword = $(".oldPassword").val();
	let newPassword = $(".newPassword").val();
	let newPasswordConfirm = $(".newPasswordConfirm").val();

	if (!oldPassword) {
		showTips("请输入原密码！", 1000);
		return;
	}

	if (!newPassword) {
		showTips("请输入新密码！", 1000);
		return;
	}

	if (newPassword !== newPasswordConfirm) {
		showTips("新密码不一致，请重新输入！", 1000);
		return;
	}

	$.ajax({
		url: "../login",
		type: "POST",
		data: {
			userId: userId,
			identity: identity,
			password: oldPassword
		},
		success: function(result) {
			if (result.success) {
				callDataProcessingFn({
					data: {
						data: "users",
						callFunction: "update",
						updateOpt: {
							_id: userId
						},
						operation: "set",
						update: {
							password: newPassword
						}
					},
					success: function() {
						window.location.href = "../login?exit=true";
					}
				});
			}
			else {
				showTips("密码不正确！", 1000);
			}
		}
	});
}

function changeFindPassword() {
	let textInput = $(".secondStep .textInput");
	for(let i=0, len=textInput.length; i<len; i++) {
		if (!textInput[i].value) {
			showTips("请将信息填写完整！", 1000);
			return;
		}
	}

	let checkContent = [];
	for(let i=1, len=textInput.length; i<=len; i++) {
		let question = $(".select" + i).find("option:selected").text();
		let answer = textInput[i-1].value;
		checkContent.push({
			question: question,
			answer: answer
		});
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
				checkContent: checkContent
			}
		},
		success: function(result) {
			showTips("修改成功！", 1000);
		}
	});
}

function showSettingsContent(changeContentName) {
	$(".navContent > div").css("background-color", "transparent");
	$(".navContent .change" + changeContentName.substr(0, 1).toUpperCase() + changeContentName.substr(1))[0].style.backgroundColor = "#f5f6eb"

	$(".content > section").css("display", "none");
	$(".content > ." + changeContentName + "Info").css("display", "block");
}

function init() {
	userId = $(".showUsername")[0].id;
	identity = $(".identity")[0].id;

	// 显示用户头像
	$(".showUserImg").css("background-image", $(".userImg").css("background-image"));

	// 显示用户名
	$(".username")[0].innerHTML = $(".showUsername")[0].id;
}

function bindEvent() {
	$.imageFileVisible({
		wrapSelector: ".userImgInfo > .showUserImg", 
		fileSelector: ".uploadImage",
	});

	$(".navContent").click(function(e) {
		let blockClassName = getTarget(e).className;

		showSettingsContent(blockClassName.substr(6, 1).toLowerCase() + blockClassName.substr(7));
	});

	$(".content .modify").click(function(e) {
		let className = $(getTarget(e)).parent()[0].className;

		showSettingsContent(className.substr(0, className.length-5));
	});

	$(".confirm").click(function(e) {
		let className = $(getTarget(e)).parent()[0].className;
		console.log($(this).parent()[0]);
		switch(className) {
			case "userImgInfo":
				changeUserImg();
				break;
			case "passwordInfo":
				changePassword();
				break;
			default: 
				changeFindPassword()
				break;
		}
	});

	$(".nextBtn").click(function() {
		let password = $(".passwordConfirm").val();
		if (!password) {
			showTips("请输入密码！", 1000);
			return;
		}

		$.ajax({
			url: "../login",
			type: "POST",
			data: {
				userId: userId,
				identity: identity,
				password: password
			},
			success: function(result) {
				if (result.success) {
					$(".firstStep").css("display", "none");
					$(".secondStep").css("display", "block");
				}
				else {
					showTips("密码错误！", 1000);
				}
			}
		});
	});

	$(".exitBtn").click(function() {
		window.location.href = "../login?exit=true";
	});
}