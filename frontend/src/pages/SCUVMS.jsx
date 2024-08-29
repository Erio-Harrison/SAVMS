import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import CarInfo from "../components/CarInfo";
import HourlyForecastCard from "../components/HourlyForecastCard";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import Map from "../components/Map";
import AddNewCar from "../components/AddNewCar";

export default function SCUVMS() {
    const [carInfo, setCarInfo] = useState({});
    const [city, setCity] = useState('Canberra');
    const [currentWeather, setCurrentWeather] = useState({});
    const [weatherArray, setWeatherArray] = useState([]);
    const [coordinate, setCoordinate] = useState({lat: -35.2809, lng: 149.1300});
    const [markers, setMarkers] = useState([]);
    const [selectedCar, setSelectedCar] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            // TODO: axios get weather
            const currentWeatherData = { weather: 'Sunny', temperature: 19, chanceOfRain: 30 };
            const weatherArrayData = [
                { time: '1PM', weather: 'Sunny', temperature: 20 },
                { time: '2PM', weather: 'Cloudy', temperature: 18 },
                { time: '3PM', weather: 'Rainy', temperature: 16 },
                { time: '4PM', weather: 'Sunny', temperature: 17 },
                { time: '5PM', weather: 'Snowy', temperature: 19 },
                { time: '6PM', weather: 'Rainy', temperature: 21 },
            ];
            setCurrentWeather(currentWeatherData);
            setWeatherArray(weatherArrayData);
        };
        fetchWeather();
    }, []);

    useEffect(() => {
        const fetchMarkers = async () => {
            // TODO: axios get markers
            const newMarkersData = [
                { lat: -35.2600, lng: 149.1300 },
                { lat: -35.2800, lng: 149.1500 },
                { lat: -35.3000, lng: 149.1600 },
            ];
            setMarkers(newMarkersData);
        };
        fetchMarkers();
    }, []);

    const handleSearch = (query) => {
        setCity(query);
        // TODO: get query cooredinate
        setCoordinate({lat: -35.2809, lng: 149.1300});
    };

    const handleMarkerClick = (marker) => {
        const fetchCarInfo = async () => {
            // TODO: axios get car info
            const carInfoData = { vehicleId: '#12345678', plateNum: 'XYZ-123' };
            setCarInfo(carInfoData);
        };
        fetchCarInfo();
        setSelectedCar(true);
    };

    const SubmitNewCar = (newCarInfo) => {
        console.log(newCarInfo);
    }

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <Sidebar />
            <div className="flex flex-col w-1/4 gap-4 flex-grow">
                <div className="text-2xl font-bold">Tracking</div>
                <div className="bg-accent rounded-3xl p-4 flex flex-col h-screen">
                    {selectedCar && <CarInfo carInfo={carInfo}/>}
                    {!selectedCar && <AddNewCar SubmitNewCar={SubmitNewCar}/>}
                </div>
            </div>
            
            {/* Weather and Map Section */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="h-1/3 flex gap-4">
                    <div className="w-4/5 flex flex-col gap-4">
                        <SearchBar onSearch={handleSearch} />
                        <div className="px-6 py-4 rounded-3xl flex flex-grow bg-radial-gradient text-white justify-between items-center">
                            {weatherArray.map((weather, index) => (
                                <HourlyForecastCard
                                    key={index} time={weather.time} weather={weather.weather} temperature={weather.temperature}
                                />
                            ))}
                        </div>
                    </div>
                    <CurrentWeatherCard city={city} currentWeather={currentWeather}/>
                </div>
                <div className="h-2/3 bg-white rounded-3xl">
                    <Map lat={coordinate.lat} lng={coordinate.lng} markers={markers} onMarkerClick={handleMarkerClick}/>
                </div>
            </div>
        </div>
    );
}
