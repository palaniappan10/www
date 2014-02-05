var User = function()
{
	this.firstname = "";
	this.lastname = "";
	this.imgsrc = "";
	this.fbaccesstoken = "";	
	this.onlogin = null;
	this.onGetDetails = null;
}

var fbUser = new User();

User.prototype.login = function()
{
	console.log("Logging in...");
	var that = this;
	FB.logout();
	FB.login(
     that.loginResponse,
     { scope: "email" }
     );

	$("#facebook_menu").hide();
};

User.prototype.loginResponse = function(response)
{
	console.log("Login response");
	console.log(response.status);
	//var that = this;
	if( response.status == 'connected' )
	{
		fbUser.fbDetails();
		console.log('success');
	}
		
		// this.getDetails();

	// if (resp['status'] == "connected") {
	// 	// this.getDetails();
 // 	}
};

User.prototype.fbDetails = function()
{
	console.log("Getting Details");
	FB.api('/me', function(response) {
			fbUser.firstname = response.first_name;
			fbUser.lastname = response.last_name;
			fbUser.imgsrc = "http://graph.facebook.com/"+response.id+"/picture";
			if( fbUser.onGetDetails != null )
				fbUser.onGetDetails();
 	     });

	 // FB.api("/me/picture",  function(response) {
	 // 	fbUser.imgsrc = response.data.url.split('https://')[1];
		// 	if( fbUser.onGetDetails != null )
		// 		fbUser.onGetDetails();
	 // });
};


FB.Event.subscribe('auth.login', function(response) {
                               //alert('auth.login event');
                               console.log('Login ' + response);
                               });
            
            FB.Event.subscribe('auth.logout', function(response) {
                               //alert('auth.logout event');
                               console.log('Logout ' + response);
                               });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                               //alert('auth.sessionChange event');
                               console.log('Session Change ' + response);
                               });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                               //alert('auth.statusChange event');
                               console.log('status Change ' + response);
                               });