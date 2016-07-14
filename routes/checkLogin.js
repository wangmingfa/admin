var Menu = require("../model/menu");
var User = require("../model/user");
var path = [];

module.exports = function(req, res, next){
    //检查是否登陆
    if(!req.session.user) return res.redirect("/admin/login");

    var currentPage = req.originalUrl;// || "/admin/" + req.params.menu + "/" + req.params.submenu;
    console.log("[" + getClientIp(req) + "]正在访问：" + currentPage);

    var user =req.session.user;

    //检查用户状态
    User.getUserById(user._id, function(err, result){
        if(err || result.status != 1) return res.redirect("/admin/logout");

        var menus = [];
        Menu.fetch(function(err, result){
            if(!err) menus = result;
            menus = getMenuTree(menus, currentPage);
            req.data = {
                menus: menus,
                currentPage: currentPage,
                path: path,
                user: req.session.user
            };
            next();
        });

    });

}


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