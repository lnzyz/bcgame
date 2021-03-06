var tabs = ['#financeList','#addUser','#daily','#lowerDividend','#teamInfo','#extCode',
    '#personInfo','#myCard','#modLoginPwd','#modAccountPwd','#findSafeByQa','#msg'];
$(function(){
    //导航切换
    $(".centreNavDetail").click(function(){
        var showId = $(this).attr("data-id");
        $(".accountCentreContent>div").hide();
        $(showId).show();
        //消息管理没有子标签
        if(showId == "#msg"){
            //消息管理
            initMsg();
        }
        //第一个子标签
        $(this).next().find(".nav[data-id]:first").click();
    });

    //子标签切换
    $(".nav[data-id]").click(function(){
        var showId = $(this).attr("data-id");
        $(this).addClass("active").siblings().removeClass("active");
        $('.leftListItem').hide();
        $('.bigCommonBox').hide();
        $(".safeCenter>div").hide();
        $(".safeCenter>form").hide();
        $(".userSafeArea form").each(function(){
            $(this)[0].reset();
        });
        $(this).parent().show().parent().addClass("active").siblings().removeClass("active");
        $(showId).show().parents('.bigCommonBox').show();
        if(showId == '#financeList'){
            initUserList();
        } else if(showId == "#addUser"){
            initAddUser();
        } else if(showId == "#extCode"){
            initExtCode();
        } else if(showId=='#myCard'){
            initCard();
        } else if(showId == '#findSafeByQa'){
            showSafeDialog();
        }else if(showId == "#modAccountPwd"){
            showSafeDialog();
        }
    });

    //搜索按钮
    $("#userSearchSubmit").click(function(){
        $("#nextAccount").val('');
        initUserList();
    });

    //隐藏，用于分页提交
    $("#userSearchSubmit2").click(function(){
        initUserList();
    });

    // 日薪管理
    $('.tabBox .btn').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });
    $("#dailyManager").click(function(){
        $("#financeList").hide();
        $("#dailyAdd").hide();
        $("#daily").show();
        $("#dailyBtn2").click();
    });
    $("#dailyManagerBack").click(function(){
        $("#financeList").show();
        $("#daily").hide();
    });
    var dailyBtnIds = "#dailyBtn1,#dailyBtn2,#dailyBtn3";
    $(dailyBtnIds).click(function() {
        var dataId = $(this).attr("data-id");

        var btns = dailyBtnIds.split(",");
        for (var i in btns) {
            $($(btns[i]).attr("data-id")).hide();
        }

        $(dataId).show();
    });

    //添加用户（用户类型改变）
    $("#addUserType").change(function(){
        var val = $(this).val();
        var m = null;
        if (val == 0) {
            m = (gloas.maxRatio < gloas.playerMaxRatio ? gloas.maxRatio : gloas.playerMaxRatio);
        } else {
            m = gloas.maxRatio;
        }
        var a = '';
        for(var n=m;n>=0;n = Math.sub(n,gloas.stepRatio)){
            a += '<option value="'+n+'">' + n + '%</option>';
        }
        $("#addRebateRatio").html(a);
        $("#addRebateRatio").change();
    });
    //添加用户（返点改变）
    $("#addRebateRatio").change(function(){
        var val = parseFloat($(this).val());
        $("#lottsInfo tr").each(function(i,n){
            //返点范围
            var ratio = parseFloat($(this).attr("data-ratio"));
            var td2 = $(this).find("td:eq(2)");
            var nowVal = val.sub(ratio);
            if(nowVal<0) {
                nowVal = 0;
            }

            td2.html("0-"+nowVal+"%");

            //高奖
            var td3 = $(this).find("td:eq(3)");
            var ratio3 = parseFloat(td3.attr("data-ratio"));
            var v3 = ratio3.add(nowVal).mul(20);
            var txt = '<span class="highBonusRebate">'+v3+'</span>';
            td3.html(txt);

            var td4 = $(this).find("td:eq(4)");
            var ratio4 = parseFloat(td4.attr("data-ratio"));
            var t4 = '<span class="highBonusRebate">'+ratio4+"+"+nowVal+'%</span>';
            td4.html(t4);
        });

    });
    //添加用户（提交）
    $('#userAddForm').submit(function(){

        if($('#addAccount').val() == ""){
            $($('#addAccount').next()).text("请输入用户名");
            $('#addAccount').focus();
            return false;
        }
        var regAccount = /^[a-zA-Z]\w{5,13}/g;
        if(!regAccount.test($('#addAccount').val())){
            $($('#addAccount').next()).text("用户名格式不正确");
            $('#addAccount').focus();
            return false;
        }
        var d = serializeObject('#userAddForm');
        ajaxExt({
            url:"/openUser/regist",
            type:"post",
            data: d,
            dataType:'json',
            callback:function(data){
                $.alert(data);
                initAddUser();
            }
        });
        return false;
    });

    // 新增下级日薪
    $('#dailyForm').submit(function(){
        $(this).find(".errorWarn").html("");

        var $dailyAccount = $('#dailyAccount');
        if($dailyAccount.val() == ""){
            $dailyAccount.next().text("请输入用户名");
            $dailyAccount.focus();
            return false;
        }
        var $dailyRate = $('#dailyRate');
        if($dailyRate.val() == ""){
            $dailyRate.next().text("请选择日薪比例");
            $dailyRate.focus();
            return false;
        }
        var $dailyBetAmount = $('#dailyBetAmount');
        if($dailyBetAmount.val() == ""){
            $dailyBetAmount.next().text("请填写启始金额");
            $dailyBetAmount.focus();
            return false;
        }
        var $validAccountCount = $('#validAccountCount');
        if($validAccountCount.val() == ""){
            $validAccountCount.next().text("请填写有效人数");
            $validAccountCount.focus();
            return false;
        }
        if($validAccountCount.val() < 0 || $validAccountCount.val() > 3000){
            $validAccountCount.next().text("启始金额分配范围 0 ~ 3000");
            $validAccountCount.focus();
            return false;
        }

        var d = serializeObject('#dailyForm');
        ajaxExt({
            url:"/daily/saveDailyAcc",
            type:"post",
            data: d,
            dataType:'json',
            callback:function(data){
                $.alert(data);
            }
        });
        return false;
    });

    // 修改下级日薪
    $('#submitModifyDaily').on('click',function(){
        $('#modifydailyForm').find(".errorWarn").html("");

        var $dailyRate = $('#moDailyRate');
        if($dailyRate.val() == ""){
            $dailyRate.next().text("请选择日薪比例");
            $dailyRate.focus();
            return false;
        }
        var $dailyBetAmount = $('#moDailyBetAmount');
        if($dailyBetAmount.val() == ""){
            $dailyBetAmount.next().text("请填写启始金额");
            $dailyBetAmount.focus();
            return false;
        }
        var $validAccountCount = $('#moValidAccountCount');
        if($validAccountCount.val() == ""){
            $validAccountCount.next().text("请填写有效人数");
            $validAccountCount.focus();
            return false;
        }
        if($validAccountCount.val() < 0 || $validAccountCount.val() > 3000){
            $validAccountCount.next().text("启始金额分配范围 0 ~ 3000");
            $validAccountCount.focus();
            return false;
        }

        var d = serializeObject('#modifydailyForm');
        ajaxExt({
            url:"/daily/updateDailyAcc",
            type:"post",
            data: d,
            dataType:'json',
            callback:function(data){
                $.alert(data);
                $("#dailyAccSearch").click();
            }
        });
        return false;
    });

    //连接开户（用户类型改变）
    $("#codeUserType").change(function(){
        var val = $(this).val();
        var m = gloas.maxRatio;
        m = m <= gloas.noneMinRatio?m : gloas.noneMinRatio;
        if (val == 0) {
            m = m <= gloas.playerMaxRatio?m : gloas.playerMaxRatio;
        }
        var a = '';
        for(var n=m;n>=0;n = Math.sub(n,gloas.stepRatio)){
            a += '<option value="'+n+'">' + n + '%</option>';
        }
        $("#codeRebateRatio").html(a);
    });

    //团队概况查询
    $("#teamInfoSearchSubmit").click(function(){
        $("#teamInfoStatus").val(0);
        $("#teamInfoAccount").val('');
        $("#teamInfoSearchForm").submit();
    });

    //团队概况
    $("#teamInfoSearchForm").submit(function(){
        var d = serializeObject(this);
        ajaxExt({
            url:"/user/getTeamInfo",
            type:"post",
            data: d,
            dataType:'json',
            callback:function(data) {
                var trs = "";
                var ds = data.rows;
                hs.pagination.refleshPages(data.total, "teamInfoSearchForm");
                for(var n in ds) {
                    var d = ds[n];
                    trs+='<tr>';
                    var acc = null;
                    if(d.userType == 0) {
                        acc = d.account;
                    } else {
                        acc ='<a href="javascript:nextTeamInfo(\''+ d.account +'\')" class="fontColorTheme">'+d.account+'</a>';
                    }
                    trs+='<td>'+ acc +'</td>';
                    trs+='<td>'+ d.teamCount +'</td>';
                    trs+='<td>'+ d.teamAmount +'</td>';
                    trs+='<td>'+ d.rechargeAmount +'</td>';
                    trs+='<td>'+ d.drawingAmount +'</td>';
                    trs+='<td>'+ d.win +'</td>';
                    /*
                    trs+='<td>'+ d.registerNum +'</td>';
                    trs+='<td>'+ d.firstRechargeNum +'</td>';
                    */
                    trs+='<td>'+ d.teamCount +'</td>';
                    trs+='</tr>';
                }
                $("#teamInfoListTable").html(trs);

                if(data.length == 0) {
                    $("#teamInfoNullMsg").show();
                } else {
                    $("#teamInfoNullMsg").hide();
                }

                var m = '<span>当前用户位置：</span>';
                var menuData = data.obj;
                for(var index in menuData) {
                    var menu = menuData[index];
                    //第一个则以搜索一样的方式请求
                    if(index == 0){
                        m += '<a href="javascript:nextTeamInfo(\'\');" class="fontColorTheme">'+ menu +'</a>';
                    } else {
                        m += '<span>&gt;</span>';
                        m += '<a href="javascript:nextTeamInfo(\''+ menu +'\');" class="fontColorTheme">'+ menu +'</a>';
                    }
                }
                $("#testing2").html(m);
            }
        });
        return false;
    });

    //连接开户（提交）
    $('#extCodeForm').submit(function(){

        if($('#extAddress').val() == ""){
            $($('#extAddress').next()).text("请输入推广渠道");
            $('#extAddress').focus();
            return false;
        }
        var d = serializeObject('#extCodeForm');
        ajaxExt({
            url:"/openUser/createExtCode",
            type:"post",
            data: d,
            dataType:'json',
            callback:function(data){
                $.alert('操作成功');
                initExtCode();
            }
        });
        return false;
    });

    $('#selectProvince').change(function(){
        var args = "provinceId="+$(this).val();
        Service("/info/getCity","GET",args,1,function(data){
            var opts = '<option value="0">请选择城市</option>';
            for(var n in data){
                var i = parseInt(n)+1;
                var d = data[n];
                opts+='<option value="'+i+'">'+d.cityname+'</option>';
            }
            $('#selectCity').html(opts);
        });
    });

    //安全中心改密码
    $("#changePassWord").click(function() {
        if(showSafeDialog()){
            return;
        }
        if(validate.oldPsw.check() && validate.newPsw.check() && validate.newPswConfirm.check()){
            var args = $('#modLoginPwd').serialize();
            Service("/safe/changePassWord", "POST", args, 1, function(data) {
                $.alert(data);
                $("#modLoginPwd")[0].reset();
                $("#modLoginPwd .labelInput").removeClass('trueMsg');
            });
        }
    });

    //安全中心-改资金密码
    $("#changeSafeWord").click(function(){
        if(showSafeDialog()){
            return;
        }
        if(validate.oldSafePsw.check() && validate.newSafePsw.check('newSafePass') && validate.newSafePswConfirm.check()){
            var args = $('#modAccountPwd').serialize();
            Service("/safe/changeSafeWord","POST",args,1,function(data){
                $.alert(data);
                $("#modAccountPwd")[0].reset();
                $("#modAccountPwd .labelInput").removeClass('trueMsg');
                gloas.hasSafeWord = true;
            });
        }
    });

    //安全中心-找回资金密码
    $("#dofindSafeQA").click(function(){
        if(showSafeDialog()){
            return;
        }
        if(validate.newSafePsw.check('safePassWord')){
            var args = $('#findSafeQa').serialize();
            Service("/safe/changeSafeByQuestions","POST",args,1,function(data){
                $.alert(data);
                $("#findSafeQa")[0].reset();
                $("#findSafeQa .labelInput").removeClass('trueMsg');
            });
        }
    });

    //下级分红查询
    $("#dividendSearch").click(function(){
        var args = $('#dividendSearchArgs').serialize();
        ajaxExt({
            url:'/contract/list',
            method:"get",
            data: args,
            dataType : 'json',
            callback:function(data) {
                $('#dividendListHeader').html('');
                hs.pagination.refleshPages(data.total, "dividendSearchArgs");
                $("#dividendListTable tr:gt(0)").remove();
                var rows = data.rows;
                if(rows.length>0){
                    $("#dividendNullMsg").css("display","none");
                }else{
                    $("#dividendNullMsg").css("display","block");
                }
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"tableDetail\"></tr>");
                    $(tr).append("<td>"+rows[i].account+"</td>");
                    $(tr).append("<td>"+rows[i].startDate+"</td>");
                    $(tr).append("<td>"+rows[i].endDate+"</td>");
                    $(tr).append("<td>"+rows[i].cumulativeSales+"</td>");
                    $(tr).append("<td>"+rows[i].dividend+"</td>");
                    $(tr).append("<td>"+rows[i].cumulativeProfit+"</td>");
                    $(tr).append("<td>"+rows[i].dividendAmount+"</td>");
                    switch(rows[i].status){
                        case 0:  $(tr).append("<td>尚未发放</td>");break;
                        case 1: $(tr).append("<td>发放完毕</td>");break;
                        case 2: $(tr).append("<td>不需分红</td>");break;
                        case 3:  $(tr).append("<td>逾期未发放</td>");break;
                        case 4: $(tr).append("<td>強制发放完毕</td>");break;
                    }
                    if(rows[i].status==0){
                        $(tr).append("<td id=\"tdStatus_131\"><a href='javascript:void(0);' class='fontColorTheme' onclick=\"payout('"+rows[i].id+"','"+rows[i].account+"','"+rows[i].parentAccount+"','"+rows[i].dividendAmount+"')\">分红</a></td>");
                    }else{
                        $(tr).append("<td id=\"tdStatus_131\"></td>");
                    }

                    $('#dividendListHeader').append(tr);
                }

            }
        })
    });


    if (needBindCard && needBindCard == 0) {
        $(".nav[data-id='#myCard']").click();
    } else if($.inArray(gloas.tabId, tabs) >= 0) {
        $(".centreNavDetail[data-id='" + gloas.tabId + "']").click();
        $(".nav[data-id='" + gloas.tabId + "']").click();
    } else {
        //第一个标签点击
        $(".centreNavDetail[data-id]:first").click();
    }
});

