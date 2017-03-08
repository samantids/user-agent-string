
addEventListener("DOMContentLoaded", function(){
	
	var keyFormInput = document.getElementById("key_form_input"),
		keyFormButton = document.getElementById("key_form_button"),
		signIn = document.getElementById("sign_in");

	var changeKeyButton = document.getElementById("change_key_button");

	var userForm = document.getElementById("user_form"),
		parseButton = document.getElementById("parse_button"),
		userKey = document.getElementById("user_key"),
		userAgent = document.getElementById("user_string"),
		myKey;
	
	getKey();
	
	function addKey(){
		var newKey = keyFormInput.value;
		//check for value
		if(!newKey){
			alert('Error: no key added');
			return;
		};
		//save the key in Chrome's storage Api
		chrome.storage.sync.set({"newKeyValue": newKey}, function(){
			alert("Your Key is now: " + newKey);
			console.log("Key set to: " + newKey);
		}); 
	}

	function hideSignIn(){
		chrome.storage.sync.get("newKeyValue", function(data){
			if(data.newKeyValue !== ""){
				signIn.classList.add("display--none");	
			}
		})
	}

	hideSignIn();

	function getKey(){
		chrome.storage.sync.get("newKeyValue", function(data){
			if(data.newKeyValue !== ""){

				myKey = data.newKeyValue;
			} else {
				return "nokey";
			}
		});
	}

	function sendData(){
		var XHR = new XMLHttpRequest();

		userKey.value = myKey;

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
