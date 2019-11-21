<?php
namespace MatthiasWeb\RML\base;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Base asset management class for frontend scripts and styles.
 */
abstract class Assets extends Base {
    /**
     * Enqueue scripts and styles in admin pages.
     */
    const TYPE_ADMIN = 'admin_enqueue_scripts';

    /**
     * Enqueue scripts and styles in frontend pages.
     */
    const TYPE_FRONTEND = 'wp_enqueue_scripts';

    /**
     * The regex to get the library folder name of public/lib files.
     */
    const LIB_CACHEBUSTER_REGEX = '/^public\/lib\/([^\/]+)/';

    /**
     * @see general\I18n.class.php
     */
    const PUBLIC_JSON_I18N = 'public/languages/json';

    const HANDLE_REACT = 'react';
    const HANDLE_REACT_DOM = 'react-dom';
    const HANDLE_MOBX = 'mobx';

    /**
     * Localize the plugin with additional options.
     *
     * @return array
     */
    abstract public function overrideLocalizeScript($context);

    /**
     * Enqueue scripts and styles depending on the type. This function is called
     * from both admin_enqueue_scripts and wp_enqueue_scripts. You can check the
     * type through the $type parameter. In this function you can include your
     * external libraries from public/lib, too.
     *
     * @param string $type The type (see Assets constants)
     */
    abstract public function enqueue_scripts_and_styles($type);

    /**
     * Localize the WordPress backend and frontend.
     *
     * @return array
     */
    public function localizeScript($context) {
        // We put custom variables to "others" because if you put for example
        // a boolean to the first-level it is interpreted as "1" instead of true.
        return [
            'slug' => RML_SLUG,
            'textDomain' => RML_TD,
            'version' => RML_VERSION,
            'restUrl' => $this->getAsciiUrl(Service::getUrl()),
            'restNamespace' => Service::getNamespace(),
            'restRoot' => $this->getAsciiUrl(get_rest_url()),
            'restQuery' => ['_v' => RML_VERSION],
            'restNonce' => wp_installing() && !is_multisite() ? '' : wp_create_nonce('wp_rest'),
            'publicUrl' => trailingslashit(plugins_url('public', RML_FILE)),
            'others' => $this->overrideLocalizeScript($context)
        ];
    }

    /**
     * Enqueue react and react-dom (first check version is minium 16.8 so hooks work correctly).
     */
    public function enqueueReact() {
        $useNonMinifiedSources = $this->useNonMinifiedSources();

        // React (first check version is minium 16.8 so hooks work correctly)
        $coreReact = wp_scripts()->query(self::HANDLE_REACT);
        if ($coreReact !== false && version_compare($coreReact->ver, '16.8', '<')) {
            wp_deregister_script(self::HANDLE_REACT);
            wp_deregister_script(self::HANDLE_REACT_DOM);
        }

        // Both in admin interface (page) and frontend (widgets)
        $this->enqueueLibraryScript(self::HANDLE_REACT, [
            [$useNonMinifiedSources, 'react/umd/react.development.js'],
            'react/umd/react.production.min.js'
        ]);
        $this->enqueueLibraryScript(
            self::HANDLE_REACT_DOM,
            [
                [$useNonMinifiedSources, 'react-dom/umd/react-dom.development.js'],
                'react-dom/umd/react-dom.production.min.js'
            ],
            self::HANDLE_REACT
        );
    }

    /**
     * Enqueue mobx state management library.
     */
    public function enqueueMobx() {
        $useNonMinifiedSources = $this->useNonMinifiedSources();
        $this->enqueueLibraryScript(self::HANDLE_MOBX, [
            [$useNonMinifiedSources, 'mobx/lib/mobx.umd.js'],
            'mobx/lib/mobx.umd.min.js'
        ]);
    }