//切换到设置资金密码页面
function showSafeDialog(){
    if(!gloas.hasSafeWord){
        //安全中心
        layer.open({
            type: 1,
            skin: 'setSafePswLayer',
            shift: 5,
            area:'755px',
            title:false,
            content:$('#setSafePassword')
        });
        return true;
    }
    return false;
}

function nextTeamInfo(account) {
    $("#teamInfoStatus").val(1);
    $("#teamInfoAccount").val(account);
    $("#teamInfoSearchForm").submit();
}

//用户列表-站内信对话框
var contactType = 1;
function contactUser(account) {
    contactType = 1;
    $('.msgContactBox .labelInput').removeClass('errorMsg').removeClass('trueMsg').next().text('');
    $("#messageRever").val(account).prop('readonly','readonly');
    $("#messageTitle").val("");
    $("#messageSendContent").val("");
    $("#msgErrorWarn").text("");
    $('.errorWarn').text('');
    layer.open({
        type: 1,
        skin: 'msgUserContactLayer',
        shift: 5,
        area:'480px',
        title:'发送消息',
        content:$('#messageContactDiv')
    });

}
//消息管理-联系上下级
function contact(type) {
    $('.msgContactBox .labelInput').removeClass('errorMsg').removeClass('trueMsg').next().text('');
    $("#messageTitle").val("");
    $("#messageSendContent").val("");
    $("#msgErrorWarn").text("");
    $('.errorWarn').text('');
    if ('up' == type) {
        contactType = 0;
        $("#messageRever").attr({"readonly":"readonly","tabindex":"-1"}).val("上级");
    } else if ('dw' == type) {
        contactType = 1;
        $("#messageRever").removeAttr("readonly").val("");
    }
    layer.open({
        type: 1,
        skin: 'msgUserContactLayer',
        shift: 5,
        area:'480px',
        title:'发送消息',
        content:$('#messageContactDiv')
    });
}

