<?php
/**
 * @wordpress-plugin
 * Plugin Name: 	Real Media Library
 * Plugin URI:		https://github.com/matzeeable/real-media-library
 * Description: 	This is RML!
 * Author:          Matthias Günter
 * Author URI:		https://matthias-web.com
 * Version: 		1.0.0
 * Text Domain:		real-media-library
 * Domain Path:		/languages
 */

defined('ABSPATH') or die( 'No script kiddies please!' ); // Avoid direct file request

/**
 * Plugin constants. This file is procedural coding style for initialization of
 * the plugin core and definition of plugin configuration.
 */
if (defined('RML_PATH')) {
    return;
}
define('RML_FILE', __FILE__);
define('RML_PATH', dirname(RML_FILE));
define('RML_SLUG', basename(RML_PATH));
define('RML_INC', trailingslashit(path_join(RML_PATH, 'inc')));
define('RML_MIN_PHP', '7.2'); // Minimum of PHP 5.3 required for autoloading and namespacing
define('RML_MIN_WP', '5.2'); // Minimum of WordPress 5.0 required
define('RML_NS', 'MatthiasWeb\\RML');
define('RML_DB_PREFIX', 'rml'); // The table name prefix wp_{prefix}
define('RML_OPT_PREFIX', 'rml'); // The option name prefix in wp_options
define('RML_SLUG_CAMELCASE', lcfirst(str_replace('-', '', ucwords(RML_SLUG, '-'))));
//define('RML_TD', ''); This constant is defined in the core class. Use this constant in all your __() methods
//define('RML_VERSION', ''); This constant is defined in the core class
//define('RML_DEBUG', true); This constant should be defined in wp-config.php to enable the Base::debug() method

// Check PHP Version and print notice if minimum not reached, otherwise start the plugin core
require_once RML_INC .
    'base/others/' .
    (version_compare(phpversion(), RML_MIN_PHP, '>=') ? 'start.php' : 'fallback-php-version.php');