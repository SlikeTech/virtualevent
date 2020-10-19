var Chat = (function(){
	var _cOuter, lhsActiveArr_, connection_, chats_;
    var admin_ = true;
    var chatStatus_;
    var rhsDisplay_;
    var uuid_;
    var handshake_;
	
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

        uuid_ = EventStore.getUser().uuid;
        handshake_ = false;

        Utility.loader({url: "users/attendees.json?eventid=f5n9o69lkl", cb:attendies.bind(this)});
        initUI();

        //Utility.loader({url: "https://act-dev.cleo.live/chatf?evtid=f5n9o69lkl", data : JSON.stringify({roomid:"f5n9o69lkl", ftype:"f5c9o6l9lk", query:{eq:"f5c9o6l9lk"}}), type :"POST", cb:chatHistory.bind(this)})
        //Utility.loader({url: "http://localhost/gchat.json", cb:chatHistory.bind(this)})

        
	}
    
    var chatHistory = function(_d){
        console.log("================")
        console.log(_d)
        //var uuid = EventStore.getUser().uuid;
        var eid = EventStore.getUser().eventid
        var d = _d.data.data

        for(var i=0; i<d.length; i++){
            if(d[i].ReceiverID === "*"){
                chats_.messages[eid].newMessage.push({sender:d[i].SenderID, receiver:eid, msg:d[i].Message, ts:d[i].Ts})
            }else{
               // console.log(d[i].ReceiverID)
                if(!chats_.messages[d[i].ReceiverID]){
                    chats_.messages[d[i].ReceiverID] = {
                        newMessage:[],
                        archieved:[]
                    }    
                }
                chats_.messages[d[i].ReceiverID].newMessage.push({sender:d[i].SenderID, receiver:d[i].ReceiverID, msg:d[i].Message, ts:d[i].Ts})
            }
            // if(d[i].ReceiverID === "*"){
            //     chats_.messages[eid].newMessage.push({sender:d[i].SenderID, msg:d[i].Message, ts:d[i].Ts})
            // }else{
            //     if(d[i].SenderrID === uuid_){
            //         chats_.messages[d[i].ReceiverID].newMessage.push({sender:uuid_, msg:d[i].Message, ts:d[i].Ts})
            //     }else{
            //         chats_.messages[d[i].SenderID].newMessage.push({sender:d[i].SenderID, msg:d[i].Message, ts:d[i].Ts})
            //     }
            // }
        }
        
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
                    //var o = getAllUsersAndGroups()
                    $("#singleChat .chat-messages").html(genRHSMsg(eventId, "min"))
                }else{
                    $("#singleChat .chat-messages").html(genRHSMsg(rhsDisplay_, "min"))
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
            }else{
                $("#chatBox .chat-messages").html(genRHSMsg(rhsDisplay_, "max"))
            }
        })

        //Full Chat Box
        $("#modalBodyP3").html(genFullChat())
        
        
        $(".full-chat .chat-edit svg").off("click").on("click", function(){
            if($("#dummybtn").is(":visible")){
                $("#dummybtn").hide()
                $(".full-chat #editGroup").addClass("H");
            }else{
                $("#dummybtn").show()
            }
            // if($(".full-chat #editGroup").is(":visible")){
            //     $(".full-chat #editGroup").addClass("H");
            // }else{
            //     $(".full-chat #editGroup").removeClass("H")
                
            //     var to = createOrEditRoom("create");
            //     //var to = createOrEditRoom("edit");
            //     $("#editGroup .chat-header").html(to.header);
            //     $("#editGroup .chat-messages").html(to.message);

            // }
            //add group
        })
        
        $("#dummybtn button").off("click").on("click", function(){
            var to;
            if($(this).text() === "Create"){
                to = createOrEditRoom("create");
                getUsersOnly()
            }else{
                to = createOrEditRoom("edit");
                getRoomsOnly();
            }
            $(".full-chat #editGroup").removeClass("H")
            $("#editGroup .chat-header").html(to.header);
            $("#editGroup .chat-messages").html(to.message);
           
            $("#editGroup #cancelBtn").off("click").on("click", function(){
                getAllUsersAndGroups()
                $(".full-chat .chat-edit svg").click()
            })

            $("#editGroup #saveBtn").off("click").on("click", function(){
                
            })
            
            // if($(".full-chat #editGroup").is(":visible")){
            //     $(".full-chat #editGroup").addClass("H");
            // }else{
            //     $(".full-chat #editGroup").removeClass("H")
                
            //     var to = createOrEditRoom("create");
            //     //var to = createOrEditRoom("edit");
            //     $("#editGroup .chat-header").html(to.header);
            //     $("#editGroup .chat-messages").html(to.message);

            // }
            //add group
        })
        
        $(".full-chat .chat-button").off("click").on("click", function(){
            debugger
            //send message
        })
        
        $(".full-chat .min-Icon").off("click").on("click", function(){
            $("#exampleModal3").modal("hide");
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
            $(".chat-floater").addClass("H");
            
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
            $("#singleChat .chat-cOuter").addClass("H");
            $(".chat-floater").removeClass("show-minimise-chat")
        })

        $("#singleChat .fChat-header .dock-Icon").off("click").on("click", function(){
            $(".chat-floater .maximize-icon").click();
            $("#chatBox .chat-messages").html(genRHSMsg(rhsDisplay_, "max"))
        })

        $("#singleChat .fChat-header .close-Icon").off("click").on("click", function(){
            $(".chat-floater").addClass("H");
            $("#singleChat .chat-cOuter").addClass("H");
        })

        
        $("#chatInputMsgMax").off("keypress").on('keypress',function(e) {
		    if(e.which == 13) {
                sendMessage($(this), "#chatBox .chat-messages");
		    }
		});
        $("#chatSendMsgMax").off("click").on("click", function(){
            sendMessage($("#chatInputMsgMax"), "#chatBox .chat-messages");
        })
        $("#chatSendMsgMin").off("click").on("click", function(){
            sendMessage($("#chatInputMsgMin"), "#singleChat .chat-messages");
        })
        $("#chatInputMsgMin").off("keypress").on('keypress',function(e) {
            
		    if(e.which == 13) {
		        sendMessage($(this), "#singleChat .chat-messages");
		    }
		});
       
	}

    var sendMessage = function(_div, _divid){
        var msg = _div.val();
        _div.val("");
        var t = chats_.master[rhsDisplay_];
        if(t.type === "room"){
            connection_.send("41::msg::"+rhsDisplay_+"::*::"+msg);
        }else{
            connection_.send("41::msg::"+eventId+"::"+rhsDisplay_+"::"+msg);
        }
        $(_divid).append(chatSelf({msg:msg}));
        chats_.messages[rhsDisplay_].newMessage.push({sender:uuid_, receiver:rhsDisplay_, msg:msg});
        //$("#chatBox .chat-messages").append(chatSelf({msg:msg}));
        //$('#chatBox .chat-messages').scrollTop($('#chatBox .chat-messages')[0].scrollHeight);
        
        
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
            //console.log(chats_.master[d[i]])
            str += '<div class="chat-row" data-id="'+d[i]+'" data-type="'+chats_.master[d[i]].type+'">'
            str += '<i class="material-icons">account_circle</i>'
            str += '<div class="chat-name text-truncate">'+ chats_.master[d[i]].name+'</div>'
            
            //Unread chat
            //console.log(d[i])
            //debugger
            l = chats_.messages[d[i]].newMessage.length
            h = l === 0 ? " H" : " l"
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
          connection_ =  new WebSocket("wss://act-dev.cleo.live/event?evtid="+EventStore.getUser().eventid+"&jwt="+EventStore.getUser().jwt);
        };

        connection_.onerror = (error) => {
          console.log('failed to connect', error);
          setTimeout(function(){
            connection_ =  new WebSocket("wss://act-dev.cleo.live/event?evtid="+EventStore.getUser().eventid+"&jwt="+EventStore.getUser().jwt);
          }, 1000)
        };

        connection_.onmessage = (event) => {
          //console.log('Received', event.data);
          var t = event.data.split("::")
          if(t.length){
              if(t[0] === "74"){
                  if(handshake_)
                    return;
                  if(t.length > 1){
                      var r = JSON.parse(t[1]).rooms;
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
                  handshake_ = true;
                Utility.loader({url: "http://localhost/gchat.json", cb:chatHistory.bind(this)})


              }else if(t[0] === "41"){
                chats_.messages[t[2]].newMessage.push({sender:t[2], receiver:uuid_, msg:t[3]});
                addToMessage(t[2])
              }
          }
        }

    }

    var chatAdmin = function(_o){
        var str = '<div class="row admin-chat">'
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="message-text">'
        //str += '<b>Admin</b>'
        //str += '<p>Lorem Ipsum is</p>'
        
        str += '<b>Admin</b>'
        str += '<p>'+_o.msg+'</p>'
        

        str += '<div class="pin-chat">'
        str += '<svg xmlns="http://www.w3.org/2000/svg" width="9.159" height="13.495" viewBox="0 0 9.159 13.495"><path d="M16.653,13.885l-4.5-2.6a1.155,1.155,0,1,0-1.156,2l4.5,2.6a1.156,1.156,0,0,0,1.156-2Zm-3.715-2.812,3.5,2.023L17.633,9.78l-2.419-1.4-2.276,2.689Zm-2.583,8.518,3.351-4.071-1.5-.867ZM19.081,7.946l-3-1.734a.867.867,0,0,0-.867,1.5l3,1.734a.867.867,0,1,0,.866-1.5Z" transform="translate(-10.356 -6.096)"/></svg>'
        str += '</div>'
        str += '</div>'
        str += '</div>'

        return str;

    }

    var chatOthers = function(_o){
        var str = '<div class="row other-chat">'
        if(_o.for === "max")
        str += '<i class="material-icons">account_circle</i>'
        str += '<div class="message-text">'
        
        //str += '<b>Admin</b>'
        //str += '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'
        
        str += '<b>'+_o.name+'</b>'
        str += '<p>'+_o.msg+'</p>'
        
        
       // str += '<span class="chat-time">10:38 AM</span>'
        str += '<span class="chat-time"></span>'
        str += '</div>'

        if(_o.for === "max"){
            str += '<div class="email-chat">                                    '
            str += '<svg xmlns="http://www.w3.org/2000/svg" width="19.54" height="13.19" viewBox="0 0 19.54 13.19"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M.072,16.09V5.236q0-.019.057-.358l6.388,5.465L.147,16.467a1.6,1.6,0,0,1-.075-.377ZM.92,4.125a.812.812,0,0,1,.32-.057h17.2a1.067,1.067,0,0,1,.339.057L12.377,9.608l-.848.678L9.852,11.662,8.175,10.286l-.848-.678ZM.939,17.2,7.364,11.04l2.487,2.016,2.487-2.016L18.764,17.2a.9.9,0,0,1-.32.057H1.24a.853.853,0,0,1-.3-.057Zm12.248-6.859,6.369-5.465a1.125,1.125,0,0,1,.057.358V16.09a1.444,1.444,0,0,1-.057.377Z" transform="translate(-0.072 -4.068)"/></svg>'
            str += '</div>'
            str += '<div class="business-icon">'
            str += '<svg xmlns="http://www.w3.org/2000/svg" width="17.967" height="13.974" viewBox="0 0 17.967 13.974"><defs><style>.a{fill:#acacac;}</style></defs><path class="a" d="M16.47,2.25H1.5A1.5,1.5,0,0,0,0,3.747v10.98a1.5,1.5,0,0,0,1.5,1.5H16.47a1.5,1.5,0,0,0,1.5-1.5V3.747A1.5,1.5,0,0,0,16.47,2.25ZM5.49,5.244a2,2,0,1,1-2,2A2,2,0,0,1,5.49,5.244Zm3.494,7.386a.654.654,0,0,1-.7.6H2.7a.654.654,0,0,1-.7-.6v-.6a1.964,1.964,0,0,1,2.1-1.8h.156a3.213,3.213,0,0,0,2.483,0h.156a1.964,1.964,0,0,1,2.1,1.8Zm6.987-1.647a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Zm0-2a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Zm0-2a.25.25,0,0,1-.25.25H11.229a.25.25,0,0,1-.25-.25v-.5a.25.25,0,0,1,.25-.25h4.492a.25.25,0,0,1,.25.25Z" transform="translate(0 -2.25)"/></svg>'
            str += '</div>'
        }
        str += '</div>'

        return str
    
    }

    var chatSelf = function(_o){
        var str = '<div class="row self-chat">'
        if(_o.for === "max")
        str += '<i class="material-icons">account_circle</i>'
        
        str += '<div class="message-text">'
        
        //str += '<b>Admin</b>'
        //str += '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text.</p>'
        
        str += '<b>You</b>'
        str += '<p>'+_o.msg+'</p>'
        
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
            // str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
            // str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
            // str += '<div class="chip"><span class="text-truncate">Tag 220</span> <i class="material-icons">cancel</i></div>'
        }
        
        str += '</div>'
        str += '<div class="user-add-btn">'
        str += '<button id="cancelBtn" class="lightBtn" type="button">Cancel</button>'
        str += '<button id="saveBtn" class="lightBtn" type="button">Save</button>'
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
        //var arr = ['f5d9k9699k', 'f5n9o69lkl', 'fr15ol9zg9']
        $("#chatBox .chat-messages").html(genRHSMsg(id, "max"));
    }

    var getUsersOnly = function(){
        var d = chats_.list.users;
        var str = ""
        for(var i=0; i<d.length; i++){
            //console.log(chats_.master[d[i]])
            str += '<div class="chat-row" data-id="'+d[i]+'" >'
            str += '<i class="material-icons">account_circle</i>'
            str += '<div class="chat-name text-truncate">'+ chats_.master[d[i]].name+'</div>'
            
            //Unread chat
            //console.log(d[i])
            //debugger
            l = chats_.messages[d[i]].newMessage.length
            h = "" //l === 0 ? " H" : " l"
            str += '<div class="chat-date H'+h+' ">'
            //str += '10:30 AM '
            str += '<span>'
            str += l
            str += '</span>'
            str += '</div>'

            //Add User to the group
            str += '<div class="add-user">'
            str += '<svg xmlns="http://www.w3.org/2000/svg" width="30.013" height="18.013" viewBox="0 0 30.013 18.013"><defs><style>.a{fill:#138329;}</style></defs><path d="M16.881,13.506a4.5,4.5,0,1,0-4.5-4.5A4.516,4.516,0,0,0,16.881,13.506Zm0,2.252c-2.983,0-9.006,1.52-9.006,4.5v2.252H25.888V20.261C25.888,17.278,19.865,15.758,16.881,15.758Z" transform="translate(4.125 -4.5)"/><path d="M9.218,3.375a5.843,5.843,0,1,0,5.843,5.843A5.843,5.843,0,0,0,9.218,3.375Zm3.006,6.433H9.808v2.416H8.628V9.808H6.212V8.628H8.628V6.212h1.18V8.628h2.416Z" transform="translate(-3.375 -3.375)"/></svg>'
            str += '</div>'
            
            str += '</div>'
        }
        $(".full-chat .chat-user").html(str);

        $(".full-chat .chat-user .chat-row").off("click").on("click", function(){
            var el = $(this);
            if(el.attr("data-added") === "1"){
                return;
            }

            el.find(".add-user").addClass("H");
            el.attr("data-added", "1")
            

            var id = el.attr("data-id")
            chats_.master[id].name

            var h = '<div class="chip"><span class="text-truncate">'+chats_.master[id].name+'</span> <i class="material-icons" data-id="'+id+'">cancel</i></div>'
            $("#editGroup .user-add .user-add-list").append(h);

            $("#editGroup .user-add .user-add-list [data-id="+id+"]").off("click").on("click", function(){
                var p = $(this).attr("data-id");
                var lhsEl = $(".full-chat .chat-user .chat-row[data-id="+p+"] .add-user")
                lhsEl.removeClass("H");
                $(this).parent().remove();
                lhsEl.prop("disabled", false)
                lhsEl.parent().attr("data-added", "0")
            })

        })
    }

    var getRoomsOnly = function(){
        var d = chats_.list.rooms.concat(chats_.list.users);
        var rl = chats_.list.rooms.length
        var str = ""
        for(var i=0; i<d.length; i++){
            //console.log(chats_.master[d[i]])
            if(i < rl){
                str += '<div class="chat-row" data-id="'+d[i]+'" data-type="room">'
            }else{
                str += '<div class="chat-row H" data-id="'+d[i]+'"  data-type="user" data-added="0">'
            }
            
            str += '<i class="material-icons">account_circle</i>'
            str += '<div class="chat-name text-truncate">'+ chats_.master[d[i]].name+'</div>'
            
            //Unread chat
            //console.log(d[i])
            //debugger
            l = chats_.messages[d[i]].newMessage.length
            h = "" //l === 0 ? " H" : " l"
            str += '<div class="chat-date H'+h+' ">'
            //str += '10:30 AM '
            str += '<span>'
            str += l
            str += '</span>'
            str += '</div>'

            //Add User to the group
            if(i >= rl){
                str += '<div class="add-user">'
                str += '<svg xmlns="http://www.w3.org/2000/svg" width="30.013" height="18.013" viewBox="0 0 30.013 18.013"><defs><style>.a{fill:#138329;}</style></defs><path d="M16.881,13.506a4.5,4.5,0,1,0-4.5-4.5A4.516,4.516,0,0,0,16.881,13.506Zm0,2.252c-2.983,0-9.006,1.52-9.006,4.5v2.252H25.888V20.261C25.888,17.278,19.865,15.758,16.881,15.758Z" transform="translate(4.125 -4.5)"/><path d="M9.218,3.375a5.843,5.843,0,1,0,5.843,5.843A5.843,5.843,0,0,0,9.218,3.375Zm3.006,6.433H9.808v2.416H8.628V9.808H6.212V8.628H8.628V6.212h1.18V8.628h2.416Z" transform="translate(-3.375 -3.375)"/></svg>'
                str += '</div>'
            }
            
            str += '</div>'
        }
        $(".full-chat .chat-user").html(str);

        $(".full-chat .chat-user .chat-row[data-type=room]").off("click").on("click", function(){
            var el = $(this);
            if(el.attr("data-added") === "1"){
                return;
            }

            el.find(".add-user").addClass("H");
            el.attr("data-added", "1")
            
            //HIDE and Disable elements added in the group
            $(".full-chat .chat-user .chat-row[data-type=user]").removeClass("H")
            
            // var id = el.attr("data-id")
            // chats_.master[id].name

            // var h = '<div class="chip"><span class="text-truncate">'+chats_.master[id].name+'</span> <i class="material-icons" data-id="'+id+'">cancel</i></div>'
            // $("#editGroup .user-add .user-add-list").append(h);

            // $("#editGroup .user-add .user-add-list [data-id="+id+"]").off("click").on("click", function(){
            //     var p = $(this).attr("data-id");
            //     var lhsEl = $(".full-chat .chat-user .chat-row[data-id="+p+"] .add-user")
            //     lhsEl.removeClass("H");
            //     $(this).parent().remove();
            //     lhsEl.prop("disabled", false)
            //     lhsEl.parent().attr("data-added", "0")
            // })

        })

        $(".full-chat .chat-user .chat-row[data-type=user]").off("click").on("click", function(){
            var el = $(this)
            var id = el.attr("data-id")
            chats_.master[id].name

             var h = '<div class="chip"><span class="text-truncate">'+chats_.master[id].name+'</span> <i class="material-icons" data-id="'+id+'">cancel</i></div>'
             $("#editGroup .user-add .user-add-list").append(h);

            el.find(".add-user").addClass("H");
            el.attr("data-added", "1")

            $("#editGroup .user-add .user-add-list [data-id="+id+"]").off("click").on("click", function(){
                var p = $(this).attr("data-id");
                var lhsEl = $(".full-chat .chat-user .chat-row[data-id="+p+"] .add-user")
                lhsEl.removeClass("H");
                $(this).parent().remove();
                lhsEl.prop("disabled", false)
                lhsEl.parent().attr("data-added", "0")
            })
        })
    }
    
    var addToMessage = function(_id){
        var ch = chats_.master[_id];
        var adm = false;
        if(ch.type === "room"){
            if(ch.admin[0] === _id){
                adm = true
            }
        }

        if(rhsDisplay_ === _id){
            var str = ""
            //appedn the div
            if(adm){
                if(admin_){
                    str = chatAdmin({name:chats_.master[_id].name, msg:chats_.messages[_id].newMessage[0]})
                }else{
                    str = chatSelf({name:chats_.master[_id].name, msg:chats_.messages[_id].newMessage[0]})
                }
            }else{
                str = chatSelf({name:chats_.master[_id].name, msg:chats_.messages[_id].newMessage[0]})
            }
            $("#chatBox .chat-messages").append(str);
            $('#chatBox .chat-messages').scrollTop($('#chatBox .chat-messages')[0].scrollHeight);
        }else{
            //increament the count LHS
        }
    }


    var genRHSMsg = function(_id, _for){
        rhsDisplay_ = _id
        var o;
       // var s = EventStore.getUser().uuid;
        var a = chats_.messages[_id].archieved.concat(chats_.messages[_id].newMessage)
        var str = ""
        $("#chatBox .chat-messages").html(str);
        for(var i=0; i<a.length; i++){
            o = chats_.master[a[i].sender];
            if(o.type === "room"){
                if(o.admin[0] === a[i].sender){
                    if(a[i].sender === uuid_){
                        // I am the admin 
                        str += chatAdmin({name:o.name, msg:a[i].msg, for:_for})
                    }else{
                        //othe user is the admin
                        str += chatAdmin({name:o.name, msg:a[i].msg, for:_for})
                    }
                }else{
                    // User
                    str += chatSelf({name:o.name, msg:a[i].msg, for:_for})
                }
            }else{
                // General user
                //str += chatOthers({name:o.name, msg:a[i].msg})
              
                if(a[i].sender === uuid_){
                    str += chatSelf({name:o.name, msg:a[i].msg, for:_for})
                }else{
                    str += chatOthers({name:o.name, msg:a[i].msg, for:_for})
                }
            }
           
        }
        return str;
        //$("#chatBox .chat-messages").html(str);
       // $('#chatBox .chat-messages').scrollTop($('#chatBox .chat-messages')[0].scrollHeight);
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
                                '<div id="dummybtn" style="display:none;"><button onclick="">Edit</button><button>Create</button></div>'+   



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
            '                <input type="text" id="chatInputMsgMax" name="" placeholder="Type your message here">'+
            '                <button class="chat-button" id="chatSendMsgMax" type="button">Send <i class="material-icons">send</i></button>'+
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
        '                    <input type="text" id="chatInputMsgMin"" name="" placeholder="Type your message here">'+
        '                    <button class="chat-button" type="button" id="chatSendMsgMin">Send <i class="material-icons">send</i></button>'+
        '                </div>';

        return myvar


    }
	return {
		init: init,
        openSingleWindow:openSingleWindow
	}
})();