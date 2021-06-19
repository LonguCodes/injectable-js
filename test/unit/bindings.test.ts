import 'tsconfig-paths/register';

import { BindingLifetime, DIContainer } from '@';
import { Constructor } from 'composable-js';

describe('Bindings', () => {
	let container: DIContainer;

	beforeEach(() => {
		container = new DIContainer();
	});

	describe('Value bindings', () => {
		it('should provide value with string key', () => {
			const key = 'directValue';
			container.registerBinding(key, 1, BindingLifetime.Value);
			expect(container.getBinding(key)).toEqual(1);
		});

		it('should provide value with symbol value', () => {
			const key = Symbol('directValue');
			container.registerBinding(key, 1, BindingLifetime.Value);
			expect(container.getBinding(key)).toEqual(1);
		});
	});

	describe('Transient bindings', () => {
		let transientClass: Constructor;

		beforeEach(() => {
			transientClass = jest.fn();
		});

		it('should provide transient instance with string key', () => {
			const key = 'directValue';
			container.registerBinding(
				key,
				transientClass,
				BindingLifetime.Transient
			);
			expect(container.getBinding(key)).toBeInstanceOf(transientClass);
			expect(container.getBinding(key)).toBeInstanceOf(transientClass);
			expect(transientClass).toBeCalledTimes(2);
		});

		it('should provide transient instance with symbol value', () => {
			const key = Symbol('directValue');
			container.registerBinding(
				key,
				transientClass,
				BindingLifetime.Transient
			);
			expect(container.getBinding(key)).toBeInstanceOf(transientClass);
			expect(container.getBinding(key)).toBeInstanceOf(transientClass);
			expect(transientClass).toBeCalledTimes(2);
		});
	});

	describe('Singleton bindings', () => {
		let singletonClass: Constructor;

		beforeEach(() => {
			singletonClass = jest.fn();
		});

		it('should provide singleton instance with string key', () => {
			const key = 'directValue';
			container.registerBinding(
				key,
				singletonClass,
				BindingLifetime.Singleton
			);
			expect(container.getBinding(key)).toBeInstanceOf(singletonClass);
			expect(container.getBinding(key)).toBeInstanceOf(singletonClass);
			expect(singletonClass).toBeCalledTimes(1);
		});

		it('should provide singleton instance with symbol value', () => {
			const key = Symbol('directValue');
			container.registerBinding(
				key,
				singletonClass,
				BindingLifetime.Singleton
			);
			expect(container.getBinding(key)).toBeInstanceOf(singletonClass);
			expect(container.getBinding(key)).toBeInstanceOf(singletonClass);
			expect(singletonClass).toBeCalledTimes(1);
		});
	});
});
