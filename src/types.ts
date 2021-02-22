import {DIContainer} from "./container";

export type Provider<T> = { get: T | undefined }
export type Constructor<T = {}> = new (...args: any[]) => T;
export type Getter<T> = () => T

export enum ParameterInjectionType {
    Value,
    Getter
}

export interface ParameterMetadata {
    position: number;
    key: string | Symbol;
    containerProvider: Provider<DIContainer>
    type: ParameterInjectionType
}