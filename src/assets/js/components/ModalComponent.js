var ModalComponent = function(){
	var pRenderer_, callback_, objActModal;
	var uiModal_, uiModTitle_; 
	var mData, videoPlayer_, pdfContainer_;
	var modelFor_;
	var mainModal_;
	var cardContainer_;
	var imageComponent_;
	var agendaTimer;
	var timeout = 12000

	
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

		mainModal_.html('');
		$("#mh0").html("")
		$("#exampleModal .tabs").remove();
		$("#exampleModal .searchBar").remove();
		//$("#exampleModal .searchBar").remove();
		//uiModTitle_.html("");
		//$("#exampleModal .tabs").hide();

		objActModal_ = _o;
		if(_o.popup_type === "player"){
			modelFor_ = "player";
			$("#mh0").html(modalHeader("Now playing: "+_o.title, ""))
			videoComponent_.renderVideo(mainModal_[0], {videoid:_o.action_link, autoplay:true, muted:false, pos:"modal"})
		}else if(_o.popup_type === "user"){
			mData = _o;
			getHtml(_o);
		}else if(_o.popup_type === "leaderBoard"){
			mData = _o;
			getHtml(_o);
		}else{
			if(_o.action_link === ""){
				alert("Link not available: "+_o.popup_type)
			}else{
				modelFor_ = "others";
				//_o.action_link = "resource.json?eventid=f5n9o69lkl"
				//_o.action_link = "playlists.json?uuid=f5n9o69lkl"
				//_o.action_link = "users/attendees.json?eventid=f5n9o69lkl"
				//_o.action_link = "users/ausers/mybriefcase.json"
				//_o.action_link = "agenda.json?eventid=f5n9o69lkl"
				//_o.action_link = "polls.json?uuid=fr1voo9ogo"
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
		$("#mh0").html(modalHeader(objActModal_.popup_type, ""))
		//uiModTitle_.html(objActModal_.popup_type);
		switch(t){
			case "poll":
			polls()
			break;

			case "staticpage":
			qna();
			
			break;

			case "agenda":
			modalTab(["All", "Live", "Upcoming", "Completed"], agendaTab)
			agenda("all");
			break;

			case "playlist":
			playlist()
			break;

			case "resource":
			resources();
			//boothAttendies()
			break;


			case "attendees":
			modalTabAttendees()
			attendees([]);
			break;

			case "briefcase":
			modalTab(["All", "Videos", "Business Card", "Document"], briefcaseTab)
			briefcase("all");
			break;


			case "myProfile" :
			myProfile(true)
			
			
			break;


			case "leaderBoard":
			modalTabLeaderBoard()
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
	//	leaderBoard(type)


	}

	var modalTabLeaderBoard = function(){}

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
	var myProfileHTML = function(){
		//var user = EventStore.getUserProfile();
		var user = EventStore.getUser();
		var url = user.image;
		
		if(url === ""){
			url = "images/user-thumb.jpg"
		}
		return '<div class="my-profile" id="userprofile"> <div class="row m0"> <div class="user-profile"> <div class="user-image"> <img src="'+url+'" alt=""> </div><div class="edit-image edit123456-image123456 mt-3" style="display:none;"> <button type="button" class="btn btn btn-outline-secondary btn-sm123456 ">UPLOAD PHOTO</button> <input type="file"> </div></div><div class="profile-rhs"><form class="darkForm"> <div class="form-group"> <label for="exampleInputEmail1" class="labelTxt">Name</label><input type="text" class="form-control" data-edt="1" aria-describedby="emailHelp" placeholder="'+user.firstname+'" name="firstname"> </div><div class="form-group"> <label for="exampleInputEmail1" class="labelTxt">&nbsp;</label><input type="text" class="form-control"" data-edt="1" placeholder="'+user.lastname+'" name="lastname"> </div><div class="form-group"> <label for="" class="labelTxt">Designation</label><input type="tex" class="form-control" data-edt="1" placeholder="'+user.jobtitle+'" name="jobtitle"> </div><div class="form-group"> <label for="" class="labelTxt">Company</label><input type="text" class="form-control" data-edt="1" placeholder="'+user.companyname+'" name="company"> </div><div class="form-group"> <label for="" class="labelTxt">Phone Number</label><input type="number" class="form-control"  data-edt="1" placeholder="+91-9999999999" name="phone"> </div><div class="user-footer"><p><b>OFFICIAL EMAIL ADDRESS</b> <span>'+user.email+'</span></p> <button type="button" id="btnProfile" class="btn btn-primary btn-sm">Save</button></div></form></div></div></div><div class="modal-footer"></div>'
	}


	var myProfile = function(_mainModal){
			if(_mainModal){
				mainModal_.html(myProfileHTML());	
			}else{
				$(".modal-body.p1").html(myProfileHTML())
			}
			
			$(".my-profile #btnProfile").off("click").on("click", function(){
				var t = ".my-profile"
				var fn = $(t+" [name=firstname]");
                var ln = $(t+" [name=lastname]");
                var c = $(t+" [name=company]");
                var j = $(t+" [name=jobtitle]")
                var p = $(t+" [name=phone]")
                
                
                var d = {}
                d["firstname"] = fn.val() === "" ? fn.attr("placeholder") : fn.val()
                d["lastname"] = ln.val() === "" ? ln.attr("placeholder") : ln.val()
                d["jobtitle"] = j.val() === "" ? j.attr("placeholder") : j.val()
                d["companyname"] = c.val() === "" ? c.attr("placeholder") : c.val()
                d["phone"] = p.val()


                var fd = new FormData()
                fd.append("firstname", d["firstname"])
                fd.append("lastname", d["lastname"])
                fd.append("jobtitle", d["jobtitle"])
                fd.append("companyname", d["companyname"])
                fd.append("phone", d["phone"])

               
                Utility.loader({url: "users/update.json", data : fd, type :"POST", cb:function(_d){
                    console.log("done", _d)
                   // profileTab("a0")
                    EventStore.updateUserProfile(d)
                    showAlert("success", "Your profile is updated")

                    if(!_mainModal){
                    	cardContainer_.updateCard(d);
                    	$("#exampleModal2 button").click()
                    }else{
                    	$("#exampleModal").modal("hide");
                    }
                }});
                
               

			})
			

	}

	var profileTab = function(type){
		// if(type === "a0"){
		// 	$("#modalBodyP0 .my-profile [data-edt=1]").prop("disabled", true);
		// 	$("#modalBodyP0 .my-profile").addClass("nonEdit");
		// }else{
		// 	$("#modalBodyP0 .my-profile [data-edt=1]").prop("disabled", false);
		// 	$("#modalBodyP0 .my-profile").removeClass("nonEdit");
		// }
	}

	


	/*POLLS*/
	var polls = function(){
		
		
		if(mData.body[0].submitted_answers){
			q = mData.body[0].questions = JSON.parse(mData.body[0].submitted_answers)
		}else{
			q = mData.body[0].questions = JSON.parse(mData.body[0].questions);
		}


		var chckd = "", star, txtval;
		var str = '<div class="feedback"><ul>'
		for(var i=0; i<q.length; i++){

			str += '<li>';
			str += '<p>'+q[i].title+'</p>'
			var qa = q[i].answers
			for(var j=0; j<qa.length; j++){
				str += '<div class="form-check">';
				if(q[i].type === "radiobutton"){
					if(q[i].user_answer && q[i].user_answer.length != 0){
						if(q[i].user_answer[0] === qa[j]){
							chckd = "checked"
						}
					}
				
					str += '<label class="form-check-label" for="exampleRadios1"><input class="form-check-input" type="radio" name="qa'+i+'" value="'+qa[j]+'"  '+chckd+'>'
					str += '<span>'+qa[j]+'</span></label>'

				}else if(q[i].type === "checkbox"){
					if(q[i].user_answer && q[i].user_answer.length != 0){
						if(q[i].user_answer.indexOf(qa[j]) !== -1){
							chckd = "checked"
						}
					}

					str += '<label class="form-check-label" for="exampleCheck1"><input type="checkbox" class="form-check-input" name="qa'+i+'" value="'+qa[j]+'" data-id=q_'+i+' '+chckd+'>'
					str += '<span>'+qa[j]+'</span></label>'


				}
				str += '</div>'
				chckd = "";
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
					txtval = q[i].user_answer;
				}
				str += '<div class="form-group">'
          		str += '<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea></div>'
        
			}
			str+='</li>'
			chckd = "";
		}
		str += '</ul><button id="postData" class="btn btn-primary float-right mt-3">Submit</button></div>'
		str += '<div class="modal-footer"></div>'
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
			
			var fd = new FormData();
			fd.append("data", JSON.stringify(mData)) 


			Utility.loader({url: objActModal_.action_link, data : fd, type :"POST", cb:function(_d){
				if(_d.data){
					$("#exampleModal").modal("hide");
				}else{
					alert("some issue in posting")
				}
				showAlert("success", "Thank you for your feedback.")
			}});
			
		})
	}

	/* QnA */
	var qna = function(){
		var tm = mData.body[0].data;
		mainModal_.html(mData.body[0].data+'<div class="modal-footer"></div>');
	}

	
	/* AGENDA */
	var agenda = function(par){

		//mData.body[0].slot_data[3].status = 0
		//mData.body[0].slot_data[5].status = 0
		//mData.body[0].slot_data[2].status = 1
		//mData.body[0].slot_data[6].status = 1
		
		var agen = filterAgenda(par)

		var label, clss, title, nameField, dis, disbtn;
		var str = "";
		
		for(var i = 0; i < agen.length; i++){
			nameField = "";
			dis = "";
			disbtn = ""
			title = agen[i].title
			
			if(agen[i].status == 0){
				clss = "liveBtn";
				label = "live";
			}else if(agen[i].status == 1){
				clss = "upcomingBtn";
				label = "upcoming";
				disbtn = "disabled"
			}else if(agen[i].status == 2){
				clss = "completeBtn";
				//label = "completed";
				label = '<b>View</b> <span>completed</span></button>'
			}
			
			var tm = agen[i].speakers;
			for(var j=0; j<tm.length; j++){
				nameField += tm[j].name+", "+tm[j].company
				if((j + 1) < tm.length){
					nameField += ' | ';
				}
			}

			if(agen[i].status === 1 || agen[i].status === 0){
				dis = "disableIcon"
			}else{
				if(agen[i].added === 1)
					dis = "disableIcon"	
			}


			
			
			str += '<li class="list-group-item" data-type="'+label+'"><div class="row"><div class="col-md-2 alignText"><button type="button" class="btn btn-primary btn-sm '+clss+'" '+disbtn+' data-ind="'+i+'">'+label+'</button></div><div class="col-md-5 f12"><b class="db f14">'+agen[i].title+'</b>'+nameField+'</div><div class="col-md-4 alignText"><span class="f12">'+agen[i].starttime+'</span></div><div class="col-md-1 alignText"><div data-id="'+i+'" class="iconSVG '+dis+'"><img src="images/briefcase.svg" alt=""></div></div></div></li>';
		}
		mainModal_.html('<div class="agenda"><ul class="list-group">'+str+'</ul></div><div class="modal-footer"></div>')

		$("#modalBodyP0 .iconSVG").off("click").on("click", function(){
			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon");
			addedToBriefCase(agen[parseInt($(this).attr("data-id"))].asset_id);
		})

		$("#modalBodyP0 button").off("click").on("click", function(){
			var _o = agen[parseInt($(this).attr("data-ind"))];
			renderVideoN({videoid:_o.resource.resource, title:_o.title, mainObj:_o});

		})	

		agendaTimer = setTimeout(function(){
			agendaTimer = null;
			Utility.loader({url: objActModal_.action_link, prldr:"H", cb:mDataLoaded.bind(this)});
		}, timeout)
	}

	var filterAgenda = function(type){
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
		$("#modalBodyP0 li").hide();
		var t = "all"
		if(type === "a0"){
			$("#modalBodyP0 li").show();
		}else if(type === "a1"){
			$("#modalBodyP0 [data-type=live]").show()
		}else if(type === "a2"){
			$("#modalBodyP0 [data-type=upcoming]").show();
		}else if(type === "a3"){
			$("#modalBodyP0 [data-type=completed]").show();
		}
	}

	
	/* Resources */
	var resources = function(){
		var tm = mData.body;
		var dis = "";
		var str = '<div class="resources"><ul class="list-group">'
		for(var i=0; i<tm.length; i++){
			str += '<li class="list-group-item">';
			str += '<div class="row">'

			//added
			// str += '<div class="col-md-2 pr-0">'
			// str += '<button type="button" class="btn btn-secondary btn-sm" data-id="'+i+'" >View</button>'
			// str += '</div>'



			if(tm[i].added){
				dis = "disableIcon"
			}

			if(tm[i].type === "live" || tm[i].type === "video"){
				//added
				str += '<div class="col-md-1">'
				str += '<div class="material-icons">videocam</div>';
				str += '</div>';
			}else{
				str += '<div class="col-md-1">'
				str += '<div class="material-icons mr-3">description</div>'
				str += '</div>'
			}

			str += '<div class="col-md-8">'+tm[i].title+'</div>'

			str += '<div class="col-md-2">'
			str += '<button type="button" class="btn btn-secondary btn-sm" data-id="'+i+'" >View</button>'
			str += '</div>'

			//briefcase
			str += '<div class="col-md-1 alignText">'

			str += '<div  data-id="'+i+'" class="iconSVG '+dis+'">'
			str += '<img src="images/briefcase.svg" alt="">'
			str += '</div>'
			str += '</div></li>'
			dis = ""
			
			
		
		}

		str += '<div class="modal-footer"></div>'

		mainModal_.html(str);
		$("#modalBodyP0 li .iconSVG").off("click").on("click", function(){
			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon")
			addedToBriefCase(tm[parseInt($(this).attr("data-id"))].uuid);
			
		})

		$("#modalBodyP0 li button").off("click").on("click", function(){
			var ot = tm[parseInt($(this).attr("data-id"))];
			

			if(ot.type === "video" || ot.type === "live"){
				renderVideoN(ot)
			}else if(ot.type === "pdf"){
				populatePDF(ot)
			}else if(ot.type === "image"){
				populateImage(ot)
				
			}



			// console.log(tm[parseInt($(this).attr("data-id"))])
			
			// getComponentData($(this).attr("data-id"), tm);
		})
	}

	/* Playlist */
	var playlist = function(){
		var tm = JSON.parse(mData.body[0].playlistsource);
		var str = "", dis;
		for(var i=0; i<tm.length; i++){
			dis = ""
			if(tm[0].added){
				dis = "disableIcon";
			}
			str += '<li class="list-group-item"><div class="row"  data-id="'+i+'"><div class="col-md-1"><div class="material-icons">videocam</div></div><div class="col-md-8"><b>'+tm[i].name+'</b></div><div class="col-md-2 alignText"><button type="button" class="btn btn-secondary btn-sm">PLAY</button></div><div class="col-md-1 alignText"><div data-id="'+i+'" class="iconSVG '+dis+'"><img src="images/briefcase.svg" alt=""></div></div></li>'
		}


		mainModal_.html('<ul class="list-group">'+str+'</ul><div class="modal-footer"></div>');
		$("#modalBodyP0 li .iconSVG").off("click").on("click", function(){
			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon");
			addedToBriefCase(tm[parseInt($(this).attr("data-id"))].assetid);

		})
		$("#modalBodyP0 li button").off("click").on("click", function(){
			var ind = parseInt($(this).parent().parent().attr("data-id"));
			renderVideoN({videoid:tm[ind].videoid, title:tm[ind].name, mainObj:tm[ind]});
		})



		

	}

	/*  Attendees */
	var modalTabAttendees = function(){
		
		var str = '<div class="searchBar">'
		str += '<input type="text" id="attSearch" name="" placeholder="Search by name, company, designation">'
		str += '<i class="material-icons">search</i>'		
		str += '<div class="refreshIcon"><i class="material-icons">refresh</i></div>'
		str += '</div>'

		//$( str ).insertAfter( "#exampleModalLabel" );
		$("#mh0").html(modalHeader(objActModal_.popup_type, str))

		$("#exampleModal .searchBar i").off("click").on("click", function(){
			/*var v = Utility.trim($("#attSearch").val()).toLowerCase();
			var s = mData.body.filter(it => {
				return it.firstname.toLowerCase().indexOf(v) !== -1 || it.lastname.toLowerCase().indexOf(v) !== -1 || it.companyname.indexOf(v) !== -1 || it.jobtitle.toLowerCase().indexOf(v) !== -1 
			})

			if(s.length){
				attendees(s)
			}else{
				attendees([])
			}*/
			keyEnter()
			
		})

		$("#exampleModal .searchBar").off("keypress").on('keypress',function(e) {
		    if(e.which == 13) {
		        keyEnter()
		    }
		});

		$("#exampleModal .refreshIcon i").off("click").on("click", function(){
			$("#attSearch").val("");
			Utility.loader({url: objActModal_.action_link, cb:function(_o){
				mData = _o.data;
				//modalTabAttendees()
				attendees([]);
			}});
		})
	}

	var keyEnter = function(){
		var v = Utility.trim($("#attSearch").val()).toLowerCase();
		var s = mData.body.filter(it => {
			return it.firstname.toLowerCase().indexOf(v) !== -1 || it.lastname.toLowerCase().indexOf(v) !== -1 || it.companyname.indexOf(v) !== -1 || it.jobtitle.toLowerCase().indexOf(v) !== -1 
		})

		if(s.length){
			attendees(s)
		}else{
			attendees([])
		}
	}



	/* Attendees */
	var attendees = function(arr){
		var tm;
		if(arr.length === 0){
			tm = mData.body
		}else{
			tm = arr;
		}



		var tuuid = EventStore.getUser().uuid; //"f5496ku9g6"
		//fiterout the current user

		var dis = ""
		var str = '<div class="participants">'
		str += '<ul class="list-group">'
		console.log(tm)

		for(var i=0; i<tm.length; i++){
			//console.log(tuuid, " !== ", tm[i].uuid)
			if(tuuid !== tm[i].uuid){
				if(tm[i].cardShared){
					dis = "disableIcon"
				}
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
				//if(tuuid !== tm[i].uuid){
					str += '<div class="col-md-3">'
					str += '<div class="actions">'
					str += '<img src="images/chat.svg" alt="" data-id="chat_'+i+'">'
					//str += '<i class="material-icons">mail</i>'
					str += '<img src="images/briefcase.svg" alt="" data-id="mail_'+i+'">'


					
					str += '<img src="images/business-card.svg" alt=""  data-id="bcard_'+i+'" class="'+dis+'">'
					
					str += '</div>'
					str += '</div>'
				//}

				str += '</div>'
				str += '</li>'
			}
		}
		str += '</ul>'
		str += '</div>'
		str += '<div class="modal-footer"></div>'
		
		


		mainModal_.html(str);
		//add click events
		$("#modalBodyP0 .actions img").off("click").on("click", function(){

			if($( this ).hasClass( "disableIcon" ))
				return


			var l = $(this).attr("data-id").split("_");
			var t = l[0];
			var o = mData.body[parseInt(l[1])]



			if(t === "chat"){
				$("#exampleModal").modal("hide");
				Chat.openSingleWindow(o);
			}else if(t === "mail"){
				populateMail(o, true, this)
			}else if(t === "bcard"){
				populateCard(o, true, this)

			}
		})

	}

	
	/* Briefcase */
	var briefcase = function(par){
		var tm = mData.data.resources
		var str = "";

		str += '<div class="modal-body p0"><div class="briefcase"><ul class="list-group">'
		var lab, imgIcon, dnld, dsbl, tit, doctype;
		
		for(var i=0; i<tm.length; i++){
			imgIcon = dnld = dsbl = "";
			dnld = "download.svg";
			lab = "VIEW";
			doctype = ""

			if(tm[i].type === "doc" || tm[i].type === "image" || tm[i].type === "pdf"){
				imgIcon = "document.svg";
				tit = tm[i].title;
				doctype = "doc";
			}else if(tm[i].type === "video"){
				lab	= "PLAY";
				imgIcon = "";
				doctype = "video";
				tit = tm[i].title;
			}else if(tm[i].type === "business_card"){
				imgIcon = "business-card.svg";
				tit = tm[i].name; 
				doctype = "business_card"
			}
			str += '<li data-type="'+doctype+'"><div class="row"><div class="col-md-1"><label class="form-check-label" for="exampleCheck1"><input type="checkbox" class="form-check-input"  data-ind='+i+'><span></span></label></div><div class="col-md-1">'
			if(tm[i].type === "video"){
				str += '<i class="material-icons">videocam</i></div><div class="col-md-8">'+tit+'</div>'		
			}else{
				str += '<img src="images/'+imgIcon+'" alt=""></div><div class="col-md-8"><img src="images/download.svg" alt="" class="mr-2" data-type="dwnld" data-id="'+i+'">'+tit+'</div>'
			}
			str += '<div class="col-md-2 alignText"><button type="button" class="btn btn-secondary text-uppercase" id="btnview" data-id='+i+'>'+lab+'</button></div></div></li>'
		
		}

		str += '</ul></div><div class="modal-footer"><p>Only content with <i class="material-icons f18">file_download</i> icon can be downloaded</p><button type="button"  id="btndeletes" class="btn btn-secondary text-uppercase">Delete <i class="material-icons f16">delete</i></button><button type="button"  id="btndownloads" class="btn btn-secondary text-uppercase"><i class="material-icons f18">file_download</i> Download</button></div>'


		mainModal_.html(str);
		var bntdel = $('#modalBodyP0 #btndeletes');
		bntdel.hide()

		$('#modalBodyP0 .briefcase [type=checkbox]').off("click").on("click", function(){
			if($('#modalBodyP0 .briefcase [type=checkbox]:checked').length !== 0){
				bntdel.show();
			}else{
				bntdel.hide();
			}
		})

		$('#modalBodyP0 .briefcase [data-type=dwnld]').off("click").on("click", function(){
			var ind = parseInt($(this).attr("data-id"))
			var oT = mData.data.resources[ind];
			downloadfile({title:"download", url:baseUrl+"resource/download.json?resourceid="+oT.uuid+"&eventid="+eventId})
		})

		$('#modalBodyP0 #btnview').off("click").on("click", function(e){
			e.stopPropagation();
			var ind = parseInt($(this).attr("data-id"));
			var oT = mData.data.resources[ind];
		
			if(oT.type === "business_card"){
				populateCard(oT, false, this)
			}else if(oT.type === "pdf"){
				populatePDF(oT)
			}else if(oT.type === "image"){
				populateImage(oT)
			}else if(oT.type === "video"){
				oT["videoid"] = oT.resource;
				renderVideoN(oT)
			}else {
				alert("no id is available")
			}
		})

		$('#modalBodyP0 #btndownloads').off("click").on("click", function(e){
			e.stopPropagation();
			var tstr = [];
			$('#modalBodyP0  [type=checkbox]:checked').each(function( index ) {
				var ind = parseInt($(this).attr("data-ind"));
				console.log("type::"+mData.data.resources[ind].type)
				if(mData.data.resources[ind].type !== "video"){
			  		tstr.push(mData.data.resources[ind].uuid);
				}
			});
			if(tstr.length !== 0){
				downloadfile({title:"download", url:baseUrl+"resource/download.json?resourceid="+tstr.join(",")+"&eventid="+eventId})
			}
		})


		bntdel.off("click").on("click", function(e){
			e.stopPropagation();
			
			//var chk = $("#modalBodyP0 [type=checkbox]:checked").parent().parent().parent().parent();
			var tstr = []
			$("#modalBodyP0 [type=checkbox]:checked").each(function( index ) {
				var ind = parseInt($(this).attr("data-ind"));
				tstr.push(mData.data.resources[ind].uuid);
			});

			
			//SEND THE DATA TO DELETE t array

			if(tstr.length != 0){
				var fd = new FormData();
				fd.append("resourceid", tstr.join(",")) 
				Utility.loader({url: "users/removefrombriefcase.json", data : fd, type :"POST", cb:function(_d){
					showAlert("success", "Selected items deleted.")
					mData.data.resources = mData.data.resources.filter(function(val) {
					  return tstr.indexOf(val.uuid) == -1;
					});
					 briefcase();
				}});
			}




		})
		
	}
	var singleFiledownload = function(obj){}

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
	}
	var downloadFilterItems = function(){}
	var deleteFilterItem = function(){}

	

	var boothAttendies = function(){

		var arr = [10]
		var str = '<div class="booth row m0">'

		for(var i=0; i<10; i++){

			str += '<div class="col-sm-4">'
			str += '<div class="card">'
			str += '<div class="booth-lhs">'
			str += '<div class="booth-avatar">'
			str += '<i class="material-icons">account_circle</i>'
			str += '</div>'
			str += '<b class="db">Available</b>'
			str += '</div>'
			str += '<div class="booth-rhs">'
			str += '<b>Pallav Samaddar</b>'
			str += '<div class="booth-actions available">'
			str += '<p class="video-call" data-id=vid_'+i+'>'+vidCallout()
			str += '</p>'
			str += '<p class="chat-call"  data-id=chat_'+i+'>'+chatCallout()
			str += '</p>'
			str += '</div>'
			str += '</div>'
			str += '</div>'
			str += '</div>'


		}

		str += '</div>'
		str += '<div class="modal-footer"></div>'
		mainModal_.html(str);

		$("#modalBodyP0 .booth [data-id]").off("click").on("click", function(){
			var t = $(this).attr("data-id").split("_");
			if(t[0] === "vid"){
				alert("video")
			}else{
				alert("chat")
			}
		})


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
		if((_o.resource.split('.').pop().toLowerCase() === "pdf") && mimeCheck("application/pdf")){
			$("#exampleModal2 #exampleModalLabel2").text(_o.title)
			pdfContainer_.renderPDF(_o)
			//$("#exampleModal").modal("hide");
			$("#exampleModal2").modal("show");
		}else{
			downloadfile(_o)
		}
		
	}
	
	var populateMail = function(_o){
		emailCOntainer.renderEmail($("#modalinsidebody"), _o)
	}

	var populateCard = function( _o, _editable, _ref){
		$(".modal-overlay-cont #modalinsidelable").text("Business Card ");
		$(".modal-overlay-cont .titleHdng").text('Sharew Your Card to '+_o.firstname+ ' ' + _o.lastname+' ('+_o.companyname+')');
		$(".modal-overlay-cont").addClass("show");
		cardContainer_.renderCard($("#modalinsidebody"), _o, _editable, cardEditAction.bind(this), _ref);
	}

	var renderVideoN = function(_o){
		//$(".modal-overlay-cont").removeClass("H");
		$(".modal-overlay-cont").addClass("show");
		$(".modal-overlay-cont #modalinsidelable").text("Now playing: "+_o.title);
		_o.pos = "wall";
		_o.autoplay = true;
		_o.muted = false
		videoComponent_.renderVideo($("#modalinsidebody")[0], _o)


	}

	var populateImage = function(_o){
		$(".modal-overlay-cont").addClass("show");
		$(".modal-overlay-cont #modalinsidelable").text(_o.title);
		imageComponent_.renderImage($("#modalinsidebody")[0], _o)

	}

	var renderVideo = function(_id, arr){
		// var t = arr.filter(it => {
		// 	return it.videoid === _id
		// });

		
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
			$("#exampleModal2 .modal-body").html("")
			$("#exampleModal").modal("show");
		})

		$("#exampleModal").on('hidden.bs.modal', function(){
			//console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt")
			//if(modelFor_ === "player"){
				$("#exampleModal .modal-body").html("")
				$(".modal-overlay-cont #modalinsideclose").click();

				if(objActModal_.popup_type === "agenda" && agendaTimer){
					clearInterval(agendaTimer);
				}


			//}
		  });


		$(".modal-overlay-cont #modalinsideclose").off("click").on("click", function(){
			//console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa")
			$("#exampleModal .modal-overlay-cont").removeClass("show");
			$(".modal-overlay-cont #modalinsidebody").html("");
			$(".modal-overlay-cont .titleHdng").html("")
			videoComponent_.destroyPlayer()
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
		
		//$( str ).insertAfter( "#exampleModalLabel" );
		$("#mh0").html(modalHeader(objActModal_.popup_type, str))

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
		console.log(obj.url)
		var element = document.createElement('a');
		element.setAttribute('href', obj.url);
		element.setAttribute('download', obj.title);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	var addedToBriefCase = function(rid){
		///users/addtobriefcase.jso

		

		var fd = new FormData();
		fd.append("resourceid", rid) 
		Utility.loader({url: "users/addtobriefcase.json", data : fd, type :"POST", cb:function(_d){
			console.log("done")
			showAlert("success", "Added to your briefcase")
			
		}});
	}

	var cardEditAction = function(){
		$("#exampleModal2 #exampleModalLabel2").text("My Profile")
		$("#exampleModal2").modal("show");
		$("#exampleModal2 .tabs").remove();
		myProfile(false)
		//modalTabModal2(["VIEW", "EDIT"], profileTab2)
	}

	var modalTabModal2 = function(arr, cb){
		
	}

	


	var profileTab2 = function(type){
		if(type === "a0"){
			$("#modalBodyP1 .my-profile [data-edt=1]").prop("disabled", true);
			$("#modalBodyP1 .my-profile").addClass("nonEdit");
		}else{
			$("#modalBodyP1 .my-profile [data-edt=1]").prop("disabled", false);
			$("#modalBodyP1 .my-profile").removeClass("nonEdit");
		}
	}


	var showAlert = function(ty, txt){
		Notification.notify(ty, txt);
	}

	var modalHeader = function(_header, _tabs){
		return '<h5 class="modal-title" id="exampleModalLabel">'+_header+'</h5>'+_tabs+'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002"><path d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"/></svg></button>';
	}

	var vidCallout = function(){
		return '<svg xmlns="http://www.w3.org/2000/svg" width="46.484" height="42" viewBox="0 0 46.484 42"><defs><style>.b{fill:#ccc;}</style></defs><g transform="translate(-93 -81)"><circle cx="21" cy="21" r="21" transform="translate(93 81)"/><path class="b" d="M19.6,13.852V10.078A1.081,1.081,0,0,0,18.518,9H5.578A1.081,1.081,0,0,0,4.5,10.078V20.861a1.081,1.081,0,0,0,1.078,1.078H18.518A1.081,1.081,0,0,0,19.6,20.861V17.087L23.909,21.4V9.539Zm-3.235,2.7H13.126v3.235H10.97V16.548H7.735V14.391H10.97V11.157h2.157v3.235h3.235Z" transform="translate(101.2 86.561)"/><path d="M2.064-2.874,9.484,10.15-3.354,6.39V7.72Z" transform="translate(130 109)"/></g></svg>'
	}


	var chatCallout = function(){
		return '<svg xmlns="http://www.w3.org/2000/svg" width="47.484" height="42" viewBox="0 0 47.484 42"><defs><style>.b{fill:#ccc;}</style></defs><g transform="translate(-202 -81)"><circle cx="21" cy="21" r="21" transform="translate(202 81)"/><path class="b" d="M19.514,3H4.835A1.832,1.832,0,0,0,3.009,4.835L3,21.349l3.67-3.67H19.514a1.84,1.84,0,0,0,1.835-1.835V4.835A1.84,1.84,0,0,0,19.514,3ZM17.679,14.009H6.67V12.174H17.679Zm0-2.752H6.67V9.422H17.679Zm0-2.752H6.67V6.67H17.679Z" transform="translate(211.2 90)"/><path d="M2.064-2.874,9.484,10.15-3.354,6.39V7.72Z" transform="translate(240 109)"/></g></svg>'
	}

	return {
		init: init,
		renderModal: renderModal
	}
}



