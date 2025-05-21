import { useState, useEffect } from "react";
import HourlyForecastCard from "../components/HourlyForecastCard";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import Map from "../components/Map";
import axiosInstance from '../axiosInstance';
import DragChat from '../components/ChatPage';

import { Popover, Typography, Divider, Tag } from '@douyinfe/semi-ui';
const { Title, Text } = Typography;

import CarOperationButton from '../components/Cars/CarOperationButton';
import '../styles/PopoverStyles.css';

export default function MainPage() {
    // 车辆相关和界面状态
    const [carInfo, setCarInfo] = useState({}); // 当前选中车辆信息
    const [city, setCity] = useState('Canberra'); // 当前城市名
    const [currentWeather, setCurrentWeather] = useState({}); // 当前天气概况
    const [weatherArray, setWeatherArray] = useState([]); // 小时天气列表
    const [coordinate, setCoordinate] = useState({ lat: -35.2809, lng: 149.1300 }); // 地图中心坐标
    const [markers, setMarkers] = useState([]); // 地图标记点
    const [selectedCar, setSelectedCar] = useState(false); // 是否选中车辆
    const [cars, setCars] = useState([]); // 所有车辆数据
    const [weatherError, setWeatherError] = useState(null); // 天气请求错误信息

    // 设置 JWT 请求头（登录后保存的 token）
    const savedToken = localStorage.getItem("JWTtoken");
    if (savedToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    // 渲染每辆车的 Popover 内容
    const renderPopoverContent = (car) => (
        <div className="custom-popover">
            <Title heading={6} className="popover-title">Vehicle Details</Title>
            <div className="rows-container">
                <div className="row"><Text className="label">Plate:</Text><Text className="value"><span className="plate-style">{car.licensePlate}</span></Text></div>
                <div className="row"><Text className="label">Model:</Text><Text className="value">{car.carModel}</Text></div>
                <div className="row"><Text className="label">Speed:</Text><Text className={`value speed-text ${car.speed > 80 ? 'fast' : car.speed > 40 ? 'medium' : 'slow'}`}>{car.speed.toFixed(2)} km/h</Text></div>
                <div className="row battery-row">
                    <Text className="label">Energy:</Text>
                    <div className="battery-wrapper">
                        <div className="battery-bar">
                            <div
                                className={`battery-fill ${car.leftoverEnergy <= 20 ? 'low' : 'high'}`}
                                style={{ width: `${car.leftoverEnergy}%` }}
                            />
                        </div>
                        <span className={`battery-percent ${car.leftoverEnergy <= 20 ? 'low' : ''}`}>{car.leftoverEnergy}%</span>
                    </div>
                </div>
                <div className="row"><Text className="label">Location:</Text><Text className="value">{car.Location || '-'}</Text></div>
                <div className="row"><Text className="label">Status:</Text><Tag className="value tag-status" size="small" theme="light" type={car.status === 'online' ? 'success' : 'danger'}>{car.status || 'Unknown'}</Tag></div>
            </div>
            <Divider className="popover-divider" />
            <Text className="footer">Last update: Just now</Text>
        </div>
    );

    // 获取天气数据
    const fetchWeather = async () => {
        try {
            const res = await axiosInstance.get(`/api/weather`, { params: { city } });
            const result = await res.data;
            if (result.code === 1) {
                const weatherInfo = JSON.parse(result.data);
                const currentWeatherData = {
                    weather: weatherInfo.current.condition.code,
                    temperature: weatherInfo.current.temp_c,
                    chanceOfRain: weatherInfo.forecast.forecastday[0].day.daily_chance_of_rain,
                    description: weatherInfo.current.condition.text,
                    isDay: weatherInfo.current.is_day,
                };
                const currentLocalTime = weatherInfo.location.localtime;
                const currentHour = parseInt(currentLocalTime.split(' ')[1].split(':')[0]);
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
                    time: hourItem.time.split(' ')[1],
                    weather: hourItem.condition.code,
                    temperature: hourItem.temp_c,
                    isDay: hourItem.is_day,
                }));
                setCurrentWeather(currentWeatherData);
                setWeatherArray(weatherArrayData);
                setWeatherError(null);
            } else {
                setWeatherError(`Can't get weather Info: ${result.msg}`);
            }
        } catch (error) {
            setWeatherError('Request error, please try again!');
        }
    };

    useEffect(() => {
        fetchWeather(); // 页面加载或城市变化时获取天气数据
    }, [city]);

    const fetchCars = () => {
        axiosInstance
            .get("/vehicles/get/all")
            .then((response) => {
                setCars(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {

        const fetchMarkers = async () => {
            const newMarkersData = [
                { lat: -35.2600, lng: 149.1300 },
                { lat: -35.2800, lng: 149.1500 },
                { lat: -35.3000, lng: 149.1600 },
            ];
            setMarkers(newMarkersData);
        };

        fetchMarkers();     // 初始化地图标记点
        fetchCars();        // 初次加载车辆列表
        const intervalId = setInterval(fetchCars, 10000); // 每10秒刷新一次车辆列表

        return () => clearInterval(intervalId); // 卸载组件时清除定时器
    }, []);


    // 搜索栏搜索城市后更新状态
    const handleSearch = (query) => {
        setCity(query);
        setCoordinate({ lat: -35.2809, lng: 149.1300 });
    };

    // 点击地图标记后的操作
    const handleMarkerClick = (marker) => {
        const fetchCarInfo = async () => {
            const carInfoData = { vehicleId: '#12345678', plateNum: 'XYZ-123' }; // 模拟数据
            alert(carInfoData);
            setCarInfo(carInfoData);
        };
        fetchCarInfo();
        setSelectedCar(true);
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            {/* 左侧侧边栏：车辆列表 + 添加按钮 */}
            <div className="flex flex-col w-1/4 gap-4 flex-grow">
                <div style={{position: 'relative', display: 'inline-block'}}>
                    <div className="text-2xl font-bold">Tracking</div>
                    <div style={{position: 'absolute', right: -4, top: 0}}>
                        <CarOperationButton
                        vehicles={cars}
                        onVehiclesDeleted={(deletedPlates) => {
                            setCars((prev) => prev.filter((car) => !deletedPlates.includes(car.licensePlate)));
                        }}
                        fetchCars={fetchCars}
                        onVehicleAdded={(newCar) => setCars(prev => [...prev, newCar])}/>
                    </div>
                </div>
                <DragChat />
                <div className="bg-accent rounded-3xl p-4 flex flex-col h-screen overflow-auto">
                    {cars.length > 0 ? (
                        cars.filter(Boolean).map((car) => (
                            <Popover key={car.id} content={renderPopoverContent(car)} trigger="hover" position="right">
                                <div className="p-2 border-b border-gray-200 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                    <span className="font-semibold text-lg">{car.licensePlate}</span>
                                    <span className="text-sm text-gray-600">{car.carModel}</span>
                                </div>
                            </Popover>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">No cars available.</div>
                    )}
                </div>
            </div>

            {/* 右侧区域：天气和地图 */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="h-1/3 flex gap-4">
                    <div className="w-4/5 flex flex-col gap-4">
                        <SearchBar onSearch={handleSearch} />
                        <div className="px-6 py-4 rounded-3xl flex flex-grow bg-radial-gradient text-white justify-between items-center">
                            {weatherArray.map((weather, index) => (
                                <HourlyForecastCard
                                    key={index}
                                    time={weather.time}
                                    weather={weather.weather}
                                    temperature={weather.temperature}
                                    isDay={weather.isDay}
                                />
                            ))}
                        </div>
                    </div>
                    {weatherError ? (
                        <div className="w-1/5 bg-radial-gradient text-white rounded-3xl flex flex-col px-3 py-4 items-center">
                            <div>{city}</div>
                            <div className="p-4 text-red-300 break-words">Unable to fetch weather data.</div>
                            <div className="text-xs p-2 break-words">{weatherError}</div>
                        </div>
                    ) : (
                        <CurrentWeatherCard city={city} currentWeather={currentWeather} />
                    )}
                </div>
                <div className="h-2/3 bg-white rounded-3xl">
                    <Map lat={coordinate.lat} lng={coordinate.lng} markers={markers} onMarkerClick={handleMarkerClick} />
                </div>
            </div>
        </div>
    );
}