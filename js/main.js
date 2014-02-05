document.addEventListener("deviceready", Awake, false);
document.addEventListener("resume", OnResume, false);


// On Pc 
var pc = false;
docReady( function() 
{
	if( pc )
		Awake();
});

var atBottom = false;
var isInBinMode = false;
var isBackButton = false;
var windowHeight;
var initiated = false;
var noNetwork = false;

//Initiate the whole app
function Awake()
{
	//Saving this for scroll calculations
	windowHeight = $(window).height();

	// window.addEventListener("orientationchange", OnWinResizeJquery, false);

	console.log('Main Started');
	//Fade the blue screen
	$("#bluescreen").fadeOut(100);

	if( !pc )
	{
		console.log("Connection Typee " + navigator.connection.type);
		if( navigator.connection.type == Connection.NONE )
		{
			var wWidth = $(window).width();
	        var dWidth = wWidth * 0.50;
	        var wHeight = $(window).height();
	        var dHeight = wHeight * 0.25;

			//alert( "No Internet Connection Found." );
			console.log('No Internet');
			$( "#no_network" ).dialog(
				{
					width:dWidth,
					height:dHeight
				});	
			noNetwork = true;
			return;
		}
		else
		{
			noNetwork = false;
			// /$( "#no_network" ).dialog('close');	
		}

	}

	

	if(FB)
	{
		InitFacebookButtons();

		//Initiate facebook
		if( !pc )
		{
			FB.init({ appId: "593977184008472", nativeInterface: CDV.FB, useCachedDialogs: false });
		}
		var wWidth = $(window).width();
        var dWidth = wWidth * 0.75;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.50;

		$( "#fblogin" ).dialog({
	      resizable: false,
	      width:dWidth,
	      height:dHeight,
	      modal: true,
	      draggable:false,
	      
	    });

		fbUser.onGetDetails = function()
		{
			console.log("Image " + fbUser.imgsrc);
			$('.user_name').html(fbUser.firstname);
			$('.user_pic').attr("src",fbUser.imgsrc);
			Init();
		};	
	}
	else
		Init();

	console.log('Main Initialized.');
	//StartAddingNews();
}

function OnResume()
{
	if( noNetwork )
		Awake();
	else if( initiated )
	{
		if( !pc )
		{
			console.log("Connection Typee " + navigator.connection.type);
			if( navigator.connection.type == Connection.NONE )
			{
				//alert( "No Internet Connection Found." );
				console.log('No Internet');
				$( "#no_network" ).dialog();	
				noNetwork = true;
				return;
			}	
		}
	}
}

function Init()
{
	if( initiated )
		return;
	initiated = true;
	//PullToRefresh_Init();
	windowHeight = $(window).height();

	// ScrollInit();
	ScrollHandler_Init();

	//Create Local DB
	CreateLocalDB();

	if( pc )
	{
		AddFakeNews();

		NewsFeedAddedToDB_dummy(1);
		NewsFeedAddedToDB_dummy(2);
		NewsFeedAddedToDB_dummy(3);
		NewsFeedAddedToDB_dummy(4);
		NewsFeedAddedToDB_dummy(5);	
	}

	MenuSystem_Init();

	BinSystem_init();

	TileSystem_Init();

	//Tile system callback
	main_OnTileTouch = DisableMenuOnMouseAction_Item;

	$(document).on('touchstart',DisableMenuOnMouseAction);

	//Initiate UI Events

	// InitAddItemsButton();

	StartFetechingNews();

	
	// StartTour();
}

function InitFacebookButtons()
{
	FastClick.attach($("#fb_button").get(0));
	FastClick.attach($("#fb_cancel").get(0));
	FastClick.attach($("#facebook_menu").get(0));

	$("#fb_button").on('click',function()
	{
	  	if( !pc )  
    		fbUser.login();
    	$( "#fblogin" ).dialog( "close" );
	});

	$("#fb_cancel").on('click',function()
	{
	  	$( "#fblogin" ).dialog( "close" );
        Init();
	});

	$("#facebook_menu").on('click',function()
		{
			fbUser.login();
			HideMenu();
			HideBlackScreen();
		});
}


