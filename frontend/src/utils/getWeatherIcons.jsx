import sunnySvg from "../assets/weather/sunny.svg";
import cloudySvg from "../assets/weather/cloudy.svg";
import rainy1Svg from "../assets/weather/rainy-1.svg";
import snowy1Svg from "../assets/weather/snowy-1.svg";
import rainy2Svg from "../assets/weather/rainy-2.svg";
import snowy2Svg from "../assets/weather/snowy-2.svg";
import rainy3Svg from "../assets/weather/rainy-3.svg";
import snowy3Svg from "../assets/weather/snowy-3.svg";
import rainy4Svg from "../assets/weather/rainy-4.svg";
import snowy4Svg from "../assets/weather/snowy-4.svg";
import rainy5Svg from "../assets/weather/rainy-5.svg";
import snowy5Svg from "../assets/weather/snowy-5.svg";
import rainy6Svg from "../assets/weather/rainy-6.svg";
import snowy6Svg from "../assets/weather/snowy-6.svg";
import thunderSvg from "../assets/weather/thunder.svg";
import weatherSvg from "../assets/weather/weather.svg";
import partlyCloudyDay from "../assets/weather/cloudy-day-2.svg";
import partlyCloudyNight from "../assets/weather/cloudy-night-2.svg";
import nightSvg from "../assets/weather/sunny.svg";

export function getWeatherIcon(weather) {
    switch (weather) {
        case 1000:
            return sunnySvg;
        case 1003:
            return partlyCloudyDay;
        case 1006:
            return cloudySvg;
        case 1009:
            return cloudySvg;
        case 1030:
            return cloudySvg;
        case 1063:
            return rainy2Svg;
        case 1066:
            return snowy2Svg;
        case 1069:
            return snowy2Svg;
        case 1072:
            return rainy2Svg;
        case 1087:
            return thunderSvg;
        case 1114:
            return snowy6Svg;
        case 1117:
            return snowy6Svg;
        case 1135:
            return cloudySvg;
        case 1147:
            return cloudySvg;
        case 1150:
            return rainy4Svg;
        case 1153:
            return rainy4Svg;
        case 1168:
            return rainy4Svg;
        case 1171:
            return rainy4Svg;
        case 1180:
            return rainy4Svg;
        case 1183:
            return rainy4Svg;
        case 1186:
            return rainy5Svg;
        case 1189:
            return rainy5Svg;
        case 1192:
            return rainy6Svg;
        case 1195:
            return rainy6Svg;
        case 1198:
            return snowy4Svg;
        case 1201:
            return snowy5Svg;
        case 1204:
            return snowy4Svg;
        case 1207:
            return snowy5Svg;
        case 1210:
            return snowy4Svg;
        case 1213:
            return snowy4Svg;
        case 1216:
            return snowy5Svg;
        case 1219:
            return snowy5Svg;
        case 1222:
            return snowy6Svg;
        case 1225:
            return snowy6Svg;
        case 1237:
            return rainy4Svg;
        case 1240:
            return rainy5Svg;
        case 1243:
            return rainy6Svg;
        case 1246:
            return rainy6Svg;
        case 1249:
            return snowy2Svg;
        case 1252:
            return snowy1Svg;
        case 1255:
            return snowy3Svg;
        case 1258:
            return snowy5Svg;
        case 1261:
            return sunnySvg;
        case 1264:
            return rainy6Svg;
        case 1273:
            return thunderSvg;
        case 1276:
            return thunderSvg;
        case 1279:
            return thunderSvg;
        case 1282:
            return thunderSvg;
        default:
            return weatherSvg;

    }
}