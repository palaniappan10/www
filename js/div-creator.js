//Create Div From News 
function CreateItemDiv(item)
{
    var itemDiv = null;
    switch(item.item_type)
    {
        case 0://news
            itemDiv = CreateNewsDiv(item);
        break;
        case 1://Quote
            itemDiv = Quotes(item);
        break;
    }
    //console.log();
    if( itemDiv == null )
    {
        console.log( "Item Div wasn't created" + item.item_type);
        //console.log(item);
    }

    return itemDiv;
}

var debug = false;



function CreateNewsDiv(news)
{
    // console.log("Creating News Div " + news.tile_style);
    var categoryText = GetCategoryText(news.category);
    var categoryColor = GetCategoryColor(news.category);
    var ratingImage = GetRatingImg(news.rating);
    var bgColor = GetBackgroundColor(news.category);

    debug = false;

    var tile_style = news.tile_style;
    var image_url = news.image_url;

    if( tile_style === -1 )//If no image is found item style is set to 1x1
    {
        tile_style = 0;
        image_url = GetPlaceHolderImage(news.category);        
        // console.log("changed");
        //debug = true;
    }

    // image_url = "";
    
    switch(tile_style)
    {
        case 0:
            return NewsWithoutImage(news.title,news.source,categoryText,categoryColor,news.id,ratingImage,bgColor);
        break;
        case 1:
            return NewsWithDesc(news.title,image_url,news.source,categoryText,categoryColor,news.id,ratingImage,bgColor);
        break;

        case 3:
            return NewsWithDescHori(news.title, image_url, news.source, categoryText, categoryColor, news.id, ratingImage,bgColor);
        break;

        case 4:
            return NewsWithDescVerti(news.title, image_url, news.source, categoryText, categoryColor, news.id, ratingImage,bgColor);
        break;
        case 5:
        break;
    }
}

function NewsWithoutImage(_headlines, source, category, color, itemID, ratingImg,bgColor)
{
    var under1= source + '&nbsp;'+'&bull;'+ '&nbsp;' + category;
    var imgHeight = "",//"h50",
    bubbleHeight = "bubble_height";

    //Text
    var headlines = document.createElement('div');
    headlines.className += " headlines_withoutimg";
    headlines.innerHTML = _headlines;
    headlines.title="title";
    
    var dash_Vertical=document.createElement('img');
    dash_Vertical.className= "white_dash_color_bubble"
    dash_Vertical.src="img/icon/dash_white.png"
    
    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_one";
    rating.src=ratingImg;
    rating.setAttribute("item_id",itemID);
    // $(rating).click(TileSystem_ChangeTileRating);

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_bubble";
    bin_tap.src=ratingImg;

    
    var under = document.createElement('under_vertical');
    under.innerHTML=under1;
    
    var txt = document.createElement('div');
    txt.appendChild(headlines);
    txt.appendChild(dash_Vertical);
    txt.appendChild(under);
    txt.appendChild(rating);
    txt.appendChild(bin_tap);
    
    rating = rating.cloneNode();
    rating.id = "rating_tooltip";
    rating.className="rating";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);

    var outer = document.createElement('div');
    outer.className ='item' + ' onexone';
    outer.id="parent";
    outer.style.background= bgColor;
    outer.style.cssText += "background-size:100%; ";
    outer.appendChild(txt);

    outer.setAttribute("item_id",itemID);
    
    return outer;
}


