var eventproxy = require('eventproxy');
var User = require('../models/user');

// 验证用户是否登录
exports.authUser = function (req, res, next) {

    var ep = new eventproxy();
    ep.fail(next);

    res.locals.current_user = null;
    if (req.cookies['kiss_user']) {
        return next();
    }

    if (req.session.user) {
        ep.emitLater('get_user', req.session.user);
    } else {
        return res.redirect('/login');
    }

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        req.cookies['kiss_user'] = res.locals.current_user = req.session.user = new User(user);
        next();
    });

};
