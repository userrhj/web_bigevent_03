$(function () {
    // 1 请求用户信息，更新用户信息和头像 （因为别的文件也要用  所以写在入口函数外面让他变为全局函数）
    // 2 渲染页面  获取用户昵称 判断 有昵称用昵称  没有就用登录名
    // 3 渲染文本信息
    // 4 判断返回信息是否有头像，有头像  就把头像显示 出来  文本隐藏
    // 没有头像就把图片隐藏  把用户名第一个字符转换为大写显示出来
    // 5 点击退出登录 
    getUserInfo();
    $("#btnLogout").on('click', function (e) {
        e.preventDefault();
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem("token");
            location.href = "/login.html";
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            layui.layer.msg(res.message);
            renderAvatar(res.data);
        }
    })
}
function renderAvatar(user) {
    var name = user.nickname || user.username;
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".user-avatar").hide();
    } else {
        var first = name[0].toUpperCase();
        $(".layui-nav-img").hide();
        $(".user-avatar").html(first).show();
    }
}