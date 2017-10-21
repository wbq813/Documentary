/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-10-18 21:24:26
 * @version $Id$
 */

 	window.onload = function(){
		var oHtml = document.getElementsByTagName('html')[0];

			//通过标签名('')
			run();//先执行一次abc函数
			window.onresize =run;
			function run(){
				var w = window.innerWidth//浏览器窗口大小
				var font = w/60;
				font = Math.min(10,font);//取最小值，限定最大值(10以下就OK)
				font = Math.max(6,font);//取最大值,限定最小值
				oHtml.style.fontSize = font + 'px';
				oChart.resize();
				oBarChart.resize();
			}
	}
 	//获取用户信息cookie
	var strUserInfo = getCookie("userInfo");
	var userInfo = strUserInfo == "undefined"?null:JSON.parse(strUserInfo);
	//如果没有登录则跳转到登录页
	if(!userInfo){
		window.location.href = "login.html";
	}


	var oChart = echarts.init(document.getElementById('chart')); 
		var oBarChart = echarts.init(document.getElementById('bar-chart'));
		var aNames = [];
		var aPassNum = [];
		
		
 	var oMenu = document.getElementById("menu"),
		aMenuLi = oMenu.getElementsByTagName("li"),
		aMenuContent = getElementsByClass("menu-content"),
		currentLiIndex = 1;
		//初始显示0
		selected(0);

		//添加事件
		for(var i=0;i<aMenuLi.length;i++){
			aMenuLi[i].index = i;
			aMenuLi[i].onclick = function(){
				selected(this.index);
			}
		}

		function selected(index){
			if(index != currentLiIndex){
				aMenuLi[index].style.backgroundColor = "#444";
				aMenuLi[currentLiIndex].style.backgroundColor = "#666";
				aMenuContent[index].style.display = "block";
				aMenuContent[currentLiIndex].style.display = "none";
				currentLiIndex = index;
				switch(currentLiIndex){
					case 0:{
						ajax({
				 			url : ASKURL + "/users/login/",
				 			data : {
				 				account : userInfo.account,
				 				passwd : userInfo.passwd
				 			},
				 			success : function(data){
				 				if(data.id > 0){
						 				userInfo = data;
						 				var	option = {
											title : {
											    text: '发表活动统计',
											    x:'center',
											    fontSize:"2rem"
											},
											tooltip : {
											    trigger: 'item',
											    formatter: "{a} <br/>{b} : {c} ({d}%)"
											},
											toolbox: {
										        show : true,
										        feature : {
										            dataView : {show: true, readOnly: false},
										            saveAsImage : {show: true}
										        }
									    		},
											calculable : true,
											series : [
												    {
												        name:'活动量',
												        type:'pie',
												        radius : '55%',
												        center: ['50%', '60%'],
												        data:[
												        	 {
												            	value:userInfo.numPass, 
												            	name:'已发表 ' + userInfo.numPass ,
												            	itemStyle : {
												            		normal : {color : "rgba(0,255,0,0.8)"}
												            	}
												            },
												            {
												            	value:userInfo.numCheck, 
												            	name:'正在审核 ' + userInfo.numCheck,
												            	itemStyle : {
												            		normal : {color : "rgba(255,255,0,0.8)"}
												            	}
												            },
												            {
												            	value:userInfo.numNotPass, 
												            	name:'审核失败 ' + userInfo.numNotPass,
												            	itemStyle : {
												            		normal : {color : "rgba(255,0,0,0.5)"}
												            	}
												            },
												            {
												            	value:userInfo.numDelete, 
												            	name:'已删除 ' + userInfo.numDelete,
												            	itemStyle : {
												            		normal : {color : "rgba(255,0,0,0.8)"}
												            	}
												            }
												        ]
												    }
												]
											};
						 				// 使用刚指定的配置项和数据显示图表。 
										oChart.setOption(option); 
						 				setCookie("userInfo",JSON.stringify(data),12*3600*1000);
						 			}
					 			}
					 		});
					 		if(userInfo.id > 0 && userInfo.userType == 1){
						 		ajax({
						 			url : ASKURL + "/users/getBelongsNumPass?selfId="+userInfo.id,
						 			success : function(data){
						 				aNames = [];
						 				aPassNum = [];

						 				for(var i=0;i<data.length;i++){
						 					aNames.push(data[i].account);
						 					aPassNum.push(data[i].numPass);
						 				}
						 				var option2 = {
										    title : {
										        text: '二级团委组织活动发布量',
										        x : "center"
										    },
										    tooltip : {
										        trigger: 'axis'
										    },
										    toolbox: {
										        show : true,
										        feature : {
										            dataView : {show: true, readOnly: false},
										            saveAsImage : {show: true}
										        }

										    },
										    calculable : true,
										    xAxis : [
										        {
										            type : 'value',
										            boundaryGap : [0, 0.01]
										        }
										    ],
										    yAxis : [
										        {
										            type : 'category',
										            data : aNames
										        }
										    ],
										    series : [
										        {
										            name:'活动发布量',
										            type:'bar',
										            data:aPassNum,
										            itemStyle : {
										            	normal : {
										            		color : "#5dB431"
										            	}
										            },
										            markLine : {
										                data : [
										                    {type : 'average', name: '平均值'}
										                ]
										            }
										        },
										    ]
										};
						 				oBarChart.setOption(option2);
						 			},
						 			error : function(){
						 				oBarChart.setOption(option2);
						 			}
						 		});
						 	}
						 
						
					}break;
					case 1:{
						getSubAccountData();
					}break;
					case 2:{
						getCheckingData();
					}break;
					case 3:{

					}break;
				}
			}
		}

	
                    
 
	


	//下属账户管理--------
	//搜索事件
	var aDeleteSubData = [],  //下属账户信息
		aDeleteSub = [],  //删除按钮
		oSubAccountBox = document.getElementById("sub-account-box"),
		aSubAccount = [];
	//	oSearchSubInput = document.getElementById("search-sub-input",aMenuContent[1]),
		//oSearchSub = document.getElementById("search-sub");

		function getSubAccountData(){
			ajax({
				url : ASKURL + "/users/getUserByParentId?parentId="+userInfo.id,
				success : function(data){
					var html = "";
					for(var i=0;i<data.length;i++){
						html += '<div class="sub-account clearfix">';
                 		html += 	'<ul class="clearfix">';
                    	/*html +=			'<li>';
                    	html += 			'<span>ID:</span><span class="info">'+data[i].id+'</span>';
                    	html +=			'</li>';*/
                   		html += 		'<li>';
                   		html +=  			 '<span>账户名 : </span><span class="info">'+data[i].account+'</span>';
                   		html += 		'</li>';
                   		html += 		'<li>';
                   		html +=  			 '<span>组织名 : </span><span class="info">'+data[i].name+'</span>';
                   		html += 		'</li>';
                		html +=  	'</ul>';
                  		html +=		'<div class="delete-account">删除</div>';
             			html += '</div>';
					}
					oSubAccountBox.innerHTML = html;
					aDeleteSubData = data;
					aSubAccount = getElementsByClass("sub-account",oSubAccountBox);
					aDeleteSub = getElementsByClass("delete-account",oSubAccountBox);
					setDeleteSubEvent();
				}
			});
			
		}
		function setDeleteSubEvent(){
			for(var i=0;i<aDeleteSub.length;i++){
				aDeleteSub[i].index = i;
				aDeleteSub[i].onclick = function(){
					var index = this.index;
					if(confirm('是否删除 "'+aDeleteSubData[index].account+'" 下属账号')){
						ajax({
							type:"post",
							url : ASKURL + "/users/deleteUser?selfId="+userInfo.id+"&userId="+aDeleteSubData[this.index].id+"&_method=delete",
							success : function(data){
								console.log(data)
								if(data == 0){
									oSubAccountBox.removeChild(aSubAccount[index]);
								}else{
									alert("操作失败");
								}
							},
							error : function(){
								alert("操作失败");
							}
						});
					}
				}
			}
		}
		/*oSearchSub.onclick = function(){
			if(checkSubId()){
				
			}
		}
		
		function checkSubId(){
			if(oSearchSubInput.value.length == 0){
				oSearchActivityTip.innerText = "id不能为空";
				return false;
			}
			if(oSearchSubInput.value.length > 11){
				oSearchActivityTip.innerText = "id过大";
				return false;
			}
			return true;
		}

		
*/
	//---审核-----
	var aActivityBox = [],
		aPass = [],
		aStop = [],
		aData = [];

		//请求待审核数据
		function getCheckingData(){
			ajax({
				url : ASKURL + "/activity/bySelfId/"+userInfo.id,
				success : function(data){
					var html = "";
					for(var i=0;i<data.length;i++){
						html += '<div class="activity-box clearfix">'
          				html += 	'<a href="detail-activity.html?ID='+data[i].id+'" class="clearfix">';
          				html += 		'<div class="img-box">'
            			html += 			'<img src="'+IMGURL+data[i].img.split(";")[0]+'" alt="">';
            			html += 		'</div>';
           				html += 		'<div class="title">'+data[i].title+'</div>';
          				html += 	'</a>';
          				html += 	'<div class="operation">';
          				html += 		'<div class="pass">通过</div>';
           				html += 		'<div class="stop">禁止</div>';
          				html += 	'</div>';
         				html += '</div>';
					}
					aMenuContent[2].innerHTML = html;
					aActivityBox = getElementsByClass("activity-box",aMenuContent[2]);
					aPass = getElementsByClass("pass",aMenuContent[2]);
					aStop = getElementsByClass("stop",aMenuContent[2]);
					aData = data;
					setOperationEvent();
				}
			});
		}

		
		function setOperationEvent(){
			for(var i=0;i<aPass.length;i++){
				aPass[i].index = i;
				aPass[i].onclick = function(){
					if(confirm('是否同意 "'+aData[this.index].title+'" 活动发布?')){
						checkPass(1,this.index);
					}
				}
			}

			for(var i=0;i<aStop.length;i++){
				aStop[i].index = i;
				aStop[i].onclick = function(){
					if(confirm('是否禁止 "'+aData[this.index].title+'" 活动发布?')){
						checkPass(0,this.index);
					}
				}
			}
		}

		function checkPass(sign,index){
			ajax({
				type:"post",
				url : ASKURL + "/activity/checkPass/byId/"+userInfo.id+"/"+aData[index].id+"/"+sign+"?_method=put",
				success : function(){
					aMenuContent[2].removeChild(aActivityBox[index]);
				},
				error : function(){
					alert("操作失败");
				}
			});
		}




	//删除活动-----------
	/*var oActivityWrapper = document.getElementById("activity-wrapper"),
		//oActivityIdInput = document.getElementById("activity-id-input",aMenuContent[3]),
		//oSearchActivity = document.getElementById("search-activity"),
		//oSearchActivityTip = document.getElementById("search-activity-tip"),
		aOperationDelete = [],
		aActivityDeleteBox = [],
		aDeleteData = [];*/




		//搜索事件
		/*oSearchActivity.onclick = function(){
			if(checkActivityId()){

			}
		}
		function checkActivityId(){
			if(oActivityIdInput.value.length == 0){
				oSearchActivityTip.innerText = "id不能为空";
				return false;
			}
			if(oActivityIdInput.value.length > 11){
				oSearchActivityTip.innerText = "id过大";
				return false;
			}

			return true;
		}
		//只允许输入数字
		oActivityIdInput.onkeyup = function(){
			if(this.value.length = 1 && this.value == "0"){
				this.value = "";
			}
			this.value=this.value.replace(/\D/g,'');
		}
		

		aOperationDelete = getElementsByClass("delete",oActivityWrapper);
		setDeleteEvent();
		function setDeleteEvent(){
			for(var i=0;i<aOperationDelete.length;i++){
				aOperationDelete[i].index = i;
				aOperationDelete[i].onclick = function(){
					var index = this.index;
					if(confirm('是否删除"'+dataPass[index].title+'"活动')){
						ajax({
							type:"post",
							url : "http://cqgqt.xenoeye.org:443/activity/byId/"+userInfo.id+"/"+tempData.id+"?_method=delete",
							success : function(data){
								if(data.state == 4){
									oActivityWrapper.removeChild(aActivityDeleteBox[index]);
								}
							},
							fail : function(){
								alert("删除失败");
							}
						});
					}
				}
			}
		}*/
	
	
