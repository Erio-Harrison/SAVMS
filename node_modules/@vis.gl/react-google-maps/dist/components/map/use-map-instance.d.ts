import { Ref } from 'react';
import { MapProps } from '../map';
import { APIProviderContextValue } from '../api-provider';
import { CameraStateRef } from './use-tracked-camera-state-ref';
/**
 * The main hook takes care of creating map-instances and registering them in
 * the api-provider context.
 * @return a tuple of the map-instance created (or null) and the callback
 *   ref that will be used to pass the map-container into this hook.
 * @internal
 */
export declare function useMapInstance(props: MapProps, context: APIProviderContextValue): readonly [
    map: google.maps.Map | null,
    containerRef: Ref<HTMLDivElement>,
    cameraStateRef: CameraStateRef
];
