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


// 建立以科目为单位的数据库
var subjectsSchema = new Schema ({
	subjectName: String,   // 科目唯一标识，即科目名
	chapterPratices: [],   // 章节练习内容
	examinationPratices: [],   // 考试模拟内容
	randomPratices: String,  // 随机练习内容
	updateTime: String   // 更新时间
});

var subjects = mongoose.model('subjects', subjectsSchema);

buildData.subjectsObj = commentDataProcessing(subjects);


// 建立以一个完整单元（如章节、试卷）为单位的数据库
var unitsSchema = new Schema ({
	SingleChoice: [],
	MultipleChoices: [],
	TrueOrFalse: [],
	FillInTheBlank: [],
	ShortAnswer: [],
	Programming: []
});

var units = mongoose.model('units', unitsSchema);

buildData.unitsObj = commentDataProcessing(units);


// 建立以题目为单位的数据库
var praticesSchema = new Schema ({
	topic: String,   // 题目
	programmingTypeMode: String,   // 编程题代码类型
	choices: [],   // 所有选项
	answer: [],   // 答案
	score: Number   // 分值
});

var pratices = mongoose.model('pratices', praticesSchema);

buildData.praticesObj = commentDataProcessing(pratices);

module.exports = buildData;