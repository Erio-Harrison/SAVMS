/**
 * Handlers for all events that could be emitted by map-instances.
 */
export type MapEventProps = Partial<{
    onBoundsChanged: (event: MapCameraChangedEvent) => void;
    onCenterChanged: (event: MapCameraChangedEvent) => void;
    onHeadingChanged: (event: MapCameraChangedEvent) => void;
    onTiltChanged: (event: MapCameraChangedEvent) => void;
    onZoomChanged: (event: MapCameraChangedEvent) => void;
    onCameraChanged: (event: MapCameraChangedEvent) => void;
    onClick: (event: MapMouseEvent) => void;
    onDblclick: (event: MapMouseEvent) => void;
    onContextmenu: (event: MapMouseEvent) => void;
    onMousemove: (event: MapMouseEvent) => void;
    onMouseover: (event: MapMouseEvent) => void;
    onMouseout: (event: MapMouseEvent) => void;
    onDrag: (event: MapEvent) => void;
    onDragend: (event: MapEvent) => void;
    onDragstart: (event: MapEvent) => void;
    onTilesLoaded: (event: MapEvent) => void;
    onIdle: (event: MapEvent) => void;
    onProjectionChanged: (event: MapEvent) => void;
    onIsFractionalZoomEnabledChanged: (event: MapEvent) => void;
    onMapCapabilitiesChanged: (event: MapEvent) => void;
    onMapTypeIdChanged: (event: MapEvent) => void;
    onRenderingTypeChanged: (event: MapEvent) => void;
}>;
/**
 * Sets up effects to bind event-handlers for all event-props in MapEventProps.
 * @internal
 */
export declare function useMapEvents(map: google.maps.Map | null, props: MapEventProps): void;
export type MapEvent<T = unknown> = {
    type: string;
    map: google.maps.Map;
    detail: T;
    stoppable: boolean;
    stop: () => void;
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
};
export type MapMouseEvent = MapEvent<{
    latLng: google.maps.LatLngLiteral | null;
    placeId: string | null;
}>;
export type MapCameraChangedEvent = MapEvent<{
    center: google.maps.LatLngLiteral;
    bounds: google.maps.LatLngBoundsLiteral;
    zoom: number;
    heading: number;
    tilt: number;
}>;
