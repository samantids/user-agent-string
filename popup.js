
document.addEventListener("DOMContentLoaded", function(){
	function sendData(){
		var XHR = new XMLHttpRequest();

		var FD = new FormData(userForm);

		//success
		XHR.addEventListener("load", function(event){
			var responseDiv = document.getElementById("response_div");
			var responseText = JSON.parse(event.target.responseText);
			responseDiv.innerHTML = "<h3>" + responseText.parse.simple_major + "</h3>";
		});

		//error
		XHR.addEventListener("error", function(event){
			alert("Oops! Something went wrong.");
		});

		//setup request
		XHR.open("POST", "https://api.whatismybrowser.com/api/v1/user_agent_parse");

		//send form
		XHR.send(FD);
	}

	var userForm = document.getElementById("user_form");
	var parseButton = document.getElementById("parse_button");
	var userKey = document.getElementById("user_key");
	var myKey = config.MY_KEY;
	userKey.value = myKey;


	parseButton.addEventListener("click", function(event){
		event.preventDefault();
		sendData();
	});

});
