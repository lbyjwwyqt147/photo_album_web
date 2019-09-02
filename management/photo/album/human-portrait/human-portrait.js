/***
 * 写真集图册
 * @type {{init}}
 */
var SnippetMainPageHumanPortrait = function() {
    var serverUrl = BaseUtils.serverAddress;
    var humanPortraitMainPageTable;
    var humanPortraitMainPageMark = 1;
    var humanPortraitMainPageModuleCode = '1020';
    var humanGridPageSize = 20;

    /**
     * 初始化 功能按钮
     */
    var humanPortraitMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(humanPortraitMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#human-portrait-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#human_portrait_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增图册信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="human_portrait_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);



                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title="修改图册信息" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除图册信息">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="human_portrait_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 删除图册信息" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="human_portrait_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }

            var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 预览图册信息" lay-event="look">\n'
            table_del_btn_html += '<i class="la la-eye"></i>\n';
            table_del_btn_html += '</a>\n';
            tableToolbarHtml.append(table_del_btn_html);
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };



    /**
     *  初始化 dataGrid 组件
     */
    var humanPortraitMainPageInitDataGrid = function (params) {
        if (params == null) {
            params = {
                'pageSize' : humanGridPageSize
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#human_portrait_mainPage_grid', //流加载容器
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
                                var col_div = ImagesView.imagesListHtmlAppend("human_portrait_mainPage_grid", v);
                                humanImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                var numb =  rowCount % humanGridPageSize;
                                if (numb == 0) {
                                    curPageNumber = parseInt(numb);
                                } else {
                                    curPageNumber = parseInt(numb) + 1;
                                }
                            }
                            next(humanImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initHumanPortraitImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };

    /**
     * 刷新grid
     */
    var humanPortraitMainPageRefreshGrid = function () {
        var queryAlbumStyperOptions = $("#album-style").select2("val");
        $("#album-style-query").val(queryAlbumStyperOptions.join(','));
        var  params = $("#human-portrait-page-grid-query-form").serializeJSON();
        params.pageSize = humanGridPageSize;
        humanPortraitMainPageInitDataGrid(params);
    };

    /**
     * 初始化 select 组件
     */
    var humanPortraitMainPageInitSelectpicker = function () {
        $("#albumClassification").selectpicker('refresh');
        $("#album-status-query").selectpicker('refresh');
        var $albumStyle = $("#album-style");
        $albumStyle.select2({
            placeholder: "风格",
            allowClear: true
        });
        // 风格 multi select
        BaseUtils.dictDataSelect("image_style", function (data) {
            Object.keys(data).forEach(function(key){
                $albumStyle.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
        });
    }

    /**
     * 重置查询条件
     */
    var humanPortraitMainPageRefreshGridQueryCondition = function () {
        $("#human-portrait-page-grid-query-form")[0].reset();
        $("#albumClassification").selectpicker('refresh');
        $("#album-status-query").selectpicker('refresh');
        $("#image_style").val(null).trigger("change");
        $("#image_style").select2("val", "");
        $("#image_style").val("");
        $("#image_style .select2-selection__choice").remove();
    };



    /**
     * 删除
     */
    var humanPortraitMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/human_portrait/d";
        var delData = null;
        if (obj != null) {
            delData = {
                'id' : obj.data.id,
                'userId' : obj.data.userId
            }
        } else {
            var idsArray = [];
            var userIdsArray = [];
            // 获取选中的数据对象
            var checkRows = humanPortraitMainPageTable.checkStatus('human_portrait_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                ajaxDelUrl = serverUrl + "v1/verify/human_portrait/d/b";
                delData = {
                    'ids' : JSON.stringify(idsArray),
                    'otherIds': JSON.stringify(userIdsArray)
                }
            }
        }
        if (delData != null) {
            //询问框
            layer.confirm('你确定要删除?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                BaseUtils.pageMsgBlock();
                $encrypDeleteAjax({
                    url:ajaxDelUrl,
                    data: delData,
                    headers: BaseUtils.cloudHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            human_portraitMainPageRefreshGrid();
                        }
                    }
                }, function (data) {

                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  修改状态
     */
    var humanPortraitMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/human_portrait/p";
        var putData = null;
        if (obj != null) {
            var dataVersion = $(obj.elem.outerHTML).attr("dataversion");
            var userId = $(obj.elem.outerHTML).attr("userid");
            var curDataParam = {
                "id" : userId,
                "dataVersion" : dataVersion
            }
            putData = {
                'id' : obj.value,
                'status' : status,
                'putParams' : JSON.stringify(curDataParam),
                'otherIds':userId
            }
        } else {
            var idsArray = [];
            var putParams = [];
            var userIdsArray = [];
            // 获取选中的数据对象
            var checkRows = humanPortraitMainPageTable.checkStatus('human_portrait_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    var curDataParam = {
                        "id" : element.userId,
                        "dataVersion" : element.dataVersion
                    }
                    putParams.push(curDataParam);
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                putData = {
                    'putParams' : JSON.stringify(idsArray),
                    'ids': JSON.stringify(idsArray),
                    'status' : status,
                    'otherIds':JSON.stringify(userIdsArray)
                }
            }
        }
        BaseUtils.checkLoginTimeoutStatus();
        if (putData != null) {
            BaseUtils.pageMsgBlock();
            $encrypPutAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.cloudHeaders()
            }, function (response) {
                  if (response.success) {
                      human_portraitMainPageRefreshGrid();
                  }  else if (response.status == 202) {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(BaseUtils.updateMsg, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                  } else if (response.status == 409) {
                      human_portraitMainPageRefreshGrid();
                  } else {
                     if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                     } else {
                        obj.othis.addClass("layui-form-checked");
                     }
                     if (response.status == 504) {
                         BaseUtils.LoginTimeOutHandler();
                     } else {
                         layer.tips(response.message, obj.othis,  {
                             tips: [4, '#f4516c']
                         });
                     }

                }
            }, function (data) {

            });
        }
    };

    /**
     *  同步数据
     */
    var humanPortraitMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/human_portrait/sync",
            headers: BaseUtils.cloudHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                humanPortraitMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };

    /**
     * 事件绑定
     */
    var initHumanPortraitImageEventBinding = function () {
        // 编辑按钮
        $('.human_portrait_mainPage_grid_edit_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var layerArea = ['100%', '100%'];
            /*if ($(window).width() > 1920 && $(window).height() > 937) {
                layerArea = ['2000px', '950px']
            }*/
            var dataId = $(this).attr("value");
            var photoIframContent = layer.open({
                type: 2,
                title: '写真图册',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: layerArea,
                content: '../../management/photo/album/photo-uploading.html?dataId='+dataId+'&albumClassify=1',
                end : function () {
                    humanPortraitMainPageRefreshGridQueryCondition();
                    humanPortraitMainPageRefreshGrid();
                }
            });
            // 窗口全屏打开
            layer.full(photoIframContent);
            return false;
        });

        // 发布按钮
        $('.human_portrait_mainPage_grid_publish_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            console.log($(this).attr("value"))

            return false;
        });

        // 隐藏按钮
        $('.human_portrait_mainPage_grid_hide_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            console.log($(this).attr("value"))

            return false;
        });

        // 删除按钮
        $('.human_portrait_mainPage_grid_del_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            console.log($(this).attr("value"))

            return false;
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            humanPortraitMainPageInitSelectpicker();
            humanPortraitMainPageInitFunctionButtonGroup();
            humanPortraitMainPageInitDataGrid();
            $('#human_portrait_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageDeleteData(null);
                return false;
            });
            $('#human-portrait-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                humanPortraitMainPageRefreshGrid();
                return false;
            });
            $('#human-portrait-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                humanPortraitMainPageRefreshGridQueryCondition();
                return false;
            });
            $('#human_portrait_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageMark = 1;
               // console.log($(window).height());
               // console.log($(window).width());
                var layerArea = ['100%', '100%'];
                /*if ($(window).width() > 1920 && $(window).height() > 937) {
                    layerArea = ['2000px', '950px']
                }*/
                var photoUploadContent = layer.open({
                    type: 2,
                    title: '写真图册',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: layerArea,
                    content: '../../management/photo/album/photo-uploading.html?dataId=0&albumClassify=1',
                    end : function () {
                        humanPortraitMainPageRefreshGridQueryCondition();
                        humanPortraitMainPageRefreshGrid();
                    }
                });
                // 窗口全屏打开
                layer.full(photoUploadContent);
                return false;
            });


            $('#human_portrait_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageSyncData();
                return false;
            });

            window.onresize = function(){
               // humanPortraitMainPageTable.resize("human_portrait_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHumanPortrait.init();
});