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

		mainModal_.html('');
		$("#exampleModal .tabs").remove();
		$("#exampleModal .searchBar").remove();
		//$("#exampleModal .searchBar").remove();


		uiModTitle_.html("");
		//$("#exampleModal .tabs").hide();

		objActModal_ = _o;
		//
		if(_o.popup_type === "player"){
			modelFor_ = "player";

			videoComponent_.renderVideo(mainModal_[0], {videoid:_o.action_link, autoplay:true, muted:false, pos:"modal"})
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
		//console.log(t)
		switch(t){
			case "poll":
			uiModTitle_.html(objActModal_.popup_type);
			polls()
			break;

			case "staticpage":
			uiModTitle_.html(objActModal_.popup_type);
			qna();
			
			break;

			case "agenda":
			uiModTitle_.html(objActModal_.popup_type);
			modalTab(["All", "Live", "Upcoming", "Completed"], agendaTab)
			agenda("all");
			break;

			case "playlist":
			uiModTitle_.html(objActModal_.popup_type);
			playlist()
			break;

			case "resource":
			uiModTitle_.html(objActModal_.popup_type);
			resources();
			break;


			case "attendees":
			uiModTitle_.html(objActModal_.popup_type);
			modalTabAttendees()
			attendees([]);
			break;

			case "briefcase":
			//uiModTitle_.html("briefcase");
			uiModTitle_.html(objActModal_.popup_type);
			modalTab(["All", "Videos", "Business Card", "Document"], briefcaseTab)
			briefcase("all");
			break;


			case "myProfile" :
			//uiModTitle_.html("User Profile");
			uiModTitle_.html(objActModal_.popup_type);
			modalTab(["VIEW", "EDIT"], profileTab)
			myProfile()
			
			
			break;


			case "leaderBoard":
			//uiModTitle_.html("board");
			modalTabLeaderBoard()
			//modalTab(["LEADER BOARD", "MY POINTS", "CRITERIA", "T & C"], leaderBoardTab)
			leaderBoard("a0")
			break;

			case "chatbox" :
			break;



		}

		
	}

	/* Leader Board*/
	var leaderBoard = function(par){
		//mainModal_.html(lbTab(par));
	}

	var leaderBoardTab = function(type){
	//	leaderBoard(type)


	}

	var modalTabLeaderBoard = function(){

		// var str = '<div class="leaderHeader"> '
		// str +=  '<h5 class="modal-title" id="exampleModalLabel"></h5>'
		// str +=  '<div class="tabsBlock">'
		// str +=  '<ul class="nav nav-tabs">'
		// str +=  '<li class="nav-item active">LEADER BOARD</li>'
		// str +=  '<li class="nav-item">MY POINTS</li><li class="nav-item">CRITERIA</li>'
		// str +=  '<li class="nav-item">T &amp; C</li>'
		// str +=  '</ul>'
		// str +=  '</div><div class="searchBar">'
		// str +=  '<input type="text" id="attSearch" name="" placeholder="Search by Name"><i class="material-icons">search</i>'
		// str +=  '<div class="refreshIcon">'
		// str +=  '<i class="material-icons">refresh</i></div></div>'


       // str +=  '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
        
      //  str +=    '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002"><path d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"></path></svg>'
      //   str +=    '</button></div>'

		//$( str ).insertAfter( "#exampleModalLabel" );


		// var str = '<div class="searchBar">'
		// str += '<input type="text" id="attSearch" name="" placeholder="Search by Name">'
		// str += '<i class="material-icons">search</i>'		
		// str += '<div class="refreshIcon"><i class="material-icons">refresh</i></div>'
		// str += '</div>'

		// $( str ).insertAfter( "#exampleModalLabel" );

		
	}

	var lbTab = function(t){




		// var str = '<div class="leaderboard"><h5> To be added</h5></div>'
		// if(t === "a0"){
		// 	str = '<div class="leaderboard"> <div class="row listTable m0"> <div class="row-th"> <div class="th-col col-md-2 text-center">Rank</div><div class="th-col col-md-8">Attendee</div><div class="th-col col-md-2">Points</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">2</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">3</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">4</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div><div class="row-td"> <div class="td-col col-md-2 text-center">5</div><div class="td-col col-md-8">Dhananjay Singh <br>The Times Of India - Tech Lead</div><div class="td-col col-md-2">555555</div></div></div></div>'
		// }else if(t === "a1"){
			
		// }else if(t === "a2"){

		// }else if(t == "a3"){

		// }

		// return str

	}



	/* My Profile */
	var myProfileHTML = function(){
		var user = EventStore.getUserProfile();
		var dis = "disabled"

		var str = '<div class="my-profile nonEdit" id="userprofile"> <div class="row m0"> <div class="user-profile"> <div class="user-image"> <img src="images/user-thumb.jpg" alt=""> </div><div class="edit-image edit123456-image123456 mt-3"> <button type="button" class="btn btn btn-outline-secondary btn-sm123456 ">UPLOAD PHOTO</button> <input type="file"> </div></div><div class="profile-rhs">'
		str += '<form class="darkForm"> <div class="form-group"> <label for="exampleInputEmail1" class="labelTxt">Name</label>'
		str += ' <input type="text" class="form-control" data-edt="1" aria-describedby="emailHelp" placeholder="'+user.firstname+'" name="firstname"> </div><div class="form-group"> <label for="exampleInputEmail1" class="labelTxt">&nbsp;</label>'
		str += ' <input type="text" class="form-control"" data-edt="1" placeholder="'+user.lastname+'" name="lastname"> </div><div class="form-group"> <label for="" class="labelTxt">Designation</label>'
		str += ' <input type="tex" class="form-control" data-edt="1" placeholder="'+user.jobtitle+'" name="jobtitle"> </div><div class="form-group"> <label for="" class="labelTxt">Company</label>'
		str += ' <input type="text" class="form-control" data-edt="1" placeholder="'+user.companyname+'" name="company"> </div><div class="form-group"> <label for="" class="labelTxt">Email Address</label>'
		str+= ' <input type="text" class="form-control" placeholder="'+user.email+'" name="email" disabled> </div><div class="form-group"> <label for="" class="labelTxt">Phone Number</label>'
		str += ' <input type="number" class="form-control"  data-edt="1" placeholder="+91-9999999999" name="phone" disabled> </div>'
		str += '<div class="user-footer"><p><b>OFFICIAL EMAIL ADDRESS</b> <span>+user.email+</span></p> <button type="button" id="btnProfile" class="btn btn-primary btn-sm">Save</button></div></form></div>'
		str += '</div></div>'
		return str;


		/*var str = '<div class="my-profile nonEdit" id="userprofile"> <div class="row m0"> <div class="user-profile"> <div class="user-image"> <img src="images/card-avatar.svg" alt=""> </div><div class="edit123456-image123456 mt-3" style="display:none;"> <button type="button" class="btn btn btn-outline-secondary btn-sm123456 ">Edit Image</button> <input type="file"> </div></div><div class="profile-rhs">'
		str += '<form class="darkForm"> <div class="form-group"> <label for="exampleInputEmail1" class="labelTxt pl-0" style="left: 0">First Name</label>'
		str += ' <input type="text" class="form-control pl-0" data-edt="1" aria-describedby="emailHelp" placeholder="'+user.firstname+'" name="firstname"> </div><div class="form-group"> <label for="" class="labelTxt">Last Name</label>'
		str += ' <input type="text" class="form-control"" data-edt="1" placeholder="'+user.lastname+'" name="lastname"> </div><div class="form-group"> <label for="" class="labelTxt">Designation</label>'
		str += ' <input type="tex" class="form-control" data-edt="1" placeholder="'+user.jobtitle+'" name="jobtitle"> </div><div class="form-group"> <label for="" class="labelTxt">Company</label>'
		str += ' <input type="text" class="form-control" data-edt="1" placeholder="'+user.companyname+'" name="company"> </div><div class="form-group"> <label for="" class="labelTxt">Email Address</label>'
		str+= ' <input type="text" class="form-control" placeholder="'+user.email+'" name="email" disabled> </div><div class="form-group"> <label for="" class="labelTxt">Phone Number</label>'
		str += ' <input type="number" class="form-control"  data-edt="1" placeholder="+91-9999999999" name="phone" disabled> </div><div class="form-group"> <button type="button" id="btnProfile" class="btn btn-primary btn-sm">Submit</button> </form> </div></div></div>'

		return str;*/

	}


	var myProfile = function(){

			mainModal_.html(myProfileHTML());
			$("#modalBodyP0 .my-profile [data-edt=1]").prop("disabled", true);

			$("#modalBodyP0 .my-profile #btnProfile").off("click").on("click", function(){
				var fn = $("#modalBodyP0 .my-profile [name=firstname]");
                var ln = $("#modalBodyP0 .my-profile [name=lastname]");
                var c = $("#modalBodyP0 .my-profile [name=company]");
                var j = $("#modalBodyP0 .my-profile [name=jobtitle]")
                var p = $("#modalBodyP0 .my-profile [name=phone]")
                
                
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
                    profileTab("a0")
                    EventStore.updateUserProfile(d)
                    showAlert("success", "Your profile is updated")
                    //debugger
                }});
                $("#modalinsideclose").click();

			})
			

	}

	var profileTab = function(type){
		if(type === "a0"){
			$("#modalBodyP0 .my-profile [data-edt=1]").prop("disabled", true);
			$("#modalBodyP0 .my-profile").addClass("nonEdit");
		}else{
			$("#modalBodyP0 .my-profile [data-edt=1]").prop("disabled", false);
			$("#modalBodyP0 .my-profile").removeClass("nonEdit");
		}
	}

	


	/*POLLS*/
	var polls = function(){
		/*mData.body[0].questions = JSON.parse(mData.body[0].questions);
		var q = mData.body[0].questions;
		debugger*/
		
		if(mData.body[0].submitted_answers){
			q = mData.body[0].questions = JSON.parse(mData.body[0].submitted_answers)
		}else{
			q = mData.body[0].questions = JSON.parse(mData.body[0].questions);
		}


		var chckd = "", star, txtval;
		var str = '<div class="feedback"><ul>'
		for(var i=0; i<q.length; i++){
			/*if(i == 0){
				q[i].user_answer.push("Poor")
			}else if(i == 3){
				q[i].user_answer.push("Is fallen")
			}else if(i == 5){
				q[i].user_answer[0] = "2"
			}else if(i == 6){
				q[i].user_answer = "This is contest"
			}*/

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
					//str += '<input class="form-check-input" type="radio" name="qa'+i+'" value="'+qa[j]+'"  '+chckd+'>'
					//str += '<label class="form-check-label" for="exampleRadios1">'+qa[j]+'</label>'
					
					str += '<label class="form-check-label" for="exampleRadios1"><input class="form-check-input" type="radio" name="qa'+i+'" value="'+qa[j]+'"  '+chckd+'>'
					str += '<span>'+qa[j]+'</span></label>'

				}else if(q[i].type === "checkbox"){
					if(q[i].user_answer && q[i].user_answer.length != 0){
						if(q[i].user_answer.indexOf(qa[j]) !== -1){
							chckd = "checked"
						}
					}
					// str += '<input type="checkbox" class="form-check-input" name="qa'+i+'" value="'+qa[j]+'" data-id=q_'+i+' '+chckd+'>'
					// str += '<label class="form-check-label" for="exampleCheck1">'+qa[j]+'</label>'

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
				//str += '<button type="button" class="btn btn-primary btn-sm completeBtn">View Completed</button>';
				str += '<button type="button" class="btn btn-primary btn-sm completeBtn">Completed</button>';
				str += '</div>'
			}	

			var tm = agen[i].speakers;
			// str += '<div class="col-md-5 alignText">';
			// str += '<b class="db">Welcome Address</b>'
			str += '<div class="col-md-5 f12">';
			str += '<b class="db f14">Welcome Address</b>'
			
			
			
			

			var s = ""
			for(var j=0; j<tm.length; j++){
				str += tm[j].name+", "+tm[j].company
				
				if((j + 1) < tm.length){
					str += ' | ';
				}
			}
			str += '</div>'	

			str += '<div class="col-md-4 alignText">';
			//str += '<div class="col-md-4">';
			//str += '<b class="db">Time: '+agen[i].starttime+'</b>'		
			str += '<span>Time: '+agen[i].starttime+'</span>'
			//str += '<span>Time: '+agen[i].starttime+'</span>'	
			str += '</div>'	

			//breiefcase
			//dis = ""
			if(agen[i].status === 2){
				dis = "disableIcon"
			}else{
				dis = ""
			}
			str += '<div class="col-md-1 alignText"><div data-id="'+i+'" class="iconSVG '+dis+'">';
			str += '<img src="images/briefcase.svg" alt="">';
			str += '</div>';
			str += '</div>'
			str += '</div></li>'
		}
		

		//closure ul
		str += '</ul></div>';
		mainModal_.html(str);

		$("#modalBodyP0 .iconSVG").off("click").on("click", function(){
			// var asid = $(this).parent().parent().parent().attr("data-asset");
			// var arr = agen.filter(function(it) {
			// 	return(it.resource.uuid === asid)
			// })

			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon");
			addedToBriefCase(agen[parseInt($(this).attr("data-id"))].asset_id);
			
			
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
				str += '<div class="material-icons mr-3">note</div>'
				str += '</div>'
			}
			
			str += '<div class="col-md-2">'
			str += '<button type="button" class="btn btn-secondary btn-sm" data-id="'+i+'" >View</button>'
			str += '</div>'
			str += '<div class="col-md-8">'+tm[i].title+'</div>'

			//briefcase
			str += '<div class="col-md-1 alignText">'

			str += '<div  data-id="'+i+'" class="iconSVG '+dis+'">'
			str += '<img src="images/briefcase.svg" alt="">'
			str += '</div>'
			str += '</div></li>'
			/*str += '<div class="col-md-2">'
            str += '<a href="#" class="material-icons">card_travel</a>'
          	str += '</div>'*/
          	dis = ""
		
		}

		mainModal_.html(str);
		$("#modalBodyP0 li .iconSVG").off("click").on("click", function(){
			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon")
			addedToBriefCase(tm[parseInt($(this).attr("data-id"))].uuid);
			
		})

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
		var dis = ""
		for(var i=0; i<tm.length; i++){
			if(tm[0].added){
				dis = "disableIcon";
			}
			str += '<li class="list-group-item">'
			str += '<div class="row"  data-id="'+i+'">'
			str += '<div class="col-md-1">'
			str += '<div class="material-icons">videocam</div>'
			str += '</div>'
			
			str += '<div class="col-md-8">'
			str += '<b>'+tm[i].name+'</b>'
			str += '</div>'
			str += '<div class="col-md-2 alignText">'
			str += '<button type="button" class="btn btn-secondary btn-sm">PLAY</button>'
			str += '</div>'
			str += '<div class="col-md-1 alignText">'
			
			str += '<div data-id="'+i+'" class="iconSVG '+dis+'">'
			
			str += '<img src="images/briefcase.svg" alt="">'
			str += '</div>'
			str += '</div>'
			str += '</li>'
			dis = ""
		}
		str += '</ul>';
		mainModal_.html(str);

		// $("#modalBodyP0 li a").off("click").on("click", function(){
		
		// 	renderVideo($(this).parent().attr("data-id"), tm);
		// })

		$("#modalBodyP0 li .iconSVG").off("click").on("click", function(){
			if($( this ).hasClass( "disableIcon" ))
				return

			$(this).addClass("disableIcon");
			addedToBriefCase(tm[parseInt($(this).attr("data-id"))].assetid);

			// var fd = new FormData();
			// fd.append("resourceid", tm[parseInt($(this).attr("data-id"))].videoid) 
			// Utility.loader({url: "users/addtobriefcase.json", data : fd, type :"POST", cb:function(_d){
			// 	debugger
			// }});

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

		var dis = ""
		var str = '<div class="participants">'
		str += '<ul class="list-group">'

		for(var i=0; i<tm.length; i++){
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
			if(tuuid !== tm[i].uuid){
				str += '<div class="col-md-3">'
				str += '<div class="actions">'
				str += '<img src="images/chat.svg" alt="" data-id="chat_'+i+'">'
				//str += '<i class="material-icons">mail</i>'
				//str += '<img src="images/briefcase.svg" alt="" data-id="mail_'+i+'">'


				
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

			if($( this ).hasClass( "disableIcon" ))
				return


			var l = $(this).attr("data-id").split("_");
			var t = l[0];
			var o = mData.body[parseInt(l[1])]



			if(t === "chat"){

			}else if(t === "mail"){

			}else if(t === "bcard"){
				populateCard(o, true, this)

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
			nm = "";
			tp = tm[i].type;
			if(tm[i].type === "doc" || tm[i].type === "image" || tm[i].type === "pdf"){
				tp = "doc"
			}
			str += '<li data-id="'+tm[i].uuid+'" data-type="'+tm[i].type+'">'
			str += '<div class="row">'
			str += '<div class="col-md-1">'
			
			/*str += '<div class="form-check">'
			str += '<input type="checkbox" class="form-check-input">'
			str += '</div>'
			*/


		str += '<label class="form-check-label" for="exampleCheck1">'
		//str += '<input type="checkbox" class="form-check-input" name="qa'+i+'" value="'+qa[j]+'" data-id=q_'+i+' '+chckd+'>'
		
		if(tp === "video"){
			str += '<input type="checkbox" class="form-check-input" data-ind='+i+'>'
		}else{
			str += '<input type="checkbox" class="form-check-input"  data-ind='+i+'>'	
		}
		
		
		str += '<span></span>'
		str += '</label>'



			
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
				str +=  nam === undefined ? "" : nm
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
					populateCard(ao, false, this)
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
			var tstr = [];
			$('#modalBodyP0  [type=checkbox]:checked').each(function( index ) {
			  	tstr.push(mData.data.resources[parseInt($(this).attr("data-ind"))].uuid);
			  	console.log(tstr)
			});

			if(tstr.length !== 0){
				downloadfile({title:"test", url:baseUrl+"resource/download.json?resourceid="+tstr.join(",")})
				/*Utility.loader({url: "resource/download.json?resourceid="+tstr.join(","), cb:function(_d){
					console.log("done")
					downloadfile({title:"test", url:"http://localhost/rnd/vievent.zip"})
					//debugger
				}});*/
				 
			}
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

			if(t.length != 0){
				var fd = new FormData();
				fd.append("resourceid", t.join(",")) 
				Utility.loader({url: "users/removefrombriefcase.json", data : fd, type :"POST", cb:function(_d){
					console.log("done")
					showAlert("success", "Selected items deleted.")
					//debugger
				}});
			}


			mData.data.resources = mData.data.resources.filter(function(val) {
			  return t.indexOf(val.uuid) == -1;
			});

			briefcase();

			// Utility.loader({url: objActModal_.action_link, cb:function(_o){
			// 	//Post data

			// 	//mData = _o.data;
				
			// 	//modalTabAttendees()
			// 	//briefcase();
			// }});


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
	
	var populateCard = function( _o, edit, _ref){
		$(".modal-overlay-cont #modalinsidelable").text("Your Business Card ");
		$(".modal-overlay-cont").addClass("show");
		cardContainer_.renderCard($("#modalinsidebody"), _o, edit, cardEditAction.bind(this), _ref);
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
			$("#exampleModal2 .modal-body").html("")
			$("#exampleModal").modal("show");
		})

		$("#exampleModal").on('hidden.bs.modal', function(){
			//if(modelFor_ === "player"){
				$("#exampleModal .modal-body").html("")
				$(".modal-overlay-cont #modalinsideclose").click();
			//}
		  });


		$(".modal-overlay-cont #modalinsideclose").off("click").on("click", function(){
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
			//debugger
		}});
	}

	var cardEditAction = function(){
		
		$("#exampleModal2").modal("show");
		$("#exampleModal2 .tabs").remove();
		modalTabModal2(["VIEW", "EDIT"], profileTab2)
	}

	var modalTabModal2 = function(arr, cb){
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
		$( str ).insertAfter( "#exampleModalLabel2" );
		$("#exampleModal2 .tabs a").removeClass("active");
		$("#exampleModal2 "+"#a1").addClass("active");
		$("#exampleModal2 .tabs a").on("click", function(){

			var id = this.id;
			$("#exampleModal2 .tabs a").removeClass("active");
			$("#exampleModal2 "+"#"+id).addClass("active");
			cb(id);
		})
		$(".modal-body.p1").html(myProfileHTML())
		//$("#exampleModal2 #a1").click();
		profileTab2("a1")



		$("#modalBodyP1 .my-profile #btnProfile").off("click").on("click", function(){
			var fn = $("#modalBodyP1 .my-profile [name=firstname]");
            var ln = $("#modalBodyP1 .my-profile [name=lastname]");
            var c = $("#modalBodyP1 .my-profile [name=company]");
            var j = $("#modalBodyP1 .my-profile [name=jobtitle]")
            var p = $("#modalBodyP1 .my-profile [name=phone]")
            var e = $("#modalBodyP1 .my-profile [name=email]")
            
            var fd = {}
            var f = fn.val() === "" ? fn.attr("placeholder") : fn.val()
            var l = ln.val() === "" ? ln.attr("placeholder") : ln.val()
            fd["jobtitle"] = j.val() === "" ? j.attr("placeholder") : j.val()
            fd["companyname"] =  c.val() === "" ? c.attr("placeholder") : c.val()
            fd["phone"] =  p.val() === "" ? p.attr("placeholder") : p.val()
            fd["email"] =  e.val() === "" ? e.attr("placeholder") : e.val()

            fd["name"] = f + " "+ l 
            cardContainer_.updateCard(fd);

            $("#exampleModal2").modal("hide");
			$("#exampleModal2 .tabs").remove();
		})
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
		$(".alert-msg[role=alert]").addClass("H")
		var str = ""
		if(ty === "info"){
			$(".alert-msg#infoAlert").html('<i class="material-icons">info</i><b>INFORMATION</b>'+txt)
			$(".alert-msg#infoAlert").removeClass("H")
		}else if(ty === "success"){
			$(".alert-msg#infoAlert").html('<i class="material-icons">info</i><b>SUCCESS</b>'+txt)
			$(".alert-msg#infoAlert").removeClass("H")
		}else if(ty === "fail"){
			$(".alert-msg#failAlert").html('<i class="material-icons">info</i><b>FAIL</b>'+txt)
			$(".alert-msg#failAlert").removeClass("H")
		}
	}

	return {
		init: init,
		renderModal: renderModal
	}
}