function NewsFeedReponse_First(jsonArray)
{
	TileSystem_HideTopPreLoader();
	NewsFeedReponse(jsonArray);	
	AJAX_GetQuotes(function(jArray)
		{
			DB_AddQuote(jArray[0],function (results) {
				DB_GetItemByID(results.insertId,
				function(result)
				{
					TileSystem_AddTileAtBottom( CreateItemDiv(result.rows.item(0)) );	
				});
				
			});
			//console.log(jArray);
		},true);
}

function NewsFeedReponse(jsonArray)
{
	TileSystem_HideBottomPreLoader();
	addingInBottom = false;
	console.log('Ajax Response' + jsonArray.length);
	DB_AddNewsArray(jsonArray,NewsFeedAddedToDB);
}

function NewsFeedReponse_TOP(jsonArray)
{
	//console.log('Ajax reply');
	TileSystem_HideTopPreLoader();
	addingInBottom = false;
	//console.log('Ajax Response ' + jsonArray.length);
	DB_AddNewsArray(jsonArray,NewsFeedAddedToDB_TOP);
}

function NewsFeedAddedToDB(results) {
	DB_GetItemByID(results.insertId,
		function(results)
		{
			if( atBottom )
			{
				TileSystem_AddTileAtBottom( CreateItemDiv(results.rows.item(0)) );	
			}
			else
			{
				atBottom = true;
				TileSystem_AddTileOnTop( CreateItemDiv(results.rows.item(0)) );	
			}
		});
}

function NewsFeedAddedToDB_TOP(results) {
	DB_GetItemByID(results.insertId,
		function(results)
		{
			TileSystem_AddTileOnTop( CreateItemDiv(results.rows.item(0)) );	
		});
}

function AddNewsAtBottom()
{
	console.log('MAINjs Add News At bottom');
	TileSystem_ShowBottomPreLoader();
	DB_GetLastNewsItemsDisplayTime(function(results)
		{
			// console.log("Display Time: " + results.rows.item(0).display_time);
			AJAX_GetNewsBeforeTimeFromServer(results.rows.item(0).display_time,NewsFeedReponse,false);
		});
}

function ReloadNewsArea()
{
	AJAX_CancelAllRequest();
	ClearAll(function(results)
	{
		StartFetechingNews();
	});
}

function ClearAll(callback)
{
	TileSystem_Clear();
	DB_ClearItemsTable(callback);
}

function StartFetechingNews()
{
	//Get News From Server
	if( !pc )
	{
		isInBinMode = false;
		isBackButton = false;
		$(".back_top").attr("src","img/icon/to-top.png");
		// $(".back_top").hide();
		$(".back_top").fadeTo(0,0.3);
		TileSystem_HideBottomPreLoader();
		AJAX_GetLatestNewsFromServer(NewsFeedReponse_First,false,10);//minimumNumOfTiles
		TileSystem_ShowTopPreLoader();
	}
}

//Gets the lastest news ... news added after the app started
var noMoreNewsTimer = null;
function GetNewsAfterDisplayTime()
{
	TileSystem_ShowTopPreLoader();
	setTimeout(function()
	{
		var wWidth = $(window).width();
        var dWidth = wWidth * 0.50;
        var dpos = wWidth * 0.25;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.50;

		TileSystem_HideTopPreLoader();
      	$( "#no_more_news" ).dialog(
      		{ 
      			width:dWidth,
      			height:dHeight,
      			position: ['top', dpos]
      	});	
      	if( noMoreNewsTimer != null )
      		clearTimeout(noMoreNewsTimer);
      		noMoreNewsTimer = setTimeout(function()
      		{
      			$( "#no_more_news" ).dialog('close');
      		},2500);
		//alert('We ran out of Good News. Check back in a while');
	},4500);
	// DB_GetFirstNewsItemsDisplayTime(function(results)
	// {
	// 	console.log('Ajax sending');
	// 	AJAX_GetNewsAfterTimeFromServer(NewsFeedReponse_TOP,true,4,results.rows.item(0).display_time);
	// 	console.log('Ajax sent');
	// });
}

/* Drag Started initimate bin system*/
function main_TileDragStarted()
{	
	Bin_callback_DragStarted();
}

