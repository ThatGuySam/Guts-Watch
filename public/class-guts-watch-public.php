<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://samcarlton.com
 * @since      1.0.0
 *
 * @package    Guts_Watch
 * @subpackage Guts_Watch/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Guts_Watch
 * @subpackage Guts_Watch/public
 * @author     Sam Carlton <contact@samcarlton.com>
 */
class Guts_Watch_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}
	
	
	
	
/*
	
	Shortcode Code
	
*/




	
	static $add_watch_script;
 
	static function init() {
		add_shortcode('watch', array(__CLASS__, 'handle_shortcode'));
		add_action('init', array(__CLASS__, 'register_script'), 110);
		add_action('wp_footer', array(__CLASS__, 'print_script'), 110);
		add_action('wp_footer', array(__CLASS__, 'internal_script'), 110);
	}
	
	static function handle_shortcode($atts) {
		self::$add_watch_script = true;
		
		extract( shortcode_atts( array(
			'class' => false,
		), $atts, 'watch' ) );
		
		
		$video = new stdClass();
		
		$parameters = new stdClass();
			$parameters->title = 0;
			$parameters->byline = 0;
			$parameters->portrait = 0;
			$parameters->color = "ffffff";
			$parameters->api = 1;
			$parameters->player_id = 'frame';
		
		
		if ( isset($_GET['vid']) ) {
			
			$video->id = $_GET['vid'];
			
			$videos = new stdClass();
			
			$videos = boxVimeo( $video );
			
			$video = (object) array_merge((array) $video, (array) $videos->video_0[0]);
			
			$x = 0;
			
			//debug( $video->user_id );
			
			$parameters->autoplay = 1;
		}
		
		$guts_id = "955350";
		
		//Check id is set and belongs to guts
		if( !isset($_GET['vid']) || $video->user_id != $guts_id) {
			$video->id = getLatestVideoID();
		}
		
		$video->query = http_build_query($parameters);
		
		ob_start(); ?>
			
			<div class="hero-background">
				<div class="ir frame-container">
					<iframe id="frame" src="//player.vimeo.com/video/<?php echo $video->id; ?>?<?php echo $video->query; ?>" data-gc-id="<?php echo $guts_id; ?>" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ></iframe>
				</div>
			</div>
			
		<?php
		$content = ob_get_clean();
			
		return $content;
	}
	
	
	
	static function register_script() {
		
		//CSS
		wp_register_style( 'slick_css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css' , null, '1.6.0', 'screen' );
		wp_register_style( 'slick_theme_css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css' , null, '1.6.0', 'screen' );
		wp_register_style( 'watch_css', plugin_dir_url( __FILE__ ) . 'css/watch.css' , array(), '1.0.1', 'screen' );
		
		//JS
		wp_register_script( 'hashchange', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-hashchange/v1.3/jquery.ba-hashchange.min.js', array('jquery'), '1.3', true);
		wp_register_script( 'jquery-migrate-cdn', 'https://code.jquery.com/jquery-migrate-1.2.1.min.js', array('jquery'), '1.2.1', true);
		wp_register_script( 'froogaloop2', 'https://f.vimeocdn.com/js/froogaloop2.min.js', array('jquery'), '2.0', true);
		wp_register_script( 'slick', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js', null, '1.6.0', true);
		
		if( !wp_script_is( 'modernizr', 'registered' ) ) wp_register_script( 'modernizr', 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', null, '2.8.3', true);
		
		wp_register_script( 'watch_js', plugin_dir_url( __FILE__ ) . 'js/watch.js', array('jquery', 'modernizr', 'slick'), '1.0.0', true);
		
	}
 
	static function print_script() {
		if ( ! self::$add_watch_script )
			return;
			
			//CSS
			//if( wp_style_is( 'js_composer_front', 'registered' ) ) wp_print_styles('js_composer_front');
			wp_print_styles('watch_css');
			wp_print_styles('slick_css');
			wp_print_styles('slick_theme_css');
			
			//JS
			//wp_print_scripts('jquery-migrate-cdn');
			wp_print_scripts('froogaloop');
			wp_print_scripts('hashchange');
			wp_print_scripts('slick');
			
			wp_print_scripts('watch_js');
			
	}
	
	static function internal_script() {
		if ( ! self::$add_watch_script )
			return;			
		?>
			
			<script type="text/javascript">
				if ( undefined !== window.jQuery ) { jQuery(function ($) { 'use strict';
					
					//gc Check
					if( window.gc === undefined ){ window.gc = {};}
					
					gc.watchInit = function( $frame ) {
						
						//Check if frame exists
						if( $frame === 'undefined' ){ return false; }
						
						var field = 'vid';
						var vid;
						var videoTitle;
						
						var iframe = $frame[0];
						
						
						
						
						
						// Vimeo Player API
						console.log(iframe);
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
							
							//console.log("Wake Up!");
							
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
							
							gc.scrollTo( $("#frame").offset().top - 57 );
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
						$(window).hashchange(function () {
							var hash = window.location.hash.split('#')[1]
							loadVideo(hash);
						});
						
						
					}
					
					
					gc.watchInit( $("#frame") );
					
	
				}); };//End jQuery
			</script>
			
			<style>
				
				.hero-background {
					z-index: 0;
				}
				
				.hero-shortcode .hero-foreground {
					position: absolute;
					z-index: 1;
				}
				
				.frame-container {
				}
				
				#frame {
				}
				
			</style>
		<?php
	}
	
	
	//init();
	
	
	
	

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Guts_Watch_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Guts_Watch_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/guts-watch-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Guts_Watch_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Guts_Watch_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/guts-watch-public.js', array( 'jquery' ), $this->version, false );

	}

}
