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
		var u;
		switch(type){
			
			case "online" :
			u = EventStore.getUserProfile();
			if(u.status !== 1)
				senData(1)
			break;			

			case "away":
			u = EventStore.getUserProfile();
			if(u.status !== -1)
				senData(-1)
			break;

			case "dnd":
			u = EventStore.getUserProfile();
			if(u.status !== -2)
				senData(-2)
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


	var senData = function(st){
		var user = EventStore.getUserProfile();

		var fd = new FormData()
        fd.append("firstname", user.firstname)
        fd.append("lastname", user.lastname)
        fd.append("jobtitle", user.jobtitle)
        fd.append("companyname", user.companyname)
        fd.append("phone", user.phone)
        fd.append("status", status)

        user.status = st;

        Utility.loader({url: "users/update.json", data : fd, type :"POST", cb:function(_d){
            var u = EventStore.getUserProfile();
            u.status = st;
        }});
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
 