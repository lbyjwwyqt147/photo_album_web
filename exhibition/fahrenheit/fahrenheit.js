/***
 * 写真页面
 * @type {{init: SnippetMainPageFahrenheitIndex.init}}
 */
var SnippetMainPageFahrenheitIndex = function() {
    var serverUrl = BaseUtils.serverAddress;
    var fahrenheitGridPageSize = 20;
    /**
     * 初始化图片数据
     */
    var  initFahrenheitData = function (params) {
        if (params == null) {
            params = {
                'pageSize' : fahrenheitGridPageSize,
                'albumClassification' : 1,
                'albumClassify' : 1
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#leading_fahrenheit_portrait_mainPage_grid', //流加载容器
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
                                var col_div = ImagesView.leadingPortraitListHtmlAppend("leading_fahrenheit_portrait_mainPage_grid", v);
                                humanImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                curPageNumber =  (rowCount + fahrenheitGridPageSize - 1) / fahrenheitGridPageSize;
                            }
                            next(humanImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initFahrenheitPortraitImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };


    var initFahrenheitCarousel = function () {
        $getAjax({
            url:serverUrl + "v1/table/carousel/picture",
            data : {
                businessCode : '3',
                position: '1'
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var $carouselImages = $("#leading_fahrenheit_portrait_carousel_images");
            var col_div = "";
            var datas =  response.data;
            $.each(datas, function(i, v){
                 col_div += '<div><img src="'+v.pictureLocation+'"></div>\n'
            });
            $carouselImages.append(col_div);

            layui.use(['carousel', 'form'], function(){
                var carousel = layui.carousel
                    ,form = layui.form;


                //改变下时间间隔、动画类型、高度
                carousel.render({
                    elem: '#leading_fahrenheit_portrait_carousel',
                    width: '100%', //设置容器宽度
                    height: '800px' // 设置容器高度

                });


                //图片轮播
                /* carousel.render({
                     elem: '#test10'
                     ,width: '778px'
                     ,height: '440px'
                     ,interval: 5000
                 });*/

                //事件
                carousel.on('change(leading_fahrenheit_portrait_carousel)', function(obj){
                    console.log(obj)
                });

                /*var $ = layui.$, active = {
                    set: function(othis){
                        var THIS = 'layui-bg-normal'
                            ,key = othis.data('key')
                            ,options = {};

                        othis.css('background-color', '#5FB878').siblings().removeAttr('style');
                        options[key] = othis.data('value');
                        ins3.reload(options);
                    }
                };

                //监听开关
                form.on('switch(autoplay)', function(){
                    ins3.reload({
                        autoplay: this.checked
                    });
                });

                $('.demoSet').on('keyup', function(){
                    var value = this.value
                        ,options = {};
                    if(!/^\d+$/.test(value)) return;

                    options[this.name] = value;
                    ins3.reload(options);
                });

                //其它示例
                $('.demoTest .layui-btn').on('click', function(){
                    var othis = $(this), type = othis.data('type');
                    active[type] ? active[type].call(this, othis) : '';
                });*/
            });

        });



    };

    /**
     * 预览图片
     * @param dataId
     */
    var lookPreviewFahrenheitPortaitImages = function (dataId) {
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
    var initFahrenheitPortraitImageEventBinding = function () {
        $('.leading_fahrenheit_portrait_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            lookPreviewFahrenheitPortaitImages($(this).attr("value"));
            return false;
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initFahrenheitData();
            initFahrenheitCarousel();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageFahrenheitIndex.init();
});