var logger = require('../common/logger');
console.log("logger");
console.log(logger);
exports.errorPage = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.error(err);
    next();
};