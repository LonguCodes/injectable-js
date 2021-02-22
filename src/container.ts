import {Constructor, Getter, ParameterInjectionType, ParameterMetadata} from "./types";
import {Binding, SingletonBinding, TransientBinding, ValueBinding} from "./binding";
import 'reflect-metadata'


export enum BindingLifetime {
    Singleton,
    Transient,
    Value
}


export class DIContainer {
    private _bindings: Binding<any>[] = []
    private _keys = new Set<Symbol | string>()
    static readonly metadataKey = Symbol('DI-metadata-key')

    private readonly _bindingLifetimeMapping: { [x in BindingLifetime]: Constructor<Binding<any>> } = {
        [BindingLifetime.Singleton]: SingletonBinding,
        [BindingLifetime.Transient]: TransientBinding,
        [BindingLifetime.Value]: ValueBinding
    }

    registerBinding<T>(key: Symbol | string, value: T, lifetime = BindingLifetime.Transient): void {
        if (this._keys.has(key))
            throw new Error('Key already bound');

        this._bindings.push(new this._bindingLifetimeMapping[lifetime](key, value));
        this._keys.add(key)
    }

    getBinding<T>(key: Symbol | string): T | undefined {
        if (!this._keys.has(key))
            throw new Error('Key not bound');
        return this._bindings.find(x => x.key === key)?.value
    }

    getBindingGetter<T>(key: Symbol | string): Getter<T | undefined> {
        if (!this._keys.has(key))
            throw new Error('Key not bound');
        return () => this._bindings.find(x => x.key === key)?.value
    }

    static resolveParameters(metadata: ParameterMetadata[], sourceParameters: any[] = []) {
        for (const parameter of metadata) {
            const container = parameter.containerProvider.get
            if (!container)
                continue
            switch (parameter.type) {
                case ParameterInjectionType.Value:
                    sourceParameters[parameter.position] = container.getBinding(parameter.key);
                    break;
                case ParameterInjectionType.Getter:
                    sourceParameters[parameter.position] = container.getBindingGetter(parameter.key)
                    break;

            }

        }
        return sourceParameters
    }

    static instantiate<T>(cls: Constructor<T>, sourceParameters: any[] = []): T {
        const metadata: ParameterMetadata[] | undefined = Reflect.getMetadata(DIContainer.metadataKey, cls);
        if (metadata)
            sourceParameters = this.resolveParameters(metadata, sourceParameters)
        return new cls(...sourceParameters)
    }

}





