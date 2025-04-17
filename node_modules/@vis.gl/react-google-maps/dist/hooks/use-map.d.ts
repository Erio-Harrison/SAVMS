/**
 * Retrieves a map-instance from the context. This is either an instance
 * identified by id or the parent map instance if no id is specified.
 * Returns null if neither can be found.
 */
export declare const useMap: (id?: string | null) => google.maps.Map | null;
