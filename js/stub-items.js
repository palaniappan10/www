/*Item class definition*/
function TileItem () {
	this.itemType = "";//news,quotes,ads
	this.tilestyle = 0;//
	this.itemID = -1;  
    this.headline = "";
    this.subheading = "";
    this.source = "";
    this.content = "";
    this.contentImg = "";
    this.time = "";
    this.quotes = "";
    this.rating = 1;
    this.ratingImgsrc = "img/rating/r"+ this.rating +".png";
    this.imgsrc = "";
    this.category = "";
    this.color = "color1";
    this.setNews = SetNews;
    this.setItemID = function(_itemID){this.itemID = _itemID};
    this.setContentImg = function(_contentImg){this.contentImg = _contentImg};
    this.setItemType = function(_itemType){this.itemType = _itemType;};
    this.setHeadline = function(_headline){this.headline = _headline;};
    this.setSubheading = function(_subheading){this.subheading = _subheading;};
    this.setSource = function(_source){this.source = _source;};
    this.setTime = function(_time){this.time = _time;};
    this.setImgsrc = function(_imgsrc){this.imgsrc = _imgsrc;};
    this.setQuotes = function(_quotes){this.quotes = _quotes;};
    this.setContent = function(_content){this.content = _content};
    this.setCategory = SetCategory;
    this.changeRating = ChangeRating;
    this.debug = DebugPrint;
}

function DebugPrint()
{
	console.log("Type:"+this.itemType + "..."+
		"Tile Style:"+this.tilestyle + "..."+
		"Item ID:"+this.itemID + "..."+
		"Headline :"+this.headline + "..."+
		"Subheading :"+this.subheading + "..."+
		"Source :"+this.source + "..."+
		"Time :"+this.time + "..."+
		"Quotes :"+this.quotes + "..."+
		"Imgsrc :"+this.imgsrc);
}

function SetNews(headline,subheading,source,time,imgsrc,category)
{
	this.type = "news";
	this.headline = headline;
	this.subheading = subheading;
	this.source = source;
	this.time = time;
	this.imgsrc = imgsrc;
	this.setCategory(category);
}

function SetCategory(category)
{
	this.category = category;
	if( this.category == 0 )
		this.category = 5
	this.color = "color" + this.category;
	console.log(this.category + "..." + this.color);
	// switch(this.category)
	// {
	// 	case "TECHNOLOGY":
	// 	this.color = "color1";
	// 	break;

	// 	case "HEALTH":
	// 	this.color = "color2";
	// 	break;

	// 	case "SPORTS":
	// 	this.color = "color3";
	// 	break;

	// 	case "LOCAL":
	// 	this.color = "color4";
	// 	break;

	// 	case "WORLD":
	// 	this.color = "color5";
	// 	break;

	// 	// case "SPORTS":
	// 	// this.color = "color6";
	// 	// break;
	// }
}

function ChangeRating()
{
	this.rating++;
    if( this.rating > 4 )
        this.rating = 1;
    this.ratingImgsrc = "img/rating/r"+ this.rating +".png";	
}
/******** end **********/

/******** Dummy content *******/

var quotes = new Array();
quotes[0]="Keep your fears to yourself, share your courage.";
quotes[1]="Good luck is that what happens when work meets opportunity.";
quotes[2]="Small deeds done are better than great deeds planned.";
quotes[3]="Every sunset gives us one day less to live but every sunrise gives us one day more to hope.";
quotes[4]="It is strange how man finds time to hate when life is too short for love.";
quotes[5]="The tree does not withdraw its shade from the woodcutter.";
quotes[6]="To handle yourself, use your head, to handle others use your heart.";
quotes[7]="Since we cannot get what we like, let us like what we get.";
quotes[7]="A young man is a theory, an old man is a fact.";
quotes[7]="The buyer needs a hundred eyes, the seller needs not one.";


var time = new Array();
time[0]="20m ago";
time[1]="2h ago";
time[2]="1m ago";
time[3]="30m ago";
time[4]="41m ago";
time[5]="56m ago";
time[6]="1h ago";
time[7]="2m ago";
time[8]="5m ago";
time[9]="3m ago";

var author_name = new Array();
author_name[0]="&mdash; Ernest Hemingway";
author_name[1]="&mdash; MK Gandhi";
author_name[2]="&mdash; Wordsworth";
author_name[3]="&mdash; Marcel Proust";
author_name[4]="&mdash; Paul Simon";



var boxcolor = new Array();
boxcolor[0]="color1";
boxcolor[1]="color2";
boxcolor[2]="color3";
boxcolor[3]="color4";
// boxcolor[4]="color5";
// boxcolor[3]="color6";
// boxcolor[4]="color7";

var tricolor = new Array();
tricolor[0]="tricolor1";
tricolor[1]="tricolor2";
tricolor[2]="tricolor3";
tricolor[3]="tricolor4";
// tricolor[4]="color5";
// tricolor[3]="color6";
// tricolor[4]="color7";


var from = new Array();
from[0]="BBC";
from[1]="CNN";
from[2]="Reuteurs";
from[3]="The Verge";
from[4]="Techcrunch";
from[5]="BBC";
from[6]="AP";
from[7]="NDTV";
from[8]="CBN";
from[9]="BBC";

