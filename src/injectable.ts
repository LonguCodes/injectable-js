import {Constructor, Provider} from "./types";
import {ComposableClass} from "../../composable-js";
import {BindingLifetime, DIContainer} from "./container";

export function injectable(
    key:string|Symbol,
    containerProvider: Provider<DIContainer>,
    lifetime: BindingLifetime = BindingLifetime.Transient
) {
    return (cls: Constructor) => ComposableClass.get(cls).chain((original: Constructor, composable) => {
        containerProvider.get?.registerBinding(key, composable, lifetime);
        return original
    }).composed
}