import 'reflect-metadata';
import { DIContainer } from './container';
import { ParameterInjectionType, ParameterMetadata, Provider } from './types';
import { BindingKey } from './bindingKey';
import { ComposableClass } from 'composable-js';

function createInjectDecorator(
	key: BindingKey,
	type: ParameterInjectionType,
	containerProvider?: Provider<DIContainer>
) {
	return function (object: any, propertyKey: string, parameterIndex: number) {
		if (typeof object !== 'function' || propertyKey !== undefined)
			throw new Error('@inject can only be used on constructor');
		const composable = ComposableClass.get(object);
		const metadata: ParameterMetadata[] =
			Reflect.getMetadata(DIContainer.metadataKey, composable) ?? [];
		metadata.push({
			key,
			type,
			position: parameterIndex,
			containerProvider
		});
		Reflect.defineMetadata(DIContainer.metadataKey, metadata, composable);
	};
}

export function inject(key: BindingKey, from?: Provider<DIContainer>) {
	return createInjectDecorator(key, ParameterInjectionType.Value, from);
}

export namespace inject {
	export function getter(key: BindingKey, from?: Provider<DIContainer>) {
		return createInjectDecorator(key, ParameterInjectionType.Getter, from);
	}
}
