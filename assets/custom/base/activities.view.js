/**
 * 活动展示
 * @type {{}}
 */
var ActivitiesView = {

    /**
     * 渲染图片list
     * @param rowId
     * @param datas
     */
    rendererActivitiesList:function(rowId, datas, frontEnd) {
        // frontEnd == true 表示根据数据进行前端分页
        if (frontEnd == true) {
            //模拟渲染  前端处理数据进行分页
            document.getElementById(rowId).innerHTML = function(){
                var arr = []
                    ,thisData = datas.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                layui.each(thisData, function(i, v){
                    var col_div = ActivitiesView.activitiesListHtmlAppend(rowId, v);
                    arr.push(col_div);
                });
                return arr.join('');
            }();
        } else {
            // 后台分页后返回的数据处理
            document.getElementById(rowId).innerHTML = function(){
                var ActivitiesArray = [];
                layui.each(datas, function(i, v){
                    var col_div = ActivitiesView.activitiesListHtmlAppend(rowId, v);
                    ActivitiesArray.push(col_div);
                });
                return ActivitiesArray.join('');
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
                var col_div = ActivitiesView.activitiesListHtmlAppend(v);
                $row.append(col_div);
            });
        }
    },

    /**
     * 后台图片展示样式设置
     */
    activitiesListHtmlAppend:function (rowId, v) {
        var activities_col_div = '<div class="col-lg-4" value = "'+v.id+'" style="cursor:pointer">\n';
        if (v.activityStatus === 0) {
            activities_col_div += '<div class="kt-portlet kt-callout kt-callout--success">\n';
        } else if (v.activityStatus === 1) {
            activities_col_div += '<div class="kt-portlet kt-callout kt-callout--brand">\n';
        } else {
            activities_col_div += '<div class="kt-portlet kt-callout kt-callout--danger">\n';
        }
        activities_col_div += '<div class="kt-portlet__body" style="padding: 0px;">\n';
        activities_col_div += '<div class="kt-callout__body">\n';
        activities_col_div += ' <img src="'+v.surfacePlot+'" onload="BaseUtils.autoResizeImage(210,143,this)" width="210px" height="143px" class="kt-callout__body_image '+rowId+'_fancybox_btn" value = "'+v.id+'" >\n';
        activities_col_div += ' <div class="kt-callout__content">\n';
        activities_col_div += '<h3 class="kt-callout__title">\n';
        activities_col_div +=  v.activityTheme;
        activities_col_div += '</h3>\n';
        activities_col_div += '<p class="kt-callout__desc">\n';
        activities_col_div +=  '活动价：￥' + v.activityPrice ;
        activities_col_div += '</p>\n';
        activities_col_div += '<p class="kt-callout__desc">\n';
        activities_col_div +=   '联系人：' + v.contactPerson;
        activities_col_div += '</p>\n';
        activities_col_div += '<p class="kt-callout__desc">\n';
        activities_col_div +=   '电话：' + v.contactNumber;
        activities_col_div += '</p>\n';
        activities_col_div += '</div>\n';

        activities_col_div += '<div class="kt-callout__action">\n';
        activities_col_div += '<div class="dropdown">\n';
        activities_col_div += '<button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n';
        activities_col_div += ' 操作\n';
        activities_col_div += '</button>\n';
        activities_col_div += ' <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" x-placement="bottom-start" >\n';
        if (v.activityStatus === 0) {
            activities_col_div += '<a class="dropdown-item '+rowId+'_slash_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'" >\n';
            activities_col_div += ' <i class="la la-eye-slash"></i> 下架\n';
            activities_col_div += ' </a>';
            activities_col_div += '<a class="dropdown-item '+rowId+'_trash_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div += '<i class="la la-trash-o"></i> 删除\n';
            activities_col_div += ' </a>';
        } else if (v.activityStatus === 1) {
            activities_col_div += '<a class="dropdown-item '+rowId+'_edit_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div += ' <i class="la la-pencil-square"></i> 编辑\n';
            activities_col_div += ' </a>';
            activities_col_div += '<a class="dropdown-item '+rowId+'_star_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div +=  '<i class="la la-star"></i> 发布\n';
            activities_col_div += ' </a>';
            activities_col_div += '<a class="dropdown-item '+rowId+'_trash_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div += '<i class="la la-trash-o"></i> 删除\n';
            activities_col_div += ' </a>';
        } else {
            activities_col_div += '<a class="dropdown-item '+rowId+'_edit_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div += ' <i class="la la-pencil-square"></i> 编辑\n';
            activities_col_div += ' </a>';
            activities_col_div += '<a class="dropdown-item '+rowId+'_star_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div +=  '<i class="la la-star"></i> 发布\n';
            activities_col_div += ' </a>';
            activities_col_div += '<a class="dropdown-item '+rowId+'_trash_btn" href="#" value = "'+v.id+'" dataVersion = "'+v.dataVersion+'">\n';
            activities_col_div += '<i class="la la-trash-o"></i> 删除\n';
            activities_col_div += ' </a>';
        }
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        return activities_col_div;
    },


    /**
     * 首页活动展示
     * @param rowId
     * @param v
     * @returns {string}
     */
    leadingActivitiesListHtmlAppend:function (rowId, v) {
        var activities_col_div = '<div class="col-xl-3 '+rowId+'_fancybox_btn" value = "'+v.id+'" style="cursor:pointer;">\n';
        activities_col_div += '<div class="m-widget5">\n';
        activities_col_div += '<div class="m-widget5__item">\n';
        activities_col_div += '<div class="m-widget5__content">\n';
        activities_col_div += '<div class="m-widget5__pic">\n';
        activities_col_div += '<img class="m-widget7__img" src="'+v.surfacePlot+'" alt="">\n';
        activities_col_div += '</div>\n';
        activities_col_div += '<div class="m-widget5__section">\n';
        activities_col_div += '<h4 class="m-widget5__title">\n';
        activities_col_div += v.activityTheme;
        activities_col_div += '</h4>\n';
        activities_col_div += '<span class="m-widget5__desc">\n';
        activities_col_div += '描述';
        activities_col_div += '</span>\n';
        activities_col_div += '<div class="m-widget5__info">\n';
        activities_col_div += '<span class="m-widget5__info-date m--font-info">\n';
        activities_col_div += v.businessHours;
        activities_col_div += '</span>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '<div class="m-widget5__content">\n';
        activities_col_div += '<div class="m-widget5__stats1">\n';
        activities_col_div += '<span class="m-widget5__number">\n';
        activities_col_div += v.activityPrice;
        activities_col_div += '</span>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        activities_col_div += '</div>\n';
        return activities_col_div;
    },





}