var config = require('./config/setting');
var index = require('./controller/index');
var kissme = require('./controller/kissme');

module.exports = function (app) {
    // 基本操作
    app.get('/', index.index);
    app.get('/login', index.login);
    app.post('/login', index.doLogin);
    app.get('/logout', index.logout);
    app.get('/home', index.home);
    app.get('/chat', index.chat);

    // kissme
    app.get('/kissme', kissme.index);
    app.post('/kissme/kiss', kissme.kiss);
    app.get('/kissme/random', kissme.random);
};