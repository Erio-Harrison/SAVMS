interface ApiLibraries {
    core: google.maps.CoreLibrary;
    maps: google.maps.MapsLibrary;
    places: google.maps.PlacesLibrary;
    geocoding: google.maps.GeocodingLibrary;
    routes: google.maps.RoutesLibrary;
    marker: google.maps.MarkerLibrary;
    geometry: google.maps.GeometryLibrary;
    elevation: google.maps.ElevationLibrary;
    streetView: google.maps.StreetViewLibrary;
    journeySharing: google.maps.JourneySharingLibrary;
    drawing: google.maps.DrawingLibrary;
    visualization: google.maps.VisualizationLibrary;
}
export declare function useMapsLibrary<K extends keyof ApiLibraries, V extends ApiLibraries[K]>(name: K): V | null;
export {};
