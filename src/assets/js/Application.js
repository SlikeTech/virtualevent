 var Application = function(){
 	var util_, store_, pRenderer_, router_;
 	var login_, preloader;


 	var init = function(){
 		uiELements();
 		store_ =  new EventStore();
 		pRenderer_ = new PageRenderer();
 		pRenderer_.init(this, pRenderCallback.bind(this));
 		router_ = new Router();
 	}

 	var loginClicked = function(_url){
 		 $("#loginEl").hide()
         $(".wrapper").show()
 		Utility.loader({url: _url, cb:mJsonLoaded.bind(this)});
 	}

 	var mJsonLoaded = function(_d){
 		login_.hide();
 		if(_d.data){
	 		var g = store_.parseMaster(_d.data);
	 		if(g.suc){
	 			pRenderer_.renderPage(store_.getPageData(g.actPage));
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
 		login_ = $("#login");
 	}

 	return {
 		init:init,
 		loginClicked:loginClicked
 	}
 }
 