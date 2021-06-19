import 'tsconfig-paths/register';

import { BindingLifetime, DIContainer, Provider } from '@';

describe('Dependency injection container', () => {
	let container: DIContainer;

	beforeEach(() => {
		container = new DIContainer();
	});

	describe('Registration duplicates', () => {
		it('should not throw with single string key', () => {
			const key = 'directValue';
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
		});

		it('should not throw with single symbol key', () => {
			const key = Symbol('directValue');
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
		});

		it('should not throw with single type key', () => {
			class TestClass {}
			const key = () => TestClass;
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
		});

		it('should throw with duplicated string key', () => {
			const key = 'directValue';
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).toThrow();
		});

		it('should throw with duplicated symbol key', () => {
			const key = Symbol('directValue');
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).toThrow();
		});

		it('should throw with duplicated type key', () => {
			class TestClass {}
			const key = () => TestClass;
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).not.toThrow();
			expect(() =>
				container.registerBinding(key, 1, BindingLifetime.Value)
			).toThrow();
		});

		it('should not throw with duplicated but mixed string and symbol key', () => {
			const symbolKey = Symbol('directValue');
			const stringKey = 'directValue';

			expect(() =>
				container.registerBinding(symbolKey, 1, BindingLifetime.Value)
			).not.toThrow();
			expect(() =>
				container.registerBinding(stringKey, 1, BindingLifetime.Value)
			).not.toThrow();
		});
	});

	describe('Missing binding', () => {
		it('should throw with missing string key', () => {
			const key = 'directValue';
			expect(() => container.getBinding(key)).toThrow();
		});

		it('should throw with missing symbol key', () => {
			const key = Symbol('directValue');
			expect(() => container.getBinding(key)).toThrow();
		});

		it('should throw with missing type key', () => {
			class TestClass {}
			const key = () => TestClass;
			expect(() => container.getBinding(key)).toThrow();
		});

		it('should throw with missing symbol key while having string key', () => {
			const key = Symbol('directValue');
			container.registerBinding('directValue', 1, BindingLifetime.Value);
			expect(() => container.getBinding(key)).toThrow();
		});

		it('should throw with missing string key while having symbol key', () => {
			const key = 'directValue';
			container.registerBinding(
				Symbol('directValue'),
				1,
				BindingLifetime.Value
			);
			expect(() => container.getBinding(key)).toThrow();
		});
	});

	describe('Default provider', () => {
		let globalProvider: Provider<DIContainer>;

		beforeEach(() => {
			globalProvider = {
				get: container
			};
		});

		afterEach(() => {
			DIContainer.defaultProvider = undefined;
		});

		it('should return supplied provider when provider is supplied', () => {
			const localProvider: Provider<DIContainer> = {
				get: undefined
			};

			expect(DIContainer.getProvider(localProvider)).toEqual(
				localProvider
			);
		});

		it('should return supplied provider when provider is supplied and default provider is supplied', () => {
			const localProvider: Provider<DIContainer> = {
				get: undefined
			};
			DIContainer.defaultProvider = globalProvider;
			expect(DIContainer.getProvider(localProvider)).toEqual(
				localProvider
			);
		});

		it('should return default provider when provider not is supplied and default provider is supplied', () => {
			const localProvider: Provider<DIContainer> = undefined;
			DIContainer.defaultProvider = globalProvider;
			expect(DIContainer.getProvider(localProvider)).toEqual(
				globalProvider
			);
		});

		it('should throw error when neither provider is supplied ', () => {
			const localProvider: Provider<DIContainer> = undefined;
			expect(() => DIContainer.getProvider(localProvider)).toThrow();
		});
	});
});
