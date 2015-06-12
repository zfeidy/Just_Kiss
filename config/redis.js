var config = {
    // redis 配置，默认是本地
    redis_host: '192.168.192.38',
    redis_port: 5360,
    opts: {
        hostname: 'aps.jimdb.jd.local',
        host: 'aps.jimdb.jd.local',
        path: '/get',
        method: 'get',
        port: 80
    },
    use_cluster: true,
    redis_db: 0,
    redis_auth: '/redis/cluster/1206:1434093110601'
};

module.exports = config;
