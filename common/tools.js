var bcrypt = require('bcrypt');
var moment = require('moment');
// 使用中文
moment.locale('zh-cn');
// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};
// id只能包含数字字符下划线和横杠
exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};
// hash加密
exports.bhash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};
// 检查密码
exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};
