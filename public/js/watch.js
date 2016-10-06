if ( undefined !== window.jQuery ) {
  jQuery(function ($) { 'use strict';

/* Helpers */
	
	window.gc = {};
	
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
		
		Watch
		
	*/
	
	
	var field = 'vid';
					var vid;
					var videoTitle;
					
					
					
					// Vimeo Player API
					
					var iframe = $('#frame')[0];
				    var player = $f(iframe);
				    var status = $('.status');
				    var gcID = $('#frame').data("gc-id");
				    var $foreground = $(".hero-shortcode .hero-foreground");
				    var $menu = $("header.banner");
				    var lastTimeMouseMoved = "";
				    var mouseTimeout = "";
				    var vimeoPlaying = 0;
				    
				    
				    $("html").addClass("vimeo-paused")
				
				    // When the player is ready, add listeners for pause, finish, and playProgress
				    player.addEvent('ready', function() {
				        console.log('vimeo api ready');
				        
				        player.addEvent('pause', onPause);
				        player.addEvent('play', onPlay);
				        //player.addEvent('playProgress', onPlayProgress);
				    });
				
				    function onPause(id) {
				        console.log('paused');
				        $("html").removeClass("vimeo-playing").addClass("vimeo-paused");
				        vimeoPlaying = 0;
				    }
				    
				    function onPlay(id) {
				        console.log('played');
				        $("html").removeClass("vimeo-paused").addClass("vimeo-playing");
				        vimeoPlaying = 1;
				    }
				    
				    $("html").addClass("watch-page");
					
					$foreground.click(function(){
						if( vimeoPlaying ){
							player.api("pause");
						} else {
							player.api("play");
						}
					});
					
					
					//Wake Up Video on Mouse action
					$(document).bind("mousemove onmousemove onmousedown mousedown onclick click scroll DOMMouseScroll mousewheel keyup", function(){
						
						console.log("Wake Up!");
						
						$("html").removeClass("clean-hero");
						$foreground.addClass("disable-hover");
						
						lastTimeMouseMoved = new Date().getTime();
						
						$menu.hover(function(){
							clearTimeout(mouseTimeout);
						});
						
						mouseTimeout=setTimeout(function(){
							var currentTime = new Date().getTime();
							if(currentTime - lastTimeMouseMoved > 1000){
								$("html").addClass("clean-hero");
								$foreground.removeClass("disable-hover");
							}
						},2000);
					});
					
					window.uid = "<?php if(isset($guts_id)) echo $guts_id; ?>";
				
					function getParameterByName(name) {
					  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
					  var regexS = "[\\?&]" + name + "=([^&#]*)";
					  var regex = new RegExp(regexS);
					  var results = regex.exec(window.location.search);
					  if(results == null)
					    return "";
					  else
				      return decodeURIComponent(results[1].replace(/\+/g, " "));
					}
					
					function loadVideo(id) {
						
				    	$("#frame").attr('src', 'https://player.vimeo.com/video/' + id + '?byline=0&portrait=0&badge=0&color=d8d8d8&autoplay=1' );
						
						gc.scrollTo( $("#frame").offset().top );
					}
					
/*
					if( window.location.href.indexOf('?' + field + '=') != -1 && uid == "955350") {
						$(document).ready(function() {
						window.vid = getParameterByName('vid')
						var vid = window.vid;
							loadVideo(vid);
						});
					}
*/
					
					//Load Video from Hash
					if(window.location.hash !== "") {
						
						var vid = window.location.hash.split('#')[1]
						window.vid = vid;
						
						$.getJSON('https://vimeo.com/api/v2/video/'+vid+'.json', {format: 'json'}, function(data) {
						    window.uid = data[0].user_id;
						})
						.done(function() {
							if( window.uid == gcID){
								loadVideo(vid);
							}
						});
						
					}
			
					//Load Video from Hash Changing(click)
					jQuery(window).hashchange(function () {
						var hash = window.location.hash.split('#')[1]
						loadVideo(hash);
					});

	
	
	
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

	
	if( !Modernizr.cssanimations ){
		$("html").addClass("no-cssanimations");
	}
	


 });
};