//站内信提交
function sendMessage() {
    if(validate.msgUserName.check() && validate.msgTitle.check() && validate.msgContent.check()){
        var rever = $("#messageRever").val();
        var title = $("#messageTitle").val();
        var sendContent = $("#messageSendContent").val();
        Service("/message/messageSend","POST",{"rever":rever, "sendContent":sendContent, "title":title, "contactType":contactType},1,function(data){
            layer.closeAll();
            $("#messageSearch").click();
        });
    }
}

//用户列表-下级充值对话框
function accountRecharge(account){
    if (showSafeDialog()) {
        return;
    }
    $('#targetUser').val(account);
    layer.open({
        type: 1,
        skin: 'accountRegLowerLayer',
        shift: 5,
        area:['860px','310px'],
        title:'下级充值',
        content:$('#accountRegLower')
    });

    $('#rechargeStyle option').eq(0).prop('selected',true);
    $('#rechargeStyle0').show().siblings().hide();
    //用户列表-下级充值形式select对应的右侧提示变化
    $('#rechargeStyle').on('change',function(){
        var IDname = '#rechargeStyle' + $(this).val();
        $(this).attr('data-id',IDname);
        $(IDname).show().siblings().hide();
    });

}

//用户列表-下级充值提交
function doDownRecharge(){
    $("#accountRegLowerTip").text("");
    if (showSafeDialog()) {
        return;
    }
    if ($('#chargeamount').val()=="") {
        $("#accountRegLowerTip").text("转账金额不能为空");
        $('#chargeamount').focus();
        return;
    }

    if ($('#sourceUserSafePassword').val()=="") {
        $("#accountRegLowerTip").text("资金密码不能为空");
        $('#sourceUserSafePassword').focus();
        return;
    }

    if ($('#sourceUserSafePassword').val().length<8) {
        $("#accountRegLowerTip").text("资金密码必须达到8位");
        $('#sourceUserSafePassword').focus();
        return;
    }
    var remark;
    var rechargeStyle = $('#rechargeStyle').val();
    if (rechargeStyle == 1) {
        remark = "工资";
    } else if (rechargeStyle == 2) {
        remark = "团队活动";
    } else if (rechargeStyle == 3) {
        remark = "周期分红";
    } else if (rechargeStyle == 4) {
        remark = $('input:radio[name=remark]:checked').val();
        if (remark && remark == "0") {
            remark = $("#remarkOtherReasion").val();
        }
    }
    /*
    if (!remark) {
        $("#accountRegLowerTip").text("上级充值必须选择备注原因");
        return;
    }
    if (remark.length > 5) {
        $("#accountRegLowerTip").text("备注用途不得超过5个字");
        return;
    }
    if (checkHadSpecialChar(remark)) {
        $.alert("备注用途不能包含特殊字符！");
        return;
    }
    */

    $('#accountRegLowerBtn').css('pointer-events','none');

    var param = serializeObject('#rechargeLowerForm');
    param['remark'] = remark;

    ajaxExt({
        url:'/recharge/rechargeLower',
        type:'post',
        dataType:'json',
        data:param,
        callback:function(data){
            $("#rechargeLowerForm")[0].reset();
            $("#accountRegLowerTip").text("");
            $.alert(data);
            initUserList();
        },
        complete:function(){
            $('#accountRegLowerBtn').css('pointer-events','all');
        }
    });
}

