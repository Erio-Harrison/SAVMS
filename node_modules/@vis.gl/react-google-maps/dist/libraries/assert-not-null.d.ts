/**
 * A typescript assertion function used in cases where typescript has to be
 * convinced that the object in question can not be null.
 *
 * @param value
 * @param message
 */
export declare function assertNotNull<TValue>(value: TValue, message?: string): asserts value is NonNullable<TValue>;
