var employee = require('../models/employee');
var globalemployee;
var visits;

exports.index = function (req, res) {
};

exports.kisslocal = function(req, res){
    res.render("kissme/kiss",{
        title:"静态随即"
    });
};

/**
 * 执行kissme操作
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.kiss = function (req, res) {
    var sessionid = req.sessionID;
    var em = new employee({
        id: req.body.id,
        name: req.body.name,
        images: req.body.images,
        line: req.body.line,
        slogan: req.body.slogan,
        times: req.body.times,
        kissed: req.body.kissed
    });
    em.kiss(sessionid, function (data) {
        console.log("kiss    =    " + data);
        if (data) {
            res.json({success: true, msg: data});
        }
    });
};

/**
 * 随机生成员工操作
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.random = function (req, res) {
    var sessionid = req.sessionID;
    if (globalemployee) {
        getRandomAll(sessionid, globalemployee, res);
    } else {
        // 初始化用户
        employee.init(function (employees) {
            globalemployee = employees.slice(0);
            getRandomAll(sessionid, employees, res);
        });
    }
};

/**
 * 渲染随机后的结果集
 * @param {type} sessionid 当前的session
 * @param {type} employees 当前所有的员工信息，是一个数组
 * @param {type} res resquest请求对象
 * @returns {undefined}
 */
var getRandomAll = function (sessionid, employees, res) {
    employee.randomAll(sessionid, employees, function (employeeIds) {
        var re = employee.fill(employees, employeeIds);
        res.render('kissme/random', {
            title: "随机出现",
            employees: re
        });
    });
};

/**
 * 获取客户端ip地址
 * @param {type} req
 * @returns {reqheaders.x-forwarded-for}
 */
var getClientIp = function (req) {
    return req.headers['x-forwarded-for']  // 反向代理
            || req.connection.remoteAddress  // 远程客户端
            || req.socket.remoteAddress   // 通过socket
            || req.connection.socket.remoteAddress;
};