var dragStarted;
var fadebinTimer;
var binVisible;
var minimumFadeTime = 2000;
var binDiv;
var collectionDiv;

//var kendoDrag;

var binCollection = new Array();
binCollection[0] = new Array();
binCollection[1] = new Array();
binCollection[2] = new Array();
binCollection[3] = new Array();

var binNames = new Array();
binNames[0] = "Bin 1";
binNames[1] = "Bin 2";
binNames[2] = "Bin 3";
binNames[3] = "Bin 4";

var binDivs = new Array;

var smallDraggableDiv = "smallDraggableDiv";

function BinSystem_init()
{
  HideBin();
  binVisible = false;

  binDiv = $('#bin');
  collectionDiv = $('#collection');
  
  FastClick.attach($('#collection').get(0));

  InitBinClick();

  $("#collection").on('click',function()
  {
      // console.log('Toggle');
      if( binVisible )
      {
        HideBin();
        $("#collection").removeClass("highlight");
        HideBlackScreen();
      }
      else
      {
          ShowBin();
          FadeBin(5000);
          this.className += " highlight";
      }
      
  });

  binDivs[0] = $( "#bin1" );
  binDivs[1] = $( "#bin2" );
  binDivs[2] = $( "#bin3" );
  binDivs[3] = $( "#bin4" );

  $("#bin1").kendoDropTarget({
      drop: DroppedInBin1
  });

  $("#bin2").kendoDropTarget({
      drop: DroppedInBin2
  });

  $("#bin3").kendoDropTarget({
      drop: DroppedInBin3
  });

  $("#bin4").kendoDropTarget({
      drop: DroppedInBin4
  });

  BinSettings_init();
  
  // AddItemsToDraggable();
}

var startTime,stopTime;

// function AddItemsToDraggable()
// { 
//   $(".item").kendoDraggable({
//       holdToDrag: true,
//       hint: function(target) {
//           var clone = $(target).clone();
//           $(clone).removeClass();
//           $(clone).addClass("shrink");
//           return clone;
//       },
//       cursorOffset: { top: -50, left: -100 },
//       dragstart: DragStarted,
//       dragend: DragStopeed
//   });

//   return;
// }

// function AddItemToDraggable(item)
// { 
//   $(item).kendoDraggable({
//       holdToDrag: true,
//       hint: function(target) {
//           var clone = $(target).clone();
//           $(clone).removeClass();
//           $(clone).addClass("shrink");
//           return clone;
//       },
//       cursorOffset: { top: -50, left: -100 },
//       dragstart: DragStarted,
//       dragend: DragStopeed
//   });
//  return;
// }

function ShowBin()
{
  HideEveryPopupMenu();
  $( '#bin' ).show();
  binVisible = true;
  ShowBlackScreen();
}

function FadeBin(fadeTime)
{
  fadebinTimer = setTimeout(HideBin,fadeTime);
}

function HideBin()
{
  if( fadebinTimer )
  {
    HideBlackScreen();
  }
  clearTimeout(fadebinTimer);
  fadebinTimer = null;  
  if(binVisible)
  {
    binVisible = false;
    $( '#bin' ).hide();
    $("#collection").removeClass("highlight");
    return true;
  }
  return false;
}

function Bin_callback_DragStarted()
{
  dragStarted = true;
  $( '#bin' ).fadeIn(100);
  $("#collection").addClass("highlight");
  clearTimeout(fadebinTimer);
  fadebinTimer = null; 
  binVisible = true;
}

function Bin_callback_DragStopeed()
{
    dragStarted = false;
    FadeBin(1000);
}

function CreateSmallDraggableDiv(id)
{
  var item = GetItemAt(id);
  var img = document.createElement('img');
  img.src = item.imgsrc;
  img.style.cssText = "position:relative;top:50%;left:50%;width:100px;height:100px;overflow:hidden;";

  var div = document.createElement('div');
  div.id = smallDraggableDiv;
  div.appendChild(img);
  return div;
}

