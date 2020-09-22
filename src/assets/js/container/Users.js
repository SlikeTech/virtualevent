var User = function () {
	var pRenderer_, aud_

	var init = function(pgr){
		pRenderer_ = pgr;
		aud_ = $(".wrapper #audience");

		$(".header-rhs [data-id]").on("click", function(){
			clickEvent($(this).attr("data-id"));
		})

		audinces()
	}

	var clickEvent = function(type){
		switch(type){
			case "away":
			break;

			case "dnd":
			break;

			case "mapp":
			/*pRenderer_.modalOnLoad({
				popup_type:"leaderBoard",
				template:"leaderBoard",
				action_link:""
			})*/
			break

			case "mprof":
			pRenderer_.modalOnLoad({
				popup_type: "user",
				template: "myProfile",
				data: EventStore.getUserProfile()
			})

			break;

			case "logout":
			break;
		}
	}

	var audinces = function(){
		/*EventStore.getActivePage();
		Utility.loader({url: "totaluser", cb:function(_d){
			//DATA set the UI
		}});*/

		aud_.html('Total No Users - <b>'+Math.floor(Math.random() * 200) + 1+'</b> <br>This Location - <b>'+Math.floor(Math.random() * 10) + 1+'</b>')
	}

	return {
		init:init,
		audinces:audinces
	}
};
 