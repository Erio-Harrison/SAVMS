import { MutableRefObject } from 'react';
export type CameraState = {
    center: google.maps.LatLngLiteral;
    heading: number;
    tilt: number;
    zoom: number;
};
export type CameraStateRef = MutableRefObject<CameraState>;
/**
 * Creates a mutable ref object to track the last known state of the map camera.
 * This is used in `useMapCameraParams` to reduce stuttering in normal operation
 * by avoiding updates of the map camera with values that have already been processed.
 */
export declare function useTrackedCameraStateRef(map: google.maps.Map | null): CameraStateRef;
