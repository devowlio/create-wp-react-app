import Url from "url-parse";
import $ from "jquery";
import { trailingslashit, untrailingslashit, WithOptional } from "../helpers";
import { BaseOptions } from "../options";

// Use _method instead of Http verb
const WP_REST_API_USE_GLOBAL_METHOD = true;

enum ERouteHttpVerb {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

interface IRouteLocationInterface {
    path: string;
    namespace?: string;
    method?: ERouteHttpVerb;
}
interface IRouteRequestInterface {} // POST-Query in JSON-format
interface IRouteParamsInterface {} // Parameters in IRouteLocationInterface#path which gets resolved like "example/:id", items not found in the URL are appended as GET
interface IRouteResponseInterface {} // Result in JSON-format

interface IRequestArgs {
    location: IRouteLocationInterface;
    params?: IRouteParamsInterface;
    options: {
        restRoot: BaseOptions["restRoot"];
        restNamespace: BaseOptions["restNamespace"];
        restNonce?: BaseOptions["restNonce"];
        restQuery?: BaseOptions["restQuery"];
    };
}

/**
 * Build an URL for a specific scheme.
 *
 * @param param0
 */
function commonUrlBuilder({
    location,
    params = {},
    nonce = true,
    options
}: {
    nonce?: boolean;
} & IRequestArgs) {
    const apiUrl = new Url(options.restRoot, window.location.href, true);
    const query = apiUrl.query;
    const permalinkPath = (query.rest_route as string) || apiUrl.pathname; // Determine path from permalink settings

    // Generate dynamic path
    const foundParams: string[] = [];
    const path = location.path.replace(/\:([A-Za-z0-9-_]+)/g, (match: string, group: string) => {
        foundParams.push(group);
        return (params as any)[group];
    });
    const getParams: any = {};

    // Find undeclared body params and add it to GET query
    for (const checkParam of Object.keys(params)) {
        if (foundParams.indexOf(checkParam) === -1) {
            getParams[checkParam] = encodeURIComponent((params as any)[checkParam]);
        }
    }

    const usePath =
        trailingslashit(permalinkPath) + untrailingslashit(location.namespace || options.restNamespace) + path;

    // Set https if site url is SSL
    if (new Url(window.location.href).protocol === "https:") {
        apiUrl.set("protocol", "https");
    }

    // Set path depending on permalink settings
    if (query.rest_route) {
        query.rest_route = usePath;
    } else {
        apiUrl.set("pathname", usePath); // Set path
    }

    // Append others
    if (nonce) {
        query._wpnonce = options.restNonce;
    }
    if (WP_REST_API_USE_GLOBAL_METHOD && location.method !== ERouteHttpVerb.GET) {
        query._method = location.method;
    }

    return apiUrl.set("query", $.extend(true, {}, options.restQuery, getParams, query)).toString();
}

/**
 * Build and execute a specific REST query.
 *
 * @see urlBuilder
 * @returns Result of REST API
 * @throws
 */
async function commonRequest<
    Request extends IRouteRequestInterface,
    Params extends IRouteParamsInterface,
    Response extends IRouteResponseInterface
>({
    location,
    request: routeRequest,
    params,
    settings = {},
    options
}: {
    params?: Params;
    request?: Request;
    settings?: JQuery.AjaxSettings<any>;
} & IRequestArgs): Promise<Response> {
    const url = commonUrlBuilder({ location, params, nonce: false, options });

    // Use global parameter (see https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/)
    if (WP_REST_API_USE_GLOBAL_METHOD && location.method !== ERouteHttpVerb.GET) {
        settings.method = "POST";
    }

    const result = await $.ajax(
        $.extend(true, settings, {
            url,
            headers: {
                "X-WP-Nonce": options.restNonce
            },
            data: routeRequest
        })
    );
    return result as Response;
}

/**
 * Create a uri builder and request function for your specific plugin depending
 * on the rest root and additional parameters.
 *
 * @param options
 * @see urlBuilder
 * @see request
 */
function createRequestFactory(options: BaseOptions) {
    const urlBuilder = (passOptions: WithOptional<Parameters<typeof commonUrlBuilder>[0], "options">) =>
        commonUrlBuilder({
            ...passOptions,
            options: {
                restNamespace: options.restNamespace,
                restNonce: options.restNonce,
                restQuery: options.restQuery,
                restRoot: options.restRoot
            }
        });

    const request = <
        Request extends IRouteRequestInterface,
        Params extends IRouteParamsInterface,
        Response extends IRouteResponseInterface
    >(
        passOptions: WithOptional<Parameters<typeof commonRequest>[0], "options"> & {
            params?: Params;
            request?: Request;
        }
    ): Promise<Response> =>
        commonRequest({
            ...passOptions,
            options: {
                restNamespace: options.restNamespace,
                restNonce: options.restNonce,
                restQuery: options.restQuery,
                restRoot: options.restRoot
            }
        });

    return {
        urlBuilder,
        request
    };
}

export {
    ERouteHttpVerb,
    IRouteLocationInterface,
    IRouteRequestInterface,
    IRouteParamsInterface,
    IRouteResponseInterface,
    IRequestArgs,
    commonUrlBuilder,
    commonRequest,
    createRequestFactory,
    Url
};
