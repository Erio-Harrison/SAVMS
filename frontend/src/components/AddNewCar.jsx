import { useState } from 'react';

export default function AddNewCar({ SubmitNewCar }) {
    const [carInfo, setCarInfo] = useState({
        plateNumber: '',
        model: '',
        manufacturer: '',
        batteryCapacity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        SubmitNewCar(carInfo);
        setCarInfo({
            plateNumber: '',
            model: '',
            manufacturer: '',
            batteryCapacity: '',
        });
    };

    return (
        <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow">
                <label className="mb-2 ml-2 font-semibold">Plate Number</label>
                <input
                    type="text"
                    name="plateNumber"
                    value={carInfo.plateNumber}
                    onChange={handleChange}
                    className="mb-4 p-2 border rounded-full"
                    placeholder="Enter plate number"
                />

                <label className="mb-2 ml-2 font-semibold">Model</label>
                <input
                    type="text"
                    name="model"
                    value={carInfo.model}
                    onChange={handleChange}
                    className="mb-4 p-2 border rounded-full"
                    placeholder="Enter model"
                />

                <label className="mb-2 ml-2 font-semibold">Manufacturer</label>
                <input
                    type="text"
                    name="manufacturer"
                    value={carInfo.manufacturer}
                    onChange={handleChange}
                    className="mb-4 p-2 border rounded-full"
                    placeholder="Enter manufacturer"
                />

                <label className="mb-2 ml-2 font-semibold">Battery Capacity (kWh)</label>
                <input
                    type="number"
                    name="batteryCapacity"
                    value={carInfo.batteryCapacity}
                    onChange={handleChange}
                    className="mb-4 p-2 border rounded-full"
                    placeholder="Enter battery capacity"
                />
            </div>

            <button
                className="bg-black text-white p-2 rounded-full transition-colors"
                type="submit"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
}
