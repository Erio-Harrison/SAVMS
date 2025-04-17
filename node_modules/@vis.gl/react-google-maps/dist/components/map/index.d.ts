import React, { CSSProperties, FunctionComponent, PropsWithChildren } from 'react';
import { MapEventProps } from './use-map-events';
import { DeckGlCompatProps } from './use-deckgl-camera-update';
export interface GoogleMapsContextValue {
    map: google.maps.Map | null;
}
export declare const GoogleMapsContext: React.Context<GoogleMapsContextValue | null>;
export type { MapCameraChangedEvent, MapEvent, MapEventProps, MapMouseEvent } from './use-map-events';
export type MapCameraProps = {
    center: google.maps.LatLngLiteral;
    zoom: number;
    heading?: number;
    tilt?: number;
};
export declare const ColorScheme: {
    readonly DARK: "DARK";
    readonly LIGHT: "LIGHT";
    readonly FOLLOW_SYSTEM: "FOLLOW_SYSTEM";
};
export type ColorScheme = (typeof ColorScheme)[keyof typeof ColorScheme];
export declare const RenderingType: {
    readonly VECTOR: "VECTOR";
    readonly RASTER: "RASTER";
    readonly UNINITIALIZED: "UNINITIALIZED";
};
export type RenderingType = (typeof RenderingType)[keyof typeof RenderingType];
/**
 * Props for the Map Component
 */
export type MapProps = PropsWithChildren<Omit<google.maps.MapOptions, 'renderingType' | 'colorScheme'> & MapEventProps & DeckGlCompatProps & {
    /**
     * An id for the map, this is required when multiple maps are present
     * in the same APIProvider context.
     */
    id?: string;
    /**
     * Additional style rules to apply to the map dom-element.
     */
    style?: CSSProperties;
    /**
     * Additional css class-name to apply to the element containing the map.
     */
    className?: string;
    /**
     * The color-scheme to use for the map.
     */
    colorScheme?: ColorScheme;
    /**
     * The rendering-type to be used.
     */
    renderingType?: RenderingType;
    /**
     * Indicates that the map will be controlled externally. Disables all controls provided by the map itself.
     */
    controlled?: boolean;
    /**
     * Enable caching of map-instances created by this component.
     */
    reuseMaps?: boolean;
    defaultCenter?: google.maps.LatLngLiteral;
    defaultZoom?: number;
    defaultHeading?: number;
    defaultTilt?: number;
    /**
     * Alternative way to specify the default camera props as a geographic region that should be fully visible
     */
    defaultBounds?: google.maps.LatLngBoundsLiteral & {
        padding?: number | google.maps.Padding;
    };
}>;
export declare const Map: FunctionComponent<MapProps>;
