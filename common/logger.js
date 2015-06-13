var fs = require('fs');
var config = require('../config/setting');
var tools = require('../common/tools');

if (!fs.existsSync(config.log_path)) {
    fs.mkdirSync(config.log_path);
}

exports.log = function () {
    writeLog('info', arguments);
};
exports.info = function () {
    writeLog('info', arguments);
};
exports.debug = function () {
    writeLog('debug', arguments);
};
exports.warn = function () {
    writeLog('warn', arguments);
};
exports.error = function () {
    writeLog('error', arguments);
};

var env = process.env.NODE_ENV || "development";
var consolePrint = config.debug && env !== 'test';

var writeLog = function (level, args) {
    var filePrint = level !== 'debug';
    var infos = Array.prototype.slice.call(args);
    var logStr = infos.join(" ");
    var levelStr = level == 'error' ? "错误" : (level == 'warn' ? "警告" : (level == 'debug' ? "调试" : "一般"));
    var line = packup(tools.formatDate(new Date())) + packup(levelStr) + packup(logStr);

    if (consolePrint) {
        console.log(line);
    }
    if (filePrint) {
        fs.appendFile(config.log_path + "/kiss.log", line + "\n", function (err) {
            console.log(err);
        });
    }
};

var packup = function (msg) {
    return "[" + msg + "]";
};