var desc = new Array();
desc[0] = "The northern double drummer is the second largest cicada in Australia";
desc[1] = "From November 2011 to November 2012, City Nord was the largest shopping center in Northern Norway";
desc[2] = "Tamil Nadu Fire and Rescue Services was the first fire department in India to have female fire officers";
desc[3] = "The 2005 Coca-Cola 600 featured the most caution flags in NASCAR Nextel Cup history";
desc[4] = "Home Brew, the eponymous album by the hip hop group, was promoted by a 48-hour-long release party";
desc[5] = "The Etchmiadzin Cathedral (pictured) is considered the oldest cathedral in the world";
desc[6] = "The female smooth-fronted caiman often builds her nest against the side of a termite mound";
desc[7] = "The East Antarctic Shield was joined to North America during the time of the Rodinia supercontinent";
desc[8] = "Dennis Lillee was the first to take a five-wicket haul in Cricket World Cups";
desc[9] = "There were 257 entrants in the competition in 1926 to design the Liverpool Cenotaph";

var headlines = new Array();
headlines[0]="MiG-21 FL fighter flies into history";
headlines[1]="South Africans bid farewell to Nelson Mandela";
headlines[2]="Mars Orbiter Mission's first TCM successful";
headlines[3]="Coldest spot on Earth identified by satellite";
headlines[4]="Adorable 6-Year-Old Is Here To Save NASA";
headlines[5]="The common cold now has a cure";
headlines[6]="Obama breaks ice with Cuba at Madiba service";
headlines[7]="Good news app breaks sales records";
headlines[8]="Google opens first data centres in Asia";
headlines[9]="Stem cell genetics might be the future";

function GetRandomHeadline()
{
	return headlines[Math.floor((Math.random()*headlines.length))];
}

function GetRandomDescription()
{
	return desc[Math.floor((Math.random()*desc.length))];
}

function GetFeaturedImage()
{
	return "img/featured/featured" +(Math.floor((Math.random()*5))+1)+ ".jpg";
}

function GetQuoteImage()
{
	return "img/quotes/quotes" +(Math.floor((Math.random()*5))+1)+ ".jpg";
}


function GetRandomImg()
{
	return "img/512/" +(Math.floor((Math.random()*10))+1)+ ".jpg";
}

function GetRandomImg2x1()
{
	return "img/2x1/h"+(Math.floor((Math.random()*5))+1)+".jpg";
}

function GetRandomImg1x2()
{
	return "img/1x2/v"+(Math.floor((Math.random()*5))+1)+".jpg";
}

function GetRandomTime()
{
	return time[Math.floor((Math.random()*time.length))];
}

function GetRandomFrom()
{
	return from[Math.floor((Math.random()*from.length))];
}

function GetRandomBoxColor()
{
	return Math.floor((Math.random()*boxcolor.length));
}

function GetRandomAuthor()
{

	return author_name[Math.floor((Math.random()*author_name.length))];
}

function GetRandomQuote()
{
	return quotes[Math.floor((Math.random()*quotes.length))];
}

/******** Dummy content end *******/


// var tileItem;
// var tileItemCount = 0;

// var itemTable = new Array();
// var itemLimit = 200,itemPtr = 0;

// function GenerateRandomItem()
// {
// 	tileItem = new TileItem();
	
// 	tileItem.tilestyle = Math.floor((Math.random()*6))+1;
// 	if( tileItem.tilestyle == 6 )
// 	{
// 		tileItem.setItemType("quote");
// 	}
// 	else
// 		tileItem.setItemType("news");
// 	tileItem.setHeadline(GetRandomHeadline());
// 	tileItem.setItemID(tileItemCount);
//     tileItem.setSubheading(GetRandomDescription());
//     tileItem.setSource(GetRandomFrom());
//     tileItem.setTime(GetRandomTime());
//     var img = "";
//     switch( tileItem.tilestyle )
//     {
//     	case 1://50% bubble
//     	img = GetRandomImg();
//     	break;
//     	case 2://25% bubble
//     	img = GetRandomImg();
//     	break;
//     	case 3://2x1
//     	img = GetRandomImg2x1();
//     	break;
//     	case 4://1x2
//     	img = GetRandomImg1x2();
//     	break;
//     	case 5://featured
//     	img = GetFeaturedImage();
//     	break;
//     	case 6://quotes
//     	img = GetQuoteImage();
//     	break;
//     }
//     tileItem.setImgsrc(img);
//     if( tileItem.tilestyle == 6 )
//     {
//     	tileItem.setQuotes(GetRandomQuote());
//     	tileItem.setSource(GetRandomAuthor());
//     }
    	
//     tileItem.setCategory(Math.floor((Math.random()*4)));
//     tileItemCount++;
//     return tileItem;
// }

// function Init()
// {
// 	for( var i = 0; i < itemLimit; i++ )
// 	{
// 		itemTable.push(GenerateRandomItem());
// 	}
// }

// Init();

// function GetNextItem()
// {
// 	itemPtr++;
// 	if( itemPtr >= itemTable.length  )
// 		itemPtr = 0;
// 	return itemTable[itemPtr];
// }

// function GetItemAt(id)
// {
// 	if( id < 0 || id >= itemTable.length )
// 		return null;
// 	return itemTable[id];
// }



