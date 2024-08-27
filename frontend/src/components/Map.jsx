import { useEffect } from 'react';
import carSvg from "../assets/icon/car_with_bg.svg";

export default function Map({ lat, lng, markers, onMarkerClick }) {
    useEffect(() => {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: lat, lng: lng },
            zoom: 12,
        });

        markers.forEach(marker => {
            const googleMarker = new google.maps.Marker({
                position: { lat: marker.lat, lng: marker.lng },
                map: map,
                icon: {
                    url: carSvg,
                    scaledSize: new google.maps.Size(15, 15),
                },
            });

            googleMarker.addListener('click', () => {
                onMarkerClick(marker);
            });
        });
    }, [lat, lng, markers]);

    return <div className='rounded-3xl' id="map" style={{ height: '100%', width: '100%' }}></div>;
}
