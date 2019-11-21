import {
    IRouteLocationInterface,
    ERouteHttpVerb,
    IRouteResponseInterface,
    IRouteRequestInterface,
    IRouteParamsInterface
} from "@wp-reactjs-multi-starter/utils";

export const locationRestHelloGet: IRouteLocationInterface = {
    path: "/hello",
    method: ERouteHttpVerb.GET
};

export interface IRequestRouteHelloGet extends IRouteRequestInterface {}

export interface IParamsRouteHelloGet extends IRouteParamsInterface {}

export interface IResponseRouteHelloGet extends IRouteResponseInterface {
    hello: string;
}
