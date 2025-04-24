import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import CarInfo from "../components/CarInfo";
import HourlyForecastCard from "../components/HourlyForecastCard";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import Map from "../components/Map";
import axiosInstance from '../axiosInstance';
import { Popover } from '@douyinfe/semi-ui';

export default function MainPage() {
    const [carInfo, setCarInfo] = useState({});

    const [city, setCity] = useState('Canberra');
    const [currentWeather, setCurrentWeather] = useState({});
    const [weatherArray, setWeatherArray] = useState([]);
    const [coordinate, setCoordinate] = useState({lat: -35.2809, lng: 149.1300});
    const [markers, setMarkers] = useState([]);

    const [selectedCar, setSelectedCar] = useState(false);

    const [cars, setCars] = useState([]);

    const [weatherError, setWeatherError] = useState(null);// 新增状态来存放错误信息
    const fetchWeather = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/weather?city=${city}`);
            const result = await res.json();
            if (result.code === 1) {
                const weatherInfo = JSON.parse(result.data);

                const currentWeatherData = {
                    weather: weatherInfo.current.condition.code,
                    temperature: weatherInfo.current.temp_c,
                    chanceOfRain: weatherInfo.forecast.forecastday[0].day.daily_chance_of_rain,
                    description: weatherInfo.current.condition.text,
                    isDay: weatherInfo.current.is_day,
                };
                const currentLocalTime = weatherInfo.location.localtime; // "2025-03-17 23:50"
                const currentHour = parseInt(currentLocalTime.split(' ')[1].split(':')[0]); // 23
                const todayHours = weatherInfo.forecast.forecastday[0].hour.filter(hourItem => {
                    const itemHour = parseInt(hourItem.time.split(' ')[1].split(':')[0]);
                    return itemHour >= currentHour;
                });
                const tomorrowHours = weatherInfo.forecast.forecastday.length > 1
                    ? weatherInfo.forecast.forecastday[1].hour
                    : [];
                const nextHours = [...todayHours, ...tomorrowHours];
                const displayHours = nextHours.slice(0, 6);

                const weatherArrayData = displayHours.map(hourItem => ({
                    time: hourItem.time.split(' ')[1], // 只取小时分钟
                    weather: hourItem.condition.code,
                    temperature: hourItem.temp_c,
                    isDay: hourItem.is_day,
                }));


                setCurrentWeather(currentWeatherData);
                setWeatherArray(weatherArrayData);
                // 清除错误状态
                setWeatherError(null);
            } else {
                console.error('Backend Error:', result.msg);
                setWeatherError(`Can't get weather Info: ${result.msg}`);
            }
        } catch (error) {
            console.error('Request error:', error);
            setWeatherError('Request error, please try again!');
        }
    };
    useEffect(() => {
        fetchWeather();
    }, [city]);

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



        // get car list
        axiosInstance
            .get("/vehicles/get/all") // 替换成你的后端 API 路径
            .then((response) => {
                setCars(response.data.data); // 假设 response.data.data 是数组
            })
            .catch((error) => {
                console.error("Error fetching cars:", error);
                setError("Failed to load cars.");
            });
    }, []);

    const handleSearch = (query) => {
        setCity(query);
        // TODO: get query cooredinate
        setCoordinate({lat: -35.2809, lng: 149.1300});
    };
    // car
    const handleMarkerClick = (marker) => {
        const fetchCarInfo = async () => {
            // TODO: axios get car info
            const carInfoData = { vehicleId: '#12345678', plateNum: 'XYZ-123' };
            alert(carInfoData);
            setCarInfo(carInfoData);
        };
        fetchCarInfo();
        setSelectedCar(true);
    };


// 监听网络状态变更
    useEffect(() => {
        function handleOnline() {
            console.log("Network is back online, try to fetch weather again.");
            fetchWeather();
        }

        function handleOffline() {
            alert("You are offline now.");

        }

        // 添加事件监听
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // 在组件卸载时移除事件监听，防止内存泄漏
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [city]);


    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <div className="flex flex-col w-1/4 gap-4 flex-grow">
                <div className="text-2xl font-bold">Tracking</div>
                <div className="bg-accent rounded-3xl p-4 flex flex-col h-screen overflow-auto">
                    {cars.length > 0 ? (
                        cars.map((car) => {
                            const popoverContent = (
                                <div style={{ width: 280, padding: 12 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Vehicle Details</div>
                                    <div><strong>ID:</strong> {car.id}</div>
                                    <div><strong>Plate:</strong> {car.licensePlate}</div>
                                    <div><strong>Model:</strong> {car.carModel}</div>
                                    <div><strong>Speed:</strong> {car.speed} km/h</div>
                                    <div><strong>Energy:</strong> {car.leftoverEnergy}%</div>
                                    <div><strong>Location:</strong> {car.Location}</div>
                                    <div><strong>Status:</strong> {car.status}</div>
                                </div>
                            );

                            return (
                                <Popover key={car.id} content={popoverContent} trigger="hover" position="right">
                                    <div className="p-2 border-b border-gray-200 flex flex-col cursor-pointer">
                                        <span className="font-semibold text-lg">{car.licensePlate}</span>
                                        <span className="text-sm text-gray-600">{car.carModel}</span>
                                    </div>
                                </Popover>
                            );
                        })
                        ) : (
                        <div className="text-center text-gray-500">No cars available.</div>
                        )}
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
                                    key={index} time={weather.time} weather={weather.weather} temperature={weather.temperature} isDay={weather.isDay}
                                />
                            ))}
                        </div>
                    </div>
                    {/* 条件渲染，若发生错误则显示错误提示，否则显示当前天气卡 */}
                    {weatherError ? (
                        <div className="w-1/5 bg-radial-gradient text-white rounded-3xl flex flex-col px-3 py-4 items-center">
                            <div>{city}</div>
                            <div className="p-4 text-red-300 break-words">Unable to fetch weather data.</div>
                            <div className="text-xs p-2 break-words">{weatherError}</div>
                        </div>
                    ) : (
                        <CurrentWeatherCard city={city} currentWeather={currentWeather}/>
                    )}
                </div>
                <div className="h-2/3 bg-white rounded-3xl">
                    <Map lat={coordinate.lat} lng={coordinate.lng} markers={markers} onMarkerClick={handleMarkerClick}/>
                </div>
            </div>
        </div>

    );
}