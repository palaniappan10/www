//News Adder Class
/*
To Handle fetching data from server
Adding it to local db 
And then add it to viewport
*/

//States
// 0 Idle => send request 
// 1 Waiting for ajax request
// 2 Waiting for items to be added to local db
// 3 Create Div and in Ready State
// 4 Get Divs and reset to idle state

function NewsAdder()
{
//	state
	this.state = 0;
	this.limit = 10;
	this.isPrevious = true;
	this.hasQueue = false;
	this.localDBItemIDArray = new Array();
	this.localDBItemArray = new Array();
	this.itemDivs = new Array();
};


/* previousNews - bool - whether to fetch previous news or current news */
NewsAdder.prototype.SendAjaxRequest = function(previousNews,limit)
{
	if( this.state != 0 )
	{
		this.hasQueue = true;
		// console.log('The News Adder is busy.');
		return;
	}
	//reset all arrays
	this.reset();
	this.hasQueue = false;
	
	var that = this;

	this.limit = limit === 'undefined' ? 10 : limit;
	this.isPrevious = previousNews;
	TileSystem_ShowBottomPreLoader();

	if( previousNews )
	{
		DB_GetLastNewsItemsDisplayTime(function(results)
		{
			// console.log("Display Time: " + results.rows.item(0).display_time);
			AJAX_GetNewsBeforeTimeFromServer(results.rows.item(0).display_time,that._ajaxCallback.bind(that),false,limit);
			// console.log('State ' + that.state);
			that.state = 1;//Waiting for request
		});	
	}
};

NewsAdder.prototype._localDBAddedCallback = function(results)
{
	var that = this;
	this.localDBItemIDArray.push(results.insertId);
	if( this.localDBItemIDArray.length == this.limit )
	{
		DB_GetItemsByID(that.localDBItemIDArray,that._localDBGetItemCallback.bind(that));
	}
	//DB_GetItemByID(results.insertId,_localDBGetItemCallback.bind(this));
};

NewsAdder.prototype._localDBGetItemCallback = function(results)
{
	for( var i = 0; i < results.rows.length; i++ )
	{
		this.itemDivs.push(CreateItemDiv(results.rows.item(i)));
	}
	// console.log('Num Divs ' + this.itemDivs.length);

	this.state = 3;

	if( this.isPrevious )
	{
		TileSystem_AddTilesAtBottom(this.itemDivs);
		this.reset();
		this.state = 0;
		this.CheckQueue();
	}
	TileSystem_HideBottomPreLoader();
	// console.log('Num Divs ' + this.itemDivs.length);
};

NewsAdder.prototype._ajaxCallback = function(jsonArray)
{	
	this.state = 2;
	// console.log('State ' + this.state);
	var that = this;
	DB_AddNewsArray(jsonArray,that._localDBAddedCallback.bind(that));
};

NewsAdder.prototype.reset = function()
{
	this.localDBItemIDArray = new Array();
	this.localDBItemArray = new Array();
	this.itemDivs = new Array();
};

NewsAdder.prototype.CheckQueue = function()
{
	if( this.hasQueue ) 
	{
		this.SendAjaxRequest(this.isPrevious,this.limit);
	}
};