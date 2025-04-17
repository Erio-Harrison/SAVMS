import { StaticMapsMarker } from './types';
/**
 * Assembles marker parameters for static maps.
 *
 * This function takes an array of markers and groups them by their style properties.
 * It then creates a string representation of these markers, including their styles and locations,
 * which can be used as parameters for static map APIs.
 *
 * @param {StaticMapsMarker[]} [markers=[]] - An array of markers to be processed. Each marker can have properties such as color, label, size, scale, icon, anchor, and location.
 * @returns {string[]} An array of strings, each representing a group of markers with their styles and locations.
 *
 * @example
 * const markers = [
 *   { color: 'blue', label: 'A', size: 'mid', location: '40.714728,-73.998672' },
 *   { color: 'blue', label: 'B', size: 'mid', location: '40.714728,-73.998672' },
 *   { icon: 'http://example.com/icon.png', location: { lat: 40.714728, lng: -73.998672 } }
 * ];
 * const params = assembleMarkerParams(markers);
 * // Params will be an array of strings representing the marker parameters
 * Example output: [
 *   "color:blue|label:A|size:mid|40.714728,-73.998672|40.714728,-73.998672",
 *   "color:blue|label:B|size:mid|40.714728,-73.998672|40.714728,-73.998672",
 *   "icon:http://example.com/icon.png|40.714728,-73.998672"
 * ]
 */
export declare function assembleMarkerParams(markers?: StaticMapsMarker[]): string[];
