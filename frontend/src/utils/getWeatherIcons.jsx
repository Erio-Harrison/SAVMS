import sunnySvg from "../assets/weather/sunny.svg";
import cloudySvg from "../assets/weather/cloudy.svg";
import rainy1Svg from "../assets/weather/rainy-1.svg";
import snowy1Svg from "../assets/weather/snowy-1.svg";

export function getWeatherIcon(weather) {
    switch (weather) {
        case 'Sunny':
            return sunnySvg;
        case 'Rainy':
            return rainy1Svg;
        case 'Cloudy':
            return cloudySvg;
        case 'Snowy':
            return snowy1Svg;
    }
}