function main_TileDragStopped()
{
	Bin_callback_DragStopeed();
}

function StartTour()
{
	$("#tourblackscreen").show();
	hopscotch.startTour(tour);
}

/**** View ****/

/* Disbale Menu on any mose action  */

function DisableMenuOnMouseAction_Item(e)
{
	return;
	if( HideMenu() )
	{
		touchEventUsed = true;
	}

	if( HideAboutPage() )
	{
		touchEventUsed = true;
	}

	if( HideDisclaimerPage() )
	{
		touchEventUsed = true;
	}

	if( HideBin() )
	{
		touchEventUsed = true;
	}
	
	if( touchEventUsed )
		e.stopPropagation();
}

function DisableMenuOnMouseAction(e)
{
	return;
	if( ($(e.target) !== $(menuDiv)) && 
	($(menuDiv).has(e.target).length === 0) &&
	 (e.target.getAttribute('id') !== 'user_click_area')  )//
	{
		console.log('Hide menu' + e.target.getAttribute('id'));
		if( HideMenu() )
		{
			touchEventUsed = true;
		}
	}

	if( ($(e.target) !== $(aboutPageDiv)) && 
	($(aboutPageDiv).has(e.target).length === 0))//
	{
		if( HideAboutPage() )
		{
			touchEventUsed = true;
		}
	}

	if( ($(e.target) !== $(disclaimerPageDiv)) && 
	($(disclaimerPageDiv).has(e.target).length === 0))//
	{
		if( HideDisclaimerPage() )
		{
			touchEventUsed = true;
		}
	}

	if( ($(e.target) !== $(binDiv)) && 
	($(binDiv).has(e.target).length === 0) && 
	($(e.target) !== $(collectionDiv)) && 
	($(collectionDiv).has(e.target).length === 0))//
	{
		if( HideBin() )
		{
			touchEventUsed = true;
		}
	}

	if( touchEventUsed )
		e.stopPropagation();	
}

//Bin Items
function LoadBinItems(items)
{
	if( items.length == 0 )  
	{
		alert('No articles in bin');
		return;
	}
	HideBin();
	HideBlackScreen();

	isInBinMode = true;
	isBackButton = true;
	$(".back_top").attr("src","img/icon/go-back.png");
	//$(".back_top").show();
	$(".back_top").fadeTo(0,1);
	AJAX_CancelAllRequest();
	TileSystem_HideTopPreLoader();
	TileSystem_HideBottomPreLoader();

	
	TileSystem_Clear();
	//console.log("main" + items);

	for( var i =0 ; i < items.length; i++ )
	{
		if( atBottom )
		{
			TileSystem_AddTileAtBottom( CreateItemDiv(items.item(i)) );	
		}
		else
		{
			atBottom = true;
			TileSystem_AddTileOnTop( CreateItemDiv(items.item(i)) );	
		}
	}
}

var addingInBottom = false;

function  InitAddItemsButton () 
{
	FastClick.attach($("#good_news_logo").get(0));
	
	$("#good_news_logo").on("click",function()
	{
		if( !isInBinMode )
		{
			console.log('Fetch Latest News.');
			GetNewsAfterDisplayTime();
		}
	});
}


//Dummy for pc
function NewsFeedAddedToDB_dummy(id) {
	DB_GetItemByID(id,
		function(results)
		{
			if( atBottom )
			{
				TileSystem_AddTileAtBottom( CreateItemDiv(results.rows.item(0)) );	
			}
			else
			{
				//atBottom = true;
				TileSystem_AddTileOnTop( CreateItemDiv(results.rows.item(0)) );	
			}
			
		});
}

function OnWinResizeJquery()
{
	console.log('On Resize ');
	if($("DroppedInBinDialog").dialog('isOpen'))
		$("DroppedInBinDialog").dialog({position:'cenetr'});
	var open = $("no_network").dialog('isOpen');
	console.log(open.isOpen);
	if($("no_network").dialog('isOpen') === true)
	{
		console.log('Is Open');
		$("no_network").dialog({position:'center'});
	}
	// no_network
	// fblogin
	// no_more_news
	// clear_bin
	// clear_bin_success
	// rename_bin
}