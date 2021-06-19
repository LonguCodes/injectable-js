import { Provider } from './types';
import { BindingLifetime, DIContainer } from './container';
import { Constructor, ComposableClass } from 'composable-js';
import { BindingKey } from './bindingKey';

export function injectable(
	lifetime: BindingLifetime = BindingLifetime.Transient,
	key?: BindingKey,
	containerProvider?: Provider<DIContainer>
) {
	return ComposableClass.decorator((original: Constructor, composable) => {
		DIContainer.getProvider(containerProvider).get?.registerBinding(
			key ?? (() => original),
			composable,
			lifetime
		);
		return original;
	});
}
