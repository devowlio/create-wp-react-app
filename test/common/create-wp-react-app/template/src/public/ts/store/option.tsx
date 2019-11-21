import { observable, runInAction } from "mobx";
import { BaseOptions } from "@wp-reactjs-multi-starter/utils";
import { RootStore } from "./stores";

class OptionStore extends BaseOptions {
    public readonly pureSlug: ReturnType<typeof BaseOptions.getPureSlug>;

    public readonly rootStore: RootStore;

    @observable
    public others = {
        // Implement "others" property in your Assets.class.php
    };

    constructor(rootStore: RootStore) {
        super();
        this.rootStore = rootStore;
        this.pureSlug = BaseOptions.getPureSlug(process.env, true);

        // Use the localized WP object to fill this object values.
        runInAction(() => Object.assign(this, (window as any)[this.pureSlug]));
    }
}

export { OptionStore };
