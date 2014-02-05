//Permit only one transaction at a time

var requestInQueue = false;
var ajaxRequest = null;

function AJAX_CancelAllRequest()
{
	if( ajaxRequest != null )
		ajaxRequest.abort();
	ajaxRequest = null;
	console.log('Ajax Request Canceled.');		
}

//Get Current News from the db
function AJAX_GetLatestNewsFromServer(callback,forced,limit)
{
	if( ajaxRequest != null && forced )
		ajaxRequest.abort();
	else if( ajaxRequest != null )
	{
		console.log( "Request already in queue. Use forced to cancel current request." );
		return;
	}

	if( limit === 'undefined' )
		limit = 10;

	console.log( "Fetching Latest News." );

	var jsonString = JSON.stringify(settingsCategoryArray);

	ajaxRequest = $.ajax({
		type:"POST",
		url:"http://54.209.252.74/goodnews/Fetch/FetchNews.php",
		data:
		{
			limit:limit,
			categories:jsonString
		},
		success:function(response)
		{
			ajaxRequest = null;
			if( callback )
				callback((JSON.parse(response)));
		},
		error:NewsFeedError
	});	

	console.log( "Ajax Request Sent." );
}

//Get Current News from the db
function AJAX_GetNewsAfterTimeFromServer(callback,forced,limit,time)
{
	if( ajaxRequest != null && forced )
		ajaxRequest.abort();
	else if( ajaxRequest != null )
	{
		console.log( "Request already in queue. Use forced to cancel current request." );
		return;
	}

	if( limit === 'undefined' )
		limit = 10;

	console.log( "Fetching Latest News." );

	var jsonString = JSON.stringify(settingsCategoryArray);

	ajaxRequest = $.ajax({
		type:"POST",
		url:"http://54.209.252.74/goodnews/Fetch/FetchNews.php",
		data:
		{
			display_time:time,
			limit:limit,
			categories:jsonString,
			before:false
		},
		success:function(response)
		{
			ajaxRequest = null;
			if( callback )
				callback((JSON.parse(response)));
		},
		error:NewsFeedError
	});	

	console.log( "Ajax Request Sent." );
}

function AJAX_GetNewsBeforeTimeFromServer(time,callback,forced,limit)
{
	if( ajaxRequest != null && forced )
		ajaxRequest.abort();
	else if( ajaxRequest != null )
	{
		console.log( "Request already in queue. Use forced to cancel current request." );
		return;
	}

	console.log( "Fetching Latest News." );
	var jsonString = JSON.stringify(settingsCategoryArray);

	limit = limit === 'undefined' ? 10: limit;
	
	ajaxRequest = $.ajax({
		type:"POST",
		url:"http://54.209.252.74/goodnews/Fetch/FetchNews.php",
		data:
		{
			display_time:time,
			categories:jsonString,
			limit:limit
		},
		success:function(response)
		{
			ajaxRequest = null;
			if( callback )
				callback((JSON.parse(response)));
		},
		error:NewsFeedError
	});	

	console.log( "Ajax Request Sent." );
}

function AJAX_GetArtcileContentByID(id,callback,forced)
{
	console.log( "Fetching Article content." );

	$.ajax({
		type:"GET",
		url:"http://54.209.252.74/goodnews/Fetch/FetchArticle.php",
		data:
		{
			news_id:id
		},
		success:function(response)
		{
			// ajaxRequest = null;
			if( callback )
				callback((JSON.parse(response)));
		},
		error:NewsFeedError
	});	

	console.log( "Ajax Request Sent." );
}

function AJAX_GetQuotes(callback,forced)
{
	if( ajaxRequest != null && forced )
		ajaxRequest.abort();
	else if( ajaxRequest != null )
	{
		console.log( "Request already in queue. Use forced to cancel current request." );
		return;
	}
	console.log( "Fetching Quotes " );

	ajaxRequest = $.ajax({
		type:"GET",
		url:"http://54.209.252.74/goodnews/Fetch/FetchQuotes.php",
		success:function(response)
		{
			ajaxRequest = null;
			if( callback )
				callback((JSON.parse(response)));
		},
		error:NewsFeedError
	});	

	console.log( "Ajax Request Sent." );
}

//Get news older than what we have
function GetOlderNews()
{

}

function HandleNewsFeed(response)
{
	ajaxRequest = null;	
	//var newsFeed = JSON.parse(response);
	//NewsTable_AddNewsArray(newsFeed);
}

function NewsFeedError(xhr, status, error)
{
	ajaxRequest = null;
	var err = eval("(" + xhr.responseText + ")");
  	
	console.log( "Fetching News feed failed : " + err.message);
}

//The server sends wrong folder structure => work around to fix that
function ChangeImageURLs(response)
{
	for( var i = 0; i < response.length; i++ )
	{
		// console.log(response[i]['image_server_url']);
		response[i]['image_server_url'] = "http://54.209.252.74/goodnews" + response[i]['image_server_url'].substring(1,response[i]['image_server_url'].length) ;	
		// console.log(response[i]['image_server_url']);
	}
	return response;
}