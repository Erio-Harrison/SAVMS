import { useState, useEffect } from "react";

import { getWeatherIcon } from "../utils/getWeatherIcons";

export default function CurrentWeatherCard({ city, currentWeather }) {
    const [weatherIcon, setWeatherIcon] = useState('');

    useEffect(() => {
        setWeatherIcon(getWeatherIcon(currentWeather.weather));
    }, [currentWeather.weather]);

    return (
        <div className="w-1/5 bg-radial-gradient text-white rounded-3xl flex flex-col px-3 py-4 items-center">
            <div>{city}</div>
            <img className="w-48 -mt-8 -mb-6" src={weatherIcon} alt=""/>
            <div>{currentWeather.weather}</div>
            <div className="text-xs p-2">Temperature: {currentWeather.temperature}°C</div>
            <div className="text-xs">Chance of Rain: {currentWeather.chanceOfRain}%</div>
        </div>
    );
}