function NewsWithDesc(_headlines, img, source, category, color, itemID, ratingImg,bgColor)
{
    if( debug )
    console.log("0");
    var under1= source + '&nbsp;'+'&bull;'+ '&nbsp;' + category;
	var imgHeight = "",//"h50",
	bubbleHeight = "bubble_height";

    if( debug )
    console.log("1");
	//Image
	var imgDiv = document.createElement('img');
	imgDiv.className = "img " + imgHeight + " lazy";
	imgDiv.src= img;
    imgDiv.style.display = "none";
    imgDiv.id = "item_news_image";
    //$(imgDiv).hide();
    $(imgDiv).attr('loaded',false);
    $(imgDiv).on("load",OnImageLoad);
    $(imgDiv).on('inview', ImageInViewportHandler);
    //imagesLoaded( imgDiv, OnImageLoad );

    if( debug )
    console.log("2");
    //Text
    var headlines = document.createElement('headlines_vertical');
    headlines.innerHTML = _headlines;
    headlines.title="title";
    if( debug )
    console.log("3");

    var dash_Vertical=document.createElement('img');
    dash_Vertical.className= "white_dash_color_bubble"
    dash_Vertical.src="img/icon/dash_white.png"
    if( debug )
    console.log("4");

    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_one";
    rating.src=ratingImg;
    rating.setAttribute("item_id",itemID);
    // $(rating).click(TileSystem_ChangeTileRating);
    if( debug )
    console.log("5");

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_bubble";
    bin_tap.src=ratingImg;
    
    var under = document.createElement('under_vertical');
    under.innerHTML=under1;
    
    var txt = document.createElement('div');
    txt.appendChild(headlines);
    txt.appendChild(dash_Vertical);
    txt.appendChild(under);
    txt.appendChild(rating);
    txt.appendChild(bin_tap);
    if( debug )
    console.log("6");

    var preoloader = document.createElement('div');
    preoloader.className = "make_center loading";
    preoloader.id = "preloader";

    rating = rating.cloneNode();
    rating.id = "rating_tooltip";
    rating.className="rating";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);

    //Bubble
    var bubble = document.createElement('div');
    bubble.className= "Normal_Bubble "+ color + " top " + bubbleHeight ;
     
    var tri = document.createElement('div');
    tri.className= "Normal_Bubble_smalltri tri"+ color ;

    bubble.appendChild(tri);
    bubble.appendChild(txt);

    var outer = document.createElement('div');
    outer.className ='item' + ' onexone';
    outer.id="parent";
    outer.style.background= bgColor;
    outer.style.cssText += "background-size:100% 100%; ";
    outer.appendChild(imgDiv);
	outer.appendChild(bubble);
    outer.appendChild(preoloader);

    outer.setAttribute("item_id",itemID);
	
	return outer;
}

function NewsWithDescHori(_headlines, img2, source, category, color, itemID, ratingImgsrc,bgColor)
{
    // var outer = document.createElement('div');
    // outer.className ='item' + ' onextwo ' + color;
    // outer.setAttribute("item_id",itemID);
    // return outer;

    var under1= source + '&nbsp;'+'&bull;'+ '&nbsp;' + category;
    var imgHeight = "";//"h50",
    bubbleHeight = "bubble_height";
    //Image
    var imgDiv = document.createElement('img');
    imgDiv.className = "img " + imgHeight + " lazy";
    imgDiv.src= img2;
    imgDiv.id = "item_news_image";
    //$(imgDiv).on("load",OnImageLoad);
    // imagesLoaded( imgDiv, OnImageLoad );
    // $(imgDiv).lazyload();
    // $(imgDiv).hide();
    $(imgDiv).attr('loaded',false);
    $(imgDiv).on("load",OnImageLoad);
    $(imgDiv).on('inview', ImageInViewportHandler);
    imgDiv.style.display = "none";
    
    //Text
    var headlines = document.createElement('headlines_vertical');
    headlines.innerHTML = _headlines;
    
    var dash_Vertical=document.createElement('img');
    dash_Vertical.className= "white_dash_color_bubble"
    dash_Vertical.src="img/icon/dash_white.png"

    var under = document.createElement('under_vertical');
    under.innerHTML=under1;

    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_one" + " " + "rating_three";
    rating.src=ratingImgsrc;
    rating.setAttribute("item_id",itemID);
    // $(rating).click(TileSystem_ChangeTileRating);

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_bubble";
    bin_tap.src=ratingImgsrc;

    var preoloader = document.createElement('div');
    preoloader.className = "make_center_two_one loading";
    preoloader.id = "preloader";
    
    var txt = document.createElement('div');
    txt.appendChild(headlines);
    txt.appendChild(dash_Vertical);
    txt.appendChild(under);
    txt.appendChild(rating);
    txt.appendChild(bin_tap);
    rating = rating.cloneNode();
    rating.className="rating"
    rating.id = "rating_tooltip";
    rating.className="rating_two_one";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);

    //Bubble
    var bubble = document.createElement('div');
    bubble.className= "Normal_Bubble "+ color + " top " + bubbleHeight ;
     
    var tri = document.createElement('div');
    tri.className= "Normal_Bubble_smalltri tri"+ color;

    bubble.appendChild(tri);

    bubble.appendChild(txt);
    var outer = document.createElement('div');
    outer.className ='item' + ' twoxone';
    
    outer.appendChild(imgDiv);
    outer.appendChild(bubble);
    outer.appendChild(preoloader);
    outer.style.background= bgColor;
    outer.style.cssText += "background-size:100% 100%; ";
    outer.setAttribute("item_id",itemID);
    return outer;
}

