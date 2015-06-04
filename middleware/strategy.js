var User = require("../models/mongo/user");

module.exports = function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: '用户不存在.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: '密码不正确.'});
        }
        return done(null, user);
    });
};