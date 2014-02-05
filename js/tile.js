var touchEventUsed = false;
var touchEventUsedTarget = null;

var currentDragTarget;

function Tile_Init()
{
  FastClick.attach($("#news_page").get(0));
  $("#news_page").on('click',HideNewsPage);
  wHeight = $(window).height();
  wWidth = $(window).width();
}

function Tile_EnableTileEvents(item,clickCallback,ontouchstartCallback)
{
  FastClick.attach($(item).find("#rating").get(0));
  $(item).find("#rating").on("click",Tile_ChangeTileRating);
  FastClick.attach(item);
  $(item).attr('isVisible',true)
  // Tile_EnableTouchEvents(item,ontouchstartCallback);  
  Tile_EnableClick(item,clickCallback);
  // Tile_EnableDraggable(item);  
}

function Tile_EnableTouchEvents(item,touchStartcallback)
{
  $(item).on('touchstart',function(e)
    {
      touchEventUsed = false;
      touchEventUsedTarget = null;
      if( touchStartcallback )
        touchStartcallback(e);
    });

  $(item).on('touchend',function(e)
    {
      touchEventUsedTarget = e.target;
      start = Date.now();
    });
}

function Tile_EnableClick(item,callback)
{
  $(item).on( 'click',function (e) {
     // console.log(touchEventUsed);
    if((touchEventUsedTarget === e.target)&&touchEventUsed)
      return;
    OpenNewsPage(e);
    if( callback )
      callback(e);
  } );
}

function Tile_EnableDraggable(item)
{
  $(item).kendoDraggable({
      holdToDrag: true,
      hint: function(target) {
          var clone = $(target).clone();
          $(clone).attr("id",'draggableTileClone');
          //$(clone).removeClass();
          //$(clone).addClass("shrink");
          return clone;
      },
      dragstart: Tile_Callback_DragStarted,
      dragend: Tile_Callback_DragStopped
  });
}

// function Tile_EnableDraggable(item)
// {
// 	$(item).kendoDraggable({
//       holdToDrag: true,
//       hint: function(target) {
//           var clone = $(target).clone();
//           $(clone).attr("id",'draggableTileClone');
//           //$(clone).removeClass();
//           //$(clone).addClass("shrink"); 
//           return clone;
//       },
//       // cursorOffset: { top: -50, left: -100 },
//       dragstart: Tile_Callback_DragStarted,
//       dragend: Tile_Callback_DragStopped
//   });
// }


/*  Rating system   */
var delayTimeout;
var delayedTarget;
function Tile_ChangeTileRating(e)
{
  if((touchEventUsedTarget === e.target)&&touchEventUsed)
  {
    console.log('Click ignored.');
     return;
  }
     
  DB_GetItemRating($(e.target).attr('item_id'),
    function(results)
    {
      var rating = results.rows.item(0).rating;
      rating++;

      if( results.rows.item(0).item_type == 0 )
      {
        if( rating > 4 )
          rating = 1;
      }
      else if( results.rows.item(0).item_type == 1 )
      {
        if( rating > 3 )
          rating = 1;
      }
      

      DB_SetItemRating($(e.target).attr('item_id'),rating,function(){});
      e.target.src = "img/rating/r"+ rating +".png";
          var noti = $( '#rating_tooltip', $( e.target.parentNode ) );
          $(noti).show();
          $(noti).attr('src',"img/rating/r"+ rating +"a.png");


          if( delayedTarget === e.target )
          {
            $(noti).stop(true,false);
            $(noti).fadeTo(0,1);
            if( delayTimeout )  
              clearTimeout(delayTimeout);
          }
            
          delayTimeout = setTimeout(function()
          {
            $(noti).fadeOut(1000);
          },1200);
          delayedTarget = e.target;
          //$(noti).stop().delay(1200).fadeOut(1000);
    });
  
}

/* Events */


function Tile_Callback_DragStarted(e)
{
  // navigator.notification.vibrate(1000);
  currentDragTarget = e.target;
	main_TileDragStarted();
}


