import { MapProps } from '../map';
/**
 * Internal hook to update the map-options when props are changed.
 *
 * @param map the map instance
 * @param mapProps the props to update the map-instance with
 * @internal
 */
export declare function useMapOptions(map: google.maps.Map | null, mapProps: MapProps): void;
