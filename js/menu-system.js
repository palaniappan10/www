var menuVisible = false;
var subMenuVisible = false;
var aboutPageVisivle = false;
var disclaimerPageVisivle = false;
var categoryMenuVisible = false;

//Settings data
var settingsFontSize = 1.5;
var settingsCategoryArray =new Array(0,1,2,3,4);

var menuDiv;
var userPicDiv;
var userNameDiv;
var aboutPageDiv;
var disclaimerPageDiv;

function MenuSystem_Init()
{
  console.log("Initiating Menu system");

  menuDiv = $(".gn-menu-wrapper");
  userPicDiv = $('#user_click_area');
  userNameDiv = $('#user_click_area');
  aboutPageDiv = $(".popupbox");
  disclaimerPageDiv = $(".popupbox1");

  FastClick.attach($('#user_click_area').get(0));
  //FastClick.attach($('.user_name').get(0));

  FastClick.attach($('#settings').get(0));
  FastClick.attach($('#back').get(0));
  FastClick.attach($('#about_news').get(0));
  FastClick.attach($('#about_news1').get(0));
  // FastClick.attach($('#about_news').get(1));
  FastClick.attach($('#disclaimer').get(0));
  //FastClick.attach($('#categories').get(0));

  FastClick.attach($('#world').get(0));

  InitiBlackScreen();

	$('#user_click_area').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      return ToggleMenu();
    });

  // $('.user_name').on('click',function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return ToggleMenu();
  //   });

FastClick.attach($('.balSlider').get(0));

  $(".balSlider").kendoSlider({
                orientation: "horizontal",
                min: 1,
                max: 5,
                smallStep: 1,
                largeStep: 1,
                showButtons: false,
                slide:function(e){
                    var val = 1.5 + (e.value-1) * 0.35;
                    settingsFontSize = val;
                    $(".desc >p").css("font-size",val + "em");
                    $(".desc .body").css("font-size",val + "em");
                    // console.log(e.value);
                },
                dragHandleTitle: "",
                leftDragHandleTitle: "",
                tickPlacement: "none",
                tooltip:{enabled:false}
            });

  $("#settings").on("click",ShowSubMenu);

  $("#back").on("click",HideSubMenu);

  $("#about_news").on("click",ShowAboutPage);
  $("#about_news1").on("click",ShowAboutPage);

  $("#disclaimer").on("click",ShowDisclaimerPage);

  $("#categories").on('click',function(e)
  {
      if( $(e.target) === $('#world-li') || $('#world-li').has($(e.target)).length !== 0  )
      {
        e.stopPropagation();
        return ;
      }

      if( $(e.target) === $('#local-li') || $('#local-li').has($(e.target)).length !== 0  )
      {
        e.stopPropagation();
        return ;
      }

      if( $(e.target) === $('#sci-tech-li') || $('#sci-tech-li').has($(e.target)).length !== 0  )
      {
        e.stopPropagation();
        return ;
      }

      if( $(e.target) === $('#health-li') || $('#health-li').has($(e.target)).length !== 0  )
      {
        e.stopPropagation();
        return ;
      }

      if( $(e.target) === $('#sports-li') || $('#sports-li').has($(e.target)).length !== 0  )
      {
        e.stopPropagation();
        return ;
      }
        
      if( categoryMenuVisible )
      {
        hide_sub_menu();
      }
      else
      {
          show_sub_menu();
      }
      
  });
  
  $("#gn-menu").on("touchmove",function(e)
  {
    if( $(e.target) === $(".balslider") || $(".balslider").has($(e.target)).length !== 0 )
    {
        return true;
    }
      
    if( $(e.target) === this || $(this).has($(e.target)).length !== 0 )
    {
      e.preventDefault();
      e.stopPropagation(); 
    }
  });

    MenuSystem_InitCategories();

    console.log("Menu system Initialized.");
}

