var redis = require('../common/redis');
var logger = require('../common/logger');
var kissed_counter = "kissed_counter";

exports.count = function (req, res, next) {
    var sessionid = req.sessionID;
    var kissed_session = "kissed_" + sessionid;
    redis.get(kissed_session, function (err, data) {
        if(err){
            logger.error("异常: ", err);
            return next(err);
        }
        if (!data) {
            redis.set(kissed_session, 0, function (err, data) {
                if (err){
                    logger.error("异常: ", err);
                    return next(err);
                }
            });

            redis.incrby(kissed_counter, 1, function (err, data) {
                if (err){
                    logger.error("异常: ", err);
                    return next(err);
                }
            });
        }
        next();
    });
};