$(function () {
    // 1 渲染列表
    // 2 渲染筛选的下拉列表
    // 3 为筛选按钮绑定提交事件
    // 4 渲染分页函数
    // 5 删除文章  代理的形式绑定
    var form = layui.form;
    var layer = layui.layer;
    var q = {
        pagenum: 1, //	页码值
        pagesize: 2,//	每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }



    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }



    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }


    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id 不加# 
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            },
        });
    }



    $("tbody").on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    //判断  如果点击删除时 页面中只有一个删除按钮并且页码值大于1  让页码值自减1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) {
                        q.pagenum--;

                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})