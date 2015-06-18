var setting = require('../config/setting');
var logger = require('../common/logger');
var Employee4Mongo = {};
if (setting.use_mongo) {
    Employee4Mongo = require('../models/mongo').Employee;
}
var Employee4Redis = require('../models/employee');
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
    var withline = req.body.withline;
    em.kiss(sessionid, withline, function (err, data) {
        if (err) {
            logger.error("异常", err);
            return res.json({success: false, msg: err});
        }
        res.json({success: true, msg: data});
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
 * 根据战线随机生成员工操作
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.randomWithLine = function (req, res) {
    var sessionid = req.sessionID;
    logger.debug("当前session", sessionid);
    var line = req.body.line ? req.body.line : 1;
    if (globalemployee) {
        getRandomAllWithLine(sessionid, line, globalemployee, res);
    } else {
        // 初始化用户
        Employee4Redis.init(function (employees) {
            globalemployee = employees.slice(0);
            getRandomAllWithLine(sessionid, line, employees, res);
        });
    }
};

exports.count = function (req, res) {
    res.render("employees/count", {
        title: "点赞统计"
    });
};

/**
 * 员工点赞统计
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.doCount = function (req, res) {
    Employee4Redis.count(function (err, data) {
        if (err) {
            logger.error("异常", err);
            return res.json({success: false, msg: err});
        }
        var jsonRes = [];
        for (var i = 0; i < data.length; i += 2) {
            jsonRes.push({
                id: data[i],
                num: data[i + 1]
            });
        }

        Employee4Redis.countTotal(function (err, data) {
            if (err) {
                logger.error("异常", err);
                return res.json({success: false, msg: err});
            }
            res.json({success: true, total: (data === null ? 0 : data), msg: jsonRes});
        });
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
        logger.error("异常", err);
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
                logger.error("异常", err);
                res.json({success: false, msg: err});
            } else {
                res.json({success: true, msg: "添加信息成功！"});
            }
        });
    });

    ep.once("update", function (employees) {
        Employee4Redis.update(employee, employees, function (err, data) {
            if (err) {
                logger.error("异常", err);
                return res.json({success: false, msg: err});
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
                logger.error("异常", err);
                return res.json({success: false, msg: err});
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
    Employee4Redis.randomAll(sessionid, employees, function (err, employeeIds) {
        if (err) {
            logger.error("异常", err);
            return res.json({success: false, msg: err});
        }
        var re = Employee4Redis.fill(employees, employeeIds);
        Employee4Redis.count(function (err, data) {
            if (err) {
                logger.error("异常", err);
                return res.json({success: false, msg: err});
            }
            var jsonRes = [];
            for (var i = 0; i < data.length; i += 2) {
                jsonRes.push({
                    id: data[i],
                    num: data[i + 1]
                });
            }

            for (var i in re) {
                for (var j in jsonRes) {
                    if (re[i].id == jsonRes[j].id) {
                        re[i].times = jsonRes[j].num;
                    }
                }
            }
            res.json({success: true, msg: re});

        });
    });
};

/**
 * 渲染随机后的结果集【根据战线随机】
 * @param {type} sessionid 当前的session
 * @param {type} employees 当前所有的员工信息，是一个数组
 * @param {type} res resquest请求对象
 * @returns {undefined}
 */
var getRandomAllWithLine = function (sessionid, line, employees, res) {
    Employee4Redis.randomAllWithLine(sessionid, line, employees, function (err, employeeIds) {
        if (err) {
            logger.error("异常", err);
            return res.json({success: false, msg: err});
        }
        Employee4Redis.count(function (err, data) {
            if (err) {
                logger.error("异常", err);
                return res.json({success: false, msg: err});
            }
            var jsonRes = [];
            for (var i = 0; i < data.length; i += 2) {
                jsonRes.push({
                    id: data[i],
                    num: data[i + 1]
                });
            }

            var re = Employee4Redis.fillWithLine(employees, line, employeeIds);
            for (var i in re) {
                for (var j in jsonRes) {
                    if (re[i].id == jsonRes[j].id) {
                        re[i].times = jsonRes[j].num;
                    }
                }
            }
            res.json({success: true, msg: re});
        });
    });
};