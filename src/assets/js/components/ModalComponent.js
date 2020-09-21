var ModalComponent = function(){
	var pRenderer_, callback_, objActModal;
	var uiModal_, uiModTitle_; 
	var mData, videoPlayer_, pdfContainer_;
	var modelFor_;
	var mainModal_;
	var cardContainer_;
	var imageComponent_;

	
	var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
		videoComponent_ = new VideoComponent();
		videoComponent_.init(this, videoCallback_.bind(this));
		pdfContainer_ = new PDFComponent();

		cardContainer_ = new BusinessCard();
		cardContainer_.init();

		imageComponent_ = new ImageContainer();


		initUI();
	}

	var renderModal = function(_o){
		console.log("calllllll  ", _o)
		mainModal_.html("");
		$("#exampleModal .tabs").remove();
		$("#exampleModal .searchBar").remove();
		//$("#exampleModal .searchBar").remove();


		
		uiModTitle_.html("");
		//$("#exampleModal .tabs").hide();

		objActModal_ = _o;
		//
		if(_o.popup_type === "player"){
			modelFor_ = "player";
			videoComponent_.renderVideo(mainModal_[0], {videoid:_o.action_link})
		}else if(_o.popup_type === "user"){
			mData = _o;
			getHtml(_o);
		}else if(_o.popup_type === "leaderBoard"){
			mData = _o;
			getHtml(_o);
		}else{
			if(_o.action_link === ""){
				//_o.action_link = "users/attendees.json?eventid=f5n9o69lkl"
				//Utility.loader({url: _o.action_link, cb:mDataLoaded.bind(this)});
				alert("Link not available: "+_o.popup_type)
			}else{
				modelFor_ = "others";
				//_o.action_link = "resource.json?eventid=f5n9o69lkl"
				//_o.action_link = "playlists.json?uuid=f5n9o69lkl"
				//_o.action_link = "users/attendees.json?eventid=f5n9o69lkl"
				//_o.action_link = "users/ausers/mybriefcase.json"
				//_o.action_link = "agenda.json?eventid=f5n9o69lkl"
				Utility.loader({url: _o.action_link, cb:mDataLoaded.bind(this)});
			}



			
		}
	}

	var mDataLoaded = function(_o){

		if(_o.data !== null){
			mData = _o.data;
			getHtml(_o.data)
		}else{
			alert("Data not loaded")
		}
		

	}


	var getHtml = function(_o){
		var s, t = _o.template;
		//console.log(t)
		switch(t){
			case "poll":
			polls()
			break;

			case "staticpage":
			qna();
			
			break;

			case "agenda":
			uiModTitle_.html(objActModal_.popup_type);
			modalTab(["All", "Live", "Upcoming", "Completed"], agendaTab)
			agenda("all");
			break;

			case "playlist":
			uiModTitle_.html("playlist");
			playlist()
			break;

			case "resource":
			uiModTitle_.html("resources");
			resources();
			break;


			case "attendees":
			uiModTitle_.html("attendees");
			modalTabAttendees()
			attendees([]);
			break;

			case "briefcase":
			uiModTitle_.html("briefcase");
			modalTab(["All", "Videos", "Business Card", "Document"], briefcaseTab)
			briefcase("all");
			break;


			case "myProfile" :
			uiModTitle_.html("User Profile");
			modalTab(["VIEW", "EDIT"], profileTab)
			myProfile()
			
			
			break;


			case "leaderBoard":
			//uiModTitle_.html("board");
			modalTabLeaderBoard()
			modalTab(["LEADER BOARD", "MY POINTS", "CRITERIA", "T & C"], leaderBoardTab)
			leaderBoard("a0")
			break;

			case "chatbox" :
			break;



		}

		
	}

	/* Leader Board*/
	var leaderBoard = function(par){
		mainModal_.html(lbTab(par));
	}

	var leaderBoardTab = function(type){
		leaderBoard(type)


	}

	var modalTabLeaderBoard = function(){
		var str = '<div class="searchBar">'
		str += '<input type="text" id="attSearch" name="" placeholder="Search by Name">'
		str += '<i class="material-icons">search</i>'		
		str += '<div class="refreshIcon"><i class="material-icons">refresh</i></div>'
		str += '</div>'

		$( str ).insertAfter( "#exampleModalLabel" );

		/*$("#exampleModal .searchBar i").off("click").on("click", function(){
			var v = Utility.trim($("#attSearch").val()).toLowerCase();
			var s = mData.body.filter(it => {
				return it.firstname.toLowerCase().indexOf(v) !== -1 || it.lastname.toLowerCase().indexOf(v) !== -1 || it.companyname.indexOf(v) !== -1 || it.jobtitle.toLowerCase().indexOf(v) !== -1 
			})

			if(s.length){
				attendees(s)
			}else{
				attendees([])
			}

			
		})

		$("#exampleModal .refreshIcon i").off("click").on("click", function(){
			$("#attSearch").val("");
			Utility.loader({url: objActModal_.action_link, cb:function(_o){
				mData = _o.data;
				//modalTabAttendees()
				attendees([]);
			}});
		})*/
	}

	var lbTab = function(t){
		var str = '<div class="leaderboard"><h5> To be added</h5></div>'
		if(t === "a0"){
			str = '<div class="leaderboard"> <div class="row listTable m0"> <div class="row-th"> <div class="th-col col-md-2 text-center">Rank</div><div class="th-col col-md-8">Attendee</div><div class="th-col col-md-2">Points</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">2</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">3</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">4</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">5</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div></div></div>'
		}else if(t === "a1"){
			
		}else if(t === "a2"){

		}else if(t == "a3"){

		}

		return str

	}



	/* My Profile */
	var myProfile = function(){

		var user = EventStore.getUserProfile();
		var dis = "disabled"

		var str = '<div class="my-profile nonEdit" id="userprofile"> <div class="row m0"> <div class="user-profile"> <div class="user-image"> <img src="images/card-avatar.svg" alt=""> </div><div class="edit-image mt-3"> <button type="button" class="btn btn btn-outline-secondary btn-sm ">Edit Image</button> <input type="file"> </div></div><div class="profile-rhs"> <form class="darkForm"> <div class="form-group"> <label for="exampleInputEmail1" class="labelTxt pl-0" style="left: 0">First Name</label> <input type="text" class="form-control pl-0" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="'+user.firstname+'"> </div><div class="form-group"> <label for="" class="labelTxt">Last Name</label> <input type="text" class="form-control" id="" placeholder="'+user.lastname+'"> </div><div class="form-group"> <label for="" class="labelTxt">Designation</label> <input type="tex" class="form-control" id="" placeholder="'+user.jobtitle+'"> </div><div class="form-group"> <label for="" class="labelTxt">Company</label> <input type="text" class="form-control" id="" placeholder="'+user.companyname+'"> </div><div class="form-group"> <label for="" class="labelTxt">Email Address</label> <input type="text" class="form-control" id="" placeholder="'+user.email+'"> </div><div class="form-group"> <label for="" class="labelTxt">Phone Number</label> <input type="number" class="form-control" id="" placeholder="+91-9999999999"> </div><div class="form-group"> <button type="submit" class="btn btn-primary btn-sm">Submit</button> </form> </div></div></div>'

			mainModal_.html(str);
			$("#modalBodyP0 .my-profile input").prop("disabled", true)

	}

	var profileTab = function(type){
		if(type === "a0"){
			$("#modalBodyP0 .my-profile input").prop("disabled", true);
			$("#modalBodyP0 .my-profile").addClass("nonEdit");
		}else{
			$("#modalBodyP0 .my-profile input").prop("disabled", false);
			$("#modalBodyP0 .my-profile").removeClass("nonEdit");
		}
	}

	


	/*POLLS*/
	var polls = function(){
		mData.body[0].questions = JSON.parse(mData.body[0].questions);
		var q = mData.body[0].questions;
		var chckd = "", star, txtval;
		var str = '<div class="feedback"><ul>'
		for(var i=0; i<q.length; i++){
			str += '<li>';
			str += '<p>'+q[i].title+'</p>'
			var qa = q[i].answers
			for(var j=0; j<qa.length; j++){
				str += '<div class="form-check">';
				if(q[i].type === "radiobutton"){
					if(q[i].user_answer){
						if(q[i].user_answer === qa[j]){
							chckd = "checked"
						}
					}
					str += '<input class="form-check-input" type="radio" name="qa'+i+'" value="'+qa[j]+'"  '+chckd+'>'
					str += '<label class="form-check-label" for="exampleRadios1">'+qa[j]+'</label>'
				}else if(q[i].type === "checkbox"){
					if(q[i].user_answer){
						if(q[i].user_answer.indexOf(qa[j]) !== -1){
							chckd = "checked"
						}
					}
					str += '<input type="checkbox" class="form-check-input" name="qa'+i+'" value="'+qa[j]+'" data-id=q_'+i+' '+chckd+'>'
					str += '<label class="form-check-label" for="exampleCheck1">'+qa[j]+'</label>'
				}
				str += '</div>'
			}
			if(q[i].type === "star"){

				if(q[i].user_answer){
					star = q[i].user_answer.join();
				}
				str += '<div class="rating">'
				for(var m=1; m<6; m++){
					str += '<input type="radio" name="rating" value="'+(6-m)+'"  id="'+(6-m)+'"><label for="'+(6-m)+'"></label>'
				}
				str += '</div>'
			}else if(q[i].type === "textarea"){
				if(q[i].user_answer){
					txtval = q[i].user_answer[0];
				}
				str += '<div class="form-group">'
          		str += '<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea></div>'
        
			}
			str+='</li>'
			chckd = "";
		}
		str += '</ul><button id="postData" class="btn btn-primary float-right mt-3">Submit</button></div>'
		mainModal_.html(str);
		
		if(txtval)
		$("#modalBodyP0 textarea").val(txtval)
		
		if(star)
		$("#modalBodyP0 .rating [value="+star+"]").prop("checked", true)


		$("#postData").off("click").on("click", function(e){
			var ans = mData.body[0].questions;
			var t;
			for(var i=0; i<ans.length; i++){
				if(ans[i].type === "checkbox"){
					var tv = [];
					$("#modalBodyP0 [name=qa"+i+"]:checked").each(function(i, j){
						tv.push($(j).val())
					 })
					ans[i]["user_answer"] = tv;
					
				}else if(ans[i].type === "radiobutton"){
					t = $("#modalBodyP0 [name=qa"+i+"]:checked").val();
					if(t !== undefined){
						ans[i]["user_answer"] = [t];	
					}else{
						ans[i]["user_answer"] = [];
					}
				}else if(ans[i].type === "star"){
					t = $("#modalBodyP0 [name=rating]:checked").val();
					if(t !== undefined){
						ans[i]["user_answer"] = [t];	
					}else{
						ans[i]["user_answer"] = [];
					}
				}else if(ans[i].type === "textarea"){
					ans[i]["user_answer"] = $("#modalBodyP0 textarea").val()
				}
			}
			
			console.log(mData)
			// var objPost = {
			// 	url 	:objActModal_.action_link,
			// 	data 	:mData,
			// 	type 	:"POST",
			// 	cb 		:dataPosted.bind(this)
			// }

			//Utility.loader(mData);

			var fd = new FormData();
			fd.appned("data", JSON.stringify(mData)) 

			//Utility.loader({url: _o.action_link, cb:mDataLoaded.bind(this)});


			var o = {};

			o.url = testUrl
			o.type = "POST";
			o.data = fd;
			o.processData = false;
			o.contentType = false;


			

			o.success = function(_data){
				console.log(_data)	
				
			}

			o.error = function(a,c, d){
				
			}
			
			$.ajax(o);



		})
	}

	/* QnA */
	var qna = function(){
		var tm = mData.body[0].data;
		mainModal_.html(mData.body[0].data);
	}

	
	/* AGENDA */
	var agenda = function(par){
		//var x = filterAgenda(par)
		//var agen = mData.body[0].slot_data;
		var agen = filterAgenda(par)
		var dis;
		var str = '<div class="agenda"><ul class="list-group">'
		for(var i = 0; i < agen.length; i++){
			dis = "disableIcon"
			str += '<li class="list-group-item" data-asset="'+agen[i].resource.uuid+'">';
			str += '<div class="row">'
			if(agen[i].status == 0){
				//live
				str += '<div class="col-md-2 alignText">';
				str += '<button type="button" class="btn btn-primary btn-sm liveBtn">LIVE</button>';
				str += '</div>'
			}else if(agen[i].status == 1){
				//upcm

				str += '<div class="col-md-2 alignText">';
				str += '<button type="button" class="btn btn-primary btn-sm upcomingBtn" disabled>Upcoming</button>';
				str += '</div>'
			}else if(agen[i].status == 2){
				//ended
				dis = ""
				str += '<div class="col-md-2 alignText">';
				str += '<button type="button" class="btn btn-primary btn-sm completeBtn">Completed</button>';
				str += '</div>'
			}	

			var tm = agen[i].speakers;
			str += '<div class="col-md-5">';
			str += '<b class="db">Welcome Address</b>'
			
			
			
			

			var s = ""
			for(var j=0; j<tm.length; j++){
				str += tm[j].name+", "+tm[j].company
				
				if((j + 1) < tm.length){
					str += ' | ';
				}
			}
			str += '</div>'	

			str += '<div class="col-md-4">';
			//str += '<b class="db">Time: '+agen[i].starttime+'</b>'		
			str += '<span>Time: '+agen[i].starttime+'</span>'
			//str += '<span>Time: '+agen[i].starttime+'</span>'	
			str += '</div>'	

			//breiefcase
			//dis = ""
			str += '<div class="col-md-1 alignText"><a href="#" data-id="'+i+'" class="iconSVG '+dis+'">';
			str += '<img src="images/briefcase.svg" alt="">';
			str += '</a>';
			str += '</div>'
			str += '</div></li>'
		}
		

		//closure ul
		str += '</ul></div>';
		mainModal_.html(str);

		$("#modalBodyP0 a").off("click").on("click", function(){
			var asid = $(this).parent().parent().parent().attr("data-asset");
			var arr = agen.filter(function(it) {
				return(it.resource.uuid === asid)
			})

			
			
		})

		$("#modalBodyP0 button").off("click").on("click", function(){
			var asid = $(this).parent().parent().parent().attr("data-asset");
			var arr = agen.filter(function(it) {
				return(it.resource.uuid === asid)
			})
			
			var t = arr[0];
			//debugger
			renderVideoN({videoid:t.resource.resource, title:t.title});
		})	
	}

	var filterAgenda = function(type){
		// 0-> on going
		// 1-> upcoming
		// 2-> ended
		 if(type === "all"){
		 	mData.body[0].slot_data.sort((a, b) => {
			    return a.status - b.status;
			});
			return mData.body[0].slot_data;
		 }else{
			 var arrT = mData.body[0].slot_data.filter(function(it){
			 	if(it.status === type){
			 		return it
			 	}
			 })
			 return arrT;
		}
	}

	var agendaTab = function(type){
		var t = "all"
		if(type === "a0"){
		}else if(type === "a1"){
			t = 0;			
		}else if(type === "a2"){
			t = 1;
		}else if(type === "a3"){
			t = 2;
		}
		agenda(t)
	}


	/* Resources */
	var resources = function(){
		var tm = mData.body;
		var str = '<div class="resources"><ul class="list-group">'
		for(var i=0; i<tm.length; i++){
			str += '<li class="list-group-item">';
			str += '<div class="row">'

			if(tm[i].type === "live" || tm[i].type === "video"){
				str += '<div class="col-md-1">'
				str += '<div class="material-icons">videocam</div>';
				str += '</div>';
			}else{
				str += '<div class="col-md-1">'
				str += '<div class="material-icons mr-3">note</div>'
				str += '</div>'
			}
			
			str += '<div class="col-md-2">'
			str += '<button type="button" class="btn btn-secondary btn-sm" data-id="'+i+'" >View</button>'
			str += '</div>'

			str += '<div class="col-md-8">'+tm[i].title+'</div>'

			//briefcase
			str += '<div class="col-md-1 alignText">'
			str += '<a  data-id="'+i+'" class="iconSVG '+'dis'+'">'
			str += '<img src="images/briefcase.svg" alt="">'
			str += '</a>'
			str += '</div></li>'
			/*str += '<div class="col-md-2">'
            str += '<a href="#" class="material-icons">card_travel</a>'
          	str += '</div>'*/
		
		}

		mainModal_.html(str);
		// $("#modalBodyP0 li a").off("click").on("click", function(){
		// 	getComponentData($(this).parent().attr("data-id"), tm);
		// })

		$("#modalBodyP0 li button").off("click").on("click", function(){
			var ot = tm[parseInt($(this).attr("data-id"))];
			var oR = {};
			oR.title = ot.title;

			if(ot.type === "video" || ot.type === "live"){
				oR.videoid = ot.resource;
				renderVideoN(oR)
			}else if(ot.type === "doc"){
				oR.url = ot.resource
				populatePDF(oR)
			}else if(ot.type === "image"){
				oR.url = ot.resource;
				populateImage(oR)
				
			}



			// console.log(tm[parseInt($(this).attr("data-id"))])
			// debugger
			
			// getComponentData($(this).attr("data-id"), tm);
		})
	}

	/* Playlist */
	var playlist = function(){
		//var tm = mData.body;
		var tm = JSON.parse(mData.body[0].playlistsource);
		var str = '<ul class="list-group">'
		for(var i=0; i<tm.length; i++){
			
			str += '<li class="list-group-item">'
			str += '<div class="row"  data-id="'+i+'">'
			str += '<div class="col-md-1">'
			str += '<div class="material-icons">videocam</div>'
			str += '</div>'
			str += '<div class="col-md-2 alignText">'
			str += '<button type="button" class="btn btn-secondary btn-sm upcomingBtn">PLAY</button>'
			str += '</div><div class="col-md-8">'
			str += '<b>'+tm[i].description+'</b>'
			str += '</div>'
			
			str += '<div class="col-md-1 alignText">'
			str += '<a href="#" data-id="'+i+'" class="iconSVG">'
			str += '<img src="images/briefcase.svg" alt="">'
			str += '</a>'
			str += '</div>'
			str += '</li>'
		}
		str += '</ul>';
		mainModal_.html(str);

		// $("#modalBodyP0 li a").off("click").on("click", function(){
		
		// 	renderVideo($(this).parent().attr("data-id"), tm);
		// })

		$("#modalBodyP0 li a").off("click").on("click", function(){
			$(this).addClass("disableIcon");
			var fd = new FormData();
			fd.append("resourceid", tm[parseInt($(this).attr("data-id"))].videoid) 
			Utility.loader({url: "users/addtobriefcase.json", data : fd, type :"POST", cb:function(_d){
				debugger
			}});

		})

		$("#modalBodyP0 li button").off("click").on("click", function(){
			var ind = parseInt($(this).parent().parent().attr("data-id"));
			renderVideoN({videoid:tm[ind].videoid, title:tm[ind].name});
		})

	}

	/*  Attendees */
	var modalTabAttendees = function(){
		//add Search and Refresh

		/*var str = '<div class="searchBar">'
		str += '<input type="text" id="attSearch" name="" placeholder="Search by name, company, designation">'
		str += '<i class="material-icons">search</i>'
		str += '</div>'
		str += '<div class="refreshIcon"><i class="material-icons">refresh</i></div>'*/
		
		var str = '<div class="searchBar">'
		str += '<input type="text" id="attSearch" name="" placeholder="Search by name, company, designation">'
		str += '<i class="material-icons">search</i>'		
		str += '<div class="refreshIcon"><i class="material-icons">refresh</i></div>'
		str += '</div>'

		$( str ).insertAfter( "#exampleModalLabel" );

		$("#exampleModal .searchBar i").off("click").on("click", function(){
			var v = Utility.trim($("#attSearch").val()).toLowerCase();
			var s = mData.body.filter(it => {
				return it.firstname.toLowerCase().indexOf(v) !== -1 || it.lastname.toLowerCase().indexOf(v) !== -1 || it.companyname.indexOf(v) !== -1 || it.jobtitle.toLowerCase().indexOf(v) !== -1 
			})

			if(s.length){
				attendees(s)
			}else{
				attendees([])
			}

			
		})

		$("#exampleModal .refreshIcon i").off("click").on("click", function(){
			$("#attSearch").val("");
			Utility.loader({url: objActModal_.action_link, cb:function(_o){
				mData = _o.data;
				//modalTabAttendees()
				attendees([]);
			}});
		})
	}

	// var searchAttendees = function(){
	// 	if(par === "all"){
	// 		return mData.body
	// 	}
	// }

	/* Attendees */
	var attendees = function(arr){
		var tm;
		if(arr.length === 0){
			tm = mData.body
		}else{
			tm = arr;
		}

		var tuuid = "f5496ku9g6"
		//fiterout the current user

		var str = '<div class="participants">'
		str += '<ul class="list-group">'

		for(var i=0; i<tm.length; i++){
			str += '<li data-id='+tm[i].uuid+'>'
			str += '<div class="row">'
			str += '<div class="col-md-1 alignText">'
			str += '<div class="partAvatar">'
			str += '<img src="images/attendees.svg" alt="">'                                
			str += '</div>'
			str += '</div>'
			str += '<div class="col-md-8">'
			str += tm[i].firstname+'  '+tm[i].lastname+' <br /> '+tm[i].companyname
			str += '</div>'
			//str += '<div class="col-md-3"></div>'
			if(tuuid !== tm[i].uuid){
				str += '<div class="col-md-3">'
				str += '<div class="actions">'
				str += '<img src="images/chat.svg" alt="" data-id="chat_'+i+'">'
				//str += '<i class="material-icons">mail</i>'
				str += '<img src="images/briefcase.svg" alt="" data-id="mail_'+i+'">'
				str += '<img src="images/business-card.svg" alt=""  data-id="bcard_'+i+'">'
				str += '</div>'
				str += '</div>'
			}

			str += '</div>'
			str += '</li>'

		}
		str += '</ul>'
		str += '</div>'
		
		


		mainModal_.html(str);
		//add click events
		$("#modalBodyP0 .actions img").off("click").on("click", function(){
			var l = $(this).attr("data-id").split("_");
			var t = l[0];
			var o = mData.body[parseInt(l[1])]

			if(t === "chat"){

			}else if(t === "mail"){

			}else if(t === "bcard"){
				populateCard(o, true)

			}
		})

	}

	/* Briefcase */
	var briefcase = function(par){
		var tm = mData.data.resources
		//var tm = filterBriefcase(par)
		var str = "";
		var ac = "";
		var nam, tp;

		str += '<div class="modal-body p0">'
		str += '<div class="briefcase">'
		str += '<ul class="list-group">'

		for(var i=0; i<tm.length; i++){
			tp = tm[i].type;
			if(tm[i].type === "doc" || tm[i].type === "image" || tm[i].type === "pdf"){
				tp = "doc"
			}
			str += '<li data-id="'+tm[i].uuid+'" data-type="'+tm[i].type+'">'
			str += '<div class="row">'
			str += '<div class="col-md-1">'
			str += '<div class="form-check">'
			str += '<input type="checkbox" class="form-check-input">'
			str += '</div>'
			str += '</div>'

			str += '<div class="col-md-1">'
			if(tm[i].type === "video"){
				ac = "PLAY";
				str += '<i class="material-icons">videocam</i>'
				str += '</div>' //md1	
				str += '<div class="col-md-8">'                                
				str += tm[i].title
				str += '</div>'		
			}else{
				ac = "VIEW" 
				if(tm[i].type === "image" || tm[i].type === "doc"){
					nam = tm[i].title;
					str += '<img src="images/document.svg" alt="">'
				}else if(tm[i].type === "business_card"){
					nam = tm[i].name;
					str += '<img src="images/business-card.svg" alt="">'
				}
				str += '</div>' //md1
				str += '<div class="col-md-8">'                                
				str += '<img src="images/download.svg" alt="" class="mr-2" data-id="dwnld">'
				str +=  nam
				str += '</div>'

			}


			str += '<div class="col-md-2 alignText">'
			str += '<button type="button" class="btn btn-secondary text-uppercase" id="btnview" data-id='+i+'>'+ac+'</button>'
			str += '</div>'
			str += '</div>'
			str += '</li>'
		}



		str += '</ul>'
		str += '</div>'
		str += '<div class="modal-footer">'
		str += '<p>Only content with <i class="material-icons f18">file_download</i> icon can be downloaded</p>'
		str += '<button type="button"  id="btndeletes" class="btn btn-secondary text-uppercase">Delete <i class="material-icons f16">delete</i></button>'
		str += '<button type="button"  id="btndownloads" class="btn btn-secondary text-uppercase"><i class="material-icons f18">file_download</i> Download</button>'
		
		str += '</div>'





		mainModal_.html(str);

		var bntdel = $('#modalBodyP0 #btndeletes');
		bntdel.hide()

		$('#modalBodyP0 .briefcase [type=checkbox]').off("click").on("click", function(){
			//debugger;

			if($('#modalBodyP0 .briefcase [type=checkbox]:checked').length !== 0){
				bntdel.show();
			}else{
				bntdel.hide();
			}

			bntdel
		})

		$('#modalBodyP0 .briefcase [data-id=dwnld]').off("click").on("click", function(){
			var id = $(this).parent().parent().parent().attr("data-id")
			var elt = mData.data.resources.filter(it => {
				return it.uuid === id
			})

			if(!!elt){
				//download
				singleFiledownload(elt[0])
			}


			//debugger
		})

		$('#modalBodyP0 #btnview').off("click").on("click", function(e){
			e.stopPropagation();




			//$(".modal-overlay-cont").removeClass("H");
			var ind = parseInt($(this).attr("data-id"));
			var ao = mData.data.resources[ind];

			var oR = {}
			oR.title = ao.title;
		
			if($(this).text() === "VIEW"){
				if(ao.type === "business_card"){
					oR.url = ao.resource
					populateCard(oR, false)
				}else if(ao.type === "image"){
					oR.url = ao.resource
					populateImage(oR)
				}else if(ao.type === "doc"){
					oR.url = ao.resource
					populatePDF(oR)
				}else {
					alert("No TYPE  "+ao[ind].type)
				}
				console.log("view")
			}else if($(this).text() === "PLAY"){
				oR.videoid = ao.resource;
				renderVideoN(oR)

				//videoComponent_.renderVideo($("#modalinsidebody")[0], {videoid:vid})
				//console.log("play")
			}

		})
		

		$('#modalBodyP0 #btndownloads').off("click").on("click", function(e){
			e.stopPropagation();
			//debugger
		})
		
		bntdel.off("click").on("click", function(e){
			e.stopPropagation();
			var chk = $("#modalBodyP0 [type=checkbox]:checked").parent().parent().parent().parent();
			var t = [];
			for(var i=0; i<chk.length; i++){
				t.push($(chk[i]).attr("data-id"))
				//t.push()
			}

			//SEND THE DATA TO DELETE t array



			mData.data.resources = mData.data.resources.filter(function(val) {
			  return t.indexOf(val.uuid) == -1;
			});

			briefcase();

			Utility.loader({url: objActModal_.action_link, cb:function(_o){
				//Post data

				//mData = _o.data;
				
				//modalTabAttendees()
				//briefcase();
			}});


		})
		
	}
	var singleFiledownload = function(obj){
		// debugger
		// var element = document.createElement('a');
		// element.setAttribute('href', obj.resource);
		// element.setAttribute('download', "obj.title");
		// element.style.display = 'none';
		// document.body.appendChild(element);
		// element.click();
		// document.body.removeChild(element);
	}
	var briefcaseTab = function(type){
		$("#modalBodyP0 li").hide();
		var t = "all"
		if(type === "a0"){
			$("#modalBodyP0 li").show();
		}else if(type === "a1"){
			$("#modalBodyP0 [data-type=video]").show()
		}else if(type === "a2"){
			$("#modalBodyP0 [data-type=business_card]").show();
		}else if(type === "a3"){
			$("#modalBodyP0 [data-type=doc]").show();
		}
		
		//briefcase(t)
	}
	var downloadFilterItems = function(){

	}
	var deleteFilterItem = function(){

	}

	/* Utility functions */
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
			$("#exampleModal2").modal("show");

		}else if(t[0].resourcetype === "doc"){
			pdfContainer_.renderPDF(t[0])
			$("#exampleModal").modal("hide");
			$("#exampleModal2").modal("show");
			
		}else if(t[0].resourcetype === "doc"){
			
		}else if(t[0].resourcetype === "image"){
			
		}
	}

	var populatePDF = function(_o){

		if((_o.url.split('.').pop().toLowerCase() === "pdf") && mimeCheck("application/pdf")){
			$("#exampleModal2 #exampleModalLabel2").text(_o.title)
			pdfContainer_.renderPDF(_o)
			$("#exampleModal").modal("hide");
			$("#exampleModal2").modal("show");
		}else{
			downloadfile(_o)
		}
		
	}
	
	var populateCard = function( _o, edit){

		$(".modal-overlay-cont #modalinsidelable").text("Business Card");
		//$(".modal-overlay-cont").removeClass("H");
		$(".modal-overlay-cont").addClass("show");
		cardContainer_.renderCard($("#modalinsidebody"), _o, edit);
	}

	var renderVideoN = function(_o){
		//$(".modal-overlay-cont").removeClass("H");
		$(".modal-overlay-cont").addClass("show");

		$(".modal-overlay-cont #modalinsidelable").text("Now player: "+_o.title);
		videoComponent_.renderVideo($("#modalinsidebody")[0], _o)
	}

	var populateImage = function(_o){
		//$(".modal-overlay-cont").removeClass("H");
		$(".modal-overlay-cont").addClass("show");

		$(".modal-overlay-cont #modalinsidelable").text(_o.title);
		imageComponent_.renderImage($("#modalinsidebody")[0], _o)

	}

	var renderVideo = function(_id, arr){
		// var t = arr.filter(it => {
		// 	return it.videoid === _id
		// });

		//debugger

		videoComponent_.renderVideo($(".modal-body.p1")[0], {videoid:_id})
		$("#exampleModal").modal("hide");
		$("#exampleModal2").modal("show");
	
	}


	
	var dataPosted = function(_data){
		console.log(_data)
		
	}


	var videoCallback_ = function(){
		
	}



	var initUI = function(){
		uiModal_ = $("#exampleModal");
		uiModTitle_ = $("#exampleModalLabel");

		mainModal_ = $("#modalBodyP0");
		$("#exampleModal2").on('hidden.bs.modal', function(){
			console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQq")
			$("#exampleModal2 .modal-body").html("")
			$("#exampleModal").modal("show");
		})

		$("#exampleModal").on('hidden.bs.modal', function(){
			console.log("PPPPPPPPPPPPPPPPPPPPPPPPP")
			if(modelFor_ === "player"){
				$("#exampleModal .modal-body").html("")
			}
			
		  });


		$(".modal-overlay-cont #modalinsideclose").off("click").on("click", function(){
			//$("#exampleModal .modal-overlay-cont").addClass("H");
			$("#exampleModal .modal-overlay-cont").removeClass("show");
			$(".modal-overlay-cont #modalinsidebody").html("");
		})
	}

	/* Modal Tabs */
	var modalTab = function(arr, cb){
		
		//var str = '<h5 class="modal-title" id="exampleModalLabel">'+objActModal_.popup_type+'</h5>'
		var str = '<div class="tabs">'
		str += '<ul class="nav nav-tabs">'

		for(var i=0; i<arr.length; i++){
			str += '<li class="nav-item">';
			str += '<a class="nav-link active" id="a'+i+'">'+arr[i]+'</a>'
			str += '</li>'
		}

		str += '</ul></div>'

		//$("#exampleModal .tabs").html(str);
		
		$( str ).insertAfter( "#exampleModalLabel" );

		$("#exampleModal .tabs a").removeClass("active");
		$("#exampleModal "+"#a0").addClass("active");

		$("#exampleModal .tabs a").on("click", function(){
			var id = this.id;
			$("#exampleModal .tabs a").removeClass("active");
			$("#exampleModal "+"#"+id).addClass("active");
			cb(id);
		})

	}

	var mimeCheck = function (type) {
	    return Array.prototype.reduce.call(navigator.plugins, function (supported, plugin) {
	        return supported || Array.prototype.reduce.call(plugin, function (supported, mime) {
	            return supported || mime.type == type;
	        }, supported);
	    }, false);
	};

	var downloadfile = function(obj){
		var element = document.createElement('a');
		element.setAttribute('href', obj.url);
		element.setAttribute('download', obj.title);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}



	return {
		init: init,
		renderModal: renderModal
	}
}



