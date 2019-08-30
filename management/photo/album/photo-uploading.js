/***
 * 图册上传
 * @type {{init}}
 */
var SnippetMainPageUploading= function() {
    var serverUrl = BaseUtils.serverAddress;
    var uploadingMainPageSubmitForm = $("#photo_uploading_mainPage_dataSubmit_form");
    var uploadingMainPageSubmitFormId = "#photo_uploading_mainPage_dataSubmit_form";
    var uploadingMainPageWebuploader;
    var businessId = 0;
    var businessType = 0;
    var albumClassify = 1;
    /**
     * 初始化上传组件
     */
    var uploadingMainPageInitWebuploader = function () {
        uploadingMainPageWebuploader = window.webuploaderUtils.init({
            thumbWidth: 220, //缩略图宽度，可省略，默认为110
            thumbHeight: 220, //缩略图高度，可省略，默认为110
            wrapId: 'uploading-uploader', //必填
            selectFileId:'uploading-filePicker',
            continueSelectFileId:'#uploading-filePicker2',
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
     * 初始化 form 数据
     */
    var initFormData = function () {
        var curUrl = location.search; //获取url中"?"符后的字串
        if (curUrl.indexOf("?") != -1) {    //判断是否有参数
            var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
            var businessIdParams = params[0].split("=");
            businessId = businessIdParams[1];
            var businessTypeParams = params[1].split("=");
            businessType = businessTypeParams[1];
            albumClassify = businessTypeParams[1];
            console.log(businessType);
            console.log(albumClassify);
            console.log(businessId);

        }
        $getAjax({
            url:serverUrl + "v1/table/album/" + businessId,
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            uploadingMainPageSubmitForm.setForm(response.data);
        });
    }

    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        $("#albumClassify").val(albumClassify);
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#photo_uploading_mainPage_dataSubmit_form_uploading_seq");
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
        BaseUtils.dictDataSelect("image_site", function (data) {
            var $spotForPhotography = $("#spotForPhotography");
            Object.keys(data).forEach(function(key){
                $spotForPhotography.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $spotForPhotography .selectpicker('refresh');
        });
        // 化妆师 multi select
        BaseUtils.staffDataSelect({"staffPosition" : 3 }, function (data) {
            var $albumDresser = $("#albumDresser");
            Object.keys(data).forEach(function(key){
                console.log(data);
                $albumDresser.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumDresser.select2({
                placeholder: "化妆师",
            });
        });
        // 后期 multi select
        BaseUtils.staffDataSelect({"staffPosition" :  2}, function (data) {
            var $albumAnaphasisAuthor = $("#albumAnaphasisAuthor");
            Object.keys(data).forEach(function(key){
                $albumAnaphasisAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumAnaphasisAuthor.select2({
                placeholder: "后期设计",
            });
        });
        // 摄影师 multi select
        BaseUtils.staffDataSelect({"staffPosition" : 1 }, function (data) {
            var $albumPhotographyAuthor = $("#albumPhotographyAuthor");
            Object.keys(data).forEach(function(key){
                $albumPhotographyAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumPhotographyAuthor.select2({
                placeholder: "摄影师",
            });
        });
        // 风格 multi select
        BaseUtils.dictDataSelect("image_style", function (data) {
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
    var uploadingMainPageFormSubmitHandle = function() {
        $('#photo_uploading_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(uploadingMainPageSubmitFormId);
            uploadingMainPageSubmitForm.validate({
                rules: {
                    albumName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    albumClassification: {
                        required: true
                    },
                    albumStyle: {
                        required: true
                    },
                    albumLabel: {
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    albumPriority: {
                        required: true,
                        range: [0,127]
                    },
                    albumMusicAddress: {
                        required: false,
                        url:true,
                        maxlength: 255
                    },
                    albumPhotographyAuthor: {
                        required: false,
                        maxlength: 40
                    },
                    albumAnaphasisAuthor: {
                        required: false,
                        maxlength: 40
                    },
                    albumDresser: {
                        required: false,
                        maxlength: 40
                    },
                    spotForPhotography: {
                        required: false,
                        maxlength: 10
                    },

                    albumDescription: {
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
            if (!uploadingMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var albumPhotographyAuthorOptions = $("#albumPhotographyAuthor").select2("val");
            $("#album-photography-author").val(albumPhotographyAuthorOptions.join(','));
            var albumDresserOptions = $("#albumDresser").select2("val");
            $("#album-dresser").val(albumDresserOptions.join(','));
            var albumAnaphasisAuthorOptions = $("#albumAnaphasisAuthor").select2("val");
            $("#album-anaphasi-author").val(albumAnaphasisAuthorOptions.join(','));
            BaseUtils.modalBlock("#photo_uploading_mainPage_dataSubmit_form_modal");
            $PostAjax({
                url:serverUrl + "v1/verify/uploading/s",
                data:uploadingMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#photo_uploading_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 关闭 dialog
                    closeOpenLayer();
                } else if (response.status == 409) {

                }
            }, function (data) {
                BaseUtils.modalUnblock("#photo_uploading_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };




    /**
     * 关闭弹出框
     */
    var closeOpenLayer = function () {
        //获取窗口索引
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            uploadingMainPageInitWebuploader();
            // 解决 点击选择图片按钮 无反应 问题
            $('#uploading-filePicker div:eq(1)').attr('style','position: absolute; top: 20px; left: 612.5px; width: 168px; height: 44px; overflow: hidden; bottom: auto; right: auto;');
            initFormData();
            initSelectpicker();
            uploadingMainPageFormSubmitHandle();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageUploading.init();
});