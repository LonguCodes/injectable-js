import 'reflect-metadata'
import {DIContainer} from "./container";
import {ParameterInjectionType, ParameterMetadata, Provider} from "./types";
import {BindingKey} from "./bindingKey";
import {ComposableClass} from "composable-js";

function createInjectDecorator(key: string | Symbol, type: ParameterInjectionType, containerProvider: Provider<DIContainer>) {
    return function (object: any, propertyKey: string, parameterIndex: number) {
        if (typeof object !== "function" || propertyKey !== undefined)
            throw new Error('@inject can only be used on constructor')
        const composable = ComposableClass.get(object);
        const metadata: ParameterMetadata[] = Reflect.getMetadata(DIContainer.metadataKey, composable) ?? []
        metadata.push(
            {
                key,
                type,
                containerProvider,
                position: parameterIndex
            }
        )
        Reflect.defineMetadata(DIContainer.metadataKey, metadata, composable)
    }
}


export function inject(key: string | Symbol, from: Provider<DIContainer>) {
    return createInjectDecorator(key, ParameterInjectionType.Value, from)

}

export namespace inject {
    export function getter(key: string | Symbol, from: Provider<DIContainer>) {
        return createInjectDecorator(key, ParameterInjectionType.Getter, from)
    }

    export function fromBindingKey<T>(key: BindingKey<T>) {
        return createInjectDecorator(key.key, ParameterInjectionType.Value, key.containerProvider)
    }

    export namespace fromBindingKey {
        export function getter<T>(key: BindingKey<T>) {
            return createInjectDecorator(key.key, ParameterInjectionType.Getter, key.containerProvider)
        }
    }
}




