var EventStore = (function(){
	var strJson, store_ = {};

	

	var parseMaster = function(_o){
		strJson = JSON.stringify(_o);
		if(_o.error){
			return {suc:false, msg:"Error key false"};
		}else{
			var _t = _o.events;
			//store_['user'] = "";
			store_['pages'] = _t.pages;
			store_['actPage'] = _t.homepage;
			store_['navigation'] = _t.navigation;
			store_["userProfile"] = "";

			return {suc:true, msg:"Success", actPage: _t.homepage};
		}
	}

	var setUser = function(_d){
		store_["user"] = "";
		if(_d && !_d.error){
			store_['user'] = _d;
		}
	}

	var getUser = function(){
		return store_.user.user;
	}

	var setUserProfile = function(_d){

		if(_d && !_d.error){
			store_.userProfile = _d.data;
		}
	}

	var getUserProfile = function(){
		return store_.userProfile;
	}

	var updateUserProfile = function(_o){

		var d = store_.userProfile
		d.firstname = _o.firstname
		d.lastname = _o.lastname
		d.jobtitle = _o.jobtitle
		d.companyname = _o.companyname
		d.phone = _o.phone

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
			store_,actPage = _key;
			return oT[0]
		}
		return "";
	}

	var getNavigation = function(){
		return store_.navigation
	}

	var setActivePage = function(id){
		store_,actPage = id;
	}

	var getActivePage = function(id){
		return store_,actPage;
	}




	return {
		getStore:getStore,
		setStore:setStore,
		parseMaster:parseMaster,
		getPageData:getPageData,
		getNavigation:getNavigation,
		setUser:setUser,
		getUser:getUser,
		setUserProfile:setUserProfile,
		getUserProfile:getUserProfile,
		setActivePage:setActivePage,
		getActivePage:getActivePage,
		updateUserProfile:updateUserProfile
	}
})();