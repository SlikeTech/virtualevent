var Navigation = function () {
	var pRenderer_, pCallback_, nav_;
	

	var init = function(pgr, cb){
		pRenderer_ = pgr;
		pCallback_ = cb
		nav_ = EventStore.getNavigation();

		populateNav()
	}

	var populateNav = function(){

		var it = nav_.item;
		var str = "";
		for(var i=0; i<it.length; i++){
			str += '<a  data-id='+i+'>'
			//str += '<i class="material-icons">'+it[i].icon+'</i>'
			str += '<i class="demo-icon">'+it[i].icon+'</i>'
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
					pCallback_(t.action_link)
					//pRenderer_.renderPage(EventStore.getPageData(t.action_link));
				}
			}

		})

		$("#topNavigation a").off("click").on("click", function(){
			if(this.id === "nhome"){

			}else if(this.id === "nlbrd"){
				pRenderer_.modalOnLoad({
					popup_type:"leaderBoard",
					template:"leaderBoard",
					action_link:""
				})
			}else if(this.id === "nguide"){
				
			}

		})


	}

	return {
		init:init
		
	}
};
 