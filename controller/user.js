exports.index = function (req, res) {
    console.log(req.session.user);
    console.log(req);
    if (req.session.user)
        res.render('index', {title: 'Index'});
    else
        return res.redirect('/login');
};

exports.login = function (req, res) {
    res.render('login', {title: '用户登陆'});
};

exports.chat = function (req, res) {
    res.renderfile('views/chat/chat.html');
};

exports.doLogin = function (req, res) {
    var user = {
        username: 'admin',
        password: 'admin'
    };
    console.log(11);
    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        return res.redirect('/home');
    } else {
        req.session.error = '用户名或密码不正确';
        return res.redirect('/login');
    }
};

exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/');
};

exports.home = function (req, res) {
    if (req.session.user)
        res.render('home', {title: '主页'});
    else
        return res.redirect('/login');
};
