import { CSSProperties, FunctionComponent, PropsWithChildren, ReactNode } from 'react';
export type InfoWindowProps = Omit<google.maps.InfoWindowOptions, 'headerContent' | 'content' | 'pixelOffset'> & {
    style?: CSSProperties;
    className?: string;
    anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
    pixelOffset?: [number, number];
    shouldFocus?: boolean;
    onClose?: () => void;
    onCloseClick?: () => void;
    headerContent?: ReactNode;
};
/**
 * Component to render an Info Window with the Maps JavaScript API
 */
export declare const InfoWindow: FunctionComponent<PropsWithChildren<InfoWindowProps>>;
