//var container;
var button;
//var pckry;
var id=0;

var sideContainer = false;
var scrollToNewsTimer = null;

var numItemsAdded = 0;
var articleCounter = 0;
var itemsInScene = new Array();

var isInBinMode = false;

var prefferdCategoryArray = new Array();
prefferdCategoryArray.push("SCIENCE");
prefferdCategoryArray.push("HEALTH");
prefferdCategoryArray.push("CULTURE");
prefferdCategoryArray.push("TECHNOLOGY");
prefferdCategoryArray.push("TRENDING");
prefferdCategoryArray.push("SPORTS");

document.addEventListener("deviceready", PhonegapDeviceReady, false);

function PhonegapDeviceReady()
{
    console.log( "Device Ready" );
    //Initialize();
}

docReady( function() 
{
    //container = document.querySelector('.packery');
    //pckry = new Packery( container );

    // initBin();

    //AddItems(10);
    //AddItemsToDraggable();

    // bindScroller();

//  InitBinClick();

    // InitCatergoryCheckbox();

    // LoadGoodNews();

    // menu-----------------------------------------------------------------------------------------------

    

    // $(document).on('click', function (e) {
    //     var container = $(".side");
    //     var container2 = $('.user_Pic');
        
    //     if ((!container.is(e.target) // if the target of the click isn't the container...
    //         && container.has(e.target).length === 0)&&(!container2.is(e.target)
    //         && container2.has(e.target).length === 0)) // ... nor a descendant of the container
    //     {
    //         HideSideBar();  
    //     }

    //     container = $("#collection");
    //     container2 = $("#bin");
    //     var hideBin = false;
        
    //     if ((!container.is(e.target) // if the target of the click isn't the container...
    //         && container.has(e.target).length === 0)&&(!container2.is(e.target)
    //         && container2.has(e.target).length === 0)) // ... nor a descendant of the container
    //     {
    //         HideBin();
    //     }
    //     $('.popupbox').hide();
    //     $('.popupbox1').hide();
    //     // $('.packery').removeClass('blur');
    // });

// menu-----------------------------------------------------------------------------------------------


// slider----------------------------------------------------------------
    
    // slider----------------------------------------------------------------

  
    $( "#testbutton" ).click( function(){
        LoadSpeecificNews("BIN");
    });

    // InitNewsPage();
    // InitPullToRefresh();
});

function Initialize()
{
    //So that phone gap plugins are ready
    // checkConnection();
    //CreateLocalDB();
    //FakeNews();
    //GetLatestNewsFromServer(false);
}

// function checkConnection() {
//     var networkState = navigator.connection.type;

//     var states = {};
//     states[Connection.UNKNOWN]  = 'Unknown connection';
//     states[Connection.ETHERNET] = 'Ethernet connection';
//     states[Connection.WIFI]     = 'WiFi connection';
//     states[Connection.CELL_2G]  = 'Cell 2G connection';
//     states[Connection.CELL_3G]  = 'Cell 3G connection';
//     states[Connection.CELL_4G]  = 'Cell 4G connection';
//     states[Connection.CELL]     = 'Cell generic connection';
//     states[Connection.NONE]     = 'No network connection';

//     if( Connection.NONE == networkState )
//         alert("No network found.");
// }





function InitPullToRefresh()
{
    $("#scroller-refresh-view").kendoMobileScroller({
        refreshTemplate: "",
        releaseTemplate: "Loading News...",
        pullTemplate: "Pull to Load more",
        pullToRefresh:true,
        useNative:true,
        pull: function(e) {
            AddItems(4);
            this.pullHandled();
        }
    });
    console.log("InitPullToRefresh");
}


var sideBarVisible = false;
function ToggleSideBar()
{
    if(sideBarVisible)
    {
        HideSideBar();
    }
    else
    {
        ShowSideBar();
    }
}

function ShowSideBar()
{
    sideBarVisible = true;
    $(".side").addClass("in");
}

function HideSideBar()
{
    if( $(".side").hasClass("in") )
        $(".side").removeClass("in");
    sideBarVisible = false;
}
// ===================================================================================================================
function nav_second()
{
    $("#page2").addClass("in");
}

