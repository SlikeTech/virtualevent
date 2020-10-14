var Login = (function () {
	var c_name = "usermailid";
	var init = function(){
			createCookie(c_name, createUUID())
			return getCookie()

	}

	var createUUID = function(){
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}

	var createCookie = function(name, value, days) {
	    var expires;
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();

	        console.log(expires)
	    }
	    else {
	        expires = "";
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	var getCookie = function() {
	    if (document.cookie.length > 0) {
	    	
	        c_start = document.cookie.indexOf(c_name + "=");

	        if (c_start != -1) {
	            c_start = c_start + c_name.length + 1;
	            c_end = document.cookie.indexOf(";", c_start);
	           
	            if (c_end == -1) {
	                c_end = document.cookie.length;
	            }
	          
	            return unescape(document.cookie.substring(c_start, c_end));
	        }
	    }

	    return "";
	}

	var validateEmail = function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	var deleteCookie = function(){
	    var d = new Date(); 
	    d.setTime(d.getTime() - (1000*60*60*24)); 
	    var expires = "expires=" + d.toGMTString(); 
	    window.document.cookie = c_name+"="+"; "+expires;
	 
	}

	return {
		init:init,
		getCookie:getCookie,
		validateEmail:validateEmail,
		createCookie:createCookie,
		deleteCookie:deleteCookie
	}
})();
 