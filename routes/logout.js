var express = require('express');
var router = express.Router();
var app = express();
//注销
router.get("/", function(req, res, next){
    delete req.session.user;
    //delete global.user;
    res.redirect("/admin/login");
});

module.exports = router;