function back()
{
    $("#page2").removeClass("in");
}



//If there are more than 20 items remove based on appension 
// function CleanUp(top)
// {
//     if(numItemsAdded < 15)
//         return;
//     var n = numItemsAdded - 15;
//     console.log('...'+n);
//     if( top )
//     {
//         pckry.removeFirstNItems(n);
//     }
//     else
//     {
//         pckry.removeLasttNItems(n);
//     }
//     numItemsAdded -= n;
// }

function AddItems(count)
{
    for( var i = 0; i < count;  )
    {
        var tileItem = GetNextItem();
        if( tileItem == null )
            return;
        while(1)
        {
            tileItem = GetNextItem();
            if( tileItem.tilestyle == 6 )
                break;
            else
            {
                //if( IsInArray(prefferdCategoryArray,tileItem.category) )
                //{
                    break;   
                //}
                //else
                //{
                 //   continue;
                //}
            }
        }

       AddItem(tileItem);
       i++;
    }
    //AddItemsToDraggable();
    //InitNewsPage();
}

function AddItem(tileItem)
{
    var itemDiv;
    console.log('1');
    switch(tileItem.itemType)
    {
        case "news":
            console.log('2' + tileItem.tilestyle);
            if( tileItem.tilestyle == -1 )
                return;
            if( tileItem.tilestyle == 1 )
            {
                itemDiv = NewsWithDesc(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            }
            if( tileItem.tilestyle == 3 )
            {
                itemDiv = NewsWithDescHori(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            }
            if( tileItem.tilestyle == 4 )
            {
                itemDiv = NewsWithDescVerti(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            }
            // switch(tileItem.tilestyle)
            // {
            //     case 1://50% bubble
            //        itemDiv = NewsWithDesc(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            //     break;
            //     case 2://25% bubble
            //         itemDiv = NewsWithHead(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            //     break;
            //     case 3://2x1
            //         alert('asdads');
            //         console.log('create');
            //         itemDiv = NewsWithDescHori(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            //     break;
            //     case 4://1x2
            //         itemDiv = NewsWithDescVerti(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time, tileItem.color, tileItem.itemID, tileItem.ratingImgsrc);
            //     break;
            //     case 5://featured
            //         itemDiv = feature(tileItem.headline, tileItem.subheading, tileItem.imgsrc, tileItem.source, tileItem.time , tileItem.itemID, tileItem.ratingImgsrc);
            //     break;
            // }
        break;
        case "quote":
            itemDiv = Quotes(tileItem.quotes, tileItem.imgsrc, tileItem.source, tileItem.itemID, tileItem.ratingImgsrc);
        break;
        case "":
        break;
    }
    if(itemDiv != null)
    {
        itemDiv.setAttribute('item_id',tileItem.itemID);
        container.appendChild(itemDiv);
        pckry.prepended(itemDiv);
        // AddItemToDraggable(itemDiv);
        itemsInScene.push(tileItem.itemID);
    }    
    else
    {
        console.log("error");
        tileItem.debug();   
    }   
}

function LoadGoodNews()
{
    $("#good_news_logo").click(function(){
        if( isInBinMode )
        {
            isInBinMode = false;
            AddItems(10);
        }
    });
}

function ChangeRating(event)
{
    var tileitem = GetItemAt($(event.target).attr('item_id'));
    if( tileitem )
    {
        tileitem.changeRating();
        event.target.src = "img/rating/r"+ tileitem.rating +".png";
        var noti = $( '#rating_tooltip', $( event.target.parentNode ) );
        $(noti).show();
        $(noti).attr('src',"img/rating/r"+ tileitem.rating +"a.png");
        $(noti).fadeTo(0,1);
        $(noti).delay(1200).fadeOut(1000);
    }
}

//Helper
function IsInArray(array,id)
{
    for(var i=0;i<array.length;i++) {
        if((array[i]) === (id))
            return true;
    }
    return false;
}

function RemoveInArray(array,id)
{
    for(var i=0;i<array.length;i++) {
        if((array[i]) === (id))
        {
            array.splice(i,1);
        }
    }
    return false;
}



function LoadSpeecificNews(criteria,id)
{
    console.log("total items in scene" + itemsInScene.length);
    var itemsTobeAdded;
    var removeOtherItems = false;
    //Get things to be added list
    if( criteria == "BIN" )
    {
        itemsTobeAdded = GetBinItems(id);
        removeOtherItems = true;
        isInBinMode = true;
    }
    console.log("Bin Item Count: " + itemsTobeAdded.length);

    var items = new Array();
    var itemsRemoved = new Array();
    $(".item").each( function() 
    {
        if( !IsInArray(itemsTobeAdded,$(this).attr("item_id") ) )
        {
            items.push(this);
            itemsRemoved.push($(this).attr("item_id"));
        }
        else
        {
            RemoveInArray(itemsTobeAdded,$(this).attr("item_id"));
        }
    });
    pckry.remove(items);
    pckry.layout();

    for( var i = 0; i < itemsTobeAdded.length; i++ )
    {
        AddItem( GetItemAt(itemsTobeAdded[i]));    
    }

    //packery.remove(items);

    //see if exists

    //add

    //
}

function InitCatergoryCheckbox()
{
    $('#cat1').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("TRENDING");
        } else {
            categoryUnchecked("TRENDING");
        }
    });

    $('#cat2').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("SCIENCE");
        } else {
            categoryUnchecked("SCIENCE");
        }
    });

    $('#cat3').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("TECHNOLOGY");
        } else {
            categoryUnchecked("TECHNOLOGY");
        }
    });

    $('#cat4').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("HEALTH");
        } else {
            categoryUnchecked("HEALTH");
        }
    });

    $('#cat5').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("CULTURE");
        } else {
            categoryUnchecked("CULTURE");
        }
    });

    $('#cat6').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            categoryChecked("SPORTS");
        } else {
            categoryUnchecked("SPORTS");
        }
    });
}

