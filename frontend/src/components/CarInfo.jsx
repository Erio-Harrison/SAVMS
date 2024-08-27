import numberPlate from "../assets/number-plate.png";

export default function CarInfo({ carInfo }) {
    return (
        <div className="flex flex-col flex-grow">
            <div className="bg-black text-white font-bold p-2 rounded-full text-center mb-4">
                {carInfo.vehicleId}
            </div>
            <div className="h-12 w-24 text-black text-lg font-semibold p-2 mb-4 flex items-center justify-center rounded-md" style={{ backgroundImage: `url(${numberPlate})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {carInfo.plateNum}
            </div>
            <div className="bg-secondary px-6 py-4 rounded-3xl flex-grow">
                <div className="font-semibold">Vehicle Specifications</div>
                <div className="mb-2">info</div>
                <div className="font-semibold">Operational Status</div>
                <div className="mb-2">info</div>
            </div>
        </div>
    );
}
