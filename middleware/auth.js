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
    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = res.locals.current_user = req.session.user = new User(user);
        next();
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user);
    } else {
        return next();
    }
};
