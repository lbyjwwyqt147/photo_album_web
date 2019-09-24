/***
 * 首页
 * @type {{init: SnippetMainPageLeadingEndMainIndex.init}}
 */
var SnippetMainPageLeadingEndMainIndex = function() {
    var serverUrl = BaseUtils.serverAddress;

    /**
     * 初始化菜单数据项
     */
    var  initLeadingEndMainMainMenuData = function () {

    };

    /**
     * 头部菜单点击事件
     */
    var initLeadingEndMainMenuEvent = function (classify) {

    };


    /**
     * 初始化 Tab 内容
     */
    var initLeadingEndMainTabsContent = function (target, divId) {

    };

    /**
     * 初始化首页轮播图
     */
    var initMainCarousel = function () {
        $getAjax({
            url:serverUrl + "v1/table/carousel/picture",
            data : {
                businessCode : '2',
                position: '1',
                status : 0
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var $carouselImages = $("#leading_main_portrait_carousel");
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
     * 初始化主题数据
     */
    var initMainImagesData = function () {
        $getAjax({
            url:serverUrl + "v1/table/album/g",
            data : {
                pageNumber : 1,
                pageSize : 20,
                status : 0,
                display: 0
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var datas =  response.data;
            var $newTheme = $("#new-theme-info-content");
            var col_div = "";
            $.each(datas, function(i, v){
                 col_div += ImagesView.leadingPortraitListHtmlAppend("leading_main_portrait_mainPage_grid", v);
            });
            $newTheme.html(col_div);
            //绑定事件
            initMainPortraitImageEventBinding();
        });
    };

    /**
     * 初始化团队信息
     */
    var initStaffData = function () {
        $getAjax({
            url:serverUrl + "v1/table/staff/g",
            data : {
                staffStatus : 0,
                display: 0,
                pageNumber: 1,
                pageSize : 12
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var $staffContent = $("#staff-info-content");
            var col_div = "";
            var datas =  response.data;
            $.each(datas, function(i, v){
                col_div += '<div class="col-xl-3 ">\n';
                col_div += '<div class="m-portlet m-portlet--bordered-semi m-portlet--full-height  m-portlet--rounded-force border_shadow">\n';
                col_div += '<div class="m-portlet__head m-portlet__head--fit" style="height: 0px;">\n';
                col_div += '<div class="m-portlet__head-caption">\n';
                col_div += ' <div class="m-portlet__head-action">\n';
                col_div += ' </div>\n';
                col_div += ' </div>\n';
                col_div += ' </div>\n';
                col_div += '<div class="m-portlet__body" style="padding-top:0px; padding-left: 1rem; padding-right:  1rem; padding-bottom: 1.8rem;">\n';
                col_div += '<div class="m-widget19">\n';
                col_div += '<div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height-: 286px">\n';
                col_div += '<img src="'+v.staffPortrait+'" alt="">\n';
                col_div += '<div class="m-widget19__shadow"></div>\n';
                col_div += ' </div>\n';
                col_div += '<div class="m-widget19__content">\n';
                col_div += '<div class="m-widget19__header">\n';
                col_div += '<div class="m-widget19__user-img">\n';
                col_div += '<img class="m-widget19__img" src="'+v.staffPortrait+'" alt="">\n';
                col_div += '</div>\n';
                col_div += '<div class="m-widget19__info">\n';
                col_div += '<span class="m-widget19__username">\n';
                col_div += v.staffNickName;
                col_div += '</span>\n';
                col_div += ' <br>\n';
                col_div += '<span class="m-widget19__time">\n';
                col_div += v.staffPositionText;
                col_div += '</span>\n';
                col_div += ' </div>\n';


                col_div += ' </div>\n';
                col_div += '<div class="m-widget19__body">\n';
                col_div += v.staffIntro;
                col_div += ' </div>\n';
                col_div += ' </div>\n';

                col_div += ' </div>\n';
                col_div += ' </div>\n';
                col_div += ' </div>\n';
                col_div += ' </div>\n';
            });
            $staffContent.append(col_div);
        });
    };

    /***
     * 绑定图片点击事件
     */
    var initMainPortraitImageEventBinding = function () {
        $('.leading_main_portrait_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            lookPreviewMainPortaitImages($(this).attr("value"));
            return false;
        });
    };

    /**
     * 预览图片
     * @param dataId
     */
    var lookPreviewMainPortaitImages = function (dataId) {
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

    //== Public Functions
    return {
        // public functions
        init: function() {
            initLeadingEndMainMainMenuData();
            initMainImagesData();
            initStaffData();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageLeadingEndMainIndex.init();
});