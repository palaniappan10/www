/*Constanst*/

/*
ITEMS TABLE :
id   		int: unique id of all items in table
news_id     int: id of the article fetched from the server
quote_id	int: id of the quote fetched from the server
item_type   int: define if its a news/quote 0:news;1:quote;
title       text: News title or quote Depending on the context
source		text: Source of the News article Or author name
image_url   text: Article image or the quote author image 
category    int: Article category (INVALID FOR QUOTES)
tile_style  int: type of tile (square, horizontal, vertical) (INVALID FOR QUOTES)
display_time text: Order in which its displayed
rating      int: Rating of the article 0:okay;1:Good;2:too good;
*/
//

var dbName;
var items_table = "items_table";
var bin_table = "bin_table";

var localDB = null;

function CreateLocalDB()
{
	console.log("***CREATING LOCAL DATABASE***");
	if(localDB == null)
	{
		localDB = window.openDatabase("LocalDB", "1.0", "LocalDB", 200000);
		CreateTables();	
	}
}

function CreateTables()
{
	//Create News Table
	localDB.transaction(function(tx)
	{
		tx.executeSql('DROP TABLE IF EXISTS ' + items_table);
		tx.executeSql("CREATE TABLE IF NOT EXISTS  " + items_table + " (id INTEGER PRIMARY KEY autoincrement, news_id INTEGER, quote_id INTEGER, item_type INTEGER, title TEXT, source TEXT, image_url TEXT, category INTEGER, tile_style INTEGER, display_time INTEGER, rating INTEGER)");
		tx.executeSql('DROP TABLE IF EXISTS ' + bin_table);
		tx.executeSql("CREATE TABLE IF NOT EXISTS  " + bin_table + " (id INTEGER PRIMARY KEY autoincrement, bin_id INTEGER, news_id INTEGER, quote_id INTEGER, item_type INTEGER, title TEXT, source TEXT, image_url TEXT, category INTEGER, tile_style INTEGER, display_time INTEGER, rating INTEGER)");		
	},
	DBQueryFail,
	DBQuerySuccess);

	//Create Bin Table
}

function DBQuerySuccess()
{
	// console.log("Local DB query succeded." );
}

function DBQueryFail(e)
{
	console.log("Error:" + e.message);
	console.log(e.query);
}


/***  News Table Queries  ****/

