var redis = require('../common/redis');
var cache = require('../common/cache');
var setting = require('../config/setting');
var number = setting.number;
var kissme_employee = "kiss_jd_employee";
var kissme_rank = "kissme_rank";

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
Employee.prototype.kiss = function (sessionid, callback) {
    var employeeid = this.id;
    console.log("employeeid = " + employeeid);
    // 用sortedset存储员工被kiss的数目，每kiss一次权值加1
    redis.zincrby(kissme_rank, 1, employeeid, function (err, data) {
        if (err) {
            console.log(err);
        }
        // rediskey，以sessionid为唯一标示符
        var kissme_session = "kissme_" + sessionid;
        redis.srem(kissme_session, employeeid, function (sremerr, sremdata) {
            if (sremerr) {
                console.log(sremerr);
            }
            callback(sremdata);
            // 如果当前session已经kiss过，就标识一下
            var kissed_session = "kissed_" + sessionid;
            redis.set(kissed_session, 1, function (adderr, adddata) {
                if (adderr) {
                    console.log(adderr);
                }
                console.log("已标识");
            });
        });
    });
};

/**
 * 初始化数据，先从本地拿，本地没有就从redis里面拿
 * @param {function} callback
 * @returns {undefined}
 */
Employee.init = function (callback) {
    cache.getFromLocal(kissme_employee, function (data) {
        var datajson = JSON.parse(data);
        var employee = [];
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
    var result = [];
    // rediskey，以sessionid为唯一标示符
    var redis_key = "kissme_" + sessionid;
    // 一次从redis里面随机取出number个元素
    redis.srandmember(redis_key, number, function (err, data) {
        if (err) {
            console.log(err);
        }
        // 如果结果集为空或者空数组
        if (!data || data.length === 0) {
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
                    console.log(err);
                }
                console.log(data);
            });
            if (callback) {
                callback(result);
            }
        } else {
            redis.srem(redis_key, data, function (err, delnum) {
                if (err) {
                    console.log(err);
                }
                if (delnum < number) {

                }
            });
            if (callback) {
                callback(data);
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
    var result = [];
    // rediskey，以sessionid为唯一标示符
    var redis_key = "kissme_" + sessionid;
    // 一次从redis里面随机取出number个元素
    redis.srandmember(redis_key, number, function (err, data) {
        if (err) {
            console.log(err);
        }
        // 如果结果集为空或者空数组
        if (!data || data.length === 0) {
            // 复制数组
            var _employees = employees.slice(0);
            var size = _employees.length;
            for (var i = 0; i < number; i++) {
                var randomindex = randomIndex(size);
                result.push(_employees[randomindex].id);
                // 删除当前数据
                _employees.splice(randomindex, 1);
                size--;
            }
            redis.sadd(redis_key, getAllId(employees), function (err, data) {
                if (err) {
                    console.log(err);
                }
                console.log(data);
            });
            if (callback) {
                callback(result);
            }
            console.log("randomAll result = " + result);
        } else {
            if (callback) {
                callback(data);
            }
            console.log("randomAll data = " + data);
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

// 获取一个小于size的随机整数
var randomIndex = function (size) {
    return Math.floor(Math.random() * size);
};

// 获取违背选中的对象
var getUncheckId = function (employees) {
    var uncheck = [];
    for (var i in employees) {
        uncheck.push(employees[i].id);
    }
    return uncheck;
};

var getAllId = function (employees) {
    var all = [];
    for (var i in employees) {
        all.push(employees[i].id);
    }
    return all;
};