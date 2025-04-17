export type DeckGlCompatProps = {
    /**
     * Viewport from deck.gl
     */
    viewport?: unknown;
    /**
     * View state from deck.gl
     */
    viewState?: Record<string, unknown>;
    /**
     * Initial View State from deck.gl
     */
    initialViewState?: Record<string, unknown>;
};
/**
 * Internal hook that updates the camera when deck.gl viewState changes.
 * @internal
 */
export declare function useDeckGLCameraUpdate(map: google.maps.Map | null, props: DeckGlCompatProps): boolean;
