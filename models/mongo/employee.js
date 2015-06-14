var mongoose = require('mongoose');
var logger = require('../../common/logger');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;
// 声明Schema
var EmployeeSchema = new Schema({
    id: ObjectId,
    emid: Mixed,
    name: String,
    line: String,
    images: {
        happy: String,
        sad: String
    },
    slogan: String, // 口号
    times: {type: Number, default: 0}  // 被赞次数
});
// 添加索引
EmployeeSchema.index({emid: 1}, {unique: true});
//EmployeeSchema.index({name: 1}, {unique: true});
// 获取Model
var Employee = mongoose.model('Employee', EmployeeSchema);
// 导出Model
module.exports = Employee;

// 根据ID查询
Employee.getEmployeeById = function (id, callback) {
    Employee.findOne({emid: id}, function (err, message) {
        if (err) {
            return callback(err);
            logger.error("根据用户ID查询用户异常：", err);
        }
        callback(null, message);
    });
};