/**
 * Internally used to bind events to DOM nodes.
 * @internal
 */
export declare function useDomEventListener<T extends (...args: any[]) => void>(target?: Node | null, name?: string, callback?: T | null): void;
