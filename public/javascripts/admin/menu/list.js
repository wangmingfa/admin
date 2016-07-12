$(function(){
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
                        alert("删除成功");
                        return location.reload();
                    }
                    alert("删除失败！");
                }
            });
    });

});