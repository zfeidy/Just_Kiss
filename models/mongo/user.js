var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

var UserSchema = new mongoose.Schema({
    id: {type: ObjectId}, // 编号
    name: {type: String}, // 姓名
    password: {type: String} // 密码
});
UserSchema.index({name: 1}, {unique: true});
var User = mongoose.model('user', UserSchema);
exports.User = User;

// 根据name查询
User.getUserByName = function (name, callback) {
    User.findOne({name: name}, callback);
};

// 根据ID查询
User.getUserById = function (id, callback) {
    User.findOne({emid: id}, callback);
};
// 增加
User.prototype.addUser = function (callback) {
    this.save(callback);
};
// 更新
User.prototype.updateUser = function (callback) {
    this.update(callback);
};
// 删除
User.deleteUser = function (id, callback) {
    User.delete(id, callback);
};