import {inject} from "../injectParameter";
import {BindingLifetime, DIContainer} from "../container";
import 'reflect-metadata'
import {Getter, ParameterInjectionType} from "../types";
import {BindingKey} from "../bindingKey";

describe('Inject decorators', () => {

    class ExampleProvider {

        private static _container: DIContainer;

        static get get() {
            if (!this._container) this._container = new DIContainer();
            return this._container
        }

        static reset() {
            this._container = new DIContainer();
        }
    }

    beforeEach(() => {
        ExampleProvider.get.registerBinding('testKey', 1, BindingLifetime.Value)
    })
    afterEach(() => {
        ExampleProvider.reset();
    })


    describe('@inject', () => {
        class TestClass {
            constructor(@inject('testKey', ExampleProvider) public x: number) {

            }
        }
        it('Should mark parameter of index 0 with metadata', () => {
            expect(Reflect.hasMetadata(DIContainer.metadataKey, TestClass)).not.toBeFalsy()
        })

        it('Should mark parameter of index 0 with correct metadata', () => {
            const metadata = Reflect.getMetadata(DIContainer.metadataKey, TestClass)
            expect(metadata).toBeInstanceOf(Array)
            expect(metadata).toContainEqual({
                key: 'testKey',
                type: ParameterInjectionType.Value,
                containerProvider: ExampleProvider,
                position:0
            })
        })

        it('Should inject proper value into the constructor',()=>{
            const instance = DIContainer.instantiate(TestClass);
            expect(instance).toHaveProperty('x')
            expect(instance.x).toEqual(1)
        })
    })

    describe('@inject.getter', () => {
        class TestClass {
            constructor(@inject.getter('testKey', ExampleProvider) public x: Getter<number>) {

            }
        }
        it('Should mark parameter of index 0 with metadata', () => {
            expect(Reflect.hasMetadata(DIContainer.metadataKey, TestClass)).not.toBeFalsy()
        })

        it('Should mark parameter of index 0 with correct metadata', () => {
            const metadata = Reflect.getMetadata(DIContainer.metadataKey, TestClass)
            expect(metadata).toBeInstanceOf(Array)
            expect(metadata).toContainEqual({
                key: 'testKey',
                type: ParameterInjectionType.Getter,
                containerProvider: ExampleProvider,
                position:0
            })
        })

        it('Should inject proper value into the constructor',()=>{
            const instance = DIContainer.instantiate(TestClass);
            expect(instance).toHaveProperty('x')
            expect(instance.x()).toEqual(1)
        })
    })
    describe('@inject.fromBindingKey', () => {
        const bindingKey = new BindingKey('testKey',BindingLifetime.Value, ExampleProvider)

        class TestClass {
            constructor(@inject.fromBindingKey(bindingKey) public x: number) {

            }
        }
        it('Should mark parameter of index 0 with metadata', () => {
            expect(Reflect.hasMetadata(DIContainer.metadataKey, TestClass)).not.toBeFalsy()
        })

        it('Should mark parameter of index 0 with correct metadata', () => {
            const metadata = Reflect.getMetadata(DIContainer.metadataKey, TestClass)
            expect(metadata).toBeInstanceOf(Array)
            expect(metadata).toContainEqual({
                key: 'testKey',
                type: ParameterInjectionType.Value,
                containerProvider: ExampleProvider,
                position:0
            })
        })

        it('Should inject proper value into the constructor',()=>{
            const instance = DIContainer.instantiate(TestClass);
            expect(instance).toHaveProperty('x')
            expect(instance.x).toEqual(1)
        })
    })
    describe('@inject.fromBindingKey.getter', () => {
        const bindingKey = new BindingKey('testKey',BindingLifetime.Value, ExampleProvider)


        class TestClass {
            constructor(@inject.fromBindingKey.getter(bindingKey) public x: Getter<number>) {

            }
        }
        it('Should mark parameter of index 0 with metadata', () => {
            expect(Reflect.hasMetadata(DIContainer.metadataKey, TestClass)).not.toBeFalsy()
        })

        it('Should mark parameter of index 0 with correct metadata', () => {
            const metadata = Reflect.getMetadata(DIContainer.metadataKey, TestClass)
            expect(metadata).toBeInstanceOf(Array)
            expect(metadata).toContainEqual({
                key: 'testKey',
                type: ParameterInjectionType.Getter,
                containerProvider: ExampleProvider,
                position:0
            })
        })

        it('Should inject proper value into the constructor',()=>{
            const instance = DIContainer.instantiate(TestClass);
            expect(instance).toHaveProperty('x')
            expect(instance.x()).toEqual(1)
        })
    })
})