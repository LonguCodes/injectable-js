import {Provider} from "./types";
import {BindingLifetime, DIContainer} from "./container";

export class BindingKey<T> {
    constructor(public readonly key: Symbol | string, private _lifetime: BindingLifetime, public readonly containerProvider: Provider<DIContainer>) {
    }

    get value() {
        return this.containerProvider.get?.getBinding(this.key)
    }

    set value(value: any) {
        this.containerProvider.get?.registerBinding(this.key, value, this._lifetime)
    }

}