var feedJSON = "https://cdn.rawgit.com/tobiaslei/c5c186ea75d05de6a195/raw/f40a5c0e4eb6106fa650dee82478999a65010ab9/feed.json";
var feedData = {};
var counter = 0;

/**
* Fetches JSON object from server
*/
var fetchJSON = function(callback) {
	$.get(feedJSON, function(data){
		feedData = data;
		console.log(data);
		callback();
	})
};


/**
*  Loads n number of new items
*/
var load = function(howMany){
	for(var i = 0; i< howMany; i++) {
		//if run out of items to load, replace loading css with end of feed string
		if(counter >= feedData['feed'].length) {
			$('footer img').remove();
			$('footer').append('<div><p> ---You have reached the end of the feed---</p></div');
			return false;
		}

		//append box to body conttainer
		$("body .container").append(boxCreate(counter++) );
	}

	return true;
}

/**
* This method creates the box template
*
* @param i position of item in feed data array
* @return Returns the html form of box
*/
var boxCreate = function(i) {

	var imageSliderCreator = function(imgArr) {
		var image = '';
		for(var i = 0; i< imgArr.length; i++) {
			if(i === 0) image += "<div class='slide active-slide'><img src='" + imgArr[i]['image'] + "' ></div>"  ;
			else image += "<div class=slide><img src='" + imgArr[i]['image'] + "' ></div>"  ;
		}

		var dots = "<a href='#' class='arrow-prev'><img src='arrow-prev.png'></a>";
		dots += '<ul class="slider-dots"><li class="dot active-dot">&bull;</li>'
		for(var i = 1; i< imgArr.length; i++) {
			dots += '<li class="dot">&bull;</li>' ;
		}
		dots += "</ul><a href='#' class='arrow-next'><img src='arrow-next.png'></a>";
		return "<div class=slider>"+ image +"</div>" + "<div class='slider-nav'>" + dots + "</div>";
	}

	var box = '';
	var item = feedData['feed'][i];
	var line1 = "<div>" + item['fashionista']["full_name"] + " just found a " + item['category'] + '</div>';
	var line2 = "<div> location: " + item['fashionista']['location'] + "  time: " + $.timeago(item['released_at']) + "</div>";

	var details = "<div> brand:" + item['brand'] + " | CN" + item['sale_price'] + "</div>";
	var description = "<div>" + item['sale_description'] + "</div> <div><p></p></div>";

	box = "<div class=box>" + line1 + line2  + imageSliderCreator(item["images"])+ details + description + "</div>";
	return box;
}

/**
* When DOM is ready, load inital feed
*/
$(document).ready(function() {
	opts = {
		offset: '100%'
	};

	//fetch initial feed 
	fetchJSON(function(){
		//infinite scroll listener
		$('footer').waypoint(function(event, direction) {
			$('footer').waypoint('remove');
			//if there is no more to load, remove infinite scroll
			if( load(1)) $('footer').waypoint(opts);
		}, opts);
	});

	$('body').on('click', '.arrow-next', function(e) {
	  e.preventDefault();

	  var $box = $(this).parent().parent();
	  var currentSlide = $box.find('.active-slide');
	  var nextSlide = currentSlide.next();

	  var currentDot = $box.find('.active-dot');
	  var nextDot = currentDot.next();

	  if(nextSlide.length === 0) {
	    nextSlide = $box.find('.slide').first();
	    nextDot = $box.find('.dot').first();
	  }
	  nextSlide.addClass('active-slide');
	  currentSlide.removeClass('active-slide');
	  currentDot.removeClass('active-dot');
	  nextDot.addClass('active-dot');
	});


	$('body').on('click', '.arrow-prev', function(e) {
		e.preventDefault();

		var $box = $(this).parent().parent();
	  var currentSlide = $box.find('.active-slide');
	  var prevSlide = currentSlide.prev();

	  var currentDot = $box.find('.active-dot');
	  var prevDot = currentDot.prev();

	  if(prevSlide.length === 0) {
	    prevSlide = $box.find('.slide').last();
	    prevDot = $box.find('.dot').last();
	  }
	  prevSlide.addClass('active-slide');	  
	  currentSlide.removeClass('active-slide');

	  currentDot.removeClass('active-dot');
	  prevDot.addClass('active-dot');
	});

});




