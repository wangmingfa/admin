$(function(){

    var $addForm = $.modalForm({
        title: "新增菜单",
        elements: [
            {
                type: "input",
                options: {
                    type: "hidden",
                    name: "_id"
                }
            },
            {
                type: "input",
                options: {
                    title: "菜单图标",
                    name: "icon"
                }
            },
            {
                type: "input",
                options: {
                    title: "菜单名称",
                    required: true,
                    name: "text"
                }
            },
            {
                type: "input", 
                options: {
                    title: "菜单地址",
                    name: "href"
                }
            },
            {
                type: "select",
                options: {
                    title: "上级菜单",
                    name: "fatherId",
                    options: [{value: "", text: ""}],
                    remote: {
                        url: "/admin/menu/getMenuAll",
                        valueField: "_id",
                        textField: "text",
                        dataFilter: function(result, type){
                            var data = [];
                            JSON.parse(result).forEach(function(menu, index){
                                if(menu.level == 0) data.push(menu);
                            });
                            return JSON.stringify(data);
                        }
                    }
                }
            },
            {
                type: "select",
                options: {
                    title: "是否末级",
                    options: [{value: 1, text: "是"}, {value: 0, text: "否"}],
                    name: "isLeaf"
                }
            },
            {
                type: "select", 
                options: {
                    title: "菜单类型",
                    options: [{value: 0, text: "系统菜单"}, {value: 1, text: "业务菜单"}, {value: 2, text: "两者都是"}],
                    name: "type"
                }
            }
        ],
        submit: {
            url: "/admin/menu/add",
            success: function(result){
                if(result.success) return location.reload();
                alert(result.message);
            },
        },
    });

    //新增
    $("#add").click(function(){
        $addForm.show();
    });

    $("body").on("click", ".toggle-menu", function(e){
        //if($(e.target).hasClass("action")) return;
        var dataTarget = $(this).data("target");
        $(this).toggleClass("icon-plus icon-minus");
        $(dataTarget).toggleClass("hidden");
    });

    //修改
    $("body").on("click", ".edit", function(){
        var id = $(this).data("id");
        $.get("/admin/menu/getMenuById", {id: id}, function(result){
            debugger;
            $addForm.setValue(result).show();
        });
    });

    //删除
    $("body").on("click", ".del", function(){
        var dataId = $(this).data("id");
        if(!dataId) return;
        if(confirm("真的要删除吗？"))
            $.ajax({
                url: "/admin/menu/delete",
                type: "DELETE",
                data: {_id: dataId},
                dataType: "json",
                success: function(result){
                    if(result.success) {
                        return location.reload();
                    }
                    alert("删除失败！");
                }
            });
    });

});