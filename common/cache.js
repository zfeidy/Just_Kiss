// 引用redis
var fs = require('fs');
var path = require('path');
var redis = require('../common/redis');
var setting = require('../config/setting');
var logger = require('./logger');
var cachepath = setting.cache.path;

// 从redis获取数据
var getFromRedis = function (key, callback) {
    var t = new Date();
    redis.get(key, function (err, data) {
        if (err) {
            logger.error("从redis获取数据异常", err);
            return callback(err);
        }
        if (!data) {
            logger.info("从redis获取数据为空", err);
            return callback();
        }
        data = JSON.parse(data);
        var duration = (new Date() - t);
        logger.debug('Cache', 'get', key, (duration + 'ms').green);
        callback(data);
        setToLocal(key, data, function (err, data) {
            if (err) {
                logger.error("文件本地存储异常", err);
                logger.error('Cache', 'set', key, (duration + 'ms').green);
            }
        });
    });
};
exports.getFromRedis = getFromRedis;

// 存储到redis
var setToRedis = function (key, data, callback) {
    redis.set(key, data, callback);
};
exports.setToRedis = setToRedis;

// key为本地文件名，data为数据
var setToLocal = function (key, data, callback) {
    fs.writeFile(path.join(cachepath + '/' + key), data, function (err) {
        if (err) {
            logger.error("写入文件异常", err);
            return callback(err);
        }
        // 存储到本地的同时存储到redis
        setToRedis(key, data, function (err, data) {
            if (err) {
                logger.error("存储数据异常", err);
                return callback(err);
            }
            callback(null, data);
        });
    });

};
exports.setToLocal = setToLocal;

// 初始化数据
var getFromLocal = function (key, callback) {
    logger.log("加载数据", path.join(cachepath + '/' + key));
    fs.readFile(path.join(cachepath + '/' + key), 'utf-8', function (err, filedata) {
        if (err) {
            logger.error("读取文件异常", err);
            getFromRedis(key, function (redisdata) {
                return callback(redisdata);
            });
        }
        callback(filedata);
    });
};
exports.getFromLocal = getFromLocal;