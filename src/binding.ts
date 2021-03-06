import { DIContainer } from './container';
import { Constructor } from 'composable-js';
import { BindingKey } from './bindingKey';

export interface Binding<T> {
	key: BindingKey<T>;
	value: T | undefined;
}

export class ValueBinding<T> implements Binding<T> {
	get value(): T | undefined {
		return this._value;
	}

	constructor(public readonly key: BindingKey<T>, private _value: T) {}
}

export class TransientBinding<T> implements Binding<T> {
	get value(): T | undefined {
		return DIContainer.instantiate(this._constructor);
	}

	constructor(
		public readonly key: BindingKey<T>,
		private _constructor: Constructor<T>
	) {}
}

export class SingletonBinding<T> implements Binding<T> {
	private _instance: T | undefined;

	get value(): T | undefined {
		if (this._instance) return this._instance;
		return (this._instance = DIContainer.instantiate(this._constructor));
	}

	constructor(
		public readonly key: BindingKey<T>,
		private _constructor: Constructor<T>
	) {}
}
