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
		var vcont = [];

		
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
					if(_o.componants[i].type == "video"){
					vcont.push(i)
					}
				}
			}else{
				tp = _o.componants[i].position.split("-")[0];
				
				if(tp === "left"){
					strFloaterLeft += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="'+i+'">'+_o.componants[i].title+svgIcons(_o.componants[i].title)+'</button>'
				}else if(tp === "right"){
					strFloaterRight += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="'+i+'">'+svgIcons(_o.componants[i].title)+_o.componants[i].title+'</button>'
				}
			}
		}

		$(window).scrollTop(0);
		$(".bodyBg").html(strHotspot)
		$("#floatLeft").html(strFloaterLeft)
		$("#floatRight").html(strFloaterRight)
		
		

		bindEvents();

		
		for(var k=0; k<vcont.length; k++){
			$($(".bodyBg .anchorUI")[vcont[k]]).unbind();

			videoComponent_.renderVideo($(".bodyBg .anchorUI")[vcont[k]], {videoid:objActive.componants[vcont[k]].action_link, autoplay:false, muted:false, pos:"wall"})


		}
		
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
			}
			
			/*else if(oType.type === "video"){
				$(this).unbind();
				videoComponent_.renderVideo(this, {videoid:oType.action_link})
			}*/

			else{
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

		// objActive.componants.filter(it => {
		// 	if(it.type === "video"){
		// 		return {
		// 			ind
		// 		}
		// 	}
		// })

     }

     var addVideoToWall = function(){

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


	var svgIcons = function(icon){
		var str = ""
		
		switch(icon){
			case "Agenda":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="22.251" height="21.08" viewBox="0 0 22.251 21.08" style="    /* width: 15px; */"><path d="M24.08,16.211H4.171A1.175,1.175,0,0,0,3,17.382v7.027A1.175,1.175,0,0,0,4.171,25.58H24.08a1.175,1.175,0,0,0,1.171-1.171V17.382A1.175,1.175,0,0,0,24.08,16.211Zm0-11.711H4.171A1.175,1.175,0,0,0,3,5.671V12.7a1.175,1.175,0,0,0,1.171,1.171H24.08A1.175,1.175,0,0,0,25.251,12.7V5.671A1.175,1.175,0,0,0,24.08,4.5Z" transform="translate(-3 -4.5)"></path></svg>'

			case "FAQ":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" style="width: 22px;height: 22px;"><path d="M0 0h24v24H0z" fill="none"></path><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></svg>'

			case "Briefcase":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="21.691" height="18.98" viewBox="0 0 21.691 18.98"><path d="M13.557,15.129a.678.678,0,0,1-.678.678H8.812a.678.678,0,0,1-.678-.678V13.1H0v6.1A2.085,2.085,0,0,0,2.034,21.23H19.658A2.085,2.085,0,0,0,21.691,19.2V13.1H13.557Zm6.1-8.812H16.269V4.284A2.085,2.085,0,0,0,14.235,2.25H7.456A2.085,2.085,0,0,0,5.423,4.284V6.317H2.034A2.085,2.085,0,0,0,0,8.351V11.74H21.691V8.351A2.085,2.085,0,0,0,19.658,6.317Zm-6.1,0H8.134V4.961h5.423Z" transform="translate(0 -2.25)"></path></svg>'

			case "Poll":
			return '<svg xmlns="http://www.w3.org/2000/svg" width="20.546" height="20.546" viewBox="0 0 20.546 20.546"><path d="M18.345,2.25H2.2A2.2,2.2,0,0,0,0,4.451V20.595a2.2,2.2,0,0,0,2.2,2.2H18.345a2.2,2.2,0,0,0,2.2-2.2V4.451A2.2,2.2,0,0,0,18.345,2.25ZM7.338,17.659a.734.734,0,0,1-.734.734H5.136a.734.734,0,0,1-.734-.734v-5.87a.734.734,0,0,1,.734-.734H6.6a.734.734,0,0,1,.734.734Zm4.4,0a.734.734,0,0,1-.734.734H9.539a.734.734,0,0,1-.734-.734V7.386a.734.734,0,0,1,.734-.734h1.468a.734.734,0,0,1,.734.734Zm4.4,0a.734.734,0,0,1-.734.734H13.942a.734.734,0,0,1-.734-.734V14.724a.734.734,0,0,1,.734-.734h1.468a.734.734,0,0,1,.734.734Z" transform="translate(0 -2.25)"/></svg>'


			case "Feedback":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="22.46" height="22.46" viewBox="0 0 22.46 22.46"><defs><style>.a{fill:#c9c9c9;}</style></defs><path d="M23.214,3H5.246A2.243,2.243,0,0,0,3.011,5.246L3,25.46l4.492-4.492H23.214a2.253,2.253,0,0,0,2.246-2.246V5.246A2.253,2.253,0,0,0,23.214,3ZM15.353,16.476H13.107V14.23h2.246Zm0-4.492H13.107V7.492h2.246Z" transform="translate(-3 -3)"></path></svg>'

			case "Playlist":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="26.809" height="17.873" viewBox="0 0 26.809 17.873"><defs></defs><path d="M18.319,14.106H3V16.66H18.319Zm0-5.106H3v2.553H18.319ZM3,21.766H13.213V19.213H3Zm24.894-5.745,1.915,1.915-8.924,8.936-5.758-5.745,1.915-1.915,3.843,3.83Z" transform="translate(-3 -9)"></path></svg>'

			case "Attendies":
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="30.844" height="30.844" viewBox="0 0 30.844 30.844"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M15.422.563A15.422,15.422,0,1,0,30.844,15.984,15.419,15.419,0,0,0,15.422.563Zm0,5.97A5.472,5.472,0,1,1,9.95,12,5.472,5.472,0,0,1,15.422,6.532Zm0,21.392a11.916,11.916,0,0,1-9.11-4.241,6.933,6.933,0,0,1,6.125-3.719,1.522,1.522,0,0,1,.442.068,8.233,8.233,0,0,0,2.543.429,8.2,8.2,0,0,0,2.543-.429,1.522,1.522,0,0,1,.442-.068,6.933,6.933,0,0,1,6.125,3.719A11.916,11.916,0,0,1,15.422,27.924Z" transform="translate(0 -0.563)"></path></svg>'

			return str;
		}

		
	}

	return {
		init: init,
		renderPage: renderPage,
		modalOnLoad:modalOnLoad
	}
}