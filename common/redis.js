var config = require('../config/redis');
var Redis = require('ioredis');
// 初始化redis
var client = new Redis({
    host: config.redis_host,
    port: config.redis_port,
    family: 4,
    db: config.redis_db,
    password: config.redis_auth,
    enableReadyCheck: false 
});
// 导出redis
exports = module.exports = client; 