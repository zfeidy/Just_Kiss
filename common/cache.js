// 引用redis
var fs = require('fs');
var path = require('path');
var redis = require('../common/redis');
var setting = require('../config/setting');
var logger = require('./logger');
//var employee_json = require('../config/kiss_jd_employee');
var cachepath = setting.cache.path;

// 从redis获取数据
var getFromRedis = function (key, callback) {
    var t = new Date();
    redis.get(key, function (err, data) {
        if (err) {
            return callback(err);
        }
        if (!data) {
            return callback();
        }
        data = JSON.parse(data);
        var duration = (new Date() - t);
        logger.debug('Cache', 'get', key, (duration + 'ms').green);
        callback(data);
        setToLocal(key, data, function (err, data) {
            if (err) {
                logger.debug('Cache', 'set', key, (duration + 'ms').green);
            }
        });
    });
};

exports.getFromRedis = getFromRedis;

// key为本地文件名，data为数据
var setToLocal = function (key, data, callback) {
    fs.writeFile(path.join(cachepath + '/' + key), data, callback);
};

exports.setToLocal = setToLocal;

// 初始化数据
var getFromLocal = function (key, callback) {
    console.log(path.join(cachepath + '/' + key));
    fs.readFile(path.join(cachepath + '/' + key), 'utf-8', function (err, filedata) {
        if (err)
            getFromRedis(key, function (redisdata) {
                callback(redisdata);
            });
        callback(filedata);
    });
};

exports.getFromLocal = getFromLocal;