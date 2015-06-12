var config = require('./config/setting');
var user = require('./controller/user');
var kissme = require('./controller/kissme');
var employee = require('./controller/employee');
var auth = require('./middleware/auth');
var visit = require('./middleware/visits');
var logger = require('./common/logger');

module.exports = function (app) {
    
    logger.debug("路由加载开始......");

    // 基本操作
//    app.get('/', user.index);
    app.get('/', user.home);
    app.get('/login', user.login);
    app.post('/login', user.doLogin);
    app.get('/logout', user.logout);
    app.get('/chat', user.chat);

    // kissme [ejs渲染]
    app.get('/kissme', kissme.index);
    app.get('/kissme/kiss', kissme.kisslocal);
    app.post('/kissme/kiss', kissme.kiss);
    app.get('/kissme/random', kissme.random);

    // employee [ajax渲染]
    app.get('/employee/add', auth.authUser, employee.add);
    app.post('/employee/add', auth.authUser, employee.doAdd);
    app.get('/employee/list', auth.authUser, employee.list);
    app.get('/employee/kiss', employee.kisslocal);
    app.post('/employee/kiss', employee.kiss);
    app.get('/employee/random', visit.count, employee.random);
    app.post('/employee/random', visit.count, employee.randomWithLine);
    app.get('/employee/count', employee.count);
    
    logger.debug("路由加载完毕......");
};
