var myScroll;
var prevScrollY,scrollDiff;
var scrollThreshold_VALUE = 3;// 3 percent of the screen
var scrollThreshold;
var scrollContainer;
var winHeight;

var reachBottomThreshold_VALUE = 10;//100 percent of the screen
var reachBottomThreshold = 5;//5 percent of the screen

var cullTimer;
var scrollStartTime;
var scrollStarted;
var scrollerHeight;
var scrollerStartY;

var backToTopSelector;
var backToTopVisible = false;
var backToTopThreshold = 10;//10 pixels

/* Pull to refresh params */
var pullToRefreshHeight;
var pullDownRefesh;
var pullUpRefesh;
var pullDown_Activate = false;
var pullUp_Activate = false;

var newsAdder;// = new NewsAdder();


var cullTimer,cullTimeout = 700;

// window.onresize = function()
// {
// 	ScrollHandler_ComputeParams();
// }

function ScrollHandler_ComputeParams()
{
	winHeight = window.innerHeight;
	scrollThreshold = winHeight * scrollThreshold_VALUE * 0.01;
	reachBottomThreshold = winHeight * reachBottomThreshold_VALUE * 0.01;
	scrollStartTime = new Date().getTime();

	pullToRefreshHeight = winHeight * 0.25;
	$(pullDownRefesh).css({top:"-1000px",height:pullToRefreshHeight});
	$(pullDownRefesh).find('p').css("top",(0.8*pullToRefreshHeight) + "px");

	$(pullUpRefesh).css({top:"-1000px",height:pullToRefreshHeight});
	$(pullUpRefesh).find('p').css("top",(0.2*pullToRefreshHeight) + "px");
}

function ScrollHandler_Init()
{
	scrollThreshold = window.height;

	scrollContainer = $('#container');
	backToTopSelector = $(".back_top");

	pullDownRefesh = $("#pull_down");
	pullUpRefesh = $("#pull_up");
	
	InitBackToTop();

	ScrollHandler_ComputeParams();

	window.addEventListener("orientationchange", ScrollHandler_ComputeParams, false);
	
	newsAdder = new NewsAdder();

	myScroll = new IScroll('#wrapper', { probeType: 3, preventDefaultException:{ className: /(^|\s)item|rating_one(\s|$)/ }});//
	myScroll.on('scrollStart', ScrollHandler_OnScrollStart);
    myScroll.on('scroll', ScrollHandler_OnScroll);
    myScroll.on('scrollEnd', ScrollHandler_OnScrollEnd);
}

function ScrollHandler_OnScrollStart()
{
	scrollStarted = true;
	var prev = scrollStartTime,diff;
	scrollStartTime = new Date().getTime();
	diff = scrollStartTime - prev;

	scrollerStartY = myScroll.y;
	scrollerHeight = $(scrollContainer).height();

	// console.log(scrollerHeight);
	// console.log("Scroll Start " + scrollerStartY);

	ResetPullToRefresh();

	if( cullTimer )
		clearTimeout(cullTimer);
}

function ScrollHandler_OnScroll()
{
	scrollDiff = this.y - prevScrollY;
	prevScrollY = this.y;
	CheckBackToTop(this.y);
	if( (this.y > 0) && (scrollerStartY > -10) )
	{
		$(pullDownRefesh).css({top:this.y - $(pullDownRefesh).height() + 70});
		if( this.y > (pullToRefreshHeight*0.75) && !pullDown_Activate )
		{
			pullDown_Activate = true;
			$(pullDownRefesh).find('p').html('Release To Refresh');
		}	
			// console.log('Can Start Refresh');
	}

	if( (scrollerStartY < (winHeight-scrollerHeight) ) && (this.y < (winHeight-scrollerHeight)) )
	{
		var yValue = winHeight + (this.y - scrollerStartY);
		$(pullUpRefesh).css({top:yValue});
		if( this.y < (scrollerStartY - $(pullUpRefesh).height()*0.75) && !pullUp_Activate )
		{
			pullUp_Activate = true;
			$(pullUpRefesh).find('p').html('Release To Refresh');
		}
	}
}

function ScrollHandler_OnScrollEnd()
{
	scrollStarted = false;
	if( Math.abs(scrollDiff) > 1.5  )//May have second scroll queued
	{
		if( cullTimer )
			clearTimeout(cullTimer);

		cullTimer = setTimeout(CullItems,cullTimeout);
	}
	else
	{
		setTimeout(CullItems,0);
	}

	if( pullUp_Activate )
	{
		pullUp_Activate = false;
		newsAdder.SendAjaxRequest(true,10);
	}

	setTimeout(function()
	{
		$(pullUpRefesh).hide();
		$(pullDownRefesh).hide();
	},0);
	
	// if( HasReachedBottom(this.y,$(scrollContainer).height()) )
	// {
	// 	OnReachBottom();		
	// }
}

function ResetPullToRefresh()
{
	pullUp_Activate = false;
	pullDown_Activate = false;

	$(pullDownRefesh).find('p').html('Pull Down To Refresh');
	$(pullUpRefesh).find('p').html('Pul Up To Refresh');

	$(pullDownRefesh).css({top:-1000+"px"});
	$(pullUpRefesh).css({top:(winHeight+1000)+"px"});

	$(pullUpRefesh).show();
	$(pullDownRefesh).show();
}

function HasReachedBottom(y,height)
{
	// console.log( height + "//" +  y + "//" + winHeight + "//" + reachBottomThreshold );
	if( ( height + y ) < (winHeight + reachBottomThreshold) )
	{
		return true;
	}
	return false;
}




function OnReachBottom()
{
	// console.log('Reached Bottom');
   if( !addingInBottom && !isInBinMode)
   {
   		console.log('Adding News at bottom.');
   		addingInBottom = true;
   		// AddNewsAtBottom();
//   		newsAdder.SendAjaxRequest(true,10);
   }
   // newsAdder.SendAjaxRequest(true,10);
}

function CheckBackToTop(y)
{
	if( y < -backToTopThreshold )//Enable Back to top
	{
		isBackButton = true;
		if( !backToTopVisible )
		{
			backToTopVisible = true;
			$(backToTopSelector).fadeTo(0,1);
		}
	}
	else//disable back to top
	{
		isBackButton = false;
		if( backToTopVisible )
		{
			backToTopVisible = false;
			$(backToTopSelector).fadeTo(0,0.3);
		}
	}
}

function CullItems()
{
	var inViewArray = new Array(),
	notInViewArray = new Array();
	
	$(".item").each(function()
	{
		if( $(this).isInViewport({tolerance:3072}) )
		{
			if( $(this).find('#item_news_image').attr('loaded') == 'true' )
				inViewArray.push(this);
			else
				notInViewArray.push(this);		
		}
		else
		{
			notInViewArray.push(this);
		}
	});
	$(inViewArray).find('#item_news_image').show();
	$(notInViewArray).find('#item_news_image').hide();	
}

function InitBackToTop()
{
	FastClick.attach($(backToTopSelector).get(0));
	$(backToTopSelector).on('click',function()
	{
		if( isInBinMode && isBackButton )
		{
			//Clear add load fresh data
			console.log('Clear And Display Data.');
			ReloadNewsArea();
			isBackButton = false;
			isInBinMode = false;
		}
		else
		{
			myScroll.scrollTo(0, 0, 800);
			// $('html, body').animate({
	  //       	scrollTop: 0
	  //   	}, 300,"swing");	
		}
	});
}