import { DIContainer } from './container';
import { BindingKey } from './bindingKey';

export type Provider<T> = { get: T | undefined };
export type Getter<T> = () => T;

export enum ParameterInjectionType {
	Value,
	Getter
}

export interface ParameterMetadata {
	position: number;
	key: BindingKey;
	containerProvider: Provider<DIContainer>;
	type: ParameterInjectionType;
}
