
var PDFComponent = function(){
	
	var init = function(){}

	var renderPDF = function(_o){
		$(".modal-body.p1").html("");
		setTimeout(function(){
			$(".modal-body.p1").html(getHtml(_o.url, $(".modal-body.p1").height()));	
		}, 300)
		
	}

	var getHtml = function(url, hgt){
		//<embed src=”/pdf/sample-3pp.pdf#page=2" type=”application/pdf” width=”100%” height=”100%”>
		return '<embed src="'+url+'" type="application/pdf" width="100%" height="'+hgt+'" style="overflow-y: hidden">'
		//return '<iframe src="http://localhost/test.pdf" style="width:100%; height:100%;"">'
				//}els
	}

	

	var initUI = function(){
	}




	return {
		init: init,
		renderPDF: renderPDF
	}
}


