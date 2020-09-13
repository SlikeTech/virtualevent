var ModalComponent = function(){
	var pRenderer_, callback_, objActModal;
	var uiModal_, uiModTitle_, uiModBody_; 
	var mData, videoPlayer_, pdfContainer_;
	var modelFor_;

	
	var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
		videoComponent_ = new VideoComponent();
		videoComponent_.init(this, videoCallback_.bind(this));
		pdfContainer_ = new PDFComponent();
		initUI();
	}

	var renderModal = function(_o){
		$(".modal-body.p0").html("");
		objActModal_ = _o;
		uiModTitle_.html(_o.title);

		if(_o.popup_type === "player"){
			modelFor_ = "player";
			videoComponent_.renderVideo($(".modal-body.p0")[0], {videoid:_o.action_link})
		}else{
			modelFor_ = "others";
			Utility.loader({url: _o.action_link, cb:mDataLoaded.bind(this)});
		}
	}

	var mDataLoaded = function(_o){
		mData = _o.data;
		//$(".modal-body.p0").html(card_ava_label(_o.data))
		//$(".modal-body.p0").html(ivid_iplay_label(_o.data))
		getHtml(_o.data)
		//debugger

	}


	var getHtml = function(_o){
		var s, t = _o.template;
		switch(t){
			case "poll":
			polls()
			break;

			case "staticpage":
			qna();
			
			break;

			case "agenda":
			agenda();
			break;

			case "playlist":
			playlist()
			break;

			case "resources":
			resources();
			break;


			case "businesscard" :
			//bcard()
			break;

			case "chatbox" :
			//checkBox()
			break;

		}

		
	}

	
	var polls = function(){
		mData.body[0].questions = JSON.parse(mData.body[0].questions);
		var q = mData.body[0].questions;
		var str = '<div class="feedback"><ul>'
		for(var i=0; i<q.length; i++){
			str += '<li><p>'+q[i].title+'</p>'
			var qa = q[i].answers
			for(var j=0; j<qa.length; j++){
				str += '<div class="form-check">';
				if(q[i].type === "radiobutton"){
					str += '<input class="form-check-input" type="radio" name="qa'+i+'" value="'+qa[j]+'">'
					str += '<label class="form-check-label" for="exampleRadios1">'+qa[j]+'</label>'
				}else if(q[i].type === "checkbox"){
					str += '<input type="checkbox" class="form-check-input" name="qa'+i+'" value="'+qa[j]+'" data-id=q_'+i+' checked>'
					str += '<label class="form-check-label" for="exampleCheck1">'+qa[j]+'</label>'
				}
				str += '</div>'
			}
			if(q[i].type === "star"){
				str += '<div class="rating">'
				for(var m=1; m<6; m++){
					str += '<input type="radio" name="rating" value="'+(6-m)+'"  id="'+(6-m)+'"><label for="'+(6-m)+'"></label>'
				}
				str += '</div>'
			}else if(q[i].type === "textarea"){
				str += '<div class="form-group">'
          		str += '<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea></div>'
        
			}
			str+='</li>'
		}
		str += '</ul><button id="postData" class="btn login_btn float-right mt-3">Submit</button></div>'
		$(".modal-body.p0").html(str);

		$("#postData").off("click").on("click", function(e){
			var ans = mData.body[0].questions;
			var t;
			for(var i=0; i<ans.length; i++){
				if(ans[i].type === "checkbox"){
					var tv = [];
					$(".modal-body.p0 [name=qa"+i+"]:checked").each(function(i, j){
						tv.push($(j).val())
					 })
					ans[i]["user_answer"] = tv;
					
				}else if(ans[i].type === "radiobutton"){
					t = $(".modal-body.p0 [name=qa"+i+"]:checked").val();
					if(t !== undefined){
						ans[i]["user_answer"] = [t];	
					}else{
						ans[i]["user_answer"] = [];
					}
				}else if(ans[i].type === "star"){
					t = $(".modal-body.p0 [name=rating]:checked").val();
					if(t !== undefined){
						ans[i]["user_answer"] = [t];	
					}else{
						ans[i]["user_answer"] = [];
					}
				}else if(ans[i].type === "textarea"){
					ans[i]["user_answer"] = $(".modal-body.p0 textarea").val()
				}
				//console.log(mData.body[0].questions[i].user_answer)
			}
			//debugger
			console.log(mData)
			var objPost = {
				url 	:objActModal_.action_link,
				data 	:JSON.stringify(mData),
				type 	:"POST",
				cb 		:dataPosted.bind(this)
			}
			Utility.loader(objPost);
		})
	}

	var qna = function(){
		var tm = mData.body[0].data;
		$(".modal-body.p0").html(mData.body[0].data);
	}

	var agenda = function(){

		var agen = mData.body[0].slot_data;
		var dis;
		var str = '<div class="agenda"><ul class="list-group">'
		for(var i = 0; i < agen.length; i++){
			dis = "disableIcon"
			str += '<li class="list-group-item"><div class="row">'
			if(agen[i].status == 0){
				//live
				str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm liveBtn">LIVE</button></div>'
			}else if(agen[i].status == 1){
				//upcm

				str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm upcomingBtn">Upcoming</button></div>'
			}else if(agen[i].status == 2){
				//ended
				dis = ""
				str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm completeBtn">Completed</button></div>'
			}	

			

			var tm = agen[i].speakers;
			str += '<div class="col-md-5"><b class="db">Welcome Address</b>'
			var s = ""
			for(var j=0; j<tm.length; j++){
				str += tm[j].name+", "+tm[j].company
				
				if((j + 1) < tm.length){
					str += ' | ';
				}

				//console.log(s)
			}
			str += '</div>'			

			//breiefcase
			str += '<div class="col-md-2"><a href="#" class="iconSVG '+dis+'"><img src="images/briefcase.svg" alt=""></a></div>'
			//closur li
			str += '</div></li>'
		}
		//closure ul
		str += '</ul></div>';
		$(".modal-body.p0").html(str);
	}

	var resources = function(){
		var tm = mData.body;

		var str = '<div class="resources"><ul class="list-group">'
		for(var i=0; i<tm.length; i++){
			str += '<li class="list-group-item"><div class="row">'

			if(tm[i].type === "live"){
				str += '<div data-id="'+tm[i].uuid+'" class="col-md-3">'
				str += '<a href="#" class="material-icons">videocam</a>'
			}else{
				str += '<div class="col-md-3">'
				str += '<a href="#" class="material-icons mr-3">note</a>'
			}
			
			str += '<button type="button" class="btn btn-secondary btn-sm">View</button>'
			str += '</div>'

			str += '<div class="col-md-7">power-your-business-transformation-with-edc</div>'

			//briefcase
			str += '<div class="col-md-2">'
            str += '<a href="#" class="material-icons">card_travel</a>'
          	str += '</div>'
		
		}

		$(".modal-body.p0").html(str);
		$(".modal-body.p0 li a").off("click").on("click", function(){
			getComponentData($(this).parent().attr("data-id"), tm);
		})

		$(".modal-body.p0 li button").off("click").on("click", function(){
			getComponentData($(this).parent().attr("data-id"), tm);
		})
		

	}

	var playlist = function(){
		//var tm = mData.body;
		var tm = JSON.parse(mData.body[0].playlistsource);
		var str = '<ul class="list-group">'
		for(var i=0; i<tm.length; i++){
			//str += '<li class="list-group-item"><div class="row"><div data-id="'+tm[i].uuid+'" class="col-md-2">'
		//	str += '<a href="#" class="material-icons">videocam</a>' //anchor

			str += '<li class="list-group-item"><div class="row"><div data-id="'+tm[i].videoid+'" class="col-md-2"><a href="#" class="material-icons">videocam</a></div><div  data-id="'+tm[i].videoid+'" class="col-md-2"><button type="button" class="btn btn-secondary btn-sm">PLAY</button></div><div class="col-md-8">'+tm[i].description+'</div></div></li>'
		}
		str += '</ul>';
		$(".modal-body.p0").html(str);

		$(".modal-body.p0 li a").off("click").on("click", function(){
			//debugger
			renderVideo($(this).parent().attr("data-id"), tm);
		})

		$(".modal-body.p0 li button").off("click").on("click", function(){
			renderVideo($(this).parent().attr("data-id"), tm);
			//debugger
		})

	}

	



	var getComponentData = function(id, arr){
		var t = arr.filter(it => {
			return it.uuid === id
		});
		if(t[0].type === "live"){
			var ot = {
				videoid: t[0].resource,
				description: t[0].description,
				title: t[0].title
			}
			videoComponent_.renderVideo($(".modal-body.p1")[0], ot)
			//$("#exampleModal").modal("hide");
			$("#exampleModal2").modal("show");

		}else if(t[0].resourcetype === "pdf"){
			pdfContainer_.renderPDF(t[0])
			$("#exampleModal").modal("hide");
			$("#exampleModal2").modal("show");
			
		}else if(t[0].resourcetype === "doc"){
			
		}else if(t[0].resourcetype === "image"){
			
		}
	}

	var renderVideo = function(_id, arr){
		var t = arr.filter(it => {
			return it.videoid === _id
		});

		
		videoComponent_.renderVideo($(".modal-body.p1")[0], t[0])
		$("#exampleModal").modal("hide");
		$("#exampleModal2").modal("show");
	
	}


	
	var dataPosted = function(_data){
		console.log("hiiiiiiiiiiiiiiiiiii")
		debugger
	}


	var videoCallback_ = function(){
		debugger
	}



	var initUI = function(){
		uiModal_ = $("#exampleModal");
		uiModTitle_ = $("#exampleModalLabel");;
		uiModBody_ = $("#exampleModal .modal-body");
		$("#exampleModal2").on('hidden.bs.modal', function(){
			$("#exampleModal2 .modal-body").html("")
			$("#exampleModal").modal("show");
		})

		$("#exampleModal").on('hidden.bs.modal', function(){
			if(modelFor_ === "player"){
				$("#exampleModal .modal-body").html("")
			}
			
		  });


	}




	return {
		init: init,
		renderModal: renderModal
	}
}



