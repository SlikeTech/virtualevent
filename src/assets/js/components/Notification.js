var Notification = (function () {
	var socket;
	var init = function(){
		
		connect_socket();
		// const options = {
		// 	url: 'ws://172.29.72.27:2019',
		// 	pingTimeout: 15000, 
		// 	pongTimeout: 10000, 
		// 	reconnectTimeout: 2000,
		// 	pingMsg: "heartbeat"
		// }
		// var websocketHeartbeatJs = new WebsocketHeartbeatJs(options);
		// websocketHeartbeatJs.onopen = function () {
		// 	console.log('connect success');
		// 	console.log("getting cookies");
		// 	console.log(Login.getCookie());
		// 	//websocketHeartbeatJs.send({"SESSION_ID" : ""});
		// }
		// websocketHeartbeatJs.onmessage = function (e) {
		// 	//console.log(`onmessage: ${e.data}`);
		// }
		// websocketHeartbeatJs.onreconnect = function () {
		// 	//console.log('reconnecting...');
		// }
	}
	var connect_socket = function() {
		socket = new WebSocket("ws://172.29.72.27:2019");
		var uuid = EventStore.getUserSession();
		console.log(uuid);
		socket.onopen = function(e) {
			console.log("connection established");
			console.log("sending messages to the server");
			socket.send( JSON.stringify([uuid,"socket-connection-ack"]));
		};
		socket.onmessage = function(event) {
			console.log(`[message] Data received from server: ${event.data}`);
			//Notification.notify("SUCCESS",event.data.message);
			var msg = JSON.parse(event.data);
			console.log(msg);
			if(msg.message!="registered"){
				notify("info",msg.message);
			}
			//alert(msg.message);
		};
		//socket.on("close", connect_socket); // <- rise from your grave!
		socket.onclose = function(){
			connect_socket();
		}
		heartbeat();
	}
	var heartbeat = function() {
		var uuid = EventStore.getUserSession();
		if (!socket) return;
		if (socket.readyState !== 1) return;
		socket.send( JSON.stringify([uuid,"socket-connection-ack"]));
		setTimeout(heartbeat, 500);
	}
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
		notify:notify,
		init : init
	}
})();
 