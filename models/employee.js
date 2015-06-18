var EventProxy = require("eventproxy");
var logger = require('../common/logger');
var redis = require('../common/redis');
var cache = require('../common/cache');
var setting = require('../config/setting');
var number = setting.number;
var groupsize = setting.groupsize;
var kissme_employee = "kiss_jd_employee";
var kissme_rank = "kissme_rank";
var kissed_counter = "kissed_counter";

/**
 * 声明一个员工对象
 * @param {type} employee
 * @returns {Employee}
 */
function Employee(employee) {
    this.id = employee.id;     // 编号
    this.name = employee.name;  // 姓名
    this.images = employee.images;
    this.line = employee.line;  // 战线
    this.slogan = employee.slogan; // 口号
    this.times = employee.times;  // 被赞次数
    this.kissed = employee.kissed;
}

module.exports = Employee;

/**
 * KissMe操作，操作后，对应的员工点赞数增加1，同时相应session对应的员工ID列表减去1
 * @param {number} sessionid
 * @param {number} employeeid
 * @param {function} callback
 * @returns {undefined}
 */
Employee.prototype.kiss = function (sessionid, withline, callback) {
    var employeeid = this.id;

    var ep = new EventProxy();
    ep.fail(callback);

    // 用sortedset存储员工被kiss的数目，每kiss一次权值加1
    redis.zincrby(kissme_rank, 1, employeeid, ep.doneLater('srem'));

    ep.once("srem", function (data) {
        callback(null, data);
        // rediskey，以sessionid为唯一标示符
        if (withline == true) {
            var kissme_session = "kissme_" + sessionid;
            redis.srem(kissme_session, employeeid, ep.doneLater('set'));
        } else {
            var kissme_session = "kissll_" + sessionid;
            redis.zrem(kissme_session, employeeid, ep.doneLater('set'));
        }
    });

    ep.once("set", function (data) {
        // 如果当前session已经kiss过，就标识一下
        var kissed_session = "kissed_" + sessionid;
        redis.set(kissed_session, 1, ep.doneLater('console'));
    });

    ep.once("console", function (data) {
//        logger.debug(data);
    });
};

/**
 * 根据员工ID查询员工是否存在
 * @param {type} id
 * @param {type} employees
 * @param {type} callback
 * @returns {unresolved}
 */
Employee.getEmployeeById = function (id, employees, callback) {
    for (var i = 0; i < employees.length; i++) {
        if (id == employees[i].id) {
            return callback(employees[i]);
        }
    }
    return callback(null);
};

/**
 * 增加一个员工信息
 * @param {type} employee
 * @param {type} employees
 * @param {type} callback
 * @returns {undefined}
 */
Employee.add = function (employee, employees, callback) {
    employees.push(employee);
    cache.setToLocal(kissme_employee, JSON.stringify(employees), function (err) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        callback(null);
    });
};

/**
 * 更新一个员工信息
 * @param {type} employee
 * @param {type} employees
 * @param {type} callback
 * @returns {unresolved}
 */
Employee.update = function (employee, employees, callback) {
    for (var i = 0; i < employees.length; i++) {
        if (employee.id == employees[i].id) {
            employees[i].name = employee.name;
            employees[i].line = employee.line;
            employees[i].images = employee.images;
            employees[i].slogan = employee.slogan;
        }
    }
    cache.setToLocal(kissme_employee, JSON.stringify(employees), function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        callback(null, data);
    });
};

/**
 * 初始化数据，先从本地拿，本地没有就从redis里面拿
 * @param {function} callback
 * @returns {undefined}
 */
Employee.init = function (callback) {
    cache.getFromLocal(kissme_employee, function (data) {
        var employee = [];
        if (!data) {
            return callback(employee);
        }
        var datajson = JSON.parse(data);
        for (var i in datajson) {
            employee.push(new Employee(datajson[i]));
        }
        callback(employee);
    });
};

/**
 * 随机产生员工的方法，已经随机出现的就不再出现
 * @param {String} sessionid
 * @param {Employee} employees
 * @param {function} callback
 * @returns {undefined}
 */
