/***
 * 员工管理
 * @type {{init}}
 */
var SnippetMainPageSarousel = function() {
    var serverUrl = BaseUtils.serverAddress;
    var SarouselMainPageTable;
    var SarouselMainPageFormModal = $('#Sarousel_mainPage_dataSubmit_form_modal');
    var SarouselMainPageSubmitForm = $("#Sarousel_mainPage_dataSubmit_form");
    var SarouselMainPageSubmitFormId = "#Sarousel_mainPage_dataSubmit_form";
    var SarouselMainPageMark = 1;
    var SarouselMainPageZtreeNodeList = [];
    var SarouselMainPageModuleCode = '1030';

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onASarouselMainPageSyncDataSuccess: callback.onASarouselMainPageSyncDataSuccess}}
     */
    var SarouselOrgZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/organization/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    SarouselOrgZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    SarouselOrgZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            var SarouselOrgObj = $("#SarouselOrgName");
            SarouselOrgObj.attr("value", treeNode.name);
            $("#SarouselOrgId").attr("value", treeNode.id);
            var otherAttributes = treeNode.otherAttributes;
            $("#Sarousel_full_parent").attr("value", otherAttributes.fullParent);
            $("#Sarousel_org_number").attr("value", otherAttributes.orgNumber);
        },
        onAsyncSuccess:function(event, treeId, msg){ //异步加载完成后执行
            if ("undefined" == $("#SarouselOrgTree_1_a").attr("title")) {
                $("#SarouselOrgTree_1").remove();
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
    var SarouselOrgMainPageInitTree = function() {
        $.fn.zTree.init($("#SarouselOrgTree"), SarouselOrgZtreeSetting);
    };




    /**
     *  搜索节点
     */
    function SarouselMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#Sarousel-mainPage-nodeName-search").val());
       SarouselMainPageZtreeUpdateNodes(SarouselMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("SarouselOrgTree");
        var keyType = "name";
       SarouselMainPageZtreeNodeList = zTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        SarouselMainPageZtreeUpdateNodes(SarouselMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param SarouselMainPageZtreeNodeList
     * @param highlight
     */
    function SarouselMainPageZtreeUpdateNodes(SarouselMainPageZtreeNodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("SarouselOrgTree");
        for (var i = 0, l = SarouselMainPageZtreeNodeList.length; i < l; i++) {
            SarouselMainPageZtreeNodeList[i].highlight = highlight;
            //定位到节点并展开
            zTree.expandNode(SarouselMainPageZtreeNodeList[i]);
            zTree.updateNode(SarouselMainPageZtreeNodeList[i]);
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
        var zTree = $.fn.zTree.getZTreeObj("SarouselOrgTree"),
            nodes = zTree.getSelectedNodes(),
            v = "";
        nodes.sort(function compare(a,b){return a.id-b.id;});
        for (var i=0, l=nodes.length; i<l; i++) {
            v += nodes[i].name + ",";
        }
        if (v.length > 0 ) v = v.substring(0, v.length-1);
        var SarouselOrgObj = $("#SarouselOrgName");
        SarouselOrgObj.attr("value", v);
    }

    /**
     * 显示下拉树
     */
    function showMenu() {
        var SarouselOrgObj = $("#SarouselOrgName");
        var SarouselOrgOffset = $("#SarouselOrgName").offset();
        $("#orgTreeContent").css({left: SarouselOrgObj.outerWidth() - $(".col-lg-2").width()+30 + "px", top:SarouselOrgOffset.top - SarouselOrgObj.outerHeight() - 1 + "px", width:SarouselOrgObj.outerWidth() + "px"}).slideDown("fast");

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
    var SarouselMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(SarouselMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#Sarousel-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#Sarousel_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增员工信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="Sarousel_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                /*var table_ejection_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 员工离职操作" lay-event="ejection">\n'
                table_ejection_btn_html += '<i class="la la-user-times"></i>\n';
                table_ejection_btn_html += '</a>\n';
                tableToolbarHtml.append(table_ejection_btn_html);*/


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title="修改员工信息" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除员工信息">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="Sarousel_mainPage_delete_btn">\n';
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
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="Sarousel_mainPage_sync_btn">\n';
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
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    /**
     *  初始化 dataGrid 组件
     */
    var SarouselMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            SarouselMainPageTable =  $initEncrypDataGrid({
                elem: '#Sarousel_mainPage_grid',
                url: serverUrl + 'v1/table/Sarousel/g',
                method:"get",
                where: {   //传递额外参数
                    SarouselStatus : 0
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
                    {field:'SarouselNumber', title:'工号'},
                    {field:'SarouselName', title:'姓名'},
                    {field:'SarouselPortrait', title:'照片', unresize:true,  align: 'center', width:60,
                        templet : function (row) {
                            var value = row.SarouselPortrait;
                            if (value == null || value == '' ) {
                                value = "../../assets/custom/images/user/user_0.png";
                            }
                            var spanHtml = '<img style="display: inline-block; width: 100%; height: 100%;" src="' + value + '">';
                            return spanHtml;
                        }
                    },
                    {field:'SarouselNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'SarouselPositionText', title:'职务'},
                    {field:'entryDate', title:'入职日期', sort:true},
                    {field:'SarouselSex', title:'性别',
                        templet : function (row) {
                            var value = row.SarouselSex;
                            var curSexText = "男";
                            switch (value) {
                                case 1:
                                    curSexText = "女";
                                    break;
                                default:
                                    break;
                            }
                            return curSexText;
                        }
                    },
                    {field:'SarouselEmail', title:'电子邮箱'},
                    {field:'SarouselOrgName', title:'组织机构'},
                    {field:'workingYears', title:'在职年限', sort:true, unresize:true},
                    {field:'SarouselStatus', title:'状态', align: 'center',  fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.SarouselStatus;
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
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#Sarousel_mainPage_table_toolbar', align: 'center', width:210}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(SarouselMainPageModuleCode);
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
            SarouselMainPageTable.on('tool(Sarousel_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    SarouselMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    SarouselMainPageSubmitForm.setForm(obj.data);
                    initSarouselSelected(obj.data);
                    SarouselMainPageMark = 2;
                    // 显示 dialog
                    SarouselMainPageFormModal.modal('show');
                } else if (obj.event === 'ejection')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                } else if (obj.event === 'look')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    lookSarouselParticulars(obj);
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
                SarouselMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            SarouselMainPageTable.on('rowDouble(Sarousel_mainPage_grid)', function(obj){
                SarouselMainPageMark = 3;
                SarouselMainPageSubmitForm.setForm(obj.data);
                initSarouselSelected(obj.data);
                BaseUtils.readonlyForm(SarouselMainPageSubmitFormId);
                SarouselMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var SarouselMainPageRefreshGrid = function () {
        var searchSondition = $("#Sarousel-page-grid-query-form").serializeJSON();
        SarouselMainPageTable.reload('Sarousel_mainPage_grid', {
            where: searchSondition,
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 重置查询条件
     */
    var SarouselMainPageRefreshGridQueryCondition = function () {
        $("#Sarousel-page-grid-query-form")[0].reset();
        $("#query_SarouselPosition").selectpicker('refresh');
        $("#query-SarouselStatus").selectpicker('refresh');
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
            //离职日期控件
            laydate.render({
                elem: '#dimissionDate'
            });
        });
        $('#dimissionReason').selectpicker('refresh');
        // 职务 select
        BaseUtils.dictDataSelect("Sarousel_position", function (data) {
            var $SarouselPosition = $("#SarouselPosition");
            var $querySarouselPosition = $("#query_SarouselPosition");
            $querySarouselPosition.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $SarouselPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
                $querySarouselPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $SarouselPosition .selectpicker('refresh');
            $querySarouselPosition.selectpicker('refresh');
            $querySarouselPosition.change(function () {
               querySarouselPositionSelectOnchang();
            });
        });
        // 技能(特长)  multi select
        BaseUtils.dictDataSelect("Sarousel_skill", function (data) {
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
        $("#SarouselPosition").on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            var curSelectedValue = e.target.value;
            if (curSelectedValue == 1 || curSelectedValue == 2)  {
                $('#skill').val([0,1]).trigger("change");
            } else if (curSelectedValue == 3) {
                $('#skill').val([2]).trigger("change");
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

        $("#SarouselIdentiyCard").blur(function() {
            var SarouselIdentiyCard = $("#SarouselIdentiyCard").val();
            if ($.trim(SarouselIdentiyCard) != "") {
                var curCardObj = BaseUtils.birthdayCard(SarouselIdentiyCard);
                if (curCardObj != null) {
                    //初始赋值
                    laydate.render({
                        elem: '#birthday',
                        value: curCardObj.birthday,
                        isInitValue: true
                    });
                    $("input:radio[name=\"tempSarouselSex\"][value='"+curCardObj.sex+"']").click();
                } else {
                    $("#SarouselIdentiyCard").val('');
                }
            }
        });
        
        $("#SarouselOrgName").click(function() {
            showMenu();
            return false;
        });
        $("#query-SarouselStatus").change(function () {
            querySarouselStatusSelectOnchang();
        });

    }

    /**
     *  查询条件 职务选择事件
     * @param obj
     */
    var querySarouselPositionSelectOnchang = function (obj) {
        SarouselMainPageRefreshGrid();
    }

    /**
     *  查询条件 状态选择事件
     * @param obj
     */
    var querySarouselStatusSelectOnchang = function (obj) {
        SarouselMainPageRefreshGrid();
    }


    /**
     * select 控件回显值
     */
    var initSarouselSelected = function (obj) {
        $('#probationStatus').selectpicker('val', obj.probationStatus);
        $('#SarouselPosition').selectpicker('val', obj.SarouselPosition);
        $('#province').selectpicker('val', obj.province);
        $('#city').selectpicker('val', obj.city);
        $('#district').selectpicker('val', obj.district);
        $('#dimissionReason').selectpicker('val', obj.dimissionReason);
        $("#skill").val(obj.skill.split(",")).trigger("change");
        $("input:radio[name=\"tempSarouselSex\"][value='"+obj.SarouselSex+"']").click();
        $("#SarouselIntro-text").val(BaseUtils.toTextarea(obj.SarouselIntro));
        $("#SarouselEquipment-text").val(BaseUtils.toTextarea( obj.SarouselEquipment));
    };

    /**
     * 查看员工详情信息
     * @param obj
     */
    var  lookSarouselParticulars = function (obj) {
        layer.open({
            type: 2,
            title: '员工个人信息',
            offset: 'auto',
            resize: false,
            shadeClose : true,
            content:  ['../../management/Sarousel/particulars.html?businessId='+ obj.data.id, 'no'], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content:
            area: ['95%', '90%']
        });
    }

    /**
     * 初始化表单提交
     */
    var SarouselMainPageFormSubmitHandle = function() {
        $('#Sarousel_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            var curSex = $("input:radio[name=\"tempSarouselSex\"]:checked").val();
            $("#SarouselIntro-text").val(BaseUtils.textareaTo( $("#SarouselIntro-text").val()));
            $("#SarouselEquipment-text").val(BaseUtils.textareaTo( $("#SarouselEquipment-text").val()));
            BaseUtils.formInputTrim(SarouselMainPageSubmitFormId);
            $("#Sarousel-sex").val(curSex);
            SarouselMainPageSubmitForm.validate({
                rules: {
                    SarouselNumber: {
                        required: true,
                        alnum:true,
                        maxlength: 20
                    },
                    SarouselName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    SarouselNickName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    mobilePhone: {
                        required: true,
                        isMobile:true
                    },
                    SarouselIdentiyCard: {
                        required: false,
                        idCardNo:true
                    },
                    SarouselEmail: {
                        required: true,
                        email:true,
                        maxlength: 60
                    },
                    entryDate: {
                        required: true
                    },
                    SarouselQq: {
                        required: false,
                        isQq:true,
                        maxlength: 13
                    },
                    SarouselWechat: {
                        required: false,
                        alnum:true,
                        maxlength: 20
                    },
                    SarouselWeiBo: {
                        required: false,
                        url:true,
                        maxlength: 200
                    },
                    street: {
                        chcharacterNum:true,
                        maxlength: 50
                    },
                    SarouselEquipment: {
                        maxlength: 200
                    },
                    SarouselIntro: {
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
            if (!SarouselMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var skillOptions = $("#skill").select2("val");
            $("#Sarousel-skill").val(skillOptions.join(','));
            if ($("#Sarousel-id").val() == null || $("#Sarousel-id").val() == "") {
                $("#SarouselCategory").val(1);
            }
            BaseUtils.modalBlock("#Sarousel_mainPage_dataSubmit_form_modal");
            $postAjax({
                url:serverUrl + "v1/verify/Sarousel/s",
                data:SarouselMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#Sarousel_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 关闭 dialog
                    SarouselMainPageFormModal.modal('hide');

                    if ( $("#SarouselPortraitId").val() == '') {
                        //询问框
                        layer.confirm('是否需要上传'+ $("#Sarousel-name").val() +'的照片信息?', {
                            shade: [0.3, 'rgb(230, 230, 230)'],
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){   //按钮【按钮一】的回调
                            layer.close(index);
                            layer.open({
                                type: 2,
                                title: '上传照片',
                                offset: '90px',
                                resize: false,
                                content:  ['portrait.html?businessId='+ response.data +'&businessType=1', 'no'], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content:
                                area: ['1010px', '650px'],
                                btn: ['跳过'],
                                yes: function(index, layero){  // 确定按钮回调方法
                                    // 刷新表格
                                    SarouselMainPageRefreshGrid();
                                    layer.close(index);
                                },
                                cancel: function(index, layero){  // 右上角关闭按钮触发的回调
                                    SarouselMainPageRefreshGrid();
                                    layer.close(index);
                                    return false;
                                }
                            });
                        }, function () {  //按钮【按钮二】的回调
                            SarouselMainPageRefreshGrid();
                        });
                    }
                } else if (response.status == 409) {
                    SarouselMainPageRefreshGrid();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#Sarousel_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var SarouselMainPageCleanForm = function () {
        BaseUtils.cleanFormData(SarouselMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var SarouselMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/Sarousel/d";
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
            var checkRows = SarouselMainPageTable.checkStatus('Sarousel_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                ajaxDelUrl = serverUrl + "v1/verify/Sarousel/d/b";
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
                $deleteAjax({
                    url:ajaxDelUrl,
                    data: delData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            SarouselMainPageRefreshGrid();
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
    var SarouselMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/Sarousel/p";
        var putData = null;
        var userIdsArray = [];
        var idsArray = [];
        var putParams = [];
        if (obj != null) {
            var dataVersion = $(obj.elem.outerHTML).attr("dataversion");
            var userId = $(obj.elem.outerHTML).attr("userid");
            var curDataParam = {
                "id" : userId,
                "dataVersion" : dataVersion
            }
            putParams.push(curDataParam);
            userIdsArray.push(userId);
            idsArray.push(obj.value)
        } else {
            // 获取选中的数据对象
            var checkRows = SarouselMainPageTable.checkStatus('Sarousel_mainPage_grid');
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
            }
        }
        putData = {
            'ids': JSON.stringify(idsArray),
            'status' : status,
            'putParams' : JSON.stringify(putParams),
            'otherIds':JSON.stringify(userIdsArray)
        }
        if (putData != null) {
            BaseUtils.pageMsgBlock();
            $putAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                  if (response.success) {
                      SarouselMainPageRefreshGrid();
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
                      SarouselMainPageRefreshGrid();
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
    var SarouselMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/Sarousel/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                SarouselMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };


    var SarouselMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#Sarousel_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "新增员工信息";
            var orgzTree = $.fn.zTree.getZTreeObj("SarouselOrgTree");
            // 取消当前所有被选中节点的选中状态
            orgzTree.cancelSelectedNode();
            var ztreeNode = null;
            if (SarouselMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(SarouselMainPageSubmitFormId);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
                var ztreeNodes = orgzTree.getNodes();
                if (ztreeNodes.length > 0) {
                    ztreeNode = ztreeNodes[0]; //注：只有当树的根节点只有一个时，才可以这样取，否则会获取到多个节点
                }
                $('#skill').val([0,1]).trigger("change");
                $("input:radio[name=\"tempSarouselSex\"][value='0']").click();
            }
            if (SarouselMainPageMark == 2) {
                ztreeNode = orgzTree.getNodeByParam("id",$("#SarouselOrgId").val());
                modalDialogTitle = "修改员工信息";
                BaseUtils.cleanFormReadonly(SarouselMainPageSubmitFormId);
                $("#Sarousel_mainPage_dataSubmit_form_Sarousel_number").addClass("m-input--solid");
                $("#Sarousel_mainPage_dataSubmit_form_Sarousel_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#Sarousel_mainPage_dataSubmit_form_submit").show();
            $("#Sarousel_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#Sarousel_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (SarouselMainPageMark == 3) {
                modalDialogTitle = "员工信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#Sarousel_mainPage_dataSubmit_form_submit").hide();
            }
            if (ztreeNode != null) {
                orgzTree.selectNode(ztreeNode);
                // 选中的节点
                var selectedNodes = orgzTree.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    var selectedNode = selectedNodes[0];
                    var SarouselOrgObj = $("#SarouselOrgName");
                    SarouselOrgObj.attr("value", selectedNode.name);
                    $("#SarouselOrgId").attr("value", selectedNode.id);
                    var otherAttributes = selectedNode.otherAttributes;
                    $("#Sarousel_full_parent").attr("value", otherAttributes.fullParent);
                    $("#Sarousel_org_number").attr("value", otherAttributes.orgNumber);
                }

            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 居中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#Sarousel_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#Sarousel_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            SarouselMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#Sarousel_mainPage_dataSubmit_form_modal");
        });

    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            SarouselMainPageInitFunctionButtonGroup();
            SarouselOrgMainPageInitTree();
            SarouselMainPageInitDataGrid();
            SarouselMainPageInitModalDialog();
            SarouselMainPageFormSubmitHandle();
            initSelectpicker();
            $('#Sarousel_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                SarouselMainPageDeleteData(null);
                return false;
            });
            $('#Sarousel_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                SarouselMainPageMark = 1;
                // 显示 dialog
                SarouselMainPageFormModal.modal('show');
                return false;
            });
            $('#Sarousel_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                SarouselMainPageSearchZtreeNode();
                return false;
            });

            $('#Sarousel_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                SarouselMainPageSyncData();
                return false;
            });

            $('#Sarousel-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                SarouselMainPageRefreshGrid();
                return false;
            });

            $('#Sarousel-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                SarouselMainPageRefreshGridQueryCondition();
                return false;
            });

            window.onresize = function(){
                SarouselMainPageTable.resize("Sarousel_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageSarousel.init();
});