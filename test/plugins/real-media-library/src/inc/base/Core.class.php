<?php
namespace MatthiasWeb\RML\base;
use MatthiasWeb\RML as root;
use MatthiasWeb\RML\general;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

// Include files, where autoloading is not possible, yet
require_once RML_INC . 'base/Base.class.php';

/**
 * Base class for the applications Core class.
 */
abstract class Core extends Base {
    /**
     * The relative path to the composer autoload file.
     */
    const COMPOSER_AUTOLOAD = 'vendor/autoload.php';

    /**
     * The stored plugin data.
     *
     * @see getPluginData()
     */
    private $plugin_data;

    /**
     * The plugins activator class.
     *
     * @see Activator
     */
    private $activator;

    /**
     * The plugins asset class.
     *
     * @see Assets
     */
    private $assets;

    /**
     * The constructor handles the core startup mechanism.
     *
     * The constructor is protected because a factory method should only create
     * a Core object.
     */
    protected function __construct() {
        // Define lazy constants
        define('RML_TD', $this->getPluginData('TextDomain'));
        define('RML_VERSION', $this->getPluginData('Version'));

        // Register autoload
        spl_autoload_register([$this, 'autoloadRegister']);

        // Register composer autoload
        $composer_path = path_join(RML_PATH, Core::COMPOSER_AUTOLOAD);
        if (file_exists($composer_path)) {
            include_once $composer_path;
        }

        // Register immediate actions and filters
        $this->activator = new root\Activator();
        $this->assets = new root\Assets();

        add_action('plugins_loaded', [$this, 'i18n']);
        add_action('init', [$this, 'init']);
        add_action('rest_api_init', [new Service(), 'rest_api_init']);
        add_action('plugins_loaded', [$this, 'updateDbCheck']);

        add_filter('override_load_textdomain', [new root\Localization(), 'override_load_textdomain'], 10, 3);
        add_filter('load_script_translation_file', [new root\Localization(), 'load_script_translation_file'], 10, 3);

        register_activation_hook(RML_FILE, [$this->getActivator(), 'activate']);
        register_deactivation_hook(RML_FILE, [$this->getActivator(), 'deactivate']);
    }

    /**
     * Autoload PHP files (classes and interfaces). It respects the given namespace
     * within the inc/ folder. Each subnamespace must be available as own folder.
     * Class files should be defined as ClassName.class.php. Interface files should
     * be defined as IName.interface.php.
     *
     * @param string $className Full qualified class name
     */
    public function autoloadRegister($className) {
        $namespace = RML_NS . '\\';
        if (0 === strpos($className, $namespace)) {
            $name = substr($className, strlen($namespace));
            $last = explode('\\', $name);
            $prefix = RML_INC . str_replace('\\', '/', $name) . '.';
            $filesToCheck = [$prefix . 'class.php', $prefix . 'interface.php', $prefix . 'trait.php'];

            foreach ($filesToCheck as $filename) {
                if (file_exists($filename)) {
                    require_once $filename;
                }
            }
        }
    }

    /**
     * The plugin is loaded. Start to register the localization (i18n) files.
     */
    public function i18n() {
        load_plugin_textdomain(
            RML_TD,
            false,
            dirname(plugin_basename(RML_FILE)) . $this->getPluginData('DomainPath')
        );
    }

    /**
     * Updates the database version in the options table.
     * It also installs the needed database tables.
     */
    public function updateDbCheck() {
        $installed = get_option(RML_OPT_PREFIX . '_db_version');
        if ($installed != RML_VERSION) {
            $this->debug('(Re)install the database tables', __FUNCTION__);
            $this->getActivator()->install();
        }
    }

    /**
     * Gets the plugin data.
     *
     * @param string $key The key of the data to return
     * @return string[]|string
     * @see https://developer.wordpress.org/reference/functions/get_plugin_data/
     */
    public function getPluginData($key = null) {
        require_once ABSPATH . '/wp-admin/includes/plugin.php';
        $data = isset($this->plugin_data)
            ? $this->plugin_data
            : ($this->plugin_data = get_plugin_data(RML_FILE, true, false));
        return $key === null ? $data : $data[$key];
    }

    /**
     * @return Activator
     */
    public function getActivator() {
        return $this->activator;
    }

    /**
     * @return Assets
     */
    public function getAssets() {
        return $this->assets;
    }
}
