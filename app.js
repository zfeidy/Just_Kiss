// 加载redis的配置
var setting = require('./config/setting');
var redisConfig = require('./config/redis');
// 加载express
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// session模块
var session = require('express-session');
// redis session
var RedisStore = require('connect-redis')(session);
var router = require('./router');
var visits = require('./middleware/visits');
var render = require('./middleware/render');
var app = express();

// 设置模板
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 定义icon图标
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(favicon());

if (setting.debug) {
    // 渲染时间
    app.use(render.render);
}

// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// 设置 cookie
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 设置 Session
app.use(session({
    secret: redisConfig.session_secret,
    store: new RedisStore({
        port: redisConfig.redis_port,
        host: redisConfig.redis_host
    }),
    resave: true,
    saveUninitialized: true
}));

// 访问计数器
app.use(visits.count);

// 使用路由
router(app);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
