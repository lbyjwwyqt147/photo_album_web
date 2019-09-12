//== Class Definition
var SnippetMainPageLeadingEndHomeIndex = function() {
    /**
     * 初始化菜单数据项
     */
    var  initLeadingEndHomeHomeMenuData = function () {
        $.ajax({
            type: "GET",
            url: "module.json",
            data: {},
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success:function (response) {
                if (response.success) {
                    var $menuHtml = $("#leading_portrait_home_tabs");

                    $.each(response.data, function (i, v) {
                        var root = v;
                        var liRootHtml = '';
                        if (root.moduleType == 1) {
                            liRootHtml = '<li class="nav-item m-tabs__item">\n'
                            liRootHtml += '<a class="nav-link m-tabs__link m_tabs_item_click" data-toggle="tab" href="#m_portlet_base_picture_1_2_tab_content" role="tab" value = "'+root.classify+'" content="'+ root.menuOpenUrl +'">\n';
                        } else {
                            liRootHtml += '<li class="nav-item dropdown m-tabs__item">\n';
                            liRootHtml += '<a class="nav-link m-tabs__link dropdown-toggle"  data-toggle="dropdown" href="#"  role="button" aria-haspopup="true" aria-expanded="true">\n';
                        }
                        liRootHtml +=  root.moduleName + '\n';
                        liRootHtml += '</a>\n';

                        var children = v.children;
                        if (children != null && children.length > 0) {
                            var liChildrenRootHtml = '<div class="dropdown-menu">\n';
                            $.each(children, function (ci, cv) {
                                if (ci > 0) {
                                    liChildrenRootHtml += '<div class="dropdown-divider"></div>\n';
                                }
                                liChildrenRootHtml += '<a class="dropdown-item m_tabs_item_click" data-toggle="tab" href="#m_portlet_base_picture_1_3_tab_content">'+cv.moduleName+'</a>\n';
                            });
                            liChildrenRootHtml += '</div>\n';
                            liRootHtml += liChildrenRootHtml;
                        }
                        liRootHtml += '</li>\n';
                        $menuHtml.after(liRootHtml);
                    });
                }
                /**
                 * 头部导航菜单点击事件
                 */
                $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                    console.log(e.target)          // 当前活动的标签页
                    console.log(e.relatedTarget)   // 上一次活动的标签页
                    var curClassify = $(this).attr("value");
                    var curContentUrl = $(this).attr("content");
                    console.log(curClassify);
                    initLeadingEndHomeMenuEvent(curClassify);
                    var curHrefDiv = $(e.target).attr("href");
                    $(curHrefDiv).html(initLeadingEndHomeTabsContent(curContentUrl, curHrefDiv))
                });
            },
            error:function () {
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 头部菜单点击事件
     */
    var initLeadingEndHomeMenuEvent = function (classify) {
        var navSticky = $("#m-nav-sticky");
        navSticky.hide();
        navSticky.html("");
        if (classify == 2) {
            // 获取写真照片 风格数据
            BaseUtils.dictDataSelect("image_style", function (data) {
                Object.keys(data).forEach(function(key){
                var itemHtml = '<li class="m-nav-sticky__item" data-toggle="m-tooltip" title="'+data[key].text+'" data-placement="left">\n';
                    itemHtml += '<a href="https://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes" target="_blank" value="'+data[key].id+'">\n';
                    itemHtml +=  data[key].text + "\n";
                    itemHtml +=  '</a>\n';
                    itemHtml +=  '</li>\n';
                    navSticky.append(itemHtml);
                });
            });
            navSticky.show();
        }
    };


    /**
     * 初始化 Tab 内容
     */
    var initLeadingEndHomeTabsContent = function (target, divId) {
        var tabContent = $(divId);
        if (tabContent.html().html() == "") {
            $.get(""+target+"",function(data) {
                tabContent.html(data);
            });
        }
    };

    /**
     * 设置 菜单选中样式
     * @param element
     */
    var setingMenuCheckedCss = function (element) {

    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initLeadingEndHomeHomeMenuData();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageLeadingEndHomeIndex.init();
});