function DroppedInBin(binNum,event)
{
  var itemID = $(event.target).attr('item_id');
  console.log("Dropped : " + event.target.className);
  
  //var tileItem = GetItemAt(itemID); 
var droppedInDialogTimer = null;
  DB_GetItemByID($(event.target).attr('item_id'),function (result) {
    if( result.rows.length == 0 )
      return;

      DB_AddItemToBin(itemID,binNum,function (addResult) {
        DB_GetBinItemByID( addResult.insertId,binNum,function(binItemResult)
        {

          var wWidth = $(window).width();
          var dWidth = wWidth * 0.50;
          var dpos = wWidth * 0.25;
          var wHeight = $(window).height();
          var dHeight = wHeight * 0.50;

           console.log("Bin " + binItemResult.rows.length);
           $(binDivs[binNum-1]).prepend(CreateBinItem(binNum,binItemResult.rows.item(0)));

           $( "#DroppedInBinDialog" ).dialog(
            { 
              position: ['top', dpos] , 
              width:dWidth , 
              height:dHeight
            }); 
           if( droppedInDialogTimer != null )
           {
              clearTimeout(droppedInDialogTimer);
              droppedInDialogTimer = null;
           }
           droppedInDialogTimer = setTimeout(function(){
              $( "#DroppedInBinDialog" ).dialog('close'); 
           },2000);

        });
      });
  });
}

function DroppedInBin1(event)
{
  DroppedInBin(1,event);
}

function DroppedInBin2(event)
{
  DroppedInBin(2,event);
}

function DroppedInBin3(event)
{
  DroppedInBin(3,event);
}

function DroppedInBin4(event)
{
  DroppedInBin(4,event);
}


function GetBinItems(binID)
{
    return binCollection[binID].slice(0);
}

function CreateBinItem(binNum,tileItem)
{
  var img = document.createElement("img");
  img.src = tileItem.image_url;

  var p = document.createElement("p");
  p.innerHTML = tileItem.title;
  p.className="head";

  var color = 'color0';
  if(tileItem.item_type == 0)//news
  {
    color = 'color' + tileItem.category;  
  }
  else if(tileItem.item_type == 1)//quote
  {
    color = 'colorWhite';
    $(p).css('color', '#000');
  }
  
  var prepend= "tris";

  var tri_color=prepend.concat(color);
  var empty = document.createElement('div');

  var bubble = document.createElement('div');
  bubble.className= "bubble"+ " left" +" " +color;

  // var bubble2 = document.createElement('div');
  // bubble2.className= "bubble_smalltri" +" " +tri_color;
  // bubble.appendChild(bubble2);

  bubble.appendChild(p);

  var div = document.createElement("div");
    empty.className='inside_bin'
  empty.appendChild(img);
  empty.appendChild(bubble);
  div.appendChild(empty);

  div.id = "BinItem";// + binNum;

  return div;
}

function InitBinClick()
{
    FastClick.attach($("#bin1").get(0));
    FastClick.attach($("#bin2").get(0));
    FastClick.attach($("#bin3").get(0));
    FastClick.attach($("#bin4").get(0));

    $("#bin1").on('click',function(e)
    {
        LoadBinArticles(1);
        e.stopPropagation();
        e.preventDefault();
        
    });

    $("#bin2").on('click',function(e)
    {
        LoadBinArticles(2);
        e.stopPropagation();
        e.preventDefault();
    });

    $("#bin3").on('click',function(e)
    {
        LoadBinArticles(3);
        e.stopPropagation();
        e.preventDefault();
    });

    $("#bin4").on('click',function(e)
    {
        LoadBinArticles(4);
        e.stopPropagation();
        e.preventDefault();
    });
} 


function LoadBinArticles(binID)
{
  console.log('Load bin articles');
  DB_GetBinItems(binID, function(results)
    { 
        console.log("Article count : " + results.rows.length);
        LoadBinItems(results.rows);
    });
}


function BinSettings_init()
{
  document.getElementById("bin_name1").innerHTML= binNames[0];
  document.getElementById("sub_bin1").innerHTML= binNames[0];

  document.getElementById("bin_name2").innerHTML= binNames[1];
  document.getElementById("sub_bin2").innerHTML= binNames[1];

  document.getElementById("bin_name3").innerHTML= binNames[2];
  document.getElementById("sub_bin3").innerHTML= binNames[2];

  document.getElementById("bin_name4").innerHTML= binNames[3];
  document.getElementById("sub_bin4").innerHTML= binNames[3];


    $("#rename_bin1").on('click',function()
      {
        var new_name=rename(1);
        // alert('bin1');
      });

    $("#rename_bin2").on('click',function()
      {
        var new_name=rename(2);
        // alert('bin2');

      });

    $("#rename_bin3").on('click',function()
      {
        // alert('bin3');
        var new_name=rename(3);
      });
    $("#rename_bin4").on('click',function()
      {
        var new_name=rename(4);
      });

    $("#clear_bin1").on('click',function()
      {
        ClearBinbyID(1);
      });
    $("#clear_bin2").on('click',function()
      {
        ClearBinbyID(2);
      });
    $("#clear_bin3").on('click',function()
      {
        ClearBinbyID(3);
      });
    $("#clear_bin4").on('click',function()
      {
        ClearBinbyID(4);
      });
}

