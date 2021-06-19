import { ComposableClass, Constructor } from 'composable-js';

export type BindingKey<T = any> = string | symbol | (() => Constructor<T>);

export namespace BindingKey {
	export function getRawKey(key: BindingKey): string | symbol {
		if (typeof key === 'function') {
			return ComposableClass.get(key()).id;
		}
		return key;
	}
}
