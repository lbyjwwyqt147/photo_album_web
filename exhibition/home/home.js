/***
 * 首页
 * @type {{init: SnippetMainPageLeadingEndMainIndex.init}}
 */
var SnippetMainPageLeadingEndMainIndex = function() {
    /**
     * 初始化菜单数据项
     */
    var  initLeadingEndMainMainMenuData = function () {
        $.ajax({
            type: "GET",
            url: "module.json",
            data: {},
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success:function (response) {
                if (response.success) {
                    var $menuHtml = $("#leading_portrait_Main_tabs");
                    var arrayData = response.data;
                    $.each(arrayData, function (i, v) {
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
                        $menuHtml.before(liRootHtml);
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
                    initLeadingEndMainMenuEvent(curClassify);
                    var curHrefDiv = $(e.target).attr("href");
                    console.log(curHrefDiv);
                    console.log( $(curHrefDiv));
                    $(curHrefDiv).html(initLeadingEndMainTabsContent(curContentUrl, curHrefDiv))
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
    var initLeadingEndMainMenuEvent = function (classify) {
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
    var initLeadingEndMainTabsContent = function (target, divId) {
        var tabContent = $(divId);
        if ($.trim(tabContent.html()) == "") {
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

    };

    /**
     * 百度地图展示
     */
    var baiduMap = function () {
        layui.use('layer', function(){ //独立版的layer无需执行这一句
            var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        });
        $("#office_address_btn").click(function(){
          layer.open({
              type: 2 ,
              title: false,
              closeBtn: 0, //不显示关闭按钮
              area: ['700px', '550px'],
              shade: [0],
              maxmin: false,
              shadeClose: true,
              content: ['baidu.html', 'no']
          });
      });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initLeadingEndMainMainMenuData();
            baiduMap();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageLeadingEndMainIndex.init();
});