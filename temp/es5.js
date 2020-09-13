"use strict";

var Application = function Application() {
  var util_, store_, pRenderer_, router_;
  var login_, preloader;

  var init = function init() {
    uiELements();
    store_ = new EventStore();
    pRenderer_ = new PageRenderer();
    pRenderer_.init(this, pRenderCallback.bind(this));
    router_ = new Router();
  };

  var loginClicked = function loginClicked() {
    $("#loginEl").hide();
    $(".wrapper").show();
    Utility.loader({
      url: "events.json?id=f5n9o69lkl",
      cb: mJsonLoaded.bind(this)
    });
  };

  var mJsonLoaded = function mJsonLoaded(_d) {
    login_.hide();

    if (_d.data) {
      var g = store_.parseMaster(_d.data);

      if (g.suc) {
        pRenderer_.renderPage(store_.getPageData(g.actPage));
        router_.init(this, browserCallback.bind(this));
        window.location.hash = g.actPage;
      } else {
        alert("Error");
      }
    } else {
      alert("Master JSON Not Loaded");
    }
  };

  var pRenderCallback = function pRenderCallback(_key, _brow) {
    if (!_brow) {
      window.location.hash = _key;
    }

    pRenderer_.renderPage(store_.getPageData(_key)); //debugger
  };

  var browserCallback = function browserCallback(_key) {
    console.log("BROWSEE BUTTON"); // if(_key != "")
    // pRenderCallback(_key.substr(1), true)
  };

  var uiELements = function uiELements() {
    login_ = $("#login");
  };

  return {
    init: init,
    loginClicked: loginClicked
  };
};

