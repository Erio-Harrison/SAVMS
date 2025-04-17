import React, { CSSProperties } from 'react';
import type { PropsWithChildren } from 'react';
export interface AdvancedMarkerContextValue {
    marker: google.maps.marker.AdvancedMarkerElement;
}
export declare function isAdvancedMarker(marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement): marker is google.maps.marker.AdvancedMarkerElement;
/**
 * Copy of the `google.maps.CollisionBehavior` constants.
 * They have to be duplicated here since we can't wait for the maps API to load to be able to use them.
 */
export declare const CollisionBehavior: {
    readonly REQUIRED: "REQUIRED";
    readonly REQUIRED_AND_HIDES_OPTIONAL: "REQUIRED_AND_HIDES_OPTIONAL";
    readonly OPTIONAL_AND_HIDES_LOWER_PRIORITY: "OPTIONAL_AND_HIDES_LOWER_PRIORITY";
};
export type CollisionBehavior = (typeof CollisionBehavior)[keyof typeof CollisionBehavior];
export declare const AdvancedMarkerContext: React.Context<AdvancedMarkerContextValue | null>;
export declare const AdvancedMarkerAnchorPoint: {
    readonly TOP_LEFT: readonly ["0%", "0%"];
    readonly TOP_CENTER: readonly ["50%", "0%"];
    readonly TOP: readonly ["50%", "0%"];
    readonly TOP_RIGHT: readonly ["100%", "0%"];
    readonly LEFT_CENTER: readonly ["0%", "50%"];
    readonly LEFT_TOP: readonly ["0%", "0%"];
    readonly LEFT: readonly ["0%", "50%"];
    readonly LEFT_BOTTOM: readonly ["0%", "100%"];
    readonly RIGHT_TOP: readonly ["100%", "0%"];
    readonly RIGHT: readonly ["100%", "50%"];
    readonly RIGHT_CENTER: readonly ["100%", "50%"];
    readonly RIGHT_BOTTOM: readonly ["100%", "100%"];
    readonly BOTTOM_LEFT: readonly ["0%", "100%"];
    readonly BOTTOM_CENTER: readonly ["50%", "100%"];
    readonly BOTTOM: readonly ["50%", "100%"];
    readonly BOTTOM_RIGHT: readonly ["100%", "100%"];
    readonly CENTER: readonly ["50%", "50%"];
};
export type AdvancedMarkerAnchorPoint = (typeof AdvancedMarkerAnchorPoint)[keyof typeof AdvancedMarkerAnchorPoint];
type AdvancedMarkerEventProps = {
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onMouseEnter?: (e: google.maps.MapMouseEvent['domEvent']) => void;
    onMouseLeave?: (e: google.maps.MapMouseEvent['domEvent']) => void;
    onDrag?: (e: google.maps.MapMouseEvent) => void;
    onDragStart?: (e: google.maps.MapMouseEvent) => void;
    onDragEnd?: (e: google.maps.MapMouseEvent) => void;
};
export type AdvancedMarkerProps = PropsWithChildren<Omit<google.maps.marker.AdvancedMarkerElementOptions, 'gmpDraggable' | 'gmpClickable' | 'content' | 'map' | 'collisionBehavior'> & AdvancedMarkerEventProps & {
    draggable?: boolean;
    clickable?: boolean;
    collisionBehavior?: CollisionBehavior;
    /**
     * The anchor point for the Advanced Marker.
     * Either use one of the predefined anchor point from the "AdvancedMarkerAnchorPoint" export
     * or provide a string tuple in the form of ["xPosition", "yPosition"].
     * The position is measured from the top-left corner and
     * can be anything that can be consumed by a CSS translate() function.
     * For example in percent ("50%") or in pixels ("20px").
     */
    anchorPoint?: AdvancedMarkerAnchorPoint | [string, string];
    /**
     * A className for the content element.
     * (can only be used with HTML Marker content)
     */
    className?: string;
    /**
     * Additional styles to apply to the content element.
     */
    style?: CSSProperties;
}>;
export type CustomMarkerContent = (HTMLDivElement & {
    isCustomMarker?: boolean;
}) | null;
export type AdvancedMarkerRef = google.maps.marker.AdvancedMarkerElement | null;
export declare const AdvancedMarker: React.ForwardRefExoticComponent<Omit<google.maps.marker.AdvancedMarkerElementOptions, "gmpDraggable" | "gmpClickable" | "content" | "map" | "collisionBehavior"> & AdvancedMarkerEventProps & {
    draggable?: boolean;
    clickable?: boolean;
    collisionBehavior?: CollisionBehavior;
    /**
     * The anchor point for the Advanced Marker.
     * Either use one of the predefined anchor point from the "AdvancedMarkerAnchorPoint" export
     * or provide a string tuple in the form of ["xPosition", "yPosition"].
     * The position is measured from the top-left corner and
     * can be anything that can be consumed by a CSS translate() function.
     * For example in percent ("50%") or in pixels ("20px").
     */
    anchorPoint?: AdvancedMarkerAnchorPoint | [string, string];
    /**
     * A className for the content element.
     * (can only be used with HTML Marker content)
     */
    className?: string;
    /**
     * Additional styles to apply to the content element.
     */
    style?: CSSProperties;
} & {
    children?: React.ReactNode | undefined;
} & React.RefAttributes<google.maps.marker.AdvancedMarkerElement>>;
export declare function useAdvancedMarkerRef(): readonly [(m: AdvancedMarkerRef | null) => void, google.maps.marker.AdvancedMarkerElement | null];
export {};
