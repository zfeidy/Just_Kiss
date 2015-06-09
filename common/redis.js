var config = require('../config/redis');
var Redis = require('ioredis');

// 初始化redis
var client = new Redis({
    port: config.redis_port,
    host: config.redis_host,
    db: config.redis_db
});

// 导出redis
exports = module.exports = client;