import React, { FC } from "react";
import { observer } from "mobx-react";
import { Notice, ENoticeType } from "./notice";
import { TodoOverview } from "./todo";
import { IRequestRouteHelloGet, IParamsRouteHelloGet, IResponseRouteHelloGet, locationRestHelloGet } from "../wp-api";
import { useStores } from "../store";
import { request, urlBuilder, __, _i } from "../utils";

/**
 * Do a test ajax call when clicking the REST API url.
 *
 * @param e
 */
async function doHelloWorldRestCall(event: React.MouseEvent) {
    event.persist();
    const result = await request<IRequestRouteHelloGet, IParamsRouteHelloGet, IResponseRouteHelloGet>({
        location: locationRestHelloGet
    });
    const usedUrl = urlBuilder({ location: locationRestHelloGet });
    alert(usedUrl + "\n\n" + JSON.stringify(result, undefined, 4));
    event.preventDefault();
}

const ComponentLibrary: FC<{}> = observer(() => {
    const { optionStore } = useStores();
    return (
        <div className="wp-styleguide">
            <h1>WP React Component Library</h1>

            <Notice type={ENoticeType.Info}>
                {__("The text domain of the plugin is: %(textDomain)s (localized variable)", {
                    textDomain: optionStore.textDomain
                })}
            </Notice>
            <Notice type={ENoticeType.Info}>
                {_i(
                    __(
                        "The WP REST API URL of the plugin is: {{a}}%(restUrl)s{{/a}} (localized variable, click for hello world example)",
                        {
                            restUrl: optionStore.restUrl
                        }
                    ),
                    {
                        a: (
                            <a href="#" onClick={doHelloWorldRestCall}>
                                {optionStore.restUrl}
                            </a>
                        )
                    }
                )}
            </Notice>
            <Notice type={ENoticeType.Info}>{__("The is an informative notice")}</Notice>
            <Notice type={ENoticeType.Success}>{__("Your action was successful")}</Notice>
            <Notice type={ENoticeType.Error}>{__("An unexpected error has occurred")}</Notice>
            <TodoOverview />
        </div>
    );
});

export { ComponentLibrary };
