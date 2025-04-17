/**
 * Internally used to bind events to Maps JavaScript API objects.
 * @internal
 */
export declare function useMapsEventListener<T extends (...args: any[]) => void>(target?: object | null, name?: string, callback?: T | null): void;
