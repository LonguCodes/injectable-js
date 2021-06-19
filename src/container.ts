import {
	Getter,
	ParameterInjectionType,
	ParameterMetadata,
	Provider
} from './types';
import {
	Binding,
	SingletonBinding,
	TransientBinding,
	ValueBinding
} from './binding';
import 'reflect-metadata';
import { ComposableClass, Constructor } from 'composable-js';
import { BindingKey } from './bindingKey';

export enum BindingLifetime {
	Singleton,
	Transient,
	Value
}

export class DIContainer {
	private static _defaultProvider: Provider<DIContainer>;
	private _bindings: Binding<any>[] = [];
	private _keys = new Set<symbol | string>();
	static readonly metadataKey = Symbol('DI-metadata-key');

	private readonly _bindingLifetimeMapping: {
		[x in BindingLifetime]: Constructor<Binding<any>>;
	} = {
		[BindingLifetime.Singleton]: SingletonBinding,
		[BindingLifetime.Transient]: TransientBinding,
		[BindingLifetime.Value]: ValueBinding
	};

	registerBinding<T>(
		key: BindingKey<T>,
		value: T,
		lifetime = BindingLifetime.Transient
	): void {
		if (this._keys.has(BindingKey.getRawKey(key)))
			throw new Error('Key already bound');

		this._bindings.push(
			new this._bindingLifetimeMapping[lifetime](key, value)
		);
		this._keys.add(BindingKey.getRawKey(key));
	}

	getBinding<T>(key: BindingKey<T>): T | undefined {
		if (!this._keys.has(BindingKey.getRawKey(key)))
			throw new Error('Key not bound');
		return this._bindings.find(
			(x) => BindingKey.getRawKey(x.key) === BindingKey.getRawKey(key)
		)?.value;
	}

	getBindingGetter<T>(key: BindingKey<T>): Getter<T | undefined> {
		if (!this._keys.has(BindingKey.getRawKey(key)))
			throw new Error('Key not bound');
		return () =>
			this._bindings.find(
				(x) => BindingKey.getRawKey(x.key) === BindingKey.getRawKey(key)
			)?.value;
	}

	static resolveParameters(
		metadata: ParameterMetadata[],
		sourceParameters: any[] = []
	) {
		for (const parameter of metadata) {
			const container = this.getProvider(parameter.containerProvider).get;
			if (!container) continue;
			switch (parameter.type) {
				case ParameterInjectionType.Value:
					sourceParameters[parameter.position] = container.getBinding(
						parameter.key
					);
					break;
				case ParameterInjectionType.Getter:
					sourceParameters[
						parameter.position
					] = container.getBindingGetter(parameter.key);
					break;
			}
		}
		return sourceParameters;
	}

	static instantiate<T>(
		cls: Constructor<T>,
		sourceParameters: any[] = []
	): T {
		const composable = ComposableClass.get(cls);
		const metadata: ParameterMetadata[] | undefined = Reflect.getMetadata(
			DIContainer.metadataKey,
			composable
		);
		if (metadata)
			sourceParameters = this.resolveParameters(
				metadata,
				sourceParameters
			);
		return new cls(...sourceParameters);
	}

	static set defaultProvider(provider: Provider<DIContainer>) {
		this._defaultProvider = provider;
	}

	static get defaultProvider() {
		if (!this._defaultProvider) throw new Error('No default provider set');
		return this._defaultProvider;
	}

	static getProvider(
		baseProvider?: Provider<DIContainer>
	): Provider<DIContainer> {
		return baseProvider ?? this.defaultProvider;
	}
}
