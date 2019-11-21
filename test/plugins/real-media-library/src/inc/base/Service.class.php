<?php
namespace MatthiasWeb\RML\base;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Create a base REST Service needed for boilerplate development. Please do not remove it.
 */
final class Service extends Base {
    /**
     * Register endpoints.
     */
    public function rest_api_init() {
        register_rest_route(Service::getNamespace(), '/plugin', [
            'methods' => 'GET',
            'callback' => [$this, 'routePlugin']
        ]);
    }

    /**
     * @api {get} /real-media-library/v1/plugin Get plugin information
     * @apiHeader {string} X-WP-Nonce
     * @apiName GetPlugin
     * @apiGroup Plugin
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *     WC requires at least: "",
     *     WC tested up to: "",
     *     Name: "WP ReactJS Starter",
     *     PluginURI: "https://matthias-web.com/wordpress",
     *     Version: "0.1.0",
     *     Description: "This WordPress plugin demonstrates how to setup a plugin that uses React and ES6 in a WordPress plugin. <cite>By <a href="https://matthias-web.com">Matthias Guenter</a>.</cite>",
     *     Author: "<a href="https://matthias-web.com">Matthias Guenter</a>",
     *     AuthorURI: "https://matthias-web.com",
     *     TextDomain: "real-media-library",
     *     DomainPath: "/languages",
     *     Network: false,
     *     Title: "<a href="https://matthias-web.com/wordpress">WP ReactJS Starter</a>",
     *     AuthorName: "Matthias Guenter"
     * }
     * @apiVersion 0.1.0
     */
    public function routePlugin() {
        return new \WP_REST_Response($this->getCore()->getPluginData());
    }

    /**
     * Get the wp-json URL for a defined REST service.
     *
     * @param string $namespace The prefix for REST service
     * @param string $endpoint The path appended to the prefix
     * @return string Example: https://example.com/wp-json
     * @example Service::url() // => main path
     */
    public static function getUrl($namespace = null, $endpoint = '') {
        return site_url(rest_get_url_prefix()) .
            '/' .
            ($namespace === null ? self::getNamespace() : $namespace) .
            '/' .
            $endpoint;
    }

    /**
     * Get the default namespace of this plugin generated from the slug.
     *
     * @param string $version The version used for this namespace
     * @return string
     */
    public static function getNamespace($version = 'v1') {
        return RML_SLUG . '/' . $version;
    }
}
