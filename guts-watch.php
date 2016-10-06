<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://samcarlton.com
 * @since             1.0.0
 * @package           Guts_Watch
 *
 * @wordpress-plugin
 * Plugin Name:       Guts Watch
 * Plugin URI:        https://github.com/GutsChurch/
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Sam Carlton
 * Author URI:        http://samcarlton.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       guts-watch
 * Domain Path:       /languages
 */
 


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


//https://getcomposer.org/doc/01-basic-usage.md
require __DIR__ . '/vendor/autoload.php';



/*
$log = new Monolog\Logger('name');
$log->pushHandler(new Monolog\Handler\StreamHandler('app.log', Monolog\Logger::WARNING));
$log->addWarning('Foo');
*/

use phpFastCache\CacheManager;

$upload_dir = wp_upload_dir();

// Setup File Path on your config files
CacheManager::setDefaultConfig(array(
    "path" => $upload_dir['basedir'].'/watch_cache/', // or in windows "C:/tmp/"
));

// In your class, function, you can call the Cache
global $InstanceCache;
$InstanceCache = CacheManager::getInstance('files');


/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-guts-watch-activator.php
 */
function activate_guts_watch() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-guts-watch-activator.php';
	Guts_Watch_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-guts-watch-deactivator.php
 */
function deactivate_guts_watch() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-guts-watch-deactivator.php';
	Guts_Watch_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_guts_watch' );
register_deactivation_hook( __FILE__, 'deactivate_guts_watch' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-guts-watch.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_guts_watch() {

	$plugin = new Guts_Watch();
	$plugin->run();

}
run_guts_watch();
