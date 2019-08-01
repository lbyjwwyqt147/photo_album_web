/***
 * 员工管理
 * @type {{init}}
 */
var SnippetMainPageStaff = function() {
    var serverUrl = BaseUtils.serverAddress;
    var staffMainPageTable;
    var staffMainPageFormModal = $('#staff_mainPage_dataSubmit_form_modal');
    var staffMainPageSubmitForm = $("#staff_mainPage_dataSubmit_form");
    var staffMainPageSubmitFormId = "#staff_mainPage_dataSubmit_form";
    var staffMainPageMark = 1;
    var staffMainPageZtreeNodeList = [];
    var staffMainPageModuleCode = '1030';

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAstaffMainPageSyncDataSuccess: callback.onAstaffMainPageSyncDataSuccess}}
     */
    var staffOrgZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/organization/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    staffOrgZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    staffOrgZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            var staffOrgObj = $("#staffOrgName");
            staffOrgObj.attr("value", treeNode.name);
            $("#staffOrgId").attr("value", treeNode.id);
        },
        onAsyncSuccess:function(event, treeId, msg){ //异步加载完成后执行
            if ("undefined" == $("#staffOrgTree_1_a").attr("title")) {
                $("#staffOrgTree_1").remove();
            }
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
    var staffOrgMainPageInitTree = function() {
        $.fn.zTree.init($("#staffOrgTree"), staffOrgZtreeSetting);
    };




    /**
     *  搜索节点
     */
    function staffMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#staff-mainPage-nodeName-search").val());
       staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree");
        var keyType = "name";
       staffMainPageZtreeNodeList = zTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param staffMainPageZtreeNodeList
     * @param highlight
     */
    function staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree");
        for (var i = 0, l = staffMainPageZtreeNodeList.length; i < l; i++) {
            staffMainPageZtreeNodeList[i].highlight = highlight;
            //定位到节点并展开
            zTree.expandNode(staffMainPageZtreeNodeList[i]);
            zTree.updateNode(staffMainPageZtreeNodeList[i]);
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
     * 下拉树点击之前
     * @param treeId
     * @param treeNode
     * @returns {*|boolean}
     */
    function beforeClick(treeId, treeNode) {
        var check = (treeNode && !treeNode.isParent);
        if (!check) alert("Do not select province...");
        return check;
    }

    /**
     * 下拉树节点点击事件
     * @param treeId
     * @param treeNode
     * @returns {*|boolean}
     */
    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree"),
            nodes = zTree.getSelectedNodes(),
            v = "";
        nodes.sort(function compare(a,b){return a.id-b.id;});
        for (var i=0, l=nodes.length; i<l; i++) {
            v += nodes[i].name + ",";
        }
        if (v.length > 0 ) v = v.substring(0, v.length-1);
        var staffOrgObj = $("#staffOrgName");
        staffOrgObj.attr("value", v);
    }

    /**
     * 显示下拉树
     */
    function showMenu() {
        var staffOrgObj = $("#staffOrgName");
        var staffOrgOffset = $("#staffOrgName").offset();
        $("#orgTreeContent").css({left: staffOrgObj.outerWidth() - $(".col-lg-2").width()+9 + "px", top:staffOrgOffset.top - staffOrgObj.outerHeight() - 1 + "px", width:staffOrgObj.outerWidth() + "px"}).slideDown("fast");

        $("body").bind("mousedown", onBodyDown);
    }

    /**
     * 隐藏下拉树
     */
    function hideMenu() {
        $("#orgTreeContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }


    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "orgTreeContent" || $(event.target).parents("#orgTreeContent").length>0)) {
            hideMenu();
        }
    }

    /**
     * 初始化 功能按钮
     */
    var staffMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(staffMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#staff-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#staff_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增员工信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var table_ejection_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 员工离职操作" lay-event="ejection">\n'
                table_ejection_btn_html += '<i class="la la-user-times"></i>\n';
                table_ejection_btn_html += '</a>\n';
                tableToolbarHtml.append(table_ejection_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title="修改员工信息" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除员工信息">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_delete_btn">\n';
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
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }

            var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 查看员工信息" lay-event="look">\n'
            table_del_btn_html += '<i class="la la-eye"></i>\n';
            table_del_btn_html += '</a>\n';
            tableToolbarHtml.append(table_del_btn_html);
        }
        // Tooltip
        $('[data-toggle="tooltip"]').tooltip();
    };

    /**
     *  初始化 dataGrid 组件
     */
    var staffMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            staffMainPageTable =  $initEncrypDataGrid({
                elem: '#staff_mainPage_grid',
                url: serverUrl + 'v1/table/staff/g',
                method:"get",
                where: {   //传递额外参数

                },
                headers: BaseUtils.serverHeaders(),
                title: '员工信息列表',
                initSort: {
                    field: 'entryDate', //排序字段，对应 cols 设定的各字段名
                    type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'staffPortraitTiny', title:'头像', unresize:true,
                        templet : function (row) {
                            var spanHtml = '<img style="display: inline-block; width: 50%; height: 100%;" src="' + value + '">';
                            return spanHtml;
                        }
                        },
                    {field:'staffNumber', title:'工号'},
                    {field:'staffName', title:'姓名', fixed: true},
                    {field:'staffNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'staffPositionText', title:'职务'},
                    {field:'entryDate', title:'入职日期', sort:true},
                    {field:'staffSex', title:'性别'},
                    {field:'staffEmail', title:'电子邮箱'},
                    {field:'orgName', title:'组织机构'},
                    {field:'duration', title:'在职年限', sort:true, unresize:true,
                        templet : function (row) {
                            return value + "月";
                        }
                     },
                    {field:'staffStatus', title:'状态', align: 'center',  fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.staffStatus;
                            var spanCss = "m-badge--success";
                            var curStatusText = "在职";
                            switch (value) {
                                case 1:
                                    curStatusText = "禁用";
                                    spanCss = "m-badge--warning";
                                    break;
                                case 2:
                                    curStatusText = "离职";
                                    spanCss = "m-badge--danger";
                                    break;
                                default:
                                    break;
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + curStatusText + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#staff_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(staffMainPageModuleCode);
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

            //监听行工具事件
            staffMainPageTable.on('tool(staff_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    staffMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    staffMainPageSubmitForm.setForm(obj.data);
                    staffMainPageMark = 2;
                    // 显示 dialog
                    staffMainPageFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                // 选中返回 true  没有选中返回false
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
                staffMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            staffMainPageTable.on('rowDouble(staff_mainPage_grid)', function(obj){
                staffMainPageMark = 3;
                staffMainPageSubmitForm.setForm(obj.data);
                BaseUtils.readonlyForm(staffMainPageSubmitFormId);
                staffMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var staffMainPageRefreshGrid = function () {
        var searchSondition = $("#staff-query-form").serializeJSON();
        staffMainPageTable.reload('staff_mainPage_grid', {
            where: searchSondition,
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
        var laydate
        layui.use('laydate', function() {
            laydate = layui.laydate;
            //入职日期控件
            laydate.render({
                elem: '#entryDate'
            });
            //出生日期控件
            laydate.render({
                elem: '#birthday'
            });
        });
        // 职务 select
        BaseUtils.dictDataSelect("staff_position", function (data) {
            var $staffPosition = $("#staffPosition");
            var $queryStaffPosition = $("#query_staffPosition");
            $queryStaffPosition.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $staffPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
                $queryStaffPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $staffPosition .selectpicker('refresh');
            $queryStaffPosition.selectpicker('refresh');
        });
        // 技能(特长)  multi select
        BaseUtils.dictDataSelect("staff_skill", function (data) {
            var $skill = $("#skill");
            Object.keys(data).forEach(function(key){
                var curId = data[key].id;
                if (curId == 0 || curId == 1)  {
                    $skill.append("<option value=" + curId + " selected>" + data[key].text + "</option>");
                } else {
                    $skill.append("<option value=" + curId + ">" + data[key].text + "</option>");
                }
            });
            $skill.select2({
                placeholder: "技能(特长)",
            });

        });
        // 职务选择事件绑定
        $("#staff_position").on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            console.log(e);
            console.log(e.target.value);
            var curSelectedValue = e.target.value;
            if (curSelectedValue == 1 || curSelectedValue == 2)  {
                $("#skill").val("0").select2();
                $("#skill").val("1").select2();
            } else if (curSelectedValue == 3) {
                $("#skill").val("2").select2();
            }
        });
        // 省市区 select
        BaseUtils.distDataSelect("510000", function (data) {
            var $city = $("#city");
            Object.keys(data).forEach(function(key){
                $city.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $city .selectpicker('refresh');
        });
        BaseUtils.distDataSelect("510100", function (data) {
            var $district = $("#district");
            Object.keys(data).forEach(function(key){
                var curId = data[key].id;
                $district.append("<option value=" + curId + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $district .selectpicker('refresh');
        });
        // 城市绑定监听选择事件
        $("#city").on('changed.bs.select',function(e){
            console.log(e.target.value);
            BaseUtils.distDataSelect(e.target.value, function (data) {
                var $district = $("#district");
                $district.html("");
                Object.keys(data).forEach(function(key){
                    var curId = data[key].id;
                    $district.append("<option value=" + curId + ">" + data[key].text + "</option>");
                });
                //必须加，刷新select
                $district .selectpicker('refresh');
            });
        });

        $("#staffIdentiyCard").blur(function() {
            var staffIdentiyCard = $("#staffIdentiyCard").val();
            if ($.trim(staffIdentiyCard) != "") {
                var curCardObj = BaseUtils.birthdayCard(staffIdentiyCard);
                if (curCardObj != null) {
                    //初始赋值
                    laydate.render({
                        elem: '#birthday',
                        value: curCardObj.birthday,
                        isInitValue: true
                    });
                    $("input[type=radio][name=staffSex][value='" + curCardObj.sex + "'").attr("checked",'checked');
                } else {
                    $("#staffIdentiyCard").val('');
                }
            }
        });
        
        $("#staffOrgName").click(function() {
            showMenu();
            return false;
        });

    }

    /**
     * 初始化表单提交
     */
    var staffMainPageFormSubmitHandle = function() {
        $('#staff_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(staffMainPageSubmitFormId);
            staffMainPageSubmitForm.validate({
                rules: {
                    staffNumber: {
                        required: true,
                        alnum:true,
                        maxlength: 20
                    },
                    staffName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    staffNickName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    mobilePhone: {
                        required: true,
                        isMobile:true
                    },
                    staffIdentiyCard: {
                        required: false,
                        idCardNo:true
                    },
                    staffEmail: {
                        required: true,
                        email:true,
                        maxlength: 60
                    },
                    entryDate: {
                        required: true
                    },
                    staffQq: {
                        required: false,
                        isQq:true,
                        maxlength: 13
                    },
                    staffWechat: {
                        required: false,
                        alnum:true,
                        maxlength: 20
                    },
                    staffWeiBo: {
                        required: false,
                        url:true,
                        maxlength: 200
                    },
                    street: {
                        chcharacterNum:true,
                        maxlength: 50
                    },
                    staffEquipment: {
                        maxlength: 200
                    },
                    staffIntro: {
                        maxlength: 350
                    },
                    birthday : {
                        required: true,
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
            if (!staffMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            if ($("#staff-id").val() == null || $("#staff-id").val() == "") {
                $("#staffCategory").val(1);
            }
            BaseUtils.modalBlock("#staff_mainPage_dataSubmit_form_modal");
            $postAjax({
                url:serverUrl + "v1/verify/staff/s",
                data:staffMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 关闭 dialog
                    staffMainPageFormModal.modal('hide');
                    if ( $("#staffPortraitId").val() == '') {
                        layer.open({
                            type: 2,
                            title: '上传头像',
                            offset: '90px',
                            resize: false,
                            content:  ['portrait.html?businessId='+ response.data +'&businessType=1', 'no'], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content:
                            area: ['1010px', '650px'],
                            btn: ['跳过'],
                            yes: function(index, layero){  // 确定按钮回调方法
                                // 刷新表格
                                staffMainPageRefreshGrid();
                                layer.close(index);
                            },
                            cancel: function(index, layero){  // 右上角关闭按钮触发的回调
                                staffMainPageRefreshGrid();
                                layer.close(index);
                                return false;
                            }
                        });
                    }
                } else if (response.status == 409) {
                    staffMainPageRefreshGrid();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var staffMainPageCleanForm = function () {
        BaseUtils.cleanFormData(staffMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var staffMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/staff/d";
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
            var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                ajaxDelUrl = serverUrl + "v1/verify/staff/d/b";
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
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            staffMainPageRefreshGrid();
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
    var staffMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/staff/p";
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
            var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
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
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                  if (response.success) {
                      staffMainPageRefreshGrid();
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
                      staffMainPageRefreshGrid();
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
    var staffMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/staff/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                staffMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var staffMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#staff_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "新增员工信息";
            var orgzTree = $.fn.zTree.getZTreeObj("staffOrgTree");
            // 取消当前所有被选中节点的选中状态
            orgzTree.cancelSelectedNode();
            var ztreeNode = null;
            if (staffMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(staffMainPageSubmitFormId);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
                var ztreeNodes = orgzTree.getNodes();
                if (ztreeNodes.length > 0) {
                    ztreeNode = ztreeNodes[0]; //注：只有当树的根节点只有一个时，才可以这样取，否则会获取到多个节点
                }
            }
            if (staffMainPageMark == 2) {
                ztreeNode = orgzTree.getNodeByParam("id",$("#staffOrgId").val());
                modalDialogTitle = "修改员工信息";
                BaseUtils.cleanFormReadonly(staffMainPageSubmitFormId);
                $("#staff_mainPage_dataSubmit_form_staff_number").addClass("m-input--solid");
                $("#staff_mainPage_dataSubmit_form_staff_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#staff_mainPage_dataSubmit_form_submit").show();
            $("#staff_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#staff_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (staffMainPageMark == 3) {
                modalDialogTitle = "员工信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#staff_mainPage_dataSubmit_form_submit").hide();
            }
            if (ztreeNode != null) {
                orgzTree.selectNode(ztreeNode);
                // 选中的节点
                var selectedNodes = orgzTree.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    var selectedNode = selectedNodes[0];
                    console.log(selectedNode);
                    var staffOrgObj = $("#staffOrgName");
                    staffOrgObj.attr("value", selectedNode.name);
                    $("#staffOrgId").attr("value", selectedNode.id);
                }

            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
        });

        // 当调用 hide 实例方法时触发。
        $('#staff_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            staffMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            staffMainPageInitFunctionButtonGroup();
            staffOrgMainPageInitTree();
            staffMainPageInitDataGrid();
            staffMainPageInitModalDialog();
            staffMainPageFormSubmitHandle();
            initSelectpicker();
            $('#staff_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageDeleteData(null);
                return false;
            });
            $('#staff_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageMark = 1;
                // 显示 dialog
                staffMainPageFormModal.modal('show');
                return false;
            });
            $('#staff_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageSearchZtreeNode();
                return false;
            });

            $('#staff_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                staffMainPageTable.resize("staff_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageStaff.init();
});