function NewsWithDescVerti(_headlines,  img2, source, category, color, itemID, ratingImgsrc,bgColor)
{
    // var outer = document.createElement('div');
    // outer.className ='item' + ' twoxone ' + color;
    // outer.setAttribute("item_id",itemID);
    // return outer;

    var under1= source + '&nbsp;'+'&bull;'+ '&nbsp;' + category;
    var imgHeight = "",
    bubbleHeight = "bubble_height";
    //Image
    var imgDiv = document.createElement('img');
    imgDiv.className = "img " + imgHeight + " lazy";
    imgDiv.src= img2;
    // $(imgDiv).hide();
    imgDiv.id = "item_news_image";
    $(imgDiv).attr('loaded',false);
    $(imgDiv).on("load",OnImageLoad);
    $(imgDiv).on('inview', ImageInViewportHandler);
    // $(imgDiv).lazyload();
    imgDiv.style.display = "none";
    
    //Text
    var headlines = document.createElement('headlines_vertical');
    headlines.innerHTML = _headlines;

    var dash_Vertical=document.createElement('img');
    dash_Vertical.className= "white_dash_color_bubble"
    dash_Vertical.src="img/icon/dash_white.png"

    var under = document.createElement('under_vertical');
    under.innerHTML=under1;

    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_one";
    rating.src=ratingImgsrc;
    rating.setAttribute("item_id",itemID);
    // $(rating).click(TileSystem_ChangeTileRating);

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_bubble";
    bin_tap.src=ratingImgsrc;

    var preoloader = document.createElement('div');
    preoloader.className = "make_center_one_two loading";
    preoloader.id = "preloader";
    
    var txt = document.createElement('div');
    txt.appendChild(headlines);
    txt.appendChild(dash_Vertical);
    txt.appendChild(under);
    txt.appendChild(rating);
    txt.appendChild(bin_tap);
    rating = rating.cloneNode();
    rating.className="rating";
    rating.id = "rating_tooltip";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);

    //Bubble
    var bubble = document.createElement('div');
    bubble.className= "Normal_Bubble "+ color + " top " + bubbleHeight ;
     
    var tri = document.createElement('div');
    tri.className= "Normal_Bubble_smalltri tri"+ color;

    bubble.appendChild(tri);

    bubble.appendChild(txt);
    var outer = document.createElement('div');
    outer.className ='item' + ' onextwo';
    outer.id="parent";
    outer.appendChild(imgDiv);
    outer.appendChild(bubble);
    outer.appendChild(preoloader);
    outer.style.background= bgColor;
    outer.style.cssText += "background-size:100% 100%; ";
    outer.setAttribute("item_id",itemID);
    
    return outer;
}

function feature(_headlines, desc, img2, from, time, itemID, ratingImgsrc)
{
 	var under1= from + '&nbsp;'+'&bull;'+ '&nbsp;' + time;
	var imgHeight = "h100",
	bubbleHeight = "bubble_height";
	//Image
	var imgDiv = document.createElement('img');
	imgDiv.className = "img " + imgHeight;
	imgDiv.src= img2;
    imgDiv.id = "item_news_image";
    $(imgDiv).load(OnImageLoad);
    //Text

    var headlines = document.createElement('headlines_feature');
    headlines.innerHTML = _headlines;
    headlines.style.overFlow = "hidden";
    headlines.title="title";
    var tag = document.createElement('tag_feature');
    tag.innerHTML= "featured story";

    var under = document.createElement('under_feature');
    under.innerHTML=under1;
    
    var dash_Vertical=document.createElement('img');
    dash_Vertical.className= "white_dash_black_bubble";
    dash_Vertical.src="img/icon/dash_white.png";

    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_one" + " " + "rating_three";
    rating.src=ratingImgsrc;
    rating.setAttribute("item_id",itemID);
    $(rating).click(ChangeRating);

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_bubble";
    bin_tap.src=ratingImgsrc;
    
    var subheading = document.createElement('subheading_feature');
    subheading.innerHTML = desc;


    var txt = document.createElement('div');
    txt.appendChild(tag);
    txt.appendChild(headlines);
    txt.appendChild(subheading);
    txt.appendChild(dash_Vertical)
    txt.appendChild(under);
    txt.appendChild(rating);
    txt.appendChild(bin_tap);
    rating = rating.cloneNode();
    rating.className="rating";
    rating.id = "rating_tooltip";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);

    //Bubble
    var bubble = document.createElement('div');
     bubble.className= "Black_shade";

     bubble.appendChild(txt);
     var outer = document.createElement('div');

    outer.className ='item' + ' feature';
    outer.id="parent";
    outer.style.background= color;
	outer.appendChild(imgDiv);
	outer.appendChild(bubble);
	
	return outer;
}


