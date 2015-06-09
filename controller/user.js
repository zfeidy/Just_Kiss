var utility = require('utility');
var config = require('../config/setting');
var User = require('../models/user');

exports.index = function (req, res) {
    res.render('index', {title: '亲吻我吧'});
};

exports.login = function (req, res) {
    res.render('login', {title: '用户登陆'});
};

exports.chat = function (req, res) {

};

exports.doLogin = function (req, res) {
    var user = new User({
        name: config.admin,
        password: config.password
    });
    if (utility.md5(req.body.username) === user.name &&
            utility.md5(req.body.password) === user.password) {
        req.session.user = user;
        return res.redirect('/employee/list');
    } else {
        req.session.error = '用户名或密码不正确';
        return res.redirect('/login');
    }
};

exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/');
};

exports.home = function (req, res) {
    if (req.session.user)
        res.render('home', {title: '主页'});
    else
        return res.redirect('/login');
};
