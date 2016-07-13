$(function(){

    var $addForm = $.modalForm({
        title: "新增菜单",
        elements: [
            {
                type: "input",
                options: {
                    title: "菜单图标"
                }
            },
            {
                type: "input",
                options: {
                    title: "菜单名称",
                    required: true,
                }
            },
            {
                type: "input", 
                options: {
                    title: "菜单地址"
                }
            },
            {
                type: "select",
                options: {
                    title: "上级菜单"
                }
            },
            {
                type: "select",
                options: {
                    title: "是否末级",
                    options: [{value:1, text: "是"}, {value:0, text: "否"}]
                }
            },
            {
                type: "select", 
                options: {
                    title: "菜单类型",
                    options: [{value:0, text: "系统菜单"}, {value:1, text: "业务菜单"}, {value:2, text: "两者都是"}]
                }
            }
        ]
    });

    //新增
    $("#add").click(function(){
        $addForm.show();
    });

    $("body").on("click", ".toggle-menu", function(e){
        if($(e.target).hasClass("action")) return;
        var dataTarget = $(this).data("target");
        $(this).find(".toggle-menu-i").toggleClass("icon-plus icon-minus");
        $(dataTarget).toggleClass("hidden");
    });

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