import React, {useEffect, useState, useCallback} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {useMap} from '@vis.gl/react-google-maps';
import CustomAdvancedMarker from '../components/custom-advanced-marker/custom-advanced-marker';

import '../components/custom-advanced-marker/style.css';
import {loadRealEstateListing} from "../components/custom-advanced-marker/load-real-estate-listing.jsx";
export default function MapPage(){
    const [realEstateListing, setRealEstateListing] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [destination, setDestination] = useState('');
    const [destinationLatLng, setDestinationLatLng] = useState(null);
    const [originLatLng, setOriginLatLng] = useState(null);
    useEffect(() => {
        loadRealEstateListing().then((data) => {
            setRealEstateListing(data);
        });
    }, []);

    const handleMapReady = useCallback((map) => {
        setMapInstance(map);
    }, []);

    // 地理编码：将地址转换为经纬度
    const handleGeocodeAddressAndRoute = async () => {
        if (!window.google || !destination) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: destination }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
                const latLng = results[0].geometry.location;
                setDestinationLatLng(latLng);
                console.log('Geocoded LatLng:', latLng);
                // 路线计算
                calculateRoute(latLng);
            } else {
                alert('Geocoding failed: ' + status);
            }
        });
    };

    // 计算路径
    const calculateRoute = (destinationLatLng) => {
        if (!window.google || !mapInstance) return;

        const directionsService = new window.google.maps.DirectionsService();
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();

        const origin = originLatLng || mapInstance.getCenter();

        directionsService.route(
            {
                origin,
                destination: destinationLatLng,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === 'OK') {
                    newDirectionsRenderer.setDirections(result);
                    newDirectionsRenderer.setMap(mapInstance);
                    setDirectionsRenderer(newDirectionsRenderer);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    const controlStyles = {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        gap: '8px'
    };

    if (!realEstateListing) {
        return <div>Loading...</div>; // 如果数据未加载，显示加载提示
    }

    return (
        <div className="advanced-marker-example" style={{ position: 'relative', height: '100vh' }}>
            <div style={controlStyles}>
                <input
                    type="text"
                    placeholder="Address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '250px' }}
                />
                <button onClick={handleGeocodeAddressAndRoute} style={{ padding: '6px 12px' }}>
                    Search
                </button>
            </div>
            <Map
                mapId={'bf51a910020fa25a'}
                defaultZoom={12}
                defaultCenter={{lat: -33.83, lng: 151.24}}
                gestureHandling={'greedy'}
                disableDefaultUI>
                <MapWithRoute
                    onMapReady={handleMapReady}
                />
                <CustomAdvancedMarker
                    realEstateListing={realEstateListing}
                    onMarkerClick={(latLng) => {
                        console.log('Marker set as origin:', latLng);
                        setOriginLatLng(latLng); // 设置起点为 marker 的位置
                    }}
                />
            </Map>
        </div>
    );
}
function MapWithRoute({ realEstateListing, onMapReady }) {
    const map = useMap();

    useEffect(() => {
        if (map && onMapReady) {
            onMapReady(map);
        }
    }, [map, onMapReady]);

    return (
        <>
            {realEstateListing && (
                <CustomAdvancedMarker realEstateListing={realEstateListing} />
            )}
        </>
    );
}

