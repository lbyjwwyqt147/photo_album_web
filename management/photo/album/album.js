//== Class Definition
var SnippetAlbum = function() {
    var serverUrl = Utils.serverAddress;
    var albumTable;
    var albumFormModal = $('#album_form_modal');
    var form = $("#album_form");
    var mark = 1;
    var albumImageUploader;
    var albumImageArray = [];

    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        $.ajax({
            type: "get",
            url:serverUrl + 'album/grid',
            data:{

            },
            async:false,
            dataType: "json",
            headers: Utils.headers,
            success: function(response){
                console.log(response);
                if (response.success) {
                    ImagesView.initImageManagerViewList($("#album_manager_grid"), response.data);
                }
            }
        });

    };

    /**
     * 刷新grid
     */
    var refreshGrid = function () {

    };

    /**
     * 初始化表单提交
     */
    var handleAlbumFormSubmit = function() {

        //保存草稿
        $('#album_la_eye_submit').click(function(e) {
            e.preventDefault();
            $("#albumStatus").val('2');
            albumDataFormSubmit();
            return false;
        });

        // 发布
        $('#album_form_submit').click(function(e) {
            e.preventDefault();
            $("#albumStatus").val('0');
            Utils.inputTrim();
            albumDataFormSubmit();
            return false;
        });


    };

    /**
     * 表单提交
     */
    var albumDataFormSubmit = function () {
        form.validate({
            rules: {
                albumTitle: {
                    required: true,
                    maxlength: 32
                },
                albumStyle: {
                    required: true
                },
                albumClassify: {
                    required: true
                },
                albumLabel: {
                    maxlength: 32
                },
                albumDescription: {
                    maxlength: 255
                },
                albumMusicAddress: {
                    maxlength: 255
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
        if (!form.valid()) {
            return;
        }
        var desText = $("#albumDes").val();
        $("#albumDescription").val(Utils.textareaTo(desText));
        if (albumImageUploader.getFiles().length == 0) {
            $("#image-alert-danger").show();
            return;
        }
        //开始上传文件
        albumImageUploader.upload();
        Utils.modalBlock("#album_form_modal");


        // 所有文件上传结束
        albumImageUploader.on( 'uploadFinished', function() {
            $("#albumName").val($("#albumTitle").val());
            $("#album_pictures").val(JSON.stringify(albumImageArray));
            console.log("所有图片上传结束............")
            $.ajax({
                type: "POST",
                url: serverUrl + "album/save",
                data: form.serializeJSON(),
                dataType: "json",
                headers: Utils.headers,
                success:function (response) {
                    Utils.modalUnblock("#album_form_modal");
                    if (response.success) {
                        // toastr.success(Utils.saveSuccessMsg);
                        refreshGrid();
                        // 关闭 dialog
                        $('#album_form_modal').modal('hide');
                    } else if (response.status == 202) {
                        toastr.error(Utils.saveFailMsg);
                    } else {
                        toastr.error(Utils.tipsFormat(response.message));
                    }
                },
                error:function (response) {
                    Utils.modalUnblock("#album_form_modal");
                    toastr.error(Utils.errorMsg);
                }
            });

        });
    };

    /**
     *  清空表单数据和样式
     */
    var cleanForm = function () {
        var form = $("#album_form");
        form.resetForm();
        var input = form.find("input");
        $.each(input,function(i,v){
            $(v).removeAttr("value");
        });
        $("#image-alert-danger").hide();
        var formControlFeedback = $(".form-control-feedback");
        formControlFeedback.parent("div").parent("div").removeClass( "has-danger" );
        formControlFeedback.remove();
    };

    /**
     * 删除
     */
    var deleteData = function(obj) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.sysCode);
        } else {
            // 获取选中的数据对象
            var checkRows = albumTable.checkStatus('album_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.sysCode);
                });
            }
        }
        if (idsArray.length > 0) {
            //询问框
            layer.confirm('你确定要删除?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                Utils.pageMsgBlock();
                $.ajax({
                    type: "POST",
                    url: serverUrl + "system/authorization/batchDelete",
                    traditional:true,
                    data: {
                        'codes' : JSON.stringify(idsArray),
                        'systemCode' : Utils.systemCode,
                        'credential' : Utils.credential,
                        _method: 'DELETE'
                    },
                    dataType: "json",
                    headers: Utils.headers,
                    success:function (response) {
                        Utils.htmPageUnblock();
                        if (response.success) {
                            if (obj != null) {
                                obj.del();
                            } else {
                                refreshGrid();
                            }
                        } else if (response.status == 202) {
                            toastr.error(Utils.saveFailMsg);
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error:function (response) {
                        Utils.htmPageUnblock();
                        toastr.error(Utils.errorMsg);
                    }
                });
        }, function () {  //按钮【按钮二】的回调
                
            });
        }
    };

    /**
     *  修改状态
     */
    var updateDataStatus = function(obj,status) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = albumTable.checkStatus('album_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.sysCode);
                });
            }
        }
        if (idsArray.length > 0) {
            Utils.pageMsgBlock();
            $.ajax({
                type: "POST",
                url: serverUrl + "system/authorization/status",
                traditional:true,
                data: {
                    'codes' : JSON.stringify(idsArray),
                    'systemCode' : Utils.systemCode,
                    'credential' : Utils.credential,
                    'status' : status,
                    _method: 'PUT'
                },
                dataType: "json",
                headers: Utils.headers,
                success:function (response) {
                    Utils.htmPageUnblock();
                    if (response.success) {
                            refreshGrid();
                    }  else {
                        if (obj != null) {
                            layer.tips(Utils.updateMsg, obj.othis,  {
                                tips: [4, '#f4516c']
                            });
                        } else {
                            toastr.error(Utils.updateMsg);
                        }
                    }
                },
                error:function (response) {
                    Utils.htmPageUnblock();
                    toastr.error(Utils.errorMsg);
                }
            });
        }
    };

    /**
     *  同步数据
     */
    var sync = function() {
        Utils.pageMsgBlock();
        $.ajax({
            type: "POST",
            url: serverUrl + "system/authorization/sync",
            dataType: "json",
            headers: Utils.headers,
            success:function (response) {
                Utils.htmPageUnblock();
                if (response.success) {
                    refreshGrid();
                }  else {
                    toastr.error(Utils.syncMsg);
                }
            },
            error:function (response) {
                Utils.htmPageUnblock();
                toastr.error(Utils.errorMsg);
            }
        });
    };

    /**
     * 初始化上传插件
     */
    var initUploader = function () {
        // 分类下拉框
        $.ajax({
            type: "get",
            url:Utils.coreServerAddress + 'dict/combox',
            data:{
                systemCode : Utils.systemCode,
                dictCode : 'album_classify'
            },
            async:false,
            dataType: "json",
            headers: Utils.headers,
            success: function(res){
                if (null != res) {
                    var html = '';
                    Object.keys(res).forEach(function(key){
                        html += '<option value="' + res[key].id + '" data-tokens="'+ res[key].text+'">' + res[key].text+ '</option>';
                    });
                    $("#albumClassify").html(html);
                    //必须加，刷新select
                    $("#albumClassify").selectpicker('refresh');
                }
            }
        });

        // 风格下拉框
        $.ajax({
            type: "get",
            url:Utils.coreServerAddress + 'dict/combox',
            data:{
                systemCode : Utils.systemCode,
                dictCode : 'image_style'
            },
            async:false,
            dataType: "json",
            headers: Utils.headers,
            success: function(res){
                if (null != res) {
                    var html = '';
                    Object.keys(res).forEach(function(key){
                        html += '<option value="' + res[key].id + '" data-tokens="'+ res[key].text+'">' + res[key].text+ '</option>';
                    });
                    $("#albumStyle").html(html);
                    //必须加，刷新select
                    $("#albumStyle").selectpicker('refresh');
                }
            }
        });


        // 上传控件
        albumImageUploader = WebuploaderUtil({
            uploader : '#uploader',
            filePicker : '#filePicker',
            queueList : '.queueList',
            butnText : "请选择图片",
            extensions : 'jpg,jpeg,png',
            mimeTypes : 'image/*',
            formData : {
                systemCode : Utils.systemCode,
                businessCode: 10,
                uploaderId: 1,
                uploaderName: '张三'
            },
            filePicker2 : "#filePicker2",
            uploadBtn : '.uploadBtn',
            flag : false,
            name: $("#albumName").val()
        });
    }

    var initModalDialog = function() {
        // 在调用 show 方法后触发。
        albumFormModal.on('show.bs.modal', function (event) {
            $("#image-alert-danger").hide();
            albumImageArray = [];
         //   var button = $(event.relatedTarget);// 触发事件的按钮
           // var recipient = button.data('whatever'); // 解析出data-whatever内容
            var recipient = "发布作品";
            if (mark == 2) {
                recipient = "修改作品";
            }
            var modal = $(this);
            modal.find('.modal-title').text(recipient);
            $(".modal-content").css("width", $(window).width());
            //  modal.find('.modal-body input').val(recipient)
            initUploader();


            albumImageUploader.on( 'beforeFileQueued', function( file ,response) {
                $("#image-alert-danger").hide();
                if (!form.valid()) {
                    return false;
                }
            });

            // 文件上传成功
            albumImageUploader.on( 'uploadSuccess', function( file ,response) {
                if (response.status == 200) {
                    albumImageArray.push(response.data[0]);
                    $( '#'+file.id ).find('.file-status').text('已上传');
                } else {
                    $( '#'+file.id ).find('.file-status').text('上传出错');
                }
            });

            // 文件上传失败，显示上传出错
            albumImageUploader.on( 'uploadError', function( file ) {
                console.log(response);

                $( '#'+file.id ).find('.file-status').text('上传出错');
            });

        });

        // 当调用 hide 实例方法时触发。
        albumFormModal.on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            cleanForm();
            $(".modal-backdrop").remove();

            // 移除文件
            var imageFiles = albumImageUploader.getFiles();
            $.each(imageFiles, function (i, v) {
                albumImageUploader.removeFile(v ,true);
            });
            albumImageUploader.reset();
            albumImageUploader.destroy();
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initDataGrid();
            initModalDialog();
            handleAlbumFormSubmit();
            $('#album_delete').click(function(e) {
                e.preventDefault();
                deleteData(null);
                return false;
            });
            $('#album_add').click(function(e) {
                e.preventDefault();
                mark = 1;
                // 显示 dialog
               albumFormModal.modal('show');
                //弹出即全屏

            /*    var index = layer.open({
                    type: 2,
                    content: 'http://layim.layui.com',
                    area: ['320px', '195px'],
                    maxmin: true
                });
                layer.full(index);*/
                return false;
            });

            $('#album_sync').click(function(e) {
                e.preventDefault();
                sync();
                return false;
            });

            window.onresize = function(){
                albumTable.resize("album_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetAlbum.init();
});