Employee.random = function (sessionid, employees, callback) {
    // rediskey，以sessionid为唯一标示符
    var redis_key = "kissme_" + sessionid;
    // 一次从redis里面随机取出number个元素
    redis.srandmember(redis_key, number, function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        // 如果结果集为空或者空数组
        if (!data || data.length === 0) {

            var result = [];
            var _employees = employees.slice(0);
            var size = _employees.length;
            for (var i = 0; i < number; i++) {
                var randomindex = randomIndex(size);
                result.push(_employees[randomindex]);
                _employees.splice(randomindex, 1);
                size--;
            }

            redis.sadd(redis_key, getUncheckId(_employees), function (err, data) {
                if (err) {
                    logger.error("异常", err);
                    return callback(err);
                }
                logger.debug(data);
            });
            if (callback) {
                callback(null, result);
            }
        } else {
            redis.srem(redis_key, data, function (err, delnum) {
                if (err) {
                    logger.error("异常", err);
                    return callback(err);
                }
            });
            if (callback) {
                callback(null, data);
            }
        }
    });
};

/**
 * 随机产生显示员工方法
 * @param {type} sessionid
 * @param {type} employees
 * @param {type} callback
 * @returns {undefined}
 */
Employee.randomAll = function (sessionid, employees, callback) {
    // rediskey，以sessionid为唯一标示符
    var redis_key = "kissme_" + sessionid;
    // 一次从redis里面随机取出number个元素
    redis.srandmember(redis_key, number, function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        // 如果结果空数组
        if (!data || data.length === 0) {
            var kissed_session = "kissed_" + sessionid;
            redis.get(kissed_session, function (err, kissed) {
                if (err) {
                    logger.error("异常", err);
                    return callback(err);
                }
                // 已经被赞过
                if (kissed == 1) {
                    return callback(null, []);
                } else {
                    var result = randomArray(employees, number, true);
                    // 把所有员工的ID加入到redis缓存
                    redis.sadd(redis_key, getAllId(employees), function (err, data) {
                        if (err) {
                            logger.error("异常", err);
                            return callback(err);
                        }
                    });
                    callback(null, result);
                    logger.debug("randomAll result = " + result);
                }
            });
        } else {
            callback(null, data);
            logger.debug("randomAll data = " + data);
        }
    });
};

/**
 * 填充员工随机数组，如果employeeIds的长度小于number，则在employees数组中再随机生成剩下的员工
 * @param {Employee} employees 所有的员工，是一个数组
 * @param {Number} employeeIds 已经随机生成的未被kiss的员工ID数组
 * @returns {Employee} 总数为number的随机生成员工数组
 */
Employee.fill = function (employees, employeeIds) {
    var employee = [];
    // 先复制一个员工数组，以免随机操作数组引起原来数组的改变
    var _employees = employees.slice(0);
    // 先从员工数组里面找出已经随机出来的员工信息，同时剔除从这些员工
    for (var j in employeeIds) {
        var target = employeeIds[j];
        for (var i in _employees) {
            var source = _employees[i];
            if (source.id == target) {
                // 标识为未被kiss的状态
                source.kissed = false;
                // 删除当前元素
                _employees.splice(i, 1);
                employee.push(source);
            }
        }
    }
    // 如果生成的信息已经等于需要生成的数量，直接返回
    if (employee.length === number) {
        return employee;
    } else {
        // 随机生成剩下的员工信息
        var size = _employees.length;
        var prelength = employee.length;
        for (var k = 0; k < number - prelength; k++) {
            var randomindex = randomIndex(size);
            // 标识为已经被kiss的状态
            _employees[randomindex].kissed = true;
            employee.push(_employees[randomindex]);
            // 删除当前数据
            _employees.splice(randomindex, 1);
            size--;
        }
        return employee;
    }
};

/**
 * 随机产生显示员工方法
 * @param {type} sessionid
 * @param {type} employees
 * @param {type} callback
 * @returns {undefined}
 */
Employee.randomAllWithLine = function (sessionid, line, employees, callback) {
    var startid = line * groupsize, endid = (Number(line) + 1) * groupsize - 1;
    var redis_key = "kissll_" + sessionid;
    // 一次从redis里面随机取出number个元素
    redis.zrangebyscore(redis_key, startid, endid, function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        // 如果结果集为空或者空数组
        if (!data || data.length === 0) {
            var kissed_session = "kissed_" + sessionid;
            redis.get(kissed_session, function (err, kissed) {
                if (err) {
                    logger.error("异常", err);
                    return callback(err);
                }
                // 已经被赞过
                var _employees = filterIdWithLine(line, employees);
                if (kissed == 1 || _employees === null || _employees.length === 0) {
                    return callback(null, []);
                } else {
                    var result = randomArray(_employees, number, true);
                    var newValue = getAllIdWithLine(employees);
                    // 把所有员工的ID加入到redis缓存
                    redis.zadd(redis_key, newValue, function (err, data) {
                        if (err) {
                            logger.error("异常", err);
                            return callback(err);
                        }
                    });
                    callback(null, result);
                }
            });
        } else {
            var length = data.length;
            var result = randomArray(data, length < number ? length : number);
            callback(null, result);
        }
    });
};

