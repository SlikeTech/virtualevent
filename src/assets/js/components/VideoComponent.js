var VideoComponent = function(){
	var pRenderer_, callback_;
	
	var init = function(_ref, _cb){
		controller_ = _ref;
		callback_ = _cb;
		initUI();
	}

	var renderVideo = function(cont, obj){
		//$(cont).html(getHtml());3

		//console.log(obj.videodetailo)
		
		$(cont).html('');
    setTimeout(function(){
      $(cont).html('<div id="playerContainer" style="width:100%;height:400px;"></div>');  
      addVideo(obj)
    }, 300)
		
		
	}

	var addVideo = function(obj){
    var slikeConfig = {
      apiKey: "test403web5a8sg6o9ug", 
      env: "prod",
      contEl: 'playerContainer',
      version: "",
      video: {
        id: obj.videoid
      },
      player: {
        autoPlay: true,
        mute: true,
        skipAd: true
      },
      live: {
        lowLatency: true,
        loadDVR: false
      },
      callbacks:{}
        };
    
    spl.load(slikeConfig, function (sdkLoadStatus, config) {
        if (sdkLoadStatus) {
          window.player = new SlikePlayer(config);
          window.player.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
            console.log('player error', data);
          });
          
          window.player.on(SlikePlayer.Events.STREAM_STATUS, function (eventName, data) {
            if (data.evtStatus == -1) {
              var output = "NOT_STARTED";
              console.log('stream status', output);
            } else if (data.evtStatus == 0) {
              var output = "ENDED";
              console.log('stream status', output);
            } else if (data.evtStatus == 2) {
              var output = "PAUSED";
              console.log('stream status', output);
            }
          });
        }
      });
  }

  var getHtml = function(_o){}
	var initUI = function(){}


	return {
		init: init,
		renderVideo: renderVideo
	}
}