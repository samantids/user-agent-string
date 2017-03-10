
addEventListener("DOMContentLoaded", function(){
	
	var keyFormInput = document.getElementById("key_form_input"),
		keyFormButton = document.getElementById("key_form_button"),
		signIn = document.getElementById("sign_in"),
		signInMessage = document.getElementById("sign_in_message"),
		changeKeyButton = document.getElementById("change_key_button"),
		userForm = document.getElementById("user_form"),
		parseButton = document.getElementById("parse_button"),
		userKey = document.getElementById("user_key"),
		userAgent = document.getElementById("user_string"),
		responseDiv = document.getElementById("response_div"),
		myKey;
	
	//set initial state, hide sign in form if key already present
	getKey();
	
	//lets the user set the key
	function addKey(){
		var newKey = keyFormInput.value;
		//check for value and return error if empty
		if(!newKey){
			signInMessage.innerHTML = "<span class='error_message text--bold'>Error: no key added</span>";
			return;
		};
		//if key is not empty save the key in Chrome's storage Api and show success message
		chrome.storage.sync.set({"newKeyValue": newKey}, function(){
			myKey = newKey;
			signIn.classList.add("display--none");
			signInMessage.innerHTML = "<span class='success_message text--bold'>Your key is now set!</span>";
			setTimeout(function(){
				signInMessage.innerHTML = "";
				changeKeyButton.style.visibility = "visible";
				}, 3000);
		}); 
	}

	//checks for a key, if present myKey is set and sign in page won't appear
	function getKey(){
		chrome.storage.sync.get("newKeyValue", function(data){
			if(data.newKeyValue){
				myKey = data.newKeyValue;
				signIn.classList.add("display--none");
			} 
		});
	}

	//sends request to whatismybrowser
	function sendData(){
		var XHR = new XMLHttpRequest();

		userKey.value = myKey;

		var FD = new FormData(userForm);

		//successful request
		XHR.addEventListener("load", function(event){ 
			var responseText = JSON.parse(event.target.responseText);
			//success response displays user agent parse 
			if(responseText.result == "success"){
				responseDiv.innerHTML = "<h3>" + responseText.parse.simple_major + "</h3>";
			//error response displays provided error message
			} else {
				responseDiv.innerHTML = "<h3 class='error_message'>" + responseText.message + "</h3>";
			}
		});

		//error with request
		XHR.addEventListener("error", function(event){
			responseDiv.innerHTML = "Oops! Something went wrong.";
			setTimeout(function(){
				responseDiv.innerHTML = "";
			}, 3000);
		});

		//setup request
		XHR.open("POST", "https://api.whatismybrowser.com/api/v1/user_agent_parse");

		//send form
		XHR.send(FD);
	}

	keyFormButton.addEventListener("click", function(event){
		event.preventDefault();
		addKey();
	});

	changeKeyButton.addEventListener("click", function(event){
		event.preventDefault();
		signIn.classList.remove("display--none");
		changeKeyButton.style.visibility = "hidden";
	})

	parseButton.addEventListener("click", function(event){
		event.preventDefault();
		sendData();
	});

});
