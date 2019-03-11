var systemCode = "1001";
var appId = "1550817774159";
var appKey = "0020a9ebfc7b4667b0617488d96c788b";
var credential = "42e853886ec8d3cbdaa062a732551b10";

var Utils = {
    "serverAddress" : "http://127.0.0.1:18081/api/v1/",
    "cloudServerAddress" : "http://101.132.136.225:18080/api/v1/",
    "systemCode" : systemCode,
    "appId" : appId,
    "appKey" : appKey,
    "credential" : credential,
    "saveSuccessMsg" : "保存数据成功!",
    "saveFailMsg" : "保存数据失败!",
    "delFailMsg" : "删除数据失败!",
    "errorMsg" : "网络连接失败!",
    'enable' : '正常',
    'disabled' : '禁用',
    'updateMsg' : "数据更新失败!",
    'syncMsg' : "数据同步失败!",

    headers: {
        "appId":appId,
        "appKey":appKey,
        "credential":credential,
        "systemCode":systemCode
    },

    /**
     * 转换textarea存入数据库的回车换行和空格
     * @param str
     * @returns {*}
     */
    textareaTo:function(str) {
        var reg=new RegExp("\n","g");
        var regSpace=new RegExp(" ","g");

        str = str.replace(reg,"<br>");
        str = str.replace(regSpace,"&nbsp;");

        return str;
    },

    /**
     *  将文本转换为了HTML的格式，'\n'   转换为   <br/>，' ' 转换为 &nbsp;
     * @param str
     * @returns {*}
     */
    toTextarea:function(str) {
        var reg=new RegExp("<br>","g");
        var regSpace=new RegExp("&nbsp;","g");

        str = str.replace(reg,"\n");
        str = str.replace(regSpace," ");

        return str;
    },

    /**
     *  时间戳格式化为日期 返回 2018-08-09 13:48:10
     * @param timestamp yyyy-MM-dd HH:mm:ss
     */
    datatTimeFormat : function(time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },

    /**
     *  时间戳格式化为日期  2018-08-09 13:48
     * @param timestamp yyyy-MM-dd HH:mm
     */
    datatHHmmFormat : function(time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute
    },

    /**
     *  时间戳格式化为日期  2018-08-09
     * @param timestamp yyyy-MM-dd
     */
    datatFormat : function(time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        return year + "-" + month + "-" + date;
    },

    /**
     *  获取状态值
     * @param value
     */
    statusText : function(value) {
        var text = null;
        switch (value) {
            case 0:
                text = "正常";
                break;
            case 1:
                text = "禁用";
                break;
            default:
                text = "正常";
                break;
        }
        return text;
    },

    /**
     * 清空文本框前后空格
     */
    inputTrim : function(){
        $("input").each(function(){
            $(this).val($.trim($(this).val()))
        });
        $("textarea").each(function(){
            $(this).val($.trim($(this).val()))
        });
    },

    /**
     *  清楚form 元素
     * @param formId
     */
    cleanFormData : function(form) {
        form.resetForm();
        var input = form.find("input");
        $.each(input,function(i,v){
            $(v).removeAttr("value");
        });
        var formControlFeedback = $(".form-control-feedback");
        formControlFeedback.parent("div").parent("div").removeClass( "has-danger" );
        formControlFeedback.remove();
    },

    tipsFormat : function (msg) {
        var msgArray = msg.split(".");
        var result = "";
        var arraySize = msgArray.length -1 ;
        $.each(msgArray, function (i,v) {
            result += v
            if (i < arraySize) {
                result +=  "<br/>"
            }
        });
        return result;
    },

    /**
     * modal 中显示加载提示
     * @param modalId
     */
    modalBlock : function (modalId, message) {
        var msg =  message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.block($.trim(modalId) + ' .modal-content', {
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * modal 中关闭加载提示
     * @param modalId
     */
    modalUnblock: function (modalId) {
        mApp.unblock($.trim(modalId)  + ' .modal-content');
    },

    /**
     * 整个页面 中显示加载提示信息
     * @param modalId
     */
    pageMsgBlock : function (message) {
        var msg =  message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * 整个页面 中显示加载提示
     * @param modalId
     */
    htmPageBlock : function () {
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg'
        });
    },

    /**
     * 整个页面中 中关闭加载提示
     * @param modalId
     */
    htmPageUnblock: function () {
        mApp.unblockPage();
    }


}