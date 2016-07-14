var express = require('express');
var router = express.Router();
var User = require("../model/user");
var app = express();


router.get("/", function(req, res, next){
    if(req.session.user) return res.redirect("/admin");
    res.render("login");
});


router.post("/", function(req, res, next){
    var _user = req.body.user;
    if(!_user || !_user.username || !_user.password) return res.redirect("/admin/login");
    User.signIn(_user, function(err, result){
        if(err) return res.json({success: false, message: err.message});
        req.session.user = result;
        //global.user = result;
        res.json({success: true, message: "ok"});
    });
});

module.exports = router;