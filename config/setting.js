var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    name: '加油呗比!',
    description: '京东618，加油你我他！',
    keywords: '618大促,京东',
    // 添加到 html head 中的信息
    site_headers: [
        '<meta name="author" content="zfeidy@github.com" />'
    ],
    // logo
    site_logo: '/public/images/logo.svg',
    // 标题图标
    site_icon: '/public/images/icon.png',
    // 右上角的导航区
    site_navs: [
        // 格式 [ path, title, [target=''] ]
        ['/about', '关于']
    ],
    number: 4, //一次出现图片的张数
    time_out: 0, // 加油失效时间，如果是0，表示只能加油一次，默认配置【0永久，1（小时），6（小时），12（小时），24（小时），48（小时），72（小时），168（小时）】
    use_mongo: false, // 是否使用mongodb做存储
    site_static_host: '', // 静态文件存储域名
    // 社区的域名
    host: 'localhost',
    // 程序运行的端口
    port: 3000,
    //weibo app key
    weibo_key: 10000000,
    weibo_id: 'your_weibo_id',
    upload: {
        path: path.join(__dirname, '../public/upload/'),
        url: 'public/upload/'
    },
    cache:{
        path: path.join(__dirname, '../public/cache/'),
        url: 'public/cache/'
    }
};

module.exports = config;