var ModalComponent = function ModalComponent() {
  var pRenderer_, callback_, objActModal;
  var uiModal_, uiModTitle_, uiModBody_;
  var mData, videoPlayer_, pdfContainer_;
  var modelFor_;

  var init = function init(_ref, _cb) {
    controller_ = _ref;
    callback_ = _cb;
    videoComponent_ = new VideoComponent();
    videoComponent_.init(this, videoCallback_.bind(this));
    pdfContainer_ = new PDFComponent();
    initUI();
  };

  var renderModal = function renderModal(_o) {
    $(".modal-body.p0").html("");
    objActModal_ = _o;
    uiModTitle_.html(_o.title);

    if (_o.popup_type === "player") {
      modelFor_ = "player";
      videoComponent_.renderVideo($(".modal-body.p0")[0], {
        videoid: _o.action_link
      });
    } else {
      modelFor_ = "others";
      Utility.loader({
        url: _o.action_link,
        cb: mDataLoaded.bind(this)
      });
    }
  };

  var mDataLoaded = function mDataLoaded(_o) {
    mData = _o.data; //$(".modal-body.p0").html(card_ava_label(_o.data))
    //$(".modal-body.p0").html(ivid_iplay_label(_o.data))

    getHtml(_o.data); //debugger
  };

  var getHtml = function getHtml(_o) {
    var s,
        t = _o.template;

    switch (t) {
      case "poll":
        polls();
        break;

      case "staticpage":
        qna();
        break;

      case "agenda":
        agenda();
        break;

      case "playlist":
        playlist();
        break;

      case "resources":
        resources();
        break;

      case "businesscard":
        //bcard()
        break;

      case "chatbox":
        //checkBox()
        break;
    }
  };

  var polls = function polls() {
    mData.body[0].questions = JSON.parse(mData.body[0].questions);
    var q = mData.body[0].questions;
    var str = '<div class="feedback"><ul>';

    for (var i = 0; i < q.length; i++) {
      str += '<li><p>' + q[i].title + '</p>';
      var qa = q[i].answers;

      for (var j = 0; j < qa.length; j++) {
        str += '<div class="form-check">';

        if (q[i].type === "radiobutton") {
          str += '<input class="form-check-input" type="radio" name="qa' + i + '" value="' + qa[j] + '">';
          str += '<label class="form-check-label" for="exampleRadios1">' + qa[j] + '</label>';
        } else if (q[i].type === "checkbox") {
          str += '<input type="checkbox" class="form-check-input" name="qa' + i + '" value="' + qa[j] + '" data-id=q_' + i + ' checked>';
          str += '<label class="form-check-label" for="exampleCheck1">' + qa[j] + '</label>';
        }

        str += '</div>';
      }

      if (q[i].type === "star") {
        str += '<div class="rating">';

        for (var m = 1; m < 6; m++) {
          str += '<input type="radio" name="rating" value="' + (6 - m) + '"  id="' + (6 - m) + '"><label for="' + (6 - m) + '"></label>';
        }

        str += '</div>';
      } else if (q[i].type === "textarea") {
        str += '<div class="form-group">';
        str += '<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea></div>';
      }

      str += '</li>';
    }

    str += '</ul><button id="postData" class="btn login_btn float-right mt-3">Submit</button></div>';
    $(".modal-body.p0").html(str);
    $("#postData").off("click").on("click", function (e) {
      var ans = mData.body[0].questions;
      var t;

      for (var i = 0; i < ans.length; i++) {
        if (ans[i].type === "checkbox") {
          var tv = [];
          $(".modal-body.p0 [name=qa" + i + "]:checked").each(function (i, j) {
            tv.push($(j).val());
          });
          ans[i]["user_answer"] = tv;
        } else if (ans[i].type === "radiobutton") {
          t = $(".modal-body.p0 [name=qa" + i + "]:checked").val();

          if (t !== undefined) {
            ans[i]["user_answer"] = [t];
          } else {
            ans[i]["user_answer"] = [];
          }
        } else if (ans[i].type === "star") {
          t = $(".modal-body.p0 [name=rating]:checked").val();

          if (t !== undefined) {
            ans[i]["user_answer"] = [t];
          } else {
            ans[i]["user_answer"] = [];
          }
        } else if (ans[i].type === "textarea") {
          ans[i]["user_answer"] = $(".modal-body.p0 textarea").val();
        } //console.log(mData.body[0].questions[i].user_answer)

      } //debugger


      console.log(mData);
      var objPost = {
        url: objActModal_.action_link,
        data: JSON.stringify(mData),
        type: "POST",
        cb: dataPosted.bind(this)
      };
      Utility.loader(objPost);
    });
  };

  var qna = function qna() {
    var tm = mData.body[0].data;
    $(".modal-body.p0").html(mData.body[0].data);
  };

  var agenda = function agenda() {
    var agen = mData.body[0].slot_data;
    var dis;
    var str = '<div class="agenda"><ul class="list-group">';

    for (var i = 0; i < agen.length; i++) {
      dis = "disableIcon";
      str += '<li class="list-group-item"><div class="row">';

      if (agen[i].status == 0) {
        //live
        str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm liveBtn">LIVE</button></div>';
      } else if (agen[i].status == 1) {
        //upcm
        str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm upcomingBtn">Upcoming</button></div>';
      } else if (agen[i].status == 2) {
        //ended
        dis = "";
        str += '<div class="col-md-2"><button type="button" class="btn btn-secondary btn-sm completeBtn">Completed</button></div>';
      }

      var tm = agen[i].speakers;
      str += '<div class="col-md-5"><b class="db">Welcome Address</b>';
      var s = "";

      for (var j = 0; j < tm.length; j++) {
        str += tm[j].name + ", " + tm[j].company;

        if (j + 1 < tm.length) {
          str += ' | ';
        } //console.log(s)

      }

      str += '</div>'; //breiefcase

      str += '<div class="col-md-2"><a href="#" class="iconSVG ' + dis + '"><img src="images/briefcase.svg" alt=""></a></div>'; //closur li

      str += '</div></li>';
    } //closure ul


    str += '</ul></div>';
    $(".modal-body.p0").html(str);
  };

  var resources = function resources() {
    var tm = mData.body;
    var str = '<div class="resources"><ul class="list-group">';

    for (var i = 0; i < tm.length; i++) {
      str += '<li class="list-group-item"><div class="row">';

      if (tm[i].type === "live") {
        str += '<div data-id="' + tm[i].uuid + '" class="col-md-3">';
        str += '<a href="#" class="material-icons">videocam</a>';
      } else {
        str += '<div class="col-md-3">';
        str += '<a href="#" class="material-icons mr-3">note</a>';
      }

      str += '<button type="button" class="btn btn-secondary btn-sm">View</button>';
      str += '</div>';
      str += '<div class="col-md-7">power-your-business-transformation-with-edc</div>'; //briefcase

      str += '<div class="col-md-2">';
      str += '<a href="#" class="material-icons">card_travel</a>';
      str += '</div>';
    }

    $(".modal-body.p0").html(str);
    $(".modal-body.p0 li a").off("click").on("click", function () {
      getComponentData($(this).parent().attr("data-id"), tm);
    });
    $(".modal-body.p0 li button").off("click").on("click", function () {
      getComponentData($(this).parent().attr("data-id"), tm);
    });
  };

  var playlist = function playlist() {
    //var tm = mData.body;
    var tm = JSON.parse(mData.body[0].playlistsource);
    var str = '<ul class="list-group">';

    for (var i = 0; i < tm.length; i++) {
      //str += '<li class="list-group-item"><div class="row"><div data-id="'+tm[i].uuid+'" class="col-md-2">'
      //	str += '<a href="#" class="material-icons">videocam</a>' //anchor
      str += '<li class="list-group-item"><div class="row"><div data-id="' + tm[i].videoid + '" class="col-md-2"><a href="#" class="material-icons">videocam</a></div><div  data-id="' + tm[i].videoid + '" class="col-md-2"><button type="button" class="btn btn-secondary btn-sm">PLAY</button></div><div class="col-md-8">' + tm[i].description + '</div></div></li>';
    }

    str += '</ul>';
    $(".modal-body.p0").html(str);
    $(".modal-body.p0 li a").off("click").on("click", function () {
      //debugger
      renderVideo($(this).parent().attr("data-id"), tm);
    });
    $(".modal-body.p0 li button").off("click").on("click", function () {
      renderVideo($(this).parent().attr("data-id"), tm); //debugger
    });
  };

  var getComponentData = function getComponentData(id, arr) {
    var t = arr.filter(function (it) {
      return it.uuid === id;
    });

    if (t[0].type === "live") {
      var ot = {
        videoid: t[0].resource,
        description: t[0].description,
        title: t[0].title
      };
      videoComponent_.renderVideo($(".modal-body.p1")[0], ot); //$("#exampleModal").modal("hide");

      $("#exampleModal2").modal("show");
    } else if (t[0].resourcetype === "pdf") {
      pdfContainer_.renderPDF(t[0]);
      $("#exampleModal").modal("hide");
      $("#exampleModal2").modal("show");
    } else if (t[0].resourcetype === "doc") {} else if (t[0].resourcetype === "image") {}
  };

  var renderVideo = function renderVideo(_id, arr) {
    var t = arr.filter(function (it) {
      return it.videoid === _id;
    });
    videoComponent_.renderVideo($(".modal-body.p1")[0], t[0]);
    $("#exampleModal").modal("hide");
    $("#exampleModal2").modal("show");
  };

  var dataPosted = function dataPosted(_data) {
    console.log("hiiiiiiiiiiiiiiiiiii");
    debugger;
  };

  var videoCallback_ = function videoCallback_() {
    debugger;
  };

  var initUI = function initUI() {
    uiModal_ = $("#exampleModal");
    uiModTitle_ = $("#exampleModalLabel");
    ;
    uiModBody_ = $("#exampleModal .modal-body");
    $("#exampleModal2").on('hidden.bs.modal', function () {
      $("#exampleModal2 .modal-body").html("");
      $("#exampleModal").modal("show");
    });
    $("#exampleModal").on('hidden.bs.modal', function () {
      if (modelFor_ === "player") {
        $("#exampleModal .modal-body").html("");
      }
    });
  };

  return {
    init: init,
    renderModal: renderModal
  };
};

