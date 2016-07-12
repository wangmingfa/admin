$(function(){
    $("#login-box [name='username']").focus();
    //登陆
    $("#login").click(function(){
        var data = $("#login-box form").serializeJson();
        if(!data) return;
        if(!data.username) return alert("用户名为空！");
        if(!data.password) return alert("密码为空！");

        $.post("/admin/login", {user: data}, function(result){
            if(result.success) return location.reload();
            alert(result.msg);
        });
    });
});