<?php
namespace MatthiasWeb\RML\rest;
use MatthiasWeb\RML\base;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Create an example REST Service.
 */
class HelloWorld extends base\Base {
    /**
     * Register endpoints.
     */
    public function rest_api_init() {
        register_rest_route(base\Service::getNamespace(), '/hello', [
            'methods' => 'GET',
            'callback' => [$this, 'routeHello']
        ]);
    }

    /**
     * @api {get} /real-media-library/v1/hello Say hello
     * @apiHeader {string} X-WP-Nonce
     * @apiName SayHello
     * @apiGroup HelloWorld
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "hello": "world"
     * }
     * @apiVersion 0.1.0
     */
    public function routeHello() {
        return new \WP_REST_Response(['hello' => 'world']);
    }
}
