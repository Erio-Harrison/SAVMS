import { APILoadingStatus } from './api-loading-status';
export type ApiParams = {
    key: string;
    v?: string;
    language?: string;
    region?: string;
    libraries?: string;
    channel?: number;
    solutionChannel?: string;
    authReferrerPolicy?: string;
};
/**
 * A GoogleMapsApiLoader to reliably load and unload the Google Maps JavaScript API.
 *
 * The actual loading and unloading is delayed into the microtask queue, to
 * allow using the API in an useEffect hook, without worrying about multiple API loads.
 */
export declare class GoogleMapsApiLoader {
    /**
     * The current loadingStatus of the API.
     */
    static loadingStatus: APILoadingStatus;
    /**
     * The parameters used for first loading the API.
     */
    static serializedApiParams?: string;
    /**
     * A list of functions to be notified when the loading status changes.
     */
    private static listeners;
    /**
     * Loads the Maps JavaScript API with the specified parameters.
     * Since the Maps library can only be loaded once per page, this will
     * produce a warning when called multiple times with different
     * parameters.
     *
     * The returned promise resolves when loading completes
     * and rejects in case of an error or when the loading was aborted.
     */
    static load(params: ApiParams, onLoadingStatusChange: (status: APILoadingStatus) => void): Promise<void>;
    /**
     * Serialize the parameters used to load the library for easier comparison.
     */
    private static serializeParams;
    /**
     * Creates the global `google.maps.importLibrary` function for bootstrapping.
     * This is essentially a formatted version of the dynamic loading script
     * from the official documentation with some minor adjustments.
     *
     * The created importLibrary function will load the Google Maps JavaScript API,
     * which will then replace the `google.maps.importLibrary` function with the full
     * implementation.
     *
     * @see https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
     */
    private static initImportLibrary;
    /**
     * Calls all registered loadingStatusListeners after a status update.
     */
    private static notifyLoadingStatusListeners;
}
declare global {
    interface Window {
        __googleMapsCallback__?: () => void;
        gm_authFailure?: () => void;
    }
}
