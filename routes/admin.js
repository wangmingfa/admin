var express = require('express');
var router = express.Router();
var Menu = require("../model/menu");
var User = require("../model/user");


router.get("/", function(req, res, next){
    res.redirect("/admin/menu/list")
});

var path = [];

//登陆
router.get("/login", function(req, res, next){
    if(req.session.user) return res.redirect("/admin");
    res.render("login");
});

//注销
router.get("/logout", function(req, res, next){
    delete req.session.user;
    res.redirect("/admin/login");
});

router.get('*', function(req, res, next) {
    if(!req.session.user) return res.redirect("/admin/login");
    var currentPage = req.originalUrl;// || "/admin/" + req.params.menu + "/" + req.params.submenu;
    console.log("[" + getClientIp(req) + "]正在访问：" + currentPage);
    var menus = [];
    Menu.find({}, function(err, result){
        if(!err) menus = result;
        menus = getMenuTree(menus, currentPage);
        if(currentPage.indexOf("/add") == -1)
            return res.render("pages" + currentPage.substr(6), { title: '后台管理', menus:menus, path:path, user: req.session.user});
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
});

//登录
router.post("/login", function(req, res, next){
    var _user = req.body.user;
    if(!_user || !_user.username || !_user.password) return res.redirect("login");
    User.signIn(_user, function(err, result){
        if(err) return res.json({success: false, msg: err.message});
        req.session.user = result;
        res.json({success: true, msg: "ok"});
    });
});

router.get("/menu/add", function(req, res, next){
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var menuId = req.query.menuId;

    if(menuId){
        return Menu.findOne({_id: menuId}, function(err, result){
            var menu = null;
            err ? console.log(err) : (menu = result);
            res.render("pages/menu/add", { title: '后台管理', menus:menus, path:path, menu:menu, user: req.session.user});
        });
    }
    res.render("pages/menu/add", { title: '后台管理', menus:menus, path:path, user: req.session.user});
});

//新增或修改 菜单
router.post("/menu/add", function(req, res, next){
    var menus = req.data.menus;
    var _menu = req.body.menu;
    if(!_menu) return res.redirect("pages/menu/add");
    if(!_menu._id) delete _menu._id;
    //_menu.isLeaf = !!_menu.fatherId;
    _menu.level = _menu.fatherId ? 1 : 0;
    if(!_menu._id){
        var menu = new Menu(_menu);
        return menu.save(function(err, doc){
            if(err) return res.render("pages/menu/add", {menus:menus, path:path, menu:_menu, error:{msg: "新增菜单失败！" + err}});
            res.redirect("/admin/menu/list");
        });
    }
    Menu.update({_id:_menu._id}, {$set: _menu}, function(err, doc){
        if(err) return console.log(err), res.render("pages/menu/add", {menus:menus, path:path, menu:_menu, error:{msg: "修改菜单失败！"}});
        return res.redirect("/admin/menu/list");
    });
});

//删除菜单
router.delete("/menu/delete", function(req, res, nex){
    var _id = req.body._id;
    Menu.remove({_id: _id}, function(err, result){
        if(err) return res.json({success: false});
        res.json({success: true});
    });
});

function getMenuTree(menus, current){
    var index = current.indexOf("?")
    current = current.substring(0, index > -1 ? index : current.length);

    var i = 0, j = 0, len = menus.length;
    for(i = 0; i < len; i++){
        if(menus[i].href == current){
            menus[i].cls = "active";
            path[1] = menus[i];
            //找到父菜单
            for(j = 0; j < len; j++){
                if(menus[j].id == menus[i].fatherId){
                    menus[j].cls = "active open";
                    path[0] = menus[j];
                    break;
                }
            }
           break;
        }
    }

    var resultMenu = [];
    var leafMenu = [];

    for(i = 0; i < len; i++){
        if(menus[i].level == 0){
            resultMenu.push(menus[i]);
        }else{
            leafMenu.push(menus[i]);
        }
    }
    for(i = 0, len = resultMenu.length; i < len; i++){
        resultMenu[i].submenu = [];
        //找到子菜单
        for(j = 0; j < leafMenu.length; j++){
            if(resultMenu[i].id == leafMenu[j].fatherId){
                resultMenu[i].submenu.push(leafMenu[j]);
            }
        }
    }

    return resultMenu;
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

module.exports = router;