var PDFComponent = function PDFComponent() {
  var init = function init() {};

  var renderPDF = function renderPDF() {
    $(".modal-body.p1").html(getHtml());
  };

  var getHtml = function getHtml(_o) {
    return '<iframe src="http://localhost/test.pdf" style="width:100%; height:100%;"">'; //}els
  };

  var initUI = function initUI() {// bgContainer = $("#bodyBg");
    // floterLeft = $("#floatLeft")
    // floaterRight = $("#floatRight")
  };

  return {
    init: init,
    renderPDF: renderPDF
  };
};

var VideoComponent = function VideoComponent() {
  var pRenderer_, callback_;

  var init = function init(_ref, _cb) {
    controller_ = _ref;
    callback_ = _cb;
    initUI();
  };

  var renderVideo = function renderVideo(cont, obj) {
    //$(cont).html(getHtml());3
    //console.log(obj.videodetailo)
    $(cont).html('');
    $(cont).html('<div id="playerContainer" style="width:100%;height:400px;"></div>');
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
      callbacks: {}
    };
    spl.load(slikeConfig, function (sdkLoadStatus, config) {
      if (sdkLoadStatus) {
        window.player = new SlikePlayer(config);
        console.log(SlikePlayer);
        window.player.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
          console.log('player error', data);
        });
        window.player.on(SlikePlayer.Events.STREAM_STATUS, function (eventName, data) {
          console.log("ssssssssssssssssssssssssss");

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
        }); // window.player.on(SlikePlayer.Events.CUE_POINT_RECEIVED, function (eventName, data) {
        //   var output = JSON.stringify(data);
        //   console.log('cue point received', output);
        // });
      }
    });
  };

  var getHtml = function getHtml(_o) {//return '<iframe id="video_player" class="badge-youtube-player iframe-slike" frameborder="0" allowfullscreen="" src="https://www.indiatimes.com/video_player/1xpyabxk6l?autoplay=1poster_image=https://im.indiatimes.in%2Fcontent%2F2020%2FAug%2FNew-Project-1-50_5f4bb7ef704e2.jpg" style="width: 100%; height: 100%;"></iframe>'
    //}els
  };

  var initUI = function initUI() {// bgContainer = $("#bodyBg");
    // floterLeft = $("#floatLeft")
    // floaterRight = $("#floatRight")
  };

  function init1() {
    var playerContainer = document.getElementById('playerContainer');
    var ui = "slike";

    if (ui === 'slike' || ui === 'podcast' || ui === 'headless' || ui === 'native') {
      console.log("hi");
      document.getElementById('playerContainer').classList.add("playerContainer");
    } else {
      debugger;
      document.getElementById('playerContainer').classList.add("playerContainer");
      ui = 'slike';
    }

    var slikeConfig = {
      apiKey: "test403web5a8sg6o9ug",
      env: "prod",
      contEl: 'playerContainer',
      version: "",
      video: {
        id: "1x1bemyglo"
      },
      controls: {},
      player: {
        autoPlay: true,
        mute: false,
        skipAd: true,
        playlistUrl: '//videoplayer.indiatimes.com/dev/playlistcallback.js'
      },
      live: {
        lowLatency: true,
        loadDVR: false
      },
      callbacks: {}
    };
    spl.load(slikeConfig, function (sdkLoadStatus, config) {
      if (sdkLoadStatus) {
        window.player = new SlikePlayer(config);
        window.player.on(SlikePlayer.Events.PLAYER_ERROR, function (eventName, data) {
          console.log('player error', data);
        }); // if (ui === 'headless') {
        //   window.player.on(SlikePlayer.Events.VIDEO_STARTED, function (eventName, data) {
        //     var playerContainer = document.getElementById('playerContainer');
        //     var unmute = document.createElement("btn");
        //     var play = document.createElement("btn");
        //     unmute.innerHTML = "     Unmute    ";
        //     play.innerHTML = "     Play      ";
        //     playerContainer.insertBefore(unmute, playerContainer.childNodes[0]);
        //     playerContainer.insertBefore(play, playerContainer.childNodes[0]);
        //     unmute.addEventListener('click', function (event) {
        //       window.player.bpl.unMute();
        //     });
        //     play.addEventListener('click', function (event) {
        //       window.player.bpl.play();
        //     });
        //   });
        // }

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
        window.player.on(SlikePlayer.Events.CUE_POINT_RECEIVED, function (eventName, data) {
          var output = JSON.stringify(data);
          console.log('cue point received', output);
        });
      }
    });
  } //init1();


  return {
    init: init,
    renderVideo: renderVideo
  };
};

