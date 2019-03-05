/**
 * 图片展示
 * @type {{}}
 */
var ImagesView = {

    initImageManagerViewList:function ($row,data) {

        if (data.length > 0){
            $.each(data,function (i,v) {
                var col_div = '<div class="col-xl-4">\n';
                col_div += '<div class="m-portlet m-portlet--bordered-semi m-portlet--full-height  m-portlet--rounded-force">\n';
                col_div += '<div class="m-portlet__head m-portlet__head--fit" style="padding: 0 1rem;height:auto;">\n';
                col_div += '<div class="m-portlet__head-caption">\n';
                col_div += '<div class="m-portlet__head-action">\n';
                if (v.status === 0) {
                    col_div += '<span class="m-badge m-badge--success m-badge--wide">已发布</span>\n';
                } else if (v.status === 1) {
                    col_div += '<span class="m-badge m-badge--danger m-badge--wide">隐藏</span>\n';
                } else {
                    col_div += '<span class="m-badge m-badge--warning m-badge--wide">草稿</span>\n';
                }
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '<div class="m-portlet__head-tools">\n';
                col_div += '<ul class="m-portlet__nav">\n';
                col_div += '<li class="m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push" m-dropdown-toggle="hover" aria-expanded="true">\n';
                col_div += '<a href="#" class="m-portlet__nav-link m-portlet__nav-link--icon m-portlet__nav-link--icon-xl">\n';
                col_div += '<i class="la la-ellipsis-h m--font-light"></i>\n';
                col_div += '</a>\n';
                col_div += '<div class="m-dropdown__wrapper" style="z-index: 101;">\n';
                col_div += '<span class="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust" style="left: auto; right: 21.5px;"></span>\n';
                col_div += '<div class="m-dropdown__inner">\n';
                col_div += '<div class="m-dropdown__body">\n';
                col_div += '<div class="m-dropdown__content">\n';
                col_div += '<ul class="m-nav">\n';
                col_div += '<li class="m-nav__item">\n';
                col_div += '<a href="" class="m-nav__link">\n';
                col_div += '<i class="m-nav__link-icon flaticon-edit"></i>\n';
                col_div += '<span class="m-nav__link-text">编辑</span>\n';
                col_div += '</a>\n';
                col_div += '</li>\n';
                col_div += '<li class="m-nav__item">\n';
                col_div += '<a href="" class="m-nav__link">\n';
                col_div += '<i class="m-nav__link-icon flaticon-interface-7"></i>\n';
                col_div += '<span class="m-nav__link-text">发布</span>\n';
                col_div += '</a>\n';
                col_div += '</li>\n';
                col_div += '<li class="m-nav__item">\n';
                col_div += '<a href="" class="m-nav__link">\n';
                col_div += '<i class="m-nav__link-icon flaticon-close"></i>\n';
                col_div += '<span class="m-nav__link-text">隐藏</span>\n';
                col_div += '</a>\n';
                col_div += '</li>\n';
                col_div += '<li class="m-nav__item">\n';
                col_div += '<a href="" class="m-nav__link">\n';
                col_div += '<i class="m-nav__link-icon flaticon-delete-2"></i>\n';
                col_div += '<span class="m-nav__link-text">删除</span>\n';
                col_div += '</a>\n';
                col_div += '</li>\n';
                col_div += '</ul>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</li>\n';
                col_div += '</ul>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '<div class="m-portlet__body">\n';
                col_div += '<div class="m-widget19">\n';
                col_div += '<div class="m-widget19__pic m-portlet-fit--top m-portlet-fit--sides" style="min-height-: 300px">\n';
                col_div += '<img src="'+v.pictureLocation+'" alt="">\n';
                col_div += '<h3 class="m-widget19__title m--font-light" style="padding-left: 2.5rem;padding-bottom: 1.3rem;">\n';
                col_div += v.title;
                col_div += '</h3>\n';
                col_div += '<h3 class="m-widget19__title m--font-light" style="padding-left: 21.5rem;padding-bottom: 1.3rem;">\n';
                col_div += v.total;
                col_div += '</h3>\n';
                col_div += '<div class="m-widget19__shadow"></div>\n';
                col_div += '</div>\n';
                col_div += '<div class="m-widget19__content">\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';
                col_div += '</div>\n';

                $row.ap
            });
        }

    }




}