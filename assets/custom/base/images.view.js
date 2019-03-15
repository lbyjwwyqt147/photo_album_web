/**
 * 图片展示
 * @type {{}}
 */
var ImagesView = {

    /**
     * 渲染图片list
     * @param rowId
     * @param datas
     */
    rendererImagesList:function(rowId, datas, frontEnd) {
        // frontEnd == true 表示根据数据进行前端分页
        if (frontEnd == true) {
            //模拟渲染  前端处理数据进行分页
            document.getElementById(rowId).innerHTML = function(){
                var arr = []
                    ,thisData = datas.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                layui.each(thisData, function(i, v){
                    var col_div = ImagesView.imagesListHtmlAppend(v);
                    arr.push(col_div);
                });
                return arr.join('');
            }();
        } else {
            // 后台分页后返回的数据处理
            document.getElementById(rowId).innerHTML = function(){
                var imagesArray = [];
                layui.each(datas, function(i, v){
                    var col_div = ImagesView.imagesListHtmlAppend(v);
                    imagesArray.push(col_div);
                });
                return imagesArray.join('');
            }();
        }

    },

    /**
     * 初始化图片list
     * @param $row
     * @param data
     */
    initImageManagerViewList:function ($row,data) {

        if (data.length > 0){
            $.each(data,function (i,v) {
                var col_div = ImagesView.imagesListHtmlAppend(v);
                $row.append(col_div);
            });
        }
    },

    /**
     * 图片展示样式设置
     */
    imagesListHtmlAppend:function (v) {
        var images_col_div = '<div class="col-xl-3">\n';
        images_col_div += '<div class="m-portlet m-portlet--bordered-semi m-portlet--full-height  m-portlet--rounded-force">\n';
        images_col_div += '<div class="m-portlet__head m-portlet__head--fit" style="padding: 0 1rem;height:auto;">\n';
        images_col_div += '<div class="m-portlet__head-caption">\n';
        images_col_div += '<div class="m-portlet__head-action">\n';
        if (v.status === 0) {
            images_col_div += '<span class="m-badge m-badge--success m-badge--wide">已发布</span>\n';
        } else if (v.status === 1) {
            images_col_div += '<span class="m-badge m-badge--danger m-badge--wide">隐藏</span>\n';
        } else {
            images_col_div += '<span class="m-badge m-badge--warning m-badge--wide">草稿</span>\n';
        }
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '<div class="m-portlet__head-tools">\n';
        images_col_div += '<ul class="m-portlet__nav">\n';
        images_col_div += '<li class="m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" m-dropdown-toggle="hover" aria-expanded="true">\n';
        images_col_div += '<a href="#" class="m-portlet__nav-link m-portlet__nav-link--icon m-portlet__nav-link--icon-xl">\n';
        images_col_div += '<i class="la la-ellipsis-h m--font-light"></i>\n';
        images_col_div += '</a>\n';
        images_col_div += '<div class="m-dropdown__wrapper" style="z-index: 101;">\n';
        images_col_div += '<span class="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust" style="left: auto; right: 21.5px;"></span>\n';
        images_col_div += '<div class="m-dropdown__inner">\n';
        images_col_div += '<div class="m-dropdown__body">\n';
        images_col_div += '<div class="m-dropdown__content">\n';
        images_col_div += '<ul class="m-nav">\n';
        images_col_div += '<li class="m-nav__item">\n';
        images_col_div += '<a href="" class="m-nav__link">\n';
        images_col_div += '<i class="m-nav__link-icon flaticon-edit"></i>\n';
        images_col_div += '<span class="m-nav__link-text">编辑</span>\n';
        images_col_div += '</a>\n';
        images_col_div += '</li>\n';
        images_col_div += '<li class="m-nav__item">\n';
        images_col_div += '<a href="" class="m-nav__link">\n';
        images_col_div += '<i class="m-nav__link-icon flaticon-interface-7"></i>\n';
        images_col_div += '<span class="m-nav__link-text">发布</span>\n';
        images_col_div += '</a>\n';
        images_col_div += '</li>\n';
        images_col_div += '<li class="m-nav__item">\n';
        images_col_div += '<a href="" class="m-nav__link">\n';
        images_col_div += '<i class="m-nav__link-icon flaticon-close"></i>\n';
        images_col_div += '<span class="m-nav__link-text">隐藏</span>\n';
        images_col_div += '</a>\n';
        images_col_div += '</li>\n';
        images_col_div += '<li class="m-nav__item">\n';
        images_col_div += '<a href="" class="m-nav__link">\n';
        images_col_div += '<i class="m-nav__link-icon flaticon-delete-2"></i>\n';
        images_col_div += '<span class="m-nav__link-text">删除</span>\n';
        images_col_div += '</a>\n';
        images_col_div += '</li>\n';
        images_col_div += '</ul>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</li>\n';
        images_col_div += '</ul>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '<div class="m-portlet__body">\n';
        images_col_div += '<div class="m-widget19">\n';
        images_col_div += ' <div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height: 200px">\n';
        images_col_div += '<img src="'+v.cover+'" alt="">\n';
        images_col_div += '<h3 class="m-widget19__title m--font-light" style="padding-left: 2.5rem;padding-bottom: 1.3rem;">\n';
        images_col_div += v.title;
        images_col_div += '\n</h3>\n';
        images_col_div += '<h3 class="m-widget19__title m--font-light" style="padding-left: 21.5rem;padding-bottom: 1.3rem;">\n';
        images_col_div += v.total;
        images_col_div += '\n</h3>\n';
        images_col_div += '<div class="m-widget19__shadow"></div>\n';
        images_col_div += '</div>\n';
        images_col_div += '<div class="m-widget19__content">\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        images_col_div += '</div>\n';
        return images_col_div;
    },




}