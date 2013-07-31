SecureConfig = function(){
	var o = {}, t = this;
	o.clientId = "199746965865";
	o.apiKey = "AIzaSyDW0-bsom-htfv3JZBAIJ5ywCkcqCR6qkU";
	o.service = "calendar";
	o.service_version = "v3";
	o.api_scope = "https://www.googleapis.com/auth/calendar";

	t.gCI = function(){ return o.clientId; };
	t.sCI = function(v){
		if(v && typeof v === "string") o.clientId = v;
	};

	t.gAK = function(){ return o.apiKey; };
	t.sAK = function(v){
		if(v && typeof v === "string") o.apiKey = v;
	};

	t.gS = function(){ return o.service; };
	t.sS = function(v){
		if(v && typeof v === "string") o.service = v;
	};

	t.gSV = function(){ return o.service_version; };
	t.sSV = function(v){
		if(v && typeof v === "string") o.service_version = v;
	};

	t.gAS = function(){ return o.api_scope; };
	t.sAS = function(v){
		if(v && typeof v === "string") o.api_scope = v;
	};

	return {
		getClientId: gCI,
		setClientId: sCI,
		getApiKey: gAK,
		setApiKey: sAK,
		getService: gS,
		setService: sS,
		getServiceVersion: gSV,
		setServiceVersion: sSV,
		getApiScope: gAS,
		setApiScope: sAS
	};
}();

window.sc = SecureConfig;
window.monthArrayShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

makeRequest = function(){
	gapi.client.load(sc.getService(), sc.getServiceVersion(), function(){
		if(sc.getService() === "calendar"){
			var request = gapi.client.calendar.events.list({
				"calendarId": "primary"
			});

			request.execute(function(response){
				if(response && !response.error){
					$(response.items).each(function(index, item){
						// console.log("Event: "+item.summary + ", created at: "+item.created);
						var created = parseDate(item.created);
						$("#resultDiv").append("<span class='event_span'><p class='event_timestamp'>"+created+"</p><p class='event_name'>"+item.summary+"</p></span>");
					});
				}
			});
		}
	});
};

checkLoginStatus = function(){
	gapi.auth.authorize({client_id: sc.getClientId(), scope: sc.getApiScope(), immediate: true}, loginStatusCallback);
};

showAuthScreen = function(){
	gapi.auth.authorize({client_id: sc.getClientId(), scope: sc.getApiScope(), immediate: false}, loginStatusCallback);
};

loginStatusCallback = function(status){
	var authBtn = $('#authBtn');
	if (status && !status.error) {
		authBtn.css('display', 'none');
		makeRequest();
	} else {
		authBtn.css('display', 'block');
		authBtn.on('click', showAuthScreen);
	}
};

gapiLoad = function(){
	console.log("API KEY: "+sc.getApiKey());
	gapi.client.setApiKey(sc.getApiKey());
    window.setTimeout(checkLoginStatus, 1);
};

parseDate = function(d){
	var a = d.split("T");
	var b = a[0].split("-");
	return b[2] + "-" + monthArrayShort[parseInt(b[1])-1] + "-" + b[0];
}