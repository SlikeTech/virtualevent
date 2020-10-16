 var Application = function(){
 	var util_, pRenderer_, router_, nav_;
 	var login_, preloader, user_, tmail_;
 
 	var init = function(){
 		uiELements();
 		pRenderer_ = new PageRenderer();
 		pRenderer_.init(this, pRenderCallback.bind(this));
		 router_ = new Router();
		nav_ = new Navigation();
 		user_ = new User();
 		

 		tmail_ = Login.getCookie();
 		if(tmail_ !== ""){
 			startApp();
 		}else{
 			$("#preloaderstop").addClass("H")
 			$("#loginEl").removeClass("H")
 		}
 	}

 	$("#loginEl .form-control").off("keypress").on('keypress',function(e) {
	    if(e.which == 13) {
	        loginClicked()
	    }
	});

 	var loginClicked = function(_id){
 		tmail_ = $("#loginEl .form-control").val();
 		if(Login.validateEmail(tmail_)){
 			startApp()
 		}else{
 			//alert("Incorrect Id")

 			Notification.notify("fail", "Invalid user. Please enter valid email")
 			$("#preloaderstop").addClass("H")
 			$("#loginEl").removeClass("H")
 		}

 	}

 	var startApp = function(_url){
 		 	var formData = new FormData();
			formData.append("email", tmail_);
			formData.append("eventid", eventId);
			var objPost = {
				url : "login.json",
				data : formData,
				type :"POST",
				cb :loginSuccess.bind(this)
			}
			Utility.loader(objPost);
 	}

 	
 	var loginSuccess = function(_d){
		if(_d.data){
			if(_d.data.error){
				$("#preloaderstop").addClass("H")
 				$("#loginEl").removeClass("H")
				//alert(_d.data.msg)
				Notification.notify("fail", _d.data.msg)

			}else{
				EventStore.setUser(_d.data);
 				Utility.loader({url: "events.json?eventid="+eventId, cb:mJsonLoaded.bind(this)});
 				if(Login.getCookie() === "")
 					Login.createCookie("usermailid", tmail_, 1)
			}
		}else{
			$("#preloaderstop").addClass("H")
 			$("#loginEl").removeClass("H")
 			Notification.notify("fail", "Server Connection Issue")
			//alert("Invalid Login URL")
		}
 	}

 	var mJsonLoaded = function(_d){
 		$("#preloaderstop").addClass("H")
		$("#loginEl").addClass("H")
         $(".wrapper").show();

 		if(_d.data){
	 		var g = EventStore.parseMaster(_d.data);
	 		if(g.suc){
				 pRenderer_.renderPage(EventStore.getPageData(g.actPage));
				 nav_.init(pRenderer_, pRenderCallback.bind(this));

	 			router_.init(this, browserCallback.bind(this));
	 			window.location.hash = g.actPage;

	 			
	 			Utility.loader({url: "users/myprofile.json", cb:function(_d){
	 				EventStore.setUserProfile(_d.data);
	 				user_.userStatusUpdate()
	 			}});
	 			
	 			user_.init(pRenderer_, pRenderCallback.bind(this));

				 Chat.init();
				 Notification.init();



	 		}else{
	 			//alert("Error")
	 			Notification.notify("fail", "Master JSON Error")
	 		}
 		}else{
 			//alert("Master JSON Not Loaded");
 			Notification.notify("fail", "Master JSON load issue")
 		}
 	}

 	var pRenderCallback = function(_key, _brow){
 		if(!_brow){
 			window.location.hash = _key;
 		}
 		
 		pRenderer_.renderPage(EventStore.getPageData(_key));
 		user_.audinces()
 		//debugger
 	}

 	var browserCallback = function(_key){
 		console.log("BROWSEE BUTTON::", _key)
 		if(_key != "" && EventStore.getActivePage() !== _key){
 			pRenderCallback(_key.substr(1), true)
 		}
 	}

 	var uiELements = function(){
 		//login_ = $("#login");

 		var r = $('#loginEl [type=checkbox]')
 		var u = localStorage.getItem("email");
 		var e = $("#loginEl .form-control");
 		if(!u){
 			r.prop("checked", false);
 			e.val("");
 			localStorage.setItem("email", "");
 		}else{
 			e.val(u);
 			r.prop("checked", true);
 		}
 		
 		r.off("click").on('click', function(){
 			if(this.checked){
 				if(Login.validateEmail($(e).val())){
 					localStorage.setItem("email", $(e).val());		
 				}
 			}else{
 				localStorage.setItem("email", "");
 			}
 		})
 	}

	var getUrlParameter = function (name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

 	return {
 		init:init,
 		loginClicked:loginClicked
 	}
 }
 
var BusinessCard = function(){
    var edit_, data_, dis, ol, callback, elt, oRef
    var init = function(){}

    var renderCard = function(htmlel, _d, _e, cb, _ref){
        edit_ = _e;
        dis = "disabled"
        data_ = _d;
        callback = cb;
        ol = {};
        elt = htmlel
        oRef = _ref;


        
        if(edit_){

            var user = EventStore.getUserProfile();
            ol = syncUser()
            // ol.name = user.firstname + " " + user.lastname
            // ol.email = user.email
            // ol.phone = user.phone === "" ? "+91-9999999999" : user.phone
            // ol.jobtitle = user.jobtitle
            // ol.companyname = user.companyname
        }else{
            ol.name = data_.name
            ol.email = data_.email
            ol.phone = data_.phone === "" ? "+91-9999999999" : data_.phone
            ol.jobtitle = data_.jobtitle
            ol.companyname = data_.companyname
            ol.image = data_.image
        }


        htmlel.html(cartUI(ol));
         if(edit_){ 
           bindEvent();
        }
    }

    var bindEvent = function(){
        $("#modalinsidebody button").off("click").on("click", function(){
            var i = this.id;
            if(i == "edit"){
                callback()
            }else{
                var n = $("#modalinsidebody [name=name]");
                var e = $("#modalinsidebody [name=email]");
                var c = $("#modalinsidebody [name=company]");
                var j = $("#modalinsidebody [name=job]")
                var p = $("#modalinsidebody [name=phone]")
                var o = {};

                o.name = n.val() === "" ? n.attr("placeholder") : n.val();
                o.mail = e.val() === "" ? e.attr("placeholder") : e.val();
                o.company = c.val() === "" ? c.attr("placeholder") : c.val();
                o.job = j.val() === "" ? j.attr("placeholder") : j.val();
                o.phone = p.val() === "" ? p.attr("placeholder") : p.val();

                //POST DATA
                //"f5i9uoz999"
                var fd = new FormData();
                fd.append("otherUserId", data_.uuid) 

                Utility.loader({url: "businesscard/share.json", data : fd, type :"POST", cb:function(_d){
                    console.log("done")
                      $(oRef).addClass("disableIcon")
                    //debugger
                }});
                $("#modalinsideclose").click();
            }

        })

    }

    var cartUI = function(_o){
        console.log(_o)
        var str = '<div class="business-card">'
        str += '<div class="row m0">'
        str += '<div class="card-lhs">'
        str += '<div class="card-image">'
        //data_.image !== "" ? str += '<img src="'+data_.image+'">' : 
        str += '<img src="images/card-avatar.svg">'
         //str += '<img src="'+_o.image+'">'
       
       // edit_ ? str += '<div class="imageUpload btn btn-primary btn-sm"><i class="material-icons f16">edit</i><input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"></div>' : ""
        
        str += '</div>'
        str += '<div class="card-name">'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control userName" data-type="edt" name="name" value="'+_o.name+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control compnay" data-type="edt" name="company" value="'+_o.companyname+'" disabled>'
        str += '</div>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control designation" data-type="edt" name="job" value="'+_o.jobtitle+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'


        str += '<div class="card-rhs">'
        str += '<div class="row mb-2"><i class="material-icons">phone</i>'
        str += '<div class="form-group m0">'
        str += '<input type="text" class="form-control phoneNo" data-type="edt" name="phone"  placeholder="'+_o.phone+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '<div class="row"><i class="material-icons">email</i>'
        str += '<div class="form-group m0">'
        str += '<input type="email" class="form-control emailId" name="email" placeholder="'+_o.email+'" disabled>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'
        str += '</div>'

        if(edit_){
            str += '<div class="modal-footer">'
            str += '<button type="button" id="edit" class="btn btn-secondary btn-sm">Edit <i class="material-icons f16">edit</i></button>'
            //str += '<button type="button" id="shard" class="btn btn-secondary btn-sm">Share <i class="material-icons f16">edit</i></button>'
            
            str += '<button type="button" id="shard" class="btn btn-secondary btn-sm">Share <svg xmlns="http://www.w3.org/2000/svg" width="18.041" height="15.031" viewBox="0 0 18.041 15.031"><path d="M22.383,13.063l-6.628-6.2a.339.339,0,0,0-.263-.113c-.207.009-.47.155-.47.376v3.11a.2.2,0,0,1-.169.193C8.263,11.438,5.487,16.37,4.505,21.49c-.038.2.235.39.362.23a11.979,11.979,0,0,1,9.958-5.045.232.232,0,0,1,.2.225v3.053a.4.4,0,0,0,.681.249l6.675-6.308a.519.519,0,0,0,.164-.395A.629.629,0,0,0,22.383,13.063Z" transform="translate(-4.502 -6.749)"/></svg></button>'
            str += '</div>';
        }
        return str
    }

    var updateCard = function(_d){
        elt.html(cartUI(syncUser()));
        bindEvent();
    }

    var syncUser = function(){
        var o = {};
        var user = EventStore.getUserProfile();
        o.name = user.firstname + " " + user.lastname
        o.email = user.email
        o.phone = user.phone === "" ? "+91-9999999999" : user.phone
        o.jobtitle = user.jobtitle
        o.companyname = user.companyname
        o.image = user.image
        return o
    }

    return {
        init:init,
        renderCard:renderCard,
        updateCard:updateCard
    }

}


var Chat = (function(){
	var _cOuter, lhsActiveArr_, connection_, chats_;
    var admin_ = true;
    var chatStatus_;
	
    var init = function(_ref, _cb){
		chats_ = {
            master:{},
            messages: {},
            list:{
                rooms:[],
                users:[]
            }
        }

        chatStatus_ = {
            lhs:{
                type:"all",
                data:[]
            },
            rhs:{
                type:eventId,
                data: []
            }
        }

        Utility.loader({url: "users/attendees.json?eventid=f5n9o69lkl", cb:attendies.bind(this)});
        initUI();

        
	}
	

    var initUI = function(){
        $(".chat-floater .chat-icon").off("click").on("click", function(){
        	debugger
        })
        $(".chat-floater .minimise-icon").off("click").on("click", function(){
        	if( $(".chat-cOuter").hasClass("H")){
        		$(".chat-cOuter").removeClass("H")
                $(".chat-floater").addClass("show-minimise-chat")
                if(chatStatus_.lhs.data.length === 0){
                    var o = getAllUsersAndGroups()
                }
        	}else{
        		 $(".chat-cOuter").addClass("H")
                 $(".chat-floater").removeClass("show-minimise-chat")
                
        	}
        })
        $(".chat-floater .maximize-icon").off("click").on("click", function(){
        	//$("#modalBodyP3").html(myvar1)
            $("#exampleModal3").modal("show");

            $("#singleChat .fChat-header .min-Icon").click()
            
            if(chatStatus_.lhs.data.length === 0){
                var o = getAllUsersAndGroups()
            }
        })

        //Full Chat Box
        $("#modalBodyP3").html(genFullChat())
        
        $(".full-chat .chat-edit").off("click").on("click", function(){
            if($(".full-chat #editGroup").is(":visible")){
                $(".full-chat #editGroup").addClass("H");
            }else{
                $(".full-chat #editGroup").removeClass("H")
                
                //var to = createOrEditRoom("create");
                var to = createOrEditRoom("edit");
                $("#editGroup .chat-header").html(to.header);
                $("#editGroup .chat-messages").html(to.message);

            }
            //add group
        })
        
        $(".full-chat .chat-button").off("click").on("click", function(){
            debugger
            //send message
        })
        
        $(".full-chat .min-Icon").off("click").on("click", function(){
            debugger
            //min message
        })

        $(".full-chat .dock-Icon").off("click").on("click", function(){
            $("#exampleModal3").modal("hide");
            $(".chat-floater .minimise-icon").click()
            
            //dock message
        })

        $(".full-chat .close-Icon").off("click").on("click", function(){
           // debugger
            $("#exampleModal3").modal("hide");
            
            //close message
        })

        //status uspdate
       // $(".full-chat #status #chat-status").text("abc")

        $(".full-chat #status a").off("click").on("click", function(){
            debugger
        })

        $(".full-chat .user-icons .user-action").off("click").on("click", function(){
            debugger
        })

        

        $(".full-chat #attSearch").off("click").on("click", function(){
            debugger
            //search input click
        })
        
        $(".full-chat .exit-group").off("click").on("click", function(){
            //search input click
        })
        
        // $(".full-chat #groupName").off("click").on("click", function(){

        // })

        // $(".full-chat #msgBox").off("click").on("click", function(){

        // })

        //Single User Chat
        //$("#singleChat").html(myvar)

        $("#singleChat").html(collapseChat())
        $("#singleChat .fChat-header .min-Icon").off("click").on("click", function(){
            $("#singleChat .chat-cOuter").addClass("H")
            $(".chat-floater").removeClass("show-minimise-chat")
        })

        $("#singleChat .fChat-header .dock-Icon").off("click").on("click", function(){
            
        })

        $("#singleChat .fChat-header .close-Icon").off("click").on("click", function(){
            
        })
	}

    var openSingleWindow = function (_user){
            console.log(_user)
            $(".chat-floater .minimise-icon").click();
            
    }

    var attendies = function(_data){
       if(_data.data){
           var i;
            var t = _data.data.body;
           for(i=0; i<t.length; i++){
               chats_.master[t[i].uuid] = {
                   name: t[i].firstname+" "+t[i].lastname,
                   type: "user"
               }
               chats_.list.users.push(t[i].uuid)
               chats_.messages[t[i].uuid] = {
                    archieved:[],
                    newMessage:[]
                };
           }

           t = EventStore.getStore().eventData.chats;
           for(i=0; i<t.length; i++){
               chats_.master[t[i].room_id] = {
                   name: t[i].room_name,
                   type: "room",
                   page:t[i].room_id,
                   admin:t[i].admin_userIds.split(","),
                   acl:t[i].acl,
                   chatmode:t[i].chatmode
               }
                chats_.list.rooms.push(t[i].room_id);
                chats_.messages[t[i].room_id] = {
                    archieved:[],
                    newMessage:[]
                };
           }           
           EventStore.setAttendies(_data.data.body);
           createWebsocket();
           return
       }
       EventStore.setAttendies([]);
       
    }

    var getAllUsersAndGroups = function(){
        if(chatStatus_.lhs.type === "all"){
            chatStatus_.lhs.data = chats_.list.rooms.concat(chats_.list.users)
        }else if(chatStatus_.lhs.type === "room"){

        }else if(chatStatus_.lhs.type === "user"){
        
        }

        chatStatus_.rhs.data = chats_.messages[chatStatus_.rhs.type].archieved.concat(chats_.messages.newMessage)

        $(".full-chat .chat-user").html(generateLHS_HTML());
        msgHeaderBox(chatStatus_.rhs.type);

        $(".fChat-lhs .chat-row").off("click").on("click", function(){
            console.log($(this).attr("data-id"))
            msgHeaderBox($(this).attr("data-id"))
        })


    }

    var getGroupUsers = function(){

    }

    var getUsers = function(){

    }

    var getGroups = function(){

    }

    //$(".fChat-lhs .chat-row[data-type=room]").hide()

    var generateLHS_HTML = function(){
        var str = ""
        var str = "";
        var h, l;
        var d = chatStatus_.lhs.data;
        for(var i=0; i<d.length; i++){
            console.log(chats_.master[d[i]])
            str += '<div class="chat-row" data-id="'+d[i]+'" data-type="'+chats_.master[d[i]].type+'">'
            str += '<i class="material-icons">account_circle</i>'
            str += '<div class="chat-name text-truncate">'+ chats_.master[d[i]].name+'</div>'
            
            //Unread chat
            console.log(d[i])
            //debugger
            l = chats_.messages[d[i]].newMessage.length
            h = l === 0 ? "H" : "l"
            str += '<div class="chat-date'+h+' ">'
            //str += '10:30 AM '
            str += '<span>'
            str += l
            str += '</span>'
            str += '</div>'

            //Add User to the group
            // str += '<div class="add-user">'
            // str += '<svg xmlns="http://www.w3.org/2000/svg" width="30.013" height="18.013" viewBox="0 0 30.013 18.013"><defs><style>.a{fill:#138329;}</style></defs><path d="M16.881,13.506a4.5,4.5,0,1,0-4.5-4.5A4.516,4.516,0,0,0,16.881,13.506Zm0,2.252c-2.983,0-9.006,1.52-9.006,4.5v2.252H25.888V20.261C25.888,17.278,19.865,15.758,16.881,15.758Z" transform="translate(4.125 -4.5)"/><path d="M9.218,3.375a5.843,5.843,0,1,0,5.843,5.843A5.843,5.843,0,0,0,9.218,3.375Zm3.006,6.433H9.808v2.416H8.628V9.808H6.212V8.628H8.628V6.212h1.18V8.628h2.416Z" transform="translate(-3.375 -3.375)"/></svg>'
            // str += '</div>'
            
            str += '</div>'
        }
        return str;

    }

    var generateRHS_HTML = function(){


    }

    var admin = function(type){
        if(admin_){
            if(type === "edit"){
                return '<svg xmlns="http://www.w3.org/2000/svg" width="15.756" height="14.405" viewBox="0 0 15.756 14.405"><defs><style>.a{fill:#ababab;}</style></defs><path class="a" d="M11.449,17.881a.678.678,0,0,1-.477.2H9.225A.677.677,0,0,1,8.55,17.4V15.653a.678.678,0,0,1,.2-.477l.034-.034L15.01,8.914a.168.168,0,0,0-.118-.287H4.727A2.478,2.478,0,0,0,2.25,11.1v9.452a2.478,2.478,0,0,0,2.477,2.477h10.8a2.478,2.478,0,0,0,2.477-2.477V11.737a.168.168,0,0,0-.287-.118l-6.236,6.228Z" transform="translate(-2.25 -8.627)"/></svg>'
            }
            return ""
        }
        return ""
    }



    var createWebsocket = function(){
        connection_ =  new WebSocket("wss://act-dev.cleo.live/event?evtid="+EventStore.getUser().eventid+"&jwt="+EventStore.getUser().jwt);
    
        connection_.onopen = () => {
          console.log('connected');
        };

        connection_.onclose = () => {
          console.log('disconnected');
        };

        connection_.onerror = (error) => {
          console.log('failed to connect', error);
        };

        connection_.onmessage = (event) => {
          //console.log('Received', event.data);
          var t = event.data.split("::")
          if(t.length){
              if(t[0] === "74"){
                  if(t.length > 1){
                      var r = JSON.parse(t[1]).rooms;
                      console.log(r)
                      for(var i=0; i< r.length; i++){
                          if(!chats_.master[r[i].ID]){
                              chats_.master[r[i].ID] = {
                                   name: r[i].ID === eventId ? "GLOBAL ROOM" : r[i].Title,
                                   type: "room",
                                   page:r[i].ID,
                                   admin:r[i].Admin.split(","),
                                   acl:r[i].ACL,
                                   chatmode:t[i].ChatMode
                               }
                               chats_.list.rooms.push(r[i].ID)
                               chats_.messages[r[i].ID] = {
                                    archieved:[],
                                    newMessage:[]
                                };
                          }
                      }
                  }
                  //console.log(JSON.parse(t[1]))

                  //debugger


              }else if(t[0] === "41"){

              }
          }
        }

    }

    var chatAdmin = function(){
        var str = '<div class="row admin-chat">'
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="message-text">'
        str += '<b>Admin</b>'
        str += '<p>Lorem Ipsum is</p>'
        str += '<div class="pin-chat">'
        str += '<svg xmlns="http://www.w3.org/2000/svg" width="9.159" height="13.495" viewBox="0 0 9.159 13.495"><path d="M16.653,13.885l-4.5-2.6a1.155,1.155,0,1,0-1.156,2l4.5,2.6a1.156,1.156,0,0,0,1.156-2Zm-3.715-2.812,3.5,2.023L17.633,9.78l-2.419-1.4-2.276,2.689Zm-2.583,8.518,3.351-4.071-1.5-.867ZM19.081,7.946l-3-1.734a.867.867,0,0,0-.867,1.5l3,1.734a.867.867,0,1,0,.866-1.5Z" transform="translate(-10.356 -6.096)"/></svg>'
        str += '</div>'
        str += '</div>'
        str += '</div>'

        return str;

    }

    var chatOthers = function(){
        var str = '<div class="row other-chat">'
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="message-text">'
        str += '<b>Admin</b>'
        str += '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'
        str += '<span class="chat-time">10:38 AM</span>'
        str += '</div>'
        str += '<div class="email-chat">                                    '
        str += '<svg xmlns="http://www.w3.org/2000/svg" width="19.54" height="13.19" viewBox="0 0 19.54 13.19"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M.072,16.09V5.236q0-.019.057-.358l6.388,5.465L.147,16.467a1.6,1.6,0,0,1-.075-.377ZM.92,4.125a.812.812,0,0,1,.32-.057h17.2a1.067,1.067,0,0,1,.339.057L12.377,9.608l-.848.678L9.852,11.662,8.175,10.286l-.848-.678ZM.939,17.2,7.364,11.04l2.487,2.016,2.487-2.016L18.764,17.2a.9.9,0,0,1-.32.057H1.24a.853.853,0,0,1-.3-.057Zm12.248-6.859,6.369-5.465a1.125,1.125,0,0,1,.057.358V16.09a1.444,1.444,0,0,1-.057.377Z" transform="translate(-0.072 -4.068)"/></svg>'
        str += '</div>'
        str += '<div class="business-icon">'
        str += '<svg xmlns="http://www.w3.org/2000/svg" width="17.967" height="13.974" viewBox="0 0 17.967 13.974"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M16.47,2.25H1.5A1.5,1.5,0,0,0,0,3.747v10.98a1.5,1.5,0,0,0,1.5,1.5H16.47a1.5,1.5,0,0,0,1.5-1.5V3.747A1.5,1.5,0,0,0,16.47,2.25ZM5.49,5.244a2,2,0,1,1-2,2A2,2,0,0,1,5.49,5.244Zm3.494,7.386a.654.654,0,0,1-.7.6H2.7a.654.654,0,0,1-.7-.6v-.6a1.964,1.964,0,0,1,2.1-1.8h.156a3.213,3.213,0,0,0,2.483,0h.156a1.964,1.964,0,0,1,2.1,1.8Zm6.987-1.647a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Zm0-2a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Zm0-2a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Z" transform="translate(0 -2.25)"/></svg>'
        str += '</div>'
        str += '</div>'

        return str
    
    }

    var chatSelf = function(){
        var str = '<div class="row self-chat">'
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="message-text">'
        str += '<b>Admin</b>'
        str += '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'
        str += '</div>'
        str += '</div>'

        return str
    }

    var createOrEditRoom = function(type){
        var o = {};
        var str = ""       
        //str += '<div class="chat-header">'
        str += '<div class="dF">'
        str += '<i class="material-icons f45">group_add</i>'
        str += '<div class="chat-group">'
        
        if(type === "edit"){
            str += '<b>EDIT GROUP</b>'
            str += '<span>Add or Remove participants</span>'
        }else{
            str += '<b>CREATE GROUP</b>'
            str += '<span>Create your custom group and add participants</span>'
        }
        
        str += '</div>'
        str += '</div>'
        str += '</div>'

        o.header = str

        //str += '<div class="chat-messages" style="height: calc(100% - 100px);">'
        str = ""
        if(type === "edit"){
        }else{
            str = '<div class="group-name">'
            str += '<input type="text" id="groupName" name="" placeholder="Your group name here">'
            str += '</div>'
        }
        
        str += '<div class="user-add">'
        str += '<div class="user-add-header">Users added in group</div>'
        str += '<div class="user-add-list">'
        
        if(type === "edit"){
            
        }else{
            str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
            str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
            str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
        }
        
        str += '</div>'
        str += '<div class="user-add-btn">'
        str += '<button class="lightBtn" type="button">Cancel</button>'
        str += '<button class="lightBtn" type="button">Save</button>'
        str += '</div>'
        //str += '</div>'
       // str += '</div>'
       o.message = str

       return o;
    }

    
    var msgHeaderBox = function(id){
        var uname = chats_.master[id].name;
        var utype = chats_.master[id].type

        var str = '<div class="dF">'
        str += '<i class="material-icons f45">account_circle</i>'
        str += '<div class="chat-group">'
        str += '<b>'+uname+'</b>'
        str += '<span>Members: 226</span>'
        str += '</div>'


        //<!-- Chat Group -->
        if(!admin_ && utype === "room"){
            str += '<div class="exit-group">'
            str += 'EXIT GROUP'+svgs("exit")
            str += '</div>'
        }


        //<!-- Single User -->
        if(utype === "user"){
            str += '<div class="user-icons">'
            str += '<div class="user-action"   data-id="msg-vid">'+svgs("video")
            str += '</div>'
            str += '<div class="user-action" data-id="msg-email">'+svgs("email")
            str += '</div>'
            str += '<div class="user-action" data-id="msg-bcard">'+svgs("bcard")
            str += '</div>'
            str += '<div class="user-action"  data-id="msg-usr">'+svgs("user")
            str += '</div>'
            str += '</div>'
            str += '</div>'
        }

        $("#chatBox .chat-header").html(str);
        var arr = ['f5d9k9699k', 'f5n9o69lkl', 'fr15ol9zg9']
        //chat-messages

        var p = ""
        for(var j=0; j<arr.length; j++){
            if(j % 2 === 0){
                p += chatOthers()
            }else{
                p += chatSelf()
            }
        }

        $("#chatBox .chat-messages").html(p)
    }


    var collapseChatMsgHeader = function(id){

        var uname = chats_.master[id].name;
        var utype = chats_.master[id].type

        var str = ""
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="chat-group">'
        str += '<b>'+uname+'</b>'
        str += '<span>Members: 226</span>'
        str += '</div>'

        if(!admin_ && utype === "room"){
            str += '<div class="exit-group">'
            str += 'EXIT GROUP'
            str += svgs("exit")
            str += '</div>'
        }

        if(utype === "user"){
            str += '<div class="user-icons H">'
            str += '<div class="user-action">'
            str += svgs("video")
            
            str += '</div>'
            str += '<div class="user-action">'
            svgs("email")
            str += '</div>'
            str += '<div class="user-action">'
            str += svgs("bcard")
            str += '</div>'
            str += '<div class="user-action">'
            svgs("user")
            str += '</div>'
            str += '</div>'
        }


        // var str = ""
        // str += '<i class="material-icons">account_circle</i>'
        // str += '<div class="chat-group">'
        // str += '<b>Networking Zone</b>'
        // str += '<span>Members: 226</span>'
        // str += '</div>'
        
        str += '<!-- Chat Group -->'
        // str += '<div class="exit-group">'
        // str += 'EXIT GROUP'
        // str += svgs("exit")
        // str += '</div>'
        
        // '<!-- Single User -->'
        // str += '<div class="user-icons H">'
        // str += '<div class="user-action">'
        // str += svgs("video")
        
        // str += '</div>'
        // str += '<div class="user-action">'
        // svgs("email")
        // str += '</div>'
        // str += '<div class="user-action">'
        // str += svgs("bcard")
        // str += '</div>'
        // str += '<div class="user-action">'
        // svgs("user")
        // str += '</div>'
        // str += '</div>'
    }
    
    
    
    var svgs = function(type){
        switch(type){
            case "min":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="15.313" height="3.828" viewBox="0 0 15.313 3.828"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M13.877,24.75H1.436A1.436,1.436,0,0,0,0,26.186v.957a1.436,1.436,0,0,0,1.436,1.436H13.877a1.436,1.436,0,0,0,1.436-1.436v-.957A1.436,1.436,0,0,0,13.877,24.75Z" transform="translate(0 -24.75)"/></svg>'
            
            case "dock":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14"><g transform="translate(-889.5 -104)"><rect width="7" height="14" transform="translate(903.5 104)"/><line x1="20" transform="translate(890 104.5)"/><path class="b" d="M20,0H0" transform="translate(890 117.5)"/><line class="b" y1="13" transform="translate(890 104.5)"/></g></svg>'

            case "close":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002"><defs><style>.a{fill:#ababab;}</style></defs><path class="a" d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"/></svg>'

            case "video":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="20.318" height="13.546" viewBox="0 0 20.318 13.546"><defs><style>.a{fill:#a1a1a1;}</style></defs><path class="a" d="M11.859,4.5H1.686A1.686,1.686,0,0,0,0,6.186V16.359a1.686,1.686,0,0,0,1.686,1.686H11.859a1.686,1.686,0,0,0,1.686-1.686V6.186A1.686,1.686,0,0,0,11.859,4.5ZM18.54,5.83,14.674,8.5v5.552l3.866,2.663a1.131,1.131,0,0,0,1.778-.91V6.74A1.132,1.132,0,0,0,18.54,5.83Z" transform="translate(0 -4.5)"/></svg>';

            case "email":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="20.761" height="14.014" viewBox="0 0 20.761 14.014"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M.072,16.841V5.309q0-.02.06-.38l6.787,5.806L.152,17.241a1.7,1.7,0,0,1-.08-.4Zm.9-12.713a.863.863,0,0,1,.34-.06H19.591a1.134,1.134,0,0,1,.36.06L13.145,9.954l-.9.721-1.782,1.461L8.681,10.675l-.9-.721Zm.02,13.894L7.82,11.475l2.643,2.142L13.1,11.475l6.827,6.546a.961.961,0,0,1-.34.06H1.313a.907.907,0,0,1-.32-.06Zm13.013-7.287,6.767-5.806a1.2,1.2,0,0,1,.06.38V16.841a1.535,1.535,0,0,1-.06.4Z" transform="translate(-0.072 -4.068)"/></svg>';

            case "bcard":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="20.355" height="15.832" viewBox="0 0 20.355 15.832"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M18.659,2.25H1.7A1.7,1.7,0,0,0,0,3.946V16.386a1.7,1.7,0,0,0,1.7,1.7H18.659a1.7,1.7,0,0,0,1.7-1.7V3.946A1.7,1.7,0,0,0,18.659,2.25ZM6.22,5.643A2.262,2.262,0,1,1,3.958,7.9,2.264,2.264,0,0,1,6.22,5.643Zm3.958,8.368a.741.741,0,0,1-.792.679H3.053a.741.741,0,0,1-.792-.679v-.679A2.225,2.225,0,0,1,4.637,11.3h.177a3.64,3.64,0,0,0,2.813,0H7.8a2.225,2.225,0,0,1,2.375,2.036Zm7.916-1.866a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V11.58a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Zm0-2.262a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V9.318a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Zm0-2.262a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V7.056a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Z" transform="translate(0 -2.25)"/></svg>';

            case "user":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="19.293" height="19.293" viewBox="0 0 19.293 19.293"><defs><style>.a{fill:#a1a1a1;}</style></defs><path class="a" d="M9.806,15.795A6.643,6.643,0,0,1,14.14,9.574a5.505,5.505,0,0,0,.489-2.219c0-3,0-5.426-3.617-5.426S7.394,4.357,7.394,7.354a5.386,5.386,0,0,0,2.412,4.481v.994c-4.09.334-7.235,2.344-7.235,4.774h7.486a6.616,6.616,0,0,1-.251-1.809Zm6.632-5.426a5.426,5.426,0,1,0,5.426,5.426A5.426,5.426,0,0,0,16.438,10.369ZM19.452,16.4H13.423V15.192h6.029Z" transform="translate(-2.571 -1.928)"/></svg>';

            case "exit":
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16.706" height="17.819" viewBox="0 0 16.706 17.819"><defs><style>.exitIcn{fill:#ac2727;}</style></defs><path class="exitIcn" d="M15.935,13.065V10.838H10.367V8.61h5.569V6.383l3.341,3.341Zm-1.114-1.114v4.455H9.253v3.341L2.571,16.406V1.928H14.822V7.5H13.708V3.042H4.8L9.253,5.269V15.293h4.455V11.951Z" transform="translate(-2.571 -1.928)"/></svg>';

            return ''
       }
    }
    

    var genFullChat = function(){
    return '<div class="full-chat">'+
            '    <div class="fChat-lhs">'+
            '                <div class="fChat-header">'+
            '                    <div class="booth-avatar">'+
            '                        <i class="material-icons">account_circle</i>'+
            '                    </div>'+
            '                <div class="chat-action">                        '+
            '                    <div class="dropdown" id="status">'+
            '                        <div class="dropdown-toggle" href="#" role="button" id="chat-status" data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
            '                            Online'+
            '                        </div>'+
            '                        <div class="dropdown-menu dropdown-menu-lg-right" aria-labelledby="chat-status">'+
            '                            <a class="dropdown-item" href="#" data-id="online">Online</a>'+
            '                            <a class="dropdown-item current" href="#" data-id="away">Away</a>'+
            '                            <a class="dropdown-item" href="#" data-id="dnd">Do not Distrub</a>'+
            '                        </div>'+
            '                    </div>'+
            '                    <div class="chat-edit">'+admin("edit")+
            '                    </div>'+
            '                </div>                    '+
            '                </div>'+
            '                    <div class="chat-search">'+
            '                        <input type="text" id="attSearch" name="" placeholder="Search by name, company, designation">'+
            '                        <i class="material-icons">search</i>'+
            '                    </div>'+
            '                    <div class="chat-user">'+
            '                    </div>'+
            '            </div>'+

            '            <div id="editGroup" class="fChat-rhs H">'+
            '                <div class="fChat-header">'+ 
            '                    <div class="min-Icon" data-id="ed-min">'+svgs("min")+
            '                    </div>'+
            '                    <div class="dock-Icon"  data-id="ed-min">'+svgs("dock")+
            '                    </div>'+
            '                    <div class="close-Icon"  data-id="ed-close">'+svgs("close")+
            '                    </div>'+
            
            '                </div>'+
            '                <div class="chat-header">'+
            '                </div>'+
            
            '                <div class="chat-messages" style="height: calc(100% - 100px);">'+
            '                </div>'+
            '                </div>'+

            '            <div id="chatBox" class="fChat-rhs">'+
            '                <div class="fChat-header">'+
            '                    <div class="min-Icon"  data-id="msg-min">'+svgs("min")+
            '                    </div>'+
            '                    <div class="dock-Icon" data-id="msg-doc">'+svgs("dock")+
            '                    </div>'+
            '                    <div class="close-Icon" data-id="msg-close">'+svgs("close")+
            '                    </div>'+
            '                </div>'+
            '                <div class="chat-header">'+
            '                </div>'+
            '                <div class="chat-messages" style="height: calc(100% - 140px);">'+
            '                </div>'+
            '            <div class="chat-input">'+
            '                <input type="text" id="msgBox" name="" placeholder="Type your message here">'+
            '                <button class="chat-button" type="button">Send <i class="material-icons">send</i></button>'+
            '            </div>'+
            '            </div>'+
            '            </div>';
    }

    var collapseChat = function(){
        var myvar = '<div class="chat-cOuter H">'+
        '                    <div class="fChat-header">'+
        '                        <div class="chat-user-avatar">                        '+
        '                           <div class="dropdown" id="userStatus">'+
        '                                <a class="dropdown-toggle" href="#" role="button" id="user-login" data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
        '                                    <i class="material-icons">account_circle</i>'+
        '                                    <span class="status away" id="status">                                '+
        '                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11"><defs><style>.b,.c{stroke:none;}</style></defs><g><path class="b" d="M 5.5 10.5 C 2.742990016937256 10.5 0.5 8.257010459899902 0.5 5.5 C 0.5 2.742990016937256 2.742990016937256 0.5 5.5 0.5 C 8.257010459899902 0.5 10.5 2.742990016937256 10.5 5.5 C 10.5 8.257010459899902 8.257010459899902 10.5 5.5 10.5 Z"/><path class="c" d="M 5.5 1 C 3.01869010925293 1 1 3.01869010925293 1 5.5 C 1 7.98130989074707 3.01869010925293 10 5.5 10 C 7.98130989074707 10 10 7.98130989074707 10 5.5 C 10 3.01869010925293 7.98130989074707 1 5.5 1 M 5.5 0 C 8.537569999694824 0 11 2.462430000305176 11 5.5 C 11 8.537569999694824 8.537569999694824 11 5.5 11 C 2.462430000305176 11 0 8.537569999694824 0 5.5 C 0 2.462430000305176 2.462430000305176 0 5.5 0 Z"/></g></svg>'+
        '                                   </span>'+
        '                                  </a>'+

        '                                  <div class="dropdown-menu dropdown-menu-lg-right" aria-labelledby="user-login">'+
        '                                       <a class="dropdown-item" href="#" data-id="online">Online</a>'+
        '                                       <a class="dropdown-item current" href="#" data-id="away">Away</a>'+
        '                                       <a class="dropdown-item" href="#" data-id="dnd">Do not Distrub</a>'+
        '                                  </div>'+
        '                              </div>'+
        '                        </div>'+
        '                        <div class="min-Icon">'+svgs("min")+'</div>'+
        '                        <div class="dock-Icon">'+svgs("dock")+'</div>'+
        '                        <div class="close-Icon">'+svgs("close")+'</div>'+
        '                    </div>'+
        '                    <div class="chat-header">'+
        // '                        <i class="material-icons">account_circle</i>'+
        // '                        <div class="chat-group">'+
        // '                            <b>Networking Zone</b>'+
        // '                            <span>Members: 226</span>'+
        // '                        </div>'+
        // '                        '+
        // '                        <!-- Chat Group -->'+
        // '                        <div class="exit-group">'+
        // '                            EXIT GROUP                            '+
        // '                            <svg xmlns="http://www.w3.org/2000/svg" width="16.706" height="17.819" viewBox="0 0 16.706 17.819"><defs><style>.exitIcn{fill:#ac2727;}</style></defs><path class="exitIcn" d="M15.935,13.065V10.838H10.367V8.61h5.569V6.383l3.341,3.341Zm-1.114-1.114v4.455H9.253v3.341L2.571,16.406V1.928H14.822V7.5H13.708V3.042H4.8L9.253,5.269V15.293h4.455V11.951Z" transform="translate(-2.571 -1.928)"/></svg>'+
        // '                        </div>'+
        // '    '+
        // '                        <!-- Single User -->'+
        // '                        <div class="user-icons H">'+
        // '                            <div class="user-action">                                '+
        // '                                <svg xmlns="http://www.w3.org/2000/svg" width="20.318" height="13.546" viewBox="0 0 20.318 13.546"><defs><style>.a{fill:#a1a1a1;}</style></defs><path class="a" d="M11.859,4.5H1.686A1.686,1.686,0,0,0,0,6.186V16.359a1.686,1.686,0,0,0,1.686,1.686H11.859a1.686,1.686,0,0,0,1.686-1.686V6.186A1.686,1.686,0,0,0,11.859,4.5ZM18.54,5.83,14.674,8.5v5.552l3.866,2.663a1.131,1.131,0,0,0,1.778-.91V6.74A1.132,1.132,0,0,0,18.54,5.83Z" transform="translate(0 -4.5)"/></svg>'+
        // '                            </div>'+
        // '                            <div class="user-action">                                '+
        // '                                <svg xmlns="http://www.w3.org/2000/svg" width="20.761" height="14.014" viewBox="0 0 20.761 14.014"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M.072,16.841V5.309q0-.02.06-.38l6.787,5.806L.152,17.241a1.7,1.7,0,0,1-.08-.4Zm.9-12.713a.863.863,0,0,1,.34-.06H19.591a1.134,1.134,0,0,1,.36.06L13.145,9.954l-.9.721-1.782,1.461L8.681,10.675l-.9-.721Zm.02,13.894L7.82,11.475l2.643,2.142L13.1,11.475l6.827,6.546a.961.961,0,0,1-.34.06H1.313a.907.907,0,0,1-.32-.06Zm13.013-7.287,6.767-5.806a1.2,1.2,0,0,1,.06.38V16.841a1.535,1.535,0,0,1-.06.4Z" transform="translate(-0.072 -4.068)"/></svg>'+
        // '                            </div>'+
        // '                            <div class="user-action">                                '+
        // '                                <svg xmlns="http://www.w3.org/2000/svg" width="20.355" height="15.832" viewBox="0 0 20.355 15.832"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M18.659,2.25H1.7A1.7,1.7,0,0,0,0,3.946V16.386a1.7,1.7,0,0,0,1.7,1.7H18.659a1.7,1.7,0,0,0,1.7-1.7V3.946A1.7,1.7,0,0,0,18.659,2.25ZM6.22,5.643A2.262,2.262,0,1,1,3.958,7.9,2.264,2.264,0,0,1,6.22,5.643Zm3.958,8.368a.741.741,0,0,1-.792.679H3.053a.741.741,0,0,1-.792-.679v-.679A2.225,2.225,0,0,1,4.637,11.3h.177a3.64,3.64,0,0,0,2.813,0H7.8a2.225,2.225,0,0,1,2.375,2.036Zm7.916-1.866a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V11.58a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Zm0-2.262a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V9.318a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Zm0-2.262a.284.284,0,0,1-.283.283H12.722a.284.284,0,0,1-.283-.283V7.056a.284.284,0,0,1,.283-.283h5.089a.284.284,0,0,1,.283.283Z" transform="translate(0 -2.25)"/></svg>'+
        // '                            </div>'+
        // '                            <div class="user-action">                                '+
        // '                                <svg xmlns="http://www.w3.org/2000/svg" width="19.293" height="19.293" viewBox="0 0 19.293 19.293"><defs><style>.a{fill:#a1a1a1;}</style></defs><path class="a" d="M9.806,15.795A6.643,6.643,0,0,1,14.14,9.574a5.505,5.505,0,0,0,.489-2.219c0-3,0-5.426-3.617-5.426S7.394,4.357,7.394,7.354a5.386,5.386,0,0,0,2.412,4.481v.994c-4.09.334-7.235,2.344-7.235,4.774h7.486a6.616,6.616,0,0,1-.251-1.809Zm6.632-5.426a5.426,5.426,0,1,0,5.426,5.426A5.426,5.426,0,0,0,16.438,10.369ZM19.452,16.4H13.423V15.192h6.029Z" transform="translate(-2.571 -1.928)"/></svg>'+
        // '                            </div>'+
        // '                        </div>'+
        '                    </div>'+
        '                    <div class="chat-messages">'+
        // '                        <div class="row admin-chat">'+
        // '                            <div class="message-text">'+
        // '                                <b>Admin</b>'+
        // '                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'+
        // '                                <span class="chat-time">10:38 AM</span>'+
        // '                                <div class="pin-chat">'+
        // '                                    <svg xmlns="http://www.w3.org/2000/svg" width="9.159" height="13.495" viewBox="0 0 9.159 13.495"><path d="M16.653,13.885l-4.5-2.6a1.155,1.155,0,1,0-1.156,2l4.5,2.6a1.156,1.156,0,0,0,1.156-2Zm-3.715-2.812,3.5,2.023L17.633,9.78l-2.419-1.4-2.276,2.689Zm-2.583,8.518,3.351-4.071-1.5-.867ZM19.081,7.946l-3-1.734a.867.867,0,0,0-.867,1.5l3,1.734a.867.867,0,1,0,.866-1.5Z" transform="translate(-10.356 -6.096)"/></svg>'+
        // '                                </div>'+
        // '                            </div>'+
        // '                        </div>'+
        // '                        '+
        // '                        <div class="row self-chat">'+
        // '                            <div class="message-text">'+
        // '                                <b>Admin</b>'+
        // '                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'+
        // '                                <span class="chat-time">10:38 AM</span>'+
        // '                            </div>'+
        // '                        </div>'+
        '                    </div>'+
        '                <div class="chat-input">'+
        '                    <input type="text" id="attSearch" name="" placeholder="Type your message here">'+
        '                    <button class="chat-button" type="button">Send <i class="material-icons">send</i></button>'+
        '                </div>';

        return myvar


    }
	return {
		init: init,
        openSingleWindow:openSingleWindow
	}
})();

var ImageContainer = function(){
	
	var init = function(){}

	var renderImage = function(cont, obj){
		$(cont).html('');
	      $(cont).html(getHtml(obj.resource));  
	}

	var getHtml = function(url){
		return '<img src="'+url+'" style="width:100%;height:'+$("#modalinsidebody").height()+'px;">'
	}

	

	var initUI = function(){
	}


	return {
		init: init,
		renderImage: renderImage
	}
}



var Mail = (function(){
    //var pendingmails = 0;
    var init = function(){}
    var renderMail = function(htmlel, _d, _e, cb, _ref){
        var user = EventStore.getUser();
        var self = this;
        console.log("user is",user);
        edit_ = _e;
        dis = "disabled"
        data_ = _d;
        callback = cb;
        ol = {};
        elt = htmlel
        oRef = _ref;
        /******user profile******/
        //ol.uuid = _uuid;
        ol.name = data_.firstname+' '+data_.lastname;
        ol.email = data_.email
        ol.phone = data_.phone === "" ? "+91-9999999999" : data_.phone
        ol.jobtitle = data_.jobtitle
        ol.companyname = data_.companyname
        ol.image = data_.image
        ol.subject = "";
        ol.mailid = "";
        ol.fromname = "";
        ol.fromuuid = "";
        htmlel.html(mailUI(ol));
        manageSendbox(user.uuid);
        manageInbox(user.uuid);        
        bindEvent();

    }
    var renderMails = function(htmlel, _d){
        var user = EventStore.getUser();
        var data_ = _d;
        ol = {};
        ol.name = data_.fromname;
        ol.companyname = data_.fromcompanyname;
        ol.fromuuid  = data_.fromuuid;
        ol.subject   = data_.subject;
        ol.mailid = data_.mailid;
        ol.fromname = data_.fromname;
        ol.fromuuid = data_.fromuuid;

        htmlel.html(mailUI(ol));
        manageSendbox(user.uuid);
        manageInbox(user.uuid); 
        manageMessages(data_.messages,user);
        bindEvent();

    }
    // <div class="row other-chat m0"> <i class="material-icons">account_circle</i>
    //                             <div class="message-text">
    //                                 <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
    //                                     has been the industryâ€™s standard dummy text.</p> 
    //                                 <span class="chat-time">10:38 AM</span>
    //                             </div>
    //                         </div>                                                
    //                         <div class="row self-chat m0"> <i class="material-icons">account_circle</i>
    //                             <div class="message-text">
    //                                 <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
    //                                     has been the industryâ€™s standard dummy text.</p> 
    //                                 <span class="chat-time">10:38 AM</span>
    //                             </div>
    //                         </div>
    var manageMessages = function(message,user){
        var mymessages = JSON.parse(message);
        console.log("my messages are ",mymessages);
        var messags = "";
        if(typeof mymessages != "undefined" && mymessages.messages.length > 0){
            mymessages.messages.forEach(function(val,key){
                var uuid = user.uuid;
                if(uuid!=val.fromid){
                    messags+=`<div class="row other-chat m0"> <i class="material-icons">account_circle</i>
                                <div class="message-text">
                                    <p>`+val.message+`</p> 
                                    <span class="chat-time">`+moment.unix(val.datetime).fromNow()+`</span>
                                </div>
                            </div>`;
                }else{
                    messags+=`<div class="row self-chat m0"> <i class="material-icons">account_circle</i>
                                <div class="message-text">
                                    <p>`+val.message+`</p> 
                                    <span class="chat-time">`+moment.unix(val.datetime).fromNow()+`</span>
                                </div>
                            </div>`;
                }
            })
            $(".chat-messages").html(messags);
        }
    }
    var manageSendbox = function(_u){
        console.log("getting data for",_u);
        Utility.loader({url: "mails/sentmails.json?uid="+_u,  prldr:"H", cb:senboxLoad.bind(this)});
        
    }
    var manageInbox  = function(_u){
        Utility.loader({url: "mails/inboxmails.json?uid="+_u,  prldr:"H", cb:inboxLoad.bind(this)});
    }
    var inboxLoad = function(_o){
        var pendingmails = 0;
        if(_o.data !== null){
            mData = _o.data;
            var inboxmails = "";
            console.log("inbox data",mData.body);
            if(typeof mData.body !== "undefined"){
                mData.body.forEach(function(val,key){
                    if(val.readmail== 0){
                        pendingmails++;
                        inboxmails+= `<div  data-mailid = `+val.mailid+` data-fromname=`+encodeURIComponent(val.fromname)+` data-fromuid=`+encodeURIComponent(val.fromuid)+` data-subject=`+encodeURIComponent(val.subject)+` data-toname = `+encodeURIComponent(val.toname)+`  data-touid = `+val.touid+` data-fromcompanyname = `+encodeURIComponent(val.fromcompanyname)+` data-tocompanyname= `+encodeURIComponent(val.tocompanyname)+` data-messages=`+encodeURIComponent(JSON.stringify(val.messages))+` class="unread inboxui">`+val.subject+`</div>`;
                    }else{
                        inboxmails+= `<div  data-mailid = `+val.mailid+` data-fromname=`+encodeURIComponent(val.fromname)+` data-fromuid=`+encodeURIComponent(val.fromuid)+` data-subject=`+encodeURIComponent(val.subject)+` data-toname = `+encodeURIComponent(val.toname)+`  data-touid = `+val.touid+` data-fromcompanyname = `+encodeURIComponent(val.fromcompanyname)+` data-tocompanyname= `+encodeURIComponent(val.tocompanyname)+` data-messages=`+encodeURIComponent(JSON.stringify(val.messages))+` class="read inboxui">`+val.subject+`</div>`;
                    }
                    
                })

            }
            $(".inboxmails").html(inboxmails);
            bindEvent();
            if(pendingmails==0){
                $(".removemsg").removeClass("no-msg");
            }else{
                $(".removemsg").addClass("no-msg");
                $(".no-msg").html(pendingmails);
            }
            
            //return mData;
			//getHtml(_o.data)
		}else{
            return null;
			//alert("Data not loaded")
		}
    }
    var senboxLoad = function(_o){
		if(_o.data !== null){
            mData = _o.data;
            var sendmails = "";
            console.log("sendbox data",mData.body);
            if(typeof mData.body !== "undefined"){
                mData.body.forEach(function(val,key){
                    //sendmails+= `<div class="read">`+val.subject+`</div>`;
                    sendmails+= `<div  data-mailid = `+val.mailid+` data-fromname=`+encodeURIComponent(val.fromname)+` data-fromuid=`+encodeURIComponent(val.fromuid)+` data-subject=`+encodeURIComponent(val.subject)+` data-toname = `+encodeURIComponent(val.toname)+`  data-touid = `+val.touid+` data-fromcompanyname = `+encodeURIComponent(val.fromcompanyname)+` data-tocompanyname= `+encodeURIComponent(val.tocompanyname)+` data-messages=`+encodeURIComponent(JSON.stringify(val.messages))+` class="read sentboxui">`+val.subject+`</div>`;

                })
            }
            $(".sendmails").html(sendmails);
            //mData.body;
			//getHtml(_o.data)
		}else{
            return null;
			//alert("Data not loaded")
		}
	}
    var bindEvent = function(){
        $("#sendmail").off("click").on("click", function(){
            var mailbody = [];
            var user = EventStore.getUser();
            var n = $("#modalinsidebody [name=name]");
            var m = $("#modalinsidebody [name=message]");
            var s = $("#modalinsidebody [name=subject]");


            /******************************************/
            var fn = $("#modalinsidebody [name=fromname]");
            var fid = $("#modalinsidebody [name=fromuuid]");
            var mid = $("#modalinsidebody [name=mailid]");

            var inboxfrom = fn.val();
            var inboxfromid = fid.val();
            var inboxmid = mid.val();
            console.log(inboxfrom,inboxfromid,inboxmid);
            /******************************************/


            console.log("user is",user);
            var subject = s.val();
            var fromname = user.firstname+' '+user.lastname;
            var fromuuid = user.uuid;
            //var toname = n.val();
            //var touid = data_.uuid;
            var toname;
            var touid;
            if(typeof inboxfrom !="undefined" && inboxfrom!=""){
                toname = inboxfrom;
            }else{
                toname = n.val();
            }
            if(typeof inboxfromid !="undefined" && inboxfromid!=""){
                touid = inboxfromid;
            }else{
                touid = data_.uuid;
            }


            console.log("userid is ",touid);
            var message = m.val();
            var message = [{
                "datetime" : Math.round(Date.now() / 1000),
                "fromid" : fromuuid,
                "message" : message 
            }];
            //[{"datetime": 160167678613,"fromid": "f5c9o6l9lk","message" : "tell me the status or work"}]

            var fd = new FormData();
            fd.append("subject", subject);
            fd.append("fromuid", fromuuid);
            fd.append("touid", touid);
            fd.append("fromuname",fromname);
            fd.append("touname",toname);
            if(typeof inboxmid!="undefined" && inboxmid!=""){
                fd.append("uuid",inboxmid);
            }
            //fd.append("uuid",fromuuid);
            fd.append("messages", JSON.stringify(message));
            Utility.loader({url: "mails.json", data : fd, type :"POST", cb:function(_d){
                console.log("done")
                console.log(_d);
                Notification.notify('success','Mail Sent Sucessfully');
                
                //debugger
            }});

            $("#modalinsideclose").click();
        });
        $(".email-nav").off("click").on("click", function(){
            $(".emails").addClass("H");
            $(".email-nav").removeClass("active");
            $(this).addClass("active");
            var id = $(this).attr("data-id");
            if(id == "inbox"){
                $(".inboxmails").removeClass("H");
            }else if(id == "send"){
                $(".sendmails").removeClass("H");
            }else{
                $(".compose").removeClass("H");
            }

        });
        $(".inboxui").off("click").on("click",function(){
            var fromcompanyname = $(this).attr("data-fromcompanyname");
            var tocompanyname   = $(this).attr("data-tocompanyname");
            var fromname        = $(this).attr("data-fromname");
            var message = $(this).attr("data-messages");
            var fromuuid = $(this).attr("data-fromuid");
            var subject  = $(this).attr("data-subject");
            var mailid = $(this).attr("data-mailid");
            var data = {
                "fromname" : decodeURIComponent(fromname),
                "fromcompanyname" : decodeURIComponent(fromcompanyname),
                "messages" : decodeURIComponent(message),
                "fromuuid" : decodeURIComponent(fromuuid),
                "subject"  : decodeURIComponent(subject),
                "mailid"   : mailid,
            }
            console.log(data);
            renderMails($("#modalinsidebody"),data);
        });
        $(".sentboxui").off("click").on("click",function(){
            var fromcompanyname = $(this).attr("data-tocompanyname");
            var tocompanyname   = $(this).attr("data-tocompanyname");
            var fromname        = $(this).attr("data-toname");
            var message = $(this).attr("data-messages");
            var fromuuid = $(this).attr("data-fromuid");
            var subject  = $(this).attr("data-subject");
            var mailid = $(this).attr("data-mailid");
            var data = {
                "fromname" : decodeURIComponent(fromname),
                "fromcompanyname" : decodeURIComponent(fromcompanyname),
                "messages" : decodeURIComponent(message),
                "fromuuid" : decodeURIComponent(fromuuid),
                "subject"  : decodeURIComponent(subject),
                "mailid"   : mailid,
            }
            console.log(data);
            renderMails($("#modalinsidebody"),data);
        });
    }
    var mailUI = function(_o){
        console.log(_o);
        var html = `<div class="email">
        <div class="email-lhs">
            <div data-id="compose" class="email-nav active">                     
                <svg xmlns="http://www.w3.org/2000/svg" width="22.385" height="22.385" viewBox="0 0 22.385 22.385"><defs><style>.a{fill:#7c7c7c;}</style></defs><path class="a" d="M.531,0A.514.514,0,0,0,0,.531V21.854a.514.514,0,0,0,.531.531H21.854a.514.514,0,0,0,.531-.531V.531A.514.514,0,0,0,21.854,0H.531ZM2.795,5.589H19.563v8.384H16.768l-2.795,2.795H8.384L5.589,13.973H2.795Z"/></svg>
                Compose
            </div>
            <div data-id="inbox" class="email-nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="22.385" height="22.385" viewBox="0 0 22.385 22.385"><defs><style>.a{fill:#7c7c7c;}</style></defs><path class="a" d="M.531,0A.514.514,0,0,0,0,.531V21.854a.514.514,0,0,0,.531.531H21.854a.514.514,0,0,0,.531-.531V.531A.514.514,0,0,0,21.854,0H.531ZM2.795,5.589H19.563v8.384H16.768l-2.795,2.795H8.384L5.589,13.973H2.795Z"/></svg>
                Inbox <span class="removemsg no-msg"></span></div>
            <div data-id="send" class="email-nav sendboxnav">                        
                <svg xmlns="http://www.w3.org/2000/svg" width="21.634" height="18.544" viewBox="0 0 21.634 18.544"><defs><style>.a{fill:#7c7c7c;}</style></defs><path class="a" d="M3.01,23.044l21.624-9.272L3.01,4.5,3,11.711l15.453,2.06L3,15.832Z" transform="translate(-3 -4.5)"/></svg>
                Send</div>
            
        </div>
        <div class="email-rhs">
            <!-- Inbox Message -->                    
            <div class="email-title emails compose" style="padding-left: 30px;">
                <div class="dF">
                    <i class="material-icons">account_circle</i>
                    <div class="email-user">
                        <b class="f11 db">`+_o.name+`</b>
                        `+_o.companyname+`
                    </div>
                </div>
            </div>
            <div class="email-sub emails compose" style="padding-left: 30px;">
                <span>Subject</span>
                <input type="hidden" name="name" value="`+_o.name+`">
                <input type="hidden" name = "mailid" value="`+_o.mailid+`">
                <input type="hidden" name = "fromuuid" value="`+_o.fromuuid+`">
                <input type="hidden" name = "fromname" value="`+_o.fromname+`">
                <input type="text" name="subject" placeholder="" value="`+_o.subject+`" required>
            </div>
            <div class="email-content emails compose">
                <div class="chat-messages">
                    <!--<div class="row other-chat m0"> <i class="material-icons">account_circle</i>
                        <div class="message-text">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industryâ€™s standard dummy text.</p> 
                            <span class="chat-time">10:38 AM</span>
                        </div>
                    </div>                                                
                    <div class="row self-chat m0"> <i class="material-icons">account_circle</i>
                        <div class="message-text">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industryâ€™s standard dummy text.</p> 
                            <span class="chat-time">10:38 AM</span>
                        </div>
                    </div> -->                      
                </div>                    
                <div class="chat-input">
                    <input type="text" name="message"  placeholder="Type your message here">
                    <button class="chat-button" id="sendmail" type="button"><i class="material-icons">send</i></button>
                </div>
            </div>
            <!-- Inbox -->
            <div class="inbox inboxmails emails H">
                <div class="unread">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="unread">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="unread">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
            </div>
            <!-- sendbox -->
            <div class="inbox sendmails emails H">
                <div class="read">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy UN-READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
                <div class="read">This is dummy READED email subject 1, hope you’re getting the idea</div>
            </div>
            <!-- Compose Mail -->
            <div class="H">
            <div class="email-title">
                <div class="dF">                            
                    <span>To</span>
                    <i class="material-icons">account_circle</i>
                    <div class="email-user">
                        <b class="f11 db">Pradeep Gupta</b>
                        The Times Of India - Tech Lead
                    </div>
                </div>
            </div>
            <div class="email-sub">
                <span>Subject</span>
                <input type="text" id="attSearch" name="" placeholder="Type your message here">
            </div>
            <div class="email-content">
                <div class="no-email">
                    <i class="material-icons">info</i> There are no emails threaded in this conversation. Please write the subject and message to start the conversation.
                </div>
            </div>
            <div class="chat-input">
                <input type="text" name="" placeholder="Type your message here">
                <button class="chat-button" type="button"><i class="material-icons">send</i></button>
            </div>
        </div>
        </div>
    </div>`;
    return html;
    }
    return {
		init: init,
		renderMail: renderMail
	}
})
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
	var videoComponent_;
	var objActModal_;
	var mailContainer_;

	
	var init = function(_ref, _cb){
		callback_ = _cb;
		videoComponent_ = new VideoComponent();
		videoComponent_.init(this, videoCallback_.bind(this));
		pdfContainer_ = new PDFComponent();

		cardContainer_ = new BusinessCard();
		cardContainer_.init();

		imageComponent_ = new ImageContainer();
		mailContainer_ = new Mail();
		mailContainer_.init();


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
		
		var q;
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
					str += '<img src="images/email.svg" alt="" data-id="mail_'+i+'">'


					
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
				populateEmail(o, true, this)
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
	
	// var populateMail = function(_o){
	// 	emailCOntainer.renderEmail($("#modalinsidebody"), _o)
	// }

	var populateEmail = function(_o,_editable, _ref){
		$(".modal-overlay-cont #modalinsidelable").text("Email");
		//$(".modal-overlay-cont .titleHdng").text('Send Email to '+_o.firstname+ ' ' + _o.lastname+' ('+_o.companyname+')');
		$(".modal-overlay-cont").addClass("show");
		//mailContainer_.render
		mailContainer_.renderMail($("#modalinsidebody"),  _o, _editable, cardEditAction.bind(this), _ref);
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




var Notification = (function () {
	var socket;
	var init = function(){
		
		connect_socket();
		// const options = {
		// 	url: 'ws://172.29.72.27:2019',
		// 	pingTimeout: 15000, 
		// 	pongTimeout: 10000, 
		// 	reconnectTimeout: 2000,
		// 	pingMsg: "heartbeat"
		// }
		// var websocketHeartbeatJs = new WebsocketHeartbeatJs(options);
		// websocketHeartbeatJs.onopen = function () {
		// 	console.log('connect success');
		// 	console.log("getting cookies");
		// 	console.log(Login.getCookie());
		// 	//websocketHeartbeatJs.send({"SESSION_ID" : ""});
		// }
		// websocketHeartbeatJs.onmessage = function (e) {
		// 	//console.log(`onmessage: ${e.data}`);
		// }
		// websocketHeartbeatJs.onreconnect = function () {
		// 	//console.log('reconnecting...');
		// }
	}
	var connect_socket = function() {
		socket = new WebSocket("ws://172.29.72.27:2019");
		var uuid = EventStore.getUserSession();
		console.log(uuid);
		socket.onopen = function(e) {
			console.log("connection established");
			console.log("sending messages to the server");
			socket.send( JSON.stringify([uuid,"socket-connection-ack"]));
		};
		socket.onmessage = function(event) {
			console.log(`[message] Data received from server: ${event.data}`);
			//Notification.notify("SUCCESS",event.data.message);
			var msg = JSON.parse(event.data);
			console.log(msg);
			if(msg.message!="registered"){
				notify("info",msg.message);
			}
			//alert(msg.message);
		};
		//socket.on("close", connect_socket); // <- rise from your grave!
		socket.onclose = function(){
			connect_socket();
		}
		heartbeat();
	}
	var heartbeat = function() {
		var uuid = EventStore.getUserSession();
		if (!socket) return;
		if (socket.readyState !== 1) return;
		socket.send( JSON.stringify([uuid,"socket-connection-ack"]));
		setTimeout(heartbeat, 500);
	}
	var notify = function(ty, txt){
		$(".alert-msg[role=alert]").addClass("H")
		var str = ""
		if(ty === "info"){
			alertContent("INFROMATION", ty, txt)
		}else if(ty === "success"){
			alertContent("SUCCESS", ty, txt)
		}else if(ty === "fail"){
			alertContent("FAIL", "warning", txt)
		}
	}

	var alertContent = function(type, at, text){
	var str = '<div class="close-ico" id="clsbtn"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002"><path class="a" d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"/></svg></div><i class="material-icons">info</i><b>'+type+'</b>'+text

		$("#alertBox").removeClass();
		$("#alertBox").addClass("alert-msg alert-msg-"+at+" show");

		var inter = setTimeout(function(){
			$("#alertBox").removeClass("show");
		}, 3000)

		$("#alertBox").html(str);
		$("#alertBox").addClass("show");

		$("#alertBox #clsbtn").off("click").on("click", function(){
			clearInterval(inter);
			$("#alertBox").removeClass("show");
		})
	}

	return {
		notify:notify,
		init : init
	}
})();
 

var PDFComponent = function(){
	
	var init = function(){}

	var renderPDF = function(_o){
		$(".modal-body.p1").html("");
		setTimeout(function(){
			$(".modal-body.p1").html(getHtml(_o.resource, $(".modal-body.p1").height()));	
		}, 300)
		
	}

	var getHtml = function(url, hgt){
		//<embed src=”/pdf/sample-3pp.pdf#page=2" type=”application/pdf” width=”100%” height=”100%”>
		return '<embed src="'+url+'" type="application/pdf" width="100%" height="'+hgt+'" style="overflow-y: hidden">'
		//return '<iframe src="http://localhost/test.pdf" style="width:100%; height:100%;"">'
				//}els
	}

	

	var initUI = function(){
	}




	return {
		init: init,
		renderPDF: renderPDF
	}
}



var VideoComponent = function(){
    var pRenderer_, callback_, playerLoad_ = false, player_, containerId_;
    var tObj = {};

    var sT, tCnt, tGap;
    var cont_, timeInterval, tolerence, timeElapsed, simuLive, healthCheck;
    var container, hr_, min_, sec_, vid_, tol_ = 10;
    var objTimeStaus

	
	
    
    var init = function(_ref, _cb){

		callback_ = _cb;
	}

    var renderVideo= function(cont, obj){
        container = cont;
        timeElapsed = 0;
        simuLive = 0;

        if(obj.mainObj && obj.mainObj.hasOwnProperty("status") && obj.mainObj.status === 0){
            objTimeStaus = {};
            simuLive = 1;
            cont_ = cont
            tObj = obj
            $.ajax({url:"http://time.akamai.com?"+new Date().getTime(), success:function(t){checkEventStatus(t)}})
        }else{
            showVideoPlayer(cont, obj)
            
        }
  }

  var checkEventStatus = function(t){
      var _t = t
    /* var tnow = Math.floor(Date.now()/1000);
     tObj.mainObj.resource.starttime = tnow + 5;
     tObj.mainObj.resource.endtime = tnow + 60;*/
     
      t = Math.floor(parseInt(t));

      //console.log(tnow)
      console.log(t)


      

      if(t >= tObj.mainObj.endtime){
          console.log("Evnet Condulded")
          //Display the slate of Event Ended
          return
      }

      var tim;
      tGap = tObj.mainObj.resource.starttime - t;
 
      if(tGap >= 0){
          tCnt = 0;
          timeInterval = setInterval(function(){
              tCnt++;
              if(tCnt >= tGap){
                  clearInterval(timeInterval);
                  showVideoPlayer(cont_, tObj);
                  timeElapsed = 0;
              }else{
                  tim = timeDiffCalc((tGap - tCnt))
                  hr_.text(tim.hour)
                  min_.text(tim.minute)
                  sec_.text(tim.second)
              }
          }, 1000)
           $(container).html(countDown());
           hr_ = $(".count-down #hrs");
           min_ = $(".count-down #mins");
           sec_  = $(".count-down #secs");
      }else{
          timeElapsed = Math.abs(tGap);
          showVideoPlayer(cont_, tObj);
      }
 
  }

    var timeDiffCalc = function (diff) {
        var objT = {}
        var d = Math.floor(diff / 86400);
        objT.day = (d < 10) ? ("0" + d) : d;

        d = Math.floor(diff / 3600)  % 24
        objT.hour = (d < 10) ? ("0" + d) : d;

        d = Math.floor(diff / 60)  % 60
        objT.minute = (d < 10) ? ("0" + d) : d;

        d = Math.floor(diff) % 60;
        objT.second = (d < 10) ? ("0" + d) : d;


        
        
        //console.log("days:", Math.floor(diff / 86400), "  hour:", Math.floor(diff / 3600) % 24, "  minutes:", Math.floor(diff / 60) % 60, "  seconds: ", Math.floor(diff) % 60)

        return objT;
    }
  
	//var renderVideo = function(cont, obj){
    var showVideoPlayer = function(cont, obj){
		//$(cont).html(getHtml());3
        containerId_ = "playerContainer_"+makeid(10) //obj.videoid
        var vcon = {}
        vcon.videoid = obj.videoid;
        vcon.autoplay = obj.autoplay
        vcon.muted = obj.muted
        var h = obj.pos && obj.pos === "wall" ? "100%" : "486px"
        $(cont).html('');
        if(obj.pos && obj.pos === "wall"){
            setDimension("100%", vcon, cont )
        }else{
            setTimeout(function(){
              var t = $("#modalBodyP0").width();
              setDimension(t*9/16+"px", vcon,  cont)
            },500)
        }

      

		
        /*$(cont).html('');
        setTimeout(function(){
          console.log("============", $("#modalBodyP0").width())
            if(obj.pos && obj.pos === "wall"){

            }
            $(cont).html('<div id="'+containerId_+'" style="width:100%;height:'+h+'"></div>');  
            addVideo(vcon)
        }, 300)*/
	
		
	}

  var setDimension = function(h, o, c){
    $(c).html('<div id="'+containerId_+'" style="width:100%;height:'+h+'"></div>');  
    addVideo(o)
  }

	var addVideo = function(_v){
        var slikeConfig = {
            apiKey: "test403web5a8sg6o9ug", 
            env: "stg",
            contEl: containerId_,
            version: "3.5.10",
            video: {
                simulive:simuLive,
                //id: "1xpccb5kzu"//_v.videoid
                id: _v.videoid
            },
            player: {
                autoPlay: _v.autoplay,
                mute: _v.muted,
                skipAd: true
            },
            live: {
                lowLatency: true,
                loadDVR: false
            },
            callbacks:{}
        };

        console.log("vp  ",playerLoad_, player_)
        if(playerLoad_){
            player_.destroy()
            player_ = null;
            player_ = new SlikePlayer(slikeConfig);
            videoEvents();
        }else{
            loadPlayer(slikeConfig)
            
        }
    
    
  }


    var renderPlayer = function(config){
        player_ = new SlikePlayer(config);
        player_.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
            console.log('player error', data);
        });
        videoEvents()
    }
  
  var loadPlayer = function(_c){
     spl.load(_c, function (sdkLoadStatus, config) {
        if (sdkLoadStatus) {
          playerLoad_ = true;
          renderPlayer(config)
        }
      });
 
  }

    var videoEvents = function(){
        player_.on(SlikePlayer.Events.INIT, function (eventName, data) {
          //  console.log('player init`', data);
        });

        player_.on(SlikePlayer.Events.VIDEO_STARTED, function (eventName, data) {
            if(simuLive){
                player_.bpl.seek(timeElapsed);
                 vid_ = player_.bpl.video.node;

                invokePlayStatus();
                var tc = 0
                var tint = setInterval(function(){
             
                    tc++;
                    if(tc === 3){
                        clearInterval(tint)
                    }
                    $(".__liveIndicator").removeClass(" __switchLive")
                }, 1000)
            }
             //debugger
        });

        player_.on(SlikePlayer.Events.VIDEO_RESUMED, function (eventName, data) {
          
           if(simuLive){
               $.ajax({url:"http://time.akamai.com?"+new Date().getTime(), success:function(t){reAdjustSeek(t)}})
               //clearInterval(healthCheck)
           }
        });

        player_.on(SlikePlayer.Events.VIDEO_TIMEUPDATE, function (eventName, data) {
          //console.log(vid_.currentTime)
           if(simuLive){
               //$.ajax({url:"http://time.akamai.com?"+new Date().getTime(), success:function(t){reAdjustSeek(t)}})
               //clearInterval(healthCheck)
           }
        });

        player_.on(SlikePlayer.Events.VIDEO_PAUSED, function (eventName, data) {
          console.log("VIdeo paused swithched off" )
           $(".__liveIndicator").addClass(" __switchLive")
           if(simuLive){
               //$.ajax({url:"http://time.akamai.com?"+new Date().getTime(), success:function(t){reAdjustSeek(t)}})
               //clearInterval(healthCheck)
           }
        });
        

        /*player_.on(SlikePlayer.Events.VIDEO_ENDED, function (eventName, data) {
           if(simuLive){
               clearInterval(healthCheck)
           }
        });

        player_.on(SlikePlayer.Events.VIDEO_COMPLETED, function (eventName, data) {
           if(simuLive){
               clearInterval(healthCheck)
           }
        });*/

        player_.bpl.video.node.addEventListener("ended", function(){
            if(simuLive){
               clearInterval(healthCheck)
               $(container).html(completeEvent())
           }
        })

        $(".__liveIndicator").off("click").on("click", function(){
            if(vid_.paused)
                return;
            console.log("HERRRRRR")
            //if($(".__liveIndicator").hasClass(" __switchLive")){
                $.ajax({url:"http://time.akamai.com?"+new Date().getTime(), 
                    success:function(t){
                        var diff = parseInt(t) - (tObj.mainObj.resource.starttime + Math.round(vid_.currentTime))
                        console.log(diff+"   diff")
                        player_.bpl.seek((vid_.currentTime + diff));
                        console.log(" swithched ON")
                        $(".__liveIndicator").removeClass(" __switchLive")
                    }
                })
                
           // }
        })

        
    }


    var invokePlayStatus = function(){
      healthCheck = setInterval(function(){
          if(vid_.paused)
              return

          $.ajax({url:"http://time.akamai.com?"+new Date().getTime(), 
              success:function(t){
                reAdjustSeek(t)                  
              },
              error:function(){}
          })
      }, 10000)
    }

    var reAdjustSeek = function(t){
        var at = tObj.mainObj.resource.starttime + Math.round(vid_.currentTime)
        var _t = Math.floor(parseInt(t))
        console.log("Difference ", (_t - at))
        var diff = parseInt(t) - (tObj.mainObj.resource.starttime + Math.round(vid_.currentTime))
        if(diff >= tol_){
            if(vid_.currentTime + diff >= vid_.duration){
                //Event Concluded
            }else{
                if(!vid_.paused){
                    player_.bpl.seek((vid_.currentTime + diff));
                     console.log("SWITCHED ON TOL")
                     $(".__liveIndicator").removeClass(" __switchLive");
                 }
            }
        }else{
            if(diff >= 5){
                if(!$(".__liveIndicator").hasClass(" __switchLive")){
                    $(".__liveIndicator").addClass(" __switchLive");
                }
            }else{
                $(".__liveIndicator").removeClass(" __switchLive");
            }

        }
    }


  var makeid = function(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  
    
    // var tmr;
    // function startTimer(){
    //   tmr = setInterval(function(){
    //     $.ajax({type:"GET", url:"http://time.akamai.com", success:checkStatus})
    //   }, 10000)
    // }

    var destroyPlayer = function(){
        try{
            // if(playerLoad_){
            //     player_.destroy()
            //     player_ = null;
            // }
            clearInterval(timeInterval)
        }catch(e){
            console.log(e.message)
        }
    }

  
    

    var getHtml = function(_o){}
    var initUI = function(){}
    var countDown = function(){
        return '<div class="count-down"><h2>THE EVENT WILL START IN</h2><div class="row mb-0 mt-3"><div class="duration"><h3 id="hrs">00</h3><span>HOURS</span></div><div class="divider">:</div><div class="duration"><h3 id="mins">00</h3><span>MINUTES</span></div><div class="divider">:</div><div class="duration"><h3 id="secs">00</h3><span>SECONDS</span></div></div></div>'
    }

     var completeEvent = function(){
        return '<div class="count-down"><h2>EVENT CONCLUDED</h2></div>'
    }


	return {
		init: init,
		renderVideo: renderVideo,
        destroyPlayer:destroyPlayer
	}
}
var WallVideo = function(){
    var  playerLoad_ = false, player_, containerId_;
    
	var renderVideo = function(cont, obj){
		//$(cont).html(getHtml());3
        containerId_ = "playerContainer_"+makeid(10) //obj.videoid
        var vcon = {}
        vcon.videoid = obj.videoid;
        vcon.autoplay = obj.autoplay
        vcon.muted = obj.muted
        var h = obj.pos && obj.pos === "wall" ? "100%" : "486px"
        $(cont).html('');
        setDimension("100%", vcon, cont )
	}

    var setDimension = function(h, o, c){
        $(c).html('<div id="'+containerId_+'" style="width:100%;height:'+h+'"></div>');  
        addVideo(o)
    }

	var addVideo = function(_v){
        var slikeConfig = {
            apiKey: "test403web5a8sg6o9ug", 
            env: "prod",
            contEl: containerId_,
            version: "",
            video: {
                id: _v.videoid
            },
            player: {
                autoPlay: _v.autoplay,
                mute: _v.muted,
                skipAd: true
            },
            live: {
                lowLatency: true,
                loadDVR: false
            },
            callbacks:{}
        };

        if(playerLoad_){
            player_.destroy()
            player_ = null;
            player_ = new SlikePlayer(slikeConfig);
            videoEvents();
        }else{
            loadPlayer(slikeConfig)
            
        }
    
    
  }


    var renderPlayer = function(config){
        player_ = new SlikePlayer(config);
        player_.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
            console.log('player error', data);
        });
        videoEvents()
    }
  
  var loadPlayer = function(_c){
     spl.load(_c, function (sdkLoadStatus, config) {
        if (sdkLoadStatus) {
          playerLoad_ = true;
          renderPlayer(config)
        }
      });
 
  }

    var videoEvents = function(){
        player_.on(SlikePlayer.Events.INIT, function (eventName, data) {
            console.log("INIT")
          //  console.log('player init`', data);
        });

        player_.on(SlikePlayer.Events.VIDEO_STARTED, function (eventName, data) {
            console.log('player started');
            
             //debugger
        });

        player_.on(SlikePlayer.Events.VIDEO_ENDED, function (eventName, data) {
            //console.log('player ended', eventName);
           
        });
    }


    var makeid = function(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
	return {
		renderVideo: renderVideo
	}
}
var Login = (function () {
	var c_name = "usermailid";
	var init = function(){
			createCookie(c_name, createUUID())
			return getCookie()

	}

	var createUUID = function(){
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}

	var createCookie = function(name, value, days) {
	    var expires;
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();

	        console.log(expires)
	    }
	    else {
	        expires = "";
		}
		console.log("cookie name is ",name + "=" + value + expires + "; path=/");
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	var getCookie = function() {
	    if (document.cookie.length > 0) {
	    	
	        var c_start = document.cookie.indexOf(c_name + "=");

	        if (c_start != -1) {
	            c_start = c_start + c_name.length + 1;
	            var c_end = document.cookie.indexOf(";", c_start);
	           
	            if (c_end == -1) {
	                c_end = document.cookie.length;
				}
				console.log("coookie name getting");
	          
	            return unescape(document.cookie.substring(c_start, c_end));
	        }
	    }

	    return "";
	}

	var validateEmail = function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	var deleteCookie = function(){
	    var d = new Date(); 
	    d.setTime(d.getTime() - (1000*60*60*24)); 
	    var expires = "expires=" + d.toGMTString(); 
	    window.document.cookie = c_name+"="+"; "+expires;
	 
	}

	return {
		init:init,
		getCookie:getCookie,
		validateEmail:validateEmail,
		createCookie:createCookie,
		deleteCookie:deleteCookie
	}
})();
 
var Navigation = function () {
	var pRenderer_, pCallback_, nav_;
	

	var init = function(pgr, cb){
		pRenderer_ = pgr;
		pCallback_ = cb
		nav_ = EventStore.getNavigation();

		populateNav()
	}

	var populateNav = function(){

		var it = nav_.item;
		var str = "";
		for(var i=0; i<it.length; i++){
			str += '<a  data-id='+i+'>'
			//str += '<i class="material-icons">'+it[i].icon+'</i>'
			str += '<i class="demo-icon">'+it[i].icon+'</i>'
			str += it[i].label
			str += '</a>'
		}
		$(".footerNav").html(str);
		$(".footerNav a").off("click").on("click", function(){
			var ind = parseInt($(this).attr("data-id"))
			var t = nav_.item[ind]

			if(t.action_link !== ""){
				if(t.action_type === "internal_popup"){
					pRenderer_.modalOnLoad(t);
				}else if(t.action_type === "internal_page"){
					pCallback_(t.action_link)
					//pRenderer_.renderPage(EventStore.getPageData(t.action_link));
				}
			}

		})

		$("#topNavigation a").off("click").on("click", function(){
			if(this.id === "nhome"){

			}else if(this.id === "nlbrd"){
				pRenderer_.modalOnLoad({
					popup_type:"leaderBoard",
					template:"leaderBoard",
					action_link:""
				})
			}else if(this.id === "nguide"){
				
			}

		})


	}

	return {
		init:init
		
	}
};
 
var PageRenderer = function(){
	var callback_, videoComponent_, modalContent_, bgContainer, floterLeft, floterRight, objActive;
	var animVideo, animVidContainer;
	
	var init = function(_ref, _cb){
		callback_ = _cb;
		
		//videoComponent_ = new VideoComponent();
		//videoComponent_.init(this, videoCallback_.bind(this));

		
		videoComponent_ = new WallVideo();
		//videoComponent_.init(this, videoCallback_.bind(this));


		modalContent_ = new ModalComponent();
		modalContent_.init(this, modalCallback_.bind(this))
		
		initUI();
	}

	var renderPage = function(obj){

		if($('#exampleModal').hasClass('show'))
			$('#exampleModal').modal("hide")

		if($('#exampleModal2').hasClass('show'))
			$('#exampleModal2').modal("hide")


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
		var l,t,h,g,c,tp,w;
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
			return str = '<svg xmlns="http://www.w3.org/2000/svg" width="25.698" height="16.701" viewBox="0 0 25.698 16.701"><defs><style>.a{fill:#c9c9c9;}</style></defs><g transform="translate(-2.215 -7.748)"><path class="a" d="M21.5,20.6c-.641-.229-1.688-.24-2.152-.418a3.04,3.04,0,0,1-1-.464,6.154,6.154,0,0,1-.166-1.631,2.635,2.635,0,0,0,.567-.8,8.9,8.9,0,0,0,.275-1.574s.378.16.527-.6c.126-.652.366-1,.3-1.477s-.332-.366-.332-.366a4.286,4.286,0,0,0,.332-2.141,3.425,3.425,0,0,0-3.7-3.383,3.437,3.437,0,0,0-3.7,3.383,4.349,4.349,0,0,0,.326,2.141s-.269-.114-.332.366.172.824.3,1.477c.149.761.527.6.527.6a8.991,8.991,0,0,0,.275,1.574,2.635,2.635,0,0,0,.567.8,6.154,6.154,0,0,1-.166,1.631,2.926,2.926,0,0,1-1,.458c-.458.177-1.505.2-2.152.429a4.039,4.039,0,0,0-2.621,3.846H24.12A4.031,4.031,0,0,0,21.5,20.6Z" transform="translate(-1.112)"/><path class="a" d="M8.425,18.454a3.886,3.886,0,0,0,1.912-.532c-.887-1.345-.406-2.913-.59-4.378a2.415,2.415,0,0,0-2.673-2.335H7.051A2.422,2.422,0,0,0,4.4,13.543c-.183,1.459.326,3.205-.584,4.378a3.6,3.6,0,0,0,1.917.475h0a2.9,2.9,0,0,1-.057.962,1.445,1.445,0,0,1-.687.315,13.28,13.28,0,0,0-1.482.412,2.41,2.41,0,0,0-1.293,2.129h4.6a4.112,4.112,0,0,1,1.832-1.706,3.843,3.843,0,0,1,1.414-.3s.217-.343-.5-.475a4.879,4.879,0,0,1-1.1-.383C8.35,19.226,8.425,18.454,8.425,18.454Z" transform="translate(0 -0.643)"/><path class="a" d="M25.719,18.454a3.886,3.886,0,0,1-1.912-.532c.887-1.345.406-2.913.59-4.378a2.415,2.415,0,0,1,2.673-2.335h.023a2.422,2.422,0,0,1,2.65,2.335c.183,1.459-.326,3.205.584,4.378a3.6,3.6,0,0,1-1.917.475h0a2.9,2.9,0,0,0,.057.962,1.445,1.445,0,0,0,.687.315,13.28,13.28,0,0,1,1.482.412,2.41,2.41,0,0,1,1.293,2.129h-4.6A4.112,4.112,0,0,0,25.5,20.508a3.843,3.843,0,0,0-1.414-.3s-.217-.343.5-.475a4.879,4.879,0,0,0,1.1-.383C25.794,19.226,25.719,18.454,25.719,18.454Z" transform="translate(-4.016 -0.643)"/></g></svg>'
			
			return str;
		}

		
	}

	return {
		init: init,
		renderPage: renderPage,
		modalOnLoad:modalOnLoad
	}
}
var User = function () {
	var pRenderer_, aud_

	var init = function(pgr){
		pRenderer_ = pgr;
		aud_ = $(".wrapper #audience");

		$(".header-rhs [data-id]").on("click", function(){
			
			clickEvent($(this).attr("data-id"));
		})

		audinces();
		
	}

	var clickEvent = function(type){
		var u;
		switch(type){
			
			case "online" :
			u = EventStore.getUserProfile();
			if(u.status !== 1)
				senData(1)
			break;			

			case "away":
			u = EventStore.getUserProfile();
			if(u.status !== -1)
				senData(2)
			break;

			case "dnd":
			u = EventStore.getUserProfile();
			if(u.status !== -2)
				senData(3)
			break;

			case "mapp":
			/*pRenderer_.modalOnLoad({
				popup_type:"leaderBoard",
				template:"leaderBoard",
				action_link:""
			})*/
			break

			case "mprof":
			pRenderer_.modalOnLoad({
				popup_type: "user",
				template: "myProfile",
				data: EventStore.getUserProfile()
			})

			break;

			case "logout":

			Utility.loader({url: "login/logout.json", data : {}, type :"POST", cb:function(_d){
	            console.log("logout ", _d)
	            if(_d.data){
	            	Login.deleteCookie()
	            	document.location.reload()
	            	//document.location.href="/";
	            }
	        }});
			break;
		}
	}


	var senData = function(st){
		var user = EventStore.getUserProfile();

		var fd = new FormData()
        fd.append("firstname", user.firstname)
        fd.append("lastname", user.lastname)
        fd.append("jobtitle", user.jobtitle)
        fd.append("companyname", user.companyname)
        fd.append("phone", user.phone)
        fd.append("status", status)
        user.status = st;

        Utility.loader({url: "users/update.json", data : fd, type :"POST", cb:function(_d){
            var u = EventStore.getUserProfile();
            u.status = st;
            userStatusUpdate(st)
        }});
	}

	var userStatusUpdate = function(){
		var u = EventStore.getUserProfile();
		var s = $("#userStatus #status")
		s.removeClass();
		$("#userStatus 	.dropdown-item").removeClass("current");


		if(u.status == 1){
			s.addClass("status online")
			$("#userStatus 	[data-id=online]").addClass("current");
		}else if(u.status == 2){
			s.addClass("status away")
			$("#userStatus 	[data-id=away]").addClass("current");
		}else if(u.status === 3){
			s.addClass("status notdistrub")
			$("#userStatus 	[data-id=dnd]").addClass("current");
		}
	}

	var audinces = function(){
		/*EventStore.getActivePage();
		Utility.loader({url: "totaluser", cb:function(_d){
			//DATA set the UI
		}});*/

		aud_.html('Total No Users - <b>'+Math.floor(Math.random() * 200) + 1+'</b> <br>This Location - <b>'+Math.floor(Math.random() * 10) + 1+'</b>')
	}

	return {
		init:init,
		audinces:audinces,
		userStatusUpdate:userStatusUpdate
	}
};
 
var EventStore = (function(){
	var strJson, store_ = {};

	

	var parseMaster = function(_o){
		strJson = JSON.stringify(_o);
		if(_o.error){
			return {suc:false, msg:"Error key false"};
		}else{
			var _t = _o.events;
			//store_['user'] = "";
			store_['eventData'] = _t;
			store_['pages'] = _t.pages;
			store_['actPage'] = _t.homepage;
			store_['navigation'] = _t.navigation;
			store_["userProfile"] = "";
			store_["chats"] = {};
			store_["attendies"] = [];

			store_.chats.rooms = _t.chats;

			return {suc:true, msg:"Success", actPage: _t.homepage};
		}
	}

	var setUser = function(_d){
		store_["user"] = "";
		if(_d && !_d.error){
			store_['user'] = _d;
		}
	}

	var getUser = function(){
		return store_.user.user;
	}

	var setUserProfile = function(_d){

		if(_d && !_d.error){
			store_.userProfile = _d.data;
		}
	}

	var getUserProfile = function(){
		return store_.userProfile;
	}

	var updateUserProfile = function(_o){

		var d = store_.userProfile
		d.firstname = _o.firstname
		d.lastname = _o.lastname
		d.jobtitle = _o.jobtitle
		d.companyname = _o.companyname
		d.phone = _o.phone

	}
	
	var setStore = function(payload){
		switch(playload.type){
			case "master":
			break
		}
	}

	var getStore = function(type){
		return store_;
		// var t = store_;
		// if(!!type){

		// }
		// return t;
	}

	var getPageData = function(_key){
		var oT = store_.pages.filter(item => {
			return item.id === _key
		})
		

		if(oT.length){
			store_.actPage = _key;
			return oT[0]
		}
		return "";
	}

	var getNavigation = function(){
		return store_.navigation
	}

	var setActivePage = function(id){
		store_,actPage = id;
	}

	var getActivePage = function(id){
		return store_,actPage;
	}


	var setChatData = function(){

	}

	var getChatData = function(){
		
	}

	var setAttendies = function(_att){
		store_.chats.users = _att
		//store_["attendies"] = _att
	}

	var getAttendies = function(){
		return store_.attendies;	
	}

	var getUserSession = function(){
		return store_.user.uuid;
	}



	return {
		getStore:getStore,
		setStore:setStore,
		parseMaster:parseMaster,
		getPageData:getPageData,
		getNavigation:getNavigation,
		setUser:setUser,
		getUser:getUser,
		setUserProfile:setUserProfile,
		getUserProfile:getUserProfile,
		setActivePage:setActivePage,
		getActivePage:getActivePage,
		updateUserProfile:updateUserProfile,
		setAttendies:setAttendies,
		getAttendies:getAttendies,
		getUserSession:getUserSession,
	}
})();
var Router = function(){
  var callback_;
  
  var init = function(_ref, _cb){
    callback_ = _cb;
    addHashListeners()
  }

  var detectBackOrForward = function(onBack, onForward) {
        var hashHistory = [window.location.hash];
        var historyLength = window.history.length;

        return function() {
          var hash = window.location.hash, length = window.history.length;
          if (hashHistory.length && historyLength == length) {
            if (hashHistory[hashHistory.length - 2] == hash) {
              hashHistory = hashHistory.slice(0, -1);
              onBack();
            } else {
              hashHistory.push(hash);
              onForward();
            }
          } else {
            hashHistory.push(hash);
            historyLength = length;
          }
        }
      };

      var addHashListeners = function(){
        window.addEventListener("hashchange", detectBackOrForward(
            function() { 

             // console.log("back", window.location.hash)
              callback_(window.location.hash);
            },
            function() { 
             // console.log("forward", window.location.hash)
              callback_(window.location.hash); 
            }
        ));

    }

  

  
  return {
    init: init
  }
}
var Utility = (function () {
	var floader = function () {
		var arrLoadQueue = [];
		var load = function(obj){
		  arrLoadQueue.push(obj);
		  if (arrLoadQueue.length == 1){
		      initiateLoad();
		  }
		}

		var initiateLoad = function(){
			//console.log("Load Class")
			
		  if (arrLoadQueue[0].url == null){
		  }else{

		  		console.log(!!arrLoadQueue[0].prldr,  "prl")
		  		//if(!!arrLoadQueue[0].hasOwnProperty("prldr")){}
		  		!!arrLoadQueue[0].prldr ? "" : $("#preloader").removeClass("H")
		  		

		      loadExternalData(arrLoadQueue[0]);
		  }
		}

		var loadSuccess = function(data){
			//console.log("SUCCESS    ")
			//console.log("Remove Class 1")
			$("#preloader").addClass("H");
			arrLoadQueue[0].cb({"data":data});
		    searchQueue();
		}

		var loadError = function(rs){
			//console.log("ERROR  ", rs)
			//console.log("Remove Class 2")
			$("#preloader").addClass("H");
		  var obj = {"Status":rs}
		  arrLoadQueue[0].cb({"data":null});
		  searchQueue();
		}

		var searchQueue = function(){
			//console.log("SEAECH", arrLoadQueue)
		  if (arrLoadQueue.length != 0){
		      arrLoadQueue.splice(0,1);
		  }
		  if (arrLoadQueue.length > 0){
		      initiateLoad();
		  }
		}

		var loadExternalData = function(obj){          
		  	
			var o = {};
			o.url = baseUrl+obj.url
			if(obj.type && obj.type === "POST"){
				o.type = "POST";
				o.data = obj.data;

				o.processData = false;
				o.contentType = false;
			}else{
				o.type = "GET";
				o.datatype = "application/json"
			}
			
			
 			//o.headers = { 'eventid': eventId }

			o.success = function(_data){
				loadSuccess(_data);
			}

			o.error = function(a,c, d){
				console.log(a,c,d)
				loadError(d);
			}
			
			$.ajax(o);

		}
		return {
			load:load
		}	
	}

	var loader_ = new floader();
	var loader = function(obj){
		loader_.load(obj)
	}

	var strngReplace = function ($str, $search, $replace) {
        return $str.split($search).join($replace);
    }

    var trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    }


	return {
		loader:loader,
		strngReplace: strngReplace,
		trim: trim
	}
})();
 