var redis = require('../common/redis');
var logger = require('../common/logger');
var kissed_counter = "kissed_counter";

exports.count = function (req, res, next) {
    var sessionid = req.sessionID;
    var kissed_session = "kissed_" + sessionid;
    redis.get(kissed_session, function (err, data) {
        if (err) {
            logger.error("异常: ", err);
            return next(err);
        }
        if (!data) {
            redis.set(kissed_session, 0, function (err, data) {
                if (err) {
                    logger.error("异常: ", err);
                    return next(err);
                }
            });

            redis.incrby(kissed_counter, 1, function (err, data) {
                if (err) {
                    logger.error("异常: ", err);
                    return next(err);
                }
            });
            console.info("当前的用户IP为", getClientIp(req));
        }
        next();
    });
};

/**
 * 获取客户端ip地址
 * @param {type} req
 * @returns {reqheaders.x-forwarded-for}
 */
var getClientIp = function (req) {
    return req.headers['x-forwarded-for']  // 反向代理
            || req.connection.remoteAddress  // 远程客户端
            || req.socket.remoteAddress   // 通过socket
            || req.connection.socket.remoteAddress;
};