function Tile_Callback_DragStopped(e)
{
  //console.log("Removing clone : " + e.target.getAttribute('id'));
  currentDragTarget = null;
  main_TileDragStopped();
  if( $("#draggableTileClone") )
      console.log("drag end");
	$("#draggableTileClone").remove();
}


/*          News Page div            */
var scrollToNewsTimer;
var wHeight;
var wWidth;
var newsPageScaleTimer;
function OpenNewsPage(e)
{
  if( !$(e.target).hasClass("item") )
    return;

  DB_GetItemByID($(e.target).attr("item_id"),function (result) {
    var item = result.rows.item(0);
    if( item.item_type != 0 )//if its not a news article
      return;

    AJAX_GetArtcileContentByID(item.news_id,PopulateNewsPage,true);

    $("#news_page").fadeTo(0,1);

    var target = e.target;
    $("#news_page").show();
    // $('#news_page').width(0);
    // $('#news_page').height(0);
    
    // wWidth = 100%;
    // wHeight = 100%;

    $("#news_page").css({left:wWidth/2,top:wHeight/2});

    $('#news_page').animate({
       // height: wHeight,
       // width: wWidth,
       left:0,
       top:100,
    }, 300);
    
    // $("#news_page").fadeTo(800,1);
    $("#news_page").find('h1').html(item.title);
    $("#news_page").find('h2').html(item.source);

    if(item.image_url === "")
        $("#news_page").find('img').hide();
    else
    {
        $("#news_page").find('img').attr("src",item.image_url);
        $("#news_page").find('img').show();
    }
      
    $("#news_page").find('p').html("");

    $("#news_page").removeClass('body');//Hack to remove gray areas in the tag 
   
    $("#news_page >p").css("font-size",settingsFontSize + "em");
    $(".desc .body").css("font-size",settingsFontSize + "em");
    $(".bubblingG_NewsDiv").show();

    $('#news_page').children().hide();

    if( newsPageScaleTimer )
      clearTimeout(newsPageScaleTimer);
    newsPageScaleTimer = setTimeout(function()
      {
        $('#news_page').children().show();
      },300);

    // var expandToNewsPage = !classie.has( target, 'expanding' );
    // classie.toggleClass( target, 'expanding' );
    // // if(tileitem.itemType == "quote")
    // //     return;
    
    // if ( expandToNewsPage ) 
    // {
    //     newsArtilceContent = "";
    //     newsPageScrollComplete = false;

    //     //Delete any existing news page 
    //     RestoreNewsPageItem();

    //     //hide the existing div 
    //     $(target).children().hide();

    //     //Add elements to div 
    //     $(target).append(GetDummyDiv(item));

    //     //apply font size
    //     $(".desc >p").css("font-size",settingsFontSize + "em");
        
    //     //setTimeout( RelayLayout, 100 );
    //     RelayLayout();

    //     scrollToNewsTimer = setTimeout( ScrollToNews, 800 );

    //     AJAX_GetArtcileContentByID(item.news_id,PopulateNewsPage,true);
    // } 
    // else 
    // {
    //     RestoreNewsPageItem();

    //     setTimeout( RelayLayout, 100 );

    //     if( scrollToNewsTimer )
    //     {
    //         clearTimeout(scrollToNewsTimer);
    //         scrollToNewsTimer = null;
    //     }
    // }
  });
  //var tileitem = GetItemAt($(e.target).attr("item_id"));
  
  event.preventDefault();
  event.stopPropagation();
  // console.log('Expanding Item : ' + expandToNewsPage);
}

function RestoreNewsPageItem()
{
    var elem = document.getElementById("newspage_div");
    if( elem != null )
    {
        var parent = elem.parentNode;
        
        classie.removeClass(parent,'expanding' );
        parent.removeChild(elem);
        $(parent).children().show();
        //newspageDiv.remove();
        //parent.attr('class').replace("expanding", "");
        //alert($(parent).attr('id'))
    }
}

function RelayLayout()
{
    pckry.layout();
}

//var scrollAnimationCanceled;
var newsPageScrollComplete;

function ScrollToNews()
{
    // $(".item img").hide();
    var elem = $('#newspage_div');
    $('html, body').animate({
        scrollTop: $(elem).offset().top - 110
    }, 1000,"swing",function()
    {
      newsPageScrollComplete = true;
      if( newsArtilceContent != "" )
        FillArticle();
    });
}

