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
    console.log(setting.use_mongo);
    if (setting.use_mongo) {
        return doAddWithMongo(req, res);
    } else {
        return doAddWithRedis(req, res);
    }
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
    console.log(employee);
    var ep = EventProxy.create();

    ep.fail(function (err) {
        res.json({success: false, msg: err});
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
            console.log(data);
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
        res.json({success: false, msg: err});
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
