import { container } from '$lib/core/di/container';
import {
    type InjectOptions,
    isClassProvider,
    isFactoryProvider,
    isValueProvider,
    type Provider,
    type Provision,
} from '$lib/core/di/di.types';
import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';
import { isAsyncInitializable } from './init';

export async function provide(providers: Provider<unknown>[]): Promise<void> {
    for (const provider of providers) {
        const provision = getProvision(provider);

        // Only the class provider is guaranteed to always provide the same value for the same dependency.
        // Since the other providers can provide different values for the same dependency, they must not
        // be skipped.
        if (container.get(provision) !== undefined && isClassProvider(provider)) {
            continue;
        }

        const value = getValue(provider);

        if (isAsyncInitializable(value)) {
            await value.init();
        }

        container.set(provision, value);
    }
}

export function inject<TType extends Type>(type: TType): InstanceType<TType>;

export function inject<TType extends Type>(type: TType, options?: InjectOptions & { optional?: false }): InstanceType<TType>;

export function inject<TType extends Type>(type: TType, options?: InjectOptions): InstanceType<TType> | null;

export function inject<TValue>(token: InjectionToken<TValue>): TValue;

export function inject<TValue>(token: InjectionToken<TValue>, options?: InjectOptions & { optional?: false }): TValue;

export function inject<TValue>(token: InjectionToken<TValue>, options?: InjectOptions): TValue | null;

export function inject<TType extends Type, TValue>(
    type: TType | InjectionToken<TValue>,
    options?: InjectOptions,
): InstanceType<TType> | TValue | null {
    const value = container.get(type) as InstanceType<TType> | TValue;

    if (value === undefined && !(options?.optional ?? false)) {
        const name = type instanceof InjectionToken ? type.name : type.constructor.name;

        throw new Error(`No provider for ${name}`);
    }

    return value ?? null;
}

function getProvision(provider: Provider<unknown>): Provision<unknown> {
    return isValueProvider(provider) || isFactoryProvider(provider) ? provider.provide : provider;
}

function getValue(provider: Provider<unknown>): unknown {
    if (isValueProvider(provider)) {
        return provider.useValue;
    } else if (isClassProvider(provider)) {
        return new provider();
    } else {
        return provider.useFactory();
    }
}
