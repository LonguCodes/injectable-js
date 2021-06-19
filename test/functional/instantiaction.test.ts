import 'tsconfig-paths/register';

import {BindingLifetime, DIContainer, inject, injectable} from '@';
import {ComposableClass} from 'composable-js';

let container: DIContainer;
beforeEach(() => {
	container = new DIContainer();
});

describe('instance creation', () => {
	beforeEach(() => {
		DIContainer.defaultProvider = { get: container };
	});

	it('should instantiate class with value binding', () => {
		const key = Symbol('key');
		container.registerBinding(key, 1, BindingLifetime.Value);

		class TestClass {
			constructor(@inject(key) public value: number) {}
		}

		const instance = DIContainer.instantiate(TestClass);
		expect(instance).not.toBeNull();
		expect(instance.value).not.toBeNull();
		expect(instance.value).toEqual(1);
	});

	it('should instantiate class with transient binding', () => {
		const key = Symbol('key');

		class InjectClass {}
		container.registerBinding(key, InjectClass);

		class TestClass {
			constructor(@inject(key) public transient: InjectClass) {}
		}

		const instance = DIContainer.instantiate(TestClass);
		expect(instance).not.toBeNull();
		expect(instance.transient).not.toBeNull();
		expect(instance.transient).toBeInstanceOf(InjectClass);
	});

	it('should instantiate class with singleton binding', () => {
		const key = Symbol('key');

		class InjectClass {}
		container.registerBinding(key, InjectClass, BindingLifetime.Singleton);

		class TestClass {
			constructor(@inject(key) public singleton: InjectClass) {}
		}

		const instance1 = DIContainer.instantiate(TestClass);
		const instance2 = DIContainer.instantiate(TestClass);
		expect(instance1).not.toBeNull();
		expect(instance1.singleton).not.toBeNull();
		expect(instance1.singleton).toBeInstanceOf(InjectClass);

		expect(instance2).not.toBeNull();
		expect(instance2.singleton).not.toBeNull();
		expect(instance2.singleton).toBeInstanceOf(InjectClass);

		expect(instance1).not.toBe(instance2);
		expect(instance1.singleton).toEqual(instance2.singleton);
	});

	it('should instantiate class by type', () => {
		@injectable()
		class InjectClass {}

		class TestClass {
			constructor(
				@inject(() => InjectClass)
				public injectClass: InjectClass
			) {}
		}

		const instance = DIContainer.instantiate(TestClass);

		expect(instance).not.toBeNull();
		expect(instance.injectClass).not.toBeNull();
		expect(instance.injectClass).toBeInstanceOf(
			ComposableClass.get(InjectClass).base
		);
	});
});
