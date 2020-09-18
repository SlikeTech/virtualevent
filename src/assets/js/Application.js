 var Application = function(){
 	var util_, store_, pRenderer_, router_, nav_;
 	var login_, preloader;
 


 	var init = function(){
 		uiELements();
 		store_ =  new EventStore();
 		pRenderer_ = new PageRenderer();
 		pRenderer_.init(this, pRenderCallback.bind(this));
 		router_ = new Router();

 		nav_ = new Navigation();

 		

 	}



 	var loginClicked = function(_url){
 		 $("#loginEl").hide()
         $(".wrapper").show()
 		
         
   //  	var temail = $("#loginEl .form-control").val();     
   //       if(Login.validateEmail(temail)){
   //       	console.log("corred")
   //       	var eid = getUrlParameter("id")
   //       	var c = Login.init();
   //       	var objPost = {
			// 	url : "login.json",
			// 	data : {email: temail, eventid: eid, uuid: c},
			// 	type :"POST",
			// 	cb :mJsonLoaded.bind(this)
			// }
			
			// //Utility.loader({url: "events.json?id=f5n9o69lkl", cb:mJsonLoaded.bind(this)});
			
         
   //       }else{
   //       	console.log("incorrect login id")
   //       }
		
		Utility.loader({url: eventUrl, cb:mJsonLoaded.bind(this)});
         //debugger

 		//Utility.loader({url: _url, cb:mJsonLoaded.bind(this)});
 	}

 	var mJsonLoaded = function(_d){

 		$("#login").hide();
 		if(_d.data){
	 		var g = store_.parseMaster(_d.data);
	 		if(g.suc){

	 			pRenderer_.renderPage(store_.getPageData(g.actPage));
	 			nav_.init(pRenderer_, store_)

	 			router_.init(this, browserCallback.bind(this));
	 			window.location.hash = g.actPage;
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
 		
 		pRenderer_.renderPage(store_.getPageData(_key));
 		//debugger
 	}

 	var browserCallback = function(_key){
 		console.log("BROWSEE BUTTON")
 		// if(_key != "")
 		// pRenderCallback(_key.substr(1), true)
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
 