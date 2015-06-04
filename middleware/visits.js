var redis = require('../common/redis');
var eventproxy = require('eventproxy');
var counter = 0;

exports.count = function (req, res, next) {
    var sessionid = req.sessionID;
    var kissed_session = "kissed_" + sessionid;

    var ep = new eventproxy();
    ep.fail(next);

    redis.get(kissed_session, ep.done("get", function (data) {
        if (!data) {
            redis.set(kissed_session, 0, ep.done("set", function (data) {
                counter++;
            }));
        }
    }));

    ep.all("get", "set", function (getres, setres) {
        console.log(getres);
        console.log(setres);
        res.send({
            "count": "当前已有" + counter + "位北鼻访问了此页面！"
        });
    });
    
//    redis.get(kissed_session, function (err, data) {
//        if (!data) {
//            redis.set(kissed_session, 0, function (err, data) {
//                if (data) {
//                    counter++;
//
//                }
//            });
//        }
//    });
//
//    res.render('index', {
//        "count": counter
//    });

    next();
};