var systemCode = "1001";
var appId = "1550817774159";
var appKey = "0020a9ebfc7b4667b0617488d96c788b";
var credential = "42e853886ec8d3cbdaa062a732551b10";

var BaseUtils = {
    "serverAddress": "http://127.0.0.1:18081/api/",
    //"cloudServerAddress": "http://101.132.136.225:18080/api/",
    "cloudServerAddress": "http://127.0.0.1:18080/api/",
    "secretKey":"dO6+g3+08ELBKtx/1/WBYQ==",
    "systemCode": systemCode,
    "appId": appId,
    "appKey": appKey,
    "credential": credential,
    "saveSuccessMsg": "保存数据成功!",
    "saveFailMsg": "保存数据失败!",
    "delFailMsg": "删除数据失败!",
    "errorMsg": "网络连接失败!",
    "networkErrorMsg": "网络连接失败!",
    'enable': '正常',
    'disabled': '禁用',
    'updateMsg': "数据更新失败!",
    'syncMsg': "数据同步失败!",
    'loadingErrorMsg': "加载数据失败!",
    'loginTimeOutMsg':"登录信息已过期,即将重新登录!",
    'functionButtonKey': "photo_album_function_button_",
    'user_access_token': "photo_album_user_access_token_",

    /**
     * 签名信息
     */
    signInfo:{
        "signTime":(new Date()).getTime(),
        "secret":BaseUtils.secretKey
    },
    /**
     * 访问 cloud 需要的headers
     */
    cloudHeaders: {
        "appId": appId,
        "appKey": appKey,
        "credential": credential,
        "systemCode": systemCode,
        "accessToken": '',
        "sign":this.dataEncrypt(JSON.stringify(BaseUtils.signInfo))
    },

    /**
     * 访问自身系统 需要的 headers
     * @returns {{appId: string, appKey: string, credential: string, systemCode: string}}
     */
    serverHeaders: function () {
        var headers = {
            "credential": ''
        };
        return headers;
    },

    /**
     * ztree
     */
    ztree: {
        settingZtreeProperty: function (params) {
            var setting = {
                check: {
                    enable: params.check
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey:"id",
                        pIdKey:"pid",
                        rootPId:0
                    }
                },
                edit: {
                    enable: false
                },
                async: {
                    enable: true, //是否异步加载
                    type: "get",
                    headers:params.headers,
                    url: params.url,
                    autoParam: ["id"]   // 点击节点进行异步加载时默认发送参数
                }
            };
            return setting;
        },

        /**
         * 刷新 指定 节点
         * 在指定的节点下面增加子节点之后调用的方法。
         * @param id
         */
        rereshExpandNode: function (zTree, id) {
            /*获取 zTree 当前被选中的节点数据集合*/
            var nodes = zTree.getNodesByParam("id", id, null);
            var curNode = nodes[0];
            /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
            zTree.reAsyncChildNodes(curNode, "refresh", false);
        },

        /**
         *  刷新整个树
         * @param id
         */
        rereshzTree: function (zTree) {
            zTree.refresh();
        },

        /**
         * 刷新父节点
         * @param id
         */
        rereshParentNode: function (zTree, id) {
            var nowNode = zTree.getNodesByParam("id", id, null);
            var parent = nowNode[0].getParentNode();
            zTree.reAsyncChildNodes(parent, "refresh", false);
        },

        /**
         * 设置 ztree 高亮时的css
         * @param treeId
         * @param treeNode
         * @returns {*}
         */
        getZtreeHighlightFontCss: function (treeId, treeNode) {
            if (typeof(treeNode) == undefined || undefined == treeNode  || 'undefined' == treeNode) {
                return {
                    color: "#333",
                    "font-weight": "normal"
                };
            }
            return (!!treeNode.highlight) ? {color: "#C50000", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
        },

    },

    /**
     * 得到当前页面按钮组
     * @param moduleCode
     */
    getCurrentFunctionButtonGroup:function(moduleCode){
        var item = this.getCookie(BaseUtils.functionButtonKey + moduleCode);
        if (typeof(item) == undefined || undefined == item  || 'undefined' == item) {
            return null;
        }
        return item;
    },

    /**
     * 检测登录是否超时
     * @returns {boolean}
     */
    checkLoginTimeout:function() {
        var item = this.getCookie(BaseUtils.user_access_token);
        if (item == null || typeof(item) == undefined || undefined == item  || 'undefined' == item) {
            return true;
        }
        return false;
    },

    /**
     * 检测登录是否超时
     * @returns {boolean}
     */
    checkLoginTimeoutStatus:function() {
        var timeOut = BaseUtils.checkLoginTimeout();
        if (timeOut) {
            toastr.warning(BaseUtils.loginTimeOutMsg);
            return true;
        }
        return false;
    },

    /**
     * 检查是否登录超时
     * @param status
     */
    checkIsLoginTimeOut:function(status) {
        if (status == 504) {
            toastr.warning(BaseUtils.loginTimeOutMsg);
            return true;
        }
        return false;
    },

    /**
     * 登录超时
     * @param status
     */
    LoginTimeOutHandler:function() {
        toastr.warning(BaseUtils.loginTimeOutMsg);
    },



    /**
     * 设置 cookie 信息
     * @param key
     * @param value
     * @param day
     */
    setCookie: function(key, value, day) {
        if (day == null) {
            day = 3
        }
        this.delCookie(key);
        $.cookie(key, value, {expires: day,path: '/', secure: false});
    },

    /**
     * 获取 cookie 信息
     * @param key
     * @returns {*}
     */
    getCookie: function(key) {
        return $.cookie(key);
    },

    /**
     * 删除 cookie 信息
     * @param key
     */
    delCookie: function (key) {
        $.cookie(key, null,{ expires: -1,path: '/'});
    },


    /**
     * 保存  LocalStorage 数据
     * @param key
     * @param value
     * @param hour
     */
    setLocalStorage: function (key, value, hour) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        if (hour == null) {
            hour = 72
        }
        // 一小时的秒数
        var exp = 60 * 60 * 1000;
        var valueDate = {
            name: key,
            value: value,
            expires: exp * hour,
            startTime: curtime//记录何时将值存入缓存，毫秒级
        }
        this.deleteLocalStorage(key);
        window.localStorage.setItem(key, JSON.stringify(valueDate));
    },

    /**
     * 获取 LocalStorage 数据
     * @param key
     * @param hour 小时
     * @returns {*}
     */
    getLocalStorage: function (key) {
        var item = window.localStorage.getItem(key);
        //先将拿到的试着进行json转为对象的形式
        try {
            item = JSON.parse(item);
        } catch (error) {
            //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        //如果有startTime的值，说明设置了失效时间
        if (item.startTime) {
            var date = new Date().getTime();
            //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
            if (date - item.startTime > item.expires) {
                //缓存过期，清除缓存，返回false
                window.localStorage.removeItem(key);
                return false;
            } else {
                //缓存未过期，返回值
                return item.value;
            }
        } else {
            //如果没有设置失效时间，直接返回值
            return item;
        }
    },

    /**
     * 删除 LocalStorage 数据
     * @param key
     * @returns {*}
     */
    deleteLocalStorage: function (key) {
        window.localStorage.removeItem(key);
    },
    /**
     * 清空 LocalStorage 数据
     * @param key
     * @returns {*}
     */
    clearLocalStorage: function () {
        window.localStorage.clear();
    },

    /**
     * 转换textarea存入数据库的回车换行和空格
     * @param str
     * @returns {*}
     */
    textareaTo: function (str) {
        var reg = new RegExp("\n", "g");
        var regSpace = new RegExp(" ", "g");

        str = str.replace(reg, "<br>");
        str = str.replace(regSpace, "&nbsp;");

        return str;
    },

    /**
     *  将文本转换为了HTML的格式，'\n'   转换为   <br/>，' ' 转换为 &nbsp;
     * @param str
     * @returns {*}
     */
    toTextarea: function (str) {
        var reg = new RegExp("<br>", "g");
        var regSpace = new RegExp("&nbsp;", "g");

        str = str.replace(reg, "\n");
        str = str.replace(regSpace, " ");

        return str;
    },

    /**
     *  时间戳格式化为日期 返回 2018-08-09 13:48:10
     *  @param time
     * @param timestamp yyyy-MM-dd HH:mm:ss
     */
    datatTimeFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },

    /**
     *  时间戳格式化为日期  2018-08-09 13:48
     *  @param time
     * @param timestamp yyyy-MM-dd HH:mm
     */
    datatHHmmFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute
    },

    /**
     *  时间戳格式化为日期  2018-08-09
     *  @param time
     * @param timestamp yyyy-MM-dd
     */
    datatFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        return year + "-" + month + "-" + date;
    },

    zero_fill_hex: function (num, digits) {
        var s = num.toString(16);
        while (s.length < digits) {
            s = "0" + s;
        }
        return s;
    },


    /**
     * rgb 值转为 #ffff
     * @param rgb
     * @returns {*}
     */
    rgb2hex: function (rgb) {
        if (rgb.charAt(0) == '#') {
            return rgb;
        }
        var ds = rgb.split(/\D+/);
        var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
        return "#" + BaseUtils.zero_fill_hex(decimal, 6);
    },

    /**
     *  获取状态值
     * @param value
     */
    statusText: function (value) {
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
     * @param form
     */
    formInputTrim: function (form) {
        $(form + " input").each(function () {
            var trimValue = $.trim($(this).val());
            var curValue = trimValue.replace(/\+/g,' ');
            $(this).val($.trim(curValue));
        });
        $(form + " textarea").each(function () {
            var trimValue = $.trim($(this).val());
            var curValue = trimValue.replace(/\+/g,' ');
            $(this).val($.trim(curValue));
        });
    },

    /**
     *  清除 form 数据
     * @param formId
     */
    cleanFormData: function (form) {
        form.resetForm();
        var input = form.find("input");
        $.each(input, function (i, v) {
            $(v).removeAttr("value");
        });
        var textarea = form.find("textarea");
        $.each(textarea, function (i, v) {
            $(v).removeAttr("value");
        });
        var formControlFeedback = $(".error.form-control-feedback");
        formControlFeedback.parent("div").parent("div").removeClass("has-danger");
        formControlFeedback.remove();
    },

    /**
     *  将 form 全部设置为 readonly
     * @param formId
     */
    readonlyForm: function (form) {
        $(form + " input").each(function () {
            $(this).addClass("m-input--solid");
            $(this).attr("readonly", "readonly");
        });
        $(form + " textarea").each(function () {
            $(this).addClass("m-input--solid");
            $(this).attr("readonly", "readonly");
        });
    },

    /**
     *  将 form 全部设置为 readonly
     * @param formId
     */
    cleanFormReadonly: function (form) {
        $(form + " input").each(function () {
            $(this).removeClass("m-input--solid");
            $(this).removeAttr("readonly", "readonly");
        });
        $(form + " textarea").each(function () {
            $(this).removeClass("m-input--solid");
            $(this).removeAttr("readonly", "readonly");
        });
    },

    tipsFormat: function (msg) {
        var msgArray = msg.split(".");
        var result = "";
        var arraySize = msgArray.length - 1;
        $.each(msgArray, function (i, v) {
            result += v
            if (i < arraySize) {
                result += "<br/>"
            }
        });
        return result;
    },

    /**
     * modal 中显示加载提示
     * @param modalId
     */
    modalBlock: function (modalId, message) {
        var msg = message == null || message == "" ? "数据处理中....." : $.trim(message);
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
        mApp.unblock($.trim(modalId) + ' .modal-content');
    },

    /**
     * 整个页面 中显示加载提示信息
     * @param modalId
     */
    pageMsgBlock: function (message) {
        var msg = message == null || message == "" ? "数据处理中....." : $.trim(message);
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
    htmPageBlock: function () {
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
    },

    /**
     * AES 加密
     * @param data
     */
    dataEncrypt: function (data) {
        var key = CryptoJS.enc.Utf8.parse(BaseUtils.secretKey);
        var srcData = CryptoJS.enc.Utf8.parse(data);
        var encrypted = CryptoJS.AES.encrypt(srcData, key, {
            mode : CryptoJS.mode.ECB,
            padding : CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    /**
     * AES 解密
     * @param data
     */
    dataDecrypt: function (data) {
        var key = CryptoJS.enc.Utf8.parse(BaseUtils.secretKey);
        var decrypt = CryptoJS.AES.decrypt(data, key, {
            mode : CryptoJS.mode.ECB,
            padding : CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
    

};