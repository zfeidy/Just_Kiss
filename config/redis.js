var config = {
    "redis_host": "192.168.192.38",
    "redis_port": 5360,
    "opts": {
        "hostname": "aps.jimdb.jd.local",
        "host": "aps.jimdb.jd.local",
        "path": "/get",
        "method": "get",
        "port": 80
    },
    "use_cluster": true,
    "redis_db": 0,
    "redis_auth": "/redis/cluster/19:1417632068813",
    "cluster": [
        {"port": "5360", "host": "192.168.192.38"},
        {"port": "5360", "host": "192.168.192.39"}
    ]
};
module.exports = config;