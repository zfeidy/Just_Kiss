var fs = require('fs');
var config = require('../config/setting');
var tools = require('../common/tools');
var logname = "/kiss.log";

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

    var levelStr = level == 'error' ? "错误" : (level == 'warn' ? "警告" : (level == 'debug' ? "调试" : "一般"));
    var line = packup(tools.formatDate(new Date()));
    line += packup(levelStr);
    line += packup(assemble(args));

    if (consolePrint) {
        console.log(line);
    }
    if (filePrint) {
        fs.appendFile(config.log_path + logname, line + "\n", function (err) {
            if (err)
                console.log("写日志失败：" + err.message);
        });
    }
};
// 按参数个数封装传递过来的日志消息
var assemble = function (args) {
    var i = 1, msg = "";
    if (args.length > 0) {
        msg = args[0];
    }
    while (i < args.length) {
        msg += ":" + JSON.stringify(args[i]);
        i++;
    }
    return msg;
};

var packup = function (msg) {
    return "[" + msg + "]";
};
