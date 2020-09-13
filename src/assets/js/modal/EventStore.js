var EventStore = function(){
	var strJson, store_ = {};
	

	var parseMaster = function(_o){
		
		strJson = JSON.stringify(_o);
		if(_o.error){
			return {suc:false, msg:"Error key false"};
		}else{
			var _t = _o.events;
			store_['user'] = "";
			store_['pages'] = _t.pages;
			store_['actPage'] = _t.homepage;

			return {suc:true, msg:"Success", actPage: _t.homepage};
		}
		
	}

	
	var setStore = function(payload){
		switch(playload.type){
			case "master":
			break
		}
	}

	var getStore = function(type){
		return store_;
		// var t = store_;
		// if(!!type){

		// }
		// return t;
	}

	var getPageData = function(_key){
		var oT = store_.pages.filter(item => {
			return item.id === _key
		})
		

		if(oT.length){
			return oT[0]
		}
		return "";
	}


	return {
		getStore:getStore,
		setStore:setStore,
		parseMaster:parseMaster,
		getPageData:getPageData
	}
}