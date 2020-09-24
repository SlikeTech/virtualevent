var Utility = (function () {
	var floader = function () {
		var arrLoadQueue = [];
		var load = function(obj){
		  arrLoadQueue.push(obj);
		  if (arrLoadQueue.length == 1){
		      initiateLoad();
		  }
		}

		var initiateLoad = function(){
			//console.log("Load Class")
			$("#preloader").removeClass("H");
		  if (arrLoadQueue[0].url == null){
		  }else{
		      loadExternalData(arrLoadQueue[0]);
		  }
		}

		var loadSuccess = function(data){
			//console.log("SUCCESS    ")
			//console.log("Remove Class 1")
			$("#preloader").addClass("H");
			arrLoadQueue[0].cb({"data":data});
		    searchQueue();
		}

		var loadError = function(rs){
			//console.log("ERROR  ", rs)
			//console.log("Remove Class 2")
			$("#preloader").addClass("H");
		  var obj = {"Status":rs}
		  arrLoadQueue[0].cb({"data":null});
		  searchQueue();
		}

		var searchQueue = function(){
			//console.log("SEAECH", arrLoadQueue)
		  if (arrLoadQueue.length != 0){
		      arrLoadQueue.splice(0,1);
		  }
		  if (arrLoadQueue.length > 0){
		      initiateLoad();
		  }
		}

		var loadExternalData = function(obj){          
		  	
			var o = {};
			o.url = baseUrl+obj.url
			if(obj.type && obj.type === "POST"){
				o.type = "POST";
				o.data = obj.data;

				o.processData = false;
				o.contentType = false;
			}else{
				o.type = "GET";
				o.datatype = "application/json"
			}
			
			
 			//o.headers = { 'eventid': eventId }

			o.success = function(_data){
				loadSuccess(_data);
			}

			o.error = function(a,c, d){
				console.log(a,c,d)
				loadError(d);
			}
			
			$.ajax(o);

		}
		return {
			load:load
		}	
	}

	var loader_ = new floader();
	var loader = function(obj){
		loader_.load(obj)
	}

	var strngReplace = function ($str, $search, $replace) {
        return $str.split($search).join($replace);
    }

    var trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    }


	return {
		loader:loader,
		strngReplace: strngReplace,
		trim: trim
	}
})();
 