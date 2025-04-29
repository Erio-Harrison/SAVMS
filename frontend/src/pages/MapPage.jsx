import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import CustomAdvancedMarker from '../components/custom-advanced-marker/custom-advanced-marker';
import axiosInstance from '../axiosInstance';

export default function MapPage() {
    // 存储后端返回的车辆列表
    const [vehicles, setVehicles] = useState([]);
    // 存储地图实例，用来取 bounds
    const mapRef = useRef(null);

    // 当地图加载完成时，注册 idle 事件，触发范围查询
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
            );
        });
    };

    // 从后端拉取指定范围内的车辆
    const fetchVehiclesWithinRange = async (minLat, maxLat, minLng, maxLng) => {
        try {
            const response = await axiosInstance.get('/vehicles/withinRange', {
                params: { minLat, maxLat, minLng, maxLng }
            });
            // 如果你的后端包装在 { code, data } 里，就取 .data
            const list = response.data.data || response.data;
            setVehicles(list);
        } catch (err) {
            console.error('加载车辆失败', err);
            setVehicles([]);
        }
    };

    return (
        <div className="h-full w-full">
            {/* 用你的 Google Maps API Key 替换下面字符串 */}
            <APIProvider apiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <Map
                    mapId="bf51a910020fa25a"
                    defaultZoom={12}
                    defaultCenter={{ lat: -35.2809, lng: 149.1300 }}
                    gestureHandling="greedy"
                    disableDefaultUI
                    onLoad={handleMapLoad}
                >
                    {/*
            vehicles 是从后端拿到的数组，
            每个元素都传给 CustomAdvancedMarker 来渲染一个标记
          */}
                    {vehicles.map(vehicle => (
                        <CustomAdvancedMarker
                            key={vehicle._id}
                            realEstateListing={vehicle}
                        />
                    ))}
                </Map>
            </APIProvider>
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