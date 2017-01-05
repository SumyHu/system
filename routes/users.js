// 用md5对密码进行加密
const md = require("md5");

var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

var usersSchema = new Schema ({
	_id: String,   // 用户唯一标识（用户名，即手机号码）
	password: String,   // 用户密码
	identity: String,   // 用户身份
	imageSrc: String,   // 用户头像
	checkContent: [],   // 用户忘记密码验证内容
	errorExercise: []   // 用户存储的错题
});

var users = mongoose.model('users', usersSchema);

/** 查找用户
 * @param userId String 用户ID
 * @param callback Function 回调函数
*/
users.findUser = function(userId, callback) {
	users.find({_id: userId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data[0]);
	});
};

/** 保存新用户信息
 * @param userId String 用户ID
 * @param password String 用户密码
 * @param checkContent Array 用户忘记密码的校验信息
 * checkContent = [{question: String, answer: String}, {...}, {...}]
 * @param callback Function 回调函数
*/
users.saveUser = function(userId, password, identity, checkContent, callback) {
	var newUser = new users({
		_id: userId,
		password: md(password),
		identity: identity,
		imageSrc: 'upload/default.jpg',
		checkContent: checkContent,
		errorExercise: []
	});
	//users.markModified('articles');
	newUser.save(function(err) {
		callback(err);
	});
};

/** 更新用户信息（用于保存用户修改信息）
 * @param userId String 用户ID
 * @param update Object 用户更新的部分内容
 * update = {$set: {errorExercise: [{...}]}}
 * @param callback Function 回调函数
*/
users.updateUser = function(userId, update, callback) {
	users.update({_id:userId}, update, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data);
	});
};

users.modifyUser = function(userId, update, callback) {
	let newUpdate = {};
	for(var k in update) {
		if (k == "password") {
			newUpdate[k] = md(update[k]);
		}
		else {
			newUpdate[k] = update[k];
		}
	}
	users.updateUser(userId, {$set: newUpdate}, callback);
}

/** 注销指定用户
 * @param userId String 用户ID
 * @param callback Function 回调函数
*/
users.removeUser = function(userId, callback) {
	users.remove({_id: userId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data[0]);
	})
};

module.exports = users;