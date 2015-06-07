var mongoose = require('mongoose');
var config = require("../../config/mongo");
var dburl = config.uri;
var opts = config.opts;
// 连接数据库
(function () {
    mongoose.connect(dburl, opts, function (err) {
        if (err) {
            console.error('connect to %s error: ', dburl, err.message);
            process.exit(1);
        }
    });
})();
// 断开数据库
disconnect = function () {
    mongoose.disconnect(function (err) {
        if (err) {
            console.error('disconnect to %s error: ', dburl, err.message);
            process.exit(1);
        }
    });
};

exports.Employee = require('../mongo/employee');
exports.User = require('../mongo/user');