var VideoComponent = function(){
    var pRenderer_, callback_, playerLoad_ = false, player_, containerId_;
    var tObj = {};

    var sT, tCnt, tGap;
    var cont_, timeInterval, tolerence, timeElapsed, simuLive, healthCheck;
    var container, hr_, min_, sec_, vid_, tol_ = 10;
    var objTimeStaus

	
	
    
    var init = function(_ref, _cb){
		controller_ = _ref;
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