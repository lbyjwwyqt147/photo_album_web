/***
 * 活动详情
 * @type {{init: SnippetMainPageAcctivitiesDetails.init}}
 */
var SnippetMainPageAcctivitiesDetails = function() {
    var serverUrl = BaseUtils.serverAddress;
    /**
     * 初始化图片数据
     */
    var  initAcctivitiesDetailsData = function () {
        var businessId = 0;
        var curUrl = location.search; //获取url中"?"符后的字串
        if (curUrl.indexOf("?") != -1) {    //判断是否有参数
            var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
            businessId = params[0];
        }
        $getAjax({
            url:serverUrl + "v1/table/activities/picture/" + businessId,
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            var datas =  response.data;
            if (datas != null) {
                $("#activities_plot").attr("src", datas.surfacePlot);
                $("#activities_plot").attr("onload", "BaseUtils.autoResizeImage(525,300,this)");
                $("#activities_plot").show();
                if (datas.maturity === 1) {
                    $(".details-image-title").show();
                }
                $("#activities_title").html(datas.activityTheme);
                $("#activities_price").html(datas.activityPrice);
                $("#activities_date").html(datas.startDateTime + " 至 " + datas.endDateTime);
                $("#activities_linkman").html(datas.contactPerson);
                $("#activities_linkman_tel").html(datas.contactNumber);
                $("#activities_business_hours").html(datas.businessHours);
                $("#activities_presentation").html(datas.activityDescription);
                var picturesData = datas.activityPictureData;
                var col_div = "";
                $.each(picturesData, function(i, v){
                    col_div += ImagesView.leadingActivityPortraitListHtmlAppend("activities_imags_show", v);
                });
                $("#activities_imags_show").html(col_div);
            }
        });
    };

    /**
     * 百度地图展示
     */
    var acctivitiesDetailsBaiduMap = function () {
        layui.use('layer', function(){ //独立版的layer无需执行这一句
            var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        });
        $("#activities_details_office_address_btn").click(function(){
            layer.open({
                type: 2 ,
                title: false,
                closeBtn: 0, //不显示关闭按钮
                area: ['700px', '551px'],
                shade: [0],
                maxmin: false,
                shadeClose: true,
                content: ['../../exhibition/home/baidu.html', 'no']
            });
        });
    };

    /**
     *  轮播图
     */
    var initAcctivitiesDetailsCarousel = function () {
        $getAjax({
            url:serverUrl + "v1/table/activities/g",
            data : {
                'pageSize' : 10,
                'activityStatus' : 0,
                'maturity': 0
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var $carouselImages = $("#leading_activities_details_carousel_images");
            var col_div = "";
            var datas =  response.data;
            $.each(datas, function(i, v){
                col_div += '<div style="cursor:pointer"><img class="activities_details_carousel_btn" src="'+v.surfacePlot+'" value="'+v.id+'"></div>\n'
            });
            $carouselImages.append(col_div);

            layui.use(['carousel'], function(){
                var carousel = layui.carousel;

                //改变下时间间隔、动画类型、高度
                carousel.render({
                    elem: '#leading_activities_details_carousel',
                    width: '100%', //设置容器宽度
                    height: '600px' // 设置容器高度
                });
            });

            $('.activities_details_carousel_btn').click(function(e) {
                e.preventDefault();
                window.open("../../exhibition/home/index.html?"+$(this).attr("value") + "&10");
                return false;
            });

        });



    };

    /**
     * 预览图片
     * @param dataId
     */
    var lookPreviewAcctivitiesDetailsPortaitImages = function (dataId) {
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
    var initAcctivitiesDetailsPortraitImageEventBinding = function () {
        $('.leading_AcctivitiesDetails_portrait_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            lookPreviewAcctivitiesDetailsPortaitImages($(this).attr("value"));
            return false;
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initAcctivitiesDetailsData();
            initAcctivitiesDetailsCarousel();
            acctivitiesDetailsBaiduMap();

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageAcctivitiesDetails.init();
});