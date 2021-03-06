// 调用建立共同的二维表处理方法的库
const commentDataProcessing = require("./commentDataProcessing");

var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

let buildData = {};


// 建立用户信息表
var usersSchema = new Schema ({
	_id: String,   // 用户唯一标识（用户名，即手机号码）
	password: String,   // 用户密码
	identity: String,   // 用户身份
	imageSrc: String,   // 用户头像
	name: String,   // 用户姓名
	class: String,   // 用户所在的班级
	checkContent: [],   // 用户忘记密码验证内容
	errorExercise: [],   // 用户存储的错题
	testHistory: []   // 用户考试模拟的历史记录，存储的是testResults的id数组
});

var users = mongoose.model('users', usersSchema);

buildData.usersObj = commentDataProcessing(users);


// 建立以科目为单位的二维表
var subjectsSchema = new Schema ({
	subjectName: String,   // 科目唯一标识，即科目名
	chapterPratices: [],   // 章节练习内容
	examinationPratices: [],   // 考试模拟内容
	randomPratices: String,  // 随机练习内容
	updateTime: String   // 更新时间
});

var subjects = mongoose.model('subjects', subjectsSchema);

buildData.subjectsObj = commentDataProcessing(subjects);


// 建立以一个完整单元（如章节、试卷）为单位的二维表
var unitsSchema = new Schema ({
	SingleChoice: [],   // 单选题
	MultipleChoices: [],   // 多选题
	TrueOrFalse: [],   // 判断题
	FillInTheBlank: [],   // 填空题
	ShortAnswer: [],   // 简答题
	Programming: [],   // 编程题
	time: {},   // 时间
	effectiveTime: {}   // 试卷有效时间，若为空，则永久有效
});

var units = mongoose.model('units', unitsSchema);

buildData.unitsObj = commentDataProcessing(units);


// 建立以题目为单位的二维表
var praticesSchema = new Schema ({
	topic: String,   // 题目
	programmingTypeMode: String,   // 编程题代码类型
	choices: [],   // 所有选项
	answer: [],   // 答案
	score: Number   // 分值
});

var pratices = mongoose.model('pratices', praticesSchema);

buildData.praticesObj = commentDataProcessing(pratices);


// 建立存储用户考试模拟结果的二维表
var testResultsSchema = new Schema({
	userId: String,   // 用户id
	name: String,   // 用户姓名
	class: String,   // 用户所在班级
	testName: String,   // 测试试卷名称
	testUnitId: String,   // 试卷的unitId
	date: Date,   // 提交试卷的时间
	correctAnswerContent: {},   // 正确答案
	studentAnswerContent: {},   // 用户答案
	scoresObj: {},   // 各个习题的实际得分
	scoresDetail: {}   // 各个类型习题得分和总得分
});

var testResults = mongoose.model('testResults', testResultsSchema);

buildData.testResultsObj = commentDataProcessing(testResults);

module.exports = buildData;