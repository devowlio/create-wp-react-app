<?php
namespace MatthiasWeb\RML;
use MatthiasWeb\RML\base;
use MatthiasWeb\RML\rest;
use MatthiasWeb\RML\view\menu;
use MatthiasWeb\RML\view\page;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

// Include files, where autoloading is not possible, yet
require_once RML_INC . 'base/Core.class.php';

/**
 * Singleton core class which handles the main system for plugin. It includes
 * registering of the autoloader, all hooks (actions & filters) (see base\Core class).
 */
class Core extends base\Core {
    /**
     * Singleton instance.
     */
    private static $me;

    /**
     * Application core constructor.
     */
    protected function __construct() {
        parent::__construct();

        // Register all your before init hooks here
        add_action('widgets_init', [$this, 'widgets_init']);
    }

    /**
     * The init function is fired even the init hook of WordPress. If possible
     * it should register all hooks to have them in one place.
     */
    public function init() {
        // Register all your hooks here
        add_action('rest_api_init', [new rest\HelloWorld(), 'rest_api_init']);
        add_action('admin_enqueue_scripts', [$this->getAssets(), 'admin_enqueue_scripts']);
        add_action('wp_enqueue_scripts', [$this->getAssets(), 'wp_enqueue_scripts']);
        add_action('admin_menu', [new menu\Page(), 'admin_menu']);
    }

    /**
     * Register widgets.
     */
    public function widgets_init() {
        register_widget(RML_NS . '\\view\\widget\\Widget');
    }

    /**
     * Get singleton core class.
     *
     * @return Core
     */
    public static function getInstance() {
        return !isset(self::$me) ? (self::$me = new Core()) : self::$me;
    }
}