function MenuSystem_InitCategories()
{
  FastClick.attach($('#sci_tech').get(0));
  FastClick.attach($('#health').get(0));
  FastClick.attach($('#local').get(0));
  FastClick.attach($('#sports').get(0));
  FastClick.attach($('#world').get(0));

  $('#sci_tech').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            Menu_AddCategory(0);
        } else {
            Menu_RemoveCategory(0);
        }
    });

  $('#health').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            Menu_AddCategory(1);
        } else {
            Menu_RemoveCategory(1);
        }
    });

  $('#sports').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            Menu_AddCategory(2);
        } else {
            Menu_RemoveCategory(2);
        }
    });

  $('#local').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            Menu_AddCategory(3);
        } else {
            Menu_RemoveCategory(3);
        }
    });

  $('#world').click(function() {
    var $this = $(this);
        if ($this.is(':checked')) {
            Menu_AddCategory(4);
        } else {
            Menu_RemoveCategory(4);
        }
    });
}

function Menu_AddCategory(catID)
{
  settingsCategoryArray.push(catID);
  ReloadNewsArea();
  //console.log(settingsCategoryArray.toString());
}

function Menu_RemoveCategory(catID)
{
  var index = settingsCategoryArray.indexOf(catID);
  if (index > -1) {
      settingsCategoryArray.splice(index, 1);
  }
  TileSystem_CategoryChanged();
  // console.log(settingsCategoryArray.toString());
}

function ToggleMenu()
{
  // console.log('Toggle Menu' + menuVisible);
  if( menuVisible )
  {
    HideBlackScreen();
    return HideMenu();
  }
  else
  {
    return ShowMenu();
  }
}

function HideMenu()
{
  if( menuVisible )  
  {
    HideSubMenu();
    $("#menu_page").removeClass("gn-open-all");
    menuVisible = false;
    return true; 
  }
  return false;
}

function ShowMenu()
{
    HideEveryPopupMenu();
    $("#menu_page").addClass("gn-open-all");
    menuVisible = true;
    ShowBlackScreen();  
    return true;
}

function ShowSubMenu()
{
  $("#settings_page").addClass("gn-open-all");
  ShowBlackScreen();
}

function  HideSubMenu() 
{
    $("#settings_page").removeClass("gn-open-all");
}

function ShowAboutPage()
{
    HideEveryPopupMenu();
    //$(".body").addClass("light");
    $(".popupbox").show();
    aboutPageVisivle = true;
    HideMenu();

    ShowBlackScreen(); 
}

function HideAboutPage()
{
    if( aboutPageVisivle )
    {
      $(".body").removeClass("light");
      $(".popupbox").hide();
      return true;
    }
    return false;
}

function ShowDisclaimerPage()
{
  HideEveryPopupMenu();
  disclaimerPageVisivle = true;
  $(".popupbox1").show();
  HideMenu();
  ShowBlackScreen();
}

function HideDisclaimerPage()
{
  if( disclaimerPageVisivle )
    {
      $(".popupbox1").hide();
      return true;
    }
    return false;
}

function hide_sub_menu()
{
  categoryMenuVisible = false;
  $('.gn-submenu').hide();
}

function show_sub_menu()
{
  categoryMenuVisible = true;
  $(".gn-submenu").show();
  $(".gn-submenu").addClass("fadeIn animated");
}

function InitiBlackScreen()
{
  FastClick.attach($("#blackscreen").get(0));
  $("#blackscreen").on('click touchmove',BlackScreenClick);
}

function ShowBlackScreen()
{
  //$("#blackscreen").show();
  $("#blackscreen").addClass('disable_background');
  //console.log('Show Black Screen');
}

function HideBlackScreen()
{ 
  //$("#blackscreen").hide();
  $("#blackscreen").removeClass('disable_background');
  //console.log('Hide Black Screen');
}

function BlackScreenClick(e)
{
  //Hide Everything
  HideBlackScreen();
  HideMenu();
  HideAboutPage();
  HideDisclaimerPage();
  HideBin();
  HideWelcomeTile();
  e.preventDefault();
}

function HideEveryPopupMenu()
{
  HideMenu();
  HideAboutPage();
  HideDisclaimerPage();
  HideBin(); 
}

function HideWelcomeTile()
{
  $("#welcome_tile").hide();
}

function ShowWelcomeTile()
{
  $("#welcome_tile").show();
}