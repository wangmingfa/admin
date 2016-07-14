var express = require('express');
var router = express.Router();
var User = require("../model/user");
var UserDetail = require("../model/userDetail");
var checkLogin = require("./checkLogin");

router.get("*", checkLogin);
router.post("*", checkLogin);

router.get("/list", function (req, res, next) {
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var path = req.data.path;
    User.fetch(function (err, result) {
        console.log(result);
        var users = [];
        if (!err) users = result;
        res.render("pages/user/list", {menus: menus, path: path, user: req.session.user, users: users});
    })
});


router.post("/add", function(req, res, next){
    return next();
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var path = req.data.path;

    var _user = req.body;
    if(!_user._id){
        //新增
        var user = new User(_user);
        user.save(function(err, result){
            if(err) return res.json({success: false, message: "新增用户失败"});

            var id = result._id;
            var userDetail = new UserDetail($.extend(true, {
                user: id
            }, _user));
            userDetail.save(function(err){
                if(err) return result.remove(), res.json({success: false, message: "新增用户失败"});
                res.json({success: true, message: "新增用户成功"});
            });
        });
    }

});

module.exports = router;
