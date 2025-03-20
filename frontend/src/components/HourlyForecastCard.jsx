import { useState, useEffect } from "react";

import { getWeatherIcon } from "../utils/getWeatherIcons";

export default function HourlyForecastCard({ time, weather, temperature, isDay }) {
    const [weatherIcon, setWeatherIcon] = useState('');

    useEffect(() => {
        setWeatherIcon(getWeatherIcon(weather,isDay));
    }, [weather]);

    return (
        <div className="flex flex-col items-center">
            <div className="-mb-2">{time}</div>
            <img className="w-32 -mx-2" src={weatherIcon} alt=""/>
            <div className="-mt-2">{temperature}°C</div>
        </div>
    );
}
