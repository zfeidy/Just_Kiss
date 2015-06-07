var Employee = require('../models/mongo').Employee;

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
    var employee = new Employee({
        emid: req.body.id,
        name: req.body.name,
        line: req.body.line,
        images: {
            happy: req.body.happyimg,
            sad: req.body.sadimg
        },
        slogan: req.body.slogan
    });
    employee.save(function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json({success: true, msg: data});
    });
};
