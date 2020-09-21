
var ImageContainer = function(){
	
	var init = function(){}

	var renderImage = function(cont, obj){
		$(cont).html('');
	      $(cont).html(getHtml(obj.url));  
	}

	var getHtml = function(url){
		return '<img src="'+url+'" style="width:100%;height:'+$("#modalinsidebody").height()+'px;">'
	}

	

	var initUI = function(){
	}


	return {
		init: init,
		renderImage: renderImage
	}
}


