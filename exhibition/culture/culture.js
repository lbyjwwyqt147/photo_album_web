/***
 * 企业文化页面
 * @type {{init: SnippetMainPageCultureIndex.init}}
 */
var SnippetMainPageCultureIndex = function() {
    var serverUrl = BaseUtils.serverAddress;

    /**
     * 初始化公司数据
     */
    var  initCultureData = function () {
        $getAjax({
            url:serverUrl + "v1/table/cmpany/details",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            if (response.data != null) {
                var dataObj = response.data[0];
                $("#company_introduction").html(dataObj.companyProfile);
            }
        });
    };


    var initCultureCarousel = function () {
        $getAjax({
            url:serverUrl + "v1/table/carousel/picture",
            data : {
                businessCode : '6',
                position: '1',
                status : 0
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var $carouselImages = $("#leading_culture_carousel_images");
            var col_div = "";
            var datas =  response.data;
            $.each(datas, function(i, v){
                col_div += '<div><img src="'+v.pictureLocation+'"></div>\n'
            });
            $carouselImages.append(col_div);

            layui.use(['carousel'], function(){
                var carousel = layui.carousel;

                //改变下时间间隔、动画类型、高度
                carousel.render({
                    elem: '#leading_culture_carousel',
                    width: '100%', //设置容器宽度
                    height: '800px' // 设置容器高度
                });

            });

        });



    };




    //== Public Functions
    return {
        // public functions
        init: function() {
            initCultureData();
          //  initCultureCarousel();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageCultureIndex.init();
});