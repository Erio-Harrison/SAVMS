import sunnySvg from "../assets/weather/sunnyDay.svg";
import mistDaySvg from "../assets/weather/mistDay.svg";
import mistNight from "../assets/weather/mistNight.svg";
import partlyCloudyDaySvg from "../assets/weather/partlyCloudyDay.svg";
import partlyCloudyNightSvg from "../assets/weather/partlyCloudyNight.svg";
import cloudyDaySvg from "../assets/weather/cloudyDay.svg";
import cloudyNightSvg from "../assets/weather/cloudyNight.svg";
import overcastSvg from "../assets/weather/overcast.svg";
import rainy1Svg from "../assets/weather/rainy-1.svg";
import snowy1Svg from "../assets/weather/snowy-1.svg";
import patchyRainPossibleDaySvg from "../assets/weather/patchyRainPossibleDay.svg";
import patchyRainPossibleNightSvg from "../assets/weather/patchyRainPossibleNight.svg";
import patchySnowPossibleDaySvg from "../assets/weather/patchySnowPossibleDay.svg";
import patchySnowPossibleNightSvg from "../assets/weather/patchySnowPossibleNight.svg";
import sleetSvg from "../assets/weather/sleet.svg";
import rainy3Svg from "../assets/weather/rainy-3.svg";
import snowy3Svg from "../assets/weather/snowy-3.svg";
import rainy4Svg from "../assets/weather/rainy-4.svg";
import snowy4Svg from "../assets/weather/snowy-4.svg";
import rainy5Svg from "../assets/weather/rainy-5.svg";
import snowy5Svg from "../assets/weather/snowy-5.svg";
import rainy6Svg from "../assets/weather/rainy-6.svg";
import blowingSnowSvg from "../assets/weather/blowingSnow.svg";
import thunderSvg from "../assets/weather/thunder.svg";
import weatherSvg from "../assets/weather/weather.svg";
import nightSvg from "../assets/weather/nightClear.svg";

export function getWeatherIcon(weather, day) {
    if(day){
        switch (weather) {
            case 1000:
                return sunnySvg;
            case 1003:
                return partlyCloudyDaySvg;
            case 1006:
                return cloudyDaySvg;
            case 1009:
                return overcastSvg;
            case 1030:
                return mistDaySvg;
            case 1063:
                return patchyRainPossibleDaySvg;
            case 1066:
                return patchySnowPossibleDaySvg;
            case 1069:
                return sleetSvg;
            case 1072:
                return patchyRainPossibleDaySvg;
            case 1087:
                return thunderSvg;
            case 1114:
                return blowingSnowSvg;
            case 1117:
                return blowingSnowSvg;
            case 1135:
                return cloudyDaySvg;
            case 1147:
                return cloudyDaySvg;
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
                return blowingSnowSvg;
            case 1225:
                return blowingSnowSvg;
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
    } else{
        switch (weather) {
            case 1000:
                return nightSvg;
            case 1003:
                return partlyCloudyNightSvg;
            case 1006:
                return cloudyNightSvg;
            case 1009:
                return overcastSvg;
            case 1030:
                return mistNight;
            case 1063:
                return patchyRainPossibleNightSvg;
            case 1066:
                return patchySnowPossibleNightSvg;
            case 1069:
                return sleetSvg;
            case 1072:
                return patchyRainPossibleDaySvg;
            case 1087:
                return thunderSvg;
            case 1114:
                return blowingSnowSvg;
            case 1117:
                return blowingSnowSvg;
            case 1135:
                return cloudyNightSvg;
            case 1147:
                return cloudyNightSvg;
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
                return blowingSnowSvg;
            case 1225:
                return blowingSnowSvg;
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

}