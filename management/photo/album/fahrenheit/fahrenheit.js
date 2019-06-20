/***
 * 写真集图册
 * @type {{init}}
 */
var SnippetMainPageFahrenheit = function() {
    var serverUrl = BaseUtils.serverAddress;
    var fahrenheitMainPageTable;
    var fahrenheitMainPageFormModal = $('#fahrenheit_mainPage_dataSubmit_form_modal');
    var fahrenheitMainPageSubmitForm = $("#fahrenheit_mainPage_dataSubmit_form");
    var fahrenheitMainPageSubmitFormId = "#fahrenheit_mainPage_dataSubmit_form";
    var fahrenheitMainPageMark = 1;
    var fahrenheitMainPageModuleCode = '1020';
    var fahrenheitMainPageWebuploader= '1020';

    /**
     * 初始化 功能按钮
     */
    var fahrenheitMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(fahrenheitMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#fahrenheit-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#fahrenheit_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增图册信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="fahrenheit_mainPage_add_btn">\n';
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
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="Fahrenheit_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 删除员工信息" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="Fahrenheit_mainPage_sync_btn">\n';
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
        $('[data-toggle="tooltip"]').tooltip();
    };

    /**
     * 初始化上传组件
     */
    var fahrenheitMainPageInitWebuploader = function () {
        fahrenheitMainPageWebuploader = window.webuploaderUtils.init({
            thumbWidth: 220, //缩略图宽度，可省略，默认为110
            thumbHeight: 220, //缩略图高度，可省略，默认为110
            wrapId: 'fahrenheit-uploader', //必填
            selectFileId:'fahrenheit-filePicker',
            continueSelectFileId:'#fahrenheit-filePicker2',
            selectFileMultiple : true, // 多选
            fileNumLimit: 30, // 总图片数量
            fileSizeLimit: 30*1024*1024*25,  // 总文件大小
            fileSingleSizeLimit: 1024*1024*25, // 单个文件大小
            //处理客户端新文件上传时，需要调用后台处理的地址, 必填
            uploadUrl: './fileupload.php',
            //处理客户端原有文件更新时的后台处理地址，必填
            updateUrl: './fileupdate.php',
            //当客户端原有文件删除时的后台处理地址，必填
            removeUrl: './filedel.php',
            //初始化客户端上传文件，从后台获取文件的地址, 可选，当此参数为空时，默认已上传的文件为空
            initUrl: './fileinit.php',
        });
    };

    /**
     *  初始化 dataGrid 组件
     */
    var fahrenheitMainPageInitDataGrid = function () {

    };

    /**
     * 刷新grid
     */
    var fahrenheitMainPageRefreshGrid = function () {


    };

    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#fahrenheit_mainPage_dataSubmit_form_fahrenheit_seq");
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
        var laydate
        layui.use('laydate', function() {
            laydate = layui.laydate;
            //拍摄日期控件
            laydate.render({
                elem: '#shootingsDate'
            });
        });
        // 拍摄地点 select
        BaseUtils.dictDataSelect("spotForPhotography", function (data) {
            var $spotForPhotography = $("#spotForPhotography");
            Object.keys(data).forEach(function(key){
                $spotForPhotography.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $spotForPhotography .selectpicker('refresh');
        });
        // 化妆师 multi select
        BaseUtils.dictDataSelect("albumDresser", function (data) {
            var $albumDresser = $("#albumDresser");
            Object.keys(data).forEach(function(key){
                $albumDresser.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumDresser .selectpicker('refresh');
        });
        // 后期 multi select
        BaseUtils.dictDataSelect("albumAnaphasisAuthor", function (data) {
            var $albumAnaphasisAuthor = $("#albumAnaphasisAuthor");
            Object.keys(data).forEach(function(key){
                $albumAnaphasisAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumAnaphasisAuthor .selectpicker('refresh');
        });
        // 摄影师 multi select
        BaseUtils.dictDataSelect("albumPhotographyAuthor", function (data) {
            var $albumPhotographyAuthor = $("#albumPhotographyAuthor");
            Object.keys(data).forEach(function(key){
                $albumPhotographyAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumPhotographyAuthor .selectpicker('refresh');
        });
        // 风格 multi select
        BaseUtils.dictDataSelect("albumStyle", function (data) {
            var $albumStyle = $("#albumStyle");
            Object.keys(data).forEach(function(key){
                $albumStyle.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumStyle .selectpicker('refresh');
        });

    }

    /**
     * 初始化表单提交
     */
    var fahrenheitMainPageFormSubmitHandle = function() {
        $('#fahrenheit_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(fahrenheitMainPageSubmitFormId);
            fahrenheitMainPageSubmitForm.validate({
                rules: {
                    FahrenheitNumber: {
                        required: true,
                        alnum:true,
                        maxlength: 20
                    },
                    FahrenheitName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    FahrenheitNickName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    mobilePhone: {
                        required: true,
                        isMobile:true
                    },
                    FahrenheitIdentiyCard: {
                        required: false,
                        idCardNo:true
                    },
                    FahrenheitEmail: {
                        required: true,
                        email:true,
                        maxlength: 60
                    },
                    entryDate: {
                        required: true
                    },
                    FahrenheitQq: {
                        required: false,
                        isQq:true,
                        maxlength: 13
                    },
                    FahrenheitWechat: {
                        required: false,
                        alnum:true,
                        maxlength: 20
                    },
                    FahrenheitWeiBo: {
                        required: false,
                        url:true,
                        maxlength: 200
                    },
                    street: {
                        chcharacterNum:true,
                        maxlength: 50
                    },
                    FahrenheitEquipment: {
                        maxlength: 200
                    },
                    FahrenheitIntro: {
                        maxlength: 350
                    }
                },
                errorElement: "div",                  // 验证失败时在元素后增加em标签，用来放错误提示
                errorPlacement: function (error, element) {   // 验证失败调用的函数
                    error.addClass( "form-control-feedback" );   // 提示信息增加样式
                    element.parent("div").parent("div").addClass( "has-danger" );
                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter(element.parent("label"));  // 待验证的元素如果是checkbox，错误提示放到label中
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").addClass( "has-danger" );
                    $(element).addClass("has-danger");     // 验证失败时给元素增加样式
                },
                unhighlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").removeClass( "has-danger" );
                    $(element).removeClass("has-danger");  // 验证成功时去掉元素的样式

                },

                //display error alert on form submit
                invalidHandler: function(event, validator) {

                },
            });
            if (!fahrenheitMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#fahrenheit_mainPage_dataSubmit_form_modal");
            $encryptPostAjax({
                url:serverUrl + "v1/verify/Fahrenheit/s",
                data:fahrenheitMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.cloudHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#fahrenheit_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 关闭 dialog
                    fahrenheitMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    fahrenheitMainPageRefreshGrid();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#Fahrenheit_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var fahrenheitMainPageCleanForm = function () {
        window.webuploaderUtils.reset(fahrenheitMainPageWebuploader);
        BaseUtils.cleanFormData(fahrenheitMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var fahrenheitMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/Fahrenheit/d";
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
            var checkRows = fahrenheitMainPageTable.checkStatus('Fahrenheit_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                ajaxDelUrl = serverUrl + "v1/verify/Fahrenheit/d/b";
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
                            fahrenheitMainPageRefreshGrid();
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
    var fahrenheitMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/Fahrenheit/p";
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
            var checkRows = fahrenheitMainPageTable.checkStatus('fahrenheit_mainPage_grid');
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
                      fahrenheitMainPageRefreshGrid();
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
                      fahrenheitMainPageRefreshGrid();
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
    var fahrenheitMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/Fahrenheit/sync",
            headers: BaseUtils.cloudHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                fahrenheitMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var fahrenheitMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#fahrenheit_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "新增图册";
            if (fahrenheitMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(fahrenheitMainPageSubmitFormId);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            }
            if (fahrenheitMainPageMark == 2) {
                modalDialogTitle = "修改图册";
                BaseUtils.cleanFormReadonly(fahrenheitMainPageSubmitFormId);
                $("#fahrenheit_mainPage_dataSubmit_form_fahrenheit_number").addClass("m-input--solid");
                $("#fahrenheit_mainPage_dataSubmit_form_fahrenheit_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#fahrenheit_mainPage_dataSubmit_form_submit").show();
            $("#fahrenheit_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#fahrenheit_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (fahrenheitMainPageMark == 3) {
                modalDialogTitle = "图册信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#Fahrenheit_mainPage_dataSubmit_form_submit").hide();
            }
            // 解决 点击选择图片按钮 无反应 问题
            $('#fahrenheit-filePicker div:eq(1)').attr('style','position: absolute; top: 20px; left: 612.5px; width: 168px; height: 44px; overflow: hidden; bottom: auto; right: auto;');
            window.webuploaderUtils.reset(fahrenheitMainPageWebuploader);
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
        });

        // 当调用 hide 实例方法时触发。
        $('#fahrenheit_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            fahrenheitMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#fahrenheit_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            fahrenheitMainPageInitWebuploader();
            fahrenheitMainPageInitFunctionButtonGroup();
            fahrenheitMainPageInitDataGrid();
            fahrenheitMainPageInitModalDialog();
            fahrenheitMainPageFormSubmitHandle();
            initSelectpicker();
            $('#fahrenheit_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                fahrenheitMainPageDeleteData(null);
                return false;
            });
            $('#fahrenheit_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                fahrenheitMainPageMark = 1;
                // 显示 dialog
               // fahrenheitMainPageFormModal.modal('show');
                var perContent = layer.open({
                    type: 2,
                    title: '图册',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['100%', '100%'],
                    content: '../../management/photo/album/fahrenheit/uploading.html?dataId=1&albumClassify=1'
                });
                layer.full(perContent);
                return false;
            });


            $('#fahrenheit_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                fahrenheitMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                fahrenheitMainPageTable.resize("fahrenheit_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageFahrenheit.init();
});