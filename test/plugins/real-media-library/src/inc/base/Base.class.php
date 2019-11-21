<?php
namespace MatthiasWeb\RML\base;
use MatthiasWeb\RML\general;
use MatthiasWeb\RML as root;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Base class for all available classes for the plugin.
 */
abstract class Base {
    /**
     * Simple-to-use error_log debug log. This debug is only outprintted when
     * you define RML_DEBUG=true constant in wp-config.php
     *
     * @param mixed $message The message
     * @param string $methodOrFunction __METHOD__ OR __FUNCTION__
     */
    public function debug($message, $methodOrFunction = null) {
        if (defined('RML_DEBUG') && RML_DEBUG) {
            $log =
                (empty($methodOrFunction) ? '' : '(' . $methodOrFunction . ')') .
                ': ' .
                (is_string($message) ? $message : json_encode($message));
            error_log('RML_DEBUG ' . $log);
        }
    }

    /**
     * Get the functions instance.
     */
    public function getCore() {
        return root\Core::getInstance();
    }

    /**
     * Get a plugin relevant table name depending on the RML_DB_PREFIX constant.
     *
     * @param string $name Append this name to the plugins relevant table with _{$name}.
     * @return string
     */
    public function getTableName($name = '') {
        global $wpdb;
        return $wpdb->prefix . RML_DB_PREFIX . ($name == '' ? '' : '_' . $name);
    }
}
