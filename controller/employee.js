var Employee4Mongo = require('../models/mongo').Employee;
var Employee4Redis = require('../models/employee');
var setting = require('../config/setting');
var EventProxy = require("eventproxy");
var globalemployee;

exports.index = function (req, res) {
};

exports.list = function (req, res) {
    res.render("employees/list", {
        title: "员工"
    });
};

exports.add = function (req, res) {
    res.render("employees/add", {
        title: "员工"
    });
};

exports.doAdd = function (req, res) {
    if (setting.use_mongo) {
        return doAddWithMongo(req, res);
    } else {
        return doAddWithRedis(req, res);
    }
};

exports.kisslocal = function (req, res) {
    res.render("kissme/kiss", {
        title: "静态随即"
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
    var em = new Employee4Redis({
        id: req.body.id,
        name: req.body.name,
        images: req.body.images,
        line: req.body.line,
        slogan: req.body.slogan,
        times: req.body.times,
        kissed: req.body.kissed
    });
    em.kiss(sessionid, function (data) {
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
        Employee4Redis.init(function (employees) {
            globalemployee = employees.slice(0);
            getRandomAll(sessionid, employees, res);
        });
    }
};

/**
 * 员工点赞统计
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.count = function (req, res) {
    Employee4Redis.count(function (err, data) {
        console.log(err);
        console.log(data);
        return res.json({success: true, msg: data});
    });
};

var doAddWithRedis = function (req, res) {
    var employee = new Employee4Redis({
        id: req.body.id,
        name: req.body.name,
        line: req.body.line,
        images: {
            happy: req.body.happyimg,
            sad: req.body.sadimg
        },
        slogan: req.body.slogan,
        times: 0,
        kissed: false
    });
    var ep = new EventProxy();

    ep.fail(function (err) {
        return res.json({success: false, msg: err});
    });

    if (!globalemployee) {
        ep.emitLater("init");
    } else {
        ep.emitLater("getOne", globalemployee);
    }

    ep.once("init", function () {
        Employee4Redis.init(function (employees) {
            globalemployee = employees.slice(0);
            ep.emitLater("getOne", employees);
        });
    });

    ep.once("getOne", function (employees) {
        Employee4Redis.getEmployeeById(employee.id, employees, function (data) {
            if (!data) {
                ep.emitLater("save", employees);
            } else {
                ep.emitLater("update", employees);
//                res.json({success: false, msg: "您添加的员工信息已经存在，请检查！"});
            }
        });
    });

    ep.once("save", function (employees) {
        Employee4Redis.add(employee, employees, function (err) {
            if (err) {
                console.log(err);
                res.json({success: false, msg: err});
            } else {
                res.json({success: true, msg: "添加信息成功！"});
            }
        });
    });

    ep.once("update", function (employees) {
        Employee4Redis.update(employee, employees, function (err, data) {
            if (err) {
                console.log(err);
                res.json({success: false, msg: err});
            } else {
                res.json({success: true, msg: "修改信息成功！"});
            }
        });
    });
};

var doAddWithMongo = function (req, res) {
    var employee = new Employee4Mongo({
        emid: req.body.id,
        name: req.body.name,
        line: req.body.line,
        images: {
            happy: req.body.happyimg,
            sad: req.body.sadimg
        },
        slogan: req.body.slogan
    });
    var ep = EventProxy.create();

    ep.fail(function (err) {
        return res.json({success: false, msg: err});
    });

    Employee4Mongo.getEmployeeById(employee.emid, function (err, mesaage) {
        if (!mesaage) {
            ep.emitLater("save", ep.done(mesaage));
        } else {
            res.json({success: false, msg: "您添加的员工信息已经存在，请检查！"});
        }
    });

    ep.once("save", function () {
        employee.save(function (err, data) {
            if (err) {
                console.log(err);
                res.json({success: false, msg: err});
            }
            res.json({success: true, msg: data});
        });
    });
};

/**
 * 渲染随机后的结果集
 * @param {type} sessionid 当前的session
 * @param {type} employees 当前所有的员工信息，是一个数组
 * @param {type} res resquest请求对象
 * @returns {undefined}
 */
var getRandomAll = function (sessionid, employees, res) {
    Employee4Redis.randomAll(sessionid, employees, function (employeeIds) {
        var re = Employee4Redis.fill(employees, employeeIds);
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