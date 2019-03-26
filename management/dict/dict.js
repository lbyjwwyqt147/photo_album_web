/***
 * 数据字典
 * @type {{init}}
 */
var SnippetMainPageDict = function() {
    var serverUrl = BaseUtils.cloudServerAddress;
    var dictMainPageTable;
    var dictMainPageFormModal = $('#dict_mainPage_dataSubmit_form_modal');
    var dictMainPageSubmitForm = $("#dict_mainPage_dataSubmit_form");
    var dictMainPageSubmitFormId = "#dict_mainPage_dataSubmit_form";
    var dictMainPageMark = 1;
    var dictMainPagePid = 0;
    var dictMainPageParentName = "";
    var dictMainPageZtreeNodeList = [];
    var dictMainPageModuleCode = '1010';

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAdictMainPageSyncDataSuccess: callback.onAdictMainPageSyncDataSuccess}}
     */
    var dictMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/dict/all/z?systemCode=" + BaseUtils.systemCode + "&credential=" +  BaseUtils.credential,
        "headers":BaseUtils.cloudHeaders
    });
    dictMainPageZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    dictMainPageZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            dictMainPagePid = treeNode.id;
            dictMainPageParentName = treeNode.name;
            dictMainPageRefreshGrid();
        },
        onAsyncSuccess:function(event, treeId, msg){ //异步加载完成后执行

        },
        onAsyncError:function(){ //异步加载出现异常执行

        },
        beforeAsync:function () { //异步加载之前执行
           if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
        }
    };


    /**
     * 初始化ztree 组件
     */
    var dictMainPageInitTree = function() {
        $.fn.zTree.init($("#dict_mainPage_tree"), dictMainPageZtreeSetting);
    };

    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function dictMainPageRereshExpandNode(id) {
        if (id == 0) {
            dictMainPageRereshTree();
            return;
        }
       var zTreeObj = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
       var nodes = zTreeObj.getNodesByParam("id", id, null);
       if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
           dictMainPageRereshTreeNode(id);
       }
       BaseUtils.ztree.rereshExpandNode(zTreeObj, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function dictMainPageRereshTree(){
        var zTreeObj = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
        zTreeObj.destroy();
        dictMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function dictMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/dict/all/z",
            data: {
                id:id,
                systemCode:BaseUtils.systemCode,
                credential:BaseUtils.credential
            },
            headers: BaseUtils.cloudHeaders
        }, function (data) {
            var treeObj = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
            //获取指定父节点
            var parentZNode = treeObj.getNodeByParam("id", dictMainPagePid, null);
            treeObj.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     *  搜索节点
     */
    function dictMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#dict-mainPage-nodeName-search").val());
       dictMainPageZtreeUpdateNodes(dictMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
        var keyType = "name";
       dictMainPageZtreeNodeList = zTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        dictMainPageZtreeUpdateNodes(dictMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param dictMainPageZtreeNodeList
     * @param highlight
     */
    function dictMainPageZtreeUpdateNodes(dictMainPageZtreeNodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
        for (var i = 0, l = dictMainPageZtreeNodeList.length; i < l; i++) {
            dictMainPageZtreeNodeList[i].highlight = highlight;
            //定位到节点并展开
            zTree.expandNode(dictMainPageZtreeNodeList[i]);
            zTree.updateNode(dictMainPageZtreeNodeList[i]);
        }
    };

    /**
     * 设置 ztree 高亮时的css
     * @param treeId
     * @param treeNode
     * @returns {*}
     */
     function zTreeHighlightFontCss(treeId, treeNode) {
       return BaseUtils.ztree.getZtreeHighlightFontCss(treeId, treeNode)
    };

    /**
     * 设置 tree 最大高度样式
     */
    function dictMainPageZtreeMaxHeight() {
         var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").outerHeight();
        $("#dict_mainPage_tree").css("max-height", layGridHeight);
    }

    /**
     * 初始化 功能按钮
     */
    var dictMainPageInitFunctionButtonGroup = function () {
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#dict_mainPage_dataSubmit_form_dict_seq");
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(dictMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#dict-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#dict_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增数据字典">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="dict_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title="修改数据字典" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除数据字典">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="dict_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 删除数据字典" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="dict_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }
        }
    };

    /**
     *  初始化 dataGrid 组件
     */
    var dictMainPageInitDataGrid = function () {
        layui.use('table', function(){
            // dictMainPageTable = layui.table;
            var layuiForm = layui.form;
            dictMainPageTable =  $initEncrypDataGrid({
                elem: '#dict_mainPage_grid',
                url: serverUrl + 'v1/table/dict/g',
                method:"get",
                where: {   //传递额外参数
                    'pid' : dictMainPagePid,
                    'credential': BaseUtils.credential,
                    'systemCode': BaseUtils.systemCode
                },
                headers: BaseUtils.cloudHeaders,
                title: '数据字典列表',
                initSort: {
                    field: 'priority', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'dictCode', title:'字典代码'},
                    {field:'dictName', title:'字段名称'},
                    {field:'priority', title:'优先级'},
                    {field:'fullParentCode', title:'完整父级代码'},
                    {field:'description', title:'描述'},
                    {field:'status', title:'状态', align: 'center', unresize:true,
                        templet : function (row) {
                            var value = row.status;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#dict_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                dictMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(dictMainPageModuleCode);
                var status_table_index = $.inArray("3", curFunctionButtonGroup);
                if (status_table_index != -1) {
                    $(".layui-unselect.layui-form-checkbox").show();
                } else {
                    $(".layui-unselect.layui-form-checkbox").hide();
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                BaseUtils.checkIsLoginTimeOut(res.status);
            });
            /*dictMainPageTable.render({
                elem: '#dict_mainPage_grid',
                url: serverUrl + 'v1/table/dict/grid',
                where: {   //传递额外参数
                    'pid' : dictMainPagePid,
                    'credential': BaseUtils.credential,
                    'systemCode': BaseUtils.systemCode
                },
                title: '数据字典列表',
                text: {
                    none: '暂无相关数据'   // 空数据时的异常提示
                },
                cellMinWidth: 50, //全局定义常规单元格的最小宽度
                height: 'full-152', //高度最大化减去差值
                even: true,
                initSort: {
                    field: 'priority', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'dictCode', title:'字典代码'},
                    {field:'dictName', title:'字段名称'},
                    {field:'priority', title:'优先级'},
                    {field:'fullParentCode', title:'完整父级代码'},
                    {field:'description', title:'描述'},
                    {field:'status', title:'状态', align: 'center', unresize:true,
                        templet : function (row) {
                            var value = row.orgStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#dict_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                page: {
                    theme: 'cadetblue',
                    layout:[ 'prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh'],
                    curr: 1 ,//设定初始在第 1 页
                    groups: 10, //只显示 10 个连续页码
                    first: true, //显示首页
                    last: true //显示尾页
                },
                limit: 10,
                limits: [10,20,30,50],

                request: {
                    pageName: 'pageNumber', //页码的参数名称，默认：page
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                },
                headers: BaseUtils.cloudHeaders,
                parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                    return {
                        "code": res.status, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res.data //解析数据列表
                    };
                },
                done: function (res, curr, count) {
                    dictMainPageZtreeMaxHeight();
                    var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(dictMainPageModuleCode);
                    var status_table_index = $.inArray("3", curFunctionButtonGroup);
                    if (status_table_index != -1) {
                        $(".layui-unselect.layui-form-checkbox").show();
                    } else {
                        $(".layui-unselect.layui-form-checkbox").hide();
                    }
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    BaseUtils.checkIsLoginTimeOut(res.status);

                }
            });*/

            //监听行工具事件
            dictMainPageTable.on('tool(dict_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    dictMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    dictMainPageSubmitForm.setForm(obj.data);
                    dictMainPageMark = 2;
                    // 显示 dialog
                    dictMainPageFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                // 选中返回 true  没有选中返回false
                var isChecked = obj.elem.checked;
                var lockChecked = $(obj.elem).attr("checked");
                if (lockChecked == undefined || lockChecked == 'undefined' || typeof (lockChecked) == undefined) {
                    statusValue = 1;
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    if (statusValue == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    return;
                }
                dictMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            dictMainPageTable.on('rowDouble(dict_mainPage_grid)', function(obj){
                dictMainPageMark = 3;
                dictMainPageSubmitForm.setForm(obj.data);
                BaseUtils.readonlyForm(dictMainPageSubmitFormId);
                dictMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var dictMainPageRefreshGrid = function () {
        dictMainPageTable.reload('dict_mainPage_grid',{
            where: {   //传递额外参数
                'pid' : dictMainPagePid,
                'credential': BaseUtils.credential,
                'systemCode': BaseUtils.systemCode
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var dictMainPageRefreshGridAndTree = function () {
        dictMainPageRefreshGrid();
        //刷新树
        dictMainPageRereshExpandNode(dictMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var dictMainPageFormSubmitHandle = function() {
        $('#dict_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(dictMainPageSubmitFormId);
            if ($("#dict_mainPage_dataSubmit_form_parent_name").val() == "") {
                dictMainPagePid = 0;
                dictMainPageParentName = "";
            }
            dictMainPageSubmitForm.validate({
                rules: {
                    dictCode: {
                        required: true,
                        alnumCode:true,
                        maxlength: 32
                    },
                    dictName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    priority: {
                        range: [0,999]
                    },
                    description: {
                        htmlLabel:true,
                        illegitmacy:true,
                        maxlength: 50
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
            if (!dictMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#dict_mainPage_dataSubmit_form_modal");
            $("#dict_mainPage_dataSubmit_form input[name='systemCode']").val(BaseUtils.systemCode);
            $("#dict_mainPage_dataSubmit_form input[name='credential']").val(BaseUtils.credential);
            $("#dict_mainPage_dataSubmit_form input[name='pid']").val(dictMainPagePid);

            var formData = JSON.stringify(dictMainPageSubmitForm.serializeJSON());
            $encryptPostAjax({
                url:serverUrl + "v1/dict/s",
                data:formData,
                headers: BaseUtils.cloudHeaders
            }, function (response) {
                BaseUtils.modalUnblock("#dict_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    dictMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    dictMainPageFormModal.modal('hide');
                }
            }, function (data) {
                BaseUtils.modalUnblock("#dict_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var dictMainPageCleanForm = function () {
        BaseUtils.cleanFormData(dictMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var dictMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = dictMainPageTable.checkStatus('dict_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
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
                BaseUtils.pageMsgBlock();
                $encrypDeleteAjax({
                    url:serverUrl + "v1/dict/batch/d",
                    data: {
                        'ids' : JSON.stringify(idsArray),
                        'credential': BaseUtils.credential,
                        'systemCode': BaseUtils.systemCode,
                        _method: 'DELETE'
                    },
                    headers: BaseUtils.cloudHeaders
                }, function (response) {
                    BaseUtils.htmPageUnblock();
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                            dictMainPageRereshExpandNode(dictMainPagePid);
                        } else {
                            dictMainPageRefreshGridAndTree();
                        }
                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  修改状态
     */
    var dictMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = dictMainPageTable.checkStatus('dict_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        BaseUtils.checkLoginTimeoutStatus();
        if (idsArray.length > 0) {
            BaseUtils.pageMsgBlock();
            $encrypPutAjax({
                url: serverUrl + "v1/dict/st",
                data: {
                    'ids' : JSON.stringify(idsArray),
                    'status' : status,
                    'credential': BaseUtils.credential,
                    'systemCode': BaseUtils.systemCode,
                    _method: 'PUT'
                },
                headers: BaseUtils.cloudHeaders
            }, function (response) {
                  BaseUtils.htmPageUnblock();
                  if (response.success) {
                    dictMainPageRefreshGridAndTree();
                  }  else if (response.status == 202) {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(BaseUtils.updateMsg, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                } else {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(response.message, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                }
            }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
        }
    };

    /**
     *  同步数据
     */
    var dictMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/dict/sync",
            headers: BaseUtils.cloudHeaders
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                dictMainPagePid = 0;
                dictMainPageZtreeNodeList = [];
                dictMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var dictMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#dict_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var zTreeOjb = $.fn.zTree.getZTreeObj("dict_mainPage_tree");
            var selectedNodes = zTreeOjb.getSelectedNodes();
            if (selectedNodes.length > 0) {
                var selectedNode = selectedNodes[0];
                dictMainPageParentName = selectedNode.name;
                dictMainPagePid = selectedNode.id;
            }
            var modalDialogTitle = "新增数据字典";
            if (dictMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(dictMainPageSubmitFormId);
            }
            $("#dict_mainPage_dataSubmit_form_parent_name").val(dictMainPageParentName);
            if (dictMainPageMark == 2) {
                modalDialogTitle = "修改数据字典";
                BaseUtils.cleanFormReadonly(dictMainPageSubmitFormId);
                $("#dict_mainPage_dataSubmit_form_dict_number").addClass("m-input--solid");
                $("#dict_mainPage_dataSubmit_form_dict_number").attr("readonly", "readonly");
            }
            $(".has-danger-error").show();
            $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            $("#dict_mainPage_dataSubmit_form_submit").show();
            $("#dict_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#dict_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (dictMainPageMark == 3) {
                modalDialogTitle = "数据字典信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#dict_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
        });

        // 当调用 hide 实例方法时触发。
        $('#dict_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            dictMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#dict_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            dictMainPageInitFunctionButtonGroup();
            dictMainPageInitTree();
            dictMainPageInitDataGrid();
            dictMainPageInitModalDialog();
            dictMainPageFormSubmitHandle();
            $('#dict_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                dictMainPageDeleteData(null);
                return false;
            });
            $('#dict_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                dictMainPageMark = 1;
                // 显示 dialog
                dictMainPageFormModal.modal('show');
                return false;
            });
            $('#dict_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                dictMainPageSearchZtreeNode();
                return false;
            });

            $('#dict_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                dictMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                dictMainPageTable.resize("dict_mainPage_grid");
                dictMainPageZtreeMaxHeight();
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageDict.init();
});