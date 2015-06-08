var redis = require('../common/redis');
var eventproxy = require('eventproxy');
var counter = 0;

exports.count = function (req, res, next) {
    var sessionid = req.sessionID;
    var kissed_session = "kissed_" + sessionid;
    redis.get(kissed_session, function (err, data) {
        if (!data) {
            redis.set(kissed_session, 0, function (err, data) {
                if (data) {
                    counter++;
                }
            });
        }
    });
    console.log("--------------------------");
    console.log(counter);
    next(counter);
};