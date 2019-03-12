//== Class Definition
var SnippetOrganization = function() {
    var serverUrl = Utils.serverAddress;
    var organizationTable;
    var organizationFormModal = $('#organization_form_modal');
    var submitForm = $("#organization_form");
    var mark = 1;
    var organizationPid = 0;
    var organizationParentName = "";
    var nodeList = [];
    var setting = {
        view: {
            selectedMulti: false,
            fontCss: getFontCss
        },
        check: {
            enable: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: false
        },
        async: {
            enable: true,
            url: serverUrl + "organization/ztree?pid=" + organizationPid,
            autoParam: ["id", "name"]
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                organizationPid = treeNode.id;
                refreshGrid();
            }
        }
    };


    /**
     * 初始化ztree 组件
     */
    var initTree = function() {
        $.fn.zTree.init($("#organization_tree"), setting);
    };

    /**
     * 刷新父节点
     * @param id
     */
    function rereshParentNode(id){
        var treeObj = $.fn.zTree.getZTreeObj("organization_tree");
        var nowNode = treeObj.getNodesByParam("id", id, null);
        var parent = nowNode[0].getParentNode();
        treeObj.reAsyncChildNodes(parent, "refresh");
    };

    /**
     *  刷新当前节点
     * @param id
     */
    function rereshNode(id){
        var treeObj = $.fn.zTree.getZTreeObj("organization_tree");
        var nowNode = treeObj.getNodesByParam("id", id, null);
        treeObj.reAsyncChildNodes(nowNode[0], "refresh");
    };

    /**
     *  刷新当前节点
     * @param id
     */
    function rereshTree(){
        var treeObj = $.fn.zTree.getZTreeObj("organization_tree");
        treeObj.refresh();
    };



    /**
     *  搜索节点
     */
    function searchNode() {
        var value = $.trim($("#nodeName-search").val());
        updateNodes(nodeList,false);
        if (value === "") {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("organization_tree");
        var keyType = "name";
        nodeList = zTree.getNodesByParamFuzzy(keyType, value);
        updateNodes(nodeList, true);

    };

    function updateNodes(nodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("organization_tree");
        for( var i=0, l=nodeList.length; i<l; i++) {
            nodeList[i].highlight = highlight;
            zTree.updateNode(nodeList[i]);
        }
    };

    function getFontCss(treeId, treeNode) {
        return (!!treeNode.highlight) ? {color:"#C50000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    };


    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
             organizationTable = layui.table;
            var layuiForm = layui.form;
            organizationTable.render({
                elem: '#organization_grid',
                url: serverUrl + 'organization/grid',
                where: {   //传递额外参数
                    'pid' : organizationPid
                },
                title: '数据字典列表',
                text: "无数据", //空数据时的异常提示
                cellMinWidth: 50, //全局定义常规单元格的最小宽度
                height: 'full-211', //高度最大化减去差值
                even: true,
                initSort: {
                    field: 'priority', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', hide:true },
                    {field:'orgNumber', title:'机构代码'},
                    {field:'orgName', title:'机构名称'},
                    {field:'fullName', title:'机构全名称'},
                    {field:'seq', title:'优先级'},
                    {field:'description', title:'描述'},
                    {field:'orgStatus', title:'状态', align: 'center',
                        templet : function (row) {
                            var value = row.orgStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + Utils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', toolbar: '#organization_table_toolbar', align: 'center', width:200}
                ]],
                page: {
                    layout:[ 'prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh'],
                    curr: 1 ,//设定初始在第 1 页
                    groups: 10, //只显示 10 个连续页码
                    first: true, //显示首页
                    last: true //显示尾页
                },
                limit: 20,
                limits: [20,30,40,50],

                request: {
                    pageName: 'pageNumber', //页码的参数名称，默认：page
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                },
                headers: Utils.serverHeaders(),
                parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                    return {
                        "code": res.status, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res.data //解析数据列表
                    };
                }
            });

            //监听行工具事件
            organizationTable.on('tool(organization_grid)', function(obj){
                if(obj.event === 'del'){
                    deleteData(obj);
                } else if(obj.event === 'edit'){
                    dataDetails(obj.data.id);
                    mark = 2;
                    // 显示 dialog
                    organizationFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                if (obj.elem.checked) {
                    statusValue = 1;
                }
                updateDataStatus(obj, statusValue);
            });
        });
    };

    /**
     * 刷新grid
     */
    var refreshGrid = function () {
        organizationTable.reload('organization_grid',{
            where: {   //传递额外参数
                'pid' : organizationPid
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }

        });
    };

    /**
     * 初始化表单提交
     */
    var handleorganizationFormSubmit = function() {
        $('#organization_form_submit').click(function(e) {
            e.preventDefault();
            Utils.inputTrim();
            var btn = $(this);
            submitForm.validate({
                rules: {
                    orgNumber: {
                        required: true,
                        maxlength: 15
                    },
                    orgName: {
                        required: true,
                        maxlength: 32
                    },
                    seq: {
                        range: [1,999]
                    },
                    description: {
                        maxlength: 200
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
            if (!submitForm.valid()) {
                return;
            }
            Utils.modalBlock("#organization_form_modal");
            $("#organization_form input[name='parentId']").val(organizationPid);
            $.ajax({
                type: "POST",
                url: serverUrl + "organization/save",
                data: submitForm.serializeJSON(),
                dataType: "json",
                headers: Utils.serverHeaders(),
                success:function (response) {
                    Utils.modalUnblock("#organization_form_modal");
                    if (response.success) {
                        // toastr.success(Utils.saveSuccessMsg);
                        // 刷新表格
                        refreshGrid();
                        // 刷新tree节点
                        rereshNode(organizationPid);
                        // 关闭 dialog
                        organizationFormModal.modal('hide');
                    }  else if (response.status == 202) {
                        toastr.error(Utils.saveFailMsg);
                    } else {
                        toastr.error(Utils.tipsFormat(response.message));
                    }

                },
                error:function (response) {
                    Utils.modalUnblock("#organization_form_modal");
                    toastr.error(Utils.errorMsg);
                }
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var cleanForm = function () {
        Utils.cleanFormData(submitForm);
    };

    /**
     * 删除
     */
    var deleteData = function(obj) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = organizationTable.checkStatus('organization_grid');
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
                Utils.pageMsgBlock();
                $.ajax({
                    type: "POST",
                    url: serverUrl + "organization/batchDelete",
                    traditional:true,
                    data: {
                        'ids' : JSON.stringify(idsArray),
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
                            rereshNode(organizationPid);
                        } else if (response.status == 202) {
                            toastr.error(Utils.delFailMsg);
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
            var checkRows = organizationTable.checkStatus('organization_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        if (idsArray.length > 0) {
            Utils.pageMsgBlock();
            $.ajax({
                type: "POST",
                url: serverUrl + "organization/status",
                traditional:true,
                data: {
                    'ids' : JSON.stringify(idsArray),
                    'status' : status,
                    _method: 'PUT'
                },
                dataType: "json",
                headers: Utils.serverHeaders(),
                success:function (response) {
                    Utils.htmPageUnblock();
                    if (response.success) {
                        refreshGrid();
                        rereshNode(organizationPid);
                    }  else if (response.status == 202) {
                        obj.othis.removeClass("layui-form-checked");
                        layer.tips(Utils.updateMsg, obj.othis,  {
                            tips: [4, '#f4516c']
                        });
                    } else {
                        obj.othis.removeClass("layui-form-checked");
                        layer.tips(response.message, obj.othis,  {
                            tips: [4, '#f4516c']
                        });
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
                url: serverUrl + "organization/sync",
                dataType: "json",
                headers: Utils.serverHeaders(),
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
     *  数据详情
     */
    var dataDetails = function(id) {
        $.ajax({
            type: "GET",
            url: serverUrl + "organization/details/" + id,
            dataType: "json",
            headers: Utils.serverHeaders(),
            success:function (response) {
                Utils.modalUnblock("#organization_form_modal");
                if (response.success) {
                    submitForm.setForm(response.data);
                }
            },
            error:function (response) {
                Utils.modalUnblock("#organization_form_modal");
                toastr.error(Utils.errorMsg);
            }
        });
    };

    var initModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#organization_form_modal').on('show.bs.modal', function (event) {
            var recipient = "新增组织机构";
            $("#organization_form_org_number").removeAttr("readonly");
            $("#organization_form_parent_name").val(organizationParentName);
            $("#organization_form_org_number").removeClass("m-input--solid");
            if (mark == 2) {
                recipient = "修改组织机构";
                $("#organization_form_org_number").addClass("m-input--solid");
                $("#organization_form_org_number").attr("readonly", "readonly");
                Utils.modalBlock("#organization_form_modal");
            }
            var modal = $(this);
            modal.find('.modal-title').text(recipient);
          //  modal.find('.modal-body input').val(recipient)
        });

        // 当调用 hide 实例方法时触发。
        $('#organization_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            cleanForm();
            $(".modal-backdrop").remove();
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initTree();
            initDataGrid();
            initModalDialog();
            handleorganizationFormSubmit();
            $('#organization_delete').click(function(e) {
                e.preventDefault();
                deleteData(null);
                return false;
            });
            $('#organization_add').click(function(e) {
                e.preventDefault();
                mark = 1;
                // 显示 dialog
                organizationFormModal.modal('show');
                return false;
            });
            $('#searchNode').click(function(e) {
                e.preventDefault();
                searchNode();
                return false;
            });

            $('#organization_sync').click(function(e) {
                e.preventDefault();
                sync();
                return false;
            });


            window.onresize = function(){
                organizationTable.resize("organization_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetOrganization.init();
});