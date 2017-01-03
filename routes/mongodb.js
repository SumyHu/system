/**
 * mongoose具体操作参照：http://blog.csdn.net/u014267351/article/details/51212107
*/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodejs');
module.exports = mongoose;