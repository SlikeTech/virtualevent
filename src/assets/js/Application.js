 var Application = function(){
 	var util_, pRenderer_, router_, nav_;
 	var login_, preloader, user_;
 


 	var init = function(){
 		uiELements();

 		pRenderer_ = new PageRenderer();
 		pRenderer_.init(this, pRenderCallback.bind(this));
 		router_ = new Router();

 		nav_ = new Navigation();

 		user_ = new User();



 		

 	}



 	var loginClicked = function(_url){
 		$(this).prop("disabled", true)
    	var temail = $("#loginEl .form-control").val();     

         if(Login.validateEmail(temail)){
         	//var eid = getUrlParameter("id")
         	//var c = Login.init();
         	
         	var formData = new FormData();
			formData.append("email", temail);
			formData.append("eventid", eventId);
			//formData.append("uuid", c);

         	
			/*var h = new Headers();
			h.append("uuid", "sdfjsdjfslkdfjksdl")

			$.ajax({
			  type: "POST",
			  url: "http://172.29.72.27:9017/login.json",
			  data: formData,
			  headers: h,
			  processData:false,
			 contentType: false,
			  success: function(d){
			  	debugger
			  },
			  error:function(){
			  	debugger
			  }
			});*/



         	var objPost = {
				url : "login.json",
				data : formData,
				type :"POST",
				cb :loginSuccess.bind(this)
			}

			Utility.loader(objPost);

         }else{
         	alert("fail")
         	console.log("incorrect login id")
         }
 		
 	}

 	
 	var loginSuccess = function(_d){
 		//EventStore.setUser(_d.data);
 		//Utility.loader({url: "events.json?id="+eventId, cb:mJsonLoaded.bind(this)});
		
		if(_d.data){
			if(_d.data.error){
				alert(_d.data.msg)
			}else{
				EventStore.setUser(_d.data);
 				Utility.loader({url: "events.json?eventid="+eventId, cb:mJsonLoaded.bind(this)});
			}
		}else{
			alert("Invalid Login URL")
		}
 	}

 	var mJsonLoaded = function(_d){
		$("#loginEl").hide();
         $(".wrapper").show();

 		if(_d.data){
	 		var g = EventStore.parseMaster(_d.data);
	 		if(g.suc){
	 			pRenderer_.renderPage(EventStore.getPageData(g.actPage));
	 			nav_.init(pRenderer_, pRenderCallback.bind(this))

	 			router_.init(this, browserCallback.bind(this));
	 			window.location.hash = g.actPage;

	 			
	 			Utility.loader({url: "users/myprofile.json", cb:function(_d){
	 				EventStore.setUserProfile(_d.data);
	 			}});
	 			
	 			user_.init(pRenderer_, pRenderCallback.bind(this));
	 		}else{
	 			alert("Error")
	 		}
 		}else{
 			alert("Master JSON Not Loaded");
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
 		if(_key != ""){
 			//pRenderCallback(_key.substr(1), true)
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
 