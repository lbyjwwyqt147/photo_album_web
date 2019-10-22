//== Class Definition
var SnippetMainPageLeadingEndHomeIndex = function() {
    var businessId = 0;
    var businessType = 0;
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
                    var arrayData = response.data;
                    $.each(arrayData, function (i, v) {
                        var root = v;
                        var liRootHtml = '';
                        if (root.moduleType == 1) {
                            liRootHtml = '<li class="nav-item m-tabs__item">\n'
                            liRootHtml += '<a class="nav-link m-tabs__link m_tabs_item_click" data-toggle="tab" href="'+root.href+'" id="'+root.eleId+'" role="tab" value = "'+root.classify+'" content="'+ root.menuOpenUrl +'">\n';
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
                                liChildrenRootHtml += '<a class="dropdown-item m_tabs_item_click" data-toggle="tab"  href="'+cv.href+'">'+cv.moduleName+'</a>\n';
                            });
                            liChildrenRootHtml += '</div>\n';
                            liRootHtml += liChildrenRootHtml;
                        }
                        liRootHtml += '</li>\n';
                        $menuHtml.before(liRootHtml);
                    });
                    if (businessType == 10) {
                        $(".m_tabs_item_click").removeClass("active");
                        $("#activities_li").click();
                        businessType = 0;
                    }
                }
                /**
                 * 头部导航菜单点击事件
                 */
                $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                   // console.log(e.target)          // 当前活动的标签页
                  //  console.log(e.relatedTarget)   // 上一次活动的标签页
                    var curClassify = $(this).attr("value");
                    var curContentUrl = $(this).attr("content");
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
        if (classify == 2 || classify == 4 ) {
            // 获取写真照片 风格数据
            BaseUtils.dictDataSelect("image_style", function (data) {
                var rootItemHtml = '<li class="m-nav-sticky__item" data-toggle="m-tooltip" title="全部风格" data-placement="left">\n';
                rootItemHtml += '<a href="#" class="type-sticky__item" value="">\n';
                rootItemHtml +=   "全部\n";
                 rootItemHtml +=  '</a>\n';
                 rootItemHtml +=  '</li>\n';
                navSticky.append(rootItemHtml);
                Object.keys(data).forEach(function(key){
                var itemHtml = '<li class="m-nav-sticky__item" data-toggle="m-tooltip" title="'+data[key].text+'" data-placement="left">\n';
                    itemHtml += '<a href="#" class="type-sticky__item" value="'+data[key].id+'">\n';
                    itemHtml +=  data[key].text + "\n";
                    itemHtml +=  '</a>\n';
                    itemHtml +=  '</li>\n';
                    navSticky.append(itemHtml);
                });
            });
            navSticky.show();
            $('.type-sticky__item').click(function(e) {
                e.preventDefault();
                $(".m-nav-sticky__item").removeClass("active");
                var $this = $(this);
                $this.parent().addClass("active")
                var $albumStyle = $this.attr("value");
                var params = {
                    'pageSize' : 20,
                    'albumClassify' : 1,
                    'albumStatus' : 0,
                    'albumStyle': $albumStyle
                };
                if (classify == 2) {
                    // 写真馆
                    params.albumClassification = 1;
                    SnippetMainPageFahrenheitIndex.initRefreshDataGrid(params);
                } else if (classify == 4) {
                    // 客片馆
                    params.albumClassification = 2;
                    SnippetMainPageLoveshowIndex.initLoveshowRefreshDataGrid(params);
                }
                return false;
            });
        }
    };


    /**
     * 初始化 Tab 内容
     */
    var initLeadingEndHomeTabsContent = function (target, divId) {
        var tabContent = $(divId);
        if (businessType == 10) {
            tabContent.html("");
        };
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
              area: ['700px', '553px'],
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
            var curUrl = location.search; //获取url中"?"符后的字串
            if (curUrl.indexOf("?") != -1) {    //判断是否有参数
                var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
                var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
                businessId = params[0];
                businessType = params[1];
            }
            initLeadingEndHomeHomeMenuData();
            baiduMap();
            if (businessType == 10) {
                initLeadingEndHomeTabsContent("../../exhibition/activities/details.html?"+businessId, "#m_portlet_base_picture_1_6_tab_content");
            } else {
                initLeadingEndHomeTabsContent("home.html", "#m_portlet_base_picture_1_1_tab_content");
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageLeadingEndHomeIndex.init();
});