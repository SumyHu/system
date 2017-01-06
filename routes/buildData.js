// 调用建立共同的数据库处理方法的库
const commentDataProcessing = require("./commentDataProcessing");

var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

let buildData = {};


// 建立用户信息数据库
var usersSchema = new Schema ({
	_id: String,   // 用户唯一标识（用户名，即手机号码）
	password: String,   // 用户密码
	identity: String,   // 用户身份
	imageSrc: String,   // 用户头像
	checkContent: [],   // 用户忘记密码验证内容
	errorExercise: []   // 用户存储的错题
});

var users = mongoose.model('users', usersSchema);

buildData.usersObj = commentDataProcessing(users);


// 建立题库数据库
var subjectsSchema = new Schema ({
	_id: String,   // 科目唯一标识，即科目名
	content: {}    // 科目所有题目与答案
});

var subjects = mongoose.model('subjects', subjectsSchema);

buildData.subjectsObj = commentDataProcessing(subjects);

module.exports = buildData;