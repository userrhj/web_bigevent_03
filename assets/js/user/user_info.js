// 1 用户昵称验证
// 2 获取用户信息 渲染form表单
// 3 点击重置按钮 重置form表单
// 4 提交表单事件  渲染页面（渲染用户信息和头像）
$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度在1-6位之间!";
            }
        }
    })
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data);
            }
        })
    }
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})