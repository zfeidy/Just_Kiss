var config = require('./config/setting');
var user = require('./controller/user');
var kissme = require('./controller/kissme');
var employee = require('./controller/employee');
var auth = require('./middleware/auth');
var visit = require('./middleware/visits');

module.exports = function (app) {

    // 基本操作
    app.get('/', user.index);
    app.get('/login', user.login);
    app.post('/login', user.doLogin);
    app.get('/logout', user.logout);
    app.get('/home', user.home);
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
    app.get('/employee/count', employee.count);
//    app.get('/employee/random', employee.random);
};
