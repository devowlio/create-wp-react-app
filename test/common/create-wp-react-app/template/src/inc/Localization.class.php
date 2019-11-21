<?php
namespace MatthiasWeb\WPRJSS;
use MatthiasWeb\WPRJSS\base;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * i18n management for backend and frontend.
 */
class Localization extends base\Localization {
    /**
     * Put your language overrides here!
     */
    protected function override($locale) {
        switch ($locale) {
            // Put your overrides here!
            // case 'de_AT':
            // case 'de_CH':
            // case 'de_CH_informal':
            // case 'de_DE_formal':
            //     return 'de_DE';
            //     break;
            default:
                break;
        }
        return $locale;
    }
}
