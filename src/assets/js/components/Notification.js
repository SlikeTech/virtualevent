var Notification = (function () {
	
	var notify = function(ty, txt){
		$(".alert-msg[role=alert]").addClass("H")
		var str = ""
		if(ty === "info"){
			alertContent("INFROMATION", ty, txt)
		}else if(ty === "success"){
			alertContent("SUCCESS", ty, txt)
		}else if(ty === "fail"){
			alertContent("FAIL", "warning", txt)
		}
	}

	var alertContent = function(type, at, text){
	var str = '<div class="close-ico" id="clsbtn"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11.002" viewBox="0 0 11 11.002"><path class="a" d="M18.089,16.79l3.929-3.931a.921.921,0,1,0-1.3-1.3l-3.929,3.931-3.929-3.931a.921.921,0,1,0-1.3,1.3l3.929,3.931L11.556,20.72a.921.921,0,0,0,1.3,1.3l3.929-3.931,3.929,3.931a.921.921,0,1,0,1.3-1.3Z" transform="translate(-11.285 -11.289)"/></svg></div><i class="material-icons">info</i><b>'+type+'</b>'+text

		$("#alertBox").removeClass();
		$("#alertBox").addClass("alert-msg alert-msg-"+at+" show");

		var inter = setTimeout(function(){
			$("#alertBox").removeClass("show");
		}, 3000)

		$("#alertBox").html(str);
		$("#alertBox").addClass("show");

		$("#alertBox #clsbtn").off("click").on("click", function(){
			clearInterval(inter);
			$("#alertBox").removeClass("show");
		})
	}

	return {
		notify:notify
	}
})();
 