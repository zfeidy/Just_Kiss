var config = require('./config/setting');
var user = require('./controller/user');
var kissme = require('./controller/kissme');
var employee = require('./controller/employee');

module.exports = function (app) {
    // 基本操作
    app.get('/', user.index);
    app.get('/login', user.login);
    app.post('/login', user.doLogin);
    app.get('/logout', user.logout);
    app.get('/home', user.home);
    app.get('/chat', user.chat);

    // kissme
    app.get('/kissme', kissme.index);
    app.get('/kissme/kiss', kissme.kisslocal);
    app.post('/kissme/kiss', kissme.kiss);
    app.get('/kissme/random', kissme.random);
    
    // employee
    app.get('/employee/add', employee.add);
    app.post('/employee/add', employee.doAdd);
    app.get('/employee/list', employee.list);
};