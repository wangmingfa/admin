$(function(){
    $("#login-box [name='username']").focus();
    //登陆
    $("#login").click(function(){
        var data = $("#login-box form").serializeJson();
        if(!data) return;
        if(!data.username) return alert("用户名为空！");
        if(!data.password) return alert("密码为空！");

        $.post("/admin/login", {user: data}, function(result){
            if(result.success) return location.href = document.referer || "/admin/menu/list";
            showLoginMsg(result.message);
        });
    });


    //注册
    $("#signUp").click(function(){
        if(!$("#isAgree").prop("checked")) return;
        var data = $("#signup-box form").serializeJson();
        if(!data) return;
        if(!data.username) return alert("用户名为空！");
        if(!data.password) return alert("密码为空！");
        if(!data.repeatPassword) return alert("重复密码为空！");
        if(!data.email) return alert("Email为空！");

        $.post("/admin/signUp", {user: data}, function(result){
            showSignupMsg(result.message);
        });

    });


    function showLoginMsg(message){
        shakeMessage($("#login-msg"), message);
    }

    function showSignupMsg(message){
        shakeMessage($("#signup-msg"), message);
    }

    function shakeMessage($container, message){
        $container.html(message).addClass("shake").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("shake");
        });
    }
});