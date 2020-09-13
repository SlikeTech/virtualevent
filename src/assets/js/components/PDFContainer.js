
var PDFComponent = function(){
	
	var init = function(){}

	var renderPDF = function(){
		$(".modal-body.p1").html(getHtml());
	}

	var getHtml = function(_o){
		return '<iframe src="http://localhost/test.pdf" style="width:100%; height:100%;"">'
				//}els
	}

	

	var initUI = function(){
		// bgContainer = $("#bodyBg");
		// floterLeft = $("#floatLeft")
		// floaterRight = $("#floatRight")
	}




	return {
		init: init,
		renderPDF: renderPDF
	}
}


