if ( undefined !== window.jQuery ) {
  jQuery(function ($) { 'use strict';

/* Helpers */
	
	if( window.gc === undefined ){ window.gc = {};}
	
	gc.removeHash = function () { 
	    history.pushState("", document.title, window.location.pathname + window.location.search);
	};
	
	gc.stripTrailingSlash = function(str) {
	    if(str.substr(-1) === '/') {
	        return str.substr(0, str.length - 1);
	    }
	    return str;
	};
	
	
	/* easeOutQuint */
	$.extend( jQuery.easing, {
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		}
	});
	
	
/* Generic Functions */
	
	//UX Friendly scroll
	gc.scrollTo = function ( $here ) {
		
		console.log( $here );
		
		//Stop Immediatelly for Scrolling
		$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
			$('html, body').stop();
			$("body").removeClass("disable-hover");
		});
		
		
		$("body").addClass("disable-hover");//disable hovering for 60fps scolling
		
		$('html, body').animate({
			scrollTop: $here
		
		}, 2500, 'easeOutQuint', function() {
			//Unbind Stop for Scrolling
			$("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
			$("body").removeClass("disable-hover");
		});
		
		return false;
	};
	
	
	// This code fires every time a user resizes the screen and only affects .post elements
	// whose parent class isn't .container. Triggers resize first so nothing looks weird.
	
	
	/* Header */
	
	var wh;
	var ww;
	
	$(window).on('resize', function() {
		
		var $media = $(".hero-background > img");
		var $section = $(".hero-media .hero-section");
		var sectionHeight = $section.outerHeight();
		
		wh = window.innerHeight;
		ww = window.innerWidth;
		
		var ratio = 9/16;
		
		var heroHeight = wh+"px";//-25; 
		var maxHeroHeight = Math.round( ww*ratio )+"px";
		
		if( $("body").hasClass("single-ai1ec_event") ){// if it's an event
			maxHeroHeight = 500+"px";
			heroHeight = "";
		}
		
		if( $(".page-header .hero-content").text().length > 0 ){
			heroHeight = "";
			if( ww < 900 ) {
				maxHeroHeight = "";
			}
		}
		 
		$section
			.css("height", heroHeight)
			.css("max-height", maxHeroHeight);
			
		
		$media.each(function() {
			
			if( Math.round( ww*ratio ) > wh ) {
				
				var top_offset = Math.round(
					(
						( ww*ratio ) - wh
					)/2
				);
				
				$(this).css("margin-top", -top_offset+"px");
					
			} else {
				
				if( $(this).css("margin-top") ) {
					$(this).css("margin-top", "");
				}
				
			}
			
		});
			
	}).trigger('resize');
	
	
	
	//Video and Legacy Hereos
	
	
	function loadVideo(url) {
		
    	$("#frame").attr('src', url );
		
		gc.scrollTo( 0 );
		
		$("html").addClass("frame-active");
		
	}
	
	
	function loadFromHash(status) {
	
		switch(status) {
		  case "#video":
		  			
		  		var videoUrl = $("#hero-invite").data('video');
		  		
		  		console.log( videoUrl );
		  		
		  		loadVideo( videoUrl );
		  		
		  	break;
		  case "#legacyvideo":
		  			
		  		loadVideo('https://player.vimeo.com/video/158067704?byline=0&portrait=0&badge=0&color=d8d8d8&autoplay=1');
		  		
		  	break;
		  case "#legacylearn":
		  	
		  		loadVideo('//e.issuu.com/embed.html#23403716/33147814');
		  		
		  		$("#frame").css('width', 'calc( 100% + 125px )');
		  		
		  	break;
		  	
		  case "#legacycommit":
		  		
		  		var commitLink = '//gutschurch.typeform.com/to/e9CDYm';
		  		
		  		if( gc.heroes.height() >= 415 ){
		  			loadVideo(commitLink);
		  			
		  		} else {
			  		window.location.href = commitLink;
		  		}
		  		
		  	break;
		  case "#heroclose":
		  	
		  	$("html").removeClass("frame-active");
		  	$("#frame").attr('src', '' ).css('width', '100%');
		  	gc.removeHash();
		  	
			break;
		  default:
		 
		}//switch(mode)
		
	}
	
	
	function locationHashChanged() {
		
		var status;
	    
	    status = location.hash;
	    
	    console.log("The browser supports the hashchange event! "+status);
	    
	    loadFromHash(status);
	    
	    
	}
	
	//Load Video from Hash
	if(window.location.hash !== "") {
		
		loadFromHash(window.location.hash);
		
	}
	
	//Hash Listener
	window.onhashchange = locationHashChanged;
	
	
	//End Legacy and Video Heroes
	
	

	
	
	
	/*
	
	Boxes
	
	*/
	
	
	//Hero Slickize
	gc.heroes = $('.hero-slick .hero-section');
		
	gc.heroesSlick = gc.heroes.slick({
		arrows: !Modernizr.touch,
		autoplay: true,
		accessibility: true,
		autoplaySpeed: 8000,
		speed: 750,
		fade: !Modernizr.touch,
		easing: 'easeOutQuint'
	});
	
	
	//Slider Boxes
	
	function slickize($boxesContainer){
			
		var $frame = $boxesContainer.find('.frame'); window.frr = $frame;
		
		var slidesToShow = $frame.data("show");
		
		$frame.find("ul").slick({
			arrows: !Modernizr.touch,
			//accessibility: false,
			infinite: false,
			speed: 750,
			slide: 'li',
			slidesToShow: slidesToShow,
			slidesToScroll: slidesToShow,
			easing: 'easeOutQuint',
			variableWidth: $boxesContainer.hasClass("double-stacked"),
			responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			}]
		});
	}
	
	
	//Masonry Boxes
	function masonize($boxesContainer){
		
		// Takes the gutter width from the bottom margin
		var $frame = $boxesContainer.find('.frame'); window.frr = $frame;
		var $list = $boxesContainer.find('.frame ul');
		var $firstItem =		$list.find("li:first-child");
		var $itemSelector =	$list.find("li");
		var gutter =		parseInt($itemSelector.css('marginBottom'));
		var slidesToShow = $frame.data("show");

		
		// Creates an instance of Masonry
		var $boxesMason = $list.masonry({
			gutter: gutter,
			itemSelector: 'li',
			columnWidth: 'li:first-child'
		});
		
		var frameHeight = $list.outerHeight(true);
		var frameTop = $list.offset().top;
		var frameBottom = frameTop+frameHeight;
		var scrollBottom = $(window).scrollTop() + wh;
		var $nextRow = $list.find(".box-lazyload").slice(0,slidesToShow);
		var scrollEvents = 'scroll DOMMouseScroll';
		var scrollTimer;
		
		//Relayout Listener
/*
		$boxesMason.on( 'layoutComplete', function() {
			
		});
*/
		
		$list.masonry( 'on', 'layoutComplete', function( msnryInstance, laidOutItems ) {
			frameHeight = $list.outerHeight(true);
			frameTop = $list.offset().top;
			frameBottom = frameTop+frameHeight;
			
			if( $nextRow.length ) {
				
				clearTimeout(scrollTimer);
			    scrollTimer = setTimeout(function() {
			        
			        loadBoxes();
			        
			    }, 100);
			    
			}
		});
		
		
		function loadBoxes() {
			
			scrollBottom = $(window).scrollTop() + wh;
			
	        if( scrollBottom >= frameBottom + 100 ) {
		        
	            $nextRow = $list.find(".box-lazyload").slice(0,slidesToShow);
	            
	            $nextRow.each(function( i ){
		            var $box = $(this);
		            var $image = $(this).find('.box-image img');
		            var delay = i*100;
		            
		            $box.css('transition-delay', delay+'ms');//Staggering
		            
		            $image.unveil(0, function() {
						$(this).load(function() {
							$box.removeClass("box-lazyload");
							//if( i === $nextRow.length-1 ){
								$list.masonry();
							//}
						});
					});
	            });
	            
	        }
	        
	        return false;
	        
	        //$itemSelector.find(".box-lazyload").slice(0,2)
	    }
		
		$(window).on( scrollEvents, function(event) {
			clearTimeout(scrollTimer);
		    scrollTimer = setTimeout(function() {
		        
		        loadBoxes(event);
		        
		    }, 100);
		    event.stopPropagation();
		}).trigger('scroll');
		
		//var slidesToShow = $list.data("show");
	}
	
	gc.boxize = function() {
		
		//Check if there are any boxes to boxize
		if( $( '.box-boxes' ).length === 0 ){ return false; }
		
		//Let's make som slides
		$('.box-boxes').each(function() {
			
			//$boxesContainer
			var $this = $(this);
			
			if( $this.hasClass('boxes-slick') ){
				slickize( $this );
			} else if( $this.hasClass('boxes-masonry') ){
				masonize( $this );
			}
			
			if( $(this).hasClass("double-stacked") ){
				//sizeFirstBox( $(this) );
				console.log("Has Double");
			}
			
		});
		
	}
	
	gc.boxize();

	
	if( !Modernizr.cssanimations ){
		$("html").addClass("no-cssanimations");
	}
	


 });
};