function changeDailyWagesStatus(account, status) {
    Service('/user/updateDailyWagesStatus',"POST",{account:account, dailyWagesStatus:status},1,function(data){
        $.alert(data);
        $("#userSearchSubmit").click();
    });
}

//修改日薪规则弹框
function modifyDailyRule(id, account, rate, betAmount, validAccountCount, limitAmount, lossStatus) {
    $('#modifydailyForm').find(".errorWarn").html("");
    document.getElementById('modifydailyForm').reset();
    var name = $(this).parents('tr').find('td:first-child').text();
    $('#moDailyId').val(id);
    $('#moDailyAccount').val(account);
    $('#moDailyRate').val(rate);
    $('#moDailyBetAmount').val(betAmount);
    $('#moValidAccountCount').val(validAccountCount);
    $('#moLimitAmount').val(limitAmount == 0 ? "" : limitAmount);
    $("#modifydailyForm input[name='lossStatus'][value='"+lossStatus+"']").prop('checked', 'checked');
    layer.closeAll();
    layer.open({
        type: 1,
        skin: 'dailyLayer',
        shift: 5,
        area:'900px',
        title:'修改日薪规则',
        content:$('#modifyDailyLayer')
    });
}

//用户列表-返点设置对话框
function showQueryRebateArea(account,niceName,rebateRatio,userType){
    $('#rebatePerson').text(account);
    $('#rebateNickName').text(niceName);
    $('#selfRebateRatio').html("<font color=\"red\">"+rebateRatio+"%</font>");
    layer.open({
        type: 1,
        skin: 'setQueryRebateLayer',
        shift: 5,
        area:['850px','225px'],
        title:'快速返点设置',
        content:$('#setQueryRebateArea')
    });

    var min = Math.add(parseFloat(rebateRatio),gloas.stepRatio);
    var max = gloas.maxRatio;
    if(userType==0){
        max = gloas.maxRatio > gloas.playerMaxRatio?gloas.playerMaxRatio:gloas.maxRatio;
    }
    $("#UserQuota").val(min);
    $("#UserQuota").spinner({min:min, max:max, step:0.1});
}

//备注
function showHomeRemarkArea(account,homeRemark){
    $("#remarkAccount").val(account);
    if(homeRemark==null){
        $("#homeRemark").val("");
    }else{
        $("#homeRemark").val(homeRemark);
    }
    layer.open({
        type: 1,
        skin: 'remarkLayer',
        shift: 5,
        area:['450px','260px'],
        title:'修改备注',
        content:$('#remarkDiv')
    });
}

function updateRemark(){
    var account = $("#remarkAccount").val();
    var homeRemark = $("#homeRemark").val();
    Service("/user/updateHremark","POST",{"account":account, "homeRemark":homeRemark},1,function(data){
        layer.closeAll();
        initUserList();
    });
}

