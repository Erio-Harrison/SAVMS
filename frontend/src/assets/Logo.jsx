import wifiSvg from "./icon/wifi.svg"
import carSvg from "./icon/car.svg"

export function Logo() {
    return (
        <div className="flex flex-col items-center mb-8 -space-y-3">
            <img src={wifiSvg} alt="Car Icon" className="w-12 h-12" />
            <img src={carSvg} alt="Car Icon" className="w-16 h-16" />
        </div>
    );
}
