var VideoComponent = function(){
	var pRenderer_, callback_, playerLoad_, player_ = false, containerId_;
	
	
    
    var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
  //       playerLoad_ = false;
		// initUI();
	}

	var renderVideo = function(cont, obj){
		//$(cont).html(getHtml());3

        containerId_ = "playerContainer_"+obj.videoid
        var vcon = {}
        vcon.videoid = obj.videoid;
        vcon.autoplay = obj.autoplay
        vcon.muted = obj.muted

        

        var h = obj.pos && obj.pos === "wall" ? "100%" : "400px;"
		
        $(cont).html('');
        setTimeout(function(){
            $(cont).html('<div id="'+containerId_+'" style="width:100%;height:'+h+'"></div>');  
            addVideo(vcon)
        }, 100)
	
		
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
           console.log("exis")
            player_.destroy()
            player_ = new SlikePlayer(slikeConfig);
            player_.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
                console.log('player error', data);
            });
        }else{
            loadPlayer(slikeConfig)
            
        }
    
    /*spl.load(slikeConfig, function (sdkLoadStatus, config) {
        if (sdkLoadStatus) {

          console.log(config, "------------------------")
          
          // var tmp = new SlikePlayer(config);
          // tmp.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
          //   console.log('player error', data);
          // });

          player_ = true;

          window.player = new SlikePlayer(config);
          window.player.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
            console.log('player error', data);
          });
          

          //SlikePlayer


          // window.player.on(SlikePlayer.Events.STREAM_STATUS, function (eventName, data) {
          //   console.log("PLAYR")
          //   if (data.evtStatus == -1) {
          //     var output = "NOT_STARTED";
          //     console.log('stream status', output);
          //   } else if (data.evtStatus == 0) {
          //     var output = "ENDED";
          //     console.log('stream status', output);
          //   } else if (data.evtStatus == 2) {
          //     var output = "PAUSED";
          //     console.log('stream status', output);
          //   }
          // });
        }
      });*/
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

  var getHtml = function(_o){}
	var initUI = function(){}



	return {
		init: init,
		renderVideo: renderVideo
	}
}