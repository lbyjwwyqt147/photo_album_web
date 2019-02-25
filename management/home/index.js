//== Class Definition
var SnippetIndex = function() {

    /**
     * 菜单点击事件
     */
    var initMenuEvent = function () {

    };

    /**
     * 初始化 Tab
     */
    var initTab = function () {
        layui.use('element', function(){
            var $ = layui.jquery
                ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

            //触发事件
            var active = {
                tabAdd: function(othis){
                    var index = othis.data('index'), title = othis.data('title'), target = othis.data('url'),tabId=othis.data('id');
                    var flag = true;
                    $(".layui-tab-title li").each(function () {
                        var layId = $(this).attr("lay-id");
                        if (index == layId) {
                            //切换到指定Tab项
                            element.tabChange('menu_tab', layId);
                            flag = false;
                        }
                    });
                    //新增一个Tab项
                    if (flag) {
                        var tabHtmlContent  = "";
                        $.get(""+target+"",function(data) {
                            tabHtmlContent = data;
                            element.tabAdd('menu_tab', {
                                title:  title,
                                content:  tabHtmlContent,
                                id:  index
                            });
                            element.tabChange('menu_tab', index);
                        });

                    }

                }
            };

            $('.m-menu__link').on('click', function(){
                var othis = $(this), type = othis.data('type') ;
                active[type] ? active[type].call(this, othis) : '';
            });

        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initMenuEvent();
           initTab();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetIndex.init();
});