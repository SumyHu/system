// 用md5对密码进行加密
const md = require("md5");

module.exports = function(model) {
	return {
		/** 查找数据库对象
		 * @param id String 唯一标识
		 * @param callback Function 回调函数
		*/
		find: function(id, callback) {
			model.find({_id: id}, function(err, data) {
				if (err) {
					throw Error('something error happened');
				}
				callback(data[0]);
			});
		},

		/** 查找数据库的全部对象
		 * @param callback Function 回调函数
		*/
		findAll: function(callback) {
			model.find(function(err, data) {
				if (err) {
					throw Error('something error happened');
				}
				callback(data);
			})
		},

		/** 新建数据库对象
		 * @param id String 唯一标识
		 * @data Object 新数据库对象的信息
		 * @param callback Function 回调函数
		*/
		save: function(data, callback) {
			if (data["password"]) {
				data["password"] = md(data["password"]);
			}
			var newObj = new model(data);
			//model.markModified('articles');
			newObj.save(function(err) {
				callback(err);
			});
		},

		/** 更新信息
		 * @param id String 唯一标识
		 * @param operation String 操作内容
		 * @param update Object 更新的部分内容
		 * update = {$set: {errorExercise: [{...}]}}
		 * @param callback Function 回调函数
		*/
		update: function(id, operation, update, callback) {
			if (update["password"]) {
				update["password"] = md(update["password"]);
			}
			let updateObj;
			switch(operation) {
				// 指定一个键的值,这个键不存在就创建它.可以是任何MondoDB支持的类型
				case "set":
					updateObj = {$set: update};
					break;

				// 向数组中添加一个元素,如果存在就不添加
				case "addToSet":
					updateObj = {$addToSet: update};
					break;

				// 给一个键push一个数组成员,键不存在会创建
				case "push":
					updateObj = {$push: update};
					break;

				// 向数组中尾部删除一个元素
				case "pop":
					updateObj = {$pop: update};
					break;

				// 向数组中删除指定元素
				case "pull":
					updateObj = {$pull: update};
					break;
			}
			model.update({_id:id}, updateObj, function(err, data) {
				if (err) {
					throw Error('something error happened');
				}
				callback(data);
			});
		},

		/** 注销指定用户
		 * @param id String 用户ID
		 * @param callback Function 回调函数
		*/
		remove: function(id, callback) {
			model.remove({_id: id}, function(err, data) {
				if (err) {
					throw Error('something error happened');
				}
				callback(data[0]);
			})
		}
	}
}