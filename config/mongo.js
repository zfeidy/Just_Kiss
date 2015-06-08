// mongodb 配置
var config = {
    // mongodb 配置，默认是本地
    uri: 'mongodb://127.0.0.1/kiss618',
    port: 27017,
    opts: {
        db_name: 'kiss618',
        server: {poolSize: 5},
        db: {native_parser: true}
//        replset: {rs_name: 'kiss'},
//        user: 'jing',
//        pass: 'jing'
    }
};

module.exports = config;