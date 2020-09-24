var VideoComponent = function(){
	var pRenderer_, callback_, playerLoad_ = false, player_, containerId_;
  var tObj = {};
	
	
    
    var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
  //       playerLoad_ = false;
		// initUI();
	}

	var renderVideo = function(cont, obj){
		//$(cont).html(getHtml());3

        containerId_ = "playerContainer_"+makeid(10) //obj.videoid
        var vcon = {}
        vcon.videoid = obj.videoid;
        vcon.autoplay = obj.autoplay
        vcon.muted = obj.muted

        console.log("joooo  ", obj.pos)

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
           // debugger
           console.log("exit")
            player_.destroy()
            player_ = new SlikePlayer(slikeConfig);
            player_.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
                console.log('player error', data);
            });
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
            console.log('player init`', data);
        });

        player_.on(SlikePlayer.Events.VIDEO_TIMEUPDATE, function (eventName, data) {
            console.log('player ready', data);
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

  var getHtml = function(_o){}
	var initUI = function(){}



	return {
		init: init,
		renderVideo: renderVideo
	}
}