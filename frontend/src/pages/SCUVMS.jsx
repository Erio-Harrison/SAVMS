import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import CarInfo from "../components/CarInfo";
import HourlyForecastCard from "../components/HourlyForecastCard";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";

export default function SCUVMS() {
    const [carInfo, setCarInfo] = useState({});
    const [city, setCity] = useState('Canberra');
    const [currentWeather, setCurrentWeather] = useState({})
    const [weatherArray, setWeatherArray] = useState([]);

    useEffect(() => {
        const fetchCarInfo = async () => {
            // TODO: axios get car info
            const carInfoData = { vehicleId: '#12345678', plateNum: 'XYZ-123' };
            setCarInfo(carInfoData);
        };
        fetchCarInfo();
    }, []); // set dependency when select a car on map

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

    const handleSearch = (query) => {
        setCity(query);
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <Sidebar />
            <CarInfo carInfo={carInfo} />

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
                {/* TODO: map section*/}
                <div className="h-2/3 bg-white rounded-3xl">

                </div>
            </div>
        </div>
    );
}