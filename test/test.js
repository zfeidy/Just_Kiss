var value1 = 0, value2 = 0, value3 = 0;
for (var i = 1; i <= 5; i++) {
    var i2 = i;
    (function () {
        var i3 = i;
        setTimeout(function () {
            value1 += i;
            value2 += i2;
            value3 += i3;
        }, 1);
    })();
}

setTimeout(function () {
    console.log(value1, value2, value3);
}, 100);

var Promise = function () {
    this.thens = [];
};
Promise.prototype = {
    resolve: function () {
        var t = this.thens.shift(), n;
        t && (n = t.apply(null, arguments), console.log(n), n instanceof Promise && (n.thens = this.thens));
    },
    then: function (n) {
        return this.thens.push(n), this;
    }
};

function f1() {
    var promise = new Promise();
    setTimeout(function () {
        console.log(1);
        promise.resolve();
        console.log(promise);
    }, 1500);
    return promise;
}

function f2() {
    var promise = new Promise();
    setTimeout(function () {
        console.log(2);
        promise.resolve();
    }, 1500);
    return promise;
}

function f3() {
    var promise = new Promise();
    setTimeout(function () {
        console.log(3);
        promise.resolve();
    }, 1500);
    return promise;
}

function f4() {
    console.log(4);
}

f1().then(f2).then(f3).then(f4);

data = [];
console.log(!data || data.length === 0 || data === null);
console.log((!data && data.length === 0) || data === null);