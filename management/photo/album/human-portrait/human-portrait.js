/***
 * 写真集图册
 * @type {{init}}
 */
var SnippetMainPageHumanPortrait = function() {
    var serverUrl = BaseUtils.serverAddress;
    var humanPortraitMainPageTable;
    var humanPortraitMainPageMark = 1;
    var humanPortraitMainPageModuleCode = '1020';

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
    var humanPortraitMainPageInitDataGrid = function () {

    };

    /**
     * 刷新grid
     */
    var humanPortraitMainPageRefreshGrid = function () {


    };

    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        $("#albumClassification").selectpicker('refresh');
        // 风格 multi select
        BaseUtils.dictDataSelect("image_style", function (data) {
            var $albumStyle = $("#album-style");
            Object.keys(data).forEach(function(key){
                $albumStyle.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumStyle.select2({
                placeholder: "风格",
                allowClear: true
            });
        });

    }



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


    //== Public Functions
    return {
        // public functions
        init: function() {
            humanPortraitMainPageInitFunctionButtonGroup();
            humanPortraitMainPageInitDataGrid();
            initSelectpicker();
            $('#human_portrait_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageDeleteData(null);
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

                // 显示 dialog
               // human_portraitMainPageFormModal.modal('show');
                var perContent = layer.open({
                    type: 2,
                    title: '写真图册',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: layerArea,
                    content: '../../management/photo/album/photo-uploading.html?dataId=1&albumClassify=1'
                });
                // 窗口全屏打开
                layer.full(perContent);
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
                humanPortraitMainPageTable.resize("human_portrait_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHumanPortrait.init();
});