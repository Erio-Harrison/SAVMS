import React, {useRef, useState} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import CustomAdvancedMarker from '../components/custom-advanced-marker/custom-advanced-marker';

import '../components/custom-advanced-marker/style.css';
import {loadRealEstateListing} from "../components/custom-advanced-marker/load-real-estate-listing.jsx";


// 封装一个调用后端接口的方法
async function fetchVehiclesWithinRange(swLat, neLat, swLng, neLng) {
    const response = await fetch(
        `/vehicles/withinRange?minLat=${swLat}&maxLat=${neLat}&minLng=${swLng}&maxLng=${neLng}`
    );
    if (!response.ok) {
        throw new Error('获取车辆数据失败');
    }
    return await response.json();
}

export default function MapPage() {
    const [vehicles, setVehicles] = useState([]);
    const mapRef = useRef(null);

    // 地图加载完毕后，获取地图实例并监听地图空闲（idle）事件
    const handleMapLoad = (map) => {
        mapRef.current = map;
        map.addListener('idle', () => {
            const bounds = map.getBounds();
            if (!bounds) return;

            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            fetchVehiclesWithinRange(
                sw.lat(),
                ne.lat(),
                sw.lng(),
                ne.lng()
            )
                .then((rawData) => {
                    // 假设后端返回字段为 { lat: ..., lng: ..., plate: ..., model: ... }
                    const formatted = rawData.map(item => ({
                        _id: item._id,
                        licensePlate: item.plate,
                        carModel: item.model,
                        energyType: item.energyType, // 如果有其他转换，按需处理
                        year: item.year,
                        carsize: item.size,
                        location: {
                            latitude: item.lat,
                            longitude: item.lng
                        },
                    }));
                    setVehicles(formatted);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    };

    return (
        <div className="advanced-marker-example">
            <Map
                mapId={'bf51a910020fa25a'}
                defaultZoom={12}
                defaultCenter={{ lat: -33.83, lng: 151.24 }}
                gestureHandling="greedy"
                disableDefaultUI
                onLoad={handleMapLoad}
            >
                {vehicles.map((vehicle) => (
                    <CustomAdvancedMarker
                        key={vehicle._id}
                        realEstateListing={vehicle}
                    />
                ))}
            </Map>
        </div>
    );
}
//
// // const MapPage = () => {
// //     const [realEstateListing, setRealEstateListing] = useState(null);
// //
// //     useEffect(() => {
// //         loadRealEstateListing().then((data) => {
// //             setRealEstateListing(data);
// //         });
// //     }, []);
// //
// //     return (
// //         <div className="advanced-marker-example">
// //             <APIProvider apiKey={API_KEY} libraries={['marker']}>
// //                 <Map
// //                     mapId={'bf51a910020fa25a'}
// //                     defaultZoom={5}
// //                     defaultCenter={{ lat: 47.53, lng: -122.34 }}
// //                     gestureHandling={'greedy'}
// //                     disableDefaultUI
// //                 >
// //                     {/* advanced marker with html-content */}
// //                     {realEstateListing && (
// //                         <CustomAdvancedMarker realEstateListing={realEstateListing} />
// //                     )}
// //                 </Map>
// //
// //                 <ControlPanel />
// //             </APIProvider>
// //         </div>
// //     );
// // }
// export default function MapPage(){
//     const [realEstateListing, setRealEstateListing] = useState(null);
//
//     useEffect(() => {
//         loadRealEstateListing().then((data) => {
//             setRealEstateListing(data);
//         });
//     }, []);
//
//     if (!realEstateListing) {
//         return <div>Loading...</div>; // 如果数据未加载，显示加载提示
//     }
//
//     // useEffect(() => {
//     //     const fetchInfos = async () => {
//     //         const newMarkersData = [
//     //             {
//     //                 "uuid": "82e41887-0605-48b2-bb54-458eda8b7726",
//     //                 "details": {
//     //                     "property_type": "Townhouse",
//     //                     "property_address": "5468 Becky Pass Apt. 215, Seattle, WA 98169",
//     //                     "property_bedrooms": 1,
//     //                     "property_bathrooms": 3,
//     //                     "property_square_feet": "1404 sq ft",
//     //                     "property_lot_size": "3710 sq ft",
//     //                     "property_price": "$1075859",
//     //                     "property_year_built": 2013,
//     //                     "property_adjective": "modern",
//     //                     "property_material": "grey Douglas Fir Wood and Concrete",
//     //                     "property_garage": false,
//     //                     "property_features": ["Basement"],
//     //                     "property_accessibility": "-",
//     //                     "property_eco_features": "-",
//     //                     "property_has_view": false,
//     //                     "local_amenities": "close to shopping",
//     //                     "transport_access": "excellent bus connectivity",
//     //                     "ambiance": "upcoming district",
//     //                     "latitude": 47.532273,
//     //                     "longitude": -122.342249,
//     //                     "img_weather": "afternoon",
//     //                     "listing_title": "Modern Townhouse Perfect for Urban Living",
//     //                     "listing_description": "This 1404 sq ft, 1-bedroom, 3-bathroom modern townhouse offers a sophisticated exterior of grey Douglas Fir wood and concrete.",
//     //                     "img_prompt_front": "4k photo of a modern Townhouse built in 2013 clad in grey Douglas Fir Wood and Concrete, in the Seattle area, taken from street level, natural afternoon lighting, 35mm lens. The image style should be realistic and high quality, similar to professional real estate photography. Additional building info: Modern Townhouse Perfect for Urban Living",
//     //                     "img_prompt_back": "4k photo of the garden of a modern Townhouse built in 2013 clad in grey Douglas Fir Wood and Concrete, in the Seattle area, taken from building backside, natural afternoon lighting, 35mm lens. The image style should be realistic and high quality, similar to professional real estate photography. Additional building info: Modern Townhouse Perfect for Urban Living",
//     //                     "img_prompt_bedroom": "4k photo of a bedroom in a modern Townhouse built in 2013, in the Seattle area, natural afternoon lighting, 35mm lens. The image style should be realistic and high quality, similar to professional real estate photography. Additional room info: , with bamboo flooring, brick walls, and plush comforter with tree motif. The window is dressed with minimal coverings and illuminated by table lamp with wooden base. Decorations include local art prints and it's furnished with a modern wood bed frame."
//     //                 }
//     //             }
//     //         ];
//     //         setRealEstateListing(newMarkersData);
//     //     };
//     //     fetchInfos();
//     // })
//
//     return (
//         <div className="advanced-marker-example">
//             <Map
//                 mapId={'bf51a910020fa25a'}
//                 defaultZoom={12}
//                 defaultCenter={{lat: -33.83, lng: 151.24}}
//                 gestureHandling={'greedy'}
//                 disableDefaultUI>
//                 {realEstateListing && (
//                     <CustomAdvancedMarker realEstateListing={realEstateListing} />
//                 )}
//             </Map>
//         </div>
//
//     );
// }