var PageRenderer = function PageRenderer() {
  var controller_, callback_, videoComponent_, modalContent_, bgContainer, floterLeft, floterRight, objActive;
  var animVideo, animVidContainer;

  var init = function init(_ref, _cb) {
    controller_ = _ref;
    callback_ = _cb;
    videoComponent_ = new VideoComponent();
    videoComponent_.init(this, videoCallback_.bind(this));
    modalContent_ = new ModalComponent();
    modalContent_.init(this, modalCallback_.bind(this));
    initUI();
  };

  var renderPage = function renderPage(obj) {
    objActive = obj;

    if (!obj.width) {
      var img = new Image();
      img.src = obj.image;

      img.onload = function () {
        obj['width'] = img.width;
        obj['height'] = img.height;
        getComponents(obj);
      };
    } else {
      getComponents(obj);
    }
  };

  var getComponents = function getComponents(_o) {
    var strHotspot = "";
    var strFloaterLeft = "";
    var strFloaterRight = "";
    var l, t, h, g, c, tp;
    strHotspot += '<img src="' + _o.image + '" alt="">';

    for (var i = 0; i < _o.componants.length; i++) {
      if (_o.componants[i].type == "hotspot" || _o.componants[i].type == "video" || _o.componants[i].type === "help_box" || _o.componants[i].type === "text" || _o.componants[i].type === "banner") {
        if (_o.componants[i].shape_type === "rect") {
          if (!_o.componants[i].coor) {
            c = _o.componants[i].coordinate.split(",");
            l = Math.round(parseInt(c[0]) * 100 / _o.width);
            t = Math.round(parseInt(c[1]) * 100 / _o.height);
            w = Math.round((parseInt(c[2]) - parseInt(c[0])) * 100 / _o.width);
            h = Math.round((parseInt(c[3]) - parseInt(c[1])) * 100 / _o.height);
            _o.componants[i]['coor'] = {
              left: l,
              top: t,
              width: w,
              height: h
            };
          }

          strHotspot += '<div class="anchorUI" style="left: ' + _o.componants[i].coor.left + '%; top: ' + _o.componants[i].coor.top + '%; width: ' + _o.componants[i].coor.width + '%; height: ' + _o.componants[i].coor.height + '%;background:rgba(0, 0, 255, 0.8);" data-id=' + i + '><div class="anchorWrapper"><span class="helpText">' + _o.componants[i].tooltip + '</span></div></div>';
        }
      } else {
        tp = _o.componants[i].position.split("-")[0];

        if (tp === "left") {
          strFloaterLeft += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="' + i + '">' + _o.componants[i].title + '</button>';
        } else if (tp === "right") {
          strFloaterRight += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-cust="' + i + '">' + _o.componants[i].title + '</button>';
        }
      }
    }

    $(window).scrollTop(0);
    $(".bodyBg").html(strHotspot);
    $("#floatLeft").html(strFloaterLeft);
    $("#floatRight").html(strFloaterRight);
    bindEvents();
  };

  var bindEvents = function bindEvents() {
    $(".bodyBg .anchorUI").off("click").on("click", function () {
      var ind = parseInt($(this).attr("data-id"));
      var oType = objActive.componants[ind];

      if (oType.type === "hotspot" || oType.type === "banner" || oType.type === "text" || oType.type === "help_box") {
        if (oType.action_type === 'internal_popup') {
          $("#exampleModal").modal("show");
          console.log("POPUP");
          modalContent_.renderModal(oType);
        } else if (oType.action_type === 'internal_page') {
          console.log("INternal page", oType.action_link);
          callback_(oType.action_link);
        } else if (oType.action_type === 'animatied_navigate') {
          animateVideo(oType);
        } else {
          alert("No Action Type");
        }
      } else if (oType.type === "video") {
        $(this).unbind();
        videoComponent_.renderVideo(this, {
          videoid: oType.action_link
        });
      } else {
        alert("No Type");
      }
    });
    $(".floater [data-toggle='modal']").off("click").on("click", function (e) {
      modalContent_.renderModal(objActive.componants[parseInt($(this).attr("data-cust"))]);
    });

    if (!!objActive.on_load) {
      if (objActive.on_load.action_type !== "none" && objActive.on_load.action_link !== "") {
        $("#exampleModal").modal("show");
        modalContent_.renderModal(objActive.on_load);
      }
    }
  };

  var animateVideo = function animateVideo(_o) {
    animVideo.addEventListener("loadedmetadata", function metadata() {
      //remove preloader
      this.removeEventListener('loadedmetadata', metadata); //animVideo.style.display = "block"

      animVidContainer.show();
      $("body").css("overflow", "hidden");
      $("#vd").show();
      this.play();
      callback_(_o.action_link);
    });
    animVideo.addEventListener("ended", function ended() {
      this.removeEventListener('ended', ended);
      animVideo.src = "";
      animVidContainer.hide();
      $("body").css("overflow", "");
    });
    animVideo.src = _o.videourl;
  };

  var videoCallback_ = function videoCallback_(_d) {
    console.log(_d);
  };

  var modalCallback_ = function modalCallback_(d) {
    console.log(_d);
  };

  var initUI = function initUI() {
    animVideo = $("#vidAnimation")[0];
    animVidContainer = $("#vidContainer"); // bgContainer = $("#bodyBg");
    // floterLeft = $("#floatLeft")
    // floaterRight = $("#floatRight")
  };

  return {
    init: init,
    renderPage: renderPage
  };
};

