var PageRenderer = function(){
	var controller_, callback_, videoComponent_, modalContent_, bgContainer, floterLeft, floterRight, objActive;
	var animVideo, animVidContainer;
	
	var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
		
		videoComponent_ = new VideoComponent();
		videoComponent_.init(this, videoCallback_.bind(this));

		modalContent_ = new ModalComponent();
		modalContent_.init(this, modalCallback_.bind(this))
		
		initUI();
	}

	var renderPage = function(obj){

		objActive = obj;
		if(!obj.width){
			$("#preloader").removeClass("H");
			var img = new Image();
			img.src = obj.image;
			img.onload = function(){
				obj['width'] = img.width;
				obj['height'] = img.height;
				$("#preloader").addClass("H");
				getComponents(obj)
			}
		}else{
			getComponents(obj)
		}
	}

	var getComponents = function(_o){
		var strHotspot = "";
		var strFloaterLeft = "";
		var strFloaterRight = "";
		var l,t,h,g,c,tp;
		strHotspot += '<img src="'+_o.image+'" alt="">';

		
		for(var i=0; i<_o.componants.length; i++){
			if(_o.componants[i].type == "hotspot" || _o.componants[i].type == "video" || _o.componants[i].type === "help_box" || _o.componants[i].type === "text" ||  _o.componants[i].type === "banner"){
				if(_o.componants[i].shape_type === "rect"){		
					if(!_o.componants[i].coor){
						c = _o.componants[i].coordinate.split(",");
						l = Math.round(parseInt(c[0])*100/_o.width);
						t = Math.round(parseInt(c[1])*100/_o.height);
						w = Math.round((parseInt(c[2]) - parseInt(c[0]))*100/_o.width)
						h = Math.round((parseInt(c[3]) - parseInt(c[1]))*100/_o.height)
						_o.componants[i]['coor'] = {left:l, top: t, width: w, height: h};
					}
					strHotspot += '<div class="anchorUI" style="left: '+_o.componants[i].coor.left+'%; top: '+_o.componants[i].coor.top+'%; width: '+_o.componants[i].coor.width+'%; height: '+_o.componants[i].coor.height+'%;background:rgba(0, 0, 255, 0);" data-id='+i+'><div class="anchorWrapper"><span class="helpText">'+_o.componants[i].tooltip+'</span></div></div>'
				}
			}else{
				tp = _o.componants[i].position.split("-")[0];
				if(tp === "left"){
					strFloaterLeft += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="'+i+'">'+_o.componants[i].title+'</button>'
				}else if(tp === "right"){
					strFloaterRight += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="'+i+'">'+_o.componants[i].title+'</button>'
				}
			}
		}

		$(window).scrollTop(0);
		$(".bodyBg").html(strHotspot)
		$("#floatLeft").html(strFloaterLeft)
		$("#floatRight").html(strFloaterRight)
		bindEvents();
	}

	var bindEvents = function (){
		$(".bodyBg .anchorUI").off("click").on("click", function(){
			var ind = parseInt($(this).attr("data-id"))
			var oType = objActive.componants[ind]
			if(oType.type === "hotspot" || oType.type === "banner" || oType.type === "text" || oType.type === "help_box" ){
				if(oType.action_type === 'internal_popup'){
					$("#exampleModal").modal("show");
					console.log("POPUP")
					modalContent_.renderModal(oType);
					
				}else if(oType.action_type === 'internal_page'){
					console.log("INternal page", oType.action_link)
					callback_(oType.action_link)
				}else if(oType.action_type === 'animatied_navigate'){
					animateVideo(oType)
				}else{
					alert("No Action Type")
				}
			}else if(oType.type === "video"){
				$(this).unbind();
				videoComponent_.renderVideo(this, {videoid:oType.action_link})
			}else{
				alert("No Type")
			}
		})

		$(".floater [data-toggle='modal']").off("click").on("click", function(e){
			modalContent_.renderModal(objActive.componants[parseInt($(this).attr("data-cust"))])
		})

		if(!!objActive.on_load){
			if(objActive.on_load.action_type !== "none" && objActive.on_load.action_link !== ""){
				modalOnLoad(objActive.on_load)
				/*$("#exampleModal").modal("show");
				modalContent_.renderModal(objActive.on_load);*/
			}
		}

     }

     var modalOnLoad = function(_o){
     	$("#exampleModal").modal("show");
		modalContent_.renderModal(_o);
     }

     
     

     var animateVideo = function(_o){
    	animVideo.addEventListener("loadedmetadata", function metadata(){
     		//remove preloader
     		this.removeEventListener('loadedmetadata', metadata);
     		
     		//animVideo.style.display = "block"
     		animVidContainer.show();

     		$("body").css("overflow", "hidden");
     		$("#vd").show();
     		this.play()

     		callback_(_o.action_link);
     	})

     	animVideo.addEventListener("ended", function ended(){
     		this.removeEventListener('ended', ended);
     		animVideo.src = "";
     		animVidContainer.hide();
     		$("body").css("overflow", "");
     	})
     	animVideo.src = _o.videourl;
     }


     var videoCallback_ = function(_d){
     	console.log(_d)
     }

     var modalCallback_ = function(d){
     	console.log(_d)
     }
	

	var initUI = function(){
		animVideo = $("#vidAnimation")[0];
		animVidContainer = $("#vidContainer");
		
		// bgContainer = $("#bodyBg");
		// floterLeft = $("#floatLeft")
		// floaterRight = $("#floatRight")


	}

	return {
		init: init,
		renderPage: renderPage,
		modalOnLoad:modalOnLoad
	}
}