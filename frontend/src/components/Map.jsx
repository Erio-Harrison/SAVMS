import { useEffect } from 'react';

export default function Map({ lat, lng }) {
    useEffect(() => {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: lat, lng: lng },
            zoom: 10,
        });
    }, []);

    return <div className='rounded-3xl' id="map" style={{ height: '100%', width: '100%' }}></div>;
};