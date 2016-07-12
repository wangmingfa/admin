var express = require('express');
var router = express.Router();
var Menu = require("../model/menu");

router.get("/", function(req, res, next){
    res.redirect("/admin/menu/list")
});

var path = [];
router.get('*', function(req, res, next) {
    var currentPage = req.originalUrl;// || "/admin/" + req.params.menu + "/" + req.params.submenu;
    console.log("[" + getClientIp(req) + "]正在访问：" + currentPage);
    var menus = [];
    Menu.find({$or:[{type: 0}, {type: 2}]}, function(err, result){
        if(!err) menus = result;
        menus = getMenuTree(menus, currentPage);
        if(currentPage.indexOf("/add") == -1)
            return res.render("pages" + currentPage.substr(6), { title: '后台管理', menus:menus, path:path});
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
    Menu.find({$or:[{type: 0}, {type: 2}]}, function(err, result){
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

router.get("/menu/add", function(req, res, next){
    var menus = req.data.menus;
    var currentPage = req.data.currentPage;
    var menuId = req.query.menuId;

    if(menuId){
        return Menu.findOne({_id: menuId}, function(err, result){
            var menu = null;
            err ? console.log(err) : (menu = result);
            res.render("pages/menu/add", { title: '后台管理', menus:menus, path:path, menu:menu});
        });
    }
    res.render("pages/menu/add", { title: '后台管理', menus:menus, path:path});
});

router.post("/menu/add", function(req, res, next){
    var menus = req.data.menus;
    var _menu = req.body.menu;
    if(!_menu) return res.redirect("pages/menu/add");
    if(!_menu._id) delete _menu._id;
    _menu.isLeaf = !!_menu.fatherId;
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


function getMenuTree(menus, current){
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
        if(menus[i].isLeaf){
            leafMenu.push(menus[i]);
        }else{
            resultMenu.push(menus[i]);
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
