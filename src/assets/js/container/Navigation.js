var Navigation = function () {
	var pRenderer_, store_;


	var init = function(pgr, _data){
		pRenderer_ = pgr;
		store_ = _data;
		nav_ = store_.getNavigation();

		populateNav()
	}

	var populateNav = function(){
		var it = nav_.item;
		var str = "";
		for(var i=0; i<it.length; i++){
			str += '<a  data-id='+i+'>'
			str += '<i class="material-icons">'+it[i].icon+'</i>'
			str += it[i].label
			str += '</a>'
		}
		$(".footerNav").html(str);
		$(".footerNav a").off("click").on("click", function(){
			var ind = parseInt($(this).attr("data-id"))
			var t = nav_.item[ind]

			if(t.action_link !== ""){
				if(t.action_type === "internal_popup"){
					pRenderer_.modalOnLoad(t);
				}else if(t.action_type === "internal_page"){
					pRenderer_.renderPage(store_.getPageData(t.action_link));
				}
			}

		})
	}

	return {
		init:init
		
	}
};
 