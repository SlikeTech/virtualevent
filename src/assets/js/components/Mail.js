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
            $(".email-rhs .chat-messages").html(messags);
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