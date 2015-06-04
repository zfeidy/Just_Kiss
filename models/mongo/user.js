var mongoose = require('mongoose');
var dburl = require("../config/mongo").db;
// 连接数据库
exports.connect = function (callback) {
    mongoose.connect(dburl);
};
// 断开数据库
exports.disconnect = function (callback) {
    mongoose.disconnect(callback);
};

exports.setup = function (callback) {
    callback(null);
};

var UserSchema = new mongoose.Schema({
    id: {type: Number}, // 编号
    name: {type: String}, // 姓名
    password: {type: String} // 密码
});

var User = mongoose.model('user', UserSchema);
exports.User = User;

exports.getRandomUser = function (username, callback) {
    User.findOne({name: username}, function (err, doc) {
        if (err) {
            return callback(err, null);
        }
        return callback(err, doc);
    });
};