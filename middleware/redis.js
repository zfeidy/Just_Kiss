var config = require("../config/redis");
var http = require('http');
var path = require('path');
var fs = require('fs');

exports.initRedisCluster = function () {
    console.log("init redis cluster start......");
// 初始化redis集群
    initRedis();
    console.log("init redis cluster end！");
};

var sleep = function (sleepTime) {
    for (var start = +new Date; +new Date - start <= sleepTime; ) {
    }
};

var initRedis = function () {
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
            console.log("get redis");
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
                        }
                    });
                }
            });
        }).on('error', function (e) {
            console.log("获取失败: " + e.message);
            console.log(e);
        });
        getRedisReq.end();
    } else {
        console.log("loading...");
    }
};