    /**
     * Registers the script if $src provided (does NOT overwrite), and enqueues it. Use this wrapper
     * method instead of wp_enqueue_script if you want to use the cachebuster for the given src. If the
     * src is not found in the cachebuster (inc/base/others/cachebuster.php) it falls back to RML_VERSION.
     *
     * You can also use something like this to determine SCRIPT_DEBUG files:
     *
     * ```php
     * $this->enqueueLibraryScript(
     *     base\Assets::HANDLE_REACT_DOM,
     *     [[$useNonMinifiedSources, 'react-dom/umd/react-dom.development.js'], 'react-dom/umd/react-dom.production.min.js'],
     *     base\Assets::HANDLE_REACT
     * );
     * ```
     *
     * @param string $handle Name of the script. Should be unique.
     * @param string|string[] $src The src relative to public/dist or public/dev folder (when $isLib is false)
     * @param array $deps An array of registered script handles this script depends on.
     * @param boolean $in_footer Whether to enqueue the script before </body> instead of in the <head>.
     * @param boolean $isLib If true the public/lib/ folder is used.
     * @see https://developer.wordpress.org/reference/functions/wp_enqueue_script/ For parameters
     */
    public function enqueueScript($handle, $src = '', $deps = [], $in_footer = false, $isLib = false) {
        if (!is_array($src)) {
            $src = array($src);
        }

        $publicFolder = $this->getPublicFolder($isLib);
        foreach ($src as $s) {
            // Allow to skip e. g. SCRIPT_DEBUG files
            if (is_array($s) && $s[0] !== true) {
                continue;
            }

            $publicSrc = $publicFolder . (is_array($s) ? $s[1] : $s);
            $path = path_join(RML_PATH, $publicSrc);
            if (file_exists($path)) {
                wp_enqueue_script(
                    $handle,
                    plugins_url($publicSrc, RML_FILE),
                    $deps,
                    $this->getCachebusterVersion($publicSrc, $isLib),
                    true
                );
                break;
            }
        }
    }

    /**
     * Wrapper for Assets::enqueueScript() method with $isLib = true.
     *
     * @see enqueueScript()
     */
    public function enqueueLibraryScript($handle, $src = '', $deps = [], $in_footer = false) {
        $this->enqueueScript($handle, $src, $deps, $in_footer, true);
    }

    /**
     * Enqueue a CSS stylesheet. Use this wrapper method instead of wp_enqueue_style if you want
     * to use the cachebuster for the given src. If the src is not found in the cachebuster (inc/base/others/cachebuster.php)
     * it falls back to RML_VERSION.
     *
     * @param string $handle Name of the style. Should be unique.
     * @param string|string[] $src The src relative to public/dist or public/dev folder (when $isLib is false)
     * @param array $deps An array of registered style handles this style depends on.
     * @param string $media The media for which this stylesheet has been defined. Accepts media types like 'all', 'print' and 'screen', or media queries like '(orientation: portrait)' and '(max-width: 640px)'.
     * @param boolean $isLib If true the public/lib/ folder is used.
     * @see https://developer.wordpress.org/reference/functions/wp_enqueue_style/ For parameters
     */
    public function enqueueStyle($handle, $src = '', $deps = [], $media = 'all', $isLib = false) {
        if (!is_array($src)) {
            $src = array($src);
        }

        $publicFolder = $this->getPublicFolder($isLib);
        foreach ($src as $s) {
            $publicSrc = $publicFolder . $s;
            $path = path_join(RML_PATH, $publicSrc);
            if (file_exists($path)) {
                wp_enqueue_style(
                    $handle,
                    plugins_url($publicSrc, RML_FILE),
                    $deps,
                    $this->getCachebusterVersion($publicSrc, $isLib),
                    $media
                );
                break;
            }
        }
    }

    /**
     * Wrapper for Assets::enqueueStyle() method with $isLib = true.
     *
     * @see enqueueStyle()
     */
    public function enqueueLibraryStyle($handle, $src = '', $deps = [], $media = 'all') {
        $this->enqueueStyle($handle, $src, $deps, $media, true);
    }

