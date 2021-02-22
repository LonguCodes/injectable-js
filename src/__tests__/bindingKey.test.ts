import {BindingLifetime, DIContainer} from "../container";
import {Provider} from "../types";
import {BindingKey} from "../bindingKey";

describe('BindingKey', () => {
    let container: DIContainer
    let staticProvider: Provider<DIContainer>
    beforeEach(() => {
        container = new DIContainer()
        container.getBinding = jest.fn().mockImplementation(
            (key: Symbol | string) => {
                return key;
            }
        )
        container.registerBinding = jest.fn();
        staticProvider = {get: container}
    })
    it('Should call register once with provided arguments', () => {
        const key = new BindingKey('key', BindingLifetime.Value, staticProvider)
        key.value = 'value';
        expect(container.registerBinding).toBeCalledTimes(1)
        expect(container.registerBinding).toBeCalledWith('key', 'value', BindingLifetime.Value)
    })

    it('Should call getBinding once', () => {
        const key = new BindingKey('key', BindingLifetime.Value, staticProvider)
        const value = key.value
        expect(container.getBinding).toBeCalledTimes(1)
        expect(container.getBinding).toBeCalledWith('key')
    })
})