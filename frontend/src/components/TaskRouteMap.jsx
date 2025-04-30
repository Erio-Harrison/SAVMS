import { useEffect, useRef } from "react";

export default function TaskRouteMap({ origin, destination }) {
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null);

    useEffect(() => {
        if (!origin || !destination) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: origin,
            zoom: 13,
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        directionsRendererRef.current = directionsRenderer;

        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Directions request failed:", status);
                }
            }
        );
    }, [origin, destination]);

    return <div ref={mapRef} className="w-full h-full rounded-3xl" />;
}
