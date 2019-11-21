<?php
namespace MatthiasWeb\RML;
use MatthiasWeb\RML\base;
use MatthiasWeb\RML\rest;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Asset management for frontend scripts and styles.
 */
class Assets extends base\Assets {
    /**
     * Enqueue scripts and styles depending on the type. This function is called
     * from both admin_enqueue_scripts and wp_enqueue_scripts. You can check the
     * type through the $type parameter. In this function you can include your
     * external libraries from public/lib, too.
     *
     * @param string $type The type (see base\Assets constants)
     */
    public function enqueue_scripts_and_styles($type) {
        $this->enqueueReact();
        $this->enqueueMobx();

        // Your assets implementation here... See base\Assets for enqueue* methods
        // $useNonMinifiedSources = $this->useNonMinifiedSources(); // Use this variable if you need to differ between minified or non minified sources
        $scriptDeps = [self::HANDLE_REACT, self::HANDLE_REACT_DOM, self::HANDLE_MOBX, 'lodash', 'moment', 'wp-i18n'];
        if ($type === base\Assets::TYPE_ADMIN) {
            $handle = RML_SLUG . '-admin';
            $this->enqueueScript($handle, 'admin.js', $scriptDeps);
            $this->enqueueStyle($handle, 'admin.css');
        } else {
            $handle = RML_SLUG . '-widget';
            $this->enqueueScript($handle, 'widget.js', $scriptDeps);
            $this->enqueueStyle($handle, 'widget.css');
        }

        // Localize script with translations and additional needed parameters
        wp_set_script_translations($handle, RML_TD, path_join(RML_PATH, base\Assets::PUBLIC_JSON_I18N));
        wp_localize_script($handle, RML_SLUG_CAMELCASE, $this->localizeScript($type));
    }

    /**
     * Localize the WordPress backend and frontend. If you want to provide URLs to the
     * frontend you have to consider that some JS libraries do not support umlauts
     * in their URI builder. For this you can use base\Assets#getAsciiUrl.
     *
     * Also, if you want to use the options typed in your frontend you should
     * adjust the following file too: public/ts/store/option.tsx
     *
     * @return array
     */
    public function overrideLocalizeScript($context) {
        if ($context === base\Assets::TYPE_ADMIN) {
            return [
                '_' => '_' // Hold at least one object so it is interpreted as object and not array
            ];
        } elseif ($context === base\Assets::TYPE_FRONTEND) {
            return [
                '_' => '_' // Hold at least one object so it is interpreted as object and not array
            ];
        }

        return [];
    }
}
