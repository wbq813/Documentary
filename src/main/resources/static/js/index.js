/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-10-18 13:10:55
 * @version $Id$
 */

 window.onload = function(){
		var oHtml = document.getElementsByTagName('html')[0];

			//通过标签名('')
			run();//先执行一次abc函数
			window.onresize =run;
			function run(){
				var w = window.innerWidth//浏览器窗口大小
				var font = w/100;
				font = Math.min(10,font);//取最小值，限定最大值(10以下就OK)
				font = Math.max(6,font);//取最大值,限定最小值
				oHtml.style.fontSize = font + 'px';
			}
	}

	var oTopBar = document.getElementById("topbar"),
		oDistrictActivity = document.getElementById("district-activity"),
		oCompanyActivity = document.getElementById("company-activity"),
		oSchoolActivity = document.getElementById("school-activity");

		//获取用户信息
	var strUserInfo = getCookie("userInfo");
	var userInfo = strUserInfo == "undefined"?null:JSON.parse(strUserInfo);
		//向topbar中插入元素
		console.log(userInfo)
	var html = '<ul class="clearfix">';
	if(userInfo){
		html += '<li><a href="">欢迎！'+userInfo.account+'</a></li>';
		if(userInfo.userType == 1){
			html += '<li><a href="manage.html">管理页</a></li>';
		}else if(userInfo.userType == 2){
			html += '<li><a href="upload-activity.html">发表活动</a></li>';
			html += '<li><a href="manage.html">管理页</a></li>';
		}else if( userInfo.userType == 3){
			html += '<li><a href="upload-activity.html">发表活动</a></li>';
			html += '<li><a href="user-center.html">个人中心</a></li>';
			html += '<li><a href="manage.html">管理页</a></li>';
		}else{
			html += '<li><a href="upload-activity.html">发表活动</a></li>';
			html += '<li><a href="user-center.html">个人中心</a></li>';
		}
		html += '</ul>';
		oTopBar.innerHTML = html;
	}else{
		html += '<li><a href="login.html">用户登录</a></li>'
		html += '</ul>';
		oTopBar.innerHTML = html;
	}
	
	//请求数据
	ajax({
		url : "http://cqgqt.xenoeye.org:443/activity/actIndex",
		data : {},
		success : askInfoSuccess
	});

	//获取活动信息
	function askInfoSuccess(data){
		//区县活动
		var html1 = "" ,html2 = "" ,html3 = "";
		for(var i=0;i<data.district.length;i++){
			html1 += '<div class="activity-box">';
	    	html1 +=	'<a href="detail-activity.html?ID='+data.district[i].id+'" class="clearfix">';
	    	html1 +=		'<img src="http://cqgqt.xenoeye.org:9192'+data.district[i].img.split(";")[0]+'" alt="">';
	    	html1 +=		'<div class="title">'+data.district[i].title+'</div>';
	    	html1 +=	'</a>'; 
	    	html1 +='</div>';
		}
		oDistrictActivity.innerHTML = html1;
		//城市活动
		for(var i=0;i<data.city.length;i++){
			html2 += '<div class="activity-box">';
	    	html2 +=	'<a href="detail-activity.html?ID='+data.city[i].id+'" class="clearfix">';
	    	html2 +=		'<img src="http://cqgqt.xenoeye.org:9192'+data.city[i].img.split(";")[0]+'" alt="">';
	    	html2 +=		'<div class="title">'+data.city[i].title+'</div>';
	    	html2 +=	'</a>';
	    	html2 +='</div>';
		}
		oCompanyActivity.innerHTML = html2;
		//学校活动
		for(var i=0;i<data.school.length;i++){
			html3 += '<div class="activity-box">';
	    	html3 +=	'<a href="detail-activity.html?ID='+data.school[i].id+'" class="clearfix">';
	    	html3 +=		'<img src="http://cqgqt.xenoeye.org:9192'+data.school[i].img.split(";")[0]+'" alt="">';
	    	html3 +=		'<div class="title">'+data.school[i].title+'</div>';
	    	html3 +=	'</a>';
	    	html3 +='</div>';
		}
		oSchoolActivity.innerHTML = html3;

	}