/**
 * 填充员工随机数组，如果employeeIds的长度小于number，则在employees数组中再随机生成剩下的员工
 * @param {Employee} employees 所有的员工，是一个数组
 * @param {Number} employeeIds 已经随机生成的未被kiss的员工ID数组
 * @returns {Employee} 总数为number的随机生成员工数组
 */
Employee.fillWithLine = function (employees, line, employeeIds) {
    var employee = [];
    // 先复制一个员工数组，以免随机操作数组引起原来数组的改变
    var _employees = employees.slice(0);
    // 先从员工数组里面找出已经随机出来的员工信息，同时剔除从这些员工
    for (var j in employeeIds) {
        var target = employeeIds[j];
        for (var i in _employees) {
            var source = _employees[i];
            if (source.id == target) {
                // 标识为未被kiss的状态
                source.kissed = false;
                // 删除当前元素
                _employees.splice(i, 1);
                employee.push(source);
            }
        }
    }
    // 如果生成的信息已经等于需要生成的数量，直接返回
    if (employee.length === number) {
        return employee;
    } else {
        // 随机生成剩下的员工信息
        _employees = filterIdWithLine(line, _employees);
        var prelength = employee.length;
        var size = _employees.length;
        for (var k = 0; k < number - prelength && size > 0; k++) {
            var randomindex = randomIndex(size);
            // 标识为已经被kiss的状态
            _employees[randomindex].kissed = true;
            employee.push(_employees[randomindex]);
            // 删除当前数据
            _employees.splice(randomindex, 1);
            size--;
        }
        return employee;
    }
};

/**
 * 员工被kiss数目统计
 * @param {type} callback
 * @returns {undefined}
 */
Employee.count = function (callback) {
    redis.zrevrange(kissme_rank, 0, -1, 'withscores', function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        callback(null, data);
    });
};

/**
 * 总访问次数统计
 * @param {type} callback
 * @returns {undefined}
 */
Employee.countTotal = function (callback) {
    redis.get(kissed_counter, function (err, data) {
        if (err) {
            logger.error("异常", err);
            return callback(err);
        }
        callback(null, data);
    });
};

// 获取一个小于size的随机整数
var randomIndex = function (size) {
    return Math.floor(Math.random() * size);
};

// 获取未被选中的对象
var getUncheckId = function (employees) {
    var uncheck = [];
    for (var i in employees) {
        uncheck.push(employees[i].id);
    }
    return uncheck;
};

// 获取所有的ID
var getAllId = function (employees) {
    var all = [];
    for (var i in employees) {
        all.push(employees[i].id);
    }
    return all;
};

// 根据战线获取员工ID【使用sortedset存储，员工ID作为权值】
var getAllIdWithLine = function (employees) {
    var all = [];
    for (var i in employees) {
        // 把ID自己作为权值
//        all.push(Number(employees[i].line * groupsize) + Number(i));
        all.push(employees[i].id);
        all.push(employees[i].id);
    }
    return all;
};

//过滤某一战线员工
var filterIdWithLine = function (line, employees) {
    var lineArray = [];
    for (var i in employees) {
        if (employees[i].line == line) {
            lineArray.push(employees[i]);
        }
    }
    return lineArray;
};

/**
 * 从一个数组里面随机出有指定数量成员ID的子数组
 * @param {type} employees
 * @returns {Array|randomArray.result}
 */
var randomArray = function (employees, number, isId) {
    var result = [];
    // 复制数组
    var _employees = employees.slice(0);
    var size = _employees.length;
    for (var i = 0; i < number && size > 0; i++) {
        var randomindex = randomIndex(size);
        if (isId) {
            result.push(_employees[randomindex].id);
        } else {
            result.push(_employees[randomindex]);
        }
        // 删除当前数据
        _employees.splice(randomindex, 1);
        size--;
    }
    return result;
};