function categoryChecked(category)
{
    AddCategory(category);
}

function categoryUnchecked(category)
{
    RemoveCategory(category);
}

function RemoveCategory(category)
{
    RemoveInArray(prefferdCategoryArray , category);
    RemoveCategoricNews(category);
}

function AddCategory(category)
{
    if( !IsInArray(prefferdCategoryArray,category) )
        prefferdCategoryArray.push(category);
}

function RemoveCategoricNews(category)
{
    var items = new Array();
    $(".item").each( function() 
    {
        var tileItem = GetItemAt( $(this).attr("item_id")); 
        if( tileItem.category == category )
            items.push(this);
    });
    pckry.remove(items);
    pckry.layout();
}

function PrintScroll()
{
    console.log("Scroll " + $(window).scrollTop() );    
}


var itemsAddedTimer;
var itemAddTimeout = true;

///Implementing fake scroller
function bindScroller()
{
    pullToText = $( "#pullToText" );
    
    // $(window).on("touchstart",function () {
    //     console.log("started");
    // });

    $(window).scroll(function () {
        console.log( "Scroll" + $(window).scrollTop() );
        // var elem = $('#fakescroller');
        // if( $(window).scrollTop() < 50 )
        // {
        //      $('html, body').animate({
        //         scrollTop: $(elem).offset().top + 380 
        //     }, 150,"swing"); 
        //      if( itemAddTimeout )
        //      {
        //         //console.log("OnScroll");
        //         if( !isInBinMode )
        //             itemsAddedTimer = setTimeout(function(){
        //                 //AddItems(4);
        //                 //GetNewsFromServer(AddItems);
        //                 //console.log('What ever');
        //             },300);
        //         setTimeout(ItemAddTimer,2000);
        //         itemAddTimeout = false;
        //      }
             
        // }
        // else if( $(window).scrollTop() < 400 )
        // {
        //      $('html, body').animate({
        //         scrollTop: $(elem).offset().top + 380 
        //         }, 150,"swing"); 
        // }
    });
}

function ItemAddTimer()
{
    itemAddTimeout = true;
}
