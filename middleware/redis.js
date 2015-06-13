var config = require("../config/redis");
var logger = require('../common/logger');
var http = require('http');
var path = require('path');
var fs = require('fs');
exports.initRedisCluster = function () {
    logger.debug("获取redis集群AP开始");
    // 初始化redis集群
    initRedisConfig();
};

var sleep = function (sleepTime) {
    for (var start = +new Date; +new Date - start <= sleepTime; ) {
    }
};

var initRedisConfig = function () {
    if (config.use_cluster && !config.cluster) {
        // 初始化redis
        var options = {
            hostname: config.opts.hostname,
            port: config.opts.port,
            method: config.opts.method,
            path: config.opts.path
        };
        console.log(options);
        var getRedisReq = http.request(options, function (res) {
            logger.debug("getRedisReq");
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log(chunk);
                var clusterStr = chunk.split("\n");
                var opts = [];
                for (var i in clusterStr) {
                    var tmp = clusterStr[i].split(":");
                    if (tmp.length > 1) {
                        opts.push({
                            port: tmp[1],
                            host: tmp[0]
                        });
                    }
                }
                if (opts.length > 0) {
                    config.redis_host = opts[0].host;
                    config.redis_port = opts[0].port;
                    config.cluster = opts;
                    var newConfig = "var config = " + JSON.stringify(config);
                    newConfig += ";\n";
                    newConfig += "module.exports = config;";
                    fs.writeFile('../config/redis.js', newConfig, function (err) {
                        if (err) {
                            console.log(err);
                            logger.error("初始化redis集群AP配置异常", err);
                        }
                        logger.debug("获取redis集群AP完成.");
                    });
                }
            });
        }).on('error', function (e) {
            logger.error("获取失败: " + e.message);
            logger.debug(e);
        });
        getRedisReq.end();
    } else {
        logger.info("加载redis集群AP完成.");
    }
};