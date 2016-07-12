var express = require('express');
var router = express.Router();
var User = require("../model/user");
var checkLogin = require("./checkLogin");

router.get("/list", checkLogin, function(req, res, next){
  var menus = req.data.menus;
  var currentPage = req.data.currentPage;
  var path = req.data.path;
  User.find({}, function(err, result){
    var users = [];
    if(!err) users = result;
    res.render("pages/user/list", {menus:menus, path:path, user: req.session.user, users: users});
  })
});

module.exports = router;
