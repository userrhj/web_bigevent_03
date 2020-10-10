$(function () {
    // 1点击去注册事件 显示注册 隐藏登录
    // 2点击去登录事件 显示登录 隐藏注册
    // 3注册页面 匹配校验输入密码
    // 4 监听注册事件  注册的账号密码发送到服务器
    // 注册成功 跳转到登录页面并重置注册页面表单
    // 5 监听登录事件  登录账号密码发送到服务器
    // 登录成功 记录返回回来的token值保存到本地 跳转页面到主页面

    $("#link_reg").on("click", function () {
        $(".reg-box").show();
        $(".login-box").hide();
    })
    $("#link_login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var str = $(".reg-box [name=password]").val();
            if (value !== str) {
                return "两次密码输入不一致！";
            }
        }
    })
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $("#link_login").click();
                $("#form_reg")[0].reset();
            }
        })
    })
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                localStorage.setItem("token", res.token);
                location.href = "/index.html";
            }
        })
    })
})