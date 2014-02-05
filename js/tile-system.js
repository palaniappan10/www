var container;
var containerSelector;
var pckry;

var main_OnTileTouch;

function TileSystem_Init()
{
	container = document.querySelector('.packery');
    pckry = new Packery( container );
    
    containerSelector = $('.packery');

    Tile_Init();

    console.log("Tile System Initalized");
}

function TileSystem_AddTileOnTop (itemDiv) 
{
	if( itemDiv == null )
	{
		console.log("Tile System Item div is null");
		return;
	}
	container.appendChild(itemDiv);
    pckry.prepended(itemDiv);
    Tile_EnableTileEvents(itemDiv,TileSystem_callback_ItemOnClick,TileSystem_callback_TouchStart);
    pckry.on('layoutComplete',OnPackeryLayoutComplete);
}

function TileSystem_AddTileAtBottom (itemDiv) 
{
	if( itemDiv == null )
	{
		console.log("Tile System Item div is null");
		return;
	}
	container.appendChild(itemDiv);
    pckry.appended(itemDiv);		
    Tile_EnableTileEvents(itemDiv,TileSystem_callback_ItemOnClick,TileSystem_callback_TouchStart);
}

function TileSystem_AddTilesAtBottom (itemDivs) 
{
	if( itemDivs == null )
	{
		console.log("Tile System Item div is null");
		return;
	}
	$(containerSelector).append(itemDivs);
    pckry.appended(itemDivs);		
    for( var i = 0; i < itemDivs.length; i++ )
    	Tile_EnableTileEvents(itemDivs[i],TileSystem_callback_ItemOnClick,TileSystem_callback_TouchStart);
    // console.log('Items Added ');
}

function TileSystem_Clear()
{
	$('.item').each( function( index, value ) {
  		pckry.remove(value);
	});
	TileSystem_DelayedRelayLayout()
}

function TileSystem_callback_TouchStart(e)
{
	if( main_OnTileTouch )
		main_OnTileTouch(e);

	//e.preventDefault();
	e.stopPropagation();
	
	return true;
	//console.log("Item Clicked");
}


/*  Open news page  */

function TileSystem_callback_ItemOnClick(e)
{
	// console.log("Item Clicked" );
	// console.log(Date.now() - start);
}

function TileSystem_CategoryChanged()
{
	console.log('Updating category system');
	$('.item').each( function( index, value ) {
  		DB_GetItemByID($(value).attr('item_id'),function (result) {
  			var resultitem = result.rows.item(0);
  			if( resultitem.item_type === 0 )//check if its a news 
  			{
  				//console.log(resultitem.category);
  				if( settingsCategoryArray.indexOf(resultitem.category) === -1 )
  				{
  					pckry.remove(value);
  				}
  			}
  		});
	});	
	TileSystem_DelayedRelayLayout()
}

function TileSystem_ShowTopPreLoader()
{
	if( $("#item-preloader-top").length > 0 )
	 	return;
	var preloaderItem = TileSystem_CreateDiv(true);
	container.appendChild(preloaderItem);
    pckry.prepended(preloaderItem);
}

function TileSystem_HideTopPreLoader()
{
	if( $("#item-preloader-top").length > 0 )
	{
		pckry.remove($("#item-preloader-top").get(0));
		pckry.layout();	
		TileSystem_DelayedIScrollRefresh();
	}
	
	//$("#item-preloader-top").remove();
}

function TileSystem_ShowBottomPreLoader()
{
	if( $("#item-preloader-bottom").length > 0 )
	 	return;
	var preloaderItem = TileSystem_CreateDiv(false);
	container.appendChild(preloaderItem);
    pckry.appended(preloaderItem);	
    bottomPreloaderScroll = true;
}

function TileSystem_HideBottomPreLoader()
{
	if( $("#item-preloader-bottom").length > 0 )
	{
		pckry.remove($("#item-preloader-bottom").get(0));
		pckry.layout();
		TileSystem_DelayedIScrollRefresh();
	}
	bottomPreloaderScroll = false;
}

function TileSystem_CreateDiv(top)
{
	var bubbling = document.createElement('div');
    bubbling.className="bubblingG";
    if( top )
    	bubbling.id = "item-preloader-top";
    else
    	bubbling.id = "item-preloader-bottom";

    var bubble_first= document.createElement('span');
    bubble_first.id="bubblingG_1";
    var bubble_two= document.createElement('span');
    bubble_two.id="bubblingG_2";
    var bubble_three= document.createElement('span');
    bubble_three.id="bubblingG_3";

    bubbling.appendChild(bubble_first);
    bubbling.appendChild(bubble_two);
    bubbling.appendChild(bubble_three);

	return bubbling;
}

var relayLayoutTimeout;
function TileSystem_DelayedRelayLayout()
{
	if( relayLayoutTimeout )
		clearTimeout(relayLayoutTimeout);

	relayLayoutTimeout = setTimeout(function () {
		pckry.layout();
		TileSystem_DelayedIScrollRefresh();
	},500);
}

var delayedScrollRefereshTimer;
var bottomPreloaderScroll = false;
function TileSystem_DelayedIScrollRefresh()
{
	// if( delayedScrollRefereshTimer )
	// 	clearTimeout(delayedScrollRefereshTimer);

	// delayedScrollRefereshTimer = setTimeout(function () {
	// 	myScroll.refresh();
	// 	console.log('Refresh');
	// },1200);
}

function OnPackeryLayoutComplete()
{
	if( delayedScrollRefereshTimer )
		clearTimeout(delayedScrollRefereshTimer);

	delayedScrollRefereshTimer = setTimeout(function () {
		myScroll.refresh();
		if( bottomPreloaderScroll )
		{
			myScroll.scrollTo(0, myScroll.maxScrollY, 100);
		}
		// console.log('Refresh');
	},200);
	//console.log('Laid out');
}