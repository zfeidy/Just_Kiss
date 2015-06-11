var logger = require('../common/logger');

exports.render = function (req, res, next) {
    res._render = res.render;
    res.render = function (view, options, fn) {
        var t = new Date();
        res._render(view, options, fn);
        var duration = (new Date() - t);
        logger.info("loading... ", view, "(" + duration + "ms)");
    };
    next();
};
