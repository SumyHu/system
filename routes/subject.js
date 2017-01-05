var mongoose = require('./mongodb');

var Schema = mongoose.Schema;

var subjectsSchema = new Schema ({
	_id: String,   // 科目唯一标识，即科目名
	content: {}    // 科目所有题目与答案
});

var subjects = mongoose.model('subjects', subjectsSchema);

/** 查找用户
 * @param subjectId String 用户ID
 * @param callback Function 回调函数
*/
subjects.findSubject = function(subjectId, callback) {
	subjects.find({_id: subjectId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data[0]);
	});
};

/** 保存新用户信息
 * @param subjectId String 用户ID
 * @param password String 用户密码
 * @param checkContent Array 用户忘记密码的校验信息
 * checkContent = [{question: String, answer: String}, {...}, {...}]
 * @param callback Function 回调函数
*/
subjects.saveSubject = function(subjectId, callback) {
	var newSubject = new subjects({
		_id: subjectId,
		content: {}
	});
	//subjects.markModified('articles');
	newSubject.save(function(err) {
		callback(err);
	});
};

/** 更新用户信息（用于保存用户修改信息）
 * @param subjectId String 用户ID
 * @param update Object 用户更新的部分内容
 * update = {$set: {errorExercise: [{...}]}}
 * @param callback Function 回调函数
*/
subjects.updateSubject = function(subjectId, update, callback) {
	subjects.update({_id:subjectId}, update, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data);
	});
};

subjects.modifySubject = function(subjectId, update, callback) {
	let newUpdate = {};
	for(var k in update) {
		if (k == "password") {
			newUpdate[k] = md(update[k]);
		}
		else {
			newUpdate[k] = update[k];
		}
	}
	subjects.updateSubject(subjectId, {$set: newUpdate}, callback);
}

/** 注销指定用户
 * @param subjectId String 用户ID
 * @param callback Function 回调函数
*/
subjects.removeSubject = function(subjectId, callback) {
	subject.remove({_id: subjectId}, function(err, data) {
		if (err) {
			throw Error('something error happened');
		}
		callback(data[0]);
	})
};

module.exports = subject;