    /**
     * Enqueue scripts and styles for admin pages.
     */
    public function admin_enqueue_scripts() {
        $this->enqueue_scripts_and_styles(self::TYPE_ADMIN);
    }

    /**
     * Enqueue scripts and styles for frontend pages.
     */
    public function wp_enqueue_scripts() {
        $this->enqueue_scripts_and_styles(self::TYPE_FRONTEND);
    }

    /**
     * Get the cachebuster entry for a given file. If the $src begins with public/lib/ it
     * will use the inc/base/others/cachebuster-lib.php cachebuster instead of inc/base/others/cachebuster.php.
     *
     * @param string $src The src relative to public/ folder
     * @param boolean $isLib If true the cachebuster-lib.php cachebuster is used
     * @return string RML_VERSION or cachebuster timestamp
     */
    public function getCachebusterVersion($src, $isLib = false) {
        $default = RML_VERSION;
        $path = RML_INC . '/base/others/';
        $path_lib = $path . 'cachebuster-lib.php';
        $path = $path . 'cachebuster.php';
        if ($isLib) {
            // Library cachebuster
            if (file_exists($path_lib)) {
                static $cachebuster_lib = null;
                if ($cachebuster_lib === null) {
                    $cachebuster_lib = include $path_lib;
                }

                // Parse module
                preg_match(Assets::LIB_CACHEBUSTER_REGEX, $src, $matches);
                if (
                    is_array($matches) &&
                    isset($matches[1]) &&
                    ($module = $matches[1]) &&
                    is_array($cachebuster_lib) &&
                    array_key_exists($module, $cachebuster_lib)
                ) {
                    // Valid cachebuster
                    return $cachebuster_lib[$module];
                }
            }
        } else {
            // Main cachebuster
            if (file_exists($path)) {
                // Store cachebuster once
                static $cachebuster = null;
                if ($cachebuster === null) {
                    $cachebuster = include $path;
                }

                // Prepend src/ because the Grunt cachebuster prefixes it
                $src = 'src/' . $src;
                if (is_array($cachebuster) && array_key_exists($src, $cachebuster)) {
                    // Valid cachebuster
                    return $cachebuster[$src];
                }
            }
        }
        return $default;
    }

    /**
     * Wrapper for plugins_url. It respects the public folder depending on the SCRIPTS_DEBUG constant.
     *
     * @param string $asset The file name relative to the public folder path (dist or dev)
     * @param boolean $isLib If true the public/lib/ folder is used.
     * @return string
     * @see getPublicFolder()
     */
    public function getPluginsUrl($asset, $isLib = false) {
        return plugins_url($this->getPublicFolder($isLib) . $asset, RML_FILE);
    }

    /**
     * Gets a public folder depending on the debug mode relative to the plugins folder with trailing slash.
     *
     * @param boolean $isLib If true the public/lib/ folder is returned.
     * @return string
     */
    public function getPublicFolder($isLib = false) {
        return 'public/' . ($isLib ? 'lib' : ($this->useNonMinifiedSources() ? 'dev' : 'dist')) . '/';
    }

    /**
     * Convert a complete URL to IDN url. This is necessery if you use a URIBuilder like
     * lil-url in your frontend.
     *
     * @see https://www.php.net/manual/en/function.idn-to-ascii.php
     * @param string $url The url
     * @return string
     */
    public function getAsciiUrl($url) {
        require_once ABSPATH . WPINC . '/Requests/IRI.php';
        require_once ABSPATH . WPINC . '/Requests/IDNAEncoder.php';
        $iri = new \Requests_IRI($url);
        $iri->host = \Requests_IDNAEncoder::encode($iri->ihost);
        return $iri->uri;
    }

    /**
     * Check if SCRIPT_DEBUG is set to true.
     *
     * @return boolean
     */
    public function useNonMinifiedSources() {
        return defined('SCRIPT_DEBUG') && SCRIPT_DEBUG === true;
    }
}