//用户列表-提交返点设置
function doAdjustQuota(){ //调整用户的返点
    var args = "account="+$('#rebatePerson').text()+"&rebateRatio="+$('#UserQuota').val();
    ajaxExt({
        url:"/down/adjustQuota",
        type:"POST",
        data:args,
        dataType:'json',
        callback:function(data){
            $.alert(data);
            initUserList();
        }
    });
}

//用户列表-点击下级查询
function nextAccount(val){
    $("#nextAccount").val(val);
    $("#account").val('');
    initUserList();
}

//用户列表初始化
function initUserList(){
    //用户列表查询
    var d = serializeObject($("#userSearchForm"));
    ajaxExt({
        url:'/down/list',
        data:d,
        dataType:'json',
        callback:function(rel){
            hs.pagination.refleshPages(rel.total, "userSearchForm");
            //用户列表
            var users = rel.rows;
            var trs="";
            var teamBalance = 0;
            for(var index in users){
                var u = users[index];
                var onLineClass = u.isOnLine==1?'userOutlineIcon':'userOnlineIcon';
                var account  = '';
                var userType = '';
                teamBalance += parseFloat(u.teamAmount);
                if(u.userType == 1){
                    account='<a href="javascript:nextAccount(\''+ u.account +'\')" class="fontColorTheme">'+u.account+'</a>';
                    userType = '代理';
                } else {
                    account = '<span>'+u.account+'</span>';
                    userType = '会员';
                }

                //契约状态显示
                var contractStatusName ='';
                switch(u.contractStatus){
                    case 0:contractStatusName='确认契约中'; break;
                    case 1:contractStatusName='已签约'; break;
                    case 2:contractStatusName='已拒绝';break;
                    case 3:contractStatusName='已激活'; break;
                    case 4:contractStatusName='已关闭'; break;
                    case 8:contractStatusName='尚未签约'; break;
                    case 9:contractStatusName='已签约（系统）'; break;
                }

                trs+='<tr class="listDetail">';
                trs+='	<td class="operate userName">';
                trs+='		<label for="#">';
                trs+='			<i class="'+onLineClass+'"></i>';
                trs+=			account;
                trs+=			'—' + u.rebateRatio + '%' + '（'+ (u.isOnLine == 1 ? '<span style="color:gray">离线</span>' : '<span style="color:green">在线</span>') +'）';
                trs+='		</label>';
                trs+='</td>';
                trs+='<td>' + u.teamCount + '</td>';
                trs+='<td class="userAcctAmount fontColorTheme overflowEllipsis" title="' + u.amount +'">' + u.amount  +'</td>';
                trs+='<td class="userAcctAmount fontColorTheme overflowEllipsis" title="' + u.teamAmount +'">' + u.teamAmount +'</td>';
                trs+='<td class="userAcctAmount fontColorTheme overflowEllipsis" title="' + u.rebateRatio +'">' + u.rebateRatio +'</td>';
                trs+='<td>' + u.loginTime  +'</td>';
                if (gloas.dailyWagesOpen || gloas.dailyWagesTrans) {
                    //trs+='<td>' + (null == u.dailyRate ? (null != u.dailyRuleId ? '已开通' : '未签订') : (u.dailyRate + '%'))  +'</td>';
                }
                if(gloas.contractStatus){
                    //trs+='<td>' + contractStatusName  +'</td>';
                }
                if(u.homeRemark == null){
                    trs+='<td class="addRemark overflowEllipsis">';
                    trs+='<a href="javascript:showHomeRemarkArea(\'' + u.account  +'\');" class="fontColorTheme">添加备注</a>';
                }else{
                    trs+='<td class="addRemark overflowEllipsis" title="'+ u.homeRemark  +'">';
                    trs+=u.homeRemark;
                }
                trs+='</td>';
                trs+='<td class="operate userOperateList">';
                trs+='<a href="javascript:;" class="fontColorTheme userSelect">操作</a>';

                trs+='<div class="userOption" style="display:none;"><a href="/game/index?tabId=' + u.account  +'" class="fontColorTheme">投注记录</a>';
                if(u.parentAccount == gloas.currentAccount){
                    trs+='<a href="javascript:accountRecharge(\'' + u.account  +'\');" class="fontColorTheme">下级充值</a>';
                    var showRebateDialog = 'showQueryRebateArea(\''+ u.account +'\',\''+ u.niceName +'\','+ u.rebateRatio +','+ u.userType +')';
                    trs+='<a href="javascript:'+showRebateDialog+';" class="fontColorTheme tableOperate">返点调配</a>';
                }

                /*
                //直接下级
                if(u.parentAccount == gloas.currentAccount){

                    trs+='<a href="javascript:contactUser(\'' + u.account  +'\');" class="fontColorTheme">站内信</a>';

                    //开通功能
                    if(gloas.accountRecharge){
                        trs+='<a href="javascript:accountRecharge(\'' + u.account  +'\');" class="fontColorTheme">下级充值</a>';
                    }

                    if(gloas.contractStatus&&u.contractStatus!=9){
                        trs+='<a href="/contract/setContractRule?account=' + u.account  +'" class="fontColorTheme tableOperate" >契约</a>';
                    }

                    var showRebateDialog = 'showQueryRebateArea(\''+ u.account +'\',\''+ u.niceName +'\','+ u.rebateRatio +','+ u.userType +')';
                    if(u.rebateRatio<gloas.maxRatio && (u.rebateRatio<gloas.playerMaxRatio || u.userType == 1) ) {
                        trs+='<a href="javascript:'+showRebateDialog+';" class="fontColorTheme tableOperate">返点调配</a>';
                    }

                    if(u.rebateRatio>gloas.noneMinRatio && u.userType==1){
                        trs+='<a href="javascript:;" class="fontColorTheme" onclick="showQuotaDistArea(\''+u.account+'\',\''+u.rebateRatio+'\')">配额分配</a>';
                    }

                    if (gloas.dailyWagesStatus) {
                        if (gloas.dailyWagesTrans) {// 如果有传递权限，则显示“开通工资”
                            if (u.dailyWagesStatus == 0) {
                                trs+='<a href="javascript:;" class="" disabled="true" style="color:#999">开通工资</a>';
                            } else if (u.dailyWagesStatus == 1) {
                                trs+='<a href="javascript:;" class="fontColorTheme" onclick="changeDailyWagesStatus(\''+u.account+'\',\'0\')">开通工资</a>';
                            }
                        } else if (gloas.dailyWagesOpen) {// 如果有开通权限，则显示“日薪管理”
                            trs+='<a href="javascript:;" class="fontColorTheme" onclick="dailyManagerOpen(\''+u.account+'\',\''+u.dailyWagesStatus+'\')">日薪管理</a>';
                        }

                    }

                }
                */
                if(u.homeRemark != null){
                    trs+='<a href="javascript:showHomeRemarkArea(\'' + u.account  +'\',\''+u.homeRemark+'\');" class="fontColorTheme">修改备注</a>';
                }
                trs+='<a href="/report/index?tabId=settlement&account='+u.account+'" class="fontColorTheme">帐变</a>';

                trs+='</div></td>';
                trs+='</tr>';
            }
            $("#userListTable").html(trs);
            $('#teamBalance').html(teamBalance);


            //显示操作弹窗
            $('.userOperateList').hover(function(){
                $(this).find('.userOption').show();
            }, function(){
                $(this).find('.userOption').hide();
            });

            if(users.length==0){
                $("#UserNullMsg").show();
            } else {
                $("#UserNullMsg").hide();
            }

            var m = '<span>当前用户位置：</span>';
            var menuData = rel.obj;
            for(var index in menuData){
                var menu = menuData[index];
                //第一个则以搜索一样的方式请求
                if(index == 0){
                    m += '<a href="javascript:nextAccount(\'\');" class="fontColorTheme">'+ menu +'</a>';
                } else {
                    m += '<span>&gt;</span>';
                    m += '<a href="javascript:nextAccount(\''+ menu +'\');" class="fontColorTheme">'+ menu +'</a>';
                }
            }
            $("#testing").html(m);
        }
    });
}

