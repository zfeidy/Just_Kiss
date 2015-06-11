var redis = require("../common/redis");
var a = [1, "a", 2, "b", 3, "c", 4, "d", 5, "e"];
redis.zadd("test", a, function (err, data) {
    console.log(err);
    console.log(data);
});

redis.zrangebyscore("test", 1, 3, function (err, data) {
    console.log(err);
    console.log(data);
});