function DB_ClearItemsTable(callback)
{
	localDB.transaction(function(tx)
	{
			tx.executeSql("DELETE FROM " + items_table ,
			[],
			function(tx, results)
			{
				if( callback )				
					callback(results);
			},
			function(error)
			{
				NewsItem_AddError(error);
			});// + ")
		
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_ClearBin(bin_id,callback)
{
	localDB.transaction(function(tx)
	{
			tx.executeSql("DELETE FROM " + bin_table + " WHERE bin_id = (?)" ,
			[bin_id],
			function(tx, results)
			{
				if( callback )				
					callback(results);
			},
			function(error)
			{
				NewsItem_AddError(error);
			});// + ")
		
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_AddNewsArray(newsArray,callback)
{
	if( typeof callback !== 'function' )
		console.log('Callback is not a function');
	
	localDB.transaction(function(tx)
	{
		for( var i = 0; i < newsArray.length; i++ )
		{
		var news = newsArray[i];
		tx.executeSql("INSERT INTO " + items_table + " (news_id , item_type, title, image_url, source, category, tile_style, display_time,rating) VALUES (?,?,?,?,?,?,?,?,?)",
		[ news['news_id'] , 0 ,  news['title'],news['image_server_url'], news['source'],news['category'], news['tile_style'] , news['display_time'],1],
		function(tx, results)
		{
			if( callback !== 'undefined' )
				callback(results);
			NewsItem_SuccesfullyAdded(tx,results);
		},
		function(error)
		{
			NewsItem_AddError(error);
		});// + ")		
			
		}
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_internal_NewsExists(newsID ,callback)
{
	localDB.transaction(function(tx)
	{
		for( var i = 0; i < newsArray.length; i++ )
		{
			var news = newsArray[i];
		
			tx.executeSql("SELECT * FROM " + items_table + " WHERE news_id = (?)",
			[newsID],
			function(tx, results)
			{
				if( results.row.length == 0 )
					callback(false);
				else
					callback(true);
				NewsItem_SuccesfullyAdded(tx,results);
			},
			function(error)
			{
				console.log('What');
				NewsItem_AddError(error);
			});// + ")
		}
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

// function DB_AddNews(news,callback)
// {
// 	localDB.transaction(function(tx)
// 	{
// 		transaction_callback = callback;
// 		transactionTx = tx;
// 		tx.executeSql("INSERT INTO " + items_table + " (news_id, item_type , title, image_url, source, category, tile_style, display_time,rating) VALUES (?,?,?,?,?,?,?,?,?)",
// 			[ news['news_id'] , 0 , news['title'],news['image_server_url'], news['source'], news['category'], news['tile_style'] ,  news['display_time'],rating],NewsItem_SuccesfullyAdded,NewsItem_AddError);// + ")
// 		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
// 	},
// 	DBQueryFail,
// 	DBQuerySuccess);
// }

function DB_AddQuote(quote,callback)
{
	localDB.transaction(function(tx)
	{
		transaction_callback = callback;
		transactionTx = tx;
		tx.executeSql("INSERT INTO " + items_table + " (quote_id, item_type , title, image_url, source, category, tile_style, display_time,rating) VALUES (?,?,?,?,?,?,?,?,?)",
			[ quote['quote_id'], 1 , quote['phrase'],quote['image_url'], quote['author'], quote['category'], quote['tile_style'] ,  quote['display_time'],1],
			function(tx, results)
			{
				if( callback )
					callback(results);
				QuoteItem_SuccesfullyAdded(tx,results);
			},
			function(error)
			{
				QuoteItem_AddError(error);
			});// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_GetItemByID(id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + items_table + " WHERE id = " + id,
		 [], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Fetching item by id" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

function DB_GetItemsByID(idArray,callback)
{
	localDB.transaction(function(tx)
	{
		var str = "(";
		for( var i= 0; i < idArray.length; i++ )
		{
			str += idArray[i] + ",";
		}
		str = str.substring(0, str.length - 1);
		str += ")";	
		tx.executeSql("SELECT * FROM " + items_table + " WHERE id in " + str,
		 [], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Fetching item by id" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

// function DB_GetNewsByIDs(ids,callback)
// {
// 	localDB.transaction(function(tx)
// 	{
// 		var idString = "(" + ids + ")";
// 		tx.executeSql("SELECT * FROM " + items_table + " WHERE id IN " + idString,
// 		 [], function (tx,results) {
// 		 	if( callback )
// 		 		callback(results);
// 		 },
// 		 function (error)
// 		 {
// 		 	console.log("Error Fetching News by ids" + error);
// 		 });
// 		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
// 	},
// 	DBQueryFail,
// 	DBQuerySuccess);	
// }

function DB_GetLastNewsItemsDisplayTime(callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT (display_time) FROM " + items_table + " WHERE item_type = 0 ORDER BY display_time ASC LIMIT 1",
		 [], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Getting display time" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

function DB_GetFirstNewsItemsDisplayTime(callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT (display_time) FROM " + items_table + " WHERE item_type = 0 ORDER BY display_time DESC LIMIT 1",
		 [], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Getting display time" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

function NewsItem_SuccesfullyAdded(tx,results)
{
	// console.log("News Added " + results.insertId);
}

function NewsItem_AddError(error)
{
	console.log("ERROR News wasn't Added " + error.code);
}

function QuoteItem_SuccesfullyAdded(tx,results)
{
	// console.log("News Added " + results.insertId);
}

function QuoteItem_AddError(error)
{
	console.log("ERROR quote wasn't Added" + error.code);
}

/* ****** Bin System ******* */

function DB_AddItemToBin(id,bin_id,callback)
{
	DB_GetItemByID(id,function(results)
		{
			if( results.rows.length == 0 )
				return;
			var item = results.rows.item(0);
			//check if it already exists
			if( item.item_type == 0 )// News
			{
				DB_GetBinItemByNewsID( item.news_id,bin_id,function  (checkResult) {
					if( checkResult.rows.length > 0 )
					{
						console.log('News already in bin');
						return;
					}
					localDB.transaction(function(tx)
					{
						tx.executeSql("INSERT INTO " + bin_table + " (bin_id,news_id, quote_id, item_type , title, image_url, source, category, tile_style, display_time,rating) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
							[ bin_id, item.news_id, item.quote_id , item.item_type , item.title, item.image_url , item.source, item.category, item.tile_style ,  item.display_time,item.rating],function  (tx,results) {
								if(callback)
									callback(results);
								BinItem_SuccesfullyAdded(tx,results);
							},BinItem_AddError);// + ")
						//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
					},
					DBQueryFail,
					DBQuerySuccess);
					
				} );
			
			}
			else if( item.item_type == 1 )// Quote
			{
				DB_GetBinItemByQuoteID( item.quote_id,bin_id,function  (checkResult) {
					if( checkResult.rows.length > 0 )
					{
						console.log('Quote already in bin');
						return;
					}
					localDB.transaction(function(tx)
					{
						tx.executeSql("INSERT INTO " + bin_table + " (bin_id,news_id, quote_id, item_type , title, image_url, source, category, tile_style, display_time,rating) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
							[ bin_id, item.news_id, item.quote_id , item.item_type , item.title, item.image_url , item.source, item.category, item.tile_style ,  item.display_time,item.rating],function  (tx,results) {
								if(callback)
									callback(results);
								BinItem_SuccesfullyAdded(tx,results);
							},BinItem_AddError);// + ")
						//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
					},
					DBQueryFail,
					DBQuerySuccess);
					
				} );
			}
			
		});
}

function DB_GetBinItemByID(id,bin_id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + bin_table + " WHERE bin_id = (?) AND id = (?) " ,
			[bin_id, id],function  (tx,results) {
				if(callback)
					callback(results);
				//BinItem_SuccesfullyAdded(tx,results);
			},BinItem_AddError);// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_GetBinItems(bin_id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + bin_table + " WHERE bin_id = (?) " ,
			[bin_id],function  (tx,results) {
				if(callback)
					callback(results);
				//BinItem_SuccesfullyAdded(tx,results);
			},BinItem_AddError);// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_GetBinItemByNewsID(news_id,bin_id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + bin_table + " WHERE bin_id = (?) AND news_id = (?) " ,
			[bin_id, news_id],function  (tx,results) {
				if(callback)
					callback(results);
				//BinItem_SuccesfullyAdded(tx,results);
			},
			function()
			{

			});// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_GetBinItemByQuoteID(quote_id,bin_id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + bin_table + " WHERE bin_id = (?) AND quote_id = (?) " ,
			[bin_id, quote_id],function  (tx,results) {
				if(callback)
					callback(results);
				//BinItem_SuccesfullyAdded(tx,results);
			},BinItem_AddError);// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function DB_GetBinItem(id,news_id,quote_id,bin_id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + bin_table + " WHERE bin_id = (?) AND (id = (?) OR  news_id = (?) OR quote_id = (?))" ,
			[bin_id, id,news_id,quote_id],function  (tx,results) {
				if(callback)
					callback(results);
				//BinItem_SuccesfullyAdded(tx,results);
			},BinItem_AddError);// + ")
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);
}

function BinItem_SuccesfullyAdded(tx,results)
{
	// console.log("Item Added to bin" + results.insertId);
}

function BinItem_AddError(error)
{
	console.log("ERROR Item wasn't Added to bin " + error.code);
}

/* ******            ******* */

//Helper Functions

function DB_GetItemRating(id,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("SELECT * FROM " + items_table + " WHERE id = " + id,
		 [], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Getting rating by id" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

function DB_SetItemRating(id,rating,callback)
{
	localDB.transaction(function(tx)
	{
		tx.executeSql("UPDATE " + items_table + " SET rating = (?) WHERE id = (?)",
		 [rating,id], function (tx,results) {
		 	if( callback )
		 		callback(results);
		 },
		 function (error)
		 {
		 	console.log("Error Setting item rating by id" + error);
		 });
		//tx.executeSql("INSERT INTO " + news_table + " (id) VALUES (?)",[news['news_id']]);
	},
	DBQueryFail,
	DBQuerySuccess);	
}

/*******/

function AddFakeNews()
{
	var arr = [];
	arr.push(GetFakeJsonNews(1));
	arr.push(GetFakeJsonNews(2));
	arr.push(GetFakeJsonNews(3));
	arr.push(GetFakeJsonNews(4));
	DB_AddNewsArray(arr,ReturnID);

	DB_AddQuote(GetFakeJsonNews(4),ReturnID);

	console.log(GetFakeJsonNews(3));
}

function ReturnID(id)
{

}

function FetchShit()
{
	var arr = [];
	arr.push(2);arr.push(4);
	NewsTable_GetNewsByIDs(arr,function (tx,results) {
		console.log();
		console.log(results.rows.length);
	});
}

function GetFakeJsonNews(id)
{
	var str = "{ \"news_id\": " + id + ",  \"title\": \"Whatever\",  \"image_server_url\": \"url\",  \"category\": \"Tech\",  \"tile_style\": 1,  \"display_time\": \"\"}";
	return JSON.parse(str);
}