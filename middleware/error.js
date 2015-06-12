var logger = require('../common/logger');
exports.errorPage = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
};