$(function(){
    $("body").on("click", ".toggle-menu", function(){
        var dataTarget = $(this).data("target");
        $(this).find(".toggle-menu-i").toggleClass("icon-plus icon-minus");
        $(dataTarget).toggleClass("hidden");
    });
});