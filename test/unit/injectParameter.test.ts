import 'tsconfig-paths/register';

import 'reflect-metadata';
import { BindingLifetime, DIContainer, Getter, inject } from '@';

describe('Inject decorators', () => {
	const key = 'testKey';

	class ExampleProvider {
		private static _container: DIContainer;

		static get get() {
			if (!this._container) this._container = new DIContainer();
			return this._container;
		}

		static reset() {
			this._container = new DIContainer();
		}
	}

	beforeEach(() => {
		ExampleProvider.get.registerBinding(key, 1, BindingLifetime.Value);
	});
	afterEach(() => {
		ExampleProvider.reset();
	});

	describe('@inject', () => {
		class TestClass {
			constructor(@inject(key, ExampleProvider) public x: number) {}
		}

		it('should inject proper value into the constructor', () => {
			const instance = DIContainer.instantiate(TestClass);
			expect(instance).toHaveProperty('x');
			expect(instance.x).toEqual(1);
		});
	});

	describe('@inject.getter', () => {
		class TestClass {
			constructor(
				@inject.getter(key, ExampleProvider)
				public x: Getter<number>
			) {}
		}

		it('should inject proper value into the constructor', () => {
			const instance = DIContainer.instantiate(TestClass);
			expect(instance).toHaveProperty('x');
			expect(instance.x()).toEqual(1);
		});
	});
});
