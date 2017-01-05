module.exports = function(model) {
	let returnName = {};
	/** 查找用户
	 * @param id String 用户ID
	 * @param callback Function 回调函数
	*/
	returnName.find = function(id, callback) {
		model.find({_id: id}, function(err, data) {
			if (err) {
				throw Error('something error happened');
			}
			callback(data[0]);
		});
	};

	/** 保存新用户信息
	 * @param id String 用户ID
	 * @param password String 用户密码
	 * @param checkContent Array 用户忘记密码的校验信息
	 * checkContent = [{question: String, answer: String}, {...}, {...}]
	 * @param callback Function 回调函数
	*/
	returnName.save = function(data, callback) {
		var newUser = new model(data);
		//model.markModified('articles');
		newUser.save(function(err) {
			callback(err);
		});
	};

	/** 更新用户信息（用于保存用户修改信息）
	 * @param id String 用户ID
	 * @param update Object 用户更新的部分内容
	 * update = {$set: {errorExercise: [{...}]}}
	 * @param callback Function 回调函数
	*/
	returnName.update = function(id, update, callback) {
		model.update({_id:id}, update, function(err, data) {
			if (err) {
				throw Error('something error happened');
			}
			callback(data);
		});
	};

	returnName.modify = function(id, update, callback) {
		let newUpdate = {};
		for(var k in update) {
			if (k == "password") {
				newUpdate[k] = md(update[k]);
			}
			else {
				newUpdate[k] = update[k];
			}
		}
		returnName.update(id, {$set: newUpdate}, callback);
	}

	/** 注销指定用户
	 * @param id String 用户ID
	 * @param callback Function 回调函数
	*/
	returnName.remove = function(id, callback) {
		model.remove({_id: id}, function(err, data) {
			if (err) {
				throw Error('something error happened');
			}
			callback(data[0]);
		})
	};

	return returnName;
}