// 日薪管理快捷方式
function dailyManagerOpen(account, dailyWagesStatus) {
    $("#dailyManager").click();
    if (dailyWagesStatus == 0) {// 已开通，则直接到日薪管理，查询当前用户
        $("#dailyAccForm input[name='account']").val(account);
        $("#dailyAccSearch").click();
    } else if (dailyWagesStatus == 1) {// 未开通，则直接到日薪管理，新增下级用户
        $("#dailyBtn3").click();
        $("#dailyForm #dailyAccount").val(account);
    }
}

//添加用户初始化
function initAddUser(){
    $("#userAddForm")[0].reset();
    $("#addUserType").val(1).change();
    ajaxExt({
        url:'getQuota',
        dataType:'json',
        callback:function(rows){
            //配额表
            var trs = "";
            var index = 0;
            for(var n in rows){
                var d = rows[n];
                if(index == 0){
                    trs+="<tr>";
                }
                trs+="<td>"+ d.rebateRatio +"</td>";
                trs+="<td>"+ d.num +"</td>";

                //最后一个
                if(index == 0){
                    if(n == rows.length-1){
                        trs+="<td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                    index = 1;
                } else {
                    trs+="</tr>";
                    index = 0;
                }
            }
            $('#myQuotaTable').html(trs);
        }
    });
}

//连接开户
function initExtCode(){
    $("#extCodeForm")[0].reset();
    $("#codeUserType").val(0).change();
    ajaxExt({
        url:'listUserExtCode',
        dataType:'json',
        callback:function(rows){
            //链接表
            var trs = "";

            for(var n in rows){
                var index = parseInt(n)+1;
                var d = rows[n];

                var userType = d.userType==0?'会员':'代理';
                var validTime = d.flag==0?'已过期':(d.validTime==0?'永久':d.validTime+'天');

                trs+='<tr>';
                trs+='<td class="acctLinkNum"><span>'+index+'</span></td>';
                trs+='<td class="acctLinkContent">';
                trs+='	<p class="acctLink">';
                trs+='		<span>返点：</span>';
                trs+='		<span class="fontColorTeal acctRebate">'+d.rebateRatio+'%</span>';
                trs+='		<span>，类型：</span><span class="fontColorTeal acctType">'+userType+'</span>';
                trs+='		<span>，创建时间：</span><span class="fontColorTeal createTime">'+d.createTime+'</span>';
                trs+='		<span>，有效期：</span><span class="fontColorTeal validTime">'+validTime+'</span>';
                trs+='		<span>，目前注册次数：</span><span class="fontColorTeal currRegCount">'+d.registNum+'</span>';
                trs+='		<span>，推广渠道：</span><span class="fontColorTeal currRegCount">'+d.extAddress+'</span>';
                trs+='	</p>';
                trs+='	<p class="acctLink">';
                trs+='		<span class="linkTitle">链接地址：</span>';
                trs+='		<span class="fontColorTeal linkAddr">'+d.registAddress+'</span>';
                trs+='	</p>';
                trs+='	<p class="acctLinkBtn">';
                trs+='		<a href="javascript:void(0);" onclick="copyToClipBoard(\''+ d.registAddress +'\')" class="btn copyBtn">复制链接</a>';
                trs+='		<a href="javascript:delUserExtCode(\''+d.id+'\');" class="btn deleteBtn">删除链接</a>';
                trs+='	</p>';
                trs+='</td>';
                trs+='<td class="acctLinkQRcode" data-address="'+d.registAddress+'"></td>';
                trs+='</tr>';

            }
            $('#extCodeTable').html(trs);

            //循环生成表格中每个链接的二维码
            $("#extCodeTable td[data-address]").each(function(){
                $(this).qrcode({text: $(this).attr('data-address'), width:75, height:80});
            });

            //旧数据遗留
            if (rows.length > 10){
                $("#extCodeTable .acctLinkNum").css('width', '128px');
            } else if (rows.length > 100) {
                $("#extCodeTable .acctLinkNum").css('width', '192px');
            }
        }
    });
}

//消息管理
function initMsg(){
    ajaxLoad('msgTableBox','/message/messageTable', $('#messageForm').serialize(), function() {
        hs.pagination.refleshPages(1, 'messageForm');
    });
}

//安全中心-个人信息提交
function setInformation(){
    var args = $('#setInformation').serialize();
    Service("/info/setInformation","POST",args,1,function(data){
        $.alert(data);
    });
}

//银行卡
var bindCardCount = '';
function initCard(){
    $("#myCard>div").hide();
    $('#binCardForm')[0].reset();
    $('#verifyCard')[0].reset();
    if($('#selectBank').children().length == 0){ //首次加载获得银行下拉列表
        Service("/info/getBankAll","GET",null,1,function(data){
            var ops = '<option value="0">请选择</option>';
            for(var n in data){
                var d = data[n];
                ops+='<option value="'+d.id+'">'+d.title+'</option>';
            }
            $('#selectBank').html(ops);
        });
    }

    if($('#selectProvince').children().length == 0){ //首次加载获得省份列表
        Service("/info/getProvinceAll","GET",null,1,function(data){
            var ops = '<option value="0">请选择</option>';
            for(var n in data){
                var d = data[n];
                ops+='<option value="'+d.provid+'">'+d.provname+'</option>';
            }
            $('#selectProvince').html(ops);
        });
    }

    if(gloas.lockStatus){
        $('.lockCard').text("已锁定");
        $('.lockCard').addClass("disabled");
    } else {
        $('.lockCard').text("锁定银行卡");
        $('.lockCard').removeClass("diasbled");
    }

    Service("/user/showCard","GET",null,1,function(data){
        $("#hasCardNum").text(data.length);

        bindCardCount = data.length;
        $('#safeWordBox').remove();
        if(data.length == 0){
            $(".firstBindCard").show();
            var div = '<div id="safeWordBox"><span class="labelTitle">资金密码：</span><input type="password" class="labelCond" id="safeWord2" name="safeWord" placeholder="请输入您的资金密码" /></div>';
            $('#BindCardBtnBox').before(div);
        } else {
            $(".myCardInfo").show();
        }
        var flag = false;
        var trs = '';
        var ops = '';
        var lockS = gloas.lockStatus?'已锁定':'正常';

        for(var i in data){
            var d = data[i];
            trs+='<tr class="listDetail">';
            trs+='<td>'+d.niceName+'</td>';
            trs+='<td>'+d.address+'</td>';
            trs+='<td>************'+d.card+'</td>';
            trs+='<td>'+d.createTime+'</td>';
            trs+='<td>'+lockS+'</td>';
            trs+='</tr>';

            ops+='<option value="'+d.id+'">************'+d.card+'</option>';
            $('#myCardBody').html(trs);
            $('#selectHistoryCard').html(ops);
        }
        if(data.length>0){
            $("#niceName").attr("readonly",true);
        } else {
            $("#niceName").attr("readonly",false);
        }
    });
}

function beginBind(){
    if(showSafeDialog()){
        return;
    }
    $('#myCard>div').hide();
    $('.bindCardInfo').show();
}

function checkOldCard(){
    var d = serializeObject("#verifyCard");
    if(d.id == 0){
        $.alert("请选择要验证的银行卡");
        return;
    }
    if(d.oldNiceName == ""){
        $.alert("请输入开户人姓名");
        return;
    }
    if(d.oldCard == ""){
        $.alert("请输入银行卡号");
        return;
    }
    if(d.safeWord == ""){
        $.alert("请输入资金密码");
        return;
    }

    var args = $('#verifyCard').serialize();
    Service("/user/checkOldCard","POST",args,1,function(data){
        if(data.valid == 0){
            $.alert("验证信息不正确");
            return;
        }
        $("#niceName").val(d.oldNiceName);
        $('#myCard>div').hide();
        $('.bindCardInfo').show();
    });
}

function BindCardconfirm(){
    if($("#selectBank").val()==0){
        $.alert("请选择开户银行");
        return;
    }
    if($('#selectProvince').val() == "0"){
        $.alert("请选择开户银行区域");
        return;
    }
    if($('#selectCity').val() == "0"){
        $.alert("请选择开户银行城市");
        return;
    }
    if($('#address').val() == ""){
        $('#address').attr("placeholder","请输入支行名称");
        $('#address').focus();
        return;
    }
    if($('#niceName').val() == ""){
        $('#niceName').attr("placeholder","请输入开户人姓名");
        $('#niceName').focus();
        return;
    }
    if(validate.bankCard.check() && validate.bankCardConfirm.check()){
        if(bindCardCount == 0){
            var safePassword = $('#safeWord2').val();
            if(!safePassword){
                $('#safeWord2').attr("placeholder","请输入资金密码");
                $('#safeWord2').focus();
                return;
            }
            ajaxExt({
                url:'/user/verifySafePassword',
                type:'post',
                dataType:'json',
                data:{"safePassword":safePassword},
                callback:function(rel){
                    $('#myCard>div').hide();
                    $('.confirmCardInfo').show();
                }
            });
        }else{
            $('#myCard>div').hide();
            $('.confirmCardInfo').show();
        }

        $('#confirmCardInfoTable tr:eq(0) td:eq(1)').text($('#selectBank option:selected').text());
        $('#confirmCardInfoTable tr:eq(1) td:eq(1)').text($('#selectProvince option:selected').text());
        $('#confirmCardInfoTable tr:eq(2) td:eq(1)').text($('#selectCity option:selected').text());
        $('#confirmCardInfoTable tr:eq(3) td:eq(1)').text($('#address').val());
        $('#confirmCardInfoTable tr:eq(4) td:eq(1)').text($('#niceName').val());
        $('#confirmCardInfoTable tr:eq(5) td:eq(1)').text($('#card').val());
    }
}

function addBindCard(){
    if(gloas.lockStatus){
        $.alert("已锁定!不能进行绑卡操作!");
        return;
    }

    if(showSafeDialog()){
        return;
    }

    if($('#myCardBody tr').length>=5){
        $.alert("您已经绑定了5张卡了,不能再绑定了!");
        return;
    }

    $('#myCard>div').hide();
    $('.historyCardVerify').show();
}

function doLockCard() {
    if(gloas.lockStatus){
        return;
    }
//	args = args.substring(0,args.length-1);
    Service("/user/stopCard","GET",null,1,function(data){
        $.alert(data);
        gloas.lockStatus = true;
        initCard();
    });
}

function doBindCard(){
    var address = $('#selectProvince option:selected').text() + $('#selectCity option:selected').text();

    var d = serializeObject('#binCardForm');
    d.address = address+d.address;
    d.address = d.address.replace(/\s+/g,"");

    if(bindCardCount > 0){
        var oldCardInfo = serializeObject('#verifyCard');
        //验证数据和新数据合并
        for(var n in oldCardInfo){
            d[n] = oldCardInfo[n];
        }
    }

    ajaxExt({
        url:'/user/bindCard',
        type:'post',
        dataType:'json',
        data:d,
        callback:function(rel){
            initCard();
        }
    });
    return false;

}

//数据校验
function checkMoney(obj) {
    var me = obj,v = me.value,index;
    me.value = v = v.replace(/^\.$/g, '');
    index = v.indexOf('.');
    if (index > 0) {
        me.value = v = v.replace(/(.+\..*)(\.)/g, '$1');
        if(v.substring(index + 1, v.length).length > 2) {
            me.value= v  = v.substring(0, v.indexOf(".") + 3);
        }
    }
    me.value = v = v.replace(/[^\d|^\.]/g, '');
    me.value = v = v.replace(/^00/g, '0');
};

function checkHadSpecialChar(text) {
    for (var i in specicalStr) {
        if (text.indexOf(specicalStr[i]) >= 0) {
            return true;
        }
    }
    return false;
}


function inputNumber(obj){
    obj.value = obj.value.replace(/\D/g,'');
}

//只能填写字母或数字
function inputNumWord(obj){
    obj.value=obj.value.replace(/\W/g,'');
}

function showQuotaDistArea(account,rebateRatio){
    $('#lastOne').text('');
    $('#quotaDistTable tr:gt(0)').each(function(){
        $(this).remove();
    });
    layer.open({
        type: 1,
        skin: 'quotaDistLayer',
        shift: 5,
        area:['850px','210px'],
        title:'配额分配',
        content:$('#quotaDistArea')
    });

    $('#quotaUserName').text(account);
    $('#myRebateRatio').text(rebateRatio+"%");

    var args = "account="+account;
    Service("/user/loadQuota","GET",args,1,function(data){ //加载返点个数
        for(var i = 0;i<data.length;i++){
            $('#quotaDistTable').append("<tr class=\"listDetail\"><td><span>该用户此返点</span><span class=\"fontColorTheme\">"+data[i].rebateRatio+"</span><span><font color=\"red\">%</font>的个数为<font color=\"#fd526f\">"+data[i].selfNum+"</font>个&nbsp;&nbsp;此返点您的剩余个数为</span><span class=\"fontColorTheme\">"+data[i].num+"</span>" +
                "<span>个</span></td><td><span>分配&nbsp;</span><input type=\"text\" class=\"selfRebateTotal\" name=\"count\" onkeyup=\"inputNum(this)\"><span>&nbsp;个</span></td></tr>");
        }
    });
}

function doSetUserQuota(ele){ //分配配额
    var args = "[";
    $('#quotaDistTable tr:gt(0)').each(function(){
        if($($($(this).children()[1]).children()[1]).val() != ""){
            args += "{\"account\":\""+$('#quotaUserName').text()+"\",\"" +
                "rebateRatio\":"+$($($(this).children()[0]).children()[1]).text()+",\"num\":"+$($($(this).children()[1]).children()[1]).val()+"},";
        }
    });
    args = args.substring(0,args.length-1);
    args += "]";
    if(args.length<5){
        $('#lastOne').text('请至少输入一项数据');
        return;
    }
    Service("/down/setQuota","POST",args,2,function(data){
        $.alert(data);
        $('#quotaDistArea').hide();
    });
}

function inputNum(obj){
    obj.value = obj.value.replace(/[^0-9-]/g,'');
}

//删除链接
function delUserExtCode(id){
    var args ="&id="+id;
    $.getJSON("/user/delExtCode",args,function(data){
        $.alert("操作成功！");
        initExtCode();
    });
}

function copyToClipBoard(address){
    try{
        window.clipboardData.setData("Text",address);
        $.alert("复制成功！");
    }catch(e){
        $.alert("您的浏览器不支持此功能，请手动复制！");
    }

}

function payout(id,account,parentAccount,dividendAmount){
    var args ="&id="+id+"&account="+account+"&parentAccount="+parentAccount+"&dividendAmount="+dividendAmount;
    $.getJSON("/contract/payout",args,function(data){
        if(data.status==200){
            tipLayer(data.content);

        }else{
            $.alert(data.content);
        }
    });
}
function tipLayer(data){
    var content = "<p class='lottTipLayerTitle'>温馨提示</p><div class='lottTipBox'><p class='msg'><i></i><span class='content'>" + data + "</span></p></div><div class='lottTipBtn'><a href='javascript:;' class='btn closeBtn'>关闭</a></div>";
    var index = layer.open({
        type: 1,
        skin: 'lottTipLayer',
        shift: 5,
        area: ['480px', '260px'],
        title: false,
        content: content,
        success: function () {
            $('.closeBtn').on('click',function(){
                layer.close(index);
                $('#dividendSearchArgs #dividendSearch').trigger('click');
            });
        },
        cancel:function(){
            $('#dividendSearchArgs #dividendSearch').trigger('click');
        }
    });
}