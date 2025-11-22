// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `TValue` is used when injecting the token
export class InjectionToken<TValue> {
    constructor(public name: string) {}
}