function ClearBinbyID(id)
{
    HideBlackScreen();
    HideMenu();
    var wWidth = $(window).width();
    var dWidth = wWidth * 0.80;
    var dpos = wWidth * 0.15;
    var wHeight = $(window).height();
    var dHeight = wHeight * 0.50;

   $( "#clear_bin" ).dialog({
      resizable: false,
      width:dWidth,
      height:dHeight,
      modal: true,
      position: ['top', dpos],
      position: 'center',
      //title:"Clearing Bin !!!",
      open:function(event,ui){
        //$(this).html("Are you sure you want to clear " + binNames[id-1] + "?" );
      },
      buttons: {
        "Clear": function() {
          $( this ).dialog( "close" );
          ClearBin(id);
        },
        Cancel: function() {
            $( this ).dialog( "close" );
        }
      }
    });
}

var clearBinTimer = null;
function ClearBin(binID)
{
  DB_ClearBin(binID,function(){console.log("bin cleared successfully");});
  var st = "#bin" + binID + " " + "#BinItem"; 
  $(st).remove();
  var clearedStr = "Cleared " + binNames[binID-1];
  
  var wWidth = $(window).width();
  var dWidth = wWidth * 0.50;
  var dpos = wWidth * 0.25;
  var wHeight = $(window).height();
  var dHeight = wHeight * 0.50;

  $("#clear_bin_success").dialog({
    position:['top',dpos],
    width:dWidth,
    height:dHeight,
    title:clearedStr
  });
  if( clearBinTimer != null ) 
    clearTimeout(clearBinTimer);
    clearBinTimer = setTimeout(function()
    {
        $("#clear_bin_success").dialog('close');
    },2500);
}

function rename(binNum)
{
  var new_name = prompt("Rename Bin \n Minimum 1 character, maximum 10 characters", binNames[binNum-1]);
  update_bin_name(new_name,binNum);
}

var binRenameTimer = null;
function update_bin_name(new_name,binNum)
{
  var oldName = binNames[binNum-1];
  binNames[binNum-1] = new_name;
  var rename_bin = null;
  var binid = "#bin_name" + binNum;
  var subMenuid = "#sub_bin" + binNum;

  $("#bin_name" + binNum).html(binNames[binNum-1]);
  $("#sub_bin" + binNum).html(binNames[binNum-1]);

  HideBlackScreen();
  HideMenu();
  $( "#rename_bin" ).dialog({ position: ['top', 700] , width:768 , height:300,
  open:function(event,ui){
    $(this).html(""+oldName+" has been renamed to "+new_name+".");
  }}); 
           if( binRenameTimer != null )
           {
              clearTimeout(binRenameTimer);
              binRenameTimer = null;
           }
           binRenameTimer = setTimeout(function(){
              $( "#rename_bin" ).dialog('close'); 
           },2000);
  
}
  
  //document.getElementById("bin_name" + binNum).innerHTML= binNames[binNum-1];
  //document.getElementById("sub_bin"+ binNum).innerHTML= binNames[binNum-1];
  
  

  // else if(value == 'Bin 2')
  // {
  // document.getElementById("bin_name2").innerHTML= new_name;
  // document.getElementById("sub_bin2").innerHTML= new_name;
  // }

  // else if(value == 'Bin 3')
  // {
  // document.getElementById("bin_name3").innerHTML= new_name;
  // document.getElementById("sub_bin3").innerHTML= new_name;
  // }

  // else if(value == 'Bin 4')
  // {
  // document.getElementById("bin_name4").innerHTML= new_name;
  // document.getElementById("sub_bin4").innerHTML= new_name;
  // }
// }

function feed_back_call()
{
  var kendoWindow = $("<div />").kendoWindow({
            title: "Confirm",
            resizable: true,
            modal: true
        });
    
    kendoWindow.data("kendoWindow")
        .content($("#confirmation").html())
        .center().open();
    
    kendoWindow
        .find(".ok")
            .click(function() {                
                kendoWindow.data("kendoWindow").close();
            })
            .end()
}
