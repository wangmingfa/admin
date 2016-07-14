var express = require('express');
var router = express.Router();
var User = require("../model/user");
var UserDetail = require("../model/userDetail");
var $ = require("underscore");

//注册
router.post("/", function(req, res, next){
    var _user = req.body.user;
    if(!_user || !_user.username || !_user.password || !_user.email) return res.json({success: false, message: "无效的用户名、密码、邮箱"});
    //检查用户名是否存在
    User.getUserByName(_user.username, function(err, result){
        if(err) return res.json({success: false, message: err});
        if(result) return res.json({success: false, message: "用户名已存在"});

        //邮箱查重
        UserDetail.findOne({email: _user.email}, function(err, result){
            if(err) return res.json({success: false, message: err});
            if(result) return res.json({success: false, message: "邮箱已存在"});

            var user = new User(_user);
            user.save(function(err, result){
                if(err) return res.json({success: false, message: "注册失败"});

                var id = result._id;
                _user.user = id;
                _user.email = {
                    value: _user.email
                };
                var userDetail = new UserDetail(_user);
                userDetail.save(function(err, detail){
                    if(err) return result.remove(), res.json({success: false, message: "注册失败"});
                    console.log(detail);
                    User.update({_id: result._id}, {$set: {detail: detail._id}}, function(err, result){
                        console.log(err);
                        console.log(result);
                    });
                    res.json({success: true, message: "注册成功"});
                });
            });

        });

    });

});

module.exports = router;