function Quotes(item )//desc, img2, author, itemID, ratingImgsrc
{
    var ratingImage = GetRatingImg(item.rating);
 	var under1= item.source;
	var imgHeight = "h100",
	bubbleHeight = "h100";
	//Image
	var imgDiv = document.createElement('img');
	imgDiv.className = "img " + imgHeight;
	imgDiv.src= item.image_url;
    imgDiv.id = "item_news_image";
    imgDiv.setAttribute('loaded',true);
    
    //Text
   	var quots = document.createElement('Quots');
   	var qimg = document.createElement('img');
   	qimg.src = "img/quotemark.png";

   	quots.appendChild(qimg);

    var sentence = document.createElement('sentence');
    sentence.innerHTML=item.title;

    // var dash_Vertical=document.createElement('div');
    // var dash_img=document.createElement('img')
    // dash_img.className= "black_dash"
    // dash_img.src="img/dash_black.png"
    // dash_Vertical.innerHTML=under1;
    
    var author = document.createElement('author');
    author.innerHTML = "\u2014 " + under1 ;

    var rating= document.createElement('img');
    rating.id="rating";
    rating.className="rating_quotes_one";
    rating.src=ratingImage;
    rating.setAttribute("item_id",item.id);
    // $(rating).click(ChangeRating);

    var bin_tap= document.createElement('img');
    bin_tap.className="bin_tap_quotes";
    bin_tap.src=ratingImage;


    var txt = document.createElement('div');
    txt.appendChild(quots);
    txt.appendChild(sentence);
    // txt.appendChild(dash_Vertical);
    txt.appendChild(author);
    txt.appendChild(rating);
    rating = rating.cloneNode();
    rating.className="rating_quotes"
    rating.id = "rating_tooltip";
    rating.style.cssText += "pointer-events:none;";
    rating.style.visiblity = "hidden";
    txt.appendChild(rating);
    txt.appendChild(bin_tap);

    //Bubble
    var bubble = document.createElement('div');
     bubble.className= "Quotes_bubble "+ "left";

    bubble.appendChild(txt);
    var outer = document.createElement('div');
    outer.className ='item' + ' Quotes';
        outer.id="parent";

	outer.appendChild(imgDiv);
	outer.appendChild(bubble);
    outer.setAttribute("item_id",item.id);
	outer.style.background='#fff';
	return outer;
}

function OnImageLoad(e)
{
    $(e.target.parentNode).find("#preloader").remove();
    $(e.target).attr('loaded',true);
    $(e.target).show();
}

function ImageInViewportHandler(event,visible)
{
    // if( !$(event.target).attr('loaded') )
    //     return;

    if( visible )
        //$(event.target).show();
        event.target.display = "block";
    else
        //$(event.target).hide();
        event.target.display = "none";

    //console.log("Image visible : " + visible);
}

// $('div').bind('inview', function (event, visible, topOrBottomOrBoth) {
//   if (visible == true) {
//     // element is now visible in the viewport
//     if (topOrBottomOrBoth == 'top') {
//       // top part of element is visible
//     } else if (topOrBottomOrBoth == 'bottom') {
//       // bottom part of element is visible
//     } else {
//       // whole part of element is visible
//     }
//   } else {
//     // element has gone out of viewport
//   }
// });


/* HELPER */

function GetCategoryText(category)
{
    switch(category)
    {
        case 0:
            return "Sci-Tech";
        break;
        case 1:
            return "Health";
        break;
        case 2:
            return "Sports";
        break;
        case 3:
            return "Local";
        break;
        case 4:
            return "World";
        break;
    }
    return "";
}

function GetBackgroundColor(category)
{
    var colorValue = "#92a2a2";
    switch(category)
    {
        case 0://Tech
            colorValue = "#92a2a2";
            colorValue = "scitech";
        break;
        case 1://Health
            colorValue = "#31a466";
            colorValue = "health";
        break;
        case 2://Sports
            colorValue = "#c97954";
            colorValue = "sports";
        break;
        case 3://Local
            colorValue = "#eda737";
            colorValue = "local";
        break;
        case 4://World
            colorValue = "#eda737";
            colorValue = "world";
        break;
    }
    //return colorValue;
    return "url('img/goodnewsbubblegradients/"+ colorValue +".png')";
}

function GetPlaceHolderImage(category)
{
    var catImg;
    switch(category)
    {
        case 0:
            catImg = "scitech.png";
        break;
        case 1:
            catImg = "health.png";
        break;
        case 2:
            catImg = "sports.png";
        break;
        case 3:
            catImg = "local.png";
        break;
        case 4:
            catImg = "world.png";
        break;
    }
    return "img/placeholder/" + catImg;
}

function GetCategoryColor(category)
{
    return "color"+category;
}

function GetRatingImg(rating)
{
    return "img/rating/r"+rating+".png";
}