/***
 * 最新活动
 * @type {{init}}
 */
var SnippetMainPageHoneActivities = function() {
    var serverUrl = BaseUtils.serverAddress;

    /**
     *  初始化 dataGrid 组件
     */
    var honeActivitiesMainPageInitDataGrid = function (params) {
        if (params == null) {
            params = {
                'pageSize' : 20,
                'activityStatus' : 0
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#honeActivities_mainPage_grid', //流加载容器
                done: function(page, next){ //执行下一页的回调
                    params.pageNumber = page;
                    BaseUtils.htmPageBlock();
                    // 追加数据
                    setTimeout(function(){
                        $getAjax({
                            url:serverUrl + "v1/table/activities/g",
                            data : params,
                            headers: BaseUtils.serverHeaders()
                        }, function (response) {
                            BaseUtils.htmPageUnblock();
                            var datas =  response.data;
                            var honeActivitiesImagesArray = [];
                            $.each(datas, function(i, v){
                                var col_div = ActivitiesView.leadingActivitiesListHtmlAppend("honeActivities_mainPage_grid", v);
                                honeActivitiesImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                 curPageNumber =  (rowCount + 20 - 1) / 20;
                            }
                            next(honeActivitiesImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initHoneActivitiesImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };



    /**
     * 事件绑定
     */
    var initHoneActivitiesImageEventBinding = function () {
        $('.honeActivities_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            window.open("../../exhibition/home/index.html?"+$(this).attr("value") + "&10");
            return false;
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            honeActivitiesMainPageInitDataGrid();

            window.onresize = function(){

            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHoneActivities.init();
});