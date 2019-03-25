var BaseAjaxUtils = {

}

jQuery(document).ready(function() {
    /**
     * 默认post 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $postAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            data: _data,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                successCallback(data);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

    /**
     * 加密数据 以json 字符串传到服务器
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encryptPostAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        var encryptData = BaseUtils.dataEncrypt(_data);
        $.ajax({
            url: _url,
            type: "POST",
            dataType: "text",
            cache: false,
            async: true,
            contentType: "application/json",
            data: encryptData,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout:30000,
            success:function(data){
                var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                successCallback(JSON.parse(decryptData));
            },
            error:function(data){
                errorCallback(data);
            }
        });
    };


    /**
     * 默认delete 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $deleteAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'DELETE';
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            traditional:true,
            data: _data,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                successCallback(data);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };


    /**
     * 数据加密方式 delete 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypDeleteAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'DELETE';
        var encryptData = BaseUtils.dataEncrypt(_data);
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            traditional:true,
            data: encryptData,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                successCallback(JSON.parse(decryptData));
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

    /**
     * 默认put 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $putAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'PUT';
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            traditional:true,
            data: _data,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                successCallback(data);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };


    /**
     * 数据加密方式 put 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypPutAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'PUT';
        var encryptData = BaseUtils.dataEncrypt(_data);
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            traditional:true,
            data: encryptData,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                successCallback(JSON.parse(decryptData));
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

    /**
     * 默认get 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $getAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "GET",
            data: _data,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                successCallback(data);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };


    /**
     * 数据加密方式 get 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypGetAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        var encryptData = BaseUtils.dataEncrypt(_data);
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: encryptData,
            headers: BaseUtils.cloudHeaders,
            crossDomain: true,
            timeout: 30000,
            success: function (data) {
                var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                successCallback(JSON.parse(decryptData));
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

});