var EventStore = function EventStore() {
  var strJson,
      store_ = {};

  var parseMaster = function parseMaster(_o) {
    strJson = JSON.stringify(_o);

    if (_o.error) {
      return {
        suc: false,
        msg: "Error key false"
      };
    } else {
      var _t = _o.events;
      store_['user'] = "";
      store_['pages'] = _t.pages;
      store_['actPage'] = _t.homepage;
      return {
        suc: true,
        msg: "Success",
        actPage: _t.homepage
      };
    }
  };

  var setStore = function setStore(payload) {
    switch (playload.type) {
      case "master":
        break;
    }
  };

  var getStore = function getStore(type) {
    return store_; // var t = store_;
    // if(!!type){
    // }
    // return t;
  };

  var getPageData = function getPageData(_key) {
    var oT = store_.pages.filter(function (item) {
      return item.id === _key;
    });

    if (oT.length) {
      return oT[0];
    }

    return "";
  };

  return {
    getStore: getStore,
    setStore: setStore,
    parseMaster: parseMaster,
    getPageData: getPageData
  };
};

var Router = function Router() {
  var controller_, callback_;

  var init = function init(_ref, _cb) {
    controller_ = _ref;
    callback_ = _cb;
    addHashListeners();
  };

  var detectBackOrForward = function detectBackOrForward(onBack, onForward) {
    var hashHistory = [window.location.hash];
    var historyLength = window.history.length;
    return function () {
      var hash = window.location.hash,
          length = window.history.length;

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
    };
  };

  var addHashListeners = function addHashListeners() {
    window.addEventListener("hashchange", detectBackOrForward(function () {
      console.log("back", window.location.hash);
      callback_(window.location.hash);
    }, function () {
      console.log("forward", window.location.hash);
      callback_(window.location.hash);
    }));
  };

  return {
    init: init
  };
};

