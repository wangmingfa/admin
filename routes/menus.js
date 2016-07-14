var express = require('express');
var router = express.Router();
var Menu = require("../model/menu");
var checkLogin = require("./checkLogin");

router.get("/", function(req, res, next){
    res.redirect("/admin/menu/list")
});

var path = [];

/*router.get('*', function(req, res, next) {
    if(!req.session.user) return res.redirect("/admin/login");
    var currentPage = req.originalUrl;// || "/admin/" + req.params.menu + "/" + req.params.submenu;
    console.log("[" + getClientIp(req) + "]正在访问：" + currentPage);
    var menus = [];
    Menu.find({}, function(err, result){
        if(!err) menus = result;
        menus = getMenuTree(menus, currentPage);
        //if(currentPage.indexOf("/add") == -1)
        //    return res.render("pages" + currentPage.substr(6), { title: '后台管理', menus:menus, path:path, user: req.session.user});
        req.data = {
            menus: menus,
            currentPage: currentPage
        };
        next();
    });
});

router.post('*', function(req, res, next) {
    var currentPage = req.originalUrl;// || "/admin/" + req.params.menu + "/" + req.params.submenu;
    console.log("[" + getClientIp(req) + "]正在访问：" + currentPage);
    var menus = [];
    Menu.find({}, function(err, result){
        if(!err) menus = result;
        menus = getMenuTree(menus, currentPage);
        //if(currentPage.indexOf("/add") == -1)
        //    return res.render("pages" + currentPage.substr(6), { title: '后台管理', menus:menus, path:path});
        req.data = {
            menus: menus,
            currentPage: currentPage
        };
        next();
    });
});*/

router.get("*", checkLogin);
router.post("*", checkLogin);

router.get("/list", function(req, res, next){
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var path = req.data.path;
    var user = req.session.user;
    res.render("pages/menu/list", {menus:menus, path:path, user: user});
});

/*router.get("/add", function(req, res, next){
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var path = req.data.path;
    var menuId = req.query.menuId;

    if(menuId){
        return Menu.findOne({_id: menuId}, function(err, result){
            var menu = null;
            err ? console.log(err) : (menu = result);
            res.render("pages/menu/add", {menus:menus, path:path, menu:menu, user: req.session.user});
        });
    }
    res.render("pages/menu/add", {menus:menus, path:path, user: req.session.user});
});*/

//新增或修改 菜单
router.post("/add", function(req, res, next){
    var menus = req.data.menus;
    var _menu = req.body;
    if(!_menu) return res.json({success: false, message: "invalid parameter"});
    console.log(_menu);
    if(!_menu._id) delete _menu._id;
    //_menu.isLeaf = !!_menu.fatherId;
    _menu.level = _menu.fatherId ? 1 : 0;
    if(!_menu._id){
        var menu = new Menu(_menu);
        return menu.save(function(err, doc){
            /*if(err) return res.render("pages/menu/add", {menus:menus, path:path, menu:_menu, error:{msg: "新增菜单失败！" + err}});
            res.redirect("/admin/menu/list");*/
            if(err) return res.json({success: false, message: "新增菜单失败！"});
            res.json({success: true, message: "新增菜单成功！"});
        });
    }
    Menu.update({_id:_menu._id}, {$set: _menu}, function(err, doc){
        /*if(err) return console.log(err), res.render("pages/menu/add", {menus:menus, path:path, menu:_menu, error:{msg: "修改菜单失败！"}});
        return res.redirect("/admin/menu/list");*/
        if(err) return res.json({success: false, message: "修改菜单失败！"});
        res.json({success: true, message: "修改菜单成功！"});
    });
});

//删除菜单
router.delete("/delete", function(req, res, nex){
    var _id = req.body._id;
    Menu.remove({_id: _id}, function(err, result){
        if(err) return res.json({success: false});
        res.json({success: true});
    });
});


//查询所有菜单
router.get("/getMenuAll", function(req, res, next){
    Menu.find({}, function(err, results){
        if(err) return res.json({success:false, message: err});
        res.json(results);
    });
});

//通过_id查询菜单
router.get("/getMenuById", function(req, res, next){
    var id = req.query.id;
    if(!id) return res.json({success:false, message: "invalid id"});
    Menu.getMenuById(id, function(err, result){
        if(err) return res.json({success:false, message: err});
        res.json(result);
    });
});

module.exports = router;
