var Router = function(){
  var controller_, callback_;
  
  var init = function(_ref, _cb){
    controller_ = _ref;
    callback_ = _cb;
    addHashListeners()
  }

  var detectBackOrForward = function(onBack, onForward) {
        var hashHistory = [window.location.hash];
        var historyLength = window.history.length;

        return function() {
          var hash = window.location.hash, length = window.history.length;
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
        }
      };

      var addHashListeners = function(){
        window.addEventListener("hashchange", detectBackOrForward(
            function() { 

             // console.log("back", window.location.hash)
              callback_(window.location.hash);
            },
            function() { 
             // console.log("forward", window.location.hash)
              callback_(window.location.hash); 
            }
        ));

    }

  

  
  return {
    init: init
  }
}