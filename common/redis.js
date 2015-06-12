var config = require('../config/redis');
var Redis = require('ioredis');
var cluster = config.cluster;
// 获取一个小于size的随机整数
var index = Math.floor(Math.random() * cluster.length);
console.log("use " + cluster[index].host + ":" + cluster[index].port);

// 初始化redis
var client = new Redis({
    host: cluster[index].host,
    port: cluster[index].port,
    family: 4,
    db: config.redis_db,
    password: config.redis_auth,
    enableReadyCheck: false
});

console.log(client);
// 导出redis
exports = module.exports = client; 