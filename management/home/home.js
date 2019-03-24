//== Class Definition
var SnippetMainPageHomeIndex = function() {
    var layer;
    /**
     * 初始化菜单数据项
     */
    var  initHomeMenuData = function () {
        $.ajax({
            type: "GET",
            url: "module.json",
            data: {},
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success:function (response) {
                if (response.success) {
                    BaseUtils.setCookie(BaseUtils.user_access_token, "110");
                    var $menuHtml = $("#home_menu_home_page");



                    // 加密
                    var encrypt1 = new JSEncrypt();
                    encrypt1.setPublicKey(BaseUtils.publicKey);
                    var encryptData1 = encrypt1.encrypt("https://blog.csdn.net/qy20115549/article/details/83105736");
                    console.log(encryptData1)

                    //解密
                    var encrypt = new JSEncrypt();
                    encrypt.setPrivateKey(BaseUtils.privateKey);
                    var encryptData = encrypt.decrypt("W+Pxq/cx633xqbem5VVskMVNYsqQ6PXvcsRWCh90dbmB6pQcJTElKVaMPtvWVyRk1we47/B45OQ244x7uOnDAl6L4czkMBcbnmUCaLRVNoM/QkfvqUuTKxr8srN0kbAB9c+RDBf2QkJybcDkba/PKqSTTeRvy0fLOJ7JqktFle0=");
                    console.log(encryptData);

                    $.each(response.data, function (i, v) {
                        var root = v;
                        // 将页面功能按钮信息存放到本地
                        if (root.functionButtonGroup != null && root.functionButtonGroup.length > 0) {
                             BaseUtils.setCookie(BaseUtils.functionButtonKey + root.moduleCode, root.functionButtonGroup.join(';'));
                        }
                        var liRootHtml = '<li class="m-menu__item m-menu__item--submenu" aria-haspopup="true">\n';
                        if (root.moduleType == 2) {
                            liRootHtml += '<a href="javascript:;" class="m-menu__link m-menu__toggle m-menu__link_css" id="left_menu_' +  root.id + '"   data-type="tabAdd" data-index="' + root.id + '" data-title="' + root.moduleName + '" data-url="' + root.menuOpenUrl + '">\n';
                        } else {
                            liRootHtml += '<a href="javascript:;" class="m-menu__link m-menu__toggle m-menu__link_css">\n';
                        }
                        liRootHtml += '<i class="m-menu__link-icon ' + root.menuIcon + '"></i>\n';
                        liRootHtml += '<span class="m-menu__link-text">' + root.moduleName + '</span>\n';
                        liRootHtml += '<i class="m-menu__ver-arrow la la-angle-right"></i>\n';
                        liRootHtml += '</a>\n';

                        var children = v.children;
                        if (children != null && children.length > 0) {
                            var liChildrenRootHtml = '<div class="m-menu__submenu ">\n';
                            liChildrenRootHtml += '<span class="m-menu__arrow"></span>\n';
                            liChildrenRootHtml += '<ul class="m-menu__subnav">\n';
                            $.each(children, function (ci, cv) {
                                if (cv.functionButtonGroup != null && cv.functionButtonGroup.length > 0) {
                                    BaseUtils.setCookie(BaseUtils.functionButtonKey + cv.moduleCode, cv.functionButtonGroup.join(';'));
                                }
                                    var liChildrenHtml = '<li class="m-menu__item " aria-haspopup="true">\n';
                               if (cv.moduleType == 2) {
                                   liChildrenHtml += '<a href="javascript:;" class="m-menu__link m-menu__link_css" id="left_menu_' +  cv.id + '"  data-type="tabAdd" data-index="' + cv.id + '" data-title="' + cv.moduleName + '" data-url="' + cv.menuOpenUrl + '">\n';
                               }else {
                                   liChildrenHtml += '<a href="javascript:;" class="m-menu__link m-menu__link_css">\n';
                               }
                               liChildrenHtml += '<i class="m-menu__link-icon la ' + cv.menuIcon + '"></i>\n\n';
                               liChildrenHtml += '<span class="m-menu__link-text">'+ cv.moduleName +'</span>\n';
                               liChildrenHtml += '</a>\n';
                               liChildrenHtml += '</li>\n';
                               liChildrenRootHtml += liChildrenHtml;
                            });
                            liChildrenRootHtml += '</ul>\n';
                            liRootHtml += liChildrenRootHtml;
                        }
                        liRootHtml += '</li>\n';
                        $menuHtml.after(liRootHtml);
                    });
                }
                initHomeMenuEvent();
            },
            error:function () {
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 菜单点击事件
     */
    var initHomeMenuEvent = function () {
        // 鼠标移到菜单事件
        $('.m-menu__link_css').mouseout(function(element){
            $(this).children('i').css('color','#686c89');
            $(this).children('span').css('color','#686c89');
        }).mouseover(function(element){
            $(this).children('i').css('color','white');
            $(this).children('span').css('color','white');
        });

        //退出按钮事件
        $(".home_m_card_user_flaticon_logout").click(function (e) {
            e.preventDefault();
            toastr.success("退出系统,即将重新登录!");
            return false;
        });
    };


    /**
     * 初始化 Tab
     */
    var initHomeContentTab = function () {
        layui.use('layer', function() {
            layer = layui.layer;
        });
        layui.use('element', function(){
            var $ = layui.jquery
                ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
            //触发事件
            var active = {
                tabAdd: function(othis){
                    var index = othis.data('index'), title = othis.data('title'), target = othis.data('url');
                    var flag = true;
                    $(".layui-tab-title li").each(function () {
                        var layId = $(this).attr("lay-id");
                        if (index == layId) {
                            setingMenuCheckedCss($("#left_menu_" + index));
                            //切换到指定Tab项
                            element.tabChange('home_menu_content_tab', layId);
                            flag = false;
                        }
                    });
                    //新增一个Tab项
                    if (flag && target != null && target != '') {
                        // 添加选中样式
                        setingMenuCheckedCss(othis);
                        var tabHtmlContent  = "";
                        $.get(""+target+"",function(data) {
                            tabHtmlContent = data;
                            element.tabAdd('home_menu_content_tab', {
                                title:  title,
                                content:  tabHtmlContent,
                                id:  index
                            });
                            element.tabChange('home_menu_content_tab', index);
                        });

                        setTimeout(function(){
                                // 监听tab点击事件
                                $('.layui-tab-title > li').on('click', function(e){
                                    e.preventDefault();
                                    var curLayId = $(this).attr("lay-id");
                                    setingMenuCheckedCss($("#left_menu_" + curLayId))
                                })
                        },3000);
                    }
                }
            };

            // 监听菜单点击事件
            $('.m-menu__link_css').on('click', function(e){
                e.preventDefault();
                var othis = $(this), type = othis.data('type') ;
                active[type] ? active[type].call(this, othis) : '';
            });

            // 监听选项卡删除
            element.on('tabDelete(home_menu_content_tab)', function(data){
                if (data.index == 0) {
                    return false;
                }
            });
        });
    };

    /**
     * 设置 菜单选中样式
     * @param element
     */
    var setingMenuCheckedCss = function (element) {
        var menuClickCss = '<span class="m-menu__item-here"></span>'
        $(".m-menu__item--active").removeClass("m-menu__item--active");
        element.parent('.m-menu__item').addClass("m-menu__item--active");
        $(".m-menu__item-here").remove();
        element.children('i').before(menuClickCss);
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initHomeMenuData();
           initHomeContentTab();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHomeIndex.init();
});