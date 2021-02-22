import 'reflect-metadata'
import {DIContainer} from "./container";
import {ParameterInjectionType, ParameterMetadata, Provider} from "./types";
import {BindingKey} from "./bindingKey";

function createInjectDecorator(key: string | Symbol, type: ParameterInjectionType, containerProvider: Provider<DIContainer>) {
    return function (object: any, propertyKey: string, parameterIndex: number) {

        const metadata: ParameterMetadata[] = Reflect.getMetadata(DIContainer.metadataKey, object, propertyKey) ?? []
        metadata.push(
            {
                key,
                type,
                containerProvider,
                position: parameterIndex
            }
        )
        Reflect.defineMetadata(DIContainer.metadataKey, metadata, object, propertyKey)
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




