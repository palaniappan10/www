var delayTime = 300;
var tour = {
   id: 'hello-hopscotch',
   steps: [
       {
         title: "THE MENU",
         content: "Hi there! Tap the profile picture to open up the App Menu.",
         target: "user_Pic",
         placement: "bottom",
         yOffset:-15,
         xOffset:-10,
         onNext: function() {
               ShowMenu();
             }
       },

       {
         title: "THE CATEGORIES",
         content: "Here you can find the news categories.",
         target: "categories",
         placement: "right",
         xOffset:-100,
         yOffset:-30,
         delay: delayTime, 
         onNext: function() {
               show_sub_menu();
             }
       },

       {
         title: "NEWS FILTERS",
         content: "Hit the toggle switch to filter the news categories.",
         target: "world-li",
         xOffset:-150,
         yOffset:-30,
         placement: "right"
       },

       {
         title: "THE SETTINGS",
         content: "This is where you can find the App Settings.",
         target: "settings",
         placement: "right",
         xOffset:-100,
         yOffset:-30,
         onNext: function() {
               ShowSubMenu();
             }

       },

       {
         delay: 300, 
         title: "RENAMING AND CLEARING THE BINS",
         content: "The first button renames the Bin, and the second empties the bin.",
         target: "clear_bin1",
         placement: "right",
         xOffset:40,
         yOffset:-30
       },

       {
         title: "THE BINS",
         content: "Here's where you can collect articles by dragging and dropping into the Bins.",
         target: "second",
         placement: "bottom",
         arrowOffset: 390,
         xOffset:-380,
         yOffset:-50
       },


       {
         title: "AND FINALLY, THE GOOD NEWS!",
         content: "Tap the Good News logo to get new articles. Cheers!",
         target: "good_news_logo",
         placement: "bottom",
         arrowOffset: 230,
         yOffset:-40,
         xOffset:-106,
       }
 ],
 onEnd:function(){
  // $("#tourblackscreen").hide();
  // HideBlackScreen();
  // HideMenu();
  OnTourEnd();
},
onClose:function(){
  OnTourEnd();
},
 nextOnTargetClick: true,
 showPrevButton: true,
 scrollTopMargin: 100
};

function OnTourEnd()
{ 
  $("#tourblackscreen").hide();
  //HideBlackScreen();
  ShowBlackScreen();
  HideMenu();
  ShowWelcomeTile();
  var str = "Good Morning!";
  console.log(fbUser.firstname);
  if( fbUser.firstname != '')
  {
    str = "Good Morning, " + fbUser.firstname + "!";
  }
  $("#wish_id").html(str);  
  setTimeout(function()
  {
    HideBlackScreen();
    HideWelcomeTile();
  },7000);
}


// hopscotch.startTour(tour);
