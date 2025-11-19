import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';

export type Provision<TProvider> = Type<TProvider> | InjectionToken<TProvider>;

type BaseProvider<TProvider> = {
    provide: TProvider;
};

export type ValueProvider<TProvider> = BaseProvider<Provision<TProvider>> & {
    useValue: TProvider;
};

export function isValueProvider<TProvider>(provider: Provider<TProvider>): provider is ValueProvider<TProvider> {
    return typeof provider === 'object' && 'provide' in provider && 'useValue' in provider;
}

export type ClassProvider<TProvider> = Type<TProvider>;

export function isClassProvider<TProvider>(provider: Provider<TProvider>): provider is ClassProvider<TProvider> {
    return typeof provider === 'function' || (typeof provider === 'object' && 'isClassProvider' in provider);
}

export type FactoryProvider<TProvider> = BaseProvider<Provision<TProvider>> & {
    useFactory: () => TProvider;
};

export function isFactoryProvider<TProvider>(provider: Provider<TProvider>): provider is FactoryProvider<TProvider> {
    return typeof provider === 'object' && 'provide' in provider && 'useFactory' in provider;
}

export type Provider<TProvider> = ValueProvider<TProvider> | ClassProvider<TProvider> | FactoryProvider<TProvider>;