var Utility = function () {
  var floader = function floader() {
    var arrLoadQueue = [];

    var load = function load(obj) {
      arrLoadQueue.push(obj);

      if (arrLoadQueue.length == 1) {
        initiateLoad();
      }
    };

    var initiateLoad = function initiateLoad() {
      console.log("Load Class");
      $("#preloader").removeClass("H");

      if (arrLoadQueue[0].url == null) {} else {
        loadExternalData(arrLoadQueue[0]);
      }
    };

    var loadSuccess = function loadSuccess(data) {
      console.log("Remove Class 1");
      $("#preloader").addClass("H");
      arrLoadQueue[0].cb({
        "data": data
      });
      searchQueue();
    };

    var loadError = function loadError(rs) {
      console.log("Remove Class 2");
      $("#preloader").addClass("H");
      var obj = {
        "Status": rs
      };
      arrLoadQueue[0].cb({
        "data": null
      });
      searchQueue();
    };

    var searchQueue = function searchQueue() {
      if (arrLoadQueue.length != 0) {
        arrLoadQueue.splice(0, 1);
      }

      if (arrLoadQueue.length > 0) {
        initiateLoad();
      }
    };

    var loadExternalData = function loadExternalData(obj) {
      //console.log(obj)
      var o = {};
      o.url = "http://172.29.72.27:7015/" + obj.url;

      if (obj.type && obj.type === "POST") {
        o.type = "POST";
        o.data = obj.data;
        o.contentType = "text/plain";
        o.datatype = "application/json";
      } else {
        o.type = "GET";
        o.datatype = "application/json";
      }

      o.success = function (_data) {
        loadSuccess(_data);
      };

      o.error = function (a, c, d) {
        loadError(d);
      };

      $.ajax(o); // o.type =  ? "POST" : "GET"
      //  var prop = {
      // 	url: obj.url,
      // 	type: 'GET',  
      // 	contentType: "application/json",  
      // 	success: function (data) {
      // 		loadSuccess(data);
      // 	},
      // 	error:function(a,c, d){
      // 		loadError(d);
      // 	}
      // }
      // $.ajax(prop);
    };

    return {
      load: load
    };
  };

  var loader_ = new floader();

  var loader = function loader(obj) {
    loader_.load(obj);
  };

  var strngReplace = function strngReplace($str, $search, $replace) {
    return $str.split($search).join($replace);
  };

  return {
    loader: loader,
    strngReplace: strngReplace
  };
}();
