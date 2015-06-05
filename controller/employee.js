exports.index = function (req, res) {
};

exports.add = function (req, res) {
    res.render("employees/add",{
        title:"员工"
    });
};
