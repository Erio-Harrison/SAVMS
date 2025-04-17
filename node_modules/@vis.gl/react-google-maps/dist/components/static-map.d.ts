import React from 'react';
export { createStaticMapsUrl } from '../libraries/create-static-maps-url';
export * from '../libraries/create-static-maps-url/types';
/**
 * Props for the StaticMap component
 */
export type StaticMapProps = {
    url: string;
    className?: string;
};
export declare const StaticMap: (props: StaticMapProps) => React.JSX.Element;
