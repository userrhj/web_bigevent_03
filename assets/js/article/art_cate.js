$(function () {
    // 1 渲染页面
    // 2 点击添加分类  弹出弹框
    // 3 添加文章分类  通过代理的形式，为 form - add 表单绑定 submit 事件
    // 4 点击编辑文章分类 弹出框
    // 5 编辑文章分类  代理绑定submit事件
    // 6 删除文章分类  代理绑定submit事件
    var form = layui.form;
    var layer = layui.layer;
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
            }

        })
    }

    var indexAdd = null;
    $("#btnAdd").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#dialog-add").html(),
            area: ['500px', '260px'],
        });
    })
    $('body').on('submit', "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    $("tbody").on('click', ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-edit").html(),
        });
        //根据id获取信息  渲染编辑页面
        var Id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexEdit);

            }
        })
    })
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr("data-id");
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    initArtCateList();
                }
            })
            layer.close(index);
        });

    })
})