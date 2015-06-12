var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    name: '加油呗比!',
    description: '京东618，加油你我他！',
    groupsize: 1000,
    keywords: '618大促,京东',
    number: 4, //一次出现图片的张数
    expires: 360, // cookie过期时间。默认配置【0永久，1（小时），6（小时），12（小时），24（小时），48（小时），72（小时），168（小时）,360(小时),720(小时)】
    use_mongo: false, // 是否使用mongodb做存储
    log_path: '/log',
    // 程序运行的端口
    port: 3000,
    admin: "21232f297a57a5a743894a0e4a801fc3",
    password: "21232f297a57a5a743894a0e4a801fc3",
    upload: {
        path: path.join(__dirname, '../public/upload/'),
        url: 'public/upload/'
    },
    cache: {
        path: path.join(__dirname, '../public/cache/'),
        url: 'public/cache/'
    }
};

module.exports = config;
