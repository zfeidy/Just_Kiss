var moment = require('moment');
// 使用中文
moment.locale('zh-cn');
// 格式化时间
exports.formatDate = function (date, now) {
    date = moment(date);

    if (now) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm:ss');
    }

};
// id只能包含数字字符下划线和横杠
exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};