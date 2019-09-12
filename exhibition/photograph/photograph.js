//== Class Definition
var SnippetMainPagePhotographIndex = function() {
    var serverUrl = BaseUtils.serverAddress;
    var humanGridPageSize = 20;
    /**
     * 初始化图片数据
     */
    var  initPhotographData = function (params) {
        if (params == null) {
            params = {
                'pageSize' : humanGridPageSize
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#leading_portrait_mainPage_grid', //流加载容器
                done: function(page, next){ //执行下一页的回调
                    params.pageNumber = page;
                    BaseUtils.htmPageBlock();
                    // 追加数据
                    setTimeout(function(){
                        $getAjax({
                            url:serverUrl + "v1/table/album/g",
                            data : params,
                            headers: BaseUtils.serverHeaders()
                        }, function (response) {
                            BaseUtils.htmPageUnblock();
                            var datas =  response.data;
                            var humanImagesArray = [];
                            $.each(datas, function(i, v){
                                var col_div = ImagesView.leadingPortraitListHtmlAppend("leading_portrait_mainPage_grid", v);
                                humanImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                curPageNumber =  (rowCount + humanGridPageSize - 1) / humanGridPageSize;
                            }
                            next(humanImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initPortraitImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };

    /**
     * 查看图片信息
     * @param dataId
     */
    var lookPortaitImages = function (dataId) {
        $getAjax({
            url: serverUrl + 'v1/table/album/picture',
            data:{id: dataId},
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var datas = response.data;
            if (datas != null ) {
                var fancyboxItems = [];
                $.each(datas, function(index,item){
                    var curImageItem = {
                        src  : item.pictureLocation,
                        opts : {
                            caption : '',
                            thumb   : item.pictureLocation
                        }
                    };
                    fancyboxItems.push(curImageItem);
                });
                $.fancybox.open(fancyboxItems, {
                    loop : true,
                    thumbs : {
                        autoStart : true,    //打开时显示缩略图  值为： true    false
                        axis: 'y',          // 缩略图展示  垂直(y)或水平(x)滚动
                        width  : '230px',
                        height : '230px'
                    }
                });
            }
        });
    };

    /***
     * 绑定事件
     */
    var initPortraitImageEventBinding = function () {

    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initPhotographData();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPagePhotographIndex.init();
});