function GetDummyDiv(item)
{
    // var img = document.createElement('img');
    // img.className="newspage_img";
    // //img.src=tileitem.contentImg;
    
    // var desc = document.createElement('div');
    // desc.className="desc";
    // var content = document.createElement('p');
    // //head.innerHTML="It's been talked about and endlessly dissected. It's either the future of professional computing or an overpriced,undersized trash can. It's the new Mac Pro, it's on sale starting today, and I've finally had a chance to hold it in my own two hands. It cuts a striking figure, despite its relatively small stature. It's also incredibly dense, far heavier than I expected. Ten inches tall, 6 inches around, and about weighing in at around 11 pounds, it's definitely meant to be held by its bottom instead of its top lip. <br><br>It's astonishingly reflective &mdash; I can see the screen clearly, and anyone who walks by is immediately recognizable &mdash; and it picks up fingerprints  really easily. But it's beautiful, understated, and looks great on a desk next to the 4K Sharp monitor we've paired it with. It's particularly good&dash;looking with its case off, exposing the Mac Pro's machinery, but the case is required to dissipate heat. You can't even use the Mac Pro with it off. \"All the device's ports are on the back, bordered by a light that turns on and pulses when you spin the computer toward you. When you first     turn it on, the fan kicks in, smelling a little like a new car at first. But we've been using it for a few minutes and it's quiet and cool, with little indication that it's even on in the first place. It's so unassuming and unadorned that you almost overlook it &dash; that's a huge improvement from the big, boxy previous models.    We've only just begun using the Mac Pro, and we\'re already running tests and benchmarks on the new device. There\'s a lot to explore, but one thing's for sure: there\'s never been a computer quite like this before."
    // //head.innerHTML = tileitem.content;
    // desc.appendChild(content);

    // var bubbling = document.createElement('div');
    // bubbling.className="bubblingG_NewsDiv";

    // var bubble_first= document.createElement('span');
    // bubble_first.id="bubblingG_1";
    // var bubble_two= document.createElement('span');
    // bubble_two.id="bubblingG_2";
    // var bubble_three= document.createElement('span');
    // bubble_three.id="bubblingG_3";

    // bubbling.appendChild(bubble_first);
    // bubbling.appendChild(bubble_two);
    // bubbling.appendChild(bubble_three);


    // var head = document.createElement('h1');
    // head.innerHTML=item.title;

    // var time_stamp = document.createElement('h2');
    // time_stamp.innerHTML= item.source ;//+ "&bull;" ;

    // var div = document.createElement('div');
    // div.id = "newspage_div";
    // div.className = "news_div" ;
    // div.appendChild(img);
    // div.appendChild(head);
    // div.appendChild(time_stamp);
    // div.appendChild(desc);
    // div.appendChild(bubbling);
    // return div;
}

var newsArtilceContent;
function PopulateNewsPage(result) 
{
  // console.log(window.atob(result['content']));
  $("#news_page").find('p').html(window.atob(result['content']));
  $('.bubblingG_NewsDiv').hide();
  // newsArtilceContent = window.atob(result['content']);
  // if( newsPageScrollComplete )
  //   FillArticle();
}

function FillArticle()
{
  $("#news_page").find('p').html(newsArtilceContent);
  $('.bubblingG_NewsDiv').hide();
  setTimeout(pckry.layout(),200);
}

var newspageHideTimer;
function HideNewsPage()
{
  if(newspageHideTimer)
    clearTimeout(newspageHideTimer);
  newspageHideTimer = setTimeout(function()
  {
    console.log('Hidden');
    $("#news_page").hide();    
  },300);

    //$("#news_page").hide();
    $("#news_page").find('h1').html('');
    $("#news_page").find('h2').html('');
    $("#news_page").find('img').attr("src",'');
    $("#news_page").find('p').html("");
    $(".bubblingG_NewsDiv").hide();

    $("#news_page").children().hide();
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

   
    $('#news_page').animate({
       // height: 0,
       // width: 0,
       left:wWidth/2,
       top:wHeight/2,
    }, 300);
}

