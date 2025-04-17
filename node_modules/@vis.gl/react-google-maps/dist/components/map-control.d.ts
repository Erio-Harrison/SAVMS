import { FunctionComponent } from 'react';
import type { PropsWithChildren } from 'react';
type MapControlProps = PropsWithChildren<{
    position: ControlPosition;
}>;
/**
 * Copy of the `google.maps.ControlPosition` constants.
 * They have to be duplicated here since we can't wait for the maps API to load to be able to use them.
 */
export declare const ControlPosition: {
    readonly TOP_LEFT: 1;
    readonly TOP_CENTER: 2;
    readonly TOP: 2;
    readonly TOP_RIGHT: 3;
    readonly LEFT_CENTER: 4;
    readonly LEFT_TOP: 5;
    readonly LEFT: 5;
    readonly LEFT_BOTTOM: 6;
    readonly RIGHT_TOP: 7;
    readonly RIGHT: 7;
    readonly RIGHT_CENTER: 8;
    readonly RIGHT_BOTTOM: 9;
    readonly BOTTOM_LEFT: 10;
    readonly BOTTOM_CENTER: 11;
    readonly BOTTOM: 11;
    readonly BOTTOM_RIGHT: 12;
    readonly CENTER: 13;
    readonly BLOCK_START_INLINE_START: 14;
    readonly BLOCK_START_INLINE_CENTER: 15;
    readonly BLOCK_START_INLINE_END: 16;
    readonly INLINE_START_BLOCK_CENTER: 17;
    readonly INLINE_START_BLOCK_START: 18;
    readonly INLINE_START_BLOCK_END: 19;
    readonly INLINE_END_BLOCK_START: 20;
    readonly INLINE_END_BLOCK_CENTER: 21;
    readonly INLINE_END_BLOCK_END: 22;
    readonly BLOCK_END_INLINE_START: 23;
    readonly BLOCK_END_INLINE_CENTER: 24;
    readonly BLOCK_END_INLINE_END: 25;
};
export type ControlPosition = (typeof ControlPosition)[keyof typeof ControlPosition];
export declare const MapControl: FunctionComponent<MapControlProps>;
export {};
