/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-10-18 16:05:46
 * @version $Id$
 */


	var oActivityTitle = document.getElementById("activity-title"),
		oActivityImg = document.getElementById("activity-img"),
		oActivityContent = document.getElementById("activity-content"),
		aActivityInfo = getElementsByClass("info");

		var params = getURIParams();
		if(!params){
			window.location.href = "index.html";
		}else{
			ajax({
				url : ASKURL + "/activity/byActId/"+params.ID,
				success : askInfoSuccess
			});
		}

		/*askInfoSuccess({
			  "content": "那倒是可能国际法的开始能够克服的数据库高科技双方都不挂科精神病的价格表副书记的看不惯就开始变得更快举报方式的空间办公室减肥的恐怖",
			  "id": 1,
			  "img": "img/me.jpg;img/test.jpg;img/test.jpg;img/me.jpg;img/test.jpg;img/test.jpg;img/me.jpg;img/test.jpg;img/test.jpg;",
			  "location": "西南大学",
			  "member": "你今年撒打开机房内啥飞机的",
			  "state": "string",
			  "time": "2017-10-18",
			  "title": "你上课多晶硅的富士康",
			  "userGrade": "2",
			  "userId": 1,
			  "userName": "幽影",
			  "userType": "学校"

		});*/
		var type = ["","管理员","二级团委","三级团委","团支部"];
		var kind = ["","区县","城市","城市"]
		function askInfoSuccess(data){
			if(data.id > 0){
				oActivityTitle.innerText = data.title;
				aActivityInfo[0].innerText = data.userName;
				/*aActivityInfo[1].innerText = type[data.userType];*/
/*				var state = "";
				if(data.state == 2){
					state = "审核通过";
				}else if(data.state == 1){
					state = "正在审核";
				}else{
					state = "审核失败";
				}
				aActivityInfo[2].innerText = state;*/
				aActivityInfo[1].innerText = data.time;
				aActivityInfo[2].innerText = data.location;
				aActivityInfo[3].innerText = data.participants;
                /*aActivityInfo[4].innerText = data.participantsNum;*/
				/*aActivityInfo[6].innerText = kind[data.userKind];*/
				var createTime = new Date(data.createTime);
				aActivityInfo[4].innerText = createTime.getFullYear()+"-"+(createTime.getMonth()+1)+"-"+createTime.getDate();

				//图片
				var html = "";
				data.img=data.img.substring(0,data.img.length-1);
				var imgUrl = data.img.split(";");

				for(var i=0;i<imgUrl.length;i++){
					html += '<div class="img-box">';
					html +=		'<img src="'+IMGURL+imgUrl[i]+'" alt="">';
					html += '</div>';
				}
				oActivityImg.innerHTML = html;
				//内容
				var contentList = data.content.split("\r\n");
				var content = "";
				for(var i=0;i<contentList.length;i++){
					var str = contentList[i].replace(/\s/g,"");
					content += "<p>"+str+"</p>";
				}
				oActivityContent.innerHTML = content;
			}else{
				oActivityTitle.innerText = "访问数据有误";
			}
		}

		resize();