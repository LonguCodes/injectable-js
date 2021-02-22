import {

    BindingLifetime,
    DIContainer

} from "../container";
import {Constructor, Provider} from "../types";
import {BindingKey} from "../bindingKey";

describe('Dependency injection container', () => {
    let container: DIContainer

    beforeEach(() => {
        container = new DIContainer();
    })

    describe('Registration duplicates', () => {
        it('Should not throw with single string key', () => {
            const key = 'directValue'
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).not.toThrow()
        })

        it('Should not throw with single symbol key', () => {
            const key = Symbol('directValue')
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).not.toThrow()
        })

        it('Should throw with duplicated string key', () => {
            const key = 'directValue'
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).not.toThrow()
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).toThrow()
        })

        it('Should throw with duplicated symbol key', () => {
            const key = Symbol('directValue')
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).not.toThrow()
            expect(() => container.registerBinding(key, 1, BindingLifetime.Value)).toThrow()
        })
        it('Should not throw with duplicated but mixed type key', () => {
            const symbolKey = Symbol('directValue')
            const stringKey = 'directValue'

            expect(() => container.registerBinding(symbolKey, 1, BindingLifetime.Value)).not.toThrow()
            expect(() => container.registerBinding(stringKey, 1, BindingLifetime.Value)).not.toThrow()
        })
    })

    describe('Missing binding', () => {
        it('Should throw with missing string key', () => {
            const key = 'directValue'
            expect(() => container.getBinding(key)).toThrow()
        })

        it('Should throw with missing symbol key', () => {
            const key = Symbol('directValue')
            expect(() => container.getBinding(key)).toThrow()
        })

        it('Should throw with missing symbol key while having string key', () => {
            const key = Symbol('directValue')
            container.registerBinding('directValue', 1, BindingLifetime.Value)
            expect(() => container.getBinding(key)).toThrow()
        })

        it('Should throw with missing string key while having symbol key', () => {
            const key = 'directValue'
            container.registerBinding(Symbol('directValue'), 1, BindingLifetime.Value)
            expect(() => container.getBinding(key)).toThrow()
        })
    })
})