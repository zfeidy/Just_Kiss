var Redis = require('ioredis');
var logger = require('../common/logger');
var config = require('../config/redis');
logger.debug("加载redis配置");
var cluster = config.cluster;
var index = -1;
if (cluster && cluster instanceof Array && cluster.length > 0) {
// 获取一个小于size的随机整数
    index = Math.floor(Math.random() * cluster.length);
    logger.debug("使用 " + cluster[index].host + ":" + cluster[index].port);
}
// 初始化redis
var client = new Redis({
    host: (index >= 0 ? cluster[index].host : config.redis_host),
    port: (index >= 0 ? cluster[index].port : config.redis_port),
    family: 4,
    db: config.redis_db,
    password: config.redis_auth,
    enableReadyCheck: false
});

// 